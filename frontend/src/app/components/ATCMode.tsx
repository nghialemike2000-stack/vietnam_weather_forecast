import { AlertTriangle, Wind, Eye, TrendingDown } from 'lucide-react';
import { WeatherData } from './InputPanel';

interface ATCModeProps {
  data: WeatherData | null;
}

export function ATCMode({ data }: ATCModeProps) {
  const alerts = [
    { type: 'Wind Shear', status: 'warning', icon: Wind, message: 'Moderate wind shear detected at 2000ft' },
    { type: 'Storm Alert', status: 'normal', icon: AlertTriangle, message: 'No active storm systems' },
    { type: 'Visibility', status: data && data.cloudCover > 70 ? 'warning' : 'normal', icon: Eye, message: data && data.cloudCover > 70 ? 'Reduced visibility: 5.2km' : 'Good visibility: 15km+' }
  ];

  const criticalData = data ? [
    { label: 'Visibility', value: data.cloudCover > 70 ? '5.2 km' : '15+ km', status: data.cloudCover > 70 ? 'warning' : 'good' },
    { label: 'Wind Direction', value: '270° WSW', status: 'good' },
    { label: 'Wind Speed', value: `${data.windSpeed} km/h`, status: data.windSpeed > 50 ? 'warning' : 'good' },
    { label: 'Pressure Trend', value: data.pressure > 1013 ? '↑ Rising' : '↓ Falling', status: data.pressure > 1013 ? 'good' : 'caution' },
    { label: 'Temperature', value: `${data.temperature}°C`, status: 'good' },
    { label: 'Dew Point', value: `${Math.round(data.temperature - (100 - data.humidity) / 5)}°C`, status: 'good' },
    { label: 'Altimeter', value: `${(data.pressure * 0.02953).toFixed(2)} inHg`, status: 'good' },
    { label: 'Density Altitude', value: `${Math.round(1000 + (data.temperature - 15) * 120)} ft`, status: 'good' }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Alerts Panel */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <AlertTriangle className="w-4 h-4" />
          CRITICAL ALERTS
        </h3>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.type}
                className={`flex items-center gap-3 p-3 border ${
                  alert.status === 'warning'
                    ? 'border-[var(--weather-yellow)] bg-[var(--weather-yellow)]/10'
                    : 'border-border bg-secondary/30'
                }`}
              >
                <Icon className={`w-5 h-5 ${alert.status === 'warning' ? 'text-[var(--weather-yellow)]' : 'text-[var(--weather-green)]'}`} />
                <div className="flex-1">
                  <p className="text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                    {alert.type}
                  </p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                    {alert.message}
                  </p>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    alert.status === 'warning' ? 'bg-[var(--weather-yellow)] shadow-[0_0_8px_var(--weather-yellow)]' : 'bg-[var(--weather-green)]'
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Data Table */}
      <div className="border border-border bg-card overflow-hidden">
        <div className="bg-secondary/50 px-6 py-3 border-b border-border">
          <h3 className="text-sm text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            AVIATION WEATHER DATA
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  PARAMETER
                </th>
                <th className="text-right px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  VALUE
                </th>
                <th className="text-center px-6 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {criticalData.map((item, idx) => (
                <tr key={item.label} className={`border-b border-border/50 ${idx % 2 === 0 ? 'bg-card' : 'bg-secondary/10'}`}>
                  <td className="px-6 py-4 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    {item.label}
                  </td>
                  <td className="px-6 py-4 text-right text-lg text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                    {item.value}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs ${
                        item.status === 'good'
                          ? 'bg-[var(--weather-green)]/20 text-[var(--weather-green)] border border-[var(--weather-green)]/50'
                          : item.status === 'warning'
                          ? 'bg-[var(--weather-yellow)]/20 text-[var(--weather-yellow)] border border-[var(--weather-yellow)]/50'
                          : 'bg-[var(--weather-orange)]/20 text-[var(--weather-orange)] border border-[var(--weather-orange)]/50'
                      }`}
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* METAR/TAF Simulation */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          METAR / TAF
        </h3>
        <div className="bg-secondary/30 p-4 border border-border">
          <p className="text-xs text-[var(--weather-green)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
            METAR KJFK 141751Z 27015KT 15SM FEW250 {data ? `${Math.round(data.temperature)}/${Math.round(data.temperature - (100 - data.humidity) / 5)}` : '22/14'} A{data ? (data.pressure * 0.02953).toFixed(2) : '3000'} RMK AO2 SLP{data ? Math.round(data.pressure - 900) : '113'}
          </p>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
            TAF KJFK 141720Z 1418/1524 27015KT P6SM FEW250
          </p>
        </div>
      </div>
    </div>
  );
}
