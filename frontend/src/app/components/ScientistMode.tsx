import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Database, TrendingUp } from 'lucide-react';
import { WeatherData } from './InputPanel';

interface ScientistModeProps {
  data: WeatherData | null;
  prediction: {
    result: 'rain' | 'no-rain';
    probability: number;
    confidence: number;
  };
}

export function ScientistMode({ data, prediction }: ScientistModeProps) {
  const models = [
    { name: 'Logistic Regression', accuracy: 82, selected: false },
    { name: 'Random Forest', accuracy: 91, selected: true },
    { name: 'XGBoost', accuracy: 88, selected: false },
    { name: 'Decision Tree', accuracy: 76, selected: false }
  ];

  const featureImportance = data ? [
    { feature: 'Pressure', importance: 0.28, value: data.pressure },
    { feature: 'Humidity', importance: 0.24, value: data.humidity },
    { feature: 'Temperature', importance: 0.18, value: data.temperature },
    { feature: 'Cloud Cover', importance: 0.16, value: data.cloudCover },
    { feature: 'Wind Speed', importance: 0.14, value: data.windSpeed }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <Brain className="w-4 h-4" />
          MODEL SELECTION
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {models.map((model) => (
            <div
              key={model.name}
              className={`border p-4 transition-all duration-300 ${
                model.selected
                  ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                  : 'border-border bg-secondary/30 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                  {model.name}
                </p>
                {model.selected && (
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"></div>
                )}
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  ACCURACY
                </span>
                <span className="text-2xl text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                  {model.accuracy}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Output Details */}
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-border bg-card p-6">
          <h3 className="text-sm text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            PROBABILITY OUTPUT
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  RAIN
                </span>
                <span className="text-sm text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                  {prediction.probability}%
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-[var(--weather-cyan)] transition-all duration-1000"
                  style={{ width: `${prediction.probability}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  NO RAIN
                </span>
                <span className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  {100 - prediction.probability}%
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-muted-foreground/50 transition-all duration-1000"
                  style={{ width: `${100 - prediction.probability}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border bg-card p-6">
          <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <TrendingUp className="w-4 h-4" />
            MODEL EXPLANATION
          </h3>
          <div className="space-y-3">
            <div className="bg-primary/10 border border-primary/30 p-3">
              <p className="text-xs text-primary mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                PRIMARY DRIVER
              </p>
              <p className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                Prediction driven by {data && data.pressure < 1013 ? 'low atmospheric pressure' : 'high humidity levels'}
              </p>
            </div>
            <div className="bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                CONFIDENCE FACTORS
              </p>
              <p className="text-sm text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                Model confidence: {prediction.confidence}%<br />
                Feature correlation: Strong
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <Database className="w-4 h-4" />
          FEATURE IMPORTANCE
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={featureImportance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
            <XAxis type="number" stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} />
            <YAxis type="category" dataKey="feature" stroke="var(--muted-foreground)" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }} width={100} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            />
            <Bar dataKey="importance" fill="var(--weather-cyan)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Raw Input Data Table */}
      <div className="border border-border bg-card overflow-hidden">
        <div className="bg-secondary/50 px-6 py-3 border-b border-border">
          <h3 className="text-sm text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            RAW INPUT DATA
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  FEATURE
                </th>
                <th className="text-right px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  VALUE
                </th>
                <th className="text-right px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  NORMALIZED
                </th>
              </tr>
            </thead>
            <tbody>
              {featureImportance.map((item, idx) => (
                <tr key={item.feature} className={`border-b border-border/50 ${idx % 2 === 0 ? 'bg-card' : 'bg-secondary/10'}`}>
                  <td className="px-6 py-4 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    {item.feature}
                  </td>
                  <td className="px-6 py-4 text-right text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                    {item.value}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                    {(item.value / 100).toFixed(3)}
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
