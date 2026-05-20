import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar } from 'recharts';
import { Maximize2, TrendingUp } from 'lucide-react';
import { WeatherData } from './InputPanel';

interface PCAPanelProps {
  data: WeatherData | null;
}

export function PCAPanel({ data }: PCAPanelProps) {
  // Generate PCA transformed data
  const pcaData = [
    { province: 'Hanoi', pc1: -2.5, pc2: 1.2, region: 'North' },
    { province: 'Hai Phong', pc1: -2.3, pc2: 1.5, region: 'North' },
    { province: 'Thai Nguyen', pc1: -2.8, pc2: 0.9, region: 'North' },
    { province: 'Ha Long', pc1: -2.4, pc2: 1.3, region: 'North' },
    { province: 'Nam Dinh', pc1: -2.6, pc2: 1.1, region: 'North' },

    { province: 'Da Nang', pc1: 0.3, pc2: -0.5, region: 'Central' },
    { province: 'Hue', pc1: 0.5, pc2: -0.3, region: 'Central' },
    { province: 'Quang Nam', pc1: 0.2, pc2: -0.6, region: 'Central' },
    { province: 'Quang Ngai', pc1: 0.4, pc2: -0.4, region: 'Central' },
    { province: 'Binh Dinh', pc1: 0.6, pc2: -0.2, region: 'Central' },

    { province: 'Ho Chi Minh', pc1: 2.8, pc2: 0.8, region: 'South' },
    { province: 'Can Tho', pc1: 2.6, pc2: 1.0, region: 'South' },
    { province: 'Dong Nai', pc1: 2.7, pc2: 0.9, region: 'South' },
    { province: 'Binh Duong', pc1: 2.5, pc2: 0.7, region: 'South' },
    { province: 'Long An', pc1: 2.9, pc2: 1.1, region: 'South' },

    { province: 'Da Lat', pc1: -0.5, pc2: -2.8, region: 'Highland' },
    { province: 'Lao Cai', pc1: -0.7, pc2: -2.6, region: 'Highland' },
    { province: 'Ha Giang', pc1: -0.8, pc2: -2.9, region: 'Highland' },
    { province: 'Cao Bang', pc1: -0.6, pc2: -2.7, region: 'Highland' },
    { province: 'Lai Chau', pc1: -0.4, pc2: -2.5, region: 'Highland' }
  ];

  const regionColors: Record<string, string> = {
    'North': 'var(--weather-cyan)',
    'Central': 'var(--weather-yellow)',
    'South': 'var(--weather-red)',
    'Highland': 'var(--weather-blue)'
  };

  // Explained variance ratio
  const varianceData = [
    { component: 'PC1', variance: 68.5, cumulative: 68.5 },
    { component: 'PC2', variance: 18.3, cumulative: 86.8 },
    { component: 'PC3', variance: 8.2, cumulative: 95.0 },
    { component: 'PC4', variance: 3.1, cumulative: 98.1 },
    { component: 'PC5', variance: 1.9, cumulative: 100.0 }
  ];

  // Feature loadings
  const loadingsData = [
    { feature: 'Temperature', pc1: 0.52, pc2: 0.31 },
    { feature: 'Humidity', pc1: 0.48, pc2: -0.42 },
    { feature: 'Pressure', pc1: -0.45, pc2: 0.38 },
    { feature: 'Wind Speed', pc1: 0.35, pc2: 0.51 },
    { feature: 'Cloud Cover', pc1: 0.42, pc2: -0.35 }
  ];

  return (
    <div className="space-y-6">
      {/* PCA Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="border border-primary bg-primary/10 p-5">
          <p className="text-xs text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
            DIMENSIONS REDUCED
          </p>
          <p className="text-3xl text-primary mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
            5 → 2
          </p>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
            From 5 features to 2 components
          </p>
        </div>
        <div className="border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
            VARIANCE EXPLAINED
          </p>
          <p className="text-3xl text-[var(--weather-green)]" style={{ fontFamily: 'var(--font-mono)' }}>
            86.8%
          </p>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
            By first 2 principal components
          </p>
        </div>
        <div className="border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
            TOTAL PROVINCES
          </p>
          <p className="text-3xl text-[var(--weather-yellow)]" style={{ fontFamily: 'var(--font-mono)' }}>
            63
          </p>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
            Analyzed and visualized
          </p>
        </div>
      </div>

      {/* PCA Scatter Plot */}
      <div className="border border-border bg-card p-6">
        <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <Maximize2 className="w-4 h-4" />
          PCA: PRINCIPAL COMPONENTS ANALYSIS (PC1 vs PC2)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
            <XAxis
              type="number"
              dataKey="pc1"
              name="PC1"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
              label={{ value: 'First Principal Component (68.5% variance)', position: 'bottom', style: { fontFamily: 'var(--font-mono)', fontSize: '11px', fill: 'var(--muted-foreground)' } }}
            />
            <YAxis
              type="number"
              dataKey="pc2"
              name="PC2"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
              label={{ value: 'Second Principal Component (18.3% variance)', angle: -90, position: 'left', style: { fontFamily: 'var(--font-mono)', fontSize: '11px', fill: 'var(--muted-foreground)' } }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
              formatter={(value: any, name: string) => {
                if (name === 'pc1') return [value.toFixed(2), 'PC1'];
                if (name === 'pc2') return [value.toFixed(2), 'PC2'];
                return value;
              }}
              labelFormatter={(label) => {
                const point = pcaData.find((d) => d.pc1 === label);
                return point ? `${point.province} (${point.region})` : label;
              }}
            />
            <Scatter name="Provinces" data={pcaData} fill="var(--primary)">
              {pcaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={regionColors[entry.region]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          {Object.entries(regionColors).map(([region, color]) => (
            <div key={region} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{region}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explained Variance */}
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-border bg-card p-6">
          <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <TrendingUp className="w-4 h-4" />
            EXPLAINED VARIANCE RATIO
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={varianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
              <XAxis dataKey="component" stroke="var(--muted-foreground)" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                formatter={(value: any) => `${value}%`}
              />
              <Bar dataKey="variance" name="Variance Explained (%)" fill="var(--weather-cyan)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-border bg-card p-6">
          <h3 className="text-sm text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            FEATURE LOADINGS (PC1 & PC2)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={loadingsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
              <XAxis type="number" stroke="var(--muted-foreground)" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }} domain={[-0.6, 0.6]} />
              <YAxis type="category" dataKey="feature" stroke="var(--muted-foreground)" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
              />
              <Bar dataKey="pc1" name="PC1 Loading" fill="var(--weather-orange)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="pc2" name="PC2 Loading" fill="var(--weather-blue)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
