import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, Brain, Zap } from 'lucide-react';
import { WeatherData } from './InputPanel';

interface ForecastingPanelProps {
  data: WeatherData | null;
}

export function ForecastingPanel({ data }: ForecastingPanelProps) {
  // Generate forecast data for next 14 days
  const forecastData = Array.from({ length: 14 }, (_, i) => {
    const baseTemp = data?.temperature || 28;
    const baseHumidity = data?.humidity || 75;

    return {
      day: `Day ${i + 1}`,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      prophet: baseTemp + Math.sin(i / 2) * 3 + (Math.random() - 0.5) * 2,
      xgboost: baseTemp + Math.sin(i / 2) * 3.5 + (Math.random() - 0.5) * 1.8,
      actual: baseTemp + Math.sin(i / 2) * 3 + (Math.random() - 0.5) * 1.5,
      prophetHumidity: baseHumidity + Math.cos(i / 3) * 8 + (Math.random() - 0.5) * 3,
      xgboostHumidity: baseHumidity + Math.cos(i / 3) * 7 + (Math.random() - 0.5) * 2.5,
      rainProb: Math.max(10, Math.min(90, 40 + Math.sin(i / 2) * 30 + (Math.random() - 0.5) * 20))
    };
  });

  const modelAccuracy = [
    { model: 'Prophet', accuracy: 89.5, mae: 1.2, rmse: 1.8 },
    { model: 'XGBoost', accuracy: 92.3, mae: 0.9, rmse: 1.4 }
  ];

  return (
    <div className="space-y-6">
      {/* Model Performance Comparison */}
      <div className="grid grid-cols-2 gap-6">
        {modelAccuracy.map((model, idx) => (
          <div
            key={model.model}
            className={`border p-6 transition-all duration-300 ${
              idx === 1
                ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-primary flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {idx === 0 ? <TrendingUp className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                {model.model} MODEL
              </h3>
              {idx === 1 && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1" style={{ fontFamily: 'var(--font-mono)' }}>
                  BEST
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                  ACCURACY
                </p>
                <p className="text-2xl text-[var(--weather-green)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {model.accuracy}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                  MAE
                </p>
                <p className="text-2xl text-[var(--weather-yellow)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {model.mae}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                  RMSE
                </p>
                <p className="text-2xl text-[var(--weather-orange)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {model.rmse}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Temperature Forecast Comparison */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <Brain className="w-4 h-4" />
          14-DAY TEMPERATURE FORECAST: PROPHET VS XGBOOST
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }} />
            <Line type="monotone" dataKey="prophet" name="Prophet Model" stroke="var(--weather-blue)" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="xgboost" name="XGBoost Model" stroke="var(--weather-cyan)" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--weather-orange)" strokeWidth={3} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity Forecast */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          HUMIDITY FORECAST COMPARISON
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="prophetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--weather-blue)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--weather-blue)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="xgboostGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--weather-cyan)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--weather-cyan)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }} />
            <Area type="monotone" dataKey="prophetHumidity" name="Prophet" stroke="var(--weather-blue)" strokeWidth={2} fill="url(#prophetGradient)" />
            <Area type="monotone" dataKey="xgboostHumidity" name="XGBoost" stroke="var(--weather-cyan)" strokeWidth={2} fill="url(#xgboostGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rain Probability Forecast */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          RAIN PROBABILITY FORECAST (XGBoost)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--weather-cyan)" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="var(--weather-cyan)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="rainProb" name="Rain Probability (%)" stroke="var(--weather-cyan)" strokeWidth={2} fill="url(#rainGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
