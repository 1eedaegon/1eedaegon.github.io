type Theme = 'warm' | 'cold';
type Mode = 'light' | 'dark' | 'auto';

const THEME_KEY = 'theme-variant';
const MODE_KEY = 'theme';

// The inline script in BaseLayout applies the configured default before render,
// so the server-set attribute is the single source of truth for the fallback.
const initialVariant = document.documentElement.getAttribute('data-theme-variant');
const DEFAULT_THEME: Theme = initialVariant === 'warm' ? 'warm' : 'cold';

/**
 * Get system preference for dark mode
 */
function getSystemPreference(): 'light' | 'dark' {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Get stored or default theme
 */
function getTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return (stored === 'warm' || stored === 'cold') ? stored : DEFAULT_THEME;
}

/**
 * Get stored or default mode
 */
function getMode(): Mode {
  const stored = localStorage.getItem(MODE_KEY);
  return (stored === 'light' || stored === 'dark' || stored === 'auto') ? stored : 'auto';
}

/**
 * Apply theme and mode to document
 */
function applyTheme(theme: Theme, mode: Mode) {
  const actualMode = mode === 'auto' ? getSystemPreference() : mode;
  document.documentElement.setAttribute('data-theme-variant', theme);
  document.documentElement.setAttribute('data-theme', actualMode);
}

/**
 * Initialize theme on page load
 */
function initTheme() {
  const theme = getTheme();
  const mode = getMode();
  applyTheme(theme, mode);
}

/**
 * Toggle theme (warm <-> cold)
 */
export function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme: Theme = currentTheme === 'warm' ? 'cold' : 'warm';
  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme, getMode());
}

/**
 * Toggle mode (light <-> dark)
 */
export function toggleMode() {
  const currentMode = getMode();
  let newMode: Mode;

  if (currentMode === 'auto') {
    newMode = getSystemPreference() === 'light' ? 'dark' : 'light';
  } else if (currentMode === 'light') {
    newMode = 'dark';
  } else {
    newMode = 'light';
  }

  localStorage.setItem(MODE_KEY, newMode);
  applyTheme(getTheme(), newMode);
}

/**
 * Set specific theme
 */
export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme, getMode());
}

/**
 * Set specific mode
 */
export function setMode(mode: Mode) {
  localStorage.setItem(MODE_KEY, mode);
  applyTheme(getTheme(), mode);
}

// Initialize theme immediately to prevent flash
initTheme();

// Re-apply after client-side navigation (ClientRouter swaps <html> attributes)
document.addEventListener('astro:after-swap', initTheme);

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (getMode() === 'auto') {
    applyTheme(getTheme(), 'auto');
  }
});

// Make functions available globally for inline use
(window as any).toggleTheme = toggleTheme;
(window as any).toggleMode = toggleMode;
