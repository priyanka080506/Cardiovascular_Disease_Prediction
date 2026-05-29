"""Application configuration and artifact paths."""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
ML_MODELS_DIR = BASE_DIR / "machine-learning" / "models"

MODEL_PATH = ML_MODELS_DIR / "champion_model.joblib"
SCALER_PATH = ML_MODELS_DIR / "scaler.joblib"
SHAP_PATH = ML_MODELS_DIR / "shap_explainer.joblib"
METADATA_PATH = ML_MODELS_DIR / "metadata.json"

API_PREFIX = "/api"
