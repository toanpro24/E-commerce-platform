import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ShopHub
      </Link>

      <div className="navbar-search">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = e.target.search.value.trim();
            if (q) navigate(`/?search=${encodeURIComponent(q)}`);
          }}
        >
          <input type="text" name="search" placeholder="Search products..." />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-welcome">Hi, {user.username}</span>
            <Link to="/orders">My Orders</Link>
            {user.role === "admin" && (
              <Link to="/admin" className="admin-link">
                Admin
              </Link>
            )}
            <Link to="/cart" className="cart-link">
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/cart" className="cart-link">
              Cart
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
