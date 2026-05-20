import { useMemo, useState } from 'react';
import { Brain, Calendar, Database, LocateFixed, MapPin, RefreshCw } from 'lucide-react';
import {
  ALGORITHM_OPTIONS,
  Algorithm,
  ForecastMode,
  getProvinceOption,
  HORIZON_OPTIONS,
  Horizon,
  SUPPORTED_PROVINCES,
  WeatherRequestPayload,
} from '../weatherConfig';

export type { WeatherData } from '../weatherConfig';

interface InputPanelProps {
  onPredict: (data: WeatherRequestPayload) => void;
  onSyncData: () => void;
  loading?: boolean;
  syncLoading?: boolean;
  syncSummary?: string | null;
}

function toDateInputValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function yesterdayInputValue() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return toDateInputValue(yesterday);
}

export function InputPanel({
  onPredict,
  onSyncData,
  loading = false,
  syncLoading = false,
  syncSummary,
}: InputPanelProps) {
  const [selectedProvince, setSelectedProvince] = useState('Ha_Noi');
  const [algorithm, setAlgorithm] = useState<Algorithm>('Best');
  const [horizon, setHorizon] = useState<Horizon>(1);
  const [mode, setMode] = useState<ForecastMode>('forecast');
  const [evaluationDate, setEvaluationDate] = useState(yesterdayInputValue());

  const selectedProvinceInfo = useMemo(
    () => getProvinceOption(selectedProvince),
    [selectedProvince],
  );

  const handleSubmit = () => {
    if (!selectedProvince) return;

    onPredict({
      province: selectedProvince,
      algorithm,
      horizon,
      mode,
      evaluation_date: mode === 'evaluation' ? evaluationDate : undefined,
    });
  };

  return (
    <div className="w-80 border-r border-border bg-sidebar p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg mb-4 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
          WEATHER FORECAST
        </h2>

        <div className="flex gap-2 mb-5 p-1 bg-secondary rounded">
          <button
            onClick={() => setMode('forecast')}
            className={`flex-1 py-2 text-sm transition-all ${
              mode === 'forecast'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            FORECAST
          </button>
          <button
            onClick={() => setMode('evaluation')}
            className={`flex-1 py-2 text-sm transition-all ${
              mode === 'evaluation'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            EVALUATE
          </button>
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
            <MapPin className="w-3 h-3" />
            PROVINCE
          </label>
          <select
            value={selectedProvince}
            onChange={(event) => setSelectedProvince(event.target.value)}
            className="w-full bg-input-background border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <option value="" disabled>
              -- Chọn Tỉnh / Thành phố --
            </option>
            {SUPPORTED_PROVINCES.map((province) => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="border border-border bg-card/60 p-3">
            <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)' }}>
              <LocateFixed className="w-3 h-3" />
              LATITUDE
            </p>
            <p className="text-sm text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
              {selectedProvinceInfo.latitude.toFixed(4)}
            </p>
          </div>
          <div className="border border-border bg-card/60 p-3">
            <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)' }}>
              <LocateFixed className="w-3 h-3" />
              LONGITUDE
            </p>
            <p className="text-sm text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
              {selectedProvinceInfo.longitude.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
            <Calendar className="w-3 h-3" />
            HORIZON
          </label>
          <select
            value={horizon}
            onChange={(event) => setHorizon(Number(event.target.value) as Horizon)}
            className="w-full bg-input-background border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {HORIZON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
            <Brain className="w-3 h-3" />
            ALGORITHM
          </label>
          <select
            value={algorithm}
            onChange={(event) => setAlgorithm(event.target.value as Algorithm)}
            className="w-full bg-input-background border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {ALGORITHM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {mode === 'evaluation' && (
          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
              <Calendar className="w-3 h-3" />
              EVALUATION DATE
            </label>
            <input
              type="date"
              value={evaluationDate}
              max={yesterdayInputValue()}
              onChange={(event) => setEvaluationDate(event.target.value)}
              className="w-full bg-input-background border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>
        )}

        <button
          onClick={onSyncData}
          disabled={syncLoading}
          className={`w-full mb-3 flex items-center justify-center gap-2 py-3 text-sm tracking-wider transition-all duration-300 border ${
            syncLoading
              ? 'bg-secondary/40 text-muted-foreground border-border cursor-wait'
              : 'bg-secondary/40 text-foreground border-border hover:border-primary hover:text-primary'
          }`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
          {syncLoading ? 'SYNCING DATA' : 'SYNC 34 PROVINCES'}
        </button>

        {syncSummary && (
          <div className="mb-3 border border-border bg-card/70 px-3 py-2">
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
              {syncSummary}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !selectedProvince}
        className={`w-full flex items-center justify-center gap-2 py-3 text-sm tracking-wider transition-all duration-300 border ${
          loading || !selectedProvince
            ? 'bg-secondary/30 text-muted-foreground border-border cursor-wait'
            : 'bg-primary text-primary-foreground border-primary hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]'
        }`}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <Database className="w-4 h-4" />
        {loading ? 'RUNNING MODEL' : mode === 'evaluation' ? 'RUN EVALUATION' : 'GENERATE PREDICTION'}
      </button>
    </div>
  );
}
