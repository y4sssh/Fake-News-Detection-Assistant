import { useState, useEffect } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';
import { getTranslation } from './i18n';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Allow testing login functionality
  const [showLogin, setShowLogin] = useState(false);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('analysisHistory')) || []);
  const [showHistory, setShowHistory] = useState(false);
  const [clipboard, setClipboard] = useState(false);

  const t = getTranslation(language);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('analysisHistory', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError(t.messages.enterInput);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const endpoint = isLoggedIn ? '/analyze' : '/analyze_guest';
      const apiUrl = `http://${window.location.hostname}:5000${endpoint}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.messages.error);
      }

      setResult(data);

      // Add to history if logged in
      if (isLoggedIn) {
        const newEntry = {
          id: Date.now(),
          input: input,
          result: data,
          timestamp: new Date().toISOString(),
        };
        setHistory([newEntry, ...history.slice(0, 19)]);
      }
    } catch (err) {
      setError(err.message || t.messages.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setResult(null);
    setShowHistory(false);
  };

  const handleCopyResult = () => {
    if (result) {
      const text = `Credibility Score: ${result.score}/100\nStatus: ${result.warning}\nSource Score: ${result.source_score}/100`;
      navigator.clipboard.writeText(text);
      setClipboard(true);
      setTimeout(() => setClipboard(false), 2000);
    }
  };

  const handleExportResult = () => {
    if (result) {
      const dataStr = JSON.stringify({
        input: input,
        result: result,
        timestamp: new Date().toISOString(),
        language: language,
      }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analysis-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleHistoryItem = (item) => {
    setInput(item.input);
    setResult(item.result);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all analysis history?')) {
      setHistory([]);
      setShowHistory(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="App-header">
        <div className="header-left">
          <h1>{t.header.title}</h1>
          <span className="tagline">{t.header.tagline}</span>
        </div>
        <div className="header-center">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-selector"
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div className="header-right">
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Light Mode" : "Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            className="history-toggle"
            onClick={() => setShowHistory(!showHistory)}
            title="View history"
            aria-label="View analysis history"
          >
            📋 {history.length}
          </button>
          <div className="user-status">
            {isLoggedIn ? (
              <div>
                <span>✓ Signed in</span>
                <button onClick={handleLogout} className="logout-btn">
                  {t.buttons.logout}
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="login-btn">
                {t.buttons.login}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* History Panel */}
      {showHistory && isLoggedIn && (
        <div className="history-panel">
          <div className="history-header">
            <h3>📋 Analysis History</h3>
            <button onClick={() => setShowHistory(false)} className="close-btn">✕</button>
          </div>
          <div className="history-list">
            {history.length === 0 ? (
              <p className="empty-state">No analysis history yet</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="history-item" onClick={() => handleHistoryItem(item)}>
                  <div className="history-preview">
                    {item.input.substring(0, 60)}...
                  </div>
                  <div className="history-score">
                    Score: {item.result.score}/100
                  </div>
                  <div className="history-time">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
          {history.length > 0 && (
            <button onClick={handleClearHistory} className="clear-history-btn">
              {t.buttons.clearHistory}
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="hero">
          <h2>{t.hero.heading}</h2>
          <p>{t.hero.subheading}</p>

          <div className="input-section">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.hero.placeholder}
              rows={5}
              spellCheck="true"
              aria-label="Content to analyze"
            />
            <div className="input-actions">
              <button
                className={`button--primary ${loading ? 'button--loading' : ''}`}
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                aria-label="Analyze content"
              >
                {loading ? t.buttons.analyzing : t.buttons.analyze}
                {loading && <span className="spinner"></span>}
              </button>
              {result && (
                <div className="result-actions">
                  <button 
                    onClick={handleCopyResult}
                    className="action-btn copy-btn"
                    title="Copy results"
                  >
                    {clipboard ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <button 
                    onClick={handleExportResult}
                    className="action-btn export-btn"
                    title="Export results"
                  >
                    📥 Export
                  </button>
                </div>
              )}
            </div>
          </div>

          {!isLoggedIn && (
            <p className="guest-note">
              <em>🔓 {t.messages.guestMode}</em>
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="feedback feedback--error" role="alert">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="results-section">
            <div className="signal-box">
              <h3>📊 {t.results.title}</h3>
              
              <div className="trust-points">
                <div className={`trust-pill score-${Math.round(result.score / 20)}`}>
                  <strong>{t.results.credibilityScore}</strong><br/>
                  {Math.round(result.score)}/100
                </div>
                <div className="trust-pill">
                  <strong>{t.results.status}</strong><br/>
                  {result.warning}
                </div>
                {result.source_score && (
                  <div className="trust-pill">
                    <strong>{t.results.sourceReliability}</strong><br/>
                    {Math.round(result.source_score)}/100
                  </div>
                )}
              </div>

              {/* Progress bars */}
              <div className="progress-section">
                <div className="progress-item">
                  <label>Credibility</label>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${result.score}%`, backgroundColor: result.score > 60 ? '#10b981' : '#ef4444'}}></div>
                  </div>
                </div>
              </div>

              {/* Suspicious Sentences */}
              {result.suspicious_sentences && result.suspicious_sentences.length > 0 && (
                <div className="signal-box nested">
                  <h4>🚨 {t.results.suspicious_sentences}</h4>
                  {result.suspicious_sentences.map((sentence, index) => (
                    <div key={index} className="suspicious-item">
                      <span className="warn-icon">⚠️</span>
                      <p>{sentence}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Fact Check Resources */}
              {result.fact_check_links && result.fact_check_links.length > 0 && (
                <div className="fact-check-section">
                  <h4>🔗 {t.results.fact_check}</h4>
                  {result.fact_check_links.map((link, index) => (
                    <div key={index} className="fact-link">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link} ↗
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!result && !error && (
          <div className="empty-placeholder">
            <p>{t.results.noResults}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>{t.footer.about}</h3>
            <p>{t.footer.aboutText}</p>
          </div>
          <div>
            <h4>{t.footer.resources}</h4>
            <ul>
              <li><a href="https://www.snopes.com/" target="_blank" rel="noopener noreferrer">Snopes</a></li>
              <li><a href="https://www.factcheck.org/" target="_blank" rel="noopener noreferrer">FactCheck.org</a></li>
              <li><a href="https://www.reuters.com/fact-check/" target="_blank" rel="noopener noreferrer">Reuters</a></li>
            </ul>
          </div>
          <div>
            <h4>{t.footer.legal}</h4>
            <ul>
              <li><a href="#privacy">{t.footer.privacy}</a></li>
              <li><a href="#terms">{t.footer.terms}</a></li>
              <li><a href="#contact">{t.footer.contact}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Credibility Check. {t.footer.aboutText}</p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
