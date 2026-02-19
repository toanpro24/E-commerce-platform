import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { getProducts } from "../api/products";
import { localName } from "../utils/localize";
import { Globe, FlaskConical, Truck, BadgeDollarSign } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import "./Home.css";

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN").format(n) + " VND";

export default function Home() {
  const { t, lang } = useLang();
  const h = t.home;
  const containerRef = useRef(null);
  const [featured, setFeatured] = useState([]);

  useScrollReveal(containerRef);

  useEffect(() => {
    getProducts()
      .then((products) => setFeatured(products.slice(0, 4)))
      .catch(() => {});
  }, []);

  const isVideo = (src) => src?.toLowerCase().endsWith(".mp4");

  return (
    <div className="home page-enter" ref={containerRef}>
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
            <div className="highlight-card" data-reveal>
              <div className="highlight-icon"><Globe size={28} /></div>
              <h3>{h.why1Title}</h3>
              <p>{h.why1Text}</p>
            </div>
            <div className="highlight-card" data-reveal style={{ transitionDelay: "0.1s" }}>
              <div className="highlight-icon"><FlaskConical size={28} /></div>
              <h3>{h.why2Title}</h3>
              <p>{h.why2Text}</p>
            </div>
            <div className="highlight-card" data-reveal style={{ transitionDelay: "0.2s" }}>
              <div className="highlight-icon"><Truck size={28} /></div>
              <h3>{h.why3Title}</h3>
              <p>{h.why3Text}</p>
            </div>
            <div className="highlight-card" data-reveal style={{ transitionDelay: "0.3s" }}>
              <div className="highlight-icon"><BadgeDollarSign size={28} /></div>
              <h3>{h.why4Title}</h3>
              <p>{h.why4Text}</p>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="featured-products">
          <div className="featured-inner">
            <h2>{h.featuredTitle}</h2>
            <p className="section-subtitle">{h.featuredSubtitle}</p>
            <div className="featured-grid">
              {featured.map((p, i) => (
                <Link
                  to={`/products/${p.id}`}
                  className="featured-card"
                  key={p.id}
                  data-reveal
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="featured-card-img">
                    {p.image && (isVideo(p.image) ? (
                      <video
                        src={`http://localhost:8000/images/${encodeURIComponent(p.image)}`}
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img
                        src={`http://localhost:8000/images/${encodeURIComponent(p.image)}`}
                        alt={p.name}
                      />
                    ))}
                  </div>
                  <div className="featured-card-body">
                    <h3>{localName(p, lang)}</h3>
                    <span className="featured-card-price">{formatVND(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/products" className="featured-view-all">
              {h.viewAll} &rarr;
            </Link>
          </div>
        </section>
      )}

      <section className="product-preview">
        <div className="product-preview-inner">
          <h2>{h.categoriesTitle}</h2>
          <p className="section-subtitle">{h.categoriesSubtitle}</p>
          <div className="preview-grid">
            <Link to="/products?category=1" className="preview-card" data-reveal>
              <h3>{h.cat1Title}</h3>
              <p>{h.cat1Text}</p>
            </Link>
            <Link to="/products?category=2" className="preview-card" data-reveal style={{ transitionDelay: "0.1s" }}>
              <h3>{h.cat2Title}</h3>
              <p>{h.cat2Text}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-banner" data-reveal="scale">
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
