/* =============================================
   BENTOFOLIO — INTERACTIONS
   ============================================= */

// ─── Dark Mode Toggle ───
const toggle = document.getElementById('theme-toggle');
const html   = document.documentElement;

// Init: check saved pref → OS pref → default light
const saved = localStorage.getItem('bf-theme');
if (saved) {
    html.dataset.theme = saved;
} else {
    html.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

toggle.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('bf-theme', next);
});


// ─── Mouse Tracking Glow ───
const grid = document.getElementById('bento-grid');
if (grid) {
    grid.addEventListener('mousemove', (e) => {
        const cards = grid.querySelectorAll('.bento-glow');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--y', `${e.clientY - rect.top}px`);
        }
    });
}
