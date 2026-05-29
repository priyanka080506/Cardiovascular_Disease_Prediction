"""
Train XGBoost and Random Forest classifiers with 10-fold CV.
Export champion model, scaler, and SHAP TreeExplainer artifacts.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

import joblib
import numpy as np
import shap
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score
from xgboost import XGBClassifier

from download_data import download_dataset
from preprocess import (
    CONTINUOUS_COLUMNS,
    FEATURE_COLUMNS,
    fit_scaler,
    prepare_dataset,
    transform_features,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "cardio_train.csv"
MODELS_DIR = ROOT / "models"
ACCURACY_THRESHOLD = 0.85
N_SPLITS = 10
RANDOM_STATE = 42


def evaluate_model(name: str, model, X: np.ndarray, y: np.ndarray) -> float:
    cv = StratifiedKFold(n_splits=N_SPLITS, shuffle=True, random_state=RANDOM_STATE)
    scores = cross_val_score(model, X, y, cv=cv, scoring="accuracy", n_jobs=-1)
    mean_acc = float(scores.mean())
    std_acc = float(scores.std())
    logger.info(
        "%s — 10-fold CV accuracy: %.4f (+/- %.4f)",
        name,
        mean_acc,
        std_acc,
    )
    return mean_acc


def build_models(y: np.ndarray) -> dict:
    pos = float(y.sum())
    neg = float(len(y) - y.sum())
    scale_weight = neg / max(pos, 1.0)
    return {
        "xgboost": XGBClassifier(
            n_estimators=600,
            max_depth=7,
            learning_rate=0.04,
            subsample=0.9,
            colsample_bytree=0.8,
            min_child_weight=3,
            gamma=0.1,
            reg_alpha=0.1,
            reg_lambda=1.0,
            scale_pos_weight=scale_weight,
            eval_metric="logloss",
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),
        "random_forest": RandomForestClassifier(
            n_estimators=600,
            max_depth=18,
            min_samples_leaf=2,
            max_features="sqrt",
            class_weight="balanced_subsample",
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),
    }


def save_shap_explainer(model, X_sample: np.ndarray, out_path: Path) -> None:
    """Persist TreeExplainer and a reference background matrix for local SHAP."""
    explainer = shap.TreeExplainer(model)
    # Background for expected value baseline (subset for speed)
    background = shap.sample(X_sample, min(200, len(X_sample)), random_state=RANDOM_STATE)
    artifact = {
        "explainer": explainer,
        "background": background,
        "expected_value": explainer.expected_value,
    }
    joblib.dump(artifact, out_path)
    logger.info("SHAP explainer saved to %s", out_path)


def main() -> None:
    if not DATA_PATH.exists():
        logger.info("Dataset missing — attempting download.")
        download_dataset()

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Place cardio_train.csv in {DATA_PATH.parent} before training."
        )

    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    logger.info("Loading and preprocessing data from %s", DATA_PATH)
    X_df, y = prepare_dataset(DATA_PATH)
    scaler = fit_scaler(X_df)
    X = transform_features(X_df, scaler)
    y_arr = y.values

    results: dict[str, float] = {}
    fitted: dict = {}

    for name, estimator in build_models(y_arr).items():
        acc = evaluate_model(name, estimator, X, y_arr)
        results[name] = acc
        estimator.fit(X, y_arr)
        fitted[name] = estimator

    champion_name = max(results, key=results.get)
    champion_acc = results[champion_name]
    champion_model = fitted[champion_name]

    logger.info("Champion model: %s (CV accuracy %.4f)", champion_name, champion_acc)

    if champion_acc < ACCURACY_THRESHOLD:
        logger.warning(
            "CV accuracy %.4f is below target %.2f. "
            "Model will still be exported; consider hyperparameter tuning.",
            champion_acc,
            ACCURACY_THRESHOLD,
        )

    model_path = MODELS_DIR / "champion_model.joblib"
    scaler_path = MODELS_DIR / "scaler.joblib"
    shap_path = MODELS_DIR / "shap_explainer.joblib"
    meta_path = MODELS_DIR / "metadata.json"

    joblib.dump(champion_model, model_path)
    joblib.dump(scaler, scaler_path)
    save_shap_explainer(champion_model, X, shap_path)

    metadata = {
        "champion": champion_name,
        "cv_accuracy": champion_acc,
        "feature_columns": FEATURE_COLUMNS,
        "continuous_columns": CONTINUOUS_COLUMNS,
        "accuracy_threshold": ACCURACY_THRESHOLD,
        "cv_folds": N_SPLITS,
        "all_cv_scores": results,
    }
    meta_path.write_text(json.dumps(metadata, indent=2))
    logger.info("Training complete. Artifacts in %s", MODELS_DIR)


if __name__ == "__main__":
    main()
