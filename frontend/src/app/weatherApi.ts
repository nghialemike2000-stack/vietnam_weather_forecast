import { WeatherRequestPayload } from './weatherConfig';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export interface LatestObservation {
  date: string;
  temp: number;
  humidity: number;
  wind_speed: number;
  cloud_cover: number;
  pressure: number;
  rain: number;
}

export interface PredictionItem {
  date: string;
  day_number: number;
  predicted_rain: number;
  result: 'rain' | 'no-rain';
  rain_probability: number;
  confidence: number;
  actual_rain: number | null;
  is_correct: boolean | null;
  algorithm: string;
  model_horizon: number;
  model_rank: number;
  lookback: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    roc_auc: number;
  };
}

export interface WeatherPredictionResponse {
  province: string;
  province_label: string;
  latitude: number;
  longitude: number;
  algorithm_requested: string;
  horizon: number;
  mode: 'forecast' | 'evaluation';
  start_date: string;
  data_last_date: string;
  data_is_fresh: boolean;
  latest_observation: LatestObservation;
  predictions: PredictionItem[];
  accuracy_summary: {
    correct: number;
    total: number;
    accuracy: number;
  } | null;
}

export interface FetchAllResponse {
  status: string;
  updated_count: number;
  failed_count: number;
  results: Array<{
    province: string;
    status: string;
    start_date?: string;
    end_date?: string;
    last_date_before?: string | null;
    last_date_after?: string | null;
    added_rows: number;
    error?: string | null;
  }>;
}

export interface ExplorationRow {
  province: string;
  province_label: string;
  date: string;
  latitude: number;
  longitude: number;
  temp: number;
  humidity: number;
  wind_speed: number;
  cloud_cover: number;
  pressure: number;
  rain: number;
}

type DistributionBucket = {
  range: string;
  count: number;
  provinces: string[];
};

export interface ExplorationSnapshot {
  date: string;
  province_count: number;
  expected_province_count: number;
  missing_provinces: string[];
  stats: {
    avg_temp: number;
    min_temp: number;
    max_temp: number;
    avg_humidity: number;
    avg_wind_speed: number;
    rainy_provinces: number;
  };

  temperature_distribution: DistributionBucket[];
  humidity_distribution: DistributionBucket[];
  cloud_cover_distribution: DistributionBucket[];
  wind_distribution: DistributionBucket[];
  pressure_distribution: DistributionBucket[];
  rain_distribution: DistributionBucket[];

  rows: ExplorationRow[];
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = payload?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg).join(', ')
      : detail ?? 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}

export async function predictWeather(payload: WeatherRequestPayload) {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<WeatherPredictionResponse>(response);
}

export async function fetchAllWeatherData() {
  const response = await fetch(`${API_BASE_URL}/api/fetch-all`, {
    method: 'POST',
  });

  return parseApiResponse<FetchAllResponse>(response);
}

export async function fetchExplorationSnapshot(targetDate: string) {
  const response = await fetch(`${API_BASE_URL}/api/exploration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_date: targetDate }),
  });

  return parseApiResponse<ExplorationSnapshot>(response);
}