import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import "./Home.css";

export default function Home() {
  const { t } = useLang();
  const h = t.home;

  return (
    <div className="home page-enter">
      <section className="hero">
        <div className="hero-content">
          <h1>{h.heroTitle}</h1>
          <p>{h.heroText}</p>
          <div className="hero-actions">
            <Link to="/contact" className="hero-btn primary">
              {h.ctaPrimary}
            </Link>
            <Link to="/products" className="hero-btn secondary">
              {h.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="highlights">
        <div className="highlights-inner">
          <h2>{h.whyTitle}</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <h3>{h.why1Title}</h3>
              <p>{h.why1Text}</p>
            </div>
            <div className="highlight-card">
              <h3>{h.why2Title}</h3>
              <p>{h.why2Text}</p>
            </div>
            <div className="highlight-card">
              <h3>{h.why3Title}</h3>
              <p>{h.why3Text}</p>
            </div>
            <div className="highlight-card">
              <h3>{h.why4Title}</h3>
              <p>{h.why4Text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="product-preview">
        <div className="product-preview-inner">
          <h2>{h.categoriesTitle}</h2>
          <p className="section-subtitle">{h.categoriesSubtitle}</p>
          <div className="preview-grid">
            <Link to="/products" className="preview-card">
              <h3>{h.cat1Title}</h3>
              <p>{h.cat1Text}</p>
            </Link>
            <Link to="/products" className="preview-card">
              <h3>{h.cat2Title}</h3>
              <p>{h.cat2Text}</p>
            </Link>
            <Link to="/products" className="preview-card">
              <h3>{h.cat3Title}</h3>
              <p>{h.cat3Text}</p>
            </Link>
            <Link to="/products" className="preview-card">
              <h3>{h.cat4Title}</h3>
              <p>{h.cat4Text}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-inner">
          <h2>{h.bannerTitle}</h2>
          <p>{h.bannerText}</p>
          <Link to="/contact" className="cta-btn">
            {h.bannerCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
