from urllib.parse import urlparse
import validators
from newspaper import Article

TRUSTED_SOURCES = [
    "bbc.com", "reuters.com", "apnews.com", "theguardian.com"
]

def extract_text(input_data):
    if validators.url(input_data):
        try:
            article = Article(input_data)
            article.download()
            article.parse()
            return article.text, input_data
        except:
            return None, input_data
    return input_data, None

def check_source(url):
    if not url:
        return 50  # neutral

    domain = urlparse(url).netloc
    for trusted in TRUSTED_SOURCES:
        if trusted in domain:
            return 90
    return 30