# Event Management System

A full-stack Event Management System with event creation, ticket booking, QR check-in, payment integration, and analytics dashboard.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | HTML, CSS, JavaScript, React, Vite, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Payment | Stripe (optional — demo mode available) |
| QR | qrcode (generation), html5-qrcode (scanning) |

## Features

- **Event Creation** — Organizers can create events with title, description, date, venue, pricing, and capacity
- **Ticket Booking** — Users browse events and book tickets with quantity selection
- **QR Check-in** — QR codes generated on booking; organizers scan or manually enter ticket IDs
- **Payment Integration** — Stripe Checkout (test mode) or Demo Pay for development
- **Analytics Dashboard** — Revenue, ticket sales, check-ins, charts, and recent bookings

## Project Structure

```
attempt1/
├── backend/          # Express API server
│   ├── models/       # MongoDB schemas (User, Event, Ticket)
│   ├── routes/       # API routes
│   ├── middleware/   # JWT authentication
│   └── server.js     # Entry point
├── frontend/         # React SPA
│   └── src/
│       ├── pages/    # All app pages
│       ├── components/
│       ├── context/  # Auth state
│       └── api/      # API client
└── README.md
```

---

## Prerequisites

Install these before running the project:

1. **Node.js** (v18 or higher) — [https://nodejs.org](https://nodejs.org)
2. **MongoDB** — Choose one:
   - **Local:** [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - **Cloud:** [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
3. **Stripe Account** (optional) — [https://stripe.com](https://stripe.com) for real payments

---

## Configuration Guide

### Step 1: MongoDB Setup

**Option A — Local MongoDB**
```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Connection string:
mongodb://localhost:27017/event_management
```

**Option B — MongoDB Atlas (Cloud)**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user (username + password)
3. Whitelist your IP (or `0.0.0.0/0` for development)
4. Copy the connection string:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/event_management
```

### Step 2: Backend Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/event_management` |
| `JWT_SECRET` | Secret for JWT tokens (use a long random string) | `my_super_secret_key_12345` |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (optional) | `whsec_...` |
| `FRONTEND_URL` | Frontend URL for Stripe redirects | `http://localhost:5173` |

> **Note:** If Stripe keys are not configured, the app uses **Demo Pay** mode — payments complete instantly without Stripe.

### Step 3: Stripe Setup (Optional)

1. Sign up at [stripe.com](https://stripe.com)
2. Go to **Developers → API keys**
3. Copy the **Secret key** (starts with `sk_test_`)
4. Paste into `STRIPE_SECRET_KEY` in `.env`
5. For webhooks (production): set up endpoint at `POST /api/payments/webhook`

**Test card numbers:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

---

## Installation & Running

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at: **http://localhost:5000**

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**

### Verify Setup

```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","message":"Event Management API is running"}
```

---

## How to Use

### 1. Register Accounts

| Role | Purpose |
|------|---------|
| **Organizer** | Create events, check-in attendees, view analytics |
| **User (Attendee)** | Browse and book tickets |

Go to **Register** → select account type.

### 2. Create an Event (Organizer)

1. Login as Organizer
2. Click **Create Event**
3. Fill in details (title, date, venue, price, tickets)
4. Submit

### 3. Book a Ticket (Attendee)

1. Login as User
2. Browse **Events** → select an event
3. Choose quantity → **Book** or **Demo Pay**

### 4. QR Check-in (Organizer)

1. Go to **QR Check-in**
2. Scan attendee's QR code from their ticket
3. Or enter Ticket ID manually (e.g. `TKT-A1B2C3D4`)

### 5. Analytics (Organizer)

Go to **Analytics** to view:
- Total revenue and tickets sold
- Revenue by event (bar chart)
- Events by category (pie chart)
- Recent bookings table

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/events` | List events |
| POST | `/api/events` | Create event (organizer) |
| GET | `/api/events/:id` | Event details |
| POST | `/api/tickets/book` | Book ticket |
| GET | `/api/tickets/my-tickets` | User's tickets |
| POST | `/api/tickets/checkin` | QR check-in (organizer) |
| POST | `/api/payments/create-checkout` | Stripe checkout |
| POST | `/api/payments/demo-pay` | Demo payment |
| GET | `/api/analytics/dashboard` | Organizer analytics |

---

## Production Build

```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist/

# Backend
cd backend
npm start
```

For production, serve `frontend/dist` via Nginx or deploy to Vercel/Netlify, and deploy the API to Render/Railway/Heroku.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Ensure MongoDB is running; check `MONGODB_URI` |
| CORS errors | Verify `FRONTEND_URL` in backend `.env` matches frontend URL |
| Stripe not working | Use **Demo Pay** button, or add valid `sk_test_` key |
| QR scanner not working | Allow camera permissions in browser; use HTTPS in production |
| Port already in use | Change `PORT` in `.env` or kill the process using the port |

---

## Submission Checklist

- [ ] MongoDB running (local or Atlas)
- [ ] Backend `.env` configured
- [ ] `npm install` in both `backend/` and `frontend/`
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Register as Organizer → create event
- [ ] Register as User → book ticket → view QR
- [ ] Organizer checks in via QR Check-in
- [ ] View Analytics dashboard

---

**Deadline:** July 2nd

Built with HTML, CSS, JavaScript, React, Node.js, Express.js, and MongoDB.
