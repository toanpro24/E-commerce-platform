import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { registerUser } from "../api/auth";
import "./Login.css";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip_code: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();
  const a = t.auth;
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await registerUser(form);
      login(data.access_token, data.username, data.role);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || a.registerError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <h1>{a.registerTitle}</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-row">
            <div>
              <label>{a.lastName} *</label>
              <input value={form.last_name} onChange={update("last_name")} required />
            </div>
            <div>
              <label>{a.firstName} *</label>
              <input value={form.first_name} onChange={update("first_name")} required />
            </div>
          </div>

          <label>{a.email}</label>
          <input type="email" value={form.email} onChange={update("email")} />

          <label>{a.phone}</label>
          <input value={form.phone} onChange={update("phone")} />

          <label>{a.address}</label>
          <input value={form.address} onChange={update("address")} />

          <div className="auth-row">
            <div>
              <label>{a.city}</label>
              <input value={form.city} onChange={update("city")} />
            </div>
            <div>
              <label>{a.zipCode}</label>
              <input value={form.zip_code} onChange={update("zip_code")} />
            </div>
          </div>

          <label>{a.username} *</label>
          <input value={form.username} onChange={update("username")} required />

          <label>{a.password} *</label>
          <input type="password" value={form.password} onChange={update("password")} required />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "..." : a.registerBtn}
          </button>
        </form>
        <p className="auth-switch">
          {a.hasAccount}{" "}
          <Link to="/login">{a.loginLink}</Link>
        </p>
      </div>
    </div>
  );
}
