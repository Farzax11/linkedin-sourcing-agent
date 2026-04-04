# LinkedIn Sourcing Agent 🤖

An AI-powered LinkedIn candidate sourcing application built with a multi-agent pipeline architecture.

**Live Demo:** https://linkedin-sourcing-agent-d8m5.vercel.app

---

## Features

- **Multi-Agent Pipeline** — Collector → Filter → Scorer → Ranker agents process candidates sequentially
- **Intelligent Scoring** — Skill match (70%) + Experience (30%) weighted scoring system
- **AI Outreach Generator** — Personalized messages via OpenAI GPT-3.5 with smart template fallback
- **JWT Authentication** — Secure register/login with MongoDB Atlas
- **Search History** — Persisted per user in MongoDB
- **Dashboard** — Stats and search history overview
- **Responsive UI** — Clean modern design built with React

---

## Tech Stack

**Frontend**
- React 18 + React Router
- Vite
- Deployed on Vercel

**Backend**
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication (bcryptjs + jsonwebtoken)
- OpenAI API
- Deployed on Vercel (serverless)

---

## Architecture

```
User Input (Job Role)
        ↓
  CollectorAgent    → Fetches candidate pool
        ↓
   FilterAgent      → Applies experience & skill filters
        ↓
   ScoringAgent     → Scores candidates (skill 70% + exp 30%)
        ↓
   RankingAgent     → Sorts and returns top candidates
        ↓
  OutreachAgent     → Generates personalized messages via OpenAI
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/search-candidates` | Run full agent pipeline |
| POST | `/api/score-candidates` | Score a custom candidate list |
| POST | `/api/generate-message` | Generate AI outreach message |
| GET | `/api/health` | Health check |

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- OpenAI API key (optional)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/sourcing-agent
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-your-openai-key
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

---

## Deployment

Both frontend and backend are deployed separately on Vercel.

**Backend env variables on Vercel:**
- `MONGODB_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`

**Frontend env variables on Vercel:**
- `VITE_API_URL` → your backend Vercel URL + `/api`

---

## Project Structure

```
linkedin-sourcing-agent/
├── backend/
│   ├── api/
│   │   └── index.js          # Vercel serverless entry
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # Express routes
│   │   ├── services/         # Business logic (agents)
│   │   ├── middleware/       # Auth middleware
│   │   └── data/             # Mock candidate data
│   └── server.js             # Local dev server
└── frontend/
    └── src/
        ├── components/       # Reusable UI components
        ├── context/          # Auth context
        ├── hooks/            # Custom hooks
        ├── pages/            # Route pages
        ├── services/         # API calls
        └── styles/           # Global CSS
```
