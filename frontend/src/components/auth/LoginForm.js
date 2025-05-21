import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";

const LoginForm = () => {
  const { login } = useUser();               // 🔐 login функциясын аламыз
  const navigate = useNavigate();

  const [username, setUsername] = useState("");  // немесе email орнына username қолданыңыз
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 🔐 Логин API сұранысы
      const res = await api.post("/auth/login/", {
        username, password,
      });

      const { access, refresh } = res.data;

      // 🔁 Қолданушы туралы мәлімет алу (егер бөлек болса /me немесе /profile)
      const userRes = await api.get("/users/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const userData = {
        ...userRes.data,
        token: access,
        refresh,
      };

      login(userData);       // ⏺ Контекстке сақталады
      navigate("/home");     // 🏠 Үй бетіне бағыттаймыз
    } catch (err) {
      console.error("Логин қатесі:", err);
      setError("Қате: дұрыс емес логин немесе құпиясөз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-20 login-content">
      <h4 className="text-center">Welcome back</h4>
      <p className="text-center">We’re so excited to see you again!</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <Link to="/forget-password" className="form-check-label">Forget your password?</Link> 
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="w-100 btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="text-center">
        Don’t have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginForm;
