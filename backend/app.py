import os
from datetime import datetime
import json
from pathlib import Path
from dotenv import load_dotenv

from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline

from utils import check_source, extract_text, find_suspicious_sentences, load_roberta_model
import auth




load_dotenv()

app = Flask(__name__)
CORS(app)

classifier = load_roberta_model()

# File-based history storage
HISTORY_FILE = Path(__file__).parent / "history.json"

def load_history():
    """Load history from JSON file"""
    if HISTORY_FILE.exists():
        try:
            with open(HISTORY_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_history(history):
    """Save history to JSON file"""
    try:
        with open(HISTORY_FILE, 'w') as f:
            json.dump(history, f, indent=2)
    except Exception as e:
        print(f"Error saving history: {e}")

def get_next_id():
    """Get next available ID for history item"""
    history = load_history()
    if not history:
        return "1"
    max_id = max(int(item.get("id", "0")) for item in history)
    return str(max_id + 1)


def serialize_history_item(item):
    return {
        "id": item.get("id", ""),
        "input": item.get("input", ""),
        "text_preview": item.get("text_preview", ""),
        "score": item.get("score", 0),
        "warning": item.get("warning", ""),
        "source_score": item.get("source_score", 0),
        "source_url": item.get("source_url"),
        "suspicious_sentences": item.get("suspicious_sentences", []),
        "created_at": item.get("created_at"),
    }


def analyze_text(text):
    result = classifier(text[:512])

    if isinstance(result, list) and len(result) > 0:
        result = result[0]  # Get first result

    # For sentiment analysis, map to fake news score
    if result["label"] == "POSITIVE":
        # Positive sentiment = likely credible
        return 70 + result["score"] * 30
    else:
        # Negative sentiment = potentially fake
        return 30 - result["score"] * 30


@app.route("/", methods=["GET"])
def home():
    return jsonify(
        {
            "message": "Fake News Detection Assistant API is running",
            "endpoints": [
                "/analyze",
                "/history",
                "/history/<id>",
                "/health",
            ],
        }
    )


@app.route("/health", methods=["GET"])
def health():
    try:
        # Check if we can read/write history file
        history = load_history()
        save_history(history)
        storage_status = "file-based"
    except Exception:
        storage_status = "error"

    return jsonify(
        {
            "status": "ok",
            "storage": storage_status,
            "model_loaded": classifier is not None,
        }
    )


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json or {}
    input_data = (data.get("input") or "").strip()

    if not input_data:
        return jsonify({"error": "Input text or URL is required"}), 400

    text, url = extract_text(input_data)

    if not text:
        return jsonify({"error": "Could not extract text"}), 400

    nlp_score = analyze_text(text)
    source_score = check_source(url)
    suspicious_sentences = find_suspicious_sentences(text)

    final_score = round((nlp_score * 0.7) + (source_score * 0.3), 2)

    warning = "Credible ✅" if final_score > 60 else "Possibly Fake ⚠️"

    analysis_result = {
        "id": get_next_id(),
        "input": input_data,
        "text_preview": text[:280],
        "score": final_score,
        "warning": warning,
        "source_score": source_score,
        "source_url": url,
        "suspicious_sentences": suspicious_sentences,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    # Save to file-based storage
    history = load_history()
    history.append(analysis_result)
    # Keep only last 100 entries
    if len(history) > 100:
        history = history[-100:]
    save_history(history)

    return jsonify(
        {
            "id": analysis_result["id"],
            "score": final_score,
            "warning": warning,
            "source_score": source_score,
            "source_url": url,
            "suspicious_sentences": suspicious_sentences,
            "fact_check_links": [
                "https://www.snopes.com/",
                "https://www.factcheck.org/",
                "https://www.reuters.com/fact-check/",
            ],
        }
    )


@app.route("/analyze_guest", methods=["POST"])
def analyze_guest():
    data = request.json or {}
    input_data = (data.get("input") or "").strip()

    if not input_data:
        return jsonify({"error": "Input text or URL is required"}), 400

    text, url = extract_text(input_data)

    if not text:
        return jsonify({"error": "Could not extract text"}), 400

    nlp_score = analyze_text(text)
    source_score = check_source(url)
    suspicious_sentences = find_suspicious_sentences(text)

    final_score = round((nlp_score * 0.7) + (source_score * 0.3), 2)

    warning = "Credible ✅" if final_score > 60 else "Possibly Fake ⚠️"

    return jsonify(
        {
            "score": final_score,
            "warning": warning,
            "source_score": source_score,
            "source_url": url,
            "suspicious_sentences": suspicious_sentences,
            "fact_check_links": [
                "https://www.snopes.com/",
                "https://www.factcheck.org/",
                "https://www.reuters.com/fact-check/",
            ],
        }
    )


@app.route("/login", methods=["POST"])
def login():
    return auth.login()

@app.route("/register", methods=["POST"])
def register():
    return auth.register()

@app.route("/history", methods=["GET"])
@auth.require_auth
def get_history():
    history = load_history()
    # Sort by created_at descending and limit to 20
    sorted_history = sorted(history, key=lambda x: x.get("created_at", ""), reverse=True)[:20]
    return jsonify([serialize_history_item(item) for item in sorted_history])

@app.route("/history/<history_id>", methods=["DELETE"])
@auth.require_auth
def delete_history(history_id):
    try:
        history = load_history()
        # Find and remove the item
        original_length = len(history)
        history = [item for item in history if item.get("id") != history_id]
        save_history(history)

        if len(history) < original_length:
            return jsonify({"message": "History item deleted"})
        else:
            return jsonify({"error": "History item not found"}), 404
    except Exception:
        return jsonify({"error": "Failed to delete history item"}), 500


app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-dev-key-change-in-prod')
from auth import init_auth
init_auth(app)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
