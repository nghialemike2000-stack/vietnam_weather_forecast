import json
from datetime import date, datetime, timedelta
from enum import Enum
from functools import lru_cache
from pathlib import Path
from typing import Optional
from zoneinfo import ZoneInfo

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from fetch_data.fetch import locations, update_all_datasets
except ModuleNotFoundError:
    from backend.fetch_data.fetch import locations, update_all_datasets


APP_TZ = ZoneInfo("Asia/Bangkok")
BACKEND_ROOT = Path(__file__).resolve().parent
DATA_ROOT = BACKEND_ROOT / "load_weather_data" / "all"
ML_ROOT = BACKEND_ROOT / "ml_pipeline"

FEATURE_COLUMNS = [
    "temp",
    "humidity",
    "wind_speed",
    "cloud_cover",
    "pressure",
]

SUPPORTED_HORIZONS = (1, 3, 7)

PROVINCE_LABELS = {
    "An_Giang": "An Giang",
    "Bac_Ninh": "Bac Ninh",
    "Can_Tho": "Can Tho",
    "Cao_Bang": "Cao Bang",
    "Ca_Mau": "Ca Mau",
    "Dak_Lak": "Dak Lak",
    "Da_Nang": "Da Nang",
    "Dien_Bien": "Dien Bien",
    "Dong_Nai": "Dong Nai",
    "Dong_Thap": "Dong Thap",
    "Gia_Lai": "Gia Lai",
    "Hai_Phong": "Hai Phong",
    "Ha_Noi": "Ha Noi",
    "Ha_Tinh": "Ha Tinh",
    "Ho_Chi_Minh": "Ho Chi Minh",
    "Hue": "Hue",
    "Hung_Yen": "Hung Yen",
    "Khanh_Hoa": "Khanh Hoa",
    "Lai_Chau": "Lai Chau",
    "Lam_Dong": "Lam Dong",
    "Lang_Son": "Lang Son",
    "Lao_Cai": "Lao Cai",
    "Nghe_An": "Nghe An",
    "Ninh_Binh": "Ninh Binh",
    "Phu_Tho": "Phu Tho",
    "Quang_Ngai": "Quang Ngai",
    "Quang_Ninh": "Quang Ninh",
    "Quang_Tri": "Quang Tri",
    "Son_La": "Son La",
    "Tay_Ninh": "Tay Ninh",
    "Thai_Nguyen": "Thai Nguyen",
    "Thanh_Hoa": "Thanh Hoa",
    "Tuyen_Quang": "Tuyen Quang",
    "Vinh_Long": "Vinh Long",
}


class ProvinceEnum(str, Enum):
    An_Giang = "An_Giang"
    Bac_Ninh = "Bac_Ninh"
    Can_Tho = "Can_Tho"
    Cao_Bang = "Cao_Bang"
    Ca_Mau = "Ca_Mau"
    Dak_Lak = "Dak_Lak"
    Da_Nang = "Da_Nang"
    Dien_Bien = "Dien_Bien"
    Dong_Nai = "Dong_Nai"
    Dong_Thap = "Dong_Thap"
    Gia_Lai = "Gia_Lai"
    Hai_Phong = "Hai_Phong"
    Ha_Noi = "Ha_Noi"
    Ha_Tinh = "Ha_Tinh"
    Ho_Chi_Minh = "Ho_Chi_Minh"
    Hue = "Hue"
    Hung_Yen = "Hung_Yen"
    Khanh_Hoa = "Khanh_Hoa"
    Lai_Chau = "Lai_Chau"
    Lam_Dong = "Lam_Dong"
    Lang_Son = "Lang_Son"
    Lao_Cai = "Lao_Cai"
    Nghe_An = "Nghe_An"
    Ninh_Binh = "Ninh_Binh"
    Phu_Tho = "Phu_Tho"
    Quang_Ngai = "Quang_Ngai"
    Quang_Ninh = "Quang_Ninh"
    Quang_Tri = "Quang_Tri"
    Son_La = "Son_La"
    Tay_Ninh = "Tay_Ninh"
    Thai_Nguyen = "Thai_Nguyen"
    Thanh_Hoa = "Thanh_Hoa"
    Tuyen_Quang = "Tuyen_Quang"
    Vinh_Long = "Vinh_Long"


class AlgorithmEnum(str, Enum):
    Best = "Best"
    LightGBM = "LightGBM"
    LogisticRegression = "LogisticRegression"
    RandomForest = "RandomForest"
    XGBoost = "XGBoost"


class HorizonEnum(int, Enum):
    one = 1
    three = 3
    seven = 7


class PredictionMode(str, Enum):
    forecast = "forecast"
    evaluation = "evaluation"


class WeatherRequest(BaseModel):
    province: ProvinceEnum
    algorithm: AlgorithmEnum = AlgorithmEnum.Best
    horizon: HorizonEnum = HorizonEnum.one
    mode: PredictionMode = PredictionMode.forecast
    evaluation_date: Optional[date] = None


class ExplorationDateRequest(BaseModel):
    target_date: date


app = FastAPI(title="Vietnam Weather Forecast API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def today_local() -> date:
    return datetime.now(APP_TZ).date()


def location_by_province(province: str) -> dict:
    for location in locations:
        if location["destination"] == province:
            return location
    raise HTTPException(status_code=404, detail=f"Location not found for {province}")


def model_horizon_for_day(day_number: int) -> int:
    for horizon in SUPPORTED_HORIZONS:
        if day_number <= horizon:
            return horizon
    return SUPPORTED_HORIZONS[-1]


def metadata_sort_key(candidate: dict):
    metadata = candidate["metadata"]
    return (
        float(metadata.get("f1", 0)),
        float(metadata.get("roc_auc", 0)),
        float(metadata.get("accuracy", 0)),
    )


def iter_model_candidates(province: str, algorithm: str, horizon: int):
    algorithms = [
        "LightGBM",
        "LogisticRegression",
        "RandomForest",
        "XGBoost",
    ] if algorithm == AlgorithmEnum.Best.value else [algorithm]

    for algorithm_name in algorithms:
        model_root = ML_ROOT / algorithm_name / "models" / province / f"horizon_{horizon}"
        if not model_root.exists():
            continue

        for metadata_path in model_root.glob("model_*/metadata.json"):
            model_path = metadata_path.parent / "model.pkl"
            if not model_path.exists():
                continue

            with open(metadata_path, "r", encoding="utf-8") as file:
                metadata = json.load(file)
            yield {
                "algorithm": algorithm_name,
                "model_path": model_path,
                "metadata_path": metadata_path,
                "metadata": metadata,
            }


def select_model(province: str, algorithm: str, horizon: int):
    candidates = list(iter_model_candidates(province, algorithm, horizon))
    if not candidates:
        raise HTTPException(
            status_code=404,
            detail=f"No model found for province={province}, algorithm={algorithm}, horizon={horizon}",
        )

    return max(candidates, key=metadata_sort_key)


@lru_cache(maxsize=256)
def load_model(model_path: str):
    return joblib.load(model_path)


def load_weather_dataframe(province: str) -> pd.DataFrame:
    csv_path = DATA_ROOT / province / "all_weather.csv"
    if not csv_path.exists():
        raise HTTPException(status_code=404, detail=f"Dataset not found: {csv_path}")

    df = pd.read_csv(csv_path)
    if df.empty:
        raise HTTPException(status_code=404, detail=f"Dataset is empty for {province}")

    df["date"] = pd.to_datetime(df["date"]).dt.date
    df = df.sort_values("date").drop_duplicates(subset=["date"], keep="last")
    df = df.reset_index(drop=True)

    return df


def province_weather_on_date(province: str, target_date: date):
    df = load_weather_dataframe(province)
    rows = df[df["date"] == target_date]
    if rows.empty:
        return None

    row = rows.iloc[0]
    location = location_by_province(province)

    return {
        "province": province,
        "province_label": PROVINCE_LABELS.get(province, province),
        "date": target_date.isoformat(),
        "latitude": float(location["latitude"]),
        "longitude": float(location["longitude"]),
        "temp": float(row["temp"]),
        "humidity": float(row["humidity"]),
        "wind_speed": float(row["wind_speed"]),
        "cloud_cover": float(row["cloud_cover"]),
        "pressure": float(row["pressure"]),
        "rain": int(row["rain"]),
    }


def build_temperature_distribution(rows: list[dict]):
    bins = [
        {"range": "<20 C", "min": None, "max": 20, "count": 0, "provinces": []},
        {"range": "20-25 C", "min": 20, "max": 25, "count": 0, "provinces": []},
        {"range": "25-30 C", "min": 25, "max": 30, "count": 0, "provinces": []},
        {"range": "30-35 C", "min": 30, "max": 35, "count": 0, "provinces": []},
        {"range": "35-40 C", "min": 35, "max": 40, "count": 0, "provinces": []},
        {"range": ">=40 C", "min": 40, "max": None, "count": 0, "provinces": []},
    ]

    for row in rows:
        temp = row["temp"]

        for bucket in bins:
            lower_ok = bucket["min"] is None or temp >= bucket["min"]
            upper_ok = bucket["max"] is None or temp < bucket["max"]

            if lower_ok and upper_ok:
                bucket["count"] += 1
                bucket["provinces"].append(row["province_label"])
                break

    return [
        {
            "range": bucket["range"],
            "count": bucket["count"],
            "provinces": bucket["provinces"],
        }
        for bucket in bins
    ]

def build_range_distribution(rows, field, bins):
    prepared_bins = []

    for bucket in bins:
        prepared_bins.append({
            **bucket,
            "count": 0,
            "provinces": [],
        })

    for row in rows:
        value = row[field]

        for bucket in prepared_bins:
            lower_ok = bucket["min"] is None or value >= bucket["min"]
            upper_ok = bucket["max"] is None or value <= bucket["max"]

            if lower_ok and upper_ok:
                bucket["count"] += 1
                bucket["provinces"].append(row["province_label"])
                break

    return [
        {
            "range": bucket["range"],
            "count": bucket["count"],
            "provinces": bucket["provinces"],
        }
        for bucket in prepared_bins
    ]

def build_feature_frame(df: pd.DataFrame, anchor_date: date, lookback: int, model) -> pd.DataFrame:
    history = df[df["date"] < anchor_date].tail(lookback)
    if len(history) < lookback:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Not enough lookback data before {anchor_date}. "
                f"Need {lookback} rows, found {len(history)}."
            ),
        )

    row = {}
    for lag in range(1, lookback + 1):
        source = history.iloc[-lag]
        for feature in FEATURE_COLUMNS:
            row[f"{feature}_lag_{lag}"] = float(source[feature])

    expected_columns = getattr(model, "feature_names_in_", None)
    if expected_columns is not None:
        return pd.DataFrame([row], columns=list(expected_columns))

    return pd.DataFrame([row])


def latest_observation_before(df: pd.DataFrame, anchor_date: date):
    history = df[df["date"] < anchor_date]
    if history.empty:
        return None
    row = history.iloc[-1]
    return {
        "date": row["date"].isoformat(),
        "temp": float(row["temp"]),
        "humidity": float(row["humidity"]),
        "wind_speed": float(row["wind_speed"]),
        "cloud_cover": float(row["cloud_cover"]),
        "pressure": float(row["pressure"]),
        "rain": int(row["rain"]),
    }


def actual_rain_for_date(df: pd.DataFrame, target_date: date):
    actual_rows = df[df["date"] == target_date]
    if actual_rows.empty:
        return None
    return int(actual_rows.iloc[0]["rain"])


def predict_one(df: pd.DataFrame, province: str, algorithm: str, anchor_date: date, target_date: date, day_number: int):
    model_horizon = model_horizon_for_day(day_number)
    selected = select_model(province, algorithm, model_horizon)
    metadata = selected["metadata"]
    lookback = int(metadata["lookback"])
    model = load_model(str(selected["model_path"]))
    features = build_feature_frame(df, anchor_date, lookback, model)

    predicted_class = int(model.predict(features)[0])
    rain_probability = None

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(features)[0]
        classes = list(model.classes_)
        rain_index = classes.index(1) if 1 in classes else len(probabilities) - 1
        rain_probability = float(probabilities[rain_index])
    else:
        rain_probability = float(predicted_class)

    actual_rain = actual_rain_for_date(df, target_date)

    return {
        "date": target_date.isoformat(),
        "day_number": day_number,
        "predicted_rain": predicted_class,
        "result": "rain" if predicted_class == 1 else "no-rain",
        "rain_probability": round(rain_probability * 100, 2),
        "confidence": round(max(rain_probability, 1 - rain_probability) * 100, 2),
        "actual_rain": actual_rain,
        "is_correct": None if actual_rain is None else actual_rain == predicted_class,
        "algorithm": metadata.get("algorithm", selected["algorithm"]),
        "model_horizon": int(metadata.get("forecast_horizon", model_horizon)),
        "model_rank": int(metadata.get("model_rank", 0)),
        "lookback": lookback,
        "metrics": {
            "accuracy": round(float(metadata.get("accuracy", 0)) * 100, 2),
            "precision": round(float(metadata.get("precision", 0)) * 100, 2),
            "recall": round(float(metadata.get("recall", 0)) * 100, 2),
            "f1": round(float(metadata.get("f1", 0)) * 100, 2),
            "roc_auc": round(float(metadata.get("roc_auc", 0)) * 100, 2),
        },
    }


@app.get("/api/health")
def health_check():
    return {"status": "ok", "today": today_local().isoformat()}


@app.get("/api/provinces")
def get_provinces():
    return [
        {
            "value": location["destination"],
            "label": PROVINCE_LABELS.get(location["destination"], location["destination"]),
            "latitude": location["latitude"],
            "longitude": location["longitude"],
        }
        for location in locations
    ]


@app.post("/api/fetch-all")
def fetch_all():
    results = update_all_datasets(max_retries=2, sleep_seconds=2)
    failed = [result for result in results if result["status"] == "failed"]

    return {
        "status": "completed_with_errors" if failed else "completed",
        "updated_count": sum(1 for result in results if result["status"] == "updated"),
        "failed_count": len(failed),
        "results": results,
    }


@app.post("/api/exploration")
def get_exploration_snapshot(request: ExplorationDateRequest):
    min_date = date(2020, 1, 1)
    max_date = today_local() - timedelta(days=1)

    if request.target_date < min_date or request.target_date > max_date:
        raise HTTPException(
            status_code=400,
            detail=f"target_date must be between {min_date.isoformat()} and {max_date.isoformat()}",
        )

    rows = []
    missing = []

    for province in ProvinceEnum:
        row = province_weather_on_date(province.value, request.target_date)
        if row is None:
            missing.append(province.value)
        else:
            rows.append(row)

    if not rows:
        raise HTTPException(
            status_code=404,
            detail=f"No weather data found for {request.target_date.isoformat()}",
        )

    temps = [row["temp"] for row in rows]
    humidities = [row["humidity"] for row in rows]
    wind_speeds = [row["wind_speed"] for row in rows]
    rain_days = sum(row["rain"] for row in rows)

    return {
        "date": request.target_date.isoformat(),
        "province_count": len(rows),
        "expected_province_count": len(ProvinceEnum),
        "missing_provinces": missing,
        "stats": {
            "avg_temp": round(sum(temps) / len(temps), 2),
            "min_temp": round(min(temps), 2),
            "max_temp": round(max(temps), 2),
            "avg_humidity": round(sum(humidities) / len(humidities), 2),
            "avg_wind_speed": round(sum(wind_speeds) / len(wind_speeds), 2),
            "rainy_provinces": int(rain_days),
        },
        "temperature_distribution": build_temperature_distribution(rows),
        "humidity_distribution": build_range_distribution(
            rows,
            "humidity",
            [
                {"range": "0-20%", "min": 0, "max": 20},
                {"range": "21-40%", "min": 21, "max": 40},
                {"range": "41-60%", "min": 41, "max": 60},
                {"range": "61-80%", "min": 61, "max": 80},
                {"range": "81-100%", "min": 81, "max": 100},
            ],
        ),

        "cloud_cover_distribution": build_range_distribution(
            rows,
            "cloud_cover",
            [
                {"range": "0-20%", "min": 0, "max": 20},
                {"range": "21-40%", "min": 21, "max": 40},
                {"range": "41-60%", "min": 41, "max": 60},
                {"range": "61-80%", "min": 61, "max": 80},
                {"range": "81-100%", "min": 81, "max": 100},
            ],
        ),

        "wind_distribution": build_range_distribution(
            rows,
            "wind_speed",
            [
                {"range": "0-10", "min": 0, "max": 10},
                {"range": "11-20", "min": 11, "max": 20},
                {"range": "21-30", "min": 21, "max": 30},
                {"range": "31-40", "min": 31, "max": 40},
                {"range": "41+", "min": 41, "max": None},
            ],
        ),

        "pressure_distribution": build_range_distribution(
            rows,
            "pressure",
            [
                {"range": "<1000", "min": None, "max": 999},
                {"range": "1000-1005", "min": 1000, "max": 1005},
                {"range": "1006-1010", "min": 1006, "max": 1010},
                {"range": "1011-1015", "min": 1011, "max": 1015},
                {"range": ">1015", "min": 1016, "max": None},
            ],
        ),

        "rain_distribution": [
            {
                "range": "No Rain",
                "count": sum(1 for row in rows if row["rain"] == 0),
                "provinces": [row["province_label"] for row in rows if row["rain"] == 0],
            },
            {
                "range": "Rain",
                "count": sum(1 for row in rows if row["rain"] == 1),
                "provinces": [row["province_label"] for row in rows if row["rain"] == 1],
            },
        ],
        "rows": rows,
    }


@app.post("/api/predict")
def predict_weather(request: WeatherRequest):
    province = request.province.value
    algorithm = request.algorithm.value
    horizon = request.horizon.value
    current_date = today_local()

    if request.mode == PredictionMode.evaluation:
        if request.evaluation_date is None:
            raise HTTPException(
                status_code=422,
                detail="evaluation_date is required when mode='evaluation'",
            )
        if request.evaluation_date >= current_date:
            raise HTTPException(
                status_code=400,
                detail="evaluation_date must be earlier than today",
            )
        start_date = request.evaluation_date
    else:
        start_date = current_date

    df = load_weather_dataframe(province)
    location = location_by_province(province)
    latest_observation = latest_observation_before(df, start_date)

    if latest_observation is None:
        raise HTTPException(
            status_code=400,
            detail=f"No historical observations found before {start_date}",
        )

    yesterday = current_date - timedelta(days=1)
    data_last_date = max(df["date"])
    data_is_fresh = data_last_date >= yesterday

    predictions = [
        predict_one(
            df=df,
            province=province,
            algorithm=algorithm,
            anchor_date=start_date,
            target_date=start_date + timedelta(days=day_index),
            day_number=day_index + 1,
        )
        for day_index in range(horizon)
    ]

    comparable = [item for item in predictions if item["is_correct"] is not None]
    accuracy_summary = None
    if comparable:
        correct = sum(1 for item in comparable if item["is_correct"])
        accuracy_summary = {
            "correct": correct,
            "total": len(comparable),
            "accuracy": round(correct / len(comparable) * 100, 2),
        }

    return {
        "province": province,
        "province_label": PROVINCE_LABELS.get(province, province),
        "latitude": location["latitude"],
        "longitude": location["longitude"],
        "algorithm_requested": algorithm,
        "horizon": horizon,
        "mode": request.mode.value,
        "start_date": start_date.isoformat(),
        "data_last_date": data_last_date.isoformat(),
        "data_is_fresh": data_is_fresh,
        "latest_observation": latest_observation,
        "predictions": predictions,
        "accuracy_summary": accuracy_summary,
    }
