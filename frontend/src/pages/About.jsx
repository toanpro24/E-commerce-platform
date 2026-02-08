import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import "./About.css";

export default function About() {
  const { t } = useLang();
  const a = t.about;

  return (
    <div className="about page-enter">
      <section className="about-hero">
        <h1>{a.heroTitle}</h1>
        <p>{a.heroSubtitle}</p>
      </section>

      <section className="about-story">
        <div className="about-story-inner">
          <div className="story-text">
            <h2>{a.storyTitle}</h2>
            <p>{a.storyP1}</p>
            <p>{a.storyP2}</p>
          </div>
          <div className="story-stats">
            <div className="stat">
              <span className="stat-number">{a.stat1Number}</span>
              <span className="stat-label">{a.stat1Label}</span>
            </div>
            <div className="stat">
              <span className="stat-number">{a.stat2Number}</span>
              <span className="stat-label">{a.stat2Label}</span>
            </div>
            <div className="stat">
              <span className="stat-number">{a.stat3Number}</span>
              <span className="stat-label">{a.stat3Label}</span>
            </div>
            <div className="stat">
              <span className="stat-number">{a.stat4Number}</span>
              <span className="stat-label">{a.stat4Label}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-vision">
        <div className="mission-vision-inner">
          <div className="mv-card">
            <h2>{a.missionTitle}</h2>
            <p>{a.missionText}</p>
          </div>
          <div className="mv-card">
            <h2>{a.visionTitle}</h2>
            <p>{a.visionText}</p>
          </div>
        </div>
      </section>

      <section className="why-us">
        <div className="why-us-inner">
          <h2>{a.whyTitle}</h2>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-number">01</div>
              <h3>{a.why1Title}</h3>
              <p>{a.why1Text}</p>
            </div>
            <div className="why-card">
              <div className="why-number">02</div>
              <h3>{a.why2Title}</h3>
              <p>{a.why2Text}</p>
            </div>
            <div className="why-card">
              <div className="why-number">03</div>
              <h3>{a.why3Title}</h3>
              <p>{a.why3Text}</p>
            </div>
            <div className="why-card">
              <div className="why-number">04</div>
              <h3>{a.why4Title}</h3>
              <p>{a.why4Text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>{a.ctaTitle}</h2>
        <p>{a.ctaText}</p>
        <Link to="/contact" className="about-cta-btn">
          {a.ctaBtn}
        </Link>
      </section>
    </div>
  );
}
