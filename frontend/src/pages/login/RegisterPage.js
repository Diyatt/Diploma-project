import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import api from "../../utils/api";
import logo from "../../assets/img/Logo-reg.png";
import regBg from "../../assets/img/reg_bg.png";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError("Құпиясөздер сәйкес келмейді");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register/", formData);
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      console.error("Тіркелу қатесі:", err);
      setError("Тіркелу кезінде қате болды.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-8 col-lg-8">
            <div className="card">
              <div className="card-body">
                <div className="row" style={{ alignItems: "center" }}>
                  <div className="col-md-6">
                    <div className="p-3 login-content">
                      <img src={logo} alt="Logo" style={{ maxWidth: "140px" }} />
                      <h4 className="mt-3">Create an account</h4>
                      <p>
                        Already have an account?{" "}
                        <Link to="/login" className="form-check-label">Log in</Link>
                      </p>

                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label className="form-label">Username</label>
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Password</label>
                              <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Confirm Password</label>
                              <input
                                type="password"
                                name="confirm_password"
                                className="form-control"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <small className="mb-3 d-block">
                          Use 8 or more characters with a mix of letters, numbers & symbols
                        </small>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <button type="submit" className="w-100 mt-3 btn btn-primary" disabled={loading}>
                          {loading ? "Creating..." : "Create an account"}
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <img src={regBg} className="w-100" alt="Register Background" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
