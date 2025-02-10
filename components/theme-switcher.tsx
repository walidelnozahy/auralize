'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface ThemeSwitcherProps {
  size?: Size;
}

const sizeClasses = {
  sm: {
    button: 'h-6 w-6',
    icon: 'h-3 w-3',
    wrapper: 'p-1 gap-1',
  },
  md: {
    button: 'h-8 w-8',
    icon: 'h-4 w-4',
    wrapper: 'p-1 gap-2',
  },
  lg: {
    button: 'h-10 w-10',
    icon: 'h-5 w-5',
    wrapper: 'p-1.5 gap-2',
  },
};

export default function ThemeSwitcher({ size = 'md' }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
  };

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <div
      className={`inline-flex items-center rounded-full border bg-background ${sizeClasses[size].wrapper}`}
    >
      <button
        onClick={() => updateTheme('system')}
        className={`inline-flex items-center justify-center rounded-full transition-colors hover:bg-accent ${
          theme === 'system' ? 'bg-accent' : ''
        } ${sizeClasses[size].button}`}
        aria-label='System theme'
      >
        <Monitor className={sizeClasses[size].icon} />
      </button>
      <button
        onClick={() => updateTheme('light')}
        className={`inline-flex items-center justify-center rounded-full transition-colors hover:bg-accent ${
          theme === 'light' ? 'bg-accent' : ''
        } ${sizeClasses[size].button}`}
        aria-label='Light theme'
      >
        <Sun className={sizeClasses[size].icon} />
      </button>
      <button
        onClick={() => updateTheme('dark')}
        className={`inline-flex items-center justify-center rounded-full transition-colors hover:bg-accent ${
          theme === 'dark' ? 'bg-accent' : ''
        } ${sizeClasses[size].button}`}
        aria-label='Dark theme'
      >
        <Moon className={sizeClasses[size].icon} />
      </button>
    </div>
  );
}
