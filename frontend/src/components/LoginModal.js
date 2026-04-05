import { useState, useRef } from 'react';


const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backdropRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const apiUrl = `http://${window.location.hostname}:5000${endpoint}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLogin();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleOverlayClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" ref={backdropRef} onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Sign In' : 'Register'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <p className="switch-mode">
          {isLogin ? "Don't have an account?" : 'Have an account?'}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;

