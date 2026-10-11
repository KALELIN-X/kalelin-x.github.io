import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Cpu,
  Gamepad2,
  FileText,
  X,
  Printer,
  MapPin,
  Code2,
  Sparkles,
} from "lucide-react";
import WorkspaceScene from "./components/WorkspaceScene.jsx";
import {
  profile,
  experience,
  education,
  projects,
  skillGroups,
} from "./content.js";

function Linkedin({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="7.5" cy="7.5" r=".65" fill="currentColor" />
      <path d="M7.5 11v6M12 11v6M12 13a2.5 2.5 0 0 1 5 0v4" />
    </svg>
  );
}

function Github({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7m12 5v-3.5c.1-1-.3-1.8-.8-2.3 2.8-.3 5.8-1.4 5.8-6.3A4.9 4.9 0 0 0 18.6 6c.1-.3.6-1.7-.1-3.5 0 0-1.1-.4-3.6 1.3a12.6 12.6 0 0 0-6.5 0C6 2.1 4.9 2.5 4.9 2.5 4.2 4.3 4.7 5.7 4.8 6A4.9 4.9 0 0 0 3.4 9c0 4.9 3 6 5.8 6.3-.5.5-.9 1.3-.8 2.3V21" />
    </svg>
  );
}

function Emblem({ className = "" }) {
  return (
    <span className={`emblem ${className}`} aria-hidden="true">
      <Code2 strokeWidth={1.7} />
    </span>
  );
}

function Modal({ open, onClose, title, children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        className="icon-button modal-close"
        aria-label={`Close ${title}`}
        onClick={onClose}
      >
        <X size={21} />
      </button>
      {children}
    </dialog>
  );
}

function ProjectArtwork({ kind, title }) {
  if (!["commentscope", "ultimate"].includes(kind)) {
    return (
      <div className="project-art generic-art">
        <Code2 size={55} strokeWidth={1} />
        <span>{title}</span>
        <span className="art-caption">Project overview</span>
      </div>
    );
  }
  if (kind === "commentscope")
    return (
      <div
        className="project-art comment-art"
        aria-label="Illustrated preview of a sentiment dashboard"
      >
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="mini-dashboard">
          <div className="mini-toolbar">
            <span className="mini-logo">
              <Cpu size={14} /> CommentScope
            </span>
            <span className="mini-dots">•••</span>
          </div>
          <div className="mini-content">
            <div className="mini-label">THE CONVERSATION, AT A GLANCE</div>
            <div className="mini-title">A little perspective.</div>
            <div className="mini-chart-row">
              <div className="donut">
                <span>
                  <strong>3</strong>
                  <small>sentiments</small>
                </span>
              </div>
              <div className="chart-legend">
                <span>
                  <i className="positive" />
                  Positive
                </span>
                <span>
                  <i className="neutral" />
                  Neutral
                </span>
                <span>
                  <i className="negative" />
                  Negative
                </span>
              </div>
            </div>
            <div className="mini-comment">
              <i />
              “I love how simple this is.”<span>Positive</span>
            </div>
            <div className="mini-comment">
              <i />
              “It could be easier to use.”
              <span className="negative-text">Negative</span>
            </div>
          </div>
        </div>
        <span className="art-caption">Illustrated project preview</span>
      </div>
    );
  return (
    <div
      className="project-art game-art"
      aria-label="Illustrated preview of a game-discovery interface"
    >
      <svg className="art-stars" viewBox="0 0 500 330" aria-hidden="true">
        <path
          d="m60 75 4 10 10 4-10 4-4 10-4-10-10-4 10-4zm378 180 5 13 13 5-13 5-5 13-5-13-13-5 13-5z"
          fill="#edc886"
        />
        <circle cx="440" cy="55" r="4" fill="#a3b48b" />
        <circle cx="75" cy="255" r="3" fill="#edc886" />
      </svg>
      <div className="mini-game-browser">
        <div className="mini-toolbar">
          <span className="mini-logo">
            <Gamepad2 size={15} /> UltimateGameGen
          </span>
          <span className="mini-dots">•••</span>
        </div>
        <div className="mini-content">
          <div className="mini-label">FIND YOUR NEXT ADVENTURE</div>
          <div className="mini-title">What will you play?</div>
          <div className="game-tile-row">
            <div className="game-tile tile-hills">
              <svg viewBox="0 0 100 110" aria-hidden="true">
                <circle cx="72" cy="26" r="14" fill="#f2ca86" />
                <path d="m0 82 38-43 30 34 32-24v61H0z" fill="#90a67c" />
                <path d="m0 99 42-36 58 47H0" fill="#516c54" />
              </svg>
              <span>The wanderer</span>
            </div>
            <div className="game-tile tile-space">
              <svg viewBox="0 0 100 110" aria-hidden="true">
                <circle cx="50" cy="47" r="26" fill="#c77e62" />
                <ellipse
                  cx="50"
                  cy="47"
                  rx="42"
                  ry="10"
                  fill="none"
                  stroke="#e3c090"
                  strokeWidth="5"
                  transform="rotate(-25 50 47)"
                />
                <path d="m20 17 2 4 4 2-4 2-2 4-2-4-4-2 4-2" fill="#eed4ae" />
              </svg>
              <span>Beyond orbit</span>
            </div>
            <div className="game-tile tile-forest">
              <svg viewBox="0 0 100 110" aria-hidden="true">
                <circle cx="70" cy="24" r="15" fill="#e2c88f" />
                <path
                  d="m24 22 20 60H4zm43 11 21 59H46zm-28 5 25 69H14"
                  fill="#8ca383"
                />
                <path
                  d="M26 80v30m40-21v21m-27-13v13"
                  stroke="#ecd3a2"
                  strokeWidth="3"
                />
              </svg>
              <span>Into the woods</span>
            </div>
          </div>
          <div className="mini-search">
            Search. Discover. Make it yours.
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
      <span className="art-caption">
        Illustrated project preview · original artwork
      </span>
    </div>
  );
}

function ProjectDialog({ project, onClose }) {
  return (
    <Modal
      open={Boolean(project)}
      onClose={onClose}
      title={project ? `${project.title} project details` : "Project details"}
    >
      {project && (
        <div className="modal-body">
          <span className="eyebrow">PROJECT LOG / {project.number}</span>
          <h2>{project.title}</h2>
          <p className="modal-lead">{project.question}</p>
          <h3>How it works</h3>
          <p>{project.approach}</p>
          <h3>What was rebuilt</h3>
          <p>{project.provenance}</p>
          <h3>Current limitations</h3>
          <p>{project.limitation}</p>
          <div className="tag-list">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <a
            className="button button-dark"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the source <ArrowUpRight size={17} />
          </a>
        </div>
      )}
    </Modal>
  );
}

function ResumeDialog({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${profile.name} résumé`}
      className="resume-modal"
    >
      <div className="modal-body resume-content">
        <span className="eyebrow">EXPERIENCE / EDUCATION / PROJECTS</span>
        <h2>{profile.name}</h2>
        <p className="modal-lead">
          Software engineer · Web applications, APIs & machine learning
        </p>
        <div className="resume-section">
          <h3>Experience</h3>
          {experience.map((job) => (
            <div className="resume-job" key={job.id}>
              <div className="resume-row">
                <div>
                  <h4>{job.role}</h4>
                  <p>{job.employer}</p>
                </div>
                <span>{job.date}</span>
              </div>
              <ul>
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="resume-section">
          <h3>Education</h3>
          {education.map((item) => (
            <div className="resume-row" key={item.id}>
              <div>
                <h4>{item.institution}</h4>
                <p>
                  {item.degree}
                  {item.status === "Incoming" ? " · Incoming" : ""}
                </p>
              </div>
              <span>{item.date}</span>
            </div>
          ))}
        </div>
        <div className="resume-section">
          <h3>Selected projects</h3>
          {projects.map((project) => (
            <div className="resume-project" key={project.id}>
              <h4>
                {project.title} <span>Reconstructed project</span>
              </h4>
              <p>{project.description}</p>
              <small>{project.tags.join(" · ")}</small>
            </div>
          ))}
        </div>
        <div className="resume-section">
          <h3>Technical toolkit</h3>
          <p>{skillGroups.flatMap((group) => group.items).join(" · ")}</p>
        </div>
        <p className="resume-note">
          This concise view uses verified résumé details and current project
          documentation. Project reconstructions are identified above; no
          historical performance metrics are claimed.
        </p>
        <div className="resume-actions">
          <button
            type="button"
            className="button button-dark"
            onClick={() => window.print()}
          >
            <Printer size={17} /> Print / save PDF
          </button>
          <a
            className="text-link"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub profile <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const firstName = profile.name.split(/\s+/)[0];
  useEffect(() => {
    document.title = profile.name + " — Software & AI";
    document.querySelector('meta[name="description"]').content =
      profile.name + "'s personal portfolio. Explore software projects, AI, and professional experience.";
  }, []);

  return (
    <>
      <a className="skip-link" href="#work">Skip to portfolio</a>
      <div className="site-shell" id="home">
        <header className="site-header">
          <div className="header-brand">
          <a className="wordmark" href="#home" aria-label={profile.name + ", back to the top"}>
            <Emblem />
            <span>{profile.name}<span className="wordmark-subtitle">SOFTWARE & AI</span></span>
          </a>
          <div className="header-socials" aria-label="Social profiles">
            <a href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={14} /> GitHub</a>
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={14} /> LinkedIn</a>}
          </div>
          </div>
          <nav aria-label="Main navigation">
            <a href="#work">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#about">About</a>
            <button type="button" onClick={() => setResumeOpen(true)}>Résumé <ArrowUpRight size={14} /></button>
          </nav>
        </header>

        <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <span className="eyebrow hero-eyebrow"><span className="status-dot" aria-hidden="true" /> HELLO, I'M {firstName.toUpperCase()}</span>
              <h1 id="hero-title">Building software. <span>Exploring AI.</span></h1>
              <p className="hero-role">{profile.role} at {profile.employer}</p>
            </div>
            <WorkspaceScene />
            <div className="hero-intro">
              <p>I build useful applications, explore model behavior, and care about the details that make software work.</p>
              <div className="hero-actions">
                <a className="button button-dark" href="#work">My projects <ArrowDown size={16} /></a>
                <button type="button" className="button button-quiet" onClick={() => setResumeOpen(true)}>View résumé <FileText size={16} /></button>
              </div>
            </div>
          </section>

          <div className="portfolio-grid">
            <section id="work" className="work-section" aria-labelledby="work-title">
              <div className="section-heading">
                <div><span className="eyebrow">01 / SELECTED WORK</span><h2 id="work-title">Projects</h2></div>
                <a className="section-source" href={profile.github} target="_blank" rel="noopener noreferrer">All repositories <ArrowUpRight size={15} /></a>
              </div>
              <div className="project-list">
                {projects.map((project) => (
                  <article className={"project-row project-" + project.id} key={project.id}>
                    <ProjectArtwork kind={project.id} title={project.title} />
                    <div className="project-copy">
                      <span className="eyebrow">{project.category}</span>
                      <h3>{project.title}</h3>
                      <p className="project-description">{project.description}</p>
                      <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <div className="project-actions">
                        <button type="button" className="project-link" onClick={() => setActiveProject(project)} aria-label={"Read about " + project.title}>Details <ArrowUpRight size={17} /></button>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="source-link" aria-label={project.title + " source on GitHub"}><Github size={18} /></a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="experience" className="experience-section" aria-labelledby="experience-title">
              <div className="section-heading"><div><span className="eyebrow">02 / EXPERIENCE</span><h2 id="experience-title">Where I work</h2></div></div>
              <div className="experience-list">
                {experience.map((job) => (
                  <article className="experience-row" key={job.id}>
                    <div className="experience-title-row"><h3>{job.role}</h3>{job.current && <span className="current-role">Current</span>}</div>
                    <p className="employer-name">{job.employer}</p>
                    <p className="experience-date">{job.date}</p>
                    <ul>{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section id="about" className="about-section" aria-labelledby="about-title">
            <div className="about-copy">
              <span className="eyebrow">03 / A LITTLE ABOUT ME</span>
              <h2 id="about-title">Curiosity, put into practice.</h2>
              <p>I'm {firstName}. My work spans web applications, APIs, and machine learning. I enjoy turning an idea into something people can try, understand, and improve.</p>
              <div className="journey">
                {education.map((item) => (
                  <div key={item.id}>
                    {item.status === "Incoming" ? <Sparkles size={17} /> : <MapPin size={17} />}
                    <span><strong>{item.status === "Incoming" ? "Up next" : "Education"}</strong>{item.shortDescription}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="toolkit" aria-labelledby="toolkit-title">
              <h3 id="toolkit-title">Tools I work with</h3>
              <div className="skill-groups">
                {skillGroups.map((group) => (
                  <div className="skill-group" key={group.title}>
                    <h4>{group.title}</h4>
                    <div className="skill-items">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <span>© {new Date().getFullYear()} {profile.name}<small>Built with React. Always learning.</small></span>
          <div className="footer-links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={15} /></a>
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={15} /></a>}
            <a href="#home">Back to top <ArrowUpRight size={14} /></a>
          </div>
        </footer>
      </div>
      <ProjectDialog project={activeProject} onClose={() => setActiveProject(null)} />
      <ResumeDialog open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
