import { useState } from "react";
import api from "../api/client";
import { useLang } from "../context/LanguageContext";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLang();
  const c = t.contact;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await api.post("/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page page-enter">
      <section className="contact-hero">
        <h1>{c.heroTitle}</h1>
        <p>{c.heroSubtitle}</p>
      </section>

      <div className="contact-body">
        <div className="contact-form-section">
          <h2>{c.formTitle}</h2>

          {status === "success" && (
            <div className="contact-alert success">{c.successMsg}</div>
          )}

          {status === "error" && (
            <div className="contact-alert error">{c.errorMsg}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">{c.labelName}</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder={c.placeholderName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">{c.labelEmail}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder={c.placeholderEmail}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">{c.labelPhone}</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={c.placeholderPhone}
                />
              </div>
              <div className="form-group">
                <label htmlFor="company">{c.labelCompany}</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  placeholder={c.placeholderCompany}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">{c.labelMessage}</label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                value={form.message}
                onChange={handleChange}
                placeholder={c.placeholderMessage}
              />
            </div>

            <button type="submit" className="contact-submit" disabled={submitting}>
              {submitting ? c.submitting : c.submitBtn}
            </button>
          </form>
        </div>

        <div className="contact-info-section">
          <h2>{c.infoTitle}</h2>

          <div className="info-card">
            <div>
              <h3>{c.addressTitle}</h3>
              <p>{c.addressText.split("\n").map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}</p>
            </div>
          </div>

          <div className="info-card">
            <div>
              <h3>{c.phoneTitle}</h3>
              <p>{c.phoneText}</p>
            </div>
          </div>

          <div className="info-card">
            <div>
              <h3>{c.emailTitle}</h3>
              <p>{c.emailText}</p>
            </div>
          </div>

          <div className="info-card">
            <div>
              <h3>{c.hoursTitle}</h3>
              <p>{c.hoursText.split("\n").map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
