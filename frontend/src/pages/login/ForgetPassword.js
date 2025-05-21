import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import parachute from "../../assets/img/Unsubscribe.png";

function ForgetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/auth/password-reset/", { email });
      setSuccess(true);

      // 2 секундтан кейін login бетіне қайта бағыттау
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("There was a mistake. The Email may be correct or unregistered.");
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
                <div className="p-4 text-center">
                  <img
                    src={parachute}
                    alt="Parachute"
                    className="mb-3"
                    style={{ width: "180px" }}
                  />
                  <p className="mb-4">Enter your email address below</p>

                  <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-center mb-4 gap-2">
                      <input
                        type="email"
                        className="form-control text-center"
                        style={{ width: "350px", fontSize: "18px" }}
                        placeholder="youremail@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && (
                      <div className="alert alert-success">
                        ✅ The recovery link was sent to the mail!
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Submit"}
                    </button>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
