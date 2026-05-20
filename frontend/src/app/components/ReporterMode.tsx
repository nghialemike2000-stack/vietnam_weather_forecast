import { BarChart3, Database } from 'lucide-react';
import { WeatherData } from './InputPanel';
import { EDAPanel } from './EDAPanel';

interface ReporterModeProps {
  data: WeatherData | null;
}

export function ReporterMode({ data }: ReporterModeProps) {
  return (
    <div className="space-y-6">
      <div className="border border-primary bg-gradient-to-r from-primary/10 via-transparent to-transparent p-6">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-primary mt-1" />
          <div>
            <h3 className="text-sm text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              VIETNAM WEATHER DATASET
            </h3>
            <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-body)' }}>
              Daily weather snapshots across <span className="text-primary font-semibold">34 supported provinces</span>.
            </p>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              Exploration uses real CSV rows by selected date. The trained models only predict rain or no rain.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-border bg-card">
        <div className="flex overflow-x-auto">
          <div
            className="flex items-center gap-2 px-6 py-4 text-sm border-b-2 border-primary text-primary bg-primary/5 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <BarChart3 className="w-4 h-4" />
            Exploratory Analysis
          </div>
        </div>
      </div>

      <EDAPanel data={data} />
    </div>
  );
}
