/* ============================================
   PORTFOLIO TEMPLATE — SCRIPTS
   Right-side ruler, CTA tracking, live GitHub data
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // Honor the user's reduced-motion preference for JS-driven motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── PRELOADER ──
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) preloader.classList.add('hidden');
            document.body.classList.add('loaded');
        }, 1200);
    });

    // ── CINEMATIC ENTRY GATE + AMBIENT AUDIO (home page only) ──
    // First visit per session shows a "Begin experience" gate; the click is the
    // user gesture that unlocks looping background audio. Choice persists in
    // localStorage; a floating toggle is always available. Degrades gracefully
    // if the audio file is missing and is skipped under reduced-motion.
    const entryGate = document.getElementById('entryGate');
    const bgAudio = document.getElementById('bgAudio');
    const audioToggle = document.getElementById('audioToggle');
    if (entryGate && bgAudio && audioToggle) {
        const AUDIO_PREF = 'ak-audio-pref'; // 'on' | 'off'  (localStorage)
        const ENTERED = 'ak-entered';       // '1'           (sessionStorage)
        bgAudio.volume = 0.35;

        const reflectState = (playing) => {
            audioToggle.classList.toggle('playing', playing);
            audioToggle.setAttribute('aria-pressed', String(playing));
            audioToggle.setAttribute('aria-label', playing ? 'Mute background sound' : 'Play background sound');
        };

        // Lazy-load the source on first play so visitors who never opt into sound
        // (and the interim period before the file exists) incur no audio fetch.
        // play() can reject (autoplay blocked, or the file is missing) — never throw.
        const playAudio = () => {
            if (!bgAudio.src && bgAudio.dataset.src) bgAudio.src = bgAudio.dataset.src;
            const p = bgAudio.play();
            if (p && typeof p.catch === 'function') p.catch(() => reflectState(false));
        };

        // ── Gate name cycle (multi-language) + Claude-Code-style status line ──
        // The first name cycles through scripts, lands on English, then a rotating
        // data/LLM status line types under it. Edit these two arrays to taste.
        const NAME_FORMS = ['Jane', 'ジェーン', 'جين', 'Джейн', '제인', 'Jane'];
        const STATUS_LINES = [
            'fine-tuning on domain data',
            'tokenizing the corpus',
            'updating model parameters',
            'embedding 1.2M rows',
            'turning data into decisions',
            'querying the latent space'
        ];
        const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let gateTimers = [];
        let gateMoveHandler = null;
        const clearGate = () => {
            gateTimers.forEach(clearInterval);
            gateTimers = [];
            if (gateMoveHandler) { window.removeEventListener('mousemove', gateMoveHandler); gateMoveHandler = null; }
        };

        const startGateSequence = () => {
            const nameEl = document.getElementById('gateNameText');
            const statusEl = document.getElementById('gateStatus');
            const statusTextEl = document.getElementById('gateStatusText');
            const spinnerEl = document.getElementById('gateSpinner');
            if (!nameEl) return;

            // Cursor-reactive parallax: the gate content leans toward the pointer.
            const inner = entryGate.querySelector('.entry-gate-inner');
            if (inner && !prefersReducedMotion) {
                gateMoveHandler = (e) => {
                    const dx = e.clientX / window.innerWidth - 0.5;
                    const dy = e.clientY / window.innerHeight - 0.5;
                    inner.style.transform =
                        `translate(${dx * 26}px, ${dy * 20}px) rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg)`;
                };
                window.addEventListener('mousemove', gateMoveHandler);
            }

            // 1) Cycle the name through scripts, then settle on English.
            let n = 0;
            nameEl.textContent = NAME_FORMS[0];
            const nameTimer = setInterval(() => {
                n++;
                nameEl.textContent = NAME_FORMS[n];
                nameEl.classList.remove('swap'); void nameEl.offsetWidth; nameEl.classList.add('swap');
                if (n >= NAME_FORMS.length - 1) {
                    clearInterval(nameTimer);
                    if (statusEl) startStatus(statusEl, statusTextEl, spinnerEl);
                }
            }, 560);
            gateTimers.push(nameTimer);
        };

        const startStatus = (statusEl, statusTextEl, spinnerEl) => {
            statusEl.classList.add('visible');
            let s = 0, f = 0;
            const setPhrase = () => { statusTextEl.textContent = STATUS_LINES[s++ % STATUS_LINES.length]; };
            setPhrase();
            gateTimers.push(setInterval(setPhrase, 2400));
            gateTimers.push(setInterval(() => { spinnerEl.textContent = SPINNER[f++ % SPINNER.length]; }, 90));
        };

        const revealSite = () => {
            clearGate();
            entryGate.classList.remove('active');
            document.body.classList.remove('no-scroll');
            if (preloader) preloader.classList.add('hidden');
            audioToggle.hidden = false;
            setTimeout(() => { entryGate.style.display = 'none'; }, 950);
        };

        const enter = (withSound) => {
            sessionStorage.setItem(ENTERED, '1');
            localStorage.setItem(AUDIO_PREF, withSound ? 'on' : 'off');
            if (withSound) playAudio();
            revealSite();
        };

        document.getElementById('enterSound').addEventListener('click', () => enter(true));
        document.getElementById('enterSilent').addEventListener('click', () => enter(false));

        // Drive the toggle off the element's REAL state. 'playing' only fires when
        // audio actually starts, so a missing file never shows a false "playing".
        bgAudio.addEventListener('playing', () => reflectState(true));
        bgAudio.addEventListener('pause', () => reflectState(false));
        bgAudio.addEventListener('ended', () => reflectState(false));
        bgAudio.addEventListener('error', () => reflectState(false));

        audioToggle.addEventListener('click', () => {
            if (bgAudio.paused) {
                localStorage.setItem(AUDIO_PREF, 'on');
                playAudio();
            } else {
                localStorage.setItem(AUDIO_PREF, 'off');
                bgAudio.pause();
            }
        });

        const alreadyEntered = sessionStorage.getItem(ENTERED) === '1';
        if (!alreadyEntered && !prefersReducedMotion) {
            entryGate.classList.add('active');
            document.body.classList.add('no-scroll');
            startGateSequence();
        } else {
            // No gate: open the site, expose the toggle, honour the saved choice.
            entryGate.style.display = 'none';
            audioToggle.hidden = false;
            // Honour the saved choice. play() may be blocked until a gesture; the
            // 'playing'/'pause' events keep the icon honest either way.
            if (localStorage.getItem(AUDIO_PREF) === 'on') playAudio();
        }
    }

    // ── CUSTOM CURSOR ──
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        }
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
        }
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover expansion
    function addCursorHover(el) {
        el.addEventListener('mouseenter', () => {
            if (cursorDot) cursorDot.classList.add('expand');
            if (cursorRing) cursorRing.classList.add('expand');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorDot) cursorDot.classList.remove('expand');
            if (cursorRing) cursorRing.classList.remove('expand');
        });
    }

    document.querySelectorAll('a, button, .btn, .skill-ribbon-item, .capability-tile, .social-link, .floating-cta, .nav-link').forEach(addCursorHover);

    // ── VERTICAL RULER (RIGHT SIDE) + CTA TRACKING ──
    const rulerTriangle = document.getElementById('rulerTriangle');
    const rulerScanline = document.getElementById('rulerScanline');
    const rulerTicks = document.getElementById('rulerTicks');
    const floatingCta = document.getElementById('floatingCta');
    const sections = ['hero', 'about', 'capabilities', 'creator', 'skills', 'experience', 'contact'];
    const sectionLabels = {};
    sections.forEach(s => {
        sectionLabels[s] = document.getElementById('rulerLabel-' + s);
    });

    // Generate tick marks (LEFT side)
    if (rulerTicks) {
        const rulerHeight = window.innerHeight - 100;
        const tickSpacing = 14;
        const tickCount = Math.floor(rulerHeight / tickSpacing);
        for (let i = 0; i <= tickCount; i++) {
            const tick = document.createElement('div');
            tick.className = 'ruler-tick';
            tick.style.top = (60 + i * tickSpacing) + 'px';
            if (i % 5 === 0) tick.classList.add('major');
            rulerTicks.appendChild(tick);
        }
    }

    function updateRuler() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
        const rulerHeight = window.innerHeight - 100;
        const triY = 60 + scrollFraction * rulerHeight;

        if (rulerTriangle) rulerTriangle.style.top = triY + 'px';
        if (rulerScanline) rulerScanline.style.top = triY + 'px';

        // Floating CTA stays on the RIGHT, follows scroll vertically
        if (floatingCta) {
            floatingCta.style.top = triY + 'px';
            floatingCta.style.transform = 'translateY(-50%)';
        }

        // Section labels
        sections.forEach(name => {
            const el = document.getElementById(name);
            const label = sectionLabels[name];
            if (!el || !label) return;
            const rect = el.getBoundingClientRect();
            const inView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.3;
            label.classList.toggle('active', inView);
            if (inView) {
                label.style.top = triY + 'px';
            }
        });

        // Active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        let activeSection = 'hero';
        sections.forEach(name => {
            const el = document.getElementById(name);
            if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
                activeSection = name;
            }
        });
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Only manage in-page (#hash) links. Cross-page links (e.g. the
            // current subpage's own nav item) keep the active state authored in HTML.
            if (!href || !href.startsWith('#')) return;
            link.classList.toggle('active', href === '#' + activeSection);
        });

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollTop > 80);
        }
    }

    window.addEventListener('scroll', updateRuler, { passive: true });
    updateRuler();

    // ── GITHUB CONTRIBUTIONS COUNTER (real 2026 count, count-up only) ──
    // Mirrors into every .js-contrib-count element (navbar + mobile menu + #gh-contribs)
    const contribEls = document.querySelectorAll('.js-contrib-count');
    let contributionsTarget = 250; // fallback — overwritten by loadGitHub() on success
    let synapseCurrent = 0;
    let synapseStarted = false;
    const setContrib = (val) => contribEls.forEach(el => { el.textContent = val.toLocaleString(); });

    function animateSynapse() {
        // Reset counter so re-runs from 0 feel smooth
        synapseCurrent = 0;
        synapseStarted = true;
        function tick() {
            if (synapseCurrent < contributionsTarget) {
                const step = Math.max(1, Math.floor((contributionsTarget - synapseCurrent) / 40));
                synapseCurrent = Math.min(synapseCurrent + step, contributionsTarget);
                setContrib(synapseCurrent);
                requestAnimationFrame(tick);
            }
        }
        tick();
    }

    // ── LIVE GITHUB DATA MODULE ──
    // Fetches contributions + repo count. Graceful fallback on any failure.
    async function loadGitHub() {
        // -- Contributions & heatmap (all years, for the all-time total) --
        try {
            const resp = await fetch('https://github-contributions-api.jogruber.de/v4/yourusername?y=all');
            if (!resp.ok) throw new Error('contrib fetch failed');
            const d = await resp.json();

            // All-time total → the navbar/mobile counter ("GitHub contributions").
            const allTime = typeof d.total === 'number'
                ? d.total
                : Object.values(d.total || {}).reduce((a, b) => a + b, 0);
            if (allTime > 0) {
                contributionsTarget = allTime;
                if (prefersReducedMotion) {
                    setContrib(contributionsTarget);
                } else {
                    animateSynapse();
                }
            }

            // Current-year total → the About "2026 Contributions" stat (decoupled
            // from the navbar count-up so they can show different numbers).
            const yearTotal = d.total && typeof d.total === 'object' ? d.total['2026'] : null;
            const contribEl = document.getElementById('gh-contribs');
            if (contribEl && yearTotal != null) contribEl.textContent = yearTotal.toLocaleString();

            // Longest streak across ALL history (max consecutive days with count > 0).
            // Walking forward means future zero-days simply end runs — no date filtering.
            const contributions = Array.isArray(d.contributions) ? d.contributions : [];
            let longestStreak = 0, currentRun = 0;
            for (let i = 0; i < contributions.length; i++) {
                if (contributions[i].count > 0) {
                    currentRun++;
                    if (currentRun > longestStreak) longestStreak = currentRun;
                } else {
                    currentRun = 0;
                }
            }
            const streakEl = document.getElementById('gh-streak');
            if (streakEl) streakEl.textContent = longestStreak;

            // Heatmap shows the most recent ~53 weeks, not all of history.
            renderHeatmap(contributions.slice(-371));
        } catch (e) {
            console.debug('[gh] contributions fetch skipped:', e && e.message);
            // Hide heatmap band gracefully
            const activityEl = document.querySelector('.gh-activity');
            if (activityEl) activityEl.style.display = 'none';
        }

        // -- Repo count --
        try {
            const resp = await fetch('https://api.github.com/users/yourusername');
            if (!resp.ok) throw new Error('github user fetch failed');
            const u = await resp.json();
            const reposEl = document.getElementById('gh-repos');
            if (reposEl && u.public_repos != null) reposEl.textContent = u.public_repos;
        } catch (e) {
            console.debug('[gh] user fetch skipped:', e && e.message);
        }
    }

    function renderHeatmap(contributions) {
        const container = document.getElementById('ghHeatmap');
        if (!container) return;
        if (!contributions || contributions.length === 0) {
            const activityEl = document.querySelector('.gh-activity');
            if (activityEl) activityEl.style.display = 'none';
            return;
        }
        // Build cells — one <span> per day
        const frag = document.createDocumentFragment();
        contributions.forEach(({ level }) => {
            const cell = document.createElement('span');
            cell.className = 'gh-cell l' + Math.min(4, Math.max(0, level || 0));
            frag.appendChild(cell);
        });
        container.appendChild(frag);
    }

    // Kick off data load (non-blocking — failures silently fall back)
    loadGitHub();

    // Initial count-up with fallback value (will re-run if loadGitHub succeeds first,
    // but the preloader delay means loadGitHub usually wins the race)
    if (prefersReducedMotion) {
        setContrib(contributionsTarget);
    } else {
        setTimeout(() => {
            if (!synapseStarted) animateSynapse();
        }, 1400);
    }

    // ── SCROLL REVEAL ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));

    // ── CAPABILITY TILE CURSOR GLOW ──
    document.querySelectorAll('.capability-tile').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--cursor-x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--cursor-y', (e.clientY - rect.top) + 'px');
        });
    });

    // ── PARALLAX ON ABOUT PHOTO ──
    const aboutPhoto = document.querySelector('.about-photo');
    if (aboutPhoto && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const rect = aboutPhoto.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const parallax = (rect.top - window.innerHeight / 2) * 0.04;
                aboutPhoto.style.transform = `translateY(${parallax}px)`;
            }
        }, { passive: true });
    }

    // ── MOBILE MENU ──
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobileOverlay');
    if (hamburger && mobileOverlay) {
        const setMenu = (open) => {
            hamburger.classList.toggle('active', open);
            mobileOverlay.classList.toggle('active', open);
            document.body.classList.toggle('no-scroll', open);
            hamburger.setAttribute('aria-expanded', String(open));
            hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };
        hamburger.addEventListener('click', () => {
            setMenu(!hamburger.classList.contains('active'));
        });
        mobileOverlay.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });
        // Close on Escape for keyboard users
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && hamburger.classList.contains('active')) setMenu(false);
        });
    }

    // ── MAGNETIC BUTTONS ──
    document.querySelectorAll('.btn, .floating-cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ── FOOTER YEAR (auto-updates so it never goes stale) ──
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── SMOOTH SCROLL ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
