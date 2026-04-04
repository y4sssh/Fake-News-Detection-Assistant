import { useEffect, useMemo, useState } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';

const API_BASE_URL = 'http://127.0.0.1:5000';

const trustPoints = [
  'React-based analyzer workflow',
  'Flask API integration',
  'Suspicious sentence highlighting',
  'MongoDB-backed history support',
  'User authentication system',
]; 

function App() {
  const [theme, setTheme] = useState('light');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    if (token) {
      setIsAuthenticated(true);
    }
  }, [theme, token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]); 

  const flaggedSentences = useMemo(
    () => result?.suspicious_sentences || [],
    [result]
  );

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch(`${API_BASE_URL}/history`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch history');
      }

      setHistory(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Please enter a headline, article text, or URL first.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
      fetchHistory();
    } catch (requestError) {
      setResult(null);
      setError(requestError.message || 'Unable to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete history item');
      }

      setHistory((currentHistory) =>
        currentHistory.filter((item) => item.id !== id)
      );
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete history item.');
    }
  };

  const scoreValue = result?.score ? Math.max(0, Math.min(100, result.score)) : 0;

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
                  React frontend with Flask and MongoDB integration
                </span>
              </div>
            </div>

            <div className="topbar__actions">
              <button className="button button--ghost" onClick={toggleTheme}>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              {!isAuthenticated ? (
                <button className="button button--ghost" onClick={() => setShowLogin(true)}>
                  Sign In
                </button>
              ) : (
                <span className="user-status">Authenticated ✓</span>
              )}
              <button 
                className="button button--primary" 
                onClick={handleAnalyze}
                disabled={!isAuthenticated || loading}
              >
                {loading ? 'Analyzing...' : 'Start Analysis'}
              </button>
            </div>
            <LoginModal 
              isOpen={showLogin} 
              onClose={() => setShowLogin(false)} 
              onLogin={setToken} 
            />
          </nav>

          <div className="hero__layout">
            <section className="hero__content">
              <span className="eyebrow">Full React Experience</span>
              <h1>Analyze suspicious news with a real frontend-to-backend workflow.</h1>
              <p className="hero__description">
                This interface now works as a React application connected to
                your Flask backend. Users can submit content, receive AI-based
                credibility results, view suspicious sentences, and revisit
                stored MongoDB history.
              </p>

              <div className="hero__actions">
                <button className="button button--primary" onClick={handleAnalyze}>
                  {loading ? 'Analyzing...' : 'Analyze Now'}
                </button>
                <button
                  className="button button--secondary"
                  onClick={fetchHistory}
                >
                  Refresh History
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
                <span className="card-chip">Backend Status</span>
                <span className={`status ${result ? 'status--safe' : 'status--review'}`}>
                  {result ? 'Connected' : 'Waiting'}
                </span>
              </div>

              <h2>Live credibility preview</h2>
              <p className="hero-card__text">
                Submit text or a URL to run the Flask `/analyze` endpoint and
                instantly display credibility score, suspicious lines, and
                fact-check resources in this React UI.
              </p>

              <div className="score-block">
                <div
                  className="score-circle"
                  style={{
                    background: `radial-gradient(circle at center, white 58%, transparent 59%), conic-gradient(var(--warn) 0 ${scoreValue}%, #dde6f3 ${scoreValue}% 100%)`,
                  }}
                >
                  <strong>{result ? `${result.score}%` : '--'}</strong>
                  <span>Trust score</span>
                </div>

                <div className="score-details">
                  <div>
                    <label>Overall credibility</label>
                    <div className="progress">
                      <span style={{ width: `${scoreValue}%` }} />
                    </div>
                  </div>
                  <div>
                    <label>Source quality</label>
                    <div className="progress progress--soft">
                      <span
                        style={{
                          width: `${result?.source_score ? result.source_score : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="friendly-note">
                <p className="friendly-note__title">Current result</p>
                <p>{result ? result.warning : 'No analysis yet. Start with a headline or URL.'}</p>
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
                This input is now connected to your Flask backend and returns
                real API data instead of static demo content.
              </p>
            </div>

            <div className="workspace">
              <div className="workspace__form">
                <label htmlFor="news-input">News content</label>
                <textarea
                  id="news-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Paste suspicious content or a news URL here..."
                />
                <div className="workspace__actions">
                  <button
                    className="button button--primary button--wide"
                    onClick={handleAnalyze}
                    disabled={loading}
                  >
                    {loading ? 'Running Detection...' : 'Run Detection'}
                  </button>
                </div>

                {error ? <p className="feedback feedback--error">{error}</p> : null}
              </div>

              <div className="workspace__result">
                <div className="result-header">
                  <div>
                    <span className="result-header__label">Prediction</span>
                    <h3>
                      {result ? result.warning : 'Potential misinformation detected'}
                    </h3>
                  </div>
                  <span className="status status--review">Explainable AI</span>
                </div>

                <div className="metric-grid">
                  <article className="metric-card">
                    <strong>{result ? `${result.score}%` : '--'}</strong>
                    <span>Credibility score</span>
                  </article>
                  <article className="metric-card">
                    <strong>{flaggedSentences.length}</strong>
                    <span>Flagged sentences</span>
                  </article>
                  <article className="metric-card">
                    <strong>{result?.fact_check_links?.length || 0}</strong>
                    <span>Fact-check links</span>
                  </article>
                </div>

                <div className="signal-box">
                  <h4>Suspicious sentences</h4>
                  {flaggedSentences.length ? (
                    <ul>
                      {flaggedSentences.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-state">
                      Suspicious sentences will appear here after analysis.
                    </p>
                  )}
                </div>

                <div className="signal-box">
                  <h4>Fact-check resources</h4>
                  {result?.fact_check_links?.length ? (
                    <ul className="links-list">
                      {result.fact_check_links.map((link) => (
                        <li key={link}>
                          <a href={link} target="_blank" rel="noreferrer">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-state">
                      Fact-check links will appear here after analysis.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="panel panel--history">
            <div className="section-copy">
              <span className="eyebrow">History</span>
              <h2>Recent activity from MongoDB</h2>
              <p>
                Saved analysis results are fetched from your Flask backend and
                rendered here inside the React dashboard.
              </p>
            </div>

            <div className="history-list">
              {historyLoading ? (
                <div className="history-empty">Loading saved history...</div>
              ) : history.length ? (
                history.map((item) => (
                  <article className="history-card" key={item.id}>
                    <div className="history-card__top">
                      <div>
                        <h3>{item.warning}</h3>
                        <p>{item.text_preview || item.input}</p>
                      </div>
                      <span
                        className={`status ${
                          item.score > 60 ? 'status--safe' : 'status--warn'
                        }`}
                      >
                        {item.score}%
                      </span>
                    </div>

                    <div className="history-card__footer">
                      <span>{item.created_at || 'Saved result'}</span>
                      <button
                        className="button button--ghost button--small"
                        onClick={() => handleDeleteHistory(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="history-empty">
                  No saved history found yet. Run your first analysis.
                </div>
              )}
            </div>
          </section>

          <section className="panel panel--footer">
            <div>
              <span className="eyebrow">Integrated Product</span>
              <h2>Plain frontend converted into a connected React application</h2>
            </div>
            <p>
              Your project now has a React-based UI flow for input, result
              rendering, suspicious sentence display, fact-check links, theme
              toggling, and MongoDB history integration through the Flask API.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
