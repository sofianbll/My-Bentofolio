import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173';

test.describe('Bentofolio - Public UX', () => {
  test('Home page loads with hero, bento grid, nav', async ({ page }) => {
    await page.goto(BASE + '/index.html#/');
    await page.waitForSelector('.hero-name', { timeout: 5000 });
    await expect(page.locator('.hero-name')).toBeVisible();
    await expect(page.locator('.bento')).toBeVisible();
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('Projects page loads with gallery', async ({ page }) => {
    await page.goto(BASE + '/index.html#/projets');
    await page.waitForSelector('.story-section', { timeout: 5000 });
    // Default mode is Stories; switching to Index shows the dense gallery
    await page.locator('.mode-toggle-btn').filter({ hasText: 'Index' }).click();
    await page.waitForSelector('.proj-gallery', { timeout: 5000 });
    await expect(page.locator('.proj-card').first()).toBeVisible();
  });

  test('Projects toolbar keeps filters and sorting in stable zones', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE + '/index.html#/projets');
    await page.waitForSelector('.story-section', { timeout: 5000 });

    await expect(page.locator('.filter-chips')).toBeVisible();
    await expect(page.locator('.filter-actions')).toBeVisible();
    await expect(page.locator('.sort-select')).toBeVisible();
    await expect(page.locator('.filter-result')).toBeVisible();

    const chipsBox = await page.locator('.filter-chips').boundingBox();
    const actionsBox = await page.locator('.filter-actions').boundingBox();
    expect(chipsBox).not.toBeNull();
    expect(actionsBox).not.toBeNull();
    expect(actionsBox.x).toBeGreaterThan(chipsBox.x);
    expect(Math.abs(actionsBox.y - chipsBox.y)).toBeLessThan(24);

    const shellMaxWidths = await page.evaluate(() => ({
      page: window.getComputedStyle(document.querySelector('.page-wrap')).maxWidth,
      nav: window.getComputedStyle(document.querySelector('.navbar')).maxWidth,
      footer: window.getComputedStyle(document.querySelector('.footer-inner')).maxWidth,
    }));
    expect(shellMaxWidths).toEqual({ page: '1440px', nav: '1440px', footer: '1440px' });
  });

  test('Experiences page loads', async ({ page }) => {
    await page.goto(BASE + '/index.html#/experiences');
    await page.waitForSelector('.page-title', { timeout: 5000 });
    await expect(page.locator('.page-title')).toContainText('Expériences');
  });

  test('CV page loads with A4 frame', async ({ page }) => {
    await page.goto(BASE + '/index.html#/cv');
    await page.waitForSelector('.a4-page', { timeout: 5000 });
    await expect(page.locator('.cv-name')).toBeVisible();
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto(BASE + '/index.html#/contact');
    await page.waitForSelector('.page-title', { timeout: 5000 });
    await expect(page.locator('.page-title')).toContainText('Contact');
  });

  test('Navigation between pages works', async ({ page }) => {
    await page.goto(BASE + '/index.html#/');
    await page.waitForSelector('.navbar', { timeout: 5000 });

    await page.locator('.nav-link').filter({ hasText: 'Projets' }).click();
    await page.waitForSelector('.story-section', { timeout: 5000 });

    await page.locator('.nav-link').filter({ hasText: 'Expériences' }).click();
    await page.waitForSelector('.page-title', { timeout: 5000 });
    await expect(page.locator('.page-title')).toContainText('Expériences');

    await page.locator('.nav-link').filter({ hasText: 'CV' }).click();
    await page.waitForSelector('.a4-page', { timeout: 5000 });

    await page.locator('.nav-link').filter({ hasText: 'Contact' }).click();
    await expect(page.locator('.page-title')).toContainText('Contact');
  });
});

test.describe('Motion + Navigation', () => {
  test('Nav hides on scroll down and reappears on scroll up', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE + '/index.html#/');
    await page.waitForSelector('.navbar', { timeout: 5000 });

    const scrollable = await page.evaluate(() => document.documentElement.scrollHeight > 800);
    expect(scrollable).toBe(true);

    await page.evaluate(() => window.scrollTo(0, 800));
    await expect(page.locator('.navbar')).toHaveClass(/navbar-hidden/);

    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(page.locator('.navbar')).not.toHaveClass(/navbar-hidden/);
  });

  test('Burger opens fullscreen overlay with 5 numbered links, active in brand color, Escape closes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE + '/index.html#/');
    await page.waitForSelector('.navbar', { timeout: 5000 });

    await page.locator('.hamburger-btn').click();
    const overlay = page.locator('[data-testid="menu-overlay"]');
    await expect(overlay).toBeVisible();

    const links = page.locator('.menu-overlay-link');
    await expect(links).toHaveCount(5);
    const numbers = await page.locator('.menu-overlay-num').allTextContents();
    expect(numbers).toEqual(['01', '02', '03', '04', '05']);

    const activeColor = await links.filter({ hasText: 'Accueil' }).evaluate(el => window.getComputedStyle(el).color);
    const inactiveColor = await links.filter({ hasText: 'Contact' }).evaluate(el => window.getComputedStyle(el).color);
    expect(activeColor).not.toBe(inactiveColor);
    expect(activeColor).not.toBe('');

    await page.keyboard.press('Escape');
    await expect(overlay).toHaveCount(0);
  });

  test('Clicking a link inside the overlay navigates and closes the overlay', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE + '/index.html#/');
    await page.waitForSelector('.navbar', { timeout: 5000 });

    await page.locator('.hamburger-btn').click();
    const overlay = page.locator('[data-testid="menu-overlay"]');
    await expect(overlay).toBeVisible();

    await page.locator('.menu-overlay-link').filter({ hasText: 'Projets' }).click();
    await page.waitForSelector('.story-section', { timeout: 5000 });
    await expect(overlay).toHaveCount(0);
    expect(await page.evaluate(() => location.hash)).toBe('#/projets');
  });

  test('No console errors during motion and navigation flows', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE + '/index.html#/');
    await page.waitForSelector('.navbar', { timeout: 5000 });

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);

    await page.locator('.hamburger-btn').click();
    await expect(page.locator('[data-testid="menu-overlay"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="menu-overlay"]')).toHaveCount(0);

    await page.locator('.hamburger-btn').click();
    await page.locator('.menu-overlay-link').filter({ hasText: 'Expériences' }).click();
    await page.waitForSelector('.page-title', { timeout: 5000 });

    expect(pageErrors).toEqual([]);
  });
});

test.describe('Hero cinétique (T02)', () => {
  test('Full motion: hero reveal animation is wired', async ({ page }) => {
    await page.goto(BASE + '/index.html#/');
    await page.waitForSelector('.hero-name', { timeout: 5000 });
    const anim = await page.locator('.hero-reveal-inner').first().evaluate(el => getComputedStyle(el).animationName);
    expect(anim).toBe('heroLineIn');
    await expect(page.locator('.hero-name')).toBeVisible();
    await expect(page.locator('.hero-role')).toBeVisible();
  });

  test('Grain overlay is present, inert and excluded from print', async ({ page }) => {
    await page.goto(BASE + '/index.html#/');
    await page.waitForSelector('.grain-overlay', { timeout: 5000 });
    const grain = await page.locator('.grain-overlay').evaluate(el => {
      const s = getComputedStyle(el);
      return { pointerEvents: s.pointerEvents, position: s.position, zIndex: s.zIndex, bg: s.backgroundImage };
    });
    expect(grain.pointerEvents).toBe('none');
    expect(grain.position).toBe('fixed');
    expect(parseInt(grain.zIndex)).toBeLessThan(1000);
    expect(grain.bg).toContain('data:image/svg+xml');
  });

  test.describe('reduced motion', () => {
    // Explicit context: test.use({ reducedMotion }) is not reliably applied
    // inside a nested describe with this Playwright version.
    test('Hero content visible, no persistent transform, bento cells visible', async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(BASE + '/index.html#/');
      await page.waitForSelector('.hero-name', { timeout: 5000 });
      await expect(page.locator('.hero-name')).toBeVisible();
      await expect(page.locator('.hero-role')).toBeVisible();
      await expect(page.locator('.hero-meta')).toBeVisible();

      const mediaReduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
      expect(mediaReduced).toBe(true);

      const inners = page.locator('.hero-reveal-inner');
      const count = await inners.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const transform = await inners.nth(i).evaluate(el => getComputedStyle(el).transform);
        expect(transform).toBe('none');
        const anim = await inners.nth(i).evaluate(el => getComputedStyle(el).animationName);
        expect(anim).toBe('none');
      }

      await expect(page.locator('.bento .cell').first()).toBeVisible();
      const cellTransform = await page.locator('.bento .cell').first().evaluate(el => getComputedStyle(el).transform);
      expect(cellTransform === 'none' || cellTransform === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);
      await context.close();
    });
  });

  test.describe('preview mode', () => {
    test('is-preview neutralises hero reveal and cell animations', async ({ page }) => {
      await page.goto(BASE + '/index.html?preview#/');
      await page.waitForSelector('.hero-name', { timeout: 5000 });
      const isPreview = await page.evaluate(() => document.documentElement.classList.contains('is-preview'));
      expect(isPreview).toBe(true);
      await expect(page.locator('.hero-name')).toBeVisible();

      const inner = page.locator('.hero-reveal-inner').first();
      const transform = await inner.evaluate(el => getComputedStyle(el).transform);
      expect(transform).toBe('none');
      const anim = await inner.evaluate(el => getComputedStyle(el).animationName);
      expect(anim).toBe('none');

      await expect(page.locator('.bento .cell').first()).toBeVisible();
    });
  });
});
test.describe('Bentofolio - Admin UX', () => {
  test('Admin login page shows password input', async ({ page }) => {
    await page.goto(BASE + '/index.html#/admin');
    await page.waitForSelector('input[type="password"]', { timeout: 5000 });
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Admin login with correct password enters dashboard', async ({ page }) => {
    await page.goto(BASE + '/index.html#/admin');
    await page.waitForSelector('input[type="password"]', { timeout: 5000 });
    await page.fill('input[type="password"]', 'bento');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.dashboard-v5', { timeout: 5000 });
    await expect(page.locator('.dashboard-v5')).toBeVisible();
  });

  test('Admin sidebar shows all 8 sections', async ({ page }) => {
    await page.goto(BASE + '/index.html#/admin');
    await page.fill('input[type="password"]', 'bento');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.dash-sidebar', { timeout: 5000 });

    const sections = ['Projets', 'Experiences', 'Apparence', 'Profil', 'CV', 'Contact', 'Liens', 'Backup'];
    for (const s of sections) {
      await expect(page.locator('.dash-nav-item').filter({ hasText: s })).toBeVisible({ timeout: 2000 });
    }
  });

  test('Admin live preview renders content', async ({ page }) => {
    await page.goto(BASE + '/index.html#/admin');
    await page.fill('input[type="password"]', 'bento');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.dash-preview', { timeout: 5000 });
    // Preview should render the HomeView component directly
    await expect(page.locator('.dash-preview .cell--hero')).toBeVisible({ timeout: 5000 });
  });

  test('Admin sections switch without crash', async ({ page }) => {
    await page.goto(BASE + '/index.html#/admin');
    await page.fill('input[type="password"]', 'bento');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.dashboard-v5', { timeout: 5000 });

    for (const section of ['Apparence', 'Profil', 'CV', 'Liens', 'Projets']) {
      await page.locator('.dash-nav-item').filter({ hasText: section }).click();
      await page.waitForTimeout(400);
    }
  });

  test('Admin CV section opens without runtime errors', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(BASE + '/index.html#/admin');
    await page.fill('input[type="password"]', 'bento');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.dashboard-v5', { timeout: 5000 });

    await page.locator('.dash-nav-item').filter({ hasText: 'CV' }).click();
    await expect(page.locator('.dashboard-v5')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('.ds-title')).toContainText('CV');
    expect(pageErrors).toEqual([]);
  });

  test('Admin appearance provides separate focal controls for home and CV', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(BASE + '/index.html#/admin');
    await page.fill('input[type="password"]', 'bento');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.dashboard-v5', { timeout: 5000 });

    await page.locator('.dash-nav-item').filter({ hasText: 'Apparence' }).click();
    await expect(page.locator('.ds-title')).toContainText('Apparence');
    await expect(page.locator('[data-testid="focal-tab-home"]')).toBeVisible();
    await expect(page.locator('[data-testid="focal-tab-cv"]')).toBeVisible();

    const preview = page.locator('[data-testid="focal-preview"]');
    await expect(preview).toBeVisible();
    await preview.click({ position: { x: 24, y: 24 } });
    await expect(page.locator('[data-testid="focal-value"]')).toContainText('%');
    expect(pageErrors).toEqual([]);
  });

  test('Admin project editor exposes inline case study image upload', async ({ page }) => {
    await page.goto(BASE + '/index.html#/admin');
    await page.fill('input[type="password"]', 'bento');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.dashboard-v5', { timeout: 5000 });

    await expect(page.locator('.ds-sub').filter({ hasText: 'content/projects' })).toBeVisible({ timeout: 2000 });

    await page.locator('.ds-proj-row').first().locator('[data-tip="Modifier"]').click();
    await expect(page.locator('.ds-title')).toContainText('Modifier');
    await expect(page.getByText('Insérer image étude de cas')).toBeVisible();
  });

  test('Admin preview tabs work', async ({ page }) => {
    await page.goto(BASE + '/index.html#/admin');
    await page.fill('input[type="password"]', 'bento');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.dash-preview', { timeout: 5000 });

    for (const tab of ['Accueil', 'Projets', 'CV', 'Contact']) {
      await page.locator('.ds-preview-tab').filter({ hasText: tab }).click();
      await page.waitForTimeout(300);
    }
  });
});

test.describe('Bentofolio - Preview mode', () => {
  test('Preview mode hides nav', async ({ page }) => {
    await page.goto(BASE + '/index.html?preview#/cv');
    await page.waitForSelector('.a4-page', { timeout: 5000 });
    const navDisplay = await page.locator('.navbar').evaluate(el => window.getComputedStyle(el).display);
    expect(navDisplay).toBe('none');
  });
});

test.describe('Projets Stories/Index (T03)', () => {
  test('First visit defaults to Stories mode', async ({ page }) => {
    await page.goto(BASE + '/index.html#/projets');
    await page.waitForSelector('.story-section', { timeout: 5000 });

    const storyCount = await page.locator('.story-section').count();
    expect(storyCount).toBeGreaterThan(1);

    // The dense index grid is not mounted in Stories mode
    expect(await page.locator('.proj-gallery').count()).toBe(0);

    // Toggle reflects the default state
    await expect(page.locator('.mode-toggle-btn').filter({ hasText: 'Stories' }))
      .toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.mode-toggle-btn').filter({ hasText: 'Index' }))
      .toHaveAttribute('aria-pressed', 'false');
  });

  test('Toggle switches from Stories to Index', async ({ page }) => {
    await page.goto(BASE + '/index.html#/projets');
    await page.waitForSelector('.story-section', { timeout: 5000 });

    await page.locator('.mode-toggle-btn').filter({ hasText: 'Index' }).click();

    await page.waitForSelector('.proj-gallery', { timeout: 5000 });
    await expect(page.locator('.proj-card').first()).toBeVisible();
    expect(await page.locator('.story-section').count()).toBe(0);
    await expect(page.locator('.mode-toggle-btn').filter({ hasText: 'Index' }))
      .toHaveAttribute('aria-pressed', 'true');
  });

  test('Mode choice persists across reloads', async ({ page }) => {
    await page.goto(BASE + '/index.html#/projets');
    await page.waitForSelector('.story-section', { timeout: 5000 });

    await page.locator('.mode-toggle-btn').filter({ hasText: 'Index' }).click();
    await page.waitForSelector('.proj-gallery', { timeout: 5000 });

    await page.reload();
    await page.waitForSelector('.proj-gallery', { timeout: 5000 });
    expect(await page.locator('.story-section').count()).toBe(0);
    await expect(page.locator('.mode-toggle-btn').filter({ hasText: 'Index' }))
      .toHaveAttribute('aria-pressed', 'true');
  });

  test('Toggle is keyboard operable (Tab then Enter and Space)', async ({ page }) => {
    await page.goto(BASE + '/index.html#/projets');
    await page.waitForSelector('.story-section', { timeout: 5000 });

    // Tab through the page until the INACTIVE toggle option (Index) receives focus
    let focusedIndex = false;
    for (let i = 0; i < 40 && !focusedIndex; i++) {
      await page.keyboard.press('Tab');
      focusedIndex = await page.evaluate(() => {
        const el = document.activeElement;
        return Boolean(el && el.classList.contains('mode-toggle-btn') && el.getAttribute('aria-pressed') === 'false');
      });
    }
    expect(focusedIndex).toBe(true);

    // Space activates the focused (Index) option
    await page.keyboard.press('Space');
    await page.waitForSelector('.proj-gallery', { timeout: 5000 });
    expect(await page.locator('.story-section').count()).toBe(0);

    // Step back to the Stories option, Enter activates it
    await page.keyboard.press('Shift+Tab');
    const onStories = await page.evaluate(() => {
      const el = document.activeElement;
      return Boolean(el && el.classList.contains('mode-toggle-btn') && el.getAttribute('aria-pressed') === 'false');
    });
    expect(onStories).toBe(true);
    await page.keyboard.press('Enter');
    await page.waitForSelector('.story-section', { timeout: 5000 });
    expect(await page.locator('.proj-gallery').count()).toBe(0);
  });

  test('No horizontal overflow in Stories mode (desktop + mobile)', async ({ page }) => {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto(BASE + '/index.html#/projets');
      await page.waitForSelector('.story-section', { timeout: 5000 });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(150);
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
    }
  });

  test('Filters apply in both modes', async ({ page }) => {
    await page.goto(BASE + '/index.html#/projets');
    await page.waitForSelector('.story-section', { timeout: 5000 });

    const totalStories = await page.locator('.story-section').count();

    // Pick the first non-"all" category filter chip
    await page.locator('.filter-chip:not(.filter-chip--all)').first().click();
    await page.waitForTimeout(200);
    const filteredStories = await page.locator('.story-section').count();
    expect(filteredStories).toBeGreaterThan(0);
    expect(filteredStories).toBeLessThan(totalStories);

    // Same filtered set in Index mode
    await page.locator('.mode-toggle-btn').filter({ hasText: 'Index' }).click();
    await page.waitForSelector('.proj-gallery', { timeout: 5000 });
    const filteredCards = await page.locator('.proj-card').count();
    expect(filteredCards).toBe(filteredStories);
  });
});
