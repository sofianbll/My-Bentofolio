/* =============================================
   BENTOFOLIO v5 — Fullscreen overlay menu
   Numbered links in display type, availability
   badge + social links at the footer row.
   Closes via Escape / backdrop / link click.
   Focus is trapped while open.
   ============================================= */
import React, { useEffect, useRef } from 'react';
import { Icon } from './ui.jsx';
import { APP_CONFIG } from './data.js';

const pad = (n) => String(n).padStart(2, '0');

function OverlayMenu({ nav, route, onNavigate, onClose }) {
  const panelRef = useRef(null);
  const socials = APP_CONFIG.socialLinks || [];
  const alternance = APP_CONFIG.profile?.alternance || {};

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = () => Array.from(
      panelRef.current?.querySelectorAll('button, a[href]') || []
    ).filter((el) => !el.disabled);

    // Initial focus: the active link, or the close button as fallback.
    const links = focusables();
    const target = links.find((el) => el.dataset.active === 'true') || links[0];
    target?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleLink = (path) => { onNavigate(path); };

  return (
    <div
      className="menu-overlay no-print"
      id="menu-overlay"
      data-testid="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
      onClick={onClose}
    >
      <div className="menu-overlay-panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <button
          className="icon-btn menu-overlay-close"
          aria-label="Fermer le menu"
          data-testid="menu-close"
          onClick={onClose}
        >
          <Icon name="x" size={22} />
        </button>

        <nav className="menu-overlay-nav" aria-label="Navigation principale">
          {nav.map((n, i) => {
            const active = route === n.path || (n.path === '/projets' && route.startsWith('/projet'));
            return (
              <button
                key={n.path}
                className={'menu-overlay-link' + (active ? ' active' : '')}
                style={{ animationDelay: `${0.05 * i}s` }}
                data-active={active ? 'true' : undefined}
                onClick={() => handleLink(n.path)}
              >
                <span className="menu-overlay-num">{pad(i + 1)}</span>
                <span className="menu-overlay-label">{n.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="menu-overlay-footer">
          <span className="menu-overlay-status">
            <span className="menu-overlay-status-dot" />
            Disponible en alternance — début {alternance.start || 'sept. 2026'}
          </span>
          {socials.length > 0 && (
            <div className="menu-overlay-socials">
              {socials.map((l) => (
                <a key={l.icon + l.href} className="menu-overlay-social" href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}>
                  <Icon name={l.icon} size={18} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { OverlayMenu };
