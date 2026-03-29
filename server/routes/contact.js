const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const adminAuth = require("../middleware/adminAuth");
const contactRateLimit = require("../middleware/contactRateLimit");
const { sendContactEmail } = require("../config/mailer");

// ── Validation helper ─────────────────────────────────────────────────────
const validate = ({ name, email, message }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email is required.";
  if (!message || message.trim().length < 10) errors.message = "Message must be at least 10 characters.";
  return errors;
};

// ── POST /api/contact ─────────────────────────────────────────────────────
// Public: Submit a contact message
router.post("/", contactRateLimit, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    const errors = validate({ name, email, message });
    if (Object.keys(errors).length) {
      return res.status(422).json({ errors });
    }

    // Save to DB
    const contact = await Contact.create({ name, email, message });

    // Fire-and-forget email notification without affecting the API response.
    (async () => {
      try {
        await sendContactEmail({ name, email, message });
      } catch (err) {
        console.warn("Contact saved, but email notification failed:", err.message);
      }
    })();

    res.status(201).json({
      message: "Message received! I'll get back to you soon.",
      id: contact._id,
    });
  } catch (err) {
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([k, v]) => [k, v.message])
      );
      return res.status(422).json({ errors });
    }
    console.error("POST /api/contact:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ── GET /api/contact ──────────────────────────────────────────────────────
// Admin: Get all messages (newest first, paginated)
router.get("/", adminAuth, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(),
    ]);

    res.json({
      messages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("GET /api/contact:", err);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

// ── GET /api/contact/:id ──────────────────────────────────────────────────
// Admin: Get single message
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).lean();
    if (!contact) return res.status(404).json({ error: "Message not found." });
    res.json(contact);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ error: "Invalid ID format." });
    console.error("GET /api/contact/:id:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// ── DELETE /api/contact/:id ───────────────────────────────────────────────
// Admin: Delete a message
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: "Message not found." });
    res.json({ message: "Message deleted successfully.", id: req.params.id });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ error: "Invalid ID format." });
    console.error("DELETE /api/contact/:id:", err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
