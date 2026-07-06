import React, { useState, useEffect } from 'react';
import './LeftSidebar.css';
import { BiLibrary } from 'react-icons/bi';
import { FiPlus, FiSearch } from 'react-icons/fi';

export const LeftSidebar = ({ playlists, onCreatePlaylist, onSelectPlaylist }) => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsCreateMenuOpen(false);
      setContextMenu(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContextMenu = (e, playlist) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, playlist });
  };

  return (
    <div className="left-sidebar panel">
      <div className="library-header">
         <button className="library-btn">
            <BiLibrary className="library-icon"/>
            <span>Your Library</span>
         </button>
         <div className="library-actions">
            <div className="create-container">
               <button className="create-btn" onClick={(e) => { e.stopPropagation(); setIsCreateMenuOpen(!isCreateMenuOpen); }}>
                  <FiPlus className="plus-icon" />
                  <span>Create</span>
               </button>
               {!isCreateMenuOpen && <div className="create-tooltip">Create a playlist, folder, or Jam</div>}
               {isCreateMenuOpen && (
                 <div className="create-dropdown-menu" onClick={e => e.stopPropagation()}>
                    <button className="dropdown-item" onClick={() => { onCreatePlaylist(); setIsCreateMenuOpen(false); }}>
                       <span className="dropdown-icon">🎵</span>
                       <div className="dropdown-text">
                         <strong>Playlist</strong>
                         <span>Create a playlist with songs or episodes</span>
                       </div>
                    </button>
                    <button className="dropdown-item">
                       <span className="dropdown-icon">🎛️</span>
                       <div className="dropdown-text">
                         <strong>Mixed Playlist <span className="beta-tag">Beta</span></strong>
                         <span>Mix songs with smooth transitions</span>
                       </div>
                    </button>
                    <button className="dropdown-item">
                       <span className="dropdown-icon">⭕</span>
                       <div className="dropdown-text">
                         <strong>Blend</strong>
                         <span>Combine your friends' tastes into a playlist</span>
                       </div>
                    </button>
                    <button className="dropdown-item">
                       <span className="dropdown-icon">📁</span>
                       <div className="dropdown-text">
                         <strong>Folder</strong>
                         <span>Organize your playlists</span>
                       </div>
                    </button>
                 </div>
               )}
            </div>
            <button className="icon-btn expand-btn">
               <svg viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M11 2v1.5h2.44L9.5 7.44l1.06 1.06L14.5 4.56V7H16V2h-5zM5 14v-1.5H2.56l3.94-3.94-1.06-1.06L1.5 11.44V9H0v5h5z"></path></svg>
            </button>
         </div>
      </div>
      
      <div className="library-filters">
        <button className="filter-chip">Playlists</button>
        <button className="filter-chip">Albums</button>
        <button className="filter-chip">Artists</button>
      </div>
      
      <div className="library-search-row">
         <button className="icon-btn"><FiSearch /></button>
         <span className="sort-dropdown">Recents ≡</span>
      </div>

      <div className="library-scroll-area">
         {playlists && playlists.map((playlist) => (
            <div 
              className="library-item" 
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist)}
              onContextMenu={(e) => handleContextMenu(e, playlist)}
            >
               <div className="library-item-img">
                 {playlist.name === 'Liked Songs' ? (
                   <img src="https://misc.scdn.co/liked-songs/liked-songs-300.png" alt="Liked Songs" />
                 ) : (
                   <div className="playlist-placeholder">🎵</div>
                 )}
               </div>
               <div className="library-item-info">
                  <div className="library-item-title" style={{color: playlist.name === 'Work' ? '#1db954' : 'var(--essential-base)'}}>{playlist.name}</div>
                  <div className="library-item-subtitle">{playlist.type} • {playlist.creator}</div>
               </div>
            </div>
         ))}
      </div>

      {contextMenu && (
        <div 
          className="spotify-context-menu" 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <ul>
            <li>Add to queue</li>
            <li>Start a Jam</li>
            <li className="separator"></li>
            <li>Edit details</li>
            <li>Delete</li>
            <li>Download</li>
            <li className="separator"></li>
            <li>Create playlist</li>
            <li>Create folder</li>
            <li className="separator"></li>
            <li>Share</li>
          </ul>
        </div>
      )}
    </div>
  );
};
