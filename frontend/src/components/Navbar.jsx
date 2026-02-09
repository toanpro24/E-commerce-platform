import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { languages } from "../i18n";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { lang, switchLang, t } = useLang();
  const { isAuthenticated, user, logout } = useAuth();
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
    navigate("/");
  };

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
              className={`navbar-cart-link ${pathname === "/cart" ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.cart}
            </Link>
            <Link
              to="/orders"
              className={`navbar-orders-link ${pathname === "/orders" ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.myOrders}
            </Link>
            <span className="navbar-user">{user.username}</span>
            <button className="navbar-logout" onClick={handleLogout}>
              {t.nav.logout}
            </button>
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
