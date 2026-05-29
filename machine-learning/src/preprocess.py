"""Data cleaning, feature engineering, and scaling utilities."""

from __future__ import annotations

from pathlib import Path
from typing import Tuple

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

# Columns used for model training (order is fixed for inference)
FEATURE_COLUMNS = [
    "age_years",
    "height",
    "weight",
    "bmi",
    "gender",
    "ap_hi",
    "ap_lo",
    "cholesterol",
    "gluc",
    "smoke",
    "alco",
    "active",
]

CONTINUOUS_COLUMNS = ["age_years", "height", "weight", "bmi", "ap_hi", "ap_lo"]


def load_raw_data(path: Path) -> pd.DataFrame:
    """Load cardio_train.csv (semicolon or comma separated)."""
    sep = ";" if path.suffix == ".csv" else ","
    try:
        df = pd.read_csv(path, sep=sep)
    except Exception:
        df = pd.read_csv(path)
    if "id" in df.columns:
        df = df.drop(columns=["id"])
    return df


def clean_blood_pressure(df: pd.DataFrame) -> pd.DataFrame:
    """Remove physiologically impossible blood pressure readings."""
    mask = (
        (df["ap_hi"] <= 250)
        & (df["ap_hi"] >= 60)
        & (df["ap_lo"] <= 180)
        & (df["ap_lo"] >= 40)
        & (df["ap_lo"] <= df["ap_hi"])
    )
    before = len(df)
    cleaned = df.loc[mask].copy()
    removed = before - len(cleaned)
    if removed:
        print(f"[preprocess] Removed {removed} rows with invalid blood pressure.")
    return cleaned


def clean_physical_outliers(df: pd.DataFrame) -> pd.DataFrame:
    """Remove height/weight values outside plausible human ranges."""
    mask = (
        (df["height"] >= 100)
        & (df["height"] <= 220)
        & (df["weight"] >= 30)
        & (df["weight"] <= 200)
    )
    before = len(df)
    cleaned = df.loc[mask].copy()
    removed = before - len(cleaned)
    if removed:
        print(f"[preprocess] Removed {removed} rows with invalid height/weight.")
    return cleaned


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Convert age to years and derive BMI."""
    out = df.copy()
    if "age_years" not in out.columns:
        # Dataset stores age in days
        out["age_years"] = (out["age"] / 365.25).astype(int)
    height_m = out["height"] / 100.0
    out["bmi"] = out["weight"] / (height_m**2)
    return out


def prepare_dataset(path: Path) -> Tuple[pd.DataFrame, pd.Series]:
    """Full pipeline: load, clean, engineer, return X and y."""
    df = load_raw_data(path)
    df = clean_blood_pressure(df)
    df = clean_physical_outliers(df)
    df = engineer_features(df)

    y = df["cardio"].astype(int)
    X = df[FEATURE_COLUMNS].copy()
    return X, y


def fit_scaler(X: pd.DataFrame) -> StandardScaler:
    scaler = StandardScaler()
    scaler.fit(X[CONTINUOUS_COLUMNS])
    return scaler


def transform_features(X: pd.DataFrame, scaler: StandardScaler) -> np.ndarray:
    """Apply StandardScaler to continuous columns; return numpy array."""
    frame = X[FEATURE_COLUMNS].copy()
    frame[CONTINUOUS_COLUMNS] = scaler.transform(frame[CONTINUOUS_COLUMNS])
    return frame.values.astype(np.float32)
