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
      const res = await api.post("/auth/verify-email/", {
        email,
        code: fullCode,
      });

      const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
      const verifiedUser = {
        ...res.data,
        token: storedUserData.token,
        refresh: storedUserData.refresh,
      };

      login(verifiedUser); // ✅ Барлық дерек (id, username, email, token...) сақталады
      navigate("/home");
    } catch (err) {
      setError("Код дұрыс емес немесе жарамсыз.");
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
                    Didn’t get a code? <a href="#">Resend</a>
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
