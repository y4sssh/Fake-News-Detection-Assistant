# Fake News Detection Assistant

A modern AI-powered web app to detect fake news using natural language analysis, source credibility scoring, and suspicious sentence detection.

## Overview

This repository includes a React frontend and a Flask backend that work together to identify potentially misleading or fake content. It supports text and URL analysis, presents a credibility score, and surfaces explainable signals like source reliability and suspicious phrasing.

## Key Features

- **Fast credibility scoring**: Evaluate text or URLs with a score from 0 to 100.
- **Explainable output**: See source reliability, suspicious sentences, and fact-check references.
- **React dashboard**: Clean UI with theme toggle, language selector, and history panel.
- **Authentication-ready**: Login/register flow with JWT authentication.
- **History persistence**: Save recent analyses for later review.
- **Health monitoring**: Backend health endpoint to check service status.

## Tech Stack

- Frontend: React, `react-scripts`, CSS styling
- Backend: Flask, `flask-cors`, `flask-jwt-extended`
- Machine learning: HuggingFace Transformers, Torch
- Data extraction: `newspaper3k`, `validators`
- Persistence: MongoDB via PyMongo

## Architecture

```text
Frontend (React)
    |
Backend (Flask API, ML, auth)
    |
MongoDB (history storage)
```

## Getting Started

### Prerequisites

- Python 3.10+ (3.12 preferred)
- Node.js 18+ / npm
- MongoDB (local or Docker)

### Clone the repository

```bash
git clone https://github.com/y4sssh/Fake-News-Detection-Assistant.git
cd Fake-News-Detection-Assistant
```

### Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1   # Windows PowerShell
# or: venv\Scripts\activate.bat   # Windows CMD
pip install -r requirements.txt
python app.py
```

The backend starts on `http://localhost:5000`.

### Frontend setup

```bash
cd ../frontend
npm install
npm start
```

The frontend starts on `http://localhost:3000`.

### Optional: Run MongoDB with Docker

```bash
docker run -d -p 27017:27017 --name fake-news-mongo mongo:latest
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Base API status |
| `/health` | GET | Backend + MongoDB health check |
| `/analyze` | POST | Analyze text/URL (authenticated) |
| `/analyze_guest` | POST | Analyze text/URL without login |
| `/login` | POST | Authenticate user |
| `/register` | POST | Register new user |
| `/history` | GET | Retrieve analysis history |
| `/history/<id>` | DELETE | Remove history entry |

## Usage

1. Open the React app in your browser.
2. Enter text or paste a URL into the analyzer.
3. Click **Analyze** to view credibility score and indicators.
4. Use the history panel to revisit previous analyses.
5. Toggle between light/dark mode and change language as needed.

## Troubleshooting

- If `npm start` reports port 3000 in use, run with another port:
  ```bash
  npm start -- --port 3001
  ```
- If MongoDB is disconnected, start it with Docker or connect your own MongoDB instance.
- The first model load may take time while Transformers downloads the model weights.

## Notes

- History persistence depends on MongoDB.
- Guest analysis works without login.
- Authentication is implemented with JWT tokens.

## License

MIT
