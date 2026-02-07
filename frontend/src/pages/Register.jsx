import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    zip_code: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form auth-form-wide">
        <h2>Create Account</h2>
        {error && <p className="auth-error">{error}</p>}
        <div className="auth-row">
          <label>
            First Name
            <input type="text" value={form.first_name} onChange={update("first_name")} required />
          </label>
          <label>
            Last Name
            <input type="text" value={form.last_name} onChange={update("last_name")} required />
          </label>
        </div>
        <label>
          Username
          <input type="text" value={form.username} onChange={update("username")} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={update("password")} required />
        </label>
        <label>
          Phone
          <input type="text" value={form.phone} onChange={update("phone")} />
        </label>
        <label>
          Address
          <input type="text" value={form.address} onChange={update("address")} />
        </label>
        <div className="auth-row">
          <label>
            City
            <input type="text" value={form.city} onChange={update("city")} />
          </label>
          <label>
            ZIP Code
            <input type="text" value={form.zip_code} onChange={update("zip_code")} />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
