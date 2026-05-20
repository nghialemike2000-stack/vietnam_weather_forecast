import { Activity, AlertCircle, CheckCircle2, CloudRain, CloudSun, XCircle } from 'lucide-react';
import { WeatherPredictionResponse } from '../weatherApi';
import { WeatherData } from './InputPanel';

interface PredictionOutputProps {
  data: WeatherData | null;
  response: WeatherPredictionResponse | null;
  loading?: boolean;
}

function formatActualRain(value: number | null) {
  if (value === null) return 'N/A';
  return value === 1 ? 'Rain' : 'No rain';
}

export function PredictionOutput({ data, response, loading = false }: PredictionOutputProps) {
  if (loading) {
    return (
      <div className="border border-border bg-card/50 p-8 text-center">
        <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
          RUNNING MODEL...
        </p>
      </div>
    );
  }

  if (!data || !response) {
    return (
      <div className="border border-border bg-card/50 p-8 text-center">
        <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
          AWAITING INPUT DATA...
        </p>
      </div>
    );
  }

  const primaryPrediction = response.predictions[0];
  const isRain = primaryPrediction.result === 'rain';

  const metrics = [
    { label: 'Temperature', value: `${data.temperature.toFixed(1)} C`, color: 'var(--weather-orange)' },
    { label: 'Humidity', value: `${data.humidity.toFixed(0)}%`, color: 'var(--weather-cyan)' },
    { label: 'Wind Speed', value: `${data.windSpeed.toFixed(1)} km/h`, color: 'var(--weather-blue)' },
    { label: 'Pressure', value: `${data.pressure.toFixed(1)} hPa`, color: 'var(--weather-yellow)' },
    { label: 'Cloud Cover', value: `${data.cloudCover.toFixed(0)}%`, color: 'var(--weather-green)' },
  ];

  return (
    <div className="space-y-6">
      <div className="border border-primary bg-gradient-to-br from-primary/10 to-transparent p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-6 mb-5">
            <div>
              <p className="text-xs text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                {response.mode === 'evaluation' ? 'BACKTEST RESULT' : 'PREDICTION RESULT'}
              </p>
              <div className="flex items-center gap-4">
                {isRain ? (
                  <CloudRain className="w-16 h-16 text-primary" strokeWidth={1.5} />
                ) : (
                  <CloudSun className="w-16 h-16 text-[var(--weather-yellow)]" strokeWidth={1.5} />
                )}
                <div>
                  <h3 className="text-4xl tracking-wide mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                    {isRain ? 'RAIN EXPECTED' : 'NO RAIN'}
                  </h3>
                  <p className="text-xl text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                    {primaryPrediction.rain_probability}% PROBABILITY
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right min-w-48">
              <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                {data.provinceLabel.toUpperCase()}
              </p>
              <p className="text-sm text-foreground mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                {response.start_date} {'->'} {response.predictions[response.predictions.length - 1].date}
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                DATA TO {response.data_last_date}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="border border-border/70 bg-background/30 p-4">
              <p className="text-[10px] text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                MODEL
              </p>
              <p className="text-lg text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                {primaryPrediction.algorithm}
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                horizon_{primaryPrediction.model_horizon} / lookback {primaryPrediction.lookback}
              </p>
            </div>
            <div className="border border-border/70 bg-background/30 p-4">
              <p className="text-[10px] text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                MODEL F1
              </p>
              <p className="text-lg text-[var(--weather-green)]" style={{ fontFamily: 'var(--font-mono)' }}>
                {primaryPrediction.metrics.f1}%
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                AUC {primaryPrediction.metrics.roc_auc}%
              </p>
            </div>
            <div className="border border-border/70 bg-background/30 p-4">
              <p className="text-[10px] text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                DATA STATUS
              </p>
              <p
                className="text-lg"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: response.data_is_fresh ? 'var(--weather-green)' : 'var(--weather-orange)',
                }}
              >
                {response.data_is_fresh ? 'FRESH' : 'STALE'}
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                latest input {response.latest_observation.date}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
                <Activity className="w-3 h-3" />
                CONFIDENCE LEVEL
              </span>
              <span className="text-sm text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                {primaryPrediction.confidence}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-[var(--weather-green)] transition-all duration-1000 shadow-[0_0_10px_var(--primary)]"
                style={{ width: `${primaryPrediction.confidence}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {response.accuracy_summary && (
        <div className="border border-border bg-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
              HISTORICAL ACCURACY
            </p>
            <p className="text-2xl text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
              {response.accuracy_summary.accuracy}%
            </p>
          </div>
          <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
            {response.accuracy_summary.correct}/{response.accuracy_summary.total} correct
          </p>
        </div>
      )}

      <div className="grid grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="border border-border bg-card p-4 hover:border-primary/50 transition-all duration-300 group"
          >
            <p className="text-[10px] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
              {metric.label.toUpperCase()}
            </p>
            <p
              className="text-2xl tracking-tight group-hover:scale-105 transition-transform duration-300"
              style={{ fontFamily: 'var(--font-mono)', color: metric.color }}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="border border-border bg-card overflow-hidden">
        <div className="bg-secondary/50 px-6 py-3 border-b border-border">
          <h3 className="text-sm text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            DAILY RESULTS
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['Date', 'Prediction', 'Rain Prob.', 'Actual', 'Model', 'Check'].map((heading) => (
                  <th
                    key={heading}
                    className="text-left px-6 py-3 text-xs text-muted-foreground"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {heading.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {response.predictions.map((prediction, index) => (
                <tr key={prediction.date} className={`border-b border-border/50 ${index % 2 === 0 ? 'bg-card' : 'bg-secondary/10'}`}>
                  <td className="px-6 py-4 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                    {prediction.date}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      {prediction.result === 'rain' ? (
                        <CloudRain className="w-4 h-4 text-primary" />
                      ) : (
                        <CloudSun className="w-4 h-4 text-[var(--weather-yellow)]" />
                      )}
                      {prediction.result === 'rain' ? 'Rain' : 'No rain'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                    {prediction.rain_probability}%
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                    {formatActualRain(prediction.actual_rain)}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                    {prediction.algorithm} h{prediction.model_horizon}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {prediction.is_correct === true ? (
                      <CheckCircle2 className="w-5 h-5 text-[var(--weather-green)]" />
                    ) : prediction.is_correct === false ? (
                      <XCircle className="w-5 h-5 text-[var(--weather-red)]" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
