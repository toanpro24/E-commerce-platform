import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LanguageContext";
import { languages } from "../i18n";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { pathname } = useLocation();
  const { lang, switchLang, t } = useLang();
  const { isAuthenticated, user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/products", label: t.nav.products },
    { to: "/contact", label: t.nav.contact },
  ];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setDropdownOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user
    ? (user.username?.[0] || "U").toUpperCase()
    : "";

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Thuan Phat
      </Link>

      <button
        className={`navbar-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navbar-links ${menuOpen ? "show" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={pathname === link.to ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        <div className="lang-switcher">
          {languages.map((l) => (
            <button
              key={l.code}
              className={lang === l.code ? "active" : ""}
              onClick={() => switchLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {isAuthenticated ? (
          <div className="navbar-auth">
            <Link
              to="/cart"
              className={`navbar-cart-icon-link ${pathname === "/cart" ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="navbar-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </Link>
            <Link
              to="/orders"
              className={`navbar-orders-link ${pathname === "/orders" ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.myOrders}
            </Link>

            <div className="navbar-account" ref={dropdownRef}>
              <button
                className="navbar-avatar-btn"
                onClick={() => setDropdownOpen((o) => !o)}
              >
                <span className="navbar-avatar">{initials}</span>
                <svg
                  className={`navbar-caret ${dropdownOpen ? "open" : ""}`}
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    <span className="navbar-dropdown-name">{user.username}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="navbar-dropdown-item"
                    onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}
                  >
                    {t.profile.viewProfile}
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="navbar-dropdown-item"
                      onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}
                    >
                      {t.admin.dashboard}
                    </Link>
                  )}
                  <button
                    className="navbar-dropdown-item navbar-dropdown-logout"
                    onClick={handleLogout}
                  >
                    {t.nav.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="navbar-cta"
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.login}
          </Link>
        )}
      </div>
    </nav>
  );
}
