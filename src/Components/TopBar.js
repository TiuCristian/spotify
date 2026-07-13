import React, { useState, useEffect } from 'react';
import './TopBar.css';

import { FiHome, FiSearch, FiBell, FiUsers, FiUser, FiUpload, FiExternalLink, FiCheck } from 'react-icons/fi';
import { BiLibrary } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export const TopBar = ({ onOpenUpload, user }) => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPassword, setEditPassword] = useState('');

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
                className="topbar-upload-btn"
                onClick={onOpenUpload}
              >
                <FiUpload className="upload-icon" />
                <span className="upload-text">Upload Song</span>
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
                  <button className="profile-dropdown-item" onClick={() => setIsSettingsOpen(true)}>
                    <span>Account</span>
                    <FiExternalLink style={{fontSize: '18px'}} />
                  </button>
                  <button className="profile-dropdown-item" onClick={() => setIsSettingsOpen(true)}>Profile</button>
                  <button className="profile-dropdown-item">Recents</button>
                  <button className="profile-dropdown-item">
                    <span>Support</span>
                    <FiExternalLink style={{fontSize: '18px'}} />
                  </button>
                  <button className="profile-dropdown-item">Private session</button>
                  <button className="profile-dropdown-item" onClick={() => setIsSettingsOpen(true)}>Settings</button>
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

       {isSettingsOpen && (
         <div style={{
           position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
           background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', 
           alignItems: 'center', justifyContent: 'center'
         }} onClick={() => setIsSettingsOpen(false)}>
           <div style={{
             background: '#282828', padding: '30px', borderRadius: '8px', 
             width: '400px', display: 'flex', flexDirection: 'column', gap: '15px'
           }} onClick={e => e.stopPropagation()}>
             <h2 style={{marginTop: 0, color: '#fff'}}>Account Settings</h2>
             <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
               <label style={{color: '#b3b3b3', fontSize: '14px', fontWeight: 'bold'}}>Name</label>
               <input 
                 type="text" 
                 value={editName}
                 onChange={e => setEditName(e.target.value)}
                 style={{padding: '10px', borderRadius: '4px', border: 'none', background: '#3e3e3e', color: '#fff'}}
               />
             </div>
             <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
               <label style={{color: '#b3b3b3', fontSize: '14px', fontWeight: 'bold'}}>New Password</label>
               <input 
                 type="password" 
                 placeholder="Leave blank to keep current"
                 value={editPassword}
                 onChange={e => setEditPassword(e.target.value)}
                 style={{padding: '10px', borderRadius: '4px', border: 'none', background: '#3e3e3e', color: '#fff'}}
               />
             </div>
             <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px'}}>
               <button onClick={() => setIsSettingsOpen(false)} style={{
                 background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold'
               }}>Cancel</button>
               <button onClick={async () => {
                 try {
                   const res = await fetch('http://localhost:8000/api/user/settings', {
                     method: 'PUT',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ email: user.email, name: editName, password: editPassword })
                   });
                   if(res.ok) {
                     const data = await res.json();
                     localStorage.setItem('spotify_user', JSON.stringify({ name: data.user.name, email: data.user.email }));
                     window.location.reload();
                   }
                 } catch(e) { console.error(e); }
               }} style={{
                 background: '#1db954', color: '#000', border: 'none', borderRadius: '500px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold'
               }}>Save Profile</button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};
