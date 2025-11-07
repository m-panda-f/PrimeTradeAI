import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (username === '' || password === '') {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      });

      // Store user in localStorage
      localStorage.setItem('username', response.data.username);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="login-container">
      <nav className='register-navbar'>
        <h2 className="reg-logo" onClick={() => navigate("/")}>
          PrimeTrade<span>AI</span>
        </h2>
      </nav>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
        <p>Don't have an account? <span className="register-link" onClick={() => navigate('/register')}>Register here</span></p>
      </div>
    </div>
  );
};

export default LoginPage;