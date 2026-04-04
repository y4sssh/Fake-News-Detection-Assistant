from urllib.parse import urlparse

import validators
from newspaper import Article

TRUSTED_SOURCES = [
    "bbc.com",
    "reuters.com",
    "apnews.com",
    "theguardian.com",
    "npr.org",
    "aljazeera.com",
    "nytimes.com",
    "cnn.com",
    "wsj.com",
    "washingtonpost.com",
    "politifact.com",
    "snopes.com",
    "factcheck.org",
]

SUSPICIOUS_KEYWORDS = [
    "shocking",
    "miracle",
    "secret",
    "hidden truth",
    "must watch",
    "share this",
    "urgent",
    "doctors hate",
    "breaking",
    "100% proof",
]


def extract_text(input_data):
    if validators.url(input_data):
        try:
            article = Article(input_data)
            article.download()
            article.parse()
            return article.text, input_data
        except Exception:
            return None, input_data
    return input_data, None


def check_source(url):
    if not url:
        return 50

    domain = urlparse(url).netloc.lower()
    for trusted in TRUSTED_SOURCES:
        if trusted in domain:
            return 90
    return 30


def split_into_sentences(text):
    cleaned = text.replace("!", ".").replace("?", ".")
    return [sentence.strip() for sentence in cleaned.split(".") if sentence.strip()]


def find_suspicious_sentences(text):
    sentences = split_into_sentences(text)
    flagged = []

    for sentence in sentences:
        lowered = sentence.lower()
        if any(keyword in lowered for keyword in SUSPICIOUS_KEYWORDS):
            flagged.append(sentence)

    return flagged[:5]

def load_roberta_model():
    """Load RoBERTa fake news classifier."""

    try:
        from transformers import pipeline
        return pipeline(
            "text-classification",
            model="cardiffnlp/twitter-roberta-base-fake-gen",
            return_all_scores=True
        )
    except Exception:
        from transformers import pipeline
        return pipeline("sentiment-analysis")  # Fallback
