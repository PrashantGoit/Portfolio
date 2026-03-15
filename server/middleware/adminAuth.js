/**
 * Simple token-based admin middleware.
 * In production, swap this for JWT or a proper auth library.
 * The admin token is set via ADMIN_TOKEN in .env.
 */
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized — missing token" });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Forbidden — invalid token" });
  }

  next();
};

module.exports = adminAuth;
