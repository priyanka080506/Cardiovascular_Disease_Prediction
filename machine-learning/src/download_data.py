"""Download the Cardiovascular Disease dataset if not present locally."""

from __future__ import annotations

import logging
import sys
from pathlib import Path

import pandas as pd

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
OUTPUT_PATH = DATA_DIR / "cardio_train.csv"

# Public mirror of the Kaggle sulianova/cardiovascular-disease-dataset
DATASET_URL = (
    "https://raw.githubusercontent.com/caravanuden/cardio/master/cardio_train.csv"
)


def download_dataset(force: bool = False) -> Path:
    """Fetch cardio_train.csv into machine-learning/data/."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    if OUTPUT_PATH.exists() and not force:
        logger.info("Dataset already exists at %s", OUTPUT_PATH)
        return OUTPUT_PATH

    logger.info("Downloading dataset from %s", DATASET_URL)
    try:
        df = pd.read_csv(DATASET_URL, sep=";")
    except Exception as exc:
        logger.error(
            "Automatic download failed: %s\n"
            "Place cardio_train.csv manually in: %s",
            exc,
            DATA_DIR,
        )
        sys.exit(1)

    df.to_csv(OUTPUT_PATH, index=False)
    logger.info("Saved %d rows to %s", len(df), OUTPUT_PATH)
    return OUTPUT_PATH


if __name__ == "__main__":
    download_dataset(force="--force" in sys.argv)
