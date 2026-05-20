from typing import Tuple

import pandas as pd


# ==========================================
# FEATURE CONFIG
# ==========================================

FEATURE_COLUMNS = [
    "temp",
    "humidity",
    "wind_speed",
    "cloud_cover",
    "pressure"
]

TARGET_COLUMN = "rain"

TRAIN_END_DATE = "2025-12-31"
TEST_START_DATE = "2026-01-01"
FORECAST_HORIZONS = [7]


# ==========================================
# CREATE TARGET
# ==========================================

def create_target(
    df: pd.DataFrame,
    forecast_horizon: int
) -> pd.DataFrame:
    """
    Predict next-day rain.

    Example:
    data of 2025-12-31
    -> predict rain of 2026-01-01
    """

    df = df.copy()

    # next-day rain
    df["target"] = (
    df[TARGET_COLUMN]
    .shift(-forecast_horizon)
)

    return df


# ==========================================
# CREATE LAG FEATURES
# ==========================================

def create_lag_features(
    df: pd.DataFrame,
    lookback: int
) -> pd.DataFrame:
    """
    Create lag features for time series.
    """

    df = df.copy()

    lag_feature_dict = {}

    for feature in FEATURE_COLUMNS:

        for lag in range(1, lookback + 1):

            lag_column_name = (
                f"{feature}_lag_{lag}"
            )

            lag_feature_dict[
                lag_column_name
            ] = df[feature].shift(lag)

    lag_df = pd.DataFrame(
        lag_feature_dict
    )

    df = pd.concat(
        [df, lag_df],
        axis=1
    )

    return df

# ==========================================
# REMOVE INVALID ROWS
# ==========================================

def clean_dataframe(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Remove rows containing NaN
    caused by lag creation and target shifting.
    """

    df = df.copy()

    df = df.dropna()

    df = df.reset_index(drop=True)

    return df


# ==========================================
# PREPARE FULL DATASET
# ==========================================

def prepare_dataset(
    df: pd.DataFrame,
    lookback: int,
    forecast_horizon: int
) -> pd.DataFrame:
    """
    Full feature engineering pipeline.

    Steps:
    1. create target
    2. create lag features
    3. remove invalid rows
    """

    df = df.copy()

    # chronological order
    df = df.sort_values("date")

    # create target
    df = create_target(
    df=df,
    forecast_horizon=forecast_horizon
)

    # create lag features
    df = create_lag_features(
        df=df,
        lookback=lookback
    )

    # remove NaN
    df = clean_dataframe(df)

    return df


# ==========================================
# GET FEATURE COLUMNS
# ==========================================

def get_feature_columns(
    lookback: int
) -> list:
    """
    Return all generated lag columns.
    """

    feature_list = []

    for feature in FEATURE_COLUMNS:

        for lag in range(1, lookback + 1):

            feature_list.append(
                f"{feature}_lag_{lag}"
            )

    return feature_list


# ==========================================
# TRAIN TEST SPLIT
# ==========================================

def split_train_test(
    df: pd.DataFrame,
    lookback: int
) -> Tuple:

    df = df.copy()

    feature_columns = get_feature_columns(
        lookback
    )

    # ======================================
    # TRAIN
    # ======================================

    train_df = df[
        df["date"] <= TRAIN_END_DATE
    ]

    # ======================================
    # TEST
    # ======================================

    test_df = df[
        df["date"] >= TEST_START_DATE
    ]

    # ======================================
    # X AND y
    # ======================================

    X_train = train_df[feature_columns]

    y_train = train_df["target"]

    X_test = test_df[feature_columns]

    y_test = test_df["target"]

    return (
        X_train,
        X_test,
        y_train,
        y_test,
        train_df,
        test_df
    )


# ==========================================
# COMPLETE PIPELINE
# ==========================================

def prepare_train_test_data(
    df: pd.DataFrame,
    lookback: int,
    forecast_horizon: int
):
    """
    Complete pipeline:

    raw dataframe
    ->
    target
    ->
    lag features
    ->
    clean
    ->
    split train/test
    """

    processed_df = prepare_dataset(
        df=df,
        lookback=lookback,
        forecast_horizon=forecast_horizon
    )

    return split_train_test(
        df=processed_df,
        lookback=lookback
    )