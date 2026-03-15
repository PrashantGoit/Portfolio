import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { label: "About",    href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact",  href: "/#contact" },
];

function HamburgerIcon({ open }) {
  const bar = (extra) => (
    <span style={{
      display: "block", width: 22, height: 2,
      background: "var(--text)", borderRadius: 2,
      transition: "transform 0.25s, opacity 0.25s",
      ...extra,
    }} />
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, width: 22 }}>
      {bar(open ? { transform: "rotate(45deg) translate(5px, 5px)" } : {})}
      {bar(open ? { opacity: 0, transform: "scaleX(0)" } : {})}
      {bar(open ? { transform: "rotate(-45deg) translate(5px, -5px)" } : {})}
    </div>
  );
}

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const linkStyle = {
    textDecoration: "none", color: "var(--text-dim)",
    fontSize: "0.8rem", fontWeight: 700,
    letterSpacing: "0.06em", textTransform: "uppercase",
    transition: "color 0.2s", fontFamily: "Inter, sans-serif",
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "1.1rem 1.25rem" : "1.4rem 4rem",
        background: scrolled || menuOpen ? "rgba(7,11,18,0.95)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid var(--border)" : "1px solid transparent",
        transition: "padding 0.3s, background 0.3s, border-color 0.3s",
      }}>
        <Link to="/" onClick={closeMenu} style={{ textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: "1rem", fontWeight: 800 }}>
          <span style={{ color: "var(--blue)" }}>&lt;</span>
          <span style={{ color: "var(--text)" }}>PG</span>
          <span style={{ color: "var(--blue)" }}>/&gt;</span>
        </Link>

        {!isMobile && (
          <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", alignItems: "center" }}>
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} style={linkStyle}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--blue)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}
                >
                  <span style={{ color: "var(--blue)", opacity: 0.6, fontWeight: 400 }}></span>{label}
                </a>
              </li>
            ))}
            <li>
              <button onClick={toggle} style={{
                background: "transparent", border: "1px solid var(--border)",
                borderRadius: "4px", padding: "0.4rem 0.75rem", cursor: "pointer",
                color: "var(--text-dim)", fontSize: "0.9rem", transition: "all 0.2s",
                fontFamily: "Inter, sans-serif", lineHeight: 1,
              }}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--blue)"; e.currentTarget.style.color = "var(--blue)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dim)"; }}
              >
                {theme === "dark" ? "☀" : "☽"}
              </button>
            </li>
          </ul>
        )}

        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={toggle} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 4, padding: "0.35rem 0.6rem", cursor: "pointer", color: "var(--text-dim)", fontSize: "0.9rem" }}>
              {theme === "dark" ? "☀" : "☽"}
            </button>
            <button onClick={() => setMenuOpen(o => !o)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "0.3rem", display: "flex", alignItems: "center" }} aria-label="Toggle menu">
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div className="nav-mobile-menu" onClick={closeMenu}>
          {NAV_ITEMS.map(({ label, href }) => (
            <a key={label} href={href} onClick={closeMenu}>
              <span style={{ color: "var(--blue)", opacity: 0.6, fontWeight: 400 }}>./</span>{label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
