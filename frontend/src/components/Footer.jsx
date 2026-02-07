import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h4>ShopHub</h4>
          <p>Your one-stop shop for everything you need. Quality products at great prices.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/">All Products</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/profile">My Profile</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>support@shophub.com</p>
          <p>1-800-SHOPHUB</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 ShopHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
