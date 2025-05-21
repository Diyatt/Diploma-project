import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import parachute from "../../assets/img/Unsubscribe.png";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // token from the URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/auth/password-reset-confirm/${token}/`, {
        password,
        confirm_password: confirmPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Reset failed. The token may be invalid or expired.");
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
                  <p className="mb-4">Enter your new password</p>

                  <form onSubmit={handleSubmit}>
                    <div className="d-flex flex-column align-items-center gap-3 mb-4">
                      <input
                        type="password"
                        className="form-control text-center"
                        style={{ width: "350px", fontSize: "18px" }}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        className="form-control text-center"
                        style={{ width: "350px", fontSize: "18px" }}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && (
                      <div className="alert alert-success">
                        ✅ Password successfully reset!
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
