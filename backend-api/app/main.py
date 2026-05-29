"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import API_PREFIX
from app.services.inference import store

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Preload ML artifacts so the first /predict request is fast."""
    try:
        store.load()
        logger.info("ML artifacts preloaded successfully.")
    except FileNotFoundError as exc:
        logger.warning("Artifacts not loaded at startup: %s", exc)
    yield


app = FastAPI(
    title="CVD Prescriptive Decision Support API",
    description=(
        "Explainable cardiovascular risk scoring with SHAP drivers "
        "and rule-based DASH/Mediterranean recommendations."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix=API_PREFIX)


@app.get("/")
def root() -> dict:
    return {
        "message": "CVD Prescriptive API",
        "docs": "/docs",
        "predict": f"{API_PREFIX}/predict",
        "simulate": f"{API_PREFIX}/simulate",
    }
