import { useState, useEffect } from "react";
import { useInView } from "../hooks/useInView";
import ContactForm from "../components/ContactForm";

// ── Tech icons via Simple Icons CDN ──────────────────────────────────────
// Map tag name → Simple Icons slug (used in img src)
const ICON_MAP = {
  Python:      { slug: "python", color: "#3776AB" },
  TensorFlow:  { slug: "tensorflow", color: "#FF6F00" },
  React:       { slug: "react", color: "#61DAFB" },
  "Next.js":   { slug: "nextdotjs", color: "#000000" },

  HTML:        { slug: "html5", color: "#E34F26" },
  CSS:         { slug: "css", color: "#7ba4e6" },
  JavaScript:  { slug: "javascript", color: "#F7DF1E" },

  MongoDB:     { slug: "mongodb", color: "#47A248" },
  Express:     { slug: "express", color: "#b6b3b3" },
  "Node.js":     { slug: "nodedotjs", color: "#339933" }
};

function TechTag({ name, accentColor }) {
  const icon = ICON_MAP[name];
  const iconUrl = icon
    ? `https://cdn.simpleicons.org/${icon.slug}/${icon.color.replace("#","")}`
    : null;

  return (
    <span className="tag" style={{
      borderColor: `${accentColor}55`,
      color: accentColor,
      background: `${accentColor}12`,
    }}>
      {iconUrl && (
        <img
          src={iconUrl}
          alt={name}
          style={{ width: 11, height: 11, objectFit: "contain", filter: "none", opacity: 0.9 }}
          onError={e => { e.currentTarget.style.display = "none"; }}
        />
      )}
      {name}
    </span>
  );
}

// ── GitHub SVG icon ───────────────────────────────────────────────────────
const GitHubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// ── Social icons for Contact ──────────────────────────────────────────────
const EmailIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LinkedInIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/PrashantGoit",
    icon: <GitHubIcon size={26} />,
    color: "var(--github-icon)",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/prashant-goit",
    icon: <LinkedInIcon size={26} />,
    color: "#0a66c2",
  },
  {
    label: "Email",
    href: "mailto:Itsprashantgoit@gmail.com",
    icon: <EmailIcon size={26} />,
    color: "#fa3232",
  },
];

// ── Data ──────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: "Brain Tumor Detection",
    desc: "AI-powered web application that detects brain tumors from MRI scans using deep learning models. Provides quick predictions through an intuitive web interface.",
    tags: ["Python", "TensorFlow", "React", "Next.js"],
    color: "#00d4ff",
    img: "https://images.unsplash.com/photo-1737505599159-5ffc1dcbc08f?w=600&q=80",
    demo: "https://brain-tumour-detection-bay.vercel.app/",
    source: "https://github.com/PrashantGoit/Brain-tumour-detection.git"
  },
  {
    title: "Netflix Clone",
    desc: "Frontend clone of Netflix featuring responsive UI, movie listings, banners, and dynamic components built with modern web technologies.",
    tags: ["HTML", "CSS", "JavaScript", "React"],
    color: "#e50914",
    img: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&q=80",
    demo: "https://netflix-clone-goitprashant.vercel.app/",
    source: "https://github.com/PrashantGoit/Netflix-Clone.git"
  },
  {
    title: "Ecommerce Platform",
    desc: "Full-stack ecommerce web application with product catalog, shopping cart, authentication, and payment integration.",
    tags: ["MongoDB", "Express", "React", "Node.js"],
    color: "#10b981",
    img: "https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?w=600&q=80",
    demo: "https://ecommerce-lac-one-94.vercel.app/",
    source: "https://github.com/PrashantGoit/Ecommerce.git"
  }
];

const SKILLS = [
  { 
    icon: "◈", 
    label: "5+ Projects",      
    sub: "Hands-on Experience",   
    desc: "Built full-stack web applications while learning modern development practices" 
  },
  { 
    icon: "⬡", 
    label: "Core Stack",          
    sub: "Technologies", 
    desc: "JavaScript, React, Node.js, MongoDB and modern web tools" 
  },
  { 
    icon: "◎", 
    label: "Continuous Learning",  
    sub: "Growth",      
    desc: "Improving through projects, problem solving, and exploring new technologies" 
  },
];

// ── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  const [tick, setTick] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setTick(t => !t), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", padding: "0 clamp(1.25rem, 5vw, 4rem)", overflow: "hidden" }}>
      <div className="grid-bg" />
      <div className="hero-grid" style={{ maxWidth: 1200, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", paddingTop: "5rem" }}>

        {/* Left: Text */}
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "var(--blue)", marginBottom: "1.5rem", opacity: 0.85, letterSpacing: "0.05em" }}>
            ~/portfolio<span style={{ opacity: tick ? 1 : 0, transition: "opacity 0.1s" }}>█</span>
          </div>
          <h1 style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "0.75rem" }}>
            Prashant<br /><span className="text-gradient">Goit</span>
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "var(--blue)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1.75rem" }}>
            Full Stack Developer
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.85, color: "var(--text-dim)", maxWidth: 460, marginBottom: "2.5rem" }}>
            I design and build modern web applications with a focus on performance and usability.
            From backend logic to seamless user experiences — I create software that solves real problems.
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="#contact" className="btn btn-ghost">Contact Me</a>
          </div>
        </div>

        {/* Right: Avatar */}
        <div className="hero-right" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "clamp(200px, 30vw, 300px)", height: "clamp(200px, 30vw, 300px)", animation: "float 5s ease-in-out infinite" }}>
            <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: "1px solid rgba(0,212,255,0.15)", borderTopColor: "var(--blue)", animation: "spin 12s linear infinite" }} />
            <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "1px solid rgba(124,58,237,0.15)", borderRightColor: "var(--purple)", animation: "spin 8s linear infinite reverse" }} />
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(0,212,255,0.25)" }}>
              <img
                src="./pp.jpeg"
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", fontSize: "0.6rem", fontWeight: 600, color: "var(--text-dim)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        <span>scroll</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--blue), transparent)", animation: "scrollPulse 1.8s ease-in-out infinite" }} />
      </div>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes scrollPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
      `}</style>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────
function About() {
  const [ref, inView] = useInView();
  return (
    <section id="about" className="section" ref={ref} style={{ background: "var(--bg2)", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,var(--blue),transparent)" }} />
      <div className="section-inner">
        <div className={`fade-up ${inView ? "visible" : ""}`}>
          <div className="section-label">01 — About</div>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, color: "var(--text)", lineHeight: 1.15, marginBottom: "1.5rem" }}>
                Building the web&apos;s<br /><span className="text-gradient">invisible backbone</span>
              </h2>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.9, color: "var(--text-dim)", marginBottom: "1rem" }}>
                I'm a software developer passionate about building modern web applications and learning new technologies. 
                I enjoy turning ideas into functional products and continuously improving my skills through projects and problem solving.
              </p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.9, color: "var(--text-dim)" }}>
                Currently focused on full-stack development, 
                working with modern tools and frameworks while building projects that solve real-world problems.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {SKILLS.map((s, i) => (
                <div key={i}
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "1.5rem", borderRadius: 8, cursor: "default", transition: "border-color 0.3s, transform 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--blue)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ fontSize: "1.1rem", color: "var(--blue)", marginBottom: "0.4rem" }}>{s.icon}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--text)" }}>{s.label}</div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--blue)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{s.sub}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const [ref, inView] = useInView();

  const cardBtnStyle = (color) => ({
    display: "inline-flex", alignItems: "center", gap: "0.35rem",
    padding: "0.5rem 0.9rem", borderRadius: 4,
    border: `1px solid ${color}`,
    color: color,
    fontFamily: "Inter, sans-serif", fontSize: "0.7rem",
    fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
    textDecoration: "none", transition: "all 0.2s",
  });

  return (
    <div ref={ref} className={`fade-up ${inView ? "visible" : ""}`} style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
      <div
        style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s", height: "100%" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = project.color; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
          <img src={project.img} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 40%,var(--bg2) 100%)" }} />
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
            {project.title}
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.7, flex: 1 }}>
            {project.desc}
          </p>

          {/* Tech tags with icons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1rem" }}>
            {project.tags.map(t => (
              <TechTag key={t} name={t} accentColor={project.color} />
            ))}
          </div>

          {/* Action buttons */}
          <div className="card-actions">
            <a
              href={project.demo}
              style={cardBtnStyle(project.color)}
              onMouseEnter={e => { e.currentTarget.style.background = project.color; e.currentTarget.style.color = "#000"; e.currentTarget.style.boxShadow = `0 0 16px ${project.color}55`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = project.color; e.currentTarget.style.boxShadow = "none"; }}
            >
              Live Demo ↗
            </a>
            <a
              href={project.source}
              style={cardBtnStyle("var(--text-dim)")}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text)"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--text-dim)"; e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; }}
            >
              <GitHubIcon size={12} /> Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────
function Projects() {
  const [ref, inView] = useInView();
  return (
    <section id="projects" className="section" ref={ref}>
      <div className="section-inner">
        <div className={`fade-up ${inView ? "visible" : ""}`}>
          <div className="section-label">02 — Projects</div>
          <div className="section-title">
            Things I&apos;ve<br /><span className="text-gradient">Built</span>
          </div>
        </div>
        <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ── Social Icon Button ────────────────────────────────────────────────────
function SocialIconBtn({ href, icon, label, hoverColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
      <a
        href={href}
        target={href.startsWith("mailto") ? undefined : "_blank"}
        rel="noopener noreferrer"
        className="social-icon-btn"
        style={{
          color: hovered ? hoverColor : "var(--text-dim)",
          borderColor: hovered ? hoverColor : "var(--border)",
          boxShadow: hovered ? `0 8px 24px ${hoverColor}33` : "none",
          transform: hovered ? "translateY(-5px) scale(1.1)" : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={label}
      >
        {icon}
      </a>
      <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────
function Contact() {
  const [ref, inView] = useInView();
  return (
    <section id="contact" className="section" ref={ref} style={{ background: "var(--bg2)", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,var(--purple),transparent)" }} />
      <div className="section-inner">
        <div className={`fade-up ${inView ? "visible" : ""}`}>
          <div className="section-label">03 — Contact</div>
          <div className="section-title">
            Let&apos;s build<br /><span className="text-gradient">something</span>
          </div>
        </div>
        <div className={`fade-up ${inView ? "visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "5rem", alignItems: "start" }}>
            <div>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.9, color: "var(--text-dim)", marginBottom: "2.5rem" }}>
                Available for freelance and full-time opportunities.
                Drop a message — I respond within 24 hours.
              </p>

              {/* Animated social icons */}
              <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                {SOCIAL_LINKS.map(({ label, href, icon, color }) => (
                  <SocialIconBtn key={label} href={href} icon={icon} label={label} hoverColor={color} />
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Contact />
      <footer className="footer-inner" style={{ padding: "2rem 4rem", borderTop: "1px solid var(--border)", textAlign: "center", fontSize: "0.75rem", letterSpacing: "0.04em", fontWeight: 500 }}>
        <span className="text-dim">crafted with </span>
        <span className="text-gradient">precision</span>
        <span className="text-dim"> by Prashant Goit</span>
      </footer>
    </>
  );
}
