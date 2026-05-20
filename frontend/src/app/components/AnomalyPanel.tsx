import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { AlertTriangle, Shield, Target } from 'lucide-react';
import { WeatherData } from './InputPanel';

interface AnomalyPanelProps {
  data: WeatherData | null;
}

export function AnomalyPanel({ data }: AnomalyPanelProps) {
  // Generate time series data with anomalies
  const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
    const baseTemp = 28;
    let temp = baseTemp + Math.sin(i / 5) * 4 + (Math.random() - 0.5) * 2;
    let isAnomaly = false;

    // Inject anomalies
    if (i === 8 || i === 9) {
      temp = 38; // Extreme heat
      isAnomaly = true;
    } else if (i === 18) {
      temp = 18; // Unusual cold
      isAnomaly = true;
    } else if (i === 25) {
      temp = 40; // Extreme heat
      isAnomaly = true;
    }

    const baseHumidity = 75;
    let humidity = baseHumidity + Math.cos(i / 4) * 10 + (Math.random() - 0.5) * 5;

    if (i === 12) {
      humidity = 95; // Extreme humidity
      isAnomaly = true;
    } else if (i === 22) {
      humidity = 40; // Unusual dry
      isAnomaly = true;
    }

    return {
      day: i + 1,
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temp,
      humidity,
      isAnomaly,
      anomalyScore: isAnomaly ? 0.85 + Math.random() * 0.15 : Math.random() * 0.3
    };
  });

  const detectedAnomalies = [
    { date: 'Jul 09, 2025', province: 'Ha Tinh', type: 'Extreme Heat', value: '38°C', severity: 'high', score: 0.92 },
    { date: 'Jul 10, 2025', province: 'Nghe An', type: 'Extreme Heat', value: '38.5°C', severity: 'high', score: 0.94 },
    { date: 'Jul 13, 2025', province: 'Thanh Hoa', type: 'High Humidity', value: '95%', severity: 'medium', score: 0.87 },
    { date: 'Jul 19, 2025', province: 'Lao Cai', type: 'Unusual Cold', value: '18°C', severity: 'medium', score: 0.82 },
    { date: 'Jul 23, 2025', province: 'Ninh Thuan', type: 'Low Humidity', value: '40%', severity: 'low', score: 0.76 },
    { date: 'Jul 26, 2025', province: 'Binh Thuan', type: 'Extreme Heat', value: '40°C', severity: 'high', score: 0.96 }
  ];

  const anomalyStats = [
    { label: 'Total Anomalies', value: '24', color: 'var(--weather-red)' },
    { label: 'High Severity', value: '8', color: 'var(--weather-orange)' },
    { label: 'Detection Rate', value: '96.3%', color: 'var(--weather-green)' },
    { label: 'False Positives', value: '3.7%', color: 'var(--weather-cyan)' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'var(--weather-red)';
      case 'medium': return 'var(--weather-orange)';
      case 'low': return 'var(--weather-yellow)';
      default: return 'var(--weather-blue)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Anomaly Statistics */}
      <div className="grid grid-cols-4 gap-4">
        {anomalyStats.map((stat, idx) => {
          const Icon = idx === 0 ? AlertTriangle : idx === 2 ? Shield : Target;
          return (
            <div key={stat.label} className="border border-border bg-card p-5 hover:border-primary/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
                <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  {stat.label.toUpperCase()}
                </p>
              </div>
              <p className="text-3xl tracking-tight group-hover:scale-105 transition-transform" style={{ fontFamily: 'var(--font-mono)', color: stat.color }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Temperature Anomaly Detection */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <AlertTriangle className="w-4 h-4" />
          TEMPERATURE ANOMALY DETECTION (30-DAY WINDOW)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
              formatter={(value: any, name: string) => {
                if (name === 'temp') return [`${value.toFixed(1)}°C`, 'Temperature'];
                if (name === 'anomalyScore') return [`${(value * 100).toFixed(1)}%`, 'Anomaly Score'];
                return value;
              }}
            />
            <ReferenceLine y={35} stroke="var(--weather-orange)" strokeDasharray="3 3" label={{ value: 'Upper Threshold', position: 'right', style: { fontSize: '10px', fontFamily: 'var(--font-mono)', fill: 'var(--weather-orange)' } }} />
            <ReferenceLine y={20} stroke="var(--weather-cyan)" strokeDasharray="3 3" label={{ value: 'Lower Threshold', position: 'right', style: { fontSize: '10px', fontFamily: 'var(--font-mono)', fill: 'var(--weather-cyan)' } }} />
            <Line type="monotone" dataKey="temp" stroke="var(--weather-blue)" strokeWidth={2} dot={(props: any) => {
              const { cx, cy, payload } = props;
              if (payload.isAnomaly) {
                return (
                  <circle cx={cx} cy={cy} r={6} fill="var(--weather-red)" stroke="var(--background)" strokeWidth={2} />
                );
              }
              return <circle cx={cx} cy={cy} r={3} fill="var(--weather-blue)" />;
            }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly Score Timeline */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          ANOMALY SCORE TIMELINE
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--weather-red)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--weather-red)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }} domain={[0, 1]} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
              formatter={(value: any) => [(value * 100).toFixed(1) + '%', 'Anomaly Score']}
            />
            <ReferenceLine y={0.7} stroke="var(--weather-yellow)" strokeDasharray="3 3" label={{ value: 'Anomaly Threshold (70%)', position: 'right', style: { fontSize: '10px', fontFamily: 'var(--font-mono)', fill: 'var(--weather-yellow)' } }} />
            <Area type="monotone" dataKey="anomalyScore" stroke="var(--weather-red)" strokeWidth={2} fill="url(#anomalyGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Detected Anomalies Table */}
      <div className="border border-border bg-card overflow-hidden">
        <div className="bg-secondary/50 px-6 py-3 border-b border-border">
          <h3 className="text-sm text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            DETECTED ANOMALIES (JULY 2025)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  DATE
                </th>
                <th className="text-left px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  PROVINCE
                </th>
                <th className="text-left px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  ANOMALY TYPE
                </th>
                <th className="text-right px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  VALUE
                </th>
                <th className="text-right px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  SCORE
                </th>
                <th className="text-center px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  SEVERITY
                </th>
              </tr>
            </thead>
            <tbody>
              {detectedAnomalies.map((anomaly, idx) => (
                <tr key={idx} className={`border-b border-border/50 ${idx % 2 === 0 ? 'bg-card' : 'bg-secondary/10'}`}>
                  <td className="px-6 py-4 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                    {anomaly.date}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    {anomaly.province}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    {anomaly.type}
                  </td>
                  <td className="px-6 py-4 text-right text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                    {anomaly.value}
                  </td>
                  <td className="px-6 py-4 text-right" style={{ fontFamily: 'var(--font-mono)', color: getSeverityColor(anomaly.severity) }}>
                    {(anomaly.score * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="inline-block px-3 py-1 text-xs border"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: getSeverityColor(anomaly.severity),
                        backgroundColor: `${getSeverityColor(anomaly.severity)}20`,
                        borderColor: `${getSeverityColor(anomaly.severity)}50`
                      }}
                    >
                      {anomaly.severity.toUpperCase()}
                    </span>
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
