"""Rule-based prescriptive engine driven by SHAP risk drivers."""

from __future__ import annotations

from app.models.schemas import RecommendationBlock, ShapContribution

FEATURE_LABELS = {
    "age_years": "Age",
    "height": "Height",
    "weight": "Weight",
    "bmi": "BMI",
    "gender": "Gender",
    "ap_hi": "Systolic BP",
    "ap_lo": "Diastolic BP",
    "cholesterol": "Cholesterol",
    "gluc": "Blood Glucose",
    "smoke": "Smoking",
    "alco": "Alcohol",
    "active": "Physical Activity",
}

BP_FEATURES = {"ap_hi", "ap_lo"}
METABOLIC_FEATURES = {"cholesterol", "gluc", "bmi", "weight"}

DASH_NUTRITION = [
    "Limit sodium to under 1,500 mg/day (ideally 1,000 mg for high BP).",
    "Increase potassium-rich foods: leafy greens, bananas, sweet potatoes.",
    "Emphasize whole grains, lean poultry, fish, and low-fat dairy.",
    "Reduce processed meats, canned soups, and packaged snacks.",
    "Follow the DASH plate: 50% vegetables/fruits, 25% whole grains, 25% lean protein.",
]

DASH_FITNESS = [
    "150 minutes/week moderate aerobic activity (brisk walking, cycling).",
    "Add 2 days/week of resistance training at moderate intensity.",
    "Include daily 10-minute walks after meals to improve vascular tone.",
    "Practice paced breathing and stress reduction — both lower BP.",
    "Monitor BP before/after exercise; avoid heavy lifting if uncontrolled.",
]

MEDITERRANEAN_NUTRITION = [
    "Base meals on vegetables, legumes, whole grains, nuts, and olive oil.",
    "Choose fatty fish (salmon, mackerel) 2–3 times per week for omega-3 fats.",
    "Replace butter with extra-virgin olive oil; limit red meat to occasional.",
    "Increase soluble fiber: oats, beans, apples — helps cholesterol & glucose.",
    "Minimize refined sugars and sugary beverages.",
]

MEDITERRANEAN_FITNESS = [
    "Combine aerobic exercise with flexibility work (yoga, swimming).",
    "Target 30+ minutes daily of moderate activity to improve insulin sensitivity.",
    "Short post-meal walks (15 min) to blunt glucose spikes.",
    "Progressive resistance training 2x/week for metabolic health.",
]

GENERAL_NUTRITION = [
    "Maintain a calorie balance appropriate for healthy BMI.",
    "Prioritize minimally processed whole foods.",
    "Stay hydrated; limit alcohol if consumed.",
]

GENERAL_FITNESS = [
    "Build toward 150 min/week of moderate activity.",
    "Reduce sedentary time with hourly movement breaks.",
    "If smoking, cessation is the single highest-impact lifestyle change.",
]


def classify_direction(shap_value: float, threshold: float = 0.001) -> str:
    if shap_value > threshold:
        return "risk"
    if shap_value < -threshold:
        return "protective"
    return "neutral"


def top_positive_drivers(contributions: list[ShapContribution], n: int = 2) -> list[str]:
    risks = [c for c in contributions if c.direction == "risk"]
    risks.sort(key=lambda c: c.shap_value, reverse=True)
    return [c.feature for c in risks[:n]]


def build_recommendations(
    contributions: list[ShapContribution],
) -> RecommendationBlock:
    """Map top SHAP drivers to DASH, Mediterranean, or blended protocols."""
    drivers = top_positive_drivers(contributions, n=2)
    driver_labels = [FEATURE_LABELS.get(d, d) for d in drivers]

    bp_dominant = any(d in BP_FEATURES for d in drivers)
    metabolic_dominant = any(d in METABOLIC_FEATURES for d in drivers)

    if bp_dominant and not metabolic_dominant:
        protocol = "DASH"
        title = "DASH Protocol — Blood Pressure Focus"
        summary = (
            "Your elevated cardiovascular risk is primarily driven by blood pressure "
            "factors. A DASH-style nutrition and activity plan is recommended."
        )
        nutrition = DASH_NUTRITION
        fitness = DASH_FITNESS
    elif metabolic_dominant and not bp_dominant:
        protocol = "Mediterranean"
        title = "Mediterranean Protocol — Metabolic Focus"
        summary = (
            "Metabolic markers (cholesterol, glucose, or body composition) are the "
            "leading contributors. A Mediterranean dietary pattern is recommended."
        )
        nutrition = MEDITERRANEAN_NUTRITION
        fitness = MEDITERRANEAN_FITNESS
    elif bp_dominant and metabolic_dominant:
        protocol = "DASH + Mediterranean"
        title = "Combined DASH & Mediterranean Protocol"
        summary = (
            "Both blood pressure and metabolic factors drive your risk. "
            "Blend low-sodium DASH principles with Mediterranean healthy fats and fiber."
        )
        nutrition = list(dict.fromkeys(DASH_NUTRITION[:3] + MEDITERRANEAN_NUTRITION[:3]))
        fitness = list(dict.fromkeys(DASH_FITNESS[:2] + MEDITERRANEAN_FITNESS[:2]))
    else:
        protocol = "General Lifestyle"
        title = "General Cardiovascular Prevention Plan"
        summary = (
            "Lifestyle optimization across activity, weight, and habits "
            "will yield the greatest risk reduction for your profile."
        )
        nutrition = GENERAL_NUTRITION
        fitness = GENERAL_FITNESS

    return RecommendationBlock(
        protocol=protocol,
        title=title,
        summary=summary,
        nutrition=nutrition,
        fitness=fitness,
        primary_drivers=driver_labels,
    )
