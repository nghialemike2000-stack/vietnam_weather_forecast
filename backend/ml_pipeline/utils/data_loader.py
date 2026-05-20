from pathlib import Path
import pandas as pd


# ==========================================
# PROJECT ROOT
# ==========================================

PROJECT_ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

# ==========================================
# DATA ROOT
# ==========================================

DATA_ROOT = (
    PROJECT_ROOT /
    "load_weather_data" /
    "all"
)

DATA_PROVINCES = [
'An_Giang',
'Bac_Ninh',
'Can_Tho',
'Cao_Bang',
'Ca_Mau',
'Dak_Lak',
'Da_Nang',
'Dien_Bien',
'Dong_Nai',
'Dong_Thap',
'Gia_Lai',
'Hai_Phong',
'Ha_Noi',
'Ha_Tinh',
'Ho_Chi_Minh',
'Hue',
'Hung_Yen',
'Khanh_Hoa',
'Lai_Chau',
'Lam_Dong',
'Lang_Son',
'Lao_Cai',
'Nghe_An',
'Ninh_Binh',
'Phu_Tho',
'Quang_Ngai',
'Quang_Ninh',
'Quang_Tri',
'Son_La',
'Tay_Ninh',
'Thai_Nguyen',
'Thanh_Hoa',
'Tuyen_Quang',
'Vinh_Long'
]

def load_province_data(province_name):

    csv_path = (
        DATA_ROOT /
        province_name /
        "all_weather.csv"
    )

    df = pd.read_csv(csv_path)

    # parse datetime
    df["date"] = pd.to_datetime(df["date"])

    # sort by time
    df = df.sort_values("date")

    # remove duplicates
    df = df.drop_duplicates()

    # reset index
    df = df.reset_index(drop=True)

    return df