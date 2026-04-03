from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from utils import extract_text, check_source

app = Flask(__name__)
CORS(app)

# Load AI model once
classifier = pipeline("sentiment-analysis")

def analyze_text(text):
    result = classifier(text[:512])[0]

    if result['label'] == 'POSITIVE':
        return 70 + result['score'] * 30
    else:
        return 30 - result['score'] * 30

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    input_data = data.get("input")

    text, url = extract_text(input_data)

    if not text:
        return jsonify({"error": "Could not extract text"}), 400

    nlp_score = analyze_text(text)
    source_score = check_source(url)

    final_score = round((nlp_score * 0.7) + (source_score * 0.3), 2)

    warning = "Credible ✅" if final_score > 60 else "Possibly Fake ⚠️"

    return jsonify({
        "score": final_score,
        "warning": warning,
        "source_score": source_score,
        "fact_check_links": [
            "https://www.snopes.com/",
            "https://www.factcheck.org/"
        ]
    })

if __name__ == "__main__":
    app.run(debug=True)