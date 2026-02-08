import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { languages } from "../i18n";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { lang, switchLang, t } = useLang();

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/products", label: t.nav.products },
    { to: "/contact", label: t.nav.contact },
  ];

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

        <Link
          to="/contact"
          className="navbar-cta"
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.cta}
        </Link>
      </div>
    </nav>
  );
}
