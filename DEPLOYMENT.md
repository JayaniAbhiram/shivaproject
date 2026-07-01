# Deployment Guide — Vercel or Netlify (All-in-One)

Deploy the **entire app** (frontend + backend) on a single platform. MongoDB stays on **Atlas** (already set up).

| Platform | Frontend | Backend |
|----------|----------|---------|
| **Vercel** | Static React build | Serverless API (`/api`) |
| **Netlify** | Static React build | Netlify Functions (`/api`) |

---

## Before You Deploy

### 1. Push to GitHub

```bash
cd "/Applications/Development/Building Projects/shiva project/attempt1"
git add .
git commit -m "Ready for Vercel/Netlify deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/event-management-system.git
git push -u origin main
```

### 2. MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → **Network Access**
2. **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)

---

## Option A: Deploy on Vercel (Recommended)

### Step 1 — Create project

1. Go to https://vercel.com → sign in with GitHub
2. **Add New** → **Project** → import your repo
3. **Root Directory:** leave as `.` (project root — important!)

### Step 2 — Build settings

Vercel reads `vercel.json` automatically:

| Setting | Value |
|---------|-------|
| Build Command | `cd frontend && npm run build` |
| Output Directory | `frontend/dist` |
| Install Command | installs root + frontend + backend deps |

### Step 3 — Environment variables

Add these in Vercel → Project → **Settings** → **Environment Variables**:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://testertestermail1_db_user:shivaproject@shivaproject.neqijah.mongodb.net/event_management` |
| `JWT_SECRET` | `eventhub_prod_secret_change_this_123` |
| `FRONTEND_URL` | Your Vercel URL (add after first deploy, e.g. `https://your-app.vercel.app`) |

> `VITE_API_URL` is **not needed** on Vercel — frontend and API share the same domain (`/api`).

### Step 4 — Deploy

Click **Deploy**. When done:

- **App:** `https://your-app.vercel.app`
- **API test:** `https://your-app.vercel.app/api/health`

### Step 5 — Update FRONTEND_URL

After first deploy, copy your Vercel URL → set `FRONTEND_URL` env var → redeploy.

---

## Option B: Deploy on Netlify

### Step 1 — Create site

1. Go to https://netlify.com → sign in with GitHub
2. **Add new site** → **Import an existing project**
3. Select your repo

### Step 2 — Build settings

`netlify.toml` at project root configures everything:

| Setting | Value |
|---------|-------|
| Build command | `cd frontend && npm install && npm run build` |
| Publish directory | `frontend/dist` |
| Functions | `netlify/functions` |

### Step 3 — Environment variables

Netlify → Site → **Site configuration** → **Environment variables**:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | your Atlas connection string |
| `JWT_SECRET` | a long random secret |
| `FRONTEND_URL` | your Netlify URL (e.g. `https://your-app.netlify.app`) |

### Step 4 — Deploy

- **App:** `https://your-app.netlify.app`
- **API test:** `https://your-app.netlify.app/api/health`

---

## How It Works

```
User Browser
     │
     ▼
┌─────────────────────────────┐
│  Vercel / Netlify           │
│  ┌─────────┐  ┌──────────┐  │
│  │ React   │  │ Express  │  │
│  │ (static)│  │ (server- │  │
│  │         │  │  less)   │  │
│  └─────────┘  └────┬─────┘  │
└────────────────────┼────────┘
                     ▼
              MongoDB Atlas
```

- Frontend calls `/api/...` on the **same domain** (no CORS issues)
- Express runs as a serverless function (not a always-on server)
- MongoDB connection is cached between requests

---

## Local Development (unchanged)

**Terminal 1:**
```bash
cd backend && npm run dev
```

**Terminal 2:**
```bash
cd frontend && npm run dev
```

Open http://localhost:5173 — Vite proxies `/api` to the backend.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `/api/health` returns 404 | Ensure root directory is `.` not `frontend` |
| MongoDB connection failed | Atlas → allow `0.0.0.0/0` in Network Access |
| Login/API fails after deploy | Check env vars `MONGODB_URI` and `JWT_SECRET` are set |
| Function timeout | Free tier has 10s limit — usually fine for this app |
| Cold start slow | First request after idle may take 2–5 seconds (normal on free tier) |

---

## What to Submit

- **Live URL:** `https://your-app.vercel.app` or `https://your-app.netlify.app`
- **GitHub repo link**
- **API health:** `https://your-app.vercel.app/api/health`

---

## Vercel vs Netlify

| | Vercel | Netlify |
|---|--------|---------|
| Ease of setup | ⭐ Very easy | ⭐ Very easy |
| Free tier | Generous | Generous |
| Serverless functions | `/api` folder | `netlify/functions` |
| Best for | React + Node projects | React + Node projects |

**Either works perfectly for your submission.**
