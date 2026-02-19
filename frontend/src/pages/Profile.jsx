import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, updateMe } from "../api/auth";
import { getMyOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { useToast } from "../components/Toast";
import Spinner from "../components/Spinner";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useLang();
  const p = t.profile;
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    Promise.all([getMe(), getMyOrders()])
      .then(([me, orders]) => {
        setProfile(me);
        setOrderCount(orders.length);
      })
      .catch(() => navigate("/login", { replace: true }))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const startEdit = () => {
    setForm({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone || "",
      address: profile.address || "",
      city: profile.city || "",
      zip_code: profile.zip_code || "",
    });
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = async () => {
    setSaving(true);
    try {
      const updated = await updateMe(form);
      setProfile(updated);
      setEditing(false);
      toast.success(p.profileUpdated);
    } catch {
      toast.error(p.profileUpdateError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (!profile) return null;

  const initials =
    (profile.last_name?.[0] || "") + (profile.first_name?.[0] || "");

  const memberDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
      })
    : "—";

  const fields = [
    { key: "last_name", label: p.lastName },
    { key: "first_name", label: p.firstName },
    { key: "username", label: p.username, readOnly: true },
    { key: "email", label: p.email, readOnly: true },
    { key: "phone", label: p.phone },
    { key: "address", label: p.address },
    { key: "city", label: p.city },
    { key: "zip_code", label: p.zipCode },
  ];

  return (
    <div className="profile-page page-enter">
      <div className="profile-header">
        <div className="profile-avatar-lg">{initials.toUpperCase()}</div>
        <h1>{profile.last_name} {profile.first_name}</h1>
        <span className="profile-role">{profile.role}</span>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-number">{orderCount}</span>
          <span className="profile-stat-label">{p.totalOrders}</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-number">{memberDate}</span>
          <span className="profile-stat-label">{p.memberSince}</span>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-card-header">
          <h2>{p.personalInfo}</h2>
          {!editing && (
            <button className="profile-edit-btn" onClick={startEdit}>
              {p.editProfile}
            </button>
          )}
        </div>
        <div className="profile-fields">
          {fields.map((f) => (
            <div className="profile-field" key={f.key}>
              <span className="profile-label">{f.label}</span>
              {editing && !f.readOnly ? (
                <input
                  className="profile-input"
                  value={form[f.key] || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                />
              ) : (
                <span className="profile-value">
                  {profile[f.key] || "—"}
                </span>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <div className="profile-edit-actions">
            <button
              className="profile-save-btn"
              onClick={saveEdit}
              disabled={saving}
            >
              {saving ? "..." : p.saveProfile}
            </button>
            <button className="profile-cancel-btn" onClick={cancelEdit}>
              {p.cancelEdit}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
