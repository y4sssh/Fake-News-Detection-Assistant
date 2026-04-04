import os
from datetime import datetime

from bson import ObjectId
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from transformers import pipeline

from utils import check_source, extract_text, find_suspicious_sentences, load_roberta_model

load_dotenv()

app = Flask(__name__)
CORS(app)

classifier = load_roberta_model()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("MONGO_DB_NAME", "fake_news_ai")

mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]
history_collection = db["analysis_history"]


def serialize_history_item(item):
    return {
        "id": str(item.get("_id", "")),
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
        scores = {r['label']: r['score'] for r in result}
        fake_score = scores.get('FAKE', 0) or (1 - scores.get('REAL', 0.5))
        return max(0, 100 * (1 - fake_score))
    else:
        # Fallback sentiment
        result = result[0] if isinstance(result, list) else result
        if result["label"] == "POSITIVE":
            return 70 + result["score"] * 30
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
        mongo_client.admin.command("ping")
        mongo_status = "connected"
    except Exception:
        mongo_status = "disconnected"

    return jsonify(
        {
            "status": "ok",
            "mongodb": mongo_status,
            "database": DB_NAME,
        }
    )


@app.route("/analyze", methods=["POST"])
@jwt_required()
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
        "input": input_data,
        "text_preview": text[:280],
        "score": final_score,
        "warning": warning,
        "source_score": source_score,
        "source_url": url,
        "suspicious_sentences": suspicious_sentences,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    inserted = history_collection.insert_one(analysis_result)

    return jsonify(
        {
            "id": str(inserted.inserted_id),
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


@app.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    items = history_collection.find().sort("created_at", -1).limit(20)
    return jsonify([serialize_history_item(item) for item in items])


@app.route("/history/<history_id>", methods=["DELETE"])
def delete_history(history_id):
    try:
        result = history_collection.delete_one({"_id": ObjectId(history_id)})
    except Exception:
        return jsonify({"error": "Invalid history id"}), 400

    if result.deleted_count == 0:
        return jsonify({"error": "History item not found"}), 404

    return jsonify({"message": "History item deleted successfully"})


from auth import init_auth, init_db

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-dev-key-change-in-prod')
init_auth(app)
init_db(mongo_client)

if __name__ == "__main__":
    app.run(debug=True)
