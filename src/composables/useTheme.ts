import { ref, watch } from 'vue'

const STORAGE_KEY = 'bf-theme'
type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getInitialTheme())

function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t
}

// Apply on load
applyTheme(theme.value)

watch(theme, (next) => {
  applyTheme(next)
  localStorage.setItem(STORAGE_KEY, next)
})

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    theme,
    toggle,
    isDark: () => theme.value === 'dark',
  }
}
