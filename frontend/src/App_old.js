import { useState, useEffect } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const endpoint = isLoggedIn ? '/analyze' : '/analyze_guest';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
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
    } catch (err) {
      setError(err.message);
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
  };

  return (
    <div className="app">
      <header className="App-header">
        <div className="header-left">
          <h1>🔍 Credibility Check</h1>
        </div>
        <div className="header-right">
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="user-status">
            {isLoggedIn ? (
              <div>
                <span>Logged in</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="login-btn">Login</button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="hero">
          <h2>Detect Fake News Instantly</h2>
          <p>Enter text or a URL to analyze its credibility using AI</p>

          <div className="input-section">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your text or URL here..."
              rows={4}
            />
            <button
              className={`button--primary ${loading ? 'button--loading' : ''}`}
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
            >
              {loading ? 'Analyzing...' : 'Run Detection'}
              {loading && <span className="spinner"></span>}
            </button>
          </div>

          {!isLoggedIn && (
            <p className="guest-note">
              <em>Running in guest mode. Login for full features.</em>
            </p>
          )}
        </div>

        {error && (
          <div className="feedback feedback--error">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="results-section">
            <div className="signal-box">
              <h3>Analysis Results</h3>
              <div className="trust-points">
                <div className="trust-pill">
                  Score: {result.score}/100
                </div>
                <div className="trust-pill">
                  {result.warning}
                </div>
                {result.source_score && (
                  <div className="trust-pill">
                    Source: {result.source_score}/100
                  </div>
                )}
              </div>

              {result.suspicious_sentences && result.suspicious_sentences.length > 0 && (
                <div className="signal-box">
                  <h4>Suspicious Sentences</h4>
                  {result.suspicious_sentences.map((sentence, index) => (
                    <div key={index} className="suspicious-item">
                      <span className="warn-icon">⚠️</span>
                      <p>{sentence}</p>
                    </div>
                  ))}
                </div>
              )}

              {result.fact_check_links && result.fact_check_links.length > 0 && (
                <div className="fact-check-section">
                  <h4>Fact Check Resources</h4>
                  {result.fact_check_links.map((link, index) => (
                    <div key={index} className="fact-link">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>Fake News Detector</h3>
            <p>AI-powered tool to verify news credibility</p>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><a href="https://www.snopes.com/">Snopes</a></li>
              <li><a href="https://www.factcheck.org/">FactCheck.org</a></li>
              <li><a href="https://www.reuters.com/fact-check/">Reuters Fact Check</a></li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <p>&copy; 2024 Fake News Detection Assistant. Built with AI for truth.</p>
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
