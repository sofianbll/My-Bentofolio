/* =============================================
   BENTOFOLIO v5 — App shell (router, theme, nav, footer)
   ============================================= */
import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { useTweaks } from './tweaks-panel.jsx';
import { Icon } from './ui.jsx';
import { HomeView } from './home.jsx';
import { ProjectsView, ProjectDetailView } from './projects.jsx';
import { ExperiencesView } from './experiences.jsx';
import { CvView } from './cv.jsx';
import { ContactView } from './contact.jsx';
import { APP_CONFIG } from './data.js';
import { OverlayMenu } from './overlay-menu.jsx';
import { resolveMotionMode, initSmoothScroll, reduceScrollDirection, shouldHideNav } from './motion.js';

const AdminView = import.meta.env.DEV
  ? React.lazy(() => import('./admin.jsx').then(m => ({ default: m.AdminView })))
  : null;
import './styles.css';
import './components.css';
import './pages.css';
import './dashboard.css';

const safeStorage = {
  get(key, fallback = null) {
    try {
      return window.localStorage.getItem(key) ?? fallback;
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Storage can be unavailable in sandboxed previews.
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // Storage can be unavailable in sandboxed previews.
    }
  },
};


const TWEAK_DEFAULTS = {
  accent: APP_CONFIG.appearance?.accent || '#6366f1',
  displayFont: APP_CONFIG.appearance?.displayFont || 'Syne',
  density: APP_CONFIG.appearance?.density || 'cozy',
  radius: APP_CONFIG.appearance?.radius || 'doux',
  photo: APP_CONFIG.appearance?.photo || 'compact',
  photoPosition: APP_CONFIG.appearance?.photoPosition || 'center 16%',
  photoPositionHome: APP_CONFIG.appearance?.photoPositionHome || APP_CONFIG.appearance?.photoPosition || '50% 18%',
  photoPositionCv: APP_CONFIG.appearance?.photoPositionCv || APP_CONFIG.appearance?.photoPosition || '50% 16%',
  cvPhoto: APP_CONFIG.cv?.cvPhoto || 'moyenne',
  cvPills: APP_CONFIG.cv?.cvPills || 'couleur',
  cvMaxBullets: APP_CONFIG.cv?.cvMaxBullets || 2,
  cvCardDensity: APP_CONFIG.cv?.cvCardDensity || 'normal',
  contactShowStatus: APP_CONFIG.contact?.contactShowStatus !== false,
  contactShowPhone: APP_CONFIG.contact?.contactShowPhone !== false,
  contactShowType: APP_CONFIG.contact?.contactShowType !== false,
  formspreeUrl: APP_CONFIG.contact?.formspreeUrl || '',
};

const DENSITY_GAP = { compact: '12px', cozy: '16px', large: '24px' };

const THEME_KEY = 'bentofolio.theme';
const NAV = [
{ path: '/', label: 'Accueil', icon: 'home' },
{ path: '/projets', label: 'Projets', icon: 'grid' },
{ path: '/experiences', label: 'Expériences', icon: 'briefcase' },
{ path: '/cv', label: 'CV', icon: 'cv' },
{ path: '/contact', label: 'Contact', icon: 'mail' }];


function parseHash() {
  const h = (location.hash || '#/').replace(/^#/, '');
  return h.startsWith('/') ? h : '/' + h;
}

function Navbar({ route, navigate, theme, toggleTheme, adminMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const scrollRef = useRef({ y: window.scrollY, dir: 'up' });
  const rafRef = useRef(0);
  const burgerRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const currentY = window.scrollY;
        const { dir, y } = reduceScrollDirection({
          lastY: scrollRef.current.y,
          currentY,
          lastDir: scrollRef.current.dir,
        });
        scrollRef.current = { y, dir };
        setNavHidden(shouldHideNav(dir, currentY));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  const first = APP_CONFIG.profile?.firstName || '';
  const last = APP_CONFIG.profile?.lastName || '';
  const brandName = (first + ' ' + (last ? last.charAt(0).toUpperCase() + '.' : '')).trim() || 'Portfolio';
  const handleNav = (path) => { navigate(path); setMenuOpen(false); };
  const closeMenu = () => { setMenuOpen(false); burgerRef.current?.focus(); };
  return (
    <>
      <nav className={'navbar no-print' + (navHidden && !menuOpen ? ' navbar-hidden' : '')}>
        <div className="nav-inner">
          <button className="nav-brand" onClick={() => handleNav('/')}>
            <span className="brand-name">{brandName}</span>
            <span className="brand-dot">·</span>
            <span className="brand-tag">portfolio</span>
          </button>
          <div className="nav-menu">
            {NAV.map((n) => {
              const active = route === n.path || (n.path === '/projets' && route.startsWith('/projet'));
              return (
                <button key={n.path} className={'nav-link' + (active ? ' active' : '')} onClick={() => handleNav(n.path)}>
                  {n.label}
                </button>);
            })}
          </div>
          <div className="nav-controls">
            {adminMode && (
              <button className="nav-admin-badge" onClick={() => navigate('/admin')} title="Mode admin actif">
                <span className="nav-admin-dot" />
                Admin
              </button>
            )}
            <button className="icon-btn" aria-label="Changer le thème" onClick={toggleTheme}>
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
            </button>
            <button
              className="icon-btn hamburger-btn"
              aria-label={menuOpen ? 'Fermer le menu' : 'Menu'}
              aria-expanded={menuOpen}
              aria-controls="menu-overlay"
              ref={burgerRef}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name={menuOpen ? 'x' : 'menu'} size={18} />
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <OverlayMenu
          nav={NAV}
          route={route}
          onNavigate={handleNav}
          onClose={closeMenu}
        />
      )}
    </>
  );
}

function Footer({ navigate }) {
  const year = new Date().getFullYear();
  const first = APP_CONFIG.profile?.firstName || '';
  const last = APP_CONFIG.profile?.lastName || '';
  const gh = (APP_CONFIG.socialLinks || []).find(l => (l.icon === 'github' || (l.label || '').toLowerCase().includes('github')));
  const ghHref = gh?.href || 'https://github.com/';
  return (
    <footer className="app-footer no-print">
      <div className="footer-inner">
        <span className="footer-copy">© {year} {first} {last} — {APP_CONFIG.profile?.role || 'Portfolio'}</span>
        <div className="footer-links">
          <button className="footer-link" onClick={() => navigate('/projets')}>Projets</button>
          <button className="footer-link" onClick={() => navigate('/cv')}>CV</button>
          {import.meta.env.DEV && <button className="footer-link is-private" onClick={() => navigate('/admin')}>Espace admin</button>}
          <a className="footer-link" href={ghHref} target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
    </footer>);

}

const ADMIN_AUTH_KEY = 'bentofolio.admin.auth';

function App() {
  const [route, setRoute] = useState(parseHash());
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [toast, setToast] = useState(null);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [adminMode, setAdminMode] = useState(() => {
    if (!import.meta.env.DEV) return false;
    if (window !== window.top) return false;
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });
  const isPreview = window.location.search.includes('preview')

  const activateAdmin = () => { localStorage.setItem(ADMIN_AUTH_KEY, 'true'); setAdminMode(true); };
  const deactivateAdmin = () => { localStorage.removeItem(ADMIN_AUTH_KEY); setAdminMode(false); };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand', tweaks.accent);
    root.style.setProperty('--bento-gap', DENSITY_GAP[tweaks.density] || '16px');
    root.style.setProperty('--font-display', `'${tweaks.displayFont}', 'Syne', sans-serif`);
    root.setAttribute('data-photo', tweaks.photo);
    root.style.setProperty('--photo-position', tweaks.photoPositionHome || tweaks.photoPosition || '50% 18%');
    root.style.setProperty('--photo-position-home', tweaks.photoPositionHome || tweaks.photoPosition || '50% 18%');
    root.style.setProperty('--photo-position-cv', tweaks.photoPositionCv || tweaks.photoPosition || '50% 16%');
    root.setAttribute('data-cv-photo', tweaks.cvPhoto);
    root.setAttribute('data-cv-pills', tweaks.cvPills);
    root.setAttribute('data-cv-density', tweaks.cvCardDensity);
    root.setAttribute('data-radius', tweaks.radius);
  }, [tweaks]);

  useEffect(() => {
    const onHash = () => {setRoute(parseHash());window.scrollTo(0, 0);};
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const isDash = route === '/admin' && adminMode && AdminView;

  // Motion runtime (ADR-0001): Lenis smooth scroll only in 'full' mode,
  // never in the admin dashboard route nor in a preview frame.
  useEffect(() => {
    const mode = resolveMotionMode({
      isPreviewFrame: isPreview,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      viewTransitionsSupported: 'startViewTransition' in document,
    });
    if (mode !== 'full' || isDash) return undefined;
    return initSmoothScroll();
  }, [route, isDash, isPreview]);

  useEffect(() => {
    if (isPreview) document.documentElement.classList.add('is-preview')
  }, [isPreview])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    safeStorage.set(THEME_KEY, theme);
  }, [theme]);

  const navigate = useCallback((path) => {
    if (parseHash() === path) {window.scrollTo(0, 0);return;}
    location.hash = '#' + path;
  }, []);
  const toggleTheme = () => setTheme((t) => t === 'light' ? 'dark' : 'light');
  const openProject = (id) => {location.hash = '#/projet/' + id;};
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(window.__toastT);
    window.__toastT = setTimeout(() => setToast(null), 2600);
  };

  let view;
  if (route.startsWith('/projet/')) view = <ProjectDetailView id={route.slice('/projet/'.length)} navigate={navigate} openProject={openProject} />;
  else if (route === '/projets') view = <ProjectsView navigate={navigate} openProject={openProject} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />;
  else if (route === '/experiences') view = <ExperiencesView navigate={navigate} />;
  else if (route === '/cv') view = <CvView navigate={navigate} showToast={showToast} tweaks={tweaks} setTweak={setTweak} adminMode={adminMode} />;
  else if (route === '/contact') view = <ContactView navigate={navigate} showToast={showToast} tweaks={tweaks} adminMode={adminMode} />;
  else if (route === '/admin' && AdminView) view = <Suspense fallback={null}><AdminView navigate={navigate} showToast={showToast} adminMode={adminMode} onLogin={activateAdmin} onLogout={deactivateAdmin} /></Suspense>;
  else view = <HomeView navigate={navigate} openProject={openProject} />;

  return (
    <div className="app">
      <div className="mesh-bg" aria-hidden="true" />
      <div className="grain-overlay no-print" aria-hidden="true" />
      {!isDash && <Navbar route={route} navigate={navigate} theme={theme} toggleTheme={toggleTheme} adminMode={adminMode} />}
      {isDash ? view : <div className="view-anim" key={route}>{view}</div>}
      {!isDash && <Footer navigate={navigate} />}
      <div className={'toast no-print' + (toast ? ' show' : '')}><Icon name="check" size={15} /> {toast}</div>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
