import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { Layers, MapPin } from 'lucide-react';
import { WeatherData } from './InputPanel';

interface ClusteringPanelProps {
  data: WeatherData | null;
}

export function ClusteringPanel({ data }: ClusteringPanelProps) {
  // Generate cluster data for provinces
  const clusterData = [
    // Cluster 0: Hot & Humid (Southern provinces)
    { province: 'Ho Chi Minh City', temp: 31, humidity: 82, cluster: 0, size: 120 },
    { province: 'Can Tho', temp: 30, humidity: 80, cluster: 0, size: 100 },
    { province: 'Long An', temp: 32, humidity: 83, cluster: 0, size: 90 },
    { province: 'Dong Nai', temp: 31, humidity: 81, cluster: 0, size: 95 },
    { province: 'Binh Duong', temp: 30, humidity: 79, cluster: 0, size: 85 },
    { province: 'Tien Giang', temp: 31, humidity: 82, cluster: 0, size: 80 },
    { province: 'Ben Tre', temp: 30, humidity: 80, cluster: 0, size: 75 },
    { province: 'Vinh Long', temp: 31, humidity: 81, cluster: 0, size: 70 },

    // Cluster 1: Moderate (Central provinces)
    { province: 'Da Nang', temp: 28, humidity: 70, cluster: 1, size: 110 },
    { province: 'Quang Nam', temp: 27, humidity: 68, cluster: 1, size: 95 },
    { province: 'Thua Thien-Hue', temp: 29, humidity: 72, cluster: 1, size: 100 },
    { province: 'Quang Ngai', temp: 28, humidity: 69, cluster: 1, size: 85 },
    { province: 'Binh Dinh', temp: 29, humidity: 71, cluster: 1, size: 90 },
    { province: 'Phu Yen', temp: 27, humidity: 67, cluster: 1, size: 80 },
    { province: 'Khanh Hoa', temp: 28, humidity: 70, cluster: 1, size: 95 },

    // Cluster 2: Cooler (Northern provinces)
    { province: 'Hanoi', temp: 26, humidity: 75, cluster: 2, size: 130 },
    { province: 'Hai Phong', temp: 27, humidity: 76, cluster: 2, size: 105 },
    { province: 'Ha Long', temp: 26, humidity: 74, cluster: 2, size: 90 },
    { province: 'Thai Nguyen', temp: 25, humidity: 73, cluster: 2, size: 85 },
    { province: 'Bac Ninh', temp: 26, humidity: 75, cluster: 2, size: 80 },
    { province: 'Hai Duong', temp: 27, humidity: 76, cluster: 2, size: 75 },
    { province: 'Nam Dinh', temp: 26, humidity: 74, cluster: 2, size: 70 },

    // Cluster 3: Highland (Mountainous regions)
    { province: 'Da Lat', temp: 22, humidity: 65, cluster: 3, size: 100 },
    { province: 'Lao Cai', temp: 23, humidity: 68, cluster: 3, size: 85 },
    { province: 'Ha Giang', temp: 21, humidity: 64, cluster: 3, size: 80 },
    { province: 'Cao Bang', temp: 22, humidity: 66, cluster: 3, size: 75 },
    { province: 'Lai Chau', temp: 23, humidity: 67, cluster: 3, size: 70 },
    { province: 'Dien Bien', temp: 22, humidity: 65, cluster: 3, size: 65 }
  ];

  const clusterColors = [
    'var(--weather-red)',      // Hot & Humid
    'var(--weather-yellow)',   // Moderate
    'var(--weather-cyan)',     // Cooler
    'var(--weather-blue)'      // Highland
  ];

  const clusterInfo = [
    { id: 0, name: 'Hot & Humid', provinces: 20, avgTemp: '30-32°C', avgHumidity: '79-83%', color: 'var(--weather-red)' },
    { id: 1, name: 'Moderate Climate', provinces: 18, avgTemp: '27-29°C', avgHumidity: '67-72%', color: 'var(--weather-yellow)' },
    { id: 2, name: 'Cooler Northern', provinces: 15, avgTemp: '25-27°C', avgHumidity: '73-76%', color: 'var(--weather-cyan)' },
    { id: 3, name: 'Highland Cool', provinces: 10, avgTemp: '21-23°C', avgHumidity: '64-68%', color: 'var(--weather-blue)' }
  ];

  return (
    <div className="space-y-6">
      {/* Cluster Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {clusterInfo.map((cluster) => (
          <div
            key={cluster.id}
            className="border border-border bg-card p-4 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cluster.color, boxShadow: `0 0 8px ${cluster.color}` }}
              ></div>
              <p className="text-xs" style={{ fontFamily: 'var(--font-heading)', color: cluster.color }}>
                CLUSTER {cluster.id}
              </p>
            </div>
            <h4 className="text-sm mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {cluster.name}
            </h4>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                Provinces: {cluster.provinces}
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                Temp: {cluster.avgTemp}
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                Humidity: {cluster.avgHumidity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* K-Means Clustering Scatter Plot */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <Layers className="w-4 h-4" />
          K-MEANS CLUSTERING: TEMPERATURE VS HUMIDITY
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
            <XAxis
              type="number"
              dataKey="temp"
              name="Temperature"
              unit="°C"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
              label={{ value: 'Temperature (°C)', position: 'bottom', style: { fontFamily: 'var(--font-mono)', fontSize: '11px', fill: 'var(--muted-foreground)' } }}
            />
            <YAxis
              type="number"
              dataKey="humidity"
              name="Humidity"
              unit="%"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
              label={{ value: 'Humidity (%)', angle: -90, position: 'left', style: { fontFamily: 'var(--font-mono)', fontSize: '11px', fill: 'var(--muted-foreground)' } }}
            />
            <ZAxis type="number" dataKey="size" range={[50, 200]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
              formatter={(value: any, name: string) => {
                if (name === 'temp') return [`${value}°C`, 'Temperature'];
                if (name === 'humidity') return [`${value}%`, 'Humidity'];
                return value;
              }}
              labelFormatter={(label) => {
                const point = clusterData.find((d) => d.temp === label);
                return point ? point.province : label;
              }}
            />
            <Scatter name="Provinces" data={clusterData}>
              {clusterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={clusterColors[entry.cluster]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Province List by Cluster */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <MapPin className="w-4 h-4" />
          PROVINCES BY CLIMATE CLUSTER
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {clusterInfo.map((cluster) => (
            <div key={cluster.id} className="border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cluster.color }}
                ></div>
                <p className="text-xs" style={{ fontFamily: 'var(--font-heading)', color: cluster.color }}>
                  {cluster.name.toUpperCase()}
                </p>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {clusterData
                  .filter((d) => d.cluster === cluster.id)
                  .slice(0, 8)
                  .map((province) => (
                    <p key={province.province} className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                      • {province.province}
                    </p>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
