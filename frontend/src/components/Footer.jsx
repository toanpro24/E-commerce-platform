import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import "./Footer.css";

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h4>{f.brand}</h4>
          <p>{f.brandText}</p>
        </div>
        <div className="footer-col">
          <h4>{f.navTitle}</h4>
          <Link to="/">{t.nav.home}</Link>
          <Link to="/about">{t.nav.about}</Link>
          <Link to="/products">{t.nav.products}</Link>
          <Link to="/contact">{t.nav.contact}</Link>
        </div>
        <div className="footer-col">
          <h4>{f.productsTitle}</h4>
          <span>{f.product1}</span>
          <span>{f.product2}</span>
          <span>{f.product3}</span>
          <span>{f.product4}</span>
        </div>
        <div className="footer-col">
          <h4>{f.contactTitle}</h4>
          <p>info@thuanphat.com</p>
          <p>+84 24 1234 5678</p>
          <p>Ba Dinh, Hanoi, Vietnam</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {f.copyright}</p>
      </div>
    </footer>
  );
}
