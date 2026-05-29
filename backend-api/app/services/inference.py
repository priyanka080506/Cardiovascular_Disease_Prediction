"""ML inference, SHAP computation, and artifact loading."""

from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from app.core.config import (
    METADATA_PATH,
    MODEL_PATH,
    SCALER_PATH,
    SHAP_PATH,
)
from app.models.schemas import (
    HealthInput,
    PredictResponse,
    ShapContribution,
)
from app.services.prescriptive import (
    FEATURE_LABELS,
    build_recommendations,
    classify_direction,
)

logger = logging.getLogger(__name__)

CONTINUOUS = ["age_years", "height", "weight", "bmi", "ap_hi", "ap_lo"]
FEATURE_ORDER = [
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


class ArtifactStore:
    """Lazy-loaded ML artifacts shared across requests."""

    def __init__(self) -> None:
        self._model = None
        self._scaler = None
        self._shap = None
        self._metadata: dict[str, Any] = {}

    def load(self) -> None:
        if self._model is not None:
            return
        for path in (MODEL_PATH, SCALER_PATH, SHAP_PATH):
            if not path.exists():
                raise FileNotFoundError(
                    f"Missing artifact: {path}. "
                    "Run `python machine-learning/src/train.py` first."
                )
        self._model = joblib.load(MODEL_PATH)
        self._scaler = joblib.load(SCALER_PATH)
        self._shap = joblib.load(SHAP_PATH)
        if METADATA_PATH.exists():
            self._metadata = json.loads(METADATA_PATH.read_text())
        logger.info(
            "Loaded model '%s' (CV acc %.4f)",
            self._metadata.get("champion", "unknown"),
            self._metadata.get("cv_accuracy", 0),
        )

    @property
    def model(self):
        self.load()
        return self._model

    @property
    def scaler(self):
        self.load()
        return self._scaler

    @property
    def shap_artifact(self):
        self.load()
        return self._shap

    @property
    def metadata(self) -> dict:
        self.load()
        return self._metadata


store = ArtifactStore()


def compute_bmi(height_cm: float, weight_kg: float) -> float:
    height_m = height_cm / 100.0
    return round(weight_kg / (height_m**2), 2)


def input_to_dataframe(data: HealthInput) -> pd.DataFrame:
    bmi = compute_bmi(data.height, data.weight)
    row = {
        "age_years": data.age_years,
        "height": data.height,
        "weight": data.weight,
        "bmi": bmi,
        "gender": data.gender,
        "ap_hi": data.ap_hi,
        "ap_lo": data.ap_lo,
        "cholesterol": data.cholesterol,
        "gluc": data.gluc,
        "smoke": data.smoke,
        "alco": data.alco,
        "active": data.active,
    }
    return pd.DataFrame([row])[FEATURE_ORDER]


def scale_features(df: pd.DataFrame) -> np.ndarray:
    frame = df.copy()
    frame[CONTINUOUS] = store.scaler.transform(frame[CONTINUOUS])
    return frame.values.astype(np.float32)


def risk_label(probability: float) -> str:
    if probability < 0.35:
        return "low"
    if probability < 0.55:
        return "moderate"
    return "high"


def compute_shap(vector: np.ndarray) -> list[ShapContribution]:
    explainer = store.shap_artifact["explainer"]
    shap_values = explainer.shap_values(vector)

    # Binary classifiers may return list [class0, class1]
    if isinstance(shap_values, list):
        shap_row = shap_values[1][0]
    elif len(shap_values.shape) == 3:
        shap_row = shap_values[0, :, 1]
    else:
        shap_row = shap_values[0]

    raw_values = df_row_values(vector)
    contributions: list[ShapContribution] = []
    for feat, shap_val, raw in zip(FEATURE_ORDER, shap_row, raw_values):
        contributions.append(
            ShapContribution(
                feature=feat,
                label=FEATURE_LABELS.get(feat, feat),
                value=float(raw),
                shap_value=round(float(shap_val), 5),
                direction=classify_direction(float(shap_val)),
            )
        )
    contributions.sort(key=lambda c: abs(c.shap_value), reverse=True)
    return contributions


def df_row_values(scaled_vector: np.ndarray) -> list[float]:
    """Inverse-transform continuous features for display."""
    row = scaled_vector[0].copy()
    # Approximate display: inverse scale continuous columns
    cont_idx = [FEATURE_ORDER.index(c) for c in CONTINUOUS]
    cont_scaled = row[cont_idx].reshape(1, -1)
    cont_original = store.scaler.inverse_transform(cont_scaled)[0]
    out = list(row)
    for i, col in enumerate(CONTINUOUS):
        out[FEATURE_ORDER.index(col)] = cont_original[i]
    return out


def run_prediction(data: HealthInput) -> PredictResponse:
    store.load()
    df = input_to_dataframe(data)
    bmi = float(df["bmi"].iloc[0])
    vector = scale_features(df)

    proba = float(store.model.predict_proba(vector)[0][1])
    contributions = compute_shap(vector)
    top_drivers = [
        c.label for c in contributions if c.direction == "risk"
    ][:3]
    recommendations = build_recommendations(contributions)

    return PredictResponse(
        risk_probability=round(proba, 4),
        risk_percent=round(proba * 100, 1),
        risk_label=risk_label(proba),
        model_name=store.metadata.get("champion", "champion_model"),
        bmi=bmi,
        shap_contributions=contributions,
        top_risk_drivers=top_drivers,
        recommendations=recommendations,
    )


def apply_modifications(
    baseline: HealthInput, modifications: dict[str, float | int]
) -> HealthInput:
    payload = baseline.model_dump()
    allowed = {
        "weight",
        "height",
        "ap_hi",
        "ap_lo",
        "cholesterol",
        "gluc",
        "smoke",
        "alco",
        "active",
    }
    for key, value in modifications.items():
        if key not in allowed:
            continue
        payload[key] = value
    return HealthInput(**payload)
