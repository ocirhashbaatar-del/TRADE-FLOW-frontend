import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
interface ThemeContextValue { theme: Theme; resolvedTheme: 'light' | 'dark'; setTheme: (theme: Theme) => void; toggleTheme: () => void }
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('tradeflow-theme')
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
  })
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])
  useEffect(() => { document.documentElement.classList.toggle('dark', resolvedTheme === 'dark'); document.documentElement.style.colorScheme = resolvedTheme }, [resolvedTheme])
  const setTheme = (value: Theme) => { setThemeState(value); localStorage.setItem('tradeflow-theme', value) }
  const value = useMemo(() => ({ theme, resolvedTheme, setTheme, toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark') }), [theme, resolvedTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
export function useTheme() { const value = useContext(ThemeContext); if (!value) throw new Error('useTheme must be used within ThemeProvider'); return value }
