import { useEffect, useRef, useState, type MouseEvent } from 'react';

type Project = {
  title: string;
  eyebrow: string;
  description: string;
  insight: string;
  image: string;
  href: string;
  tags: string[];
};

const featuredProjects: Project[] = [
  {
    title: 'MealMetric',
    eyebrow: 'Android product',
    description: 'A privacy-minded meal journal with local-first Room storage, lifecycle-aware state, and an optional nutrition-search boundary.',
    insight: 'Local-first data · explicit service boundary',
    image: '/assets/projects/mealmetric.svg',
    href: 'https://github.com/Himath2002/mealmetric-android',
    tags: ['Kotlin', 'Room', 'MVVM'],
  },
  {
    title: 'Airspace Ops',
    eyebrow: 'Concurrent system',
    description: 'A JavaFX airport simulator where blocking queues, worker pools, and live aircraft movement make concurrency observable.',
    insight: 'Blocking queues · worker pools · observable state',
    image: '/assets/projects/airspace.svg',
    href: 'https://github.com/Himath2002/airspace-ops-simulator',
    tags: ['Java', 'JavaFX', 'Concurrency'],
  },
  {
    title: 'Modular Maze Engine',
    eyebrow: 'Extensible architecture',
    description: 'A desktop game engine combining a map DSL, independently compiled plugins, embedded scripts, and localization.',
    insight: 'Plugin contracts · map DSL · embedded scripting',
    image: '/assets/projects/modular-maze.svg',
    href: 'https://github.com/Himath2002/modular-maze-engine',
    tags: ['Java', 'Plugins', 'Scripting'],
  },
  {
    title: 'AeroRoute Algorithms',
    eyebrow: 'Algorithms laboratory',
    description: 'A route-planning lab built around handwritten data structures, bounded path discovery, and interchangeable sorting strategies.',
    insight: 'Handwritten structures · interchangeable algorithms',
    image: '/assets/projects/aeroroute.svg',
    href: 'https://github.com/Himath2002/aeroroute-algorithms',
    tags: ['Java', 'DSA', 'Graphs'],
  },
  {
    title: 'RelayLobby',
    eyebrow: 'Distributed desktop system',
    description: 'A WPF collaboration system comparing polling and duplex callbacks over a typed WCF service with synchronized shared state.',
    insight: 'Polling vs callbacks · synchronized state',
    image: '/assets/projects/relay-lobby.svg',
    href: 'https://github.com/Himath2002/relay-lobby-wcf',
    tags: ['C#', 'WPF', 'WCF'],
  },
  {
    title: 'PodiumDB',
    eyebrow: 'Database engineering',
    description: 'An integrity-first MySQL analytics system with normalized data, database-owned rules, deterministic fixtures, and a typed client.',
    insight: 'Normalized schema · database-owned integrity',
    image: '/assets/projects/podiumdb.svg',
    href: 'https://github.com/Himath2002/podiumdb-mysql',
    tags: ['MySQL', 'Python', 'Analytics'],
  },
];

const archiveProjects = [
  ['Urban Grid Planner', 'Graph-based planning and optimization', 'Java', 'https://github.com/Himath2002/urban-grid-planner'],
  ['Railway Network Simulator', 'Event-driven transport simulation', 'Java', 'https://github.com/Himath2002/railway-network-simulator'],
  ['Gridline Four', 'Android strategy game', 'Kotlin', 'https://github.com/Himath2002/gridline-four-android'],
  ['Pursuit Rewind', 'Low-level terminal game', 'C', 'https://github.com/Himath2002/pursuit-rewind-c'],
  ['Terminal Pursuit', 'Real-time console mechanics', 'C', 'https://github.com/Himath2002/terminal-pursuit-c'],
] as const;

const capabilities = [
  {
    number: '01',
    title: 'Build',
    lead: 'From interface to infrastructure.',
    description: 'Web platforms, mobile applications, desktop systems, APIs, data models, games, and the engineering boundaries that keep them coherent.',
    list: ['Product engineering', 'Full-stack development', 'Mobile & desktop', 'Data & databases'],
  },
  {
    number: '02',
    title: 'Improve',
    lead: 'Make existing software clearer and stronger.',
    description: 'Trace difficult behaviour, simplify structure, correct bugs, and raise maintainability without losing the intent that made the system useful.',
    list: ['Debugging', 'Refactoring', 'Performance thinking', 'Legacy code care'],
  },
  {
    number: '03',
    title: 'Assure',
    lead: 'Evidence over assumptions.',
    description: 'Design verification around the risk: focused unit checks, integration coverage, browser workflows, accessibility, and reproducible quality gates.',
    list: ['Testing strategy', 'QA workflows', 'CI automation', 'Accessibility'],
  },
  {
    number: '04',
    title: 'Secure',
    lead: 'Treat trust as an explicit boundary.',
    description: 'Model identity, storage, secrets, and untrusted input deliberately so security supports the product instead of arriving as an afterthought.',
    list: ['Secure design', 'Threat-aware review', 'Identity boundaries', 'Code scanning'],
  },
];

const transcriptUrl = import.meta.env.VITE_TRANSCRIPT_URL?.trim();

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 16 16 4M7 4h9v9" /></svg>;
}

function GitHubIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>;
}

type AnimatedNumberProps = {
  value: number;
  decimals?: number;
  suffix?: string;
  delay?: number;
  start?: boolean;
};

function AnimatedNumber({ value, decimals = 0, suffix = '', delay = 0, start = true }: AnimatedNumberProps) {
  const numberRef = useRef<HTMLElement>(null);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return;

    const format = (current: number) => current.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!start) {
      setDisplayValue('0');
      return;
    }
    if (reduceMotion) {
      setDisplayValue(format(value));
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const startedAt = performance.now();
      const duration = 1450;
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(format(value * eased));
        if (progress < 1) frame = window.requestAnimationFrame(animate);
      };
      frame = window.requestAnimationFrame(animate);
    }, { threshold: 0.55 });

    const observerTimer = window.setTimeout(() => observer.observe(element), delay);
    return () => {
      window.clearTimeout(observerTimer);
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [decimals, delay, start, value]);

  const finalValue = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return <strong ref={numberRef} aria-label={`${finalValue}${suffix}`}><span aria-hidden="true">{displayValue}{suffix}</span></strong>;
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setLoaded(true), reduceMotion ? 0 : 7200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => revealObserver.observe(element));

    const sections = ['home', 'work', 'capabilities', 'story', 'contact']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActiveSection(current.target.id);
      },
      { rootMargin: '-20% 0px -65%', threshold: [0.05, 0.25, 0.5] },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    const updateProgress = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const value = distance > 0 ? window.scrollY / distance : 0;
      document.documentElement.style.setProperty('--scroll-progress', String(value));
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduceMotion) return;

    const root = document.documentElement;
    const handlePointerMove = (event: PointerEvent) => {
      root.style.setProperty('--cursor-x', `${event.clientX}px`);
      root.style.setProperty('--cursor-y', `${event.clientY}px`);

      const interactive = (event.target as Element | null)?.closest<HTMLElement>('[data-magnetic]');
      document.body.classList.toggle('cursor-active', Boolean(interactive));
      document.querySelectorAll<HTMLElement>('[data-magnetic].is-magnetic').forEach((element) => {
        if (element !== interactive) {
          element.classList.remove('is-magnetic');
          element.style.removeProperty('--magnetic-x');
          element.style.removeProperty('--magnetic-y');
        }
      });

      if (interactive) {
        const bounds = interactive.getBoundingClientRect();
        const x = (event.clientX - (bounds.left + bounds.width / 2)) * 0.12;
        const y = (event.clientY - (bounds.top + bounds.height / 2)) * 0.12;
        interactive.classList.add('is-magnetic');
        interactive.style.setProperty('--magnetic-x', `${x.toFixed(2)}px`);
        interactive.style.setProperty('--magnetic-y', `${y.toFixed(2)}px`);
      }

      const spotlight = (event.target as Element | null)?.closest<HTMLElement>('[data-spotlight]');
      if (spotlight) {
        const bounds = spotlight.getBoundingClientRect();
        spotlight.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
        spotlight.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
      }
    };

    const handlePointerLeave = () => document.body.classList.remove('cursor-active');
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  const handleHeroPointer = (event: MouseEvent<HTMLElement>) => {
    if (!heroRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = heroRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    heroRef.current.style.setProperty('--pointer-x', x.toFixed(3));
    heroRef.current.style.setProperty('--pointer-y', y.toFixed(3));
  };

  const handlePortraitPointer = (event: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(90, Math.max(10, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(84, Math.max(16, ((event.clientY - bounds.top) / bounds.height) * 100));
    const shift = ((x - 50) / 50) * 7;
    event.currentTarget.style.setProperty('--reveal-x', `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty('--reveal-y', `${y.toFixed(2)}%`);
    event.currentTarget.style.setProperty('--reveal-shift', `${shift.toFixed(2)}px`);
  };

  return (
    <div className={loaded ? 'site is-loaded' : 'site'}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="intro" aria-hidden="true">
        <div className="intro-rail"><span>Portfolio / 2026</span><span>Colombo · Sri Lanka</span></div>
        <div className="intro-sequence">
          <span>Understand deeply.</span>
          <span>Build deliberately.</span>
          <span>Verify honestly.</span>
        </div>
        <div className="intro-signature"><div className="intro-mark">HA<span>.</span></div><p>Clarity · evidence · delivery</p></div>
        <div className="intro-progress"><i /><span>00</span><b>100</b></div>
      </div>
      <div className="cursor-core" aria-hidden="true" />
      <div className="cursor-aura" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Himath Ahangama - home">
          <span>HA</span><i />
        </a>
        <nav className={menuOpen ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
          {[
            ['work', 'Work'],
            ['capabilities', 'Capabilities'],
            ['story', 'Story'],
            ['contact', 'Contact'],
          ].map(([id, label]) => (
            <a key={id} className={activeSection === id ? 'active' : ''} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-github" data-magnetic href="https://github.com/Himath2002" target="_blank" rel="noreferrer">
          <GitHubIcon /><span>GitHub</span><ArrowIcon />
        </a>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
          <span /><span />
        </button>
      </header>

      <main id="main">
        <section id="home" className="hero" ref={heroRef} onMouseMove={handleHeroPointer}>
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orb orb-one" aria-hidden="true" />
          <div className="hero-orb orb-two" aria-hidden="true" />
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span /> Software Engineer · Colombo, Sri Lanka</div>
            <h1 aria-label="Hard problems. Clear decisions. Software that delivers.">
              <span className="hero-line"><i>Hard problems<span className="accent-dot">.</span></i></span>
              <span className="hero-line"><i>Clear decisions<span className="accent-dot">.</span></i></span>
              <span className="hero-line outline"><i>Software that</i></span>
              <span className="hero-line"><i>delivers<span className="accent-dot">.</span></i></span>
            </h1>
            <p className="hero-lead">
              I bring product, systems, data, quality, and security together to turn demanding ideas into dependable results - from first architecture to verified delivery.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" data-magnetic href="#work">Explore the work <ArrowIcon /></a>
              <a className="button button-ghost" data-magnetic href="https://github.com/Himath2002" target="_blank" rel="noreferrer"><GitHubIcon /> View source</a>
            </div>
            <div className="achievement-strip" aria-label="Academic achievements">
              <div><AnimatedNumber value={80.63} decimals={2} delay={300} start={loaded} /><span>Course Weighted Average</span></div>
              <div><AnimatedNumber value={4} suffix="×" delay={300} start={loaded} /><span>Consecutive Dean&apos;s List</span></div>
              <div><strong>Distinction</strong><span>Degree classification</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Portrait of Himath Ahangama">
            <div className="portrait-orbit orbit-a" aria-hidden="true" />
            <div className="portrait-orbit orbit-b" aria-hidden="true" />
            <div
              className="portrait-frame"
              tabIndex={0}
              onMouseMove={handlePortraitPointer}
              aria-label="Interactive portrait. Move the pointer across the image to reveal the system view."
            >
              <div className="portrait-glow" aria-hidden="true" />
              <img className="portrait-base" src="/assets/himath-ahangama.jpg" alt="Himath Ahangama" />
              <div className="portrait-signal" aria-hidden="true">
                <img src="/assets/himath-ahangama.jpg" alt="" />
                <div className="portrait-signal-grid" />
                <span className="portrait-signal-crosshair" />
                <div className="portrait-signal-readout">
                  <span>System view</span>
                  <strong>Build / Assure / Secure</strong>
                </div>
              </div>
              <div className="portrait-reveal-hint" aria-hidden="true"><i /> Move to reveal</div>
            </div>
            <div className="floating-chip chip-build"><i /> Build</div>
            <div className="floating-chip chip-assure"><i /> Assure</div>
            <div className="floating-chip chip-secure"><i /> Secure</div>
            <div className="working-principle" aria-hidden="true">
              <div><span>Working principle</span><i>evidence-led</i></div>
              <strong>Understand → Build → Verify</strong>
              <p>Clear decisions at every boundary.</p>
            </div>
            <div className="hero-index" aria-hidden="true">01 / 05</div>
          </div>
          <a className="scroll-cue" href="#work"><span>Scroll to explore</span><i /></a>
        </section>

        <div className="capability-marquee" aria-hidden="true">
          <div>
            {[...Array(2)].map((_, group) => (
              <span key={group}>WEB ENGINEERING <i /> MOBILE <i /> SYSTEMS <i /> DATA <i /> TESTING &amp; QA <i /> SECURITY <i /> DEBUGGING <i /> GAME DEVELOPMENT <i /></span>
            ))}
          </div>
        </div>

        <section id="work" className="section work-section">
          <div className="section-heading" data-reveal>
            <div><span className="section-number">01</span><span className="eyebrow">Selected work</span></div>
            <h2>Engineering decisions,<br /><em>made visible.</em></h2>
            <p>Each case study shows a different problem shape - and the architecture, trade-offs, and verification used to solve it responsibly.</p>
          </div>

          <article className="flagship" data-reveal data-spotlight>
            <div className="flagship-topline"><span>Flagship platform</span><span>01 - EduGuard</span></div>
            <div className="flagship-copy">
              <div className="flagship-title">
                <span>Human-led academic integrity</span>
                <h3>Edu<span>Guard</span></h3>
              </div>
              <p>
                A multi-role academic-integrity platform that turns submission review, evidence analysis, marking, and feedback into one traceable workflow - while keeping judgement with people.
              </p>
              <div className="flagship-points">
                <span>React + TypeScript</span><span>FastAPI</span><span>PostgreSQL</span><span>Document analysis</span>
              </div>
              <a className="text-link" data-magnetic href="https://github.com/Himath2002/eduguard-integrity-platform" target="_blank" rel="noreferrer">Explore the engineering case study <ArrowIcon /></a>
            </div>
            <div className="flagship-visual">
              <div className="browser-shell">
                <div className="browser-bar"><span /><span /><span /><b>eduguard / integrity workspace</b></div>
                <img src="/assets/eduguard/login-dark.png" alt="EduGuard secure role-selection interface" />
              </div>
              <div className="role-stack" aria-label="EduGuard role experiences">
                <div><img src="/assets/eduguard/StudentLogin.png" alt="" /><span>Student</span></div>
                <div><img src="/assets/eduguard/LecturerLogin.png" alt="" /><span>Lecturer</span></div>
                <div><img src="/assets/eduguard/AdminLogin.png" alt="" /><span>Admin</span></div>
              </div>
            </div>
            <div className="flagship-proof">
              <div><AnimatedNumber value={3} /><span>Role-specific experiences</span></div>
              <div><AnimatedNumber value={375} /><span>Automated quality checks</span></div>
              <div><strong>Automated</strong><span>Evidence analysis pipeline</span></div>
              <div><strong>Human</strong><span>Final review &amp; decision</span></div>
            </div>
          </article>

          <div className="project-grid">
            {featuredProjects.map((project, index) => (
              <article className="project-card" data-reveal data-spotlight key={project.title}>
                <a className="project-visual" data-magnetic href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} repository`}>
                  <img src={project.image} alt={`${project.title} project overview`} loading="lazy" />
                  <span className="project-insight"><small>Engineering depth</small><strong>{project.insight}</strong></span>
                  <span className="project-open">Open repository <ArrowIcon /></span>
                  <span className="project-count">{String(index + 2).padStart(2, '0')}</span>
                </a>
                <div className="project-copy">
                  <div className="project-meta"><span>{project.eyebrow}</span><span>{String(index + 2).padStart(2, '0')} / 07</span></div>
                  <h3><a href={project.href} target="_blank" rel="noreferrer">{project.title}</a></h3>
                  <p>{project.description}</p>
                  <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="archive" data-reveal>
            <div className="archive-heading"><span>More engineering work</span><p>Focused projects, each preserved as a clear technical case study.</p></div>
            <div className="archive-list">
              {archiveProjects.map(([title, description, technology, href], index) => (
                <a href={href} target="_blank" rel="noreferrer" key={title}>
                  <span>{String(index + 8).padStart(2, '0')}</span><strong>{title}</strong><p>{description}</p><em>{technology}</em><ArrowIcon />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="capabilities" className="section capability-section">
          <div className="section-heading light-heading" data-reveal>
            <div><span className="section-number">02</span><span className="eyebrow">Engineering range</span></div>
            <h2>Versatility with<br /><em>a point of view.</em></h2>
            <p>Being an all-rounder is not about listing tools. It is about seeing how product, code, data, quality, and risk affect one another.</p>
          </div>
          <div className="capability-grid">
            {capabilities.map((capability) => (
              <article className="capability-card" data-reveal data-spotlight key={capability.title}>
                <div className="capability-card-top"><span>{capability.number}</span><i /></div>
                <h3>{capability.title}<span>.</span></h3>
                <strong>{capability.lead}</strong>
                <p>{capability.description}</p>
                <ul>{capability.list.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="principle-band" data-reveal>
            <span>My operating principle</span>
            <p>Understand deeply <i /> design deliberately <i /> verify honestly <i /> communicate clearly</p>
          </div>

        </section>

        <section id="story" className="section story-section">
          <div className="story-intro" data-reveal>
            <div><span className="section-number">03</span><span className="eyebrow">Foundation</span></div>
            <h2>High standards became<br /><em>a repeatable habit.</em></h2>
            <p>
              I approach software as a connected discipline: understand the real problem, make the structure legible, test what matters, and leave the work stronger than I found it.
            </p>
          </div>
          <div className="story-grid">
            <div className="story-portrait" data-reveal>
              <img src="/assets/himath-ahangama.jpg" alt="Himath Ahangama" loading="lazy" />
              <div><span>Based in Colombo</span><strong>Building without boundaries</strong></div>
            </div>
            <div className="timeline" data-reveal>
              <article>
                <span className="timeline-date">University</span>
                <div>
                  <h3>Bachelor of Computing</h3>
                  <p>Software Engineering Major · Curtin University · Completed with Distinction</p>
                  {transcriptUrl && (
                    <a className="transcript-link" href={transcriptUrl} target="_blank" rel="noreferrer">
                      Open academic eRecord <ArrowIcon />
                    </a>
                  )}
                </div>
                <strong>Distinction</strong>
              </article>
              <article>
                <span className="timeline-date">Academic record</span>
                <div><h3>Consistent high performance</h3><p>80.63 Course Weighted Average and Dean&apos;s List for four consecutive study periods</p></div>
                <strong>80.63</strong>
              </article>
              <article>
                <span className="timeline-date">Foundation</span>
                <div><h3>Nalanda College</h3><p>Colombo, Sri Lanka</p></div>
                <strong>Colombo</strong>
              </article>
            </div>
          </div>
          <div className="values" data-reveal>
            <div><span>01</span><strong>Clarity</strong><p>Make complexity understandable before making it impressive.</p></div>
            <div><span>02</span><strong>Ownership</strong><p>Care about the complete outcome, not only the assigned layer.</p></div>
            <div><span>03</span><strong>Evidence</strong><p>Let working software, tests, and honest documentation support every claim.</p></div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-orb" aria-hidden="true" />
          <div className="contact-copy" data-reveal>
            <span className="eyebrow">04 · Start a conversation</span>
            <h2>Have a difficult<br />problem worth <em>solving?</em></h2>
            <p>Explore the source, understand how I think, and choose the channel that best fits the conversation.</p>
            <div className="contact-directory" aria-label="Contact information">
              <a href="mailto:himath695@gmail.com">
                <span>Email</span><strong>himath695@gmail.com</strong><ArrowIcon />
              </a>
              <a href="tel:+94765806130">
                <span>Phone</span><strong>+94 76 580 6130</strong><ArrowIcon />
              </a>
              <a href="https://www.linkedin.com/in/himath-ahangama-a361a3402" target="_blank" rel="noreferrer">
                <span>LinkedIn</span><strong>Himath Ahangama</strong><ArrowIcon />
              </a>
              <a href="https://wa.me/94765806130" target="_blank" rel="noreferrer">
                <span>WhatsApp</span><strong>Start a direct chat</strong><ArrowIcon />
              </a>
            </div>
            <div className="contact-actions">
              <a className="button button-primary" data-magnetic href="https://github.com/Himath2002" target="_blank" rel="noreferrer"><GitHubIcon /> Visit GitHub <ArrowIcon /></a>
              <a className="button button-ghost" data-magnetic href="mailto:himath695@gmail.com">Send an email <ArrowIcon /></a>
            </div>
          </div>
          <div className="contact-mark" aria-hidden="true">HA<span>.</span></div>
        </section>
      </main>

      <footer className="site-footer">
        <div><strong>Himath Ahangama</strong><span>Software Engineer</span></div>
        <p>Designed and engineered with intent.</p>
        <div className="footer-links"><a href="#home">Back to top ↑</a><a href="mailto:himath695@gmail.com">Email ↗</a><a href="https://www.linkedin.com/in/himath-ahangama-a361a3402" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/Himath2002" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      </footer>
    </div>
  );
}

export default App;
