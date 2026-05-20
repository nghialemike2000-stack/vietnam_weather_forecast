# Vietnam Weather Forecast Dashboard

## 1. Project Overview

Vietnam Weather Forecast Dashboard is a machine learning based weather forecasting system for 34 provinces and cities in Vietnam.

The project combines:

- historical weather data collection
- automated dataset synchronization
- machine learning model training
- forecast evaluation
- FastAPI backend services
- React + TypeScript frontend visualization

The main objective is to predict whether rain will occur in future days using historical weather observations.

The project supports:

- 1-day forecast
- 3-day forecast
- 7-day forecast
- historical evaluation mode
- exploratory weather analysis
- automatic weather dataset updates

---

# 2. System Architecture

The project is divided into 3 main layers.

```txt
Open Meteo API
       ↓
Data Fetching + Preprocessing
       ↓
Machine Learning Training Pipeline
       ↓
FastAPI Backend
       ↓
React Frontend Dashboard
```

---

# 3. Weather Data Source

## 3.1 Main Weather Provider

The project uses weather data from Open Meteo.

Main website:

```txt
https://open-meteo.com/
```

Historical archive API:

```txt
https://archive-api.open-meteo.com/v1/archive
```

The system fetches historical daily weather observations for all supported Vietnamese provinces.

---

# 3.2 Weather Variables Used

The project collects the following weather features:

| Feature | Description | Unit |
|---|---|---|
| temperature_2m_mean | Mean daily temperature | °C |
| relative_humidity_2m_mean | Mean daily humidity | % |
| wind_speed_10m_max | Maximum daily wind speed | km/h |
| cloud_cover_mean | Mean daily cloud cover | % |
| surface_pressure_mean | Mean surface pressure | hPa |
| precipitation_sum | Total precipitation | mm |

---

# 3.3 Rain Label Generation

The API returns:

```txt
precipitation_sum
```

The project converts precipitation into binary rain labels.

| Condition | Rain Label |
|---|---|
| precipitation_sum > 0 | 1 |
| precipitation_sum = 0 | 0 |

This transforms the forecasting problem into binary classification.

---

# 3.4 Historical Data Fetch URL

The backend dynamically generates weather API requests.

Example:

```python
url = (
    "https://archive-api.open-meteo.com/v1/archive?"
    f"latitude={latitude}"
    f"&longitude={longitude}"
    f"&start_date={start_date}"
    f"&end_date={end_date}"
    "&daily="
    "temperature_2m_mean,"
    "relative_humidity_2m_mean,"
    "wind_speed_10m_max,"
    "cloud_cover_mean,"
    "surface_pressure_mean,"
    "precipitation_sum"
    "&timezone=Asia%2FBangkok"
)
```

---

# 3.5 Example API Request

Example request for Ho Chi Minh City:

| Field | Value |
|---|---|
| Province | Ho Chi Minh |
| Latitude | 10.8231 |
| Longitude | 106.6297 |

Example API URL:

```txt
https://archive-api.open-meteo.com/v1/archive?latitude=10.8231&longitude=106.6297&start_date=2025-01-01&end_date=2025-01-31&daily=temperature_2m_mean,precipitation_sum
```

---

# 3.6 Example API Response

The API returns JSON formatted weather data.

Example:

```json
{
  "latitude": 10.790861,
  "longitude": 106.6313,
  "generationtime_ms": 5.9117,
  "timezone": "GMT",
  "daily_units": {
    "time": "iso8601",
    "temperature_2m_mean": "°C",
    "precipitation_sum": "mm"
  },
  "daily": {
    "time": [
      "2025-01-01",
      "2025-01-02",
      "2025-01-03"
    ],
    "temperature_2m_mean": [
      25.5,
      26.3,
      26.2
    ],
    "precipitation_sum": [
      0.00,
      0.30,
      0.80
    ]
  }
}
```

The backend then converts this response into structured pandas DataFrames.

---

# 3.7 Internal Dataset Format

After preprocessing, each province dataset is stored as:

| date | destination | latitude | longitude | temp | humidity | wind_speed | cloud_cover | pressure | rain |
|---|---|---|---|---|---|---|---|---|---|
| 2020-01-01 | Ha_Noi | 21.0285 | 105.8542 | 20.0 | 88 | 9.2 | 83 | 1021.4 | 1 |

The backend stores one dataset file per province.

---

# 4. Supported Provinces

The project currently supports 34 provinces and cities in Vietnam.

| Province | Latitude | Longitude |
|---|---|---|
| Ha_Noi | 21.0285 | 105.8542 |
| Hue | 16.4637 | 107.5909 |
| Lai_Chau | 22.3964 | 103.4582 |
| Dien_Bien | 21.3860 | 103.0230 |
| Son_La | 21.3256 | 103.9188 |
| Lang_Son | 21.8537 | 106.7610 |
| Quang_Ninh | 21.0064 | 107.2925 |
| Thanh_Hoa | 19.8067 | 105.7852 |
| Nghe_An | 18.6796 | 105.6813 |
| Ha_Tinh | 18.3550 | 105.8877 |
| Cao_Bang | 22.6667 | 106.2500 |
| Tuyen_Quang | 21.8233 | 105.2181 |
| Lao_Cai | 22.4856 | 103.9707 |
| Thai_Nguyen | 21.5942 | 105.8482 |
| Phu_Tho | 21.3227 | 105.4010 |
| Bac_Ninh | 21.1861 | 106.0763 |
| Hung_Yen | 20.6464 | 106.0511 |
| Hai_Phong | 20.8449 | 106.6881 |
| Ninh_Binh | 20.2506 | 105.9745 |
| Quang_Tri | 16.7500 | 107.2000 |
| Da_Nang | 16.0544 | 108.2022 |
| Quang_Ngai | 15.1214 | 108.8044 |
| Gia_Lai | 13.9833 | 108.0000 |
| Khanh_Hoa | 12.2388 | 109.1967 |
| Lam_Dong | 11.9404 | 108.4583 |
| Dak_Lak | 12.7100 | 108.2378 |
| Ho_Chi_Minh | 10.8231 | 106.6297 |
| Dong_Nai | 10.9453 | 106.8240 |
| Tay_Ninh | 11.3352 | 106.1099 |
| Can_Tho | 10.0452 | 105.7469 |
| Vinh_Long | 10.2537 | 105.9722 |
| Dong_Thap | 10.4938 | 105.6881 |
| Ca_Mau | 9.1769 | 105.1524 |
| An_Giang | 10.5216 | 105.1259 |

---

# 5. Dataset Timeline

## Training Dataset

| Start Date | End Date |
|---|---|
| 2020-01-01 | 2025-12-31 |

---

## Testing Dataset

| Start Date | End Date |
|---|---|
| 2026-01-01 | 2026-04-30 |

The testing dataset is separated from training data to avoid leakage.

---

# 6. Feature Engineering

## 6.1 Lookback Window

The project uses rolling historical windows.

Example configuration:

```python
LOOKBACKS = [3, 5, 7, 10, 15, 30]
```

A lookback window means:

- use previous historical days
- convert them into lag features
- predict future rain occurrence

Example:

For lookback = 7:

The model receives:

- temperature from previous 7 days
- humidity from previous 7 days
- pressure from previous 7 days
- cloud cover from previous 7 days
- wind speed from previous 7 days

and predicts future rain labels.

---

# 6.2 Forecast Horizons

The system supports:

| Horizon | Meaning |
|---|---|
| 1 | predict current / next day |
| 3 | predict next 3 days |
| 7 | predict next 7 days |

Each horizon has independent trained models.

---

# 7. Machine Learning Pipeline

## 7.1 Problem Type

The project is a binary classification problem.

| Label | Meaning |
|---|---|
| 0 | no rain |
| 1 | rain |

---

# 7.2 Models Used

The project trains and evaluates:

| Model | Description |
|---|---|
| Logistic Regression | linear classifier |
| Random Forest | ensemble tree model |
| XGBoost | gradient boosting |
| LightGBM | gradient boosting |

---

# 7.3 Training Strategy

Models are trained separately for:

- province
- forecast horizon
- lookback range
- algorithm type

This creates:

```txt
province × horizon × lookback × algorithm
```

trained model combinations.

---

# 7.4 Example Training Flow

```txt
Load Province Dataset
        ↓
Generate Lag Features
        ↓
Split Train/Test Data
        ↓
Train ML Model
        ↓
Generate Predictions
        ↓
Evaluate Metrics
        ↓
Save Best Model
```

---

# 8. Model Evaluation

The project evaluates:

| Metric | Description |
|---|---|
| Accuracy | overall correctness |
| Precision | rain prediction quality |
| Recall | rain detection sensitivity |
| F1 Score | balance of precision and recall |
| ROC AUC | classification quality |

The backend automatically ranks models using:

- F1 score
- ROC AUC
- Accuracy

and selects the best model.

---

# 9. Backend Architecture

The backend is implemented using FastAPI.

Main responsibilities:

- weather data synchronization
- prediction API
- evaluation API
- model loading
- feature generation
- EDA snapshot generation

---

# 9.1 Main API Endpoints

| Endpoint | Purpose |
|---|---|
| GET /api/health | health check |
| GET /api/provinces | list supported provinces |
| POST /api/fetch-all | synchronize datasets |
| POST /api/exploration | exploratory analysis |
| POST /api/predict | prediction endpoint |

---

# 10. Frontend Architecture

The frontend is built using:

- React
- TypeScript
- Vite
- TailwindCSS
- Recharts

---

# 10.1 Frontend Features

## Forecast Mode

Users can:

- select province
- select algorithm
- select forecast horizon
- generate future predictions

---

## Evaluation Mode

Users can:

- choose historical dates
- compare prediction vs actual rain labels
- compute prediction correctness

---

## EDA Dashboard

The frontend visualizes:

- temperature distributions
- humidity distributions
- cloud cover distributions
- wind speed distributions
- pressure distributions
- rain distributions

for all provinces.

---

# 11. Automatic Dataset Synchronization

The backend automatically updates datasets.

Example:

If the newest local dataset date is:

```txt
2025-12-31
```

and today's date is:

```txt
2026-05-20
```

then the system fetches:

```txt
2026-01-01 → 2026-05-19
```

for all provinces.

The current day is excluded because weather observations may still be incomplete.

---

# 12. Forecast Workflow

```txt
Frontend Request
        ↓
FastAPI Backend
        ↓
Load Province Dataset
        ↓
Load Best Model
        ↓
Generate Features
        ↓
Predict Rain Probability
        ↓
Return Prediction Response
```

---

# 13. Evaluation Workflow

```txt
Historical Date Selected
        ↓
Generate Prediction
        ↓
Load Actual Weather Result
        ↓
Compare Prediction vs Actual
        ↓
Compute Correctness
```

---

# 14. Project Structure

```txt
backend/
├── fetch_data/
├── load_weather_data/
├── ml_pipeline/
├── models/
├── utils/
└── main.py

frontend/
├── src/
├── app/
├── components/
└── styles/
```

---

# 15. Technologies Used

## Backend

- Python
- FastAPI
- pandas
- scikit-learn
- XGBoost
- LightGBM
- joblib

---

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- Recharts

---

# 16. Current Limitations

Current limitations include:

- only 34 provinces supported
- daily weather data only
- no satellite imagery
- no hourly forecasting
- no deep learning models
- no GPU acceleration
- no cloud deployment

---

# 17. Future Improvements

Potential future improvements:

- LSTM forecasting
- Transformer forecasting
- ensemble learning
- anomaly detection
- automatic retraining pipeline
- Docker deployment
- CI/CD integration
- PostgreSQL storage
- cloud hosting
- real-time streaming weather updates

---

# 18. Conclusion

This project demonstrates a complete end-to-end weather forecasting platform for Vietnam.

The system integrates:

- weather data collection
- preprocessing
- feature engineering
- machine learning training
- model evaluation
- REST API services
- frontend visualization

into a unified forecasting dashboard.

