import { useEffect, useState } from "react";
import { me, playground } from "./content.js";

// In development this is "" (Vite proxies /api). After deploying, set VITE_API_URL.
const API = import.meta.env.VITE_API_URL || "";

// A little piece of tape. Put it inside any element with class "taped".
const Tape = ({ side = "left" }) => <span className={`tape tape-${side}`} />;

function getExternalUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch (error) {
    if (error instanceof TypeError) return null;
    throw error;
  }
}

function Nav() {
  const links = ["home", "about", "work", "playground", "contact"];
  return (
    <nav className="nav">
      <span className="dot" />
      {links.map((id) => (
        <a key={id} href={`#${id}`}>
          {id}
        </a>
      ))}
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="section hero">
      <span className="note green">$ make things</span>
      <span className="note yellow">sudo sweat-the-details</span>
      <p className="hand">my name is</p>
      <h1 className="pixel boxed">{me.name}</h1>
      <p className="hero-line">{me.headline}</p>
      <p className="mono small prompt">
        $ whoami <span className="cursor">▍</span>
      </p>
      <p className="mono small">{me.role} · open to new work</p>
      <a className="btn" href="#contact">
        sudo contact
      </a>
    </section>
  );
}

function Terminal() {
  const user = me.name.toLowerCase().replace(/ /g, "_");
  return (
    <div className="terminal">
      <div className="term-bar">
        <i />
        <i />
        <i /> bash
      </div>
      <pre>{`$ whoami
${user}
$ cat skills.txt
python fastapi react postgres linux
$ uptime
building something new, always`}</pre>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <h2 className="pixel">ABOUT</h2>
      <div className="about">
        <div className="polaroid taped" style={{ "--tilt": "-3deg" }}>
          <Tape side="left" />
          <div className="photo" style={{ background: "#f4d28a" }}>
            🙂
          </div>
          <span className="hand">that's me</span>
        </div>
        <div>
          <p className="hand big">{me.intro}</p>
          <div className="chips">
            {me.skills.map((s) => (
              <span key={s.label} className={`chip ${s.color}`}>
                {s.label}
              </span>
            ))}
          </div>
          <Terminal />
        </div>
      </div>
    </section>
  );
}

function ProjectPreview({ project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = getExternalUrl(project.image_url);

  if (!imageUrl || imageFailed) {
    return (
      <div
        className="work__placeholder"
        role="img"
        aria-label={`${project.title} screenshot unavailable`}
      >
        <span className="work__placeholder-label">Project preview</span>
        <span className="work__placeholder-note">Screenshot not provided</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`${project.title} project screenshot`}
      loading="lazy"
      decoding="async"
      onError={() => setImageFailed(true)}
    />
  );
}

function ProjectCard({ project }) {
  const category = project.category || project.tag || "Project";
  const repositoryUrl = getExternalUrl(project.repository_url);
  const liveDemoUrl = getExternalUrl(project.live_demo_url);
  const sourceUrl = getExternalUrl(project.source_url);
  const technologies = Array.isArray(project.technologies)
    ? project.technologies.filter(
        (technology) => typeof technology === "string" && technology.trim(),
      )
    : [];

  return (
    <article className="work" data-color={project.color || "yellow"}>
      <div className="work__preview">
        <ProjectPreview project={project} />
      </div>
      <div className="work__body">
        <div className="work__meta">
          <span className="work__category">{category}</span>
          {project.date_label && (
            <span className="work__date">{project.date_label}</span>
          )}
        </div>
        <h3>{project.title}</h3>
        <p className="work__summary">{project.summary}</p>
        {sourceUrl && (
          <a
            className="work__source"
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View original project
          </a>
        )}
        {technologies.length > 0 && (
          <ul className="work__stack" aria-label="Technology stack">
            {technologies.map((technology) => (
              <li key={technology} className="work__tech">
                {technology}
              </li>
            ))}
          </ul>
        )}
        {(repositoryUrl || liveDemoUrl) && (
          <div className="work__actions">
            {repositoryUrl && (
              <a
                className="work__link work__link--primary"
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} source on GitHub`}
              >
                GitHub Repo
              </a>
            )}
            {liveDemoUrl && (
              <a
                className="work__link"
                href={liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} live demo`}
              >
                Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Work({ projects, error, loading }) {
  return (
    <section id="work" className="section">
      <p className="hand">maybe my work?</p>
      <h2 className="pixel">FEATURED WORKS</h2>
      {error && (
        <p className="mono small work__message" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <p className="mono small work__message" role="status">
          Loading projects...
        </p>
      )}
      {!loading && !error && projects.length === 0 && (
        <p className="mono small work__message">
          No featured projects are available yet.
        </p>
      )}
      <div className="works">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function Playground() {
  return (
    <section id="playground" className="section">
      <p className="hand">playground</p>
      <h2 className="pixel">JUST FOR FUN</h2>
      <div className="collage">
        {playground.map((p) => (
          <div
            key={p.caption}
            className="polaroid taped"
            style={{ "--tilt": `${p.tilt}deg` }}
          >
            <Tape side="right" />
            <div className="photo" style={{ background: p.bg }}>
              {p.emoji}
            </div>
            <span className="hand">{p.caption}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", body: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setForm({ name: "", email: "", body: "" });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section">
      <p className="hand">say hi</p>
      <h2 className="pixel boxed">CONTACT</h2>
      <form className="sticky" onSubmit={submit}>
        <input
          name="name"
          placeholder="your name"
          value={form.name}
          onChange={update}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="your email"
          value={form.email}
          onChange={update}
          required
        />
        <textarea
          name="body"
          rows="4"
          placeholder="echo 'tell me about your project' >"
          value={form.body}
          onChange={update}
          required
        />
        <button className="btn" disabled={status === "sending"}>
          {status === "sending" ? "sending..." : "send message"}
        </button>
        {status === "sent" && (
          <p className="mono small">Sent! I'll reply soon.</p>
        )}
        {status === "error" && (
          <p className="mono small">
            Couldn't send. Check your connection and try again.
          </p>
        )}
      </form>
      <div className="links">
        {me.links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {l.label}
          </a>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const response = await fetch(`${API}/api/projects`);
        if (!response.ok) {
          throw new Error(`Projects request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Projects API returned an unexpected response.");
        }

        if (!cancelled) setProjects(data);
      } catch {
        if (!cancelled) {
          setError(
            "Projects couldn't load. Check the backend connection and database setup.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Work projects={projects} error={error} loading={loading} />
        <Playground />
        <Contact />
      </main>
      <footer className="footer mono small">
        btw, i use linux · built with react + fastapi + postgres
      </footer>
    </>
  );
}
