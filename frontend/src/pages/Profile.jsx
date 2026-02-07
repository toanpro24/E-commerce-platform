import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="profile-page page-enter">
      <h2>My Profile</h2>
      <div className="profile-card">
        <div className="profile-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h3>{user.username}</h3>
          <span className={`profile-role role-${user.role}`}>{user.role}</span>
        </div>
      </div>
      <div className="profile-links">
        <Link to="/orders" className="profile-link-card">
          <span className="profile-link-icon">&#128230;</span>
          <div>
            <strong>My Orders</strong>
            <p>View your order history</p>
          </div>
        </Link>
        <Link to="/cart" className="profile-link-card">
          <span className="profile-link-icon">&#128722;</span>
          <div>
            <strong>Shopping Cart</strong>
            <p>View items in your cart</p>
          </div>
        </Link>
        {user.role === "admin" && (
          <Link to="/admin" className="profile-link-card">
            <span className="profile-link-icon">&#9881;</span>
            <div>
              <strong>Admin Panel</strong>
              <p>Manage products and orders</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
