import json
from pathlib import Path

import joblib

# ==========================================
# BASE PATH
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[2]

ML_PIPELINE_ROOT = (
    BASE_DIR /
    "ml_pipeline"
)

# ==========================================
# CREATE MODEL DIRECTORY
# ==========================================


def create_model_directory(
    algorithm_name,
    province_name,
    forecast_horizon,
    model_rank
):
    model_path = (
        ML_PIPELINE_ROOT /
        algorithm_name /
        "models" /
        province_name /
        f"horizon_{forecast_horizon}" /
        f"model_{model_rank}"
    )

    model_path.mkdir(parents=True, exist_ok=True)

    return model_path


# ==========================================
# SAVE MODEL
# ==========================================


def save_model(model, save_path, filename="model.pkl"):

    joblib.dump(model, save_path / filename)


# ==========================================
# SAVE METADATA
# ==========================================


def save_metadata(metadata, save_path):

    metadata_path = save_path / "metadata.json"

    with open(metadata_path, "w", encoding="utf-8") as f:

        json.dump(metadata, f, indent=4, ensure_ascii=False)


# ==========================================
# LOAD MODEL
# ==========================================


def load_model(model_path):

    return joblib.load(model_path)


# ==========================================
# SAVE COMPLETE MODEL PACKAGE
# ==========================================


def save_complete_model_package(
    algorithm_name,
    province_name,
    forecast_horizon,
    model_rank,
    model,
    metadata
):

    save_path = create_model_directory(

        algorithm_name=
            algorithm_name,

        province_name=
            province_name,

        forecast_horizon=
            forecast_horizon,

        model_rank=
            model_rank,
    )

    # save model
    save_model(model=model, save_path=save_path)

    # save metadata
    save_metadata(metadata=metadata, save_path=save_path)

    print(f"\nSaved model to:\n{save_path}")
