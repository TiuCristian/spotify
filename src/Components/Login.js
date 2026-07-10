import React, { useState } from 'react';
import './Auth.css';
import { FaSpotify, FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === 'tiucrs@gmail.com') {
      window.location.href = 'http://localhost:8000/admin/login';
    } else {
      try {
        const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('spotify_user', JSON.stringify({ email: data.user.email, name: data.user.name }));
          navigate('/');
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error(error);
        alert('Network error.');
      }
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:8000/auth/google/redirect';
  };

  const handleFacebookAuth = () => {
    window.location.href = 'http://localhost:8000/auth/facebook/redirect';
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <FaSpotify className="auth-logo" />
          <h1>Log in to Spotify</h1>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email address</label>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-submit-btn">Log In</button>
          
          <div className="auth-divider">
            <span>or</span>
          </div>

          <button type="button" className="social-btn google-btn" onClick={handleGoogleAuth}>
            <FaGoogle className="social-icon" />
            Continue with Google
          </button>
          <button type="button" className="social-btn facebook-btn" onClick={handleFacebookAuth} style={{backgroundColor: '#1877f2', color: '#fff'}}>
            <FaFacebook className="social-icon" />
            Continue with Facebook
          </button>
          <button type="button" className="social-btn apple-btn" onClick={() => navigate('/')}>
            <FaApple className="social-icon" />
            Continue with Apple
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up for Spotify</Link></p>
        </div>
      </div>
    </div>
  );
};
