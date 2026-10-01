# CampusCalm - Deployment & Setup Guide

## Local Quickstart (Development Mode)

### Prerequisites
- Node.js >= 18 (Tested on v24)
- Python >= 3.10 (Tested on v3.14)
- npm >= 9

### 1. Clone & Setup Backend
```bash
cd campus-calm/backend
pip install -r requirements.txt
```

Run tests to verify deterministic safety interceptor:
```bash
python -m pytest tests/test_safety.py -v
```

Start the FastAPI development server:
```bash
python -m uvicorn app.main:app --reload --port 8000
```
Backend will be live at `http://localhost:8000` (Docs at `http://localhost:8000/docs`).

### 2. Setup & Start Frontend
In a separate terminal:
```bash
cd campus-calm/frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`.

---

## Environment Variables (.env)
Create a `.env` file in `campus-calm/` or `campus-calm/backend/`:

```env
APP_ENV=development
PORT=8000
HOST=0.0.0.0

# Optional: Google Gemini API Key (If omitted, resilient local intelligent fallback runs)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Optional: Supabase Credentials (for full cloud PostgreSQL sync)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_public_anon_key
```

---

## Production Build & Containerization

### Frontend Production Build
```bash
cd campus-calm/frontend
npm run build
```
Creates optimized static assets in `dist/`.

### Docker Deployment
FastAPI backend can serve static assets directly or via Nginx reverse proxy.
```dockerfile
# Backend Dockerfile example
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
