import { Cloud, Sun, Moon } from 'lucide-react';

interface TopNavProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function TopNav({ theme, onThemeToggle }: TopNavProps) {
  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Cloud className="w-8 h-8 text-primary" strokeWidth={2} />
          <div className="absolute inset-0 blur-md bg-primary/30 -z-10"></div>
        </div>
        <div>
          <h1 className="text-xl tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
            WEATHER FORECAST
          </h1>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
            REPORTER SYSTEM v3.2
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onThemeToggle}
          className="p-2 border border-border bg-secondary/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,217,255,0.2)]"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-[var(--weather-yellow)]" />
          ) : (
            <Moon className="w-5 h-5 text-primary" />
          )}
        </button>

        <div className="text-right">
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
            SYSTEM STATUS
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--weather-green)] animate-pulse shadow-[0_0_8px_var(--weather-green)]"></div>
            <span className="text-sm text-[var(--weather-green)]" style={{ fontFamily: 'var(--font-mono)' }}>
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
