# DFK50083 — Python Programming Marking Dashboard

A full-stack marking dashboard for the DFK50083 Final Assessment.  
**Frontend** → GitHub Pages · **Backend** → Render.com (free)

🌐 Live: https://thazliahpdp.github.io/jtmkpdp/

---

## Stack

- **Backend**: FastAPI + SQLAlchemy (SQLite) + OpenAI GPT-4o
- **Frontend**: React + Vite + TypeScript + Tailwind CSS

---

## 🚀 Deployment Guide

### Step 1 — Deploy Backend on Render.com

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New → Web Service** → connect your repo `thazliahpdp/jtmkpdp`
3. Render will auto-detect `render.yaml` — click **Apply**
4. In the Render dashboard, go to your service → **Environment** → add:
   - `OPENAI_API_KEY` = your OpenAI key
5. Wait for deploy to finish. Copy your service URL, e.g.:  
   `https://dfk50083-api.onrender.com`

### Step 2 — Set GitHub Secret for Frontend Build

1. Go to your repo on GitHub → **Settings → Secrets and variables → Actions**
2. Click **New repository secret**:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://dfk50083-api.onrender.com` *(your Render URL)*

### Step 3 — Enable GitHub Pages

1. Go to your repo → **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

### Step 4 — Push to main

```bash
git add .
git commit -m "Initial deploy"
git push origin main
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Install dependencies
- Build the React app with your Render URL injected
- Deploy to `https://thazliahpdp.github.io/jtmkpdp/`

### Step 5 — Create first lecturer account

After backend is running, register once via API:

```bash
curl -X POST https://dfk50083-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","full_name":"Dr. Thazliah","email":"you@example.com","password":"yourpassword"}'
```

Then log in at `https://thazliahpdp.github.io/jtmkpdp/`

---

## 💻 Local Development

```bash
# Backend
cd backend
cp .env.example .env     # fill in OPENAI_API_KEY
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev              # opens http://localhost:5173
```

---

## Features

| Page | Description |
|---|---|
| **Dashboard** | Stats, grade distribution chart, marking progress bar |
| **Students** | Add/edit/delete with index number & seat number |
| **Questions** | Configure questions, max marks, AI marking schemes |
| **Scripts** | Upload student PDF answer scripts per student |
| **Marking** | Side-by-side PDF + per-question rubric + AI auto-mark |
| **Reports** | Grade table, pie chart, summary statistics, CSV export |

## Grade Boundaries

| Grade | Percentage |
|---|---|
| A | ≥ 80% |
| B | ≥ 70% |
| C | ≥ 60% |
| D | ≥ 50% |
| E | ≥ 40% |
| F | < 40% |
