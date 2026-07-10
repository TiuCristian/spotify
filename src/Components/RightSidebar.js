import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiX } from 'react-icons/fi';
import './RightSidebar.css';

export const RightSidebar = ({ user, currentSong }) => {
  const [socialData, setSocialData] = useState({
    suggestions: [],
    pendingRequests: [],
    friends: []
  });

  const fetchSocialData = async () => {
    if (!user || !user.email) return;
    try {
      const res = await fetch(`http://localhost:8000/api/social?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setSocialData(data);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchSocialData();
    // Poll every 10 seconds for friend activity updates
    const interval = setInterval(fetchSocialData, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleFollow = async (targetId) => {
    await fetch('http://localhost:8000/api/social/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, target_id: targetId })
    });
    fetchSocialData();
  };

  const handleAccept = async (followerId) => {
    await fetch('http://localhost:8000/api/social/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, follower_id: followerId })
    });
    fetchSocialData();
  };

  const handleDecline = async (followerId) => {
    await fetch('http://localhost:8000/api/social/decline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, follower_id: followerId })
    });
    fetchSocialData();
  };

  if (!user) return <div className="right-sidebar empty-sidebar"></div>;

  return (
    <div className="right-sidebar">
      <div className="friend-activity-header">
        <h4>Friend Activity</h4>
        <FiUserPlus size={18} />
      </div>
      
      <div className="friend-activity-content">
        {socialData.pendingRequests.length > 0 && (
          <div className="social-section">
            <h5>Pending Requests</h5>
            {socialData.pendingRequests.map(req => (
              <div className="social-row" key={req.id}>
                <div className="social-avatar">
                   <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.name)}&background=random&size=32`} alt="avatar" />
                </div>
                <div className="social-info">
                  <div className="social-name">{req.name}</div>
                  <div className="social-actions">
                    <button className="accept-btn" onClick={() => handleAccept(req.id)}>Accept</button>
                    <button className="decline-btn" onClick={() => handleDecline(req.id)}>Decline</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="social-section">
          {socialData.friends.length === 0 ? (
            <div className="empty-friends">
               <p>Let friends and followers on Spotify see what you're listening to.</p>
            </div>
          ) : (
            socialData.friends.map(friend => (
              <div className="friend-row" key={friend.id}>
                <div className="social-avatar">
                   <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=random&size=40`} alt="avatar" />
                   {friend.is_online ? <div className="online-dot"></div> : null}
                </div>
                <div className="social-info">
                  <div className="friend-name">{friend.name}</div>
                  <div className="friend-song">
                     {friend.current_song ? (
                        <>
                           <span>{friend.current_song.title}</span> • <span>{friend.current_song.artist}</span>
                        </>
                     ) : (
                        <span>Nothing playing</span>
                     )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {socialData.suggestions.length > 0 && (
          <div className="social-section suggestions-section">
            <h5>Find friends</h5>
            {socialData.suggestions.map(sug => (
              <div className="social-row" key={sug.id}>
                <div className="social-avatar">
                   <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(sug.name)}&background=random&size=32`} alt="avatar" />
                </div>
                <div className="social-info">
                  <div className="social-name">{sug.name}</div>
                </div>
                <button className="follow-btn" onClick={() => handleFollow(sug.id)}>
                   <FiUserPlus />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
