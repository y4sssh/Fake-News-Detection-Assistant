import { useEffect, useState } from 'react';
import './App.css';

const trustPoints = [
  'Credibility scoring powered by ML',
  'Suspicious sentence highlighting',
  'MongoDB-backed history support',
  'Dark mode ready experience',
];

const activityItems = [
  {
    title: 'Election update article',
    verdict: 'Likely credible',
    score: '87%',
    tone: 'safe',
  },
  {
    title: 'Health miracle headline',
    verdict: 'Needs review',
    score: '41%',
    tone: 'warn',
  },
  {
    title: 'Breaking market alert',
    verdict: 'Moderate risk',
    score: '58%',
    tone: 'review',
  },
];

const reviewSignals = [
  'Emotional or exaggerated wording detected',
  'Source credibility appears limited',
  'Fact-check verification recommended',
];

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app">
      <div className="page-shell">
        <header className="hero">
          <nav className="topbar">
            <div className="brand">
              <div className="brand__mark">FN</div>
              <div>
                <p className="brand__title">Fake News Detection Assistant</p>
                <span className="brand__subtitle">
                  Professional verification with a friendly user experience
                </span>
              </div>
            </div>

            <div className="topbar__actions">
              <button className="button button--ghost" onClick={toggleTheme}>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              <button className="button button--ghost">Sign In</button>
              <button className="button button--primary">Start Analysis</button>
            </div>
          </nav>

          <div className="hero__layout">
            <section className="hero__content">
              <span className="eyebrow">AI credibility workspace</span>
              <h1>Check news quickly, understand results clearly, and share with confidence.</h1>
              <p className="hero__description">
                This interface is designed to feel trustworthy, calm, and modern.
                It helps users detect misinformation using machine learning,
                suspicious sentence detection, confidence scoring, and history
                tracking without feeling intimidating.
              </p>

              <div className="hero__actions">
                <button className="button button--primary">
                  Analyze a Headline
                </button>
                <button className="button button--secondary">
                  View Example Report
                </button>
              </div>

              <div className="trust-points">
                {trustPoints.map((item) => (
                  <div className="trust-pill" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <aside className="hero-card">
              <div className="card-header">
                <span className="card-chip">Live Preview</span>
                <span className="status status--warn">Needs Review</span>
              </div>

              <h2>Article credibility snapshot</h2>
              <p className="hero-card__text">
                The assistant combines machine learning output, trusted-source
                checks, and highlighted risky phrasing to explain why a result
                may require caution.
              </p>

              <div className="score-block">
                <div className="score-circle">
                  <strong>41%</strong>
                  <span>Trust score</span>
                </div>

                <div className="score-details">
                  <div>
                    <label>Model confidence</label>
                    <div className="progress">
                      <span style={{ width: '41%' }} />
                    </div>
                  </div>
                  <div>
                    <label>Source quality</label>
                    <div className="progress progress--soft">
                      <span style={{ width: '54%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="friendly-note">
                <p className="friendly-note__title">Suggested action</p>
                <p>
                  Review the highlighted lines and verify with trusted sources
                  before sharing.
                </p>
              </div>
            </aside>
          </div>
        </header>

        <main className="main-grid">
          <section className="panel panel--input">
            <div className="section-copy">
              <span className="eyebrow">Analyzer</span>
              <h2>Paste text, link, or headline</h2>
              <p>
                Users can submit content and receive an explainable result with
                confidence score, suspicious sentences, and trusted fact-check
                suggestions.
              </p>
            </div>

            <div className="workspace">
              <div className="workspace__form">
                <label htmlFor="news-input">News content</label>
                <textarea
                  id="news-input"
                  readOnly
                  placeholder="Paste suspicious content or a news URL here..."
                />
                <div className="workspace__actions">
                  <button className="button button--primary button--wide">
                    Run Detection
                  </button>
                </div>
              </div>

              <div className="workspace__result">
                <div className="result-header">
                  <div>
                    <span className="result-header__label">Prediction</span>
                    <h3>Potential misinformation detected</h3>
                  </div>
                  <span className="status status--review">Explainable AI</span>
                </div>

                <div className="metric-grid">
                  <article className="metric-card">
                    <strong>84%</strong>
                    <span>Risk indicator</span>
                  </article>
                  <article className="metric-card">
                    <strong>3</strong>
                    <span>Flagged sentences</span>
                  </article>
                  <article className="metric-card">
                    <strong>2</strong>
                    <span>Fact-check links</span>
                  </article>
                </div>

                <div className="signal-box">
                  <h4>Why this was flagged</h4>
                  <ul>
                    {reviewSignals.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="panel panel--history">
            <div className="section-copy">
              <span className="eyebrow">History</span>
              <h2>Recent activity with database support</h2>
              <p>
                Analysis history can be stored in MongoDB so users can revisit
                previous checks in a professional dashboard.
              </p>
            </div>

            <div className="history-list">
              {activityItems.map((item) => (
                <article className="history-card" key={item.title}>
                  <div className="history-card__top">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.verdict}</p>
                    </div>
                    <span
                      className={`status ${
                        item.tone === 'safe'
                          ? 'status--safe'
                          : item.tone === 'review'
                          ? 'status--review'
                          : 'status--warn'
                      }`}
                    >
                      {item.score}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel panel--footer">
            <div>
              <span className="eyebrow">Presentation Ready</span>
              <h2>Balanced design: professional, friendly, and easy to trust</h2>
            </div>
            <p>
              This version uses softer visual styling, clearer spacing, lighter
              language, and a more polished dashboard structure so it feels more
              mature while still welcoming to users.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
