import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Calendar,
  CloudRain,
  Droplets,
  Loader2,
  Thermometer,
  TrendingUp,
  Wind,
} from "lucide-react";
import { ExplorationSnapshot, fetchExplorationSnapshot } from "../weatherApi";
import { getProvinceOption } from "../weatherConfig";
import { WeatherData } from "./InputPanel";

interface EDAPanelProps {
  data: WeatherData | null;
}

const MIN_DATE = "2020-01-01";
const BAR_COLORS = [
  "var(--weather-blue)",
  "var(--weather-cyan)",
  "var(--weather-green)",
  "var(--weather-yellow)",
  "var(--weather-orange)",
  "var(--weather-red)",
];

function toDateInputValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function yesterdayInputValue() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return toDateInputValue(yesterday);
}

export function EDAPanel({ data }: EDAPanelProps) {
  const maxDate = useMemo(() => yesterdayInputValue(), []);
  const [selectedDate, setSelectedDate] = useState(maxDate);
  const [snapshot, setSnapshot] = useState<ExplorationSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    fetchExplorationSnapshot(selectedDate)
      .then((payload) => {
        if (active) setSnapshot(payload);
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load exploration data",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedDate]);

  const rows = useMemo(() => {
    return [...(snapshot?.rows ?? [])].sort((a, b) =>
      a.province.localeCompare(b.province),
    );
  }, [snapshot]);

  const selectedProvinceRow = data
    ? rows.find((row) => row.province === data.province)
    : null;

  const stats = snapshot
    ? [
        {
          label: "Provinces",
          value: `${snapshot.province_count}/${snapshot.expected_province_count}`,
          icon: TrendingUp,
          color: "var(--weather-green)",
        },
        {
          label: "Avg Temp",
          value: `${snapshot.stats.avg_temp.toFixed(1)} C`,
          icon: Thermometer,
          color: "var(--weather-orange)",
        },
        {
          label: "Avg Humidity",
          value: `${snapshot.stats.avg_humidity.toFixed(0)}%`,
          icon: Droplets,
          color: "var(--weather-blue)",
        },
        {
          label: "Rainy Provinces",
          value: `${snapshot.stats.rainy_provinces}`,
          icon: CloudRain,
          color: "var(--weather-cyan)",
        },
      ]
    : [];

  const renderDistributionChart = (title: string, chartData: any[]) => (
    <div className="border border-border bg-card p-6">
      <h3
        className="text-sm text-primary mb-4"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />

          <XAxis
            dataKey="range"
            stroke="var(--muted-foreground)"
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
            }}
          />

          <YAxis
            allowDecimals={false}
            stroke="var(--muted-foreground)"
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
            }}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;

              const data = payload[0].payload;

              return (
                <div
                  className="border border-border bg-card p-3 text-xs"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <p className="mb-2 text-primary">{data.range}</p>

                  <p>Province count: {data.count}</p>

                  <div className="mt-2">
                    {data.provinces.map((province: string) => (
                      <div key={province}>• {province}</div>
                    ))}
                  </div>
                </div>
              );
            }}
          />

          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((_: any, idx: number) => (
              <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="border border-border bg-card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3
              className="text-sm text-primary mb-2 flex items-center gap-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Calendar className="w-4 h-4" />
              DAILY EXPLORATION SNAPSHOT
            </h3>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Select a date from 2020-01-01 to yesterday to inspect the
              34-province weather snapshot.
            </p>
          </div>

          <div className="w-full md:w-64">
            <label
              className="text-xs text-muted-foreground mb-2 block"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              DATE
            </label>
            <input
              type="date"
              min={MIN_DATE}
              max={maxDate}
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="w-full bg-input-background border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="border border-[var(--weather-red)] bg-[var(--weather-red)]/10 px-5 py-4">
          <p
            className="text-sm text-[var(--weather-red)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {error}
          </p>
        </div>
      )}

      {loading && (
        <div className="border border-border bg-card/50 p-8 text-center">
          <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto mb-3" />
          <p
            className="text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            LOADING EXPLORATION DATA...
          </p>
        </div>
      )}

      {!loading && snapshot && (
        <>
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="border border-border bg-card p-5 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    <p
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {stat.label.toUpperCase()}
                    </p>
                  </div>
                  <p
                    className="text-3xl tracking-tight group-hover:scale-105 transition-transform"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {selectedProvinceRow && (
            <div className="border border-primary bg-primary/10 p-5">
              <h3
                className="text-sm text-primary mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                SELECTED PROVINCE ON {selectedDate}
              </h3>
              <div className="grid grid-cols-6 gap-4">
                <Metric
                  label="Province"
                  value={getProvinceOption(selectedProvinceRow.province).label}
                />
                <Metric
                  label="Temp"
                  value={`${selectedProvinceRow.temp.toFixed(1)} C`}
                />
                <Metric
                  label="Humidity"
                  value={`${selectedProvinceRow.humidity.toFixed(0)}%`}
                />
                <Metric
                  label="Wind"
                  value={`${selectedProvinceRow.wind_speed.toFixed(1)} km/h`}
                />
                <Metric
                  label="Cloud"
                  value={`${selectedProvinceRow.cloud_cover.toFixed(0)}%`}
                />
                <Metric
                  label="Rain"
                  value={selectedProvinceRow.rain ? "Rain" : "No rain"}
                />
              </div>
            </div>
          )}

          {snapshot && (
            <div className="space-y-8">
              {renderDistributionChart(
                "TEMPERATURE DISTRIBUTION ACROSS 34 PROVINCES",
                snapshot.temperature_distribution,
              )}

              {renderDistributionChart(
                "HUMIDITY DISTRIBUTION ACROSS 34 PROVINCES",
                snapshot.humidity_distribution,
              )}

              {renderDistributionChart(
                "CLOUD COVER DISTRIBUTION ACROSS 34 PROVINCES",
                snapshot.cloud_cover_distribution,
              )}

              {renderDistributionChart(
                "WIND DISTRIBUTION ACROSS 34 PROVINCES",
                snapshot.wind_distribution,
              )}

              {renderDistributionChart(
                "PRESSURE DISTRIBUTION ACROSS 34 PROVINCES",
                snapshot.pressure_distribution,
              )}

              {renderDistributionChart(
                "RAIN DISTRIBUTION ACROSS 34 PROVINCES",
                snapshot.rain_distribution,
              )}
            </div>
          )}

          <div className="border border-border bg-card overflow-hidden">
            <div className="bg-secondary/50 px-6 py-3 border-b border-border flex items-center justify-between">
              <h3
                className="text-sm text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                PROVINCE WEATHER ROWS
              </h3>
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {snapshot.date}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    {[
                      "Province",
                      "Temp",
                      "Humidity",
                      "Wind",
                      "Cloud",
                      "Pressure",
                      "Rain",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="text-left px-6 py-3 text-xs text-muted-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {heading.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row.province}
                      className={`border-b border-border/50 ${
                        row.province === data?.province
                          ? "bg-primary/10"
                          : index % 2 === 0
                            ? "bg-card"
                            : "bg-secondary/10"
                      }`}
                    >
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {getProvinceOption(row.province).label}
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-[var(--weather-orange)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {row.temp.toFixed(1)} C
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {row.humidity.toFixed(0)}%
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {row.wind_speed.toFixed(1)} km/h
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {row.cloud_cover.toFixed(0)}%
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {row.pressure.toFixed(1)} hPa
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {row.rain ? "Rain" : "No rain"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {snapshot.missing_provinces.length > 0 && (
            <div className="border border-[var(--weather-orange)] bg-[var(--weather-orange)]/10 px-5 py-4">
              <p
                className="text-sm text-[var(--weather-orange)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Missing data for: {snapshot.missing_provinces.join(", ")}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-[10px] text-muted-foreground mb-1"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label.toUpperCase()}
      </p>
      <p
        className="text-sm text-foreground"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {value}
      </p>
    </div>
  );
}
