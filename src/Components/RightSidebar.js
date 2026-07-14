import React, { useState, useEffect, useRef } from 'react';
import { FiUserPlus, FiX, FiMessageSquare, FiSend, FiSmile } from 'react-icons/fi';
import './RightSidebar.css';

export const RightSidebar = ({ user, currentSong, activeChatUser, setActiveChatUser }) => {
  const [socialData, setSocialData] = useState({
    suggestions: [],
    pendingRequests: [],
    friends: []
  });

  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const chatEndRef = useRef(null);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const linkify = (text) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'underline', fontWeight: 'bold'}}>{part}</a>;
      }
      return part;
    });
  };

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

  const openChat = (friend) => {
    setActiveChatUser(friend);
    fetchMessages(friend.id);
  };

  const fetchMessages = async (targetId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/chat/messages?email=${encodeURIComponent(user.email)}&target_id=${targetId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (e) {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;
    const msgText = newMessage;
    setNewMessage('');
    setShowEmojis(false);
    
    // Optimistic UI update
    // We don't have user.id in `user` object usually, but the backend will resolve it. 
    // We'll fake a sender_id here by making it definitely NOT the targetId
    setChatMessages(prev => [...prev, { id: Date.now(), sender_id: 'me', message: msgText }]);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    await fetch('http://localhost:8000/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, target_id: activeChatUser.id, message: msgText })
    });
    fetchMessages(activeChatUser.id);
  };

  useEffect(() => {
    let chatInterval;
    if (activeChatUser) {
      fetchMessages(activeChatUser.id);
      chatInterval = setInterval(() => {
        fetchMessages(activeChatUser.id);
      }, 3000);
    }
    return () => clearInterval(chatInterval);
  }, [activeChatUser]);

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
    <div className="right-sidebar" style={{position: 'relative'}}>
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
               <p>Let friends and followers on Stainify see what you're listening to.</p>
            </div>
          ) : (
            socialData.friends.map(friend => (
              <div className="friend-row" key={friend.id}>
                <div className="social-avatar">
                   <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=random&size=40`} alt="avatar" />
                   {friend.is_online ? <div className="online-dot"></div> : null}
                </div>
                <div className="social-info" style={{position: 'relative'}}>
                  <div className="friend-name" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    {friend.name}
                    <button className="chat-btn" onClick={() => openChat(friend)} title="Chat">
                      <FiMessageSquare size={16} />
                    </button>
                  </div>
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

      {activeChatUser && (
        <div className="chat-box">
          <div className="chat-header">
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span>{activeChatUser.name}</span>
              {(() => {
                 const friendData = socialData.friends.find(f => f.id == activeChatUser.id);
                 const currentSong = friendData?.current_song || activeChatUser.current_song;
                 if (currentSong) {
                   return <span style={{fontSize: '11px', color: '#1db954', fontWeight: 'normal'}}>Listening to: {currentSong.title}</span>;
                 }
                 return <span style={{fontSize: '11px', color: '#b3b3b3', fontWeight: 'normal'}}>Nothing playing</span>;
              })()}
            </div>
            <button onClick={() => setActiveChatUser(null)}><FiX size={20} /></button>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, index) => {
               const isMe = msg.sender_id !== activeChatUser.id;
               const lastMeIndex = chatMessages.length - 1 - [...chatMessages].reverse().findIndex(m => m.sender_id !== activeChatUser.id);
               const isLastMe = isMe && lastMeIndex === index;
               return (
                 <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                   <div className={`chat-bubble ${isMe ? 'me' : 'them'}`}>
                     {linkify(msg.message)}
                   </div>
                   {isLastMe && msg.is_read ? (
                     <div style={{fontSize: '10px', color: '#b3b3b3', marginTop: '2px', marginRight: '5px'}}>
                       Seen {formatTime(msg.updated_at)}
                     </div>
                   ) : null}
                 </div>
               );
            })}
            <div ref={chatEndRef} />
          </div>
          <form className="chat-input-area" onSubmit={sendMessage}>
             <button type="button" className="emoji-btn" onClick={() => setShowEmojis(!showEmojis)}>
               <FiSmile size={20} />
             </button>
             {showEmojis && (
               <div className="emoji-picker">
                 {['😀','😂','😍','🔥','👍','🎉','🎶','🎵','❤️','😭','😎','🙏'].map(emoji => (
                   <span key={emoji} onClick={() => setNewMessage(prev => prev + emoji)}>{emoji}</span>
                 ))}
               </div>
             )}
             <input 
               type="text" 
               placeholder="Message..." 
               value={newMessage}
               onChange={e => setNewMessage(e.target.value)}
             />
             <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
               <FiSend size={18} />
             </button>
          </form>
        </div>
      )}
    </div>
  );
};
