'use client';
import { useTheme } from './ThemeProvider';
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className="p-2 rounded-md border border-[var(--border-col)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
