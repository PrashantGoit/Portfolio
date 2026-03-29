require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;
const usingOnboardingSender = (process.env.EMAIL_FROM || "").includes("onboarding@resend.dev");

if (!process.env.RESEND_API_KEY) {
  console.warn("[Email] RESEND_API_KEY is not set. Contact emails will not be sent.");
}

if (!process.env.EMAIL_TO) {
  console.warn("[Email] EMAIL_TO is not set. Contact emails have no destination.");
}

if (usingOnboardingSender) {
  console.warn(
    "[Email] EMAIL_FROM is using Resend's onboarding sender. This only delivers to your Resend account email until you verify a sending domain."
  );
}

// ── Connect Database ──────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────
app.use("/api/contact", contactRoutes);

// ── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[Error]", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
