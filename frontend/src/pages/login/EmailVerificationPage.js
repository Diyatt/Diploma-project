// ✅ VerifyEmailPage.js — дұрысталған нұсқасы
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import api from "../../utils/api";
import parachute from "../../assets/img/Delivery.png";

function VerifyEmailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useUser();
  const email = state?.email;

  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newDigits = [...codeDigits];
      newDigits[index] = value;
      setCodeDigits(newDigits);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fullCode = codeDigits.join("");

    try {
      // First verify the email
      const verifyRes = await api.post("/auth/verify-email/", {
        email,
        code: fullCode,
      });

      // Get the tokens from verification response
      const { access, refresh } = verifyRes.data;

      // Set the authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Get the complete user data
      const userRes = await api.get("/users/me/");
      
      // Combine all user data with tokens
      const userData = {
        ...userRes.data,
        token: access,
        refresh: refresh
      };

      // Store in localStorage and context
      localStorage.setItem('userData', JSON.stringify(userData));
      login(userData);

      navigate("/home");
    } catch (err) {
      console.error("Verification error:", err);
      setError("Code is incorrect or expired!");
      setCodeDigits(["", "", "", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
  setError(null);
  setLoading(true);

  try {
    await api.post("/auth/resend-verification/", { email });
    setCodeDigits(["", "", "", "", "", ""]);
    alert("Код повторно отправлен на почту!");
  } catch (err) {
    setError("Не удалось повторно отправить код.");
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
                  <p className="mb-4">
                    We sent a one-time code to your email address.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-center mb-4 gap-2">
                      {codeDigits.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength="1"
                          className="form-control text-center"
                          style={{ width: "50px", fontSize: "24px" }}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          required
                        />
                      ))}
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Checking..." : "Submit"}
                    </button>
                  </form>
                <p className="mt-3">
                    Didn't get a code?{" "}
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={handleResend}
                      disabled={loading}
                    >
                      Resend
                    </button>
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
