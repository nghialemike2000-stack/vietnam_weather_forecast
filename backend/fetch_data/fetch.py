import time
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd
import requests

# ==========================================
# VIETNAM PROVINCES
# ==========================================

locations = [
    {"destination": "Ha_Noi", "latitude": 21.0285, "longitude": 105.8542},
    {"destination": "Hue", "latitude": 16.4637, "longitude": 107.5909},
    {"destination": "Lai_Chau", "latitude": 22.3964, "longitude": 103.4582},
    {"destination": "Dien_Bien", "latitude": 21.3860, "longitude": 103.0230},
    {"destination": "Son_La", "latitude": 21.3256, "longitude": 103.9188},
    {"destination": "Lang_Son", "latitude": 21.8537, "longitude": 106.7610},
    {"destination": "Quang_Ninh", "latitude": 21.0064, "longitude": 107.2925},
    {"destination": "Thanh_Hoa", "latitude": 19.8067, "longitude": 105.7852},
    {"destination": "Nghe_An", "latitude": 18.6796, "longitude": 105.6813},
    {"destination": "Ha_Tinh", "latitude": 18.3550, "longitude": 105.8877},
    {"destination": "Cao_Bang", "latitude": 22.6667, "longitude": 106.2500},
    {"destination": "Tuyen_Quang", "latitude": 21.8233, "longitude": 105.2181},
    {"destination": "Lao_Cai", "latitude": 22.4856, "longitude": 103.9707},
    {"destination": "Thai_Nguyen", "latitude": 21.5942, "longitude": 105.8482},
    {"destination": "Phu_Tho", "latitude": 21.3227, "longitude": 105.4010},
    {"destination": "Bac_Ninh", "latitude": 21.1861, "longitude": 106.0763},
    {"destination": "Hung_Yen", "latitude": 20.6464, "longitude": 106.0511},
    {"destination": "Hai_Phong", "latitude": 20.8449, "longitude": 106.6881},
    {"destination": "Ninh_Binh", "latitude": 20.2506, "longitude": 105.9745},
    {"destination": "Quang_Tri", "latitude": 16.7500, "longitude": 107.2000},
    {"destination": "Da_Nang", "latitude": 16.0544, "longitude": 108.2022},
    {"destination": "Quang_Ngai", "latitude": 15.1214, "longitude": 108.8044},
    {"destination": "Gia_Lai", "latitude": 13.9833, "longitude": 108.0000},
    {"destination": "Khanh_Hoa", "latitude": 12.2388, "longitude": 109.1967},
    {"destination": "Lam_Dong", "latitude": 11.9404, "longitude": 108.4583},
    {"destination": "Dak_Lak", "latitude": 12.7100, "longitude": 108.2378},
    {"destination": "Ho_Chi_Minh", "latitude": 10.8231, "longitude": 106.6297},
    {"destination": "Dong_Nai", "latitude": 10.9453, "longitude": 106.8240},
    {"destination": "Tay_Ninh", "latitude": 11.3352, "longitude": 106.1099},
    {"destination": "Can_Tho", "latitude": 10.0452, "longitude": 105.7469},
    {"destination": "Vinh_Long", "latitude": 10.2537, "longitude": 105.9722},
    {"destination": "Dong_Thap", "latitude": 10.4938, "longitude": 105.6881},
    {"destination": "Ca_Mau", "latitude": 9.1769, "longitude": 105.1524},
    {"destination": "An_Giang", "latitude": 10.5216, "longitude": 105.1259},
]

# ==========================================
# ROOT FOLDERS
# ==========================================

BACKEND_ROOT = Path(__file__).resolve().parents[1]
ROOT = BACKEND_ROOT / "load_weather_data"

ALL_ROOT = ROOT / "all"
TRAIN_ROOT = ROOT / "train"
TEST_ROOT = ROOT / "test"

ALL_ROOT.mkdir(parents=True, exist_ok=True)
TRAIN_ROOT.mkdir(parents=True, exist_ok=True)
TEST_ROOT.mkdir(parents=True, exist_ok=True)

# ==========================================
# DATE RANGE
# ==========================================

ALL_START = "2020-01-01"
TRAIN_START = "2020-01-01"
TRAIN_END = "2025-12-31"
TEST_START = "2026-01-01"
TEST_END = "2026-04-30"


def yesterday_string():
    return (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")


# ==========================================
# FETCH WEATHER FUNCTION
# ==========================================

def fetch_weather_data(location, start_date, end_date, max_retries=3, sleep_seconds=10):
    destination = location["destination"]
    latitude = location["latitude"]
    longitude = location["longitude"]

    if pd.to_datetime(start_date) > pd.to_datetime(end_date):
        return pd.DataFrame()

    print("=" * 60)
    print(f"Fetching: {destination}")
    print(f"Date: {start_date} -> {end_date}")

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

    for attempt in range(1, max_retries + 1):
        try:
            response = requests.get(url, timeout=30)

            if response.status_code != 200:
                print(f"FAILED: {destination}")
                print(f"STATUS CODE: {response.status_code}")
                if attempt < max_retries:
                    print(f"Sleep {sleep_seconds}s then retry...")
                    time.sleep(sleep_seconds)
                continue

            data = response.json()

            if "daily" not in data:
                print(f"NO DATA: {destination}")
                if attempt < max_retries:
                    print(f"Sleep {sleep_seconds}s then retry...")
                    time.sleep(sleep_seconds)
                continue

            daily = data["daily"]
            df = pd.DataFrame({
                "date": daily["time"],
                "destination": destination,
                "latitude": latitude,
                "longitude": longitude,
                "temp": daily["temperature_2m_mean"],
                "humidity": daily["relative_humidity_2m_mean"],
                "wind_speed": daily["wind_speed_10m_max"],
                "cloud_cover": daily["cloud_cover_mean"],
                "pressure": daily["surface_pressure_mean"],
                "precipitation_sum": daily["precipitation_sum"],
            })

            df["rain"] = df["precipitation_sum"].apply(lambda x: 1 if x > 0 else 0)
            df.drop(columns=["precipitation_sum"], inplace=True)
            df.dropna(inplace=True)

            print(f"Rows: {len(df)}")
            return df

        except Exception as exc:
            print(f"ERROR: {destination}")
            print(exc)
            if attempt < max_retries:
                print(f"Sleep {sleep_seconds}s then retry...")
                time.sleep(sleep_seconds)

    return None


# ==========================================
# SAVE DATASET
# ==========================================

def save_dataset(df, folder_root, destination, filename):
    province_folder = folder_root / destination
    province_folder.mkdir(parents=True, exist_ok=True)

    output_path = province_folder / filename
    df.to_csv(output_path, index=False, encoding="utf-8-sig")

    print(f"Saved: {output_path}")


def split_and_save_dataset(df_all, destination):
    df_all = df_all.copy()
    df_all["date"] = pd.to_datetime(df_all["date"]).dt.strftime("%Y-%m-%d")
    df_all = df_all.sort_values("date").reset_index(drop=True)

    save_dataset(df_all, ALL_ROOT, destination, "all_weather.csv")

    train_df = df_all[
        (df_all["date"] >= TRAIN_START) &
        (df_all["date"] <= TRAIN_END)
    ]
    save_dataset(train_df, TRAIN_ROOT, destination, "train_weather.csv")

    test_df = df_all[
        (df_all["date"] >= TEST_START) &
        (df_all["date"] <= TEST_END)
    ]
    save_dataset(test_df, TEST_ROOT, destination, "test_weather.csv")


def update_location_dataset(location, end_date=None, max_retries=3, sleep_seconds=10):
    destination = location["destination"]
    end_date = end_date or yesterday_string()
    all_path = ALL_ROOT / destination / "all_weather.csv"

    existing_df = None
    last_date_before = None

    if all_path.exists():
        existing_df = pd.read_csv(all_path)
        if not existing_df.empty:
            existing_df["date"] = pd.to_datetime(existing_df["date"]).dt.strftime("%Y-%m-%d")
            last_date_before = existing_df["date"].max()
            start_date = (
                pd.to_datetime(last_date_before) + pd.Timedelta(days=1)
            ).strftime("%Y-%m-%d")
        else:
            start_date = ALL_START
    else:
        start_date = ALL_START

    if pd.to_datetime(start_date) > pd.to_datetime(end_date):
        return {
            "province": destination,
            "status": "up_to_date",
            "start_date": start_date,
            "end_date": end_date,
            "last_date_before": last_date_before,
            "last_date_after": last_date_before,
            "added_rows": 0,
            "error": None,
        }

    new_df = fetch_weather_data(
        location,
        start_date,
        end_date,
        max_retries=max_retries,
        sleep_seconds=sleep_seconds,
    )

    if new_df is None:
        return {
            "province": destination,
            "status": "failed",
            "start_date": start_date,
            "end_date": end_date,
            "last_date_before": last_date_before,
            "last_date_after": last_date_before,
            "added_rows": 0,
            "error": "Unable to fetch data from Open-Meteo",
        }

    combined_df = new_df if existing_df is None else pd.concat(
        [existing_df, new_df],
        ignore_index=True,
    )

    combined_df = (
        combined_df
        .drop_duplicates(subset=["date"], keep="last")
        .sort_values("date")
        .reset_index(drop=True)
    )

    split_and_save_dataset(combined_df, destination)

    last_date_after = None if combined_df.empty else combined_df["date"].max()

    return {
        "province": destination,
        "status": "updated" if len(new_df) else "up_to_date",
        "start_date": start_date,
        "end_date": end_date,
        "last_date_before": last_date_before,
        "last_date_after": last_date_after,
        "added_rows": int(len(new_df)),
        "error": None,
    }


def update_all_datasets(max_retries=3, sleep_seconds=10):
    results = []

    for location in locations:
        results.append(
            update_location_dataset(
                location,
                max_retries=max_retries,
                sleep_seconds=sleep_seconds,
            )
        )
        time.sleep(1)

    return results


def rebuild_all_datasets(max_retries=3, sleep_seconds=10):
    results = []

    for location in locations:
        destination = location["destination"]

        print("\n")
        print("#" * 70)
        print(f"PROCESSING: {destination}")
        print("#" * 70)

        df_all = fetch_weather_data(
            location,
            ALL_START,
            yesterday_string(),
            max_retries=max_retries,
            sleep_seconds=sleep_seconds,
        )

        if df_all is None:
            results.append({
                "province": destination,
                "status": "failed",
                "added_rows": 0,
                "error": "Unable to fetch data from Open-Meteo",
            })
            continue

        split_and_save_dataset(df_all, destination)
        results.append({
            "province": destination,
            "status": "updated",
            "added_rows": int(len(df_all)),
            "error": None,
        })

        time.sleep(1)

    return results


# ==========================================
# MAIN
# ==========================================

if __name__ == "__main__":
    update_all_datasets()
    print("\nDONE")
