import React, { useState } from 'react';
import './Auth.css';
import { FaSpotify, FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (email) {
      setStep(2);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/register', {
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
        alert('Registration failed. Email might already be taken.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error.');
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:8000/auth/google/redirect';
  };


  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <img src="/stainify-logo.png" alt="Stainify Logo" style={{width: '60px', height: '60px', objectFit: 'contain', marginBottom: '10px'}} />
          <h1>Sign up to start listening</h1>
        </div>

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleNext}>
            <div className="form-group">
              <label>Email address</label>
              <input 
                type="email" 
                placeholder="name@domain.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-submit-btn">Next</button>
            
            <div className="auth-divider">
              <span>or</span>
            </div>

            <button type="button" className="social-btn google-btn" onClick={handleGoogleAuth}>
              <FaGoogle className="social-icon" />
              Sign up with Google
            </button>

            <button type="button" className="social-btn apple-btn" onClick={() => navigate('/')}>
              <FaApple className="social-icon" />
              Sign up with Apple
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-submit-btn">Sign up</button>
          </form>
        )}

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};
