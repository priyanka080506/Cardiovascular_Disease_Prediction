"""Pydantic v2 request/response schemas."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator


class HealthInput(BaseModel):
    age_years: int = Field(..., ge=18, le=120, description="Age in years")
    height: float = Field(..., ge=100, le=250, description="Height in cm")
    weight: float = Field(..., ge=30, le=300, description="Weight in kg")
    gender: Literal[1, 2] = Field(..., description="1 = female, 2 = male")
    ap_hi: int = Field(..., ge=60, le=250, description="Systolic BP mmHg")
    ap_lo: int = Field(..., ge=40, le=180, description="Diastolic BP mmHg")
    cholesterol: Literal[1, 2, 3] = Field(
        ..., description="1 = normal, 2 = above normal, 3 = well above"
    )
    gluc: Literal[1, 2, 3] = Field(
        ..., description="1 = normal, 2 = above normal, 3 = well above"
    )
    smoke: Literal[0, 1] = 0
    alco: Literal[0, 1] = 0
    active: Literal[0, 1] = 1

    @field_validator("ap_lo")
    @classmethod
    def diastolic_not_exceed_systolic(cls, ap_lo: int, info) -> int:
        ap_hi = info.data.get("ap_hi")
        if ap_hi is not None and ap_lo > ap_hi:
            raise ValueError("Diastolic pressure cannot exceed systolic pressure.")
        return ap_lo


class ShapContribution(BaseModel):
    feature: str
    label: str
    value: float
    shap_value: float
    direction: Literal["risk", "protective", "neutral"]


class RecommendationBlock(BaseModel):
    protocol: str
    title: str
    summary: str
    nutrition: list[str]
    fitness: list[str]
    primary_drivers: list[str]


class PredictResponse(BaseModel):
    risk_probability: float
    risk_percent: float
    risk_label: Literal["low", "moderate", "high"]
    model_name: str
    bmi: float
    shap_contributions: list[ShapContribution]
    top_risk_drivers: list[str]
    recommendations: RecommendationBlock


class SimulateRequest(BaseModel):
    baseline: HealthInput
    modifications: dict[str, float | int] = Field(
        default_factory=dict,
        description="Fields to override (weight, active, smoke, alco, etc.)",
    )


class SimulateResponse(BaseModel):
    baseline: PredictResponse
    modified: PredictResponse
    risk_reduction_percent: float
    risk_reduction_absolute: float
    improved_features: list[str]
