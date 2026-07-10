import React, { useState, useEffect } from 'react';
import './TopBar.css';

import { FiHome, FiSearch, FiBell, FiUsers, FiUser, FiUpload, FiExternalLink, FiCheck } from 'react-icons/fi';
import { BiLibrary } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export const TopBar = ({ onOpenUpload, user }) => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setIsProfileMenuOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="topbar">
       <div className="topbar-navigation">
       </div>
       <div className="topbar-search-container">
          <button className="topbar-home-btn"><FiHome /></button>
          <div className="topbar-search">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="What do you want to play?" />
          </div>
       </div>
       <div className="topbar-profile">
          {user ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <button 
                onClick={onOpenUpload}
                style={{
                  background: 'transparent', color: '#b3b3b3', border: 'none',
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                  fontWeight: '700', fontSize: '14px', transition: 'color 0.2s, transform 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseOut={e => { e.currentTarget.style.color = '#b3b3b3'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <FiUpload style={{fontSize: '20px'}} />
                <span>Upload Song</span>
              </button>

              <div className="profile-menu-container">
              <div 
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: '#ff8bcb', color: '#000', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                  cursor: 'pointer', transition: 'transform 0.2s'
                }}
                onClick={(e) => { e.stopPropagation(); setIsProfileMenuOpen(!isProfileMenuOpen); }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {isProfileMenuOpen && (
                <div className="profile-dropdown-menu" onClick={e => e.stopPropagation()}>
                  <button className="profile-dropdown-item">
                    <span>Account</span>
                    <FiExternalLink style={{fontSize: '18px'}} />
                  </button>
                  <button className="profile-dropdown-item">Profile</button>
                  <button className="profile-dropdown-item">Recents</button>
                  <button className="profile-dropdown-item">
                    <span>Support</span>
                    <FiExternalLink style={{fontSize: '18px'}} />
                  </button>
                  <button className="profile-dropdown-item">Private session</button>
                  <button className="profile-dropdown-item">Settings</button>
                  <button className="profile-dropdown-item" onClick={async () => {
                     try {
                        if (user && user.email) {
                           await fetch('http://localhost:8000/api/logout', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ email: user.email })
                           });
                        }
                     } catch (e) {
                        console.error(e);
                     }
                     localStorage.removeItem('spotify_user');
                     window.location.reload();
                  }}>Log out</button>
                  
                  <div className="profile-dropdown-separator"></div>
                  
                  <div className="profile-updates-section">
                    <div className="profile-updates-title">Your Updates</div>
                    <FiCheck className="profile-updates-icon" />
                    <div className="profile-updates-status">You're all caught up</div>
                    <div className="profile-updates-desc">
                      Watch this space for news on your followers, playlists, events and more.
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>
          ) : (
            <>
              <button className="auth-btn-secondary" onClick={() => navigate('/register')}>Sign up</button>
              <button className="auth-btn-primary" onClick={() => navigate('/login')}>Log in</button>
            </>
          )}
       </div>
    </div>
  );
};
