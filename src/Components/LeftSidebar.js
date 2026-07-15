import React, { useState, useEffect } from 'react';
import './LeftSidebar.css';
import { BiLibrary } from 'react-icons/bi';
import { FiPlus, FiSearch, FiMusic, FiSliders, FiFolder, FiUsers } from 'react-icons/fi';

export const LeftSidebar = ({ playlists, songs, activeFilter, setActiveFilter, onCreatePlaylist, onSelectPlaylist, onSelectArtist, onDeletePlaylist }) => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [isResizing, setIsResizing] = useState(false);

  // New states for search and sort
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Recents');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Compute unique artists from songs
  const artists = songs ? [...new Set(songs.map(s => s.artist))] : [];

  useEffect(() => {
    const handleClickOutside = () => {
      setIsCreateMenuOpen(false);
      setContextMenu(null);
      setIsSortDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContextMenu = (e, playlist) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, playlist });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    let newWidth = e.clientX;
    if (newWidth < 280) newWidth = 280;
    if (newWidth > 600) newWidth = 600;
    document.documentElement.style.setProperty('--left-sidebar-width', `${newWidth}px`);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const getFilteredAndSortedPlaylists = () => {
    let filtered = playlists || [];
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered.sort((a, b) => {
      if (sortOption === 'Alphabetical') {
        return a.name.localeCompare(b.name);
      }
      // 'Recents' sorting (fallback to id if no created_at exists, assuming higher ID is newer)
      return b.id - a.id; 
    });
  };

  const getFilteredAndSortedArtists = () => {
    let filtered = artists || [];
    if (searchQuery) {
      filtered = filtered.filter(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered.sort((a, b) => {
      if (sortOption === 'Alphabetical') {
        return a.localeCompare(b);
      }
      return 0; // No real 'Recents' for extracted artists
    });
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
                       <span className="dropdown-icon" style={{color: '#b3b3b3'}}>
                         <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                           <path d="M15 4v8.5a4.5 4.5 0 1 1-2-3.72V6h6V4h-4z"/>
                           <path d="M4 12h4v2H4zM6 10h2v6H6z" fill="none"/>
                           <text x="3" y="10" fontSize="12" fontWeight="bold" fill="currentColor">+</text>
                         </svg>
                       </span>
                       <div className="dropdown-text">
                         <strong>Playlist</strong>
                         <span>Create a playlist with songs or episodes</span>
                       </div>
                    </button>
                    <button className="dropdown-item">
                       <span className="dropdown-icon"><FiSliders /></span>
                       <div className="dropdown-text">
                         <strong>Mixed Playlist <span className="beta-tag">Beta</span></strong>
                         <span>Mix songs with smooth transitions</span>
                       </div>
                    </button>
                    <button className="dropdown-item">
                       <span className="dropdown-icon">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="12" r="6" fill="#888" fillOpacity="0.8"/>
                            <circle cx="15" cy="12" r="6" fill="#fff" fillOpacity="0.8"/>
                         </svg>
                       </span>
                       <div className="dropdown-text">
                         <strong>Blend</strong>
                         <span>Combine your friends' tastes into a playlist</span>
                       </div>
                    </button>
                    <button className="dropdown-item">
                       <span className="dropdown-icon">
                         <FiFolder style={{color: '#1ed760'}} />
                       </span>
                       <div className="dropdown-text">
                         <strong>Folder</strong>
                         <span>Organize your playlists</span>
                       </div>
                    </button>
                    <button className="dropdown-item">
                       <span className="dropdown-icon">
                         <FiUsers />
                       </span>
                       <div className="dropdown-text">
                         <strong>Jam</strong>
                         <span>Listen together from anywhere</span>
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
        <button className={`filter-chip ${activeFilter === 'Playlists' ? 'active' : ''}`} onClick={() => setActiveFilter('Playlists')}>Playlists</button>
        <button className={`filter-chip ${activeFilter === 'Artists' ? 'active' : ''}`} onClick={() => setActiveFilter('Artists')}>Artists</button>
        <button className={`filter-chip ${activeFilter === 'Friends' ? 'active' : ''}`} onClick={() => setActiveFilter('Friends')}>Friends</button>
      </div>
      
      <div className="library-search-row">
         <div className={`search-container ${isSearchExpanded ? 'expanded' : ''}`}>
           <button className="icon-btn" onClick={() => setIsSearchExpanded(!isSearchExpanded)}>
             <FiSearch />
           </button>
           {isSearchExpanded && (
             <input 
               type="text" 
               className="library-search-input" 
               placeholder="Search in Your Library" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               autoFocus
             />
           )}
         </div>
         <div style={{position: 'relative'}}>
           <span className="sort-dropdown" onClick={(e) => { e.stopPropagation(); setIsSortDropdownOpen(!isSortDropdownOpen); }} style={{cursor: 'pointer'}}>
             {sortOption} ≡
           </span>
           {isSortDropdownOpen && (
             <div className="create-dropdown-menu" style={{top: '100%', right: 0, left: 'auto', minWidth: '150px'}} onClick={e => e.stopPropagation()}>
                <button className="dropdown-item" onClick={() => { setSortOption('Recents'); setIsSortDropdownOpen(false); }}>
                   <div className="dropdown-text">
                     <strong style={{color: sortOption === 'Recents' ? '#1db954' : '#fff'}}>Recents</strong>
                   </div>
                </button>
                <button className="dropdown-item" onClick={() => { setSortOption('Alphabetical'); setIsSortDropdownOpen(false); }}>
                   <div className="dropdown-text">
                     <strong style={{color: sortOption === 'Alphabetical' ? '#1db954' : '#fff'}}>Alphabetical</strong>
                   </div>
                </button>
             </div>
           )}
         </div>
      </div>

      <div className="library-scroll-area">
         {activeFilter === 'Playlists' && getFilteredAndSortedPlaylists().map((playlist) => (
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
                  <div className="library-item-subtitle">{playlist.type || 'Playlist'} • {playlist.creator || 'User'}</div>
               </div>
            </div>
         ))}
         {activeFilter === 'Artists' && getFilteredAndSortedArtists().map((artist, idx) => (
            <div 
              className="library-item" 
              key={idx}
              onClick={() => onSelectArtist(artist)}
            >
               <div className="library-item-img" style={{ borderRadius: '50%', overflow: 'hidden' }}>
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(artist)}&background=random&size=48`} alt={artist} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
               </div>
               <div className="library-item-info">
                  <div className="library-item-title" style={{color: 'var(--essential-base)'}}>{artist}</div>
                  <div className="library-item-subtitle">Artist</div>
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
            <li onClick={() => {
              setPlaylistToDelete(contextMenu.playlist);
              setContextMenu(null);
            }}>Delete</li>
            <li>Download</li>
            <li className="separator"></li>
            <li>Create playlist</li>
            <li>Create folder</li>
            <li className="separator"></li>
            <li>Share</li>
          </ul>
        </div>
      )}

      {playlistToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', 
          alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setPlaylistToDelete(null)}>
          <div style={{
            background: '#282828', padding: '30px', borderRadius: '8px', 
            width: '400px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{marginTop: 0, fontSize: '24px', color: '#fff'}}>Delete Playlist?</h3>
            <p style={{color: '#b3b3b3', margin: '20px 0 30px'}}>
              Are you sure you want to delete <strong>{playlistToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px'}}>
              <button onClick={() => setPlaylistToDelete(null)} style={{
                background: 'transparent', color: '#fff', border: 'none', 
                fontWeight: 'bold', cursor: 'pointer', padding: '12px 24px'
              }}>Cancel</button>
              <button onClick={() => {
                onDeletePlaylist(playlistToDelete.id);
                setPlaylistToDelete(null);
              }} style={{
                background: '#1ed760', color: '#000', border: 'none', borderRadius: '500px',
                fontWeight: 'bold', cursor: 'pointer', padding: '12px 24px'
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <div 
        className={`sidebar-resizer ${isResizing ? 'is-resizing' : ''}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
