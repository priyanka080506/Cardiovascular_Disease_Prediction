"""REST API route handlers."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    HealthInput,
    PredictResponse,
    SimulateRequest,
    SimulateResponse,
)
from app.services.inference import apply_modifications, run_prediction

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health")
def health_check() -> dict:
    return {"status": "ok", "service": "cvd-prescriptive-api"}


@router.post("/predict", response_model=PredictResponse)
def predict(payload: HealthInput) -> PredictResponse:
    """Run ML inference + SHAP explainability + prescriptive recommendations."""
    try:
        return run_prediction(payload)
    except FileNotFoundError as exc:
        logger.error(str(exc))
        raise HTTPException(
            status_code=503,
            detail="ML artifacts not found. Train the model first.",
        ) from exc
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/simulate", response_model=SimulateResponse)
def simulate(request: SimulateRequest) -> SimulateResponse:
    """
    What-if simulation: modify lifestyle fields while keeping age locked.
    Returns baseline vs modified risk comparison.
    """
    if "age_years" in request.modifications:
        raise HTTPException(
            status_code=400,
            detail="age_years is locked during simulation.",
        )
    try:
        baseline_result = run_prediction(request.baseline)
        modified_input = apply_modifications(
            request.baseline, request.modifications
        )
        modified_result = run_prediction(modified_input)

        reduction_abs = (
            baseline_result.risk_probability - modified_result.risk_probability
        )
        reduction_pct = round(reduction_abs * 100, 1)

        improved: list[str] = []
        mod = request.modifications
        if mod.get("smoke") == 0:
            improved.append("Smoking cessation")
        if mod.get("active") == 1:
            improved.append("Increased physical activity")
        if "weight" in mod and mod["weight"] < request.baseline.weight:
            improved.append("Weight reduction")
        if "cholesterol" in mod and mod["cholesterol"] < request.baseline.cholesterol:
            improved.append("Improved cholesterol control")
        if "gluc" in mod and mod["gluc"] < request.baseline.gluc:
            improved.append("Improved glucose control")
        if "ap_hi" in mod or "ap_lo" in mod:
            improved.append("Blood pressure optimization")

        return SimulateResponse(
            baseline=baseline_result,
            modified=modified_result,
            risk_reduction_percent=reduction_pct,
            risk_reduction_absolute=round(reduction_abs, 4),
            improved_features=improved or ["Lifestyle modifications applied"],
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Simulation failed")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
