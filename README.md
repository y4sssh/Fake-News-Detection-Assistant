# Fake News Detection Assistant 📰🔍

[![Backend Status](http://127.0.0.1:5000/health)](http://127.0.0.1:5000/health)
[![Frontend](http://127.0.0.1:3000)](http://127.0.0.1:3000)

AI-powered web app to detect fake news using ML credibility scoring, source analysis, suspicious sentence detection, with React UI and MongoDB history.

## ✨ Features

- **Live Credibility Preview & Analyzer**: Paste text/link/headline for instant score (0-100)
- **Prediction & Misinformation Detection**: \"Credible ✅\" or \"Possibly Fake ⚠️\"
- **Explainable AI**: Source score, flagged suspicious sentences, fact-check links
- **Backend Status**: Health check (Mongo connected/disconnected)
- **History**: Recent analyses saved/retrieved from MongoDB (20 latest, delete)
- **React UI**: Modern interface with theme toggle, metrics, history dashboard

## 🏗️ Architecture

```
Frontend (React) → Backend (Flask + Transformers + Torch) → MongoDB (History)
                          ↓
                    newspaper3k (URL extract)
                    validators (URL check)
```

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js
- Docker (MongoDB)

### Backend (http://localhost:5000)
```bash
cd fake-news-ai/backend
python -m venv venv
.venv/Scripts/Activate.ps1  # Windows
pip install -r requirements.txt
python app.py
```

Test:
```bash
curl http://localhost:5000/health
curl -X POST -H "Content-Type: application/json" -d "{\"input\": \"Shocking miracle!\"}" http://localhost:5000/analyze
```

### Frontend (http://localhost:3000)
```bash
cd fake-news-ai/frontend
npm install
npm start
```

### MongoDB (History)
```bash
docker run -d -p 27017:27017 --name fake-news-mongo mongo:latest
```

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome |
| `/health` | GET | Status (Mongo ping) |
| `/analyze` | POST `{input: str}` | Analyze text/URL |
| `/history` | GET | Recent 20 analyses |
| `/history/:id` | DELETE | Delete item |

## 🔧 Tech Stack

- **Frontend**: React, Tailwind-like CSS
- **Backend**: Flask, CORS
- **ML**: HuggingFace Transformers (sentiment), Torch
- **Extract**: newspaper3k
- **DB**: MongoDB + PyMongo
- **Utils**: validators, suspicious keywords

## 🤖 How Analyzer Works

1. Extract text from URL/text (newspaper3k)
2. NLP score: Sentiment pipeline (positive → credible)
3. Source score: Trusted domains (BBC, Reuters...)
4. Suspicious sentences: Keyword match (shocking, miracle...)
5. Final score = 0.7*NLP + 0.3*source
6. Save history MongoDB

## 📱 Demo UI

- Hero: Theme toggle, Analyze button
- Analyzer: Paste input, run detection, metrics cards, suspicious list
- History: Recent cards with delete
- Backend Status: Waiting → Connected

## 🐛 Troubleshooting

- Mongo disconnected: Run Docker container
- Transformers slow first run: Downloads ~500MB model
- Port busy: npm start --port 3001
- Windows venv: Set-ExecutionPolicy RemoteSigned

## 🚀 Next Steps (TODO.md)

✅ RoBERTa ML + expanded sources (Phase 1 done)
- [ ] User auth (JWT)
- [ ] Screenshot badges (Vision API)
- [ ] Mongo Atlas full guide

See TODO.md for progress.

## 📄 License

MIT
