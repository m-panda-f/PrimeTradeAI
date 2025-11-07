import React, { useState } from 'react';
import axios from 'axios';
import '../styles/register.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (username === '' || password === '' || confirmPassword === '') {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password
      });

      setSuccess(response.data.message);
      localStorage.setItem('username', response.data.username);
      navigate("/dashboard");
      setError('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (

    <div className="register-container">
      <nav className="register-navbar">
        <h2 className="reg-logo" onClick={() => navigate("/")}>
          PrimeTrade<span>AI</span>
        </h2>
      </nav>
      <div className="register-box">
        <h2>Admin Registration</h2>
        <form onSubmit={handleRegister}>
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
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="switch-to-login">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;