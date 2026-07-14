import React, { useState, useEffect } from 'react';
import './TopBar.css';

import { FiHome, FiSearch, FiBell, FiMessageCircle, FiUsers, FiUser, FiUpload, FiExternalLink, FiCheck } from 'react-icons/fi';
import { BiLibrary } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { SettingsModal } from './SettingsModal';

export const TopBar = ({ onOpenUpload, user, onOpenChat }) => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPassword, setEditPassword] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState([]);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  useEffect(() => {
    if (!user || !user.email) return;
    const fetchPending = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/social?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setPendingRequests(data.pendingRequests || []);
        }
      } catch (e) {}
    };
    fetchPending();

    const fetchUnread = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/chat/unread?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setUnreadMessages(data || []);
        }
      } catch (e) {}
    };
    fetchUnread();

    const interval = setInterval(() => {
      fetchPending();
      fetchUnread();
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileMenuOpen(false);
      setIsNotificationsOpen(false);
      setIsMessagesOpen(false);
    };
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

              <div 
                style={{ position: 'relative', cursor: 'pointer', color: '#b3b3b3', display: 'flex', alignItems: 'center' }} 
                title="Notifications"
                onClick={(e) => { e.stopPropagation(); setIsNotificationsOpen(!isNotificationsOpen); setIsMessagesOpen(false); setIsProfileMenuOpen(false); }}
              >
                <FiBell size={20} />
                {pendingRequests.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    background: '#e91429', color: '#fff', fontSize: '10px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {pendingRequests.length}
                  </div>
                )}
                {isNotificationsOpen && (
                  <div className="profile-dropdown-menu notifications-dropdown" onClick={e => e.stopPropagation()} style={{
                    right: '-10px', top: '40px', width: '320px', padding: '10px'
                  }}>
                    <h4 style={{margin: '0 0 10px 0', padding: '0 5px', color: '#fff'}}>Notifications</h4>
                    {pendingRequests.length === 0 ? (
                      <div style={{padding: '10px 5px', color: '#b3b3b3', fontSize: '14px'}}>No new notifications.</div>
                    ) : (
                      pendingRequests.map(req => (
                        <div key={req.id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                          padding: '10px 5px', borderBottom: '1px solid #333'
                        }}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.name)}&background=random&size=32`} style={{borderRadius: '50%'}} alt="avatar" />
                            <div style={{color: '#fff', fontSize: '14px'}}><strong>{req.name}</strong> wants to follow you</div>
                          </div>
                          <div style={{display: 'flex', gap: '5px'}}>
                            <button onClick={async () => {
                              await fetch('http://localhost:8000/api/social/accept', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: user.email, follower_id: req.id })
                              });
                              setPendingRequests(pendingRequests.filter(r => r.id !== req.id));
                            }} style={{
                              background: '#1db954', color: '#000', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                            }}>Accept</button>
                            <button onClick={async () => {
                              await fetch('http://localhost:8000/api/social/decline', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: user.email, follower_id: req.id })
                              });
                              setPendingRequests(pendingRequests.filter(r => r.id !== req.id));
                            }} style={{
                              background: 'transparent', color: '#fff', border: '1px solid #727272', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer'
                            }}>Decline</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div 
                style={{ position: 'relative', cursor: 'pointer', color: '#b3b3b3', display: 'flex', alignItems: 'center' }} 
                title="Messages"
                onClick={(e) => { e.stopPropagation(); setIsMessagesOpen(!isMessagesOpen); setIsNotificationsOpen(false); setIsProfileMenuOpen(false); }}
              >
                <FiMessageCircle size={20} />
                {unreadMessages.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    background: '#1db954', color: '#000', fontSize: '10px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {unreadMessages.length}
                  </div>
                )}
                {isMessagesOpen && (
                  <div className="profile-dropdown-menu notifications-dropdown" onClick={e => e.stopPropagation()} style={{
                    right: '-10px', top: '40px', width: '320px', padding: '10px'
                  }}>
                    <h4 style={{margin: '0 0 10px 0', padding: '0 5px', color: '#fff'}}>Unread Messages</h4>
                    {unreadMessages.length === 0 ? (
                      <div style={{padding: '10px 5px', color: '#b3b3b3', fontSize: '14px'}}>No new messages.</div>
                    ) : (
                      Object.values(unreadMessages.reduce((acc, msg) => {
                        if (!acc[msg.sender_id]) acc[msg.sender_id] = { count: 0, sender: msg.sender };
                        acc[msg.sender_id].count++;
                        return acc;
                      }, {})).map(group => (
                        <div key={group.sender.id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                          padding: '10px 5px', borderBottom: '1px solid #333'
                        }}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(group.sender.name)}&background=random&size=32`} style={{borderRadius: '50%'}} alt="avatar" />
                            <div style={{color: '#fff', fontSize: '14px'}}>
                              <strong>{group.sender.name}</strong> sent you {group.count} message{group.count > 1 ? 's' : ''}
                            </div>
                          </div>
                          <div 
                            style={{fontSize: '12px', color: '#1db954', cursor: 'pointer', fontWeight: 'bold'}}
                            onClick={(e) => {
                               e.stopPropagation();
                               setIsMessagesOpen(false);
                               if (onOpenChat) onOpenChat(group.sender);
                            }}
                          >
                            Open Chat
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

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

       {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};
