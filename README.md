# Cardiovascular Risk — Explainable & Prescriptive Health Portal

A monorepo **Prescriptive Decision Support System** for cardiovascular disease (CVD) prevention. It predicts risk, explains *why* using **SHAP**, maps drivers to **DASH / Mediterranean** protocols, and supports **what-if** lifestyle simulations.

## Architecture

```text
├── machine-learning/   # Training, preprocessing, SHAP artifacts
├── backend-api/        # FastAPI inference + prescriptive engine
└── frontend-ui/        # React + Tailwind + Recharts dashboard
```

## Quick Start

### 1. Train the ML model

**macOS:** XGBoost requires OpenMP — run `brew install libomp` once if import fails.

```bash
cd machine-learning
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cd src
python download_data.py   # fetches cardio_train.csv
python train.py           # 10-fold CV, exports models/
```

> **Note on accuracy:** With honest 10-fold stratified CV on the public Kaggle cardio dataset, published benchmarks cluster around **~73%** accuracy. The pipeline logs a warning if CV is below 85%; retrain with your own tuning if you need higher scores.

### 2. Start the API

```bash
cd backend-api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

OpenAPI docs: http://127.0.0.1:8000/docs

### 3. Start the frontend

```bash
cd frontend-ui
npm install
npm run dev
```

Portal: http://127.0.0.1:5173 (proxies `/api` → backend)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/predict` | Risk score + SHAP breakdown + recommendations |
| `POST` | `/api/simulate` | What-if comparison (baseline vs modified) |
| `GET` | `/api/health` | Service health check |

## Disclaimer

This system is for **educational and research purposes only**. It is not a medical device and does not replace professional clinical judgment.
