# Knowlance MVP (knowlance-mvp)

Chat-first analytics prototype with a responsive frontend and a FastAPI backend. Upload CSVs, preprocess with Pandas, query with DuckDB, and chat to generate insights. Includes a sample dataset and a simple demo flow.

## Features
- Landing page with CTA
- Dashboard with KPIs, charts (data JSON for Plotly), and table preview
- Upload flow with preview and preprocessing
- Chat page with NLQ mock that maps phrases to SQL
- FastAPI backend with endpoints: upload, preprocess, datasets, dashboard-metrics, chat, export, health
- Data layer: raw CSV, processed Parquet, metadata in SQLite
- Sample dataset: sales_sample.csv

## Local Run (Replit or local)

### Prereqs
- Python 3.10+
- Node 18+

### 1) Install & start services
- Backend: install deps and run FastAPI
```
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```
- Frontend: install and run dev server
```
cd frontend
npm install
npm run dev
```

Set frontend environment variable so it can reach the API (create `frontend/.env` or set in Replit):
```
VITE_BACKEND_URL=http://localhost:8000
```

### 2) Load sample data
Use the Upload page to load your CSV, or call the helper endpoint to register a built-in sample:
```
POST http://localhost:8000/load-sample
```

Then open the Dashboard and Chat pages.

## API Endpoints
- POST /upload-dataset
- POST /preprocess
- GET /datasets
- GET /dashboard-metrics?dataset_id=
- POST /chat
- GET /export?dataset_id=&snapshot_id=
- GET /health

## NLQ Mock
If `OPENAI_API_KEY` or `GEMINI_KEY` is present (env), you can extend the `/chat` endpoint to call an LLM. By default, we use deterministic phrase → SQL mapping:
- "monthly revenue" → monthly revenue by month
- "top products/categories" → top 5 by revenue
- "predict next month" → naive forecast based on last 30 days

## Data Storage
- Raw CSV: backend/data/raw
- Processed Parquet: backend/data/processed
- Metadata: backend/data/meta.db (SQLite)

## Export
`/export` returns a simple PDF (requires reportlab; already in requirements). If reportlab is not available, the endpoint returns 501.

## Dev Notes
- CORS enabled for local development
- Minimal error handling with JSON messages
- Accessible, mobile-first UI using Tailwind CSS

## Add API Keys
- Create `.env` in backend with:
```
OPENAI_API_KEY=...
GEMINI_KEY=...
```
- Create `.env` in frontend with:
```
VITE_BACKEND_URL=http://localhost:8000
```

## Demo script
1. Open Upload → Load sample dataset → Run preprocess.
2. Go to Dashboard to view KPIs and charts.
3. Open Chat and try prompts like "Show me monthly revenue" or "Top 5 products by revenue".

