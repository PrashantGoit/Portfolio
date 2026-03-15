import { useState, useEffect, useCallback } from "react";
import { contactAPI } from "../api";

// Simple admin login using a token entered by the user
export default function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem("admin_token") || "");
  const [authed, setAuthed] = useState(!!sessionStorage.getItem("admin_token"));
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await contactAPI.getAll(page);
      setMessages(res.data.messages);
      setPagination(res.data.pagination);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Invalid or expired token. Please log in again.");
        setAuthed(false);
        sessionStorage.removeItem("admin_token");
      } else {
        setError("Failed to load messages.");
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (authed) fetchMessages();
  }, [authed, fetchMessages]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    sessionStorage.setItem("admin_token", token.trim());
    setAuthed(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    setDeleting(id);
    try {
      await contactAPI.delete(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch {
      alert("Failed to delete message.");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setAuthed(false);
    setToken("");
    setMessages([]);
  };

  const fmt = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "var(--bg)" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", color: "var(--blue)", fontSize: "0.8rem", letterSpacing: "0.15em", marginBottom: "1.5rem", opacity: 0.8 }}>
            ADMIN / LOGIN
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "2rem" }}>
            Admin <span className="text-gradient">Panel</span>
          </h1>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="field">
              <label className="field-label">Admin Token</label>
              <input
                className="field-input"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your admin token"
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: "center", padding: "0.85rem" }}>
              Access Panel ⟶
            </button>
          </form>
          {error && <p style={{ color: "#f87171", fontSize: "0.78rem", marginTop: "1rem" }}>{error}</p>}
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", padding: "2rem 3rem", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", paddingTop: "2rem" }}>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", color: "var(--blue)", fontSize: "0.72rem", letterSpacing: "0.15em", marginBottom: "0.4rem", opacity: 0.8 }}>
            ADMIN DASHBOARD
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--text)" }}>
            Contact <span className="text-gradient">Messages</span>
            {pagination && (
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.9rem", color: "var(--text-dim)", fontWeight: 400, marginLeft: "1rem" }}>
                ({pagination.total} total)
              </span>
            )}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={fetchMessages} className="btn btn-ghost" style={{ fontSize: "0.72rem" }}>
            ↻ Refresh
          </button>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: "0.72rem", color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "0.75rem 1rem", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 4, color: "#f87171", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-dim)", fontSize: "0.8rem" }}>
          Loading messages...
        </div>
      )}

      {/* Empty state */}
      {!loading && messages.length === 0 && !error && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-dim)", fontSize: "0.85rem", border: "1px dashed var(--border)", borderRadius: 8 }}>
          No messages yet.
        </div>
      )}

      {/* Messages table */}
      {!loading && messages.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Space Mono', monospace", fontSize: "0.78rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Name", "Email", "Message", "Received", "Action"].map(h => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "var(--blue)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.65rem", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem", color: "var(--text)", whiteSpace: "nowrap", fontWeight: 700 }}>{msg.name}</td>
                  <td style={{ padding: "1rem" }}>
                    <a href={`mailto:${msg.email}`} style={{ color: "var(--blue)", textDecoration: "none" }}>{msg.email}</a>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-dim)", maxWidth: 360 }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {msg.message}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-dim)", whiteSpace: "nowrap" }}>{fmt(msg.createdAt)}</td>
                  <td style={{ padding: "1rem" }}>
                    <button onClick={() => handleDelete(msg._id)} disabled={deleting === msg._id} style={{
                      background: "transparent", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 4,
                      padding: "0.35rem 0.75rem", color: "#f87171", cursor: "pointer",
                      fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", fontWeight: 700,
                      letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s",
                      opacity: deleting === msg._id ? 0.5 : 1,
                    }}
                      onMouseEnter={e => { if (deleting !== msg._id) { e.target.style.background = "rgba(248,113,113,0.1)"; } }}
                      onMouseLeave={e => e.target.style.background = "transparent"}
                    >
                      {deleting === msg._id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "2rem", justifyContent: "center" }}>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              background: p === page ? "var(--blue)" : "transparent",
              border: "1px solid var(--border)", borderRadius: 4,
              padding: "0.4rem 0.75rem", color: p === page ? "#000" : "var(--text-dim)",
              cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "0.75rem",
              fontWeight: 700, transition: "all 0.2s",
            }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
