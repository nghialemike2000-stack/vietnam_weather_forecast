import { useEffect, useState } from 'react';
import { TopNav } from './components/TopNav';
import { InputPanel, WeatherData } from './components/InputPanel';
import { PredictionOutput } from './components/PredictionOutput';
import { ReporterMode } from './components/ReporterMode';
import { FeedbackPanel } from './components/FeedbackPanel';
import { fetchAllWeatherData, predictWeather, WeatherPredictionResponse } from './weatherApi';
import { getProvinceOption, WeatherRequestPayload } from './weatherConfig';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [predictionResponse, setPredictionResponse] = useState<WeatherPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncSummary, setSyncSummary] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handlePredict = async (request: WeatherRequestPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await predictWeather(request);
      const provinceInfo = getProvinceOption(response.province);

      setWeatherData({
        location: response.province_label,
        province: response.province,
        provinceLabel: response.province_label,
        dateTime: response.latest_observation.date,
        temperature: response.latest_observation.temp,
        humidity: response.latest_observation.humidity,
        windSpeed: response.latest_observation.wind_speed,
        cloudCover: response.latest_observation.cloud_cover,
        pressure: response.latest_observation.pressure,
        latitude: response.latitude ?? provinceInfo.latitude,
        longitude: response.longitude ?? provinceInfo.longitude,
        algorithm: request.algorithm,
        horizon: request.horizon,
        mode: request.mode,
        evaluationDate: request.evaluation_date,
      });

      setPredictionResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to run prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncData = async () => {
    setSyncLoading(true);
    setSyncSummary(null);
    setError(null);

    try {
      const response = await fetchAllWeatherData();
      setSyncSummary(
        `${response.status}: ${response.updated_count} updated, ${response.failed_count} failed`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sync weather data');
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div className="size-full flex flex-col bg-background text-foreground overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[var(--weather-blue)]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full">
        <TopNav theme={theme} onThemeToggle={toggleTheme} />

        <div className="flex flex-1 overflow-hidden">
          <InputPanel
            onPredict={handlePredict}
            onSyncData={handleSyncData}
            loading={loading}
            syncLoading={syncLoading}
            syncSummary={syncSummary}
          />

          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {error && (
                <div className="border border-[var(--weather-red)] bg-[var(--weather-red)]/10 px-5 py-4">
                  <p className="text-sm text-[var(--weather-red)]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {error}
                  </p>
                </div>
              )}

              <PredictionOutput
                data={weatherData}
                response={predictionResponse}
                loading={loading}
              />
              <ReporterMode data={weatherData} />
              {/* <FeedbackPanel /> */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
