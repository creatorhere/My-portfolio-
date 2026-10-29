import { useEffect, useState } from "react";
import { me, playground } from "./content.js";

// In development this is "" (Vite proxies /api). After deploying, set VITE_API_URL.
const API = import.meta.env.VITE_API_URL || "";

// A little piece of tape. Put it inside any element with class "taped".
const Tape = ({ side = "left" }) => <span className={`tape tape-${side}`} />;

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

function Work({ projects, error }) {
  return (
    <section id="work" className="section">
      <p className="hand">maybe my work?</p>
      <h2 className="pixel">FEATURED WORKS</h2>
      {error && <p className="mono small">{error}</p>}
      <div className="works">
        {projects.map((p) => (
          <article key={p.id} className={`work ${p.color}`}>
            <span className="mono small">● {p.date_label}</span>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            <span className="chip sand">{p.tag}</span>
          </article>
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
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
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

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => setError("Projects couldn't load. Is the backend running?"));
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Work projects={projects} error={error} />
        <Playground />
        <Contact />
      </main>
      <footer className="footer mono small">
        btw, i use linux · built with react + fastapi + postgres
      </footer>
    </>
  );
}
