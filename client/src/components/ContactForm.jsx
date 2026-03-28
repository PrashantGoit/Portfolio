import { useState } from "react";
import { contactAPI } from "../api";

const INITIAL = { name: "", email: "", message: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";
  if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Please enter a valid email address.";
  if (!form.message.trim() || form.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate(form);
  if (Object.keys(validationErrors).length) {
    setErrors(validationErrors);
    return;
  }

  // 🧠 Confirmation BEFORE sending
  const confirmSend = window.confirm(
    "To prevent spam, you can send a message only once every 15 minutes.\nDo you want to continue?"
  );

  if (!confirmSend) return; // ❌ Stop if user cancels

  setStatus("loading");
  setServerError("");

  try {
    await contactAPI.submit(form);

    setStatus("success");
    setForm(INITIAL);

    // 🧠 Optional: store last sent time (for smarter UX later)
    localStorage.setItem("lastSent", Date.now());

    // Reset to idle after 4 seconds
    setTimeout(() => setStatus("idle"), 4000);

  } catch (err) {
    setStatus("error");

    if (err.response?.data?.errors) {
      setErrors(err.response.data.errors);
      setStatus("idle");
    } else {
      setServerError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  }
};

  if (status === "success") {
    return (
      <div style={{
        textAlign: "center", padding: "3rem",
        border: "1px solid rgba(16,185,129,0.3)",
        borderRadius: "8px", background: "rgba(16,185,129,0.06)",
        animation: "fadeIn 0.4s ease",
      }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
        <p style={{ color: "#10b981", fontFamily: "'Space Mono', monospace", fontSize: "0.9rem" }}>
          Message sent successfully!
        </p>
        <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginTop: "0.5rem" }}>
          I'll get back to you within 24 hours.
        </p>
        <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} noValidate>
      {serverError && (
        <div style={{
          padding: "0.75rem 1rem", background: "rgba(248,113,113,0.1)",
          border: "1px solid rgba(248,113,113,0.3)", borderRadius: "4px",
          color: "#f87171", fontSize: "0.8rem", fontFamily: "'Space Mono', monospace",
        }}>
          {serverError}
        </div>
      )}

      <div className="field">
        <label className="field-label">Name</label>
        <input
          className="field-input"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          autoComplete="name"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="field">
        <label className="field-label">Email</label>
        <input
          className="field-input"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          autoComplete="email"
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="field">
        <label className="field-label">Message</label>
        <textarea
          className="field-input"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project..."
          rows={5}
          style={{ minHeight: "130px" }}
        />
        {errors.message && <span className="field-error">{errors.message}</span>}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          width: "100%", justifyContent: "center", padding: "1rem",
          background: status === "loading"
            ? "rgba(0,212,255,0.3)"
            : "linear-gradient(135deg, var(--blue), var(--purple))",
          color: "#fff", fontFamily: "Inter, sans-serif",
          fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", border: "none", borderRadius: "4px",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: "0.5rem",
          boxShadow: "0 0 24px var(--blue-glow)",
          transition: "all 0.3s",
        }}
      >
        {status === "loading" ? (
          <>
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
            Sending...
          </>
        ) : (
          "Send Message ⟶"
        )}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
