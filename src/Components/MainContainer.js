import React, { useState, useEffect } from 'react';
import './MainContainer.css';
import { FiShuffle, FiUserPlus, FiEdit2, FiPlus, FiSearch, FiX, FiCheck, FiUploadCloud } from 'react-icons/fi';

export const MainContainer = ({ refreshCount, songs, onPlaySong, currentSong, isPlaying, activePlaylist, activeArtist, onUpdatePlaylist, onOpenUpload, onSongUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [editingSongId, setEditingSongId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
      key = null;
    }
    setSortConfig({ key, direction });
  };

  const getSortedSongs = (songsList) => {
    if (!sortConfig.key || !sortConfig.direction) return songsList;
    return [...songsList].sort((a, b) => {
      if (sortConfig.key === 'title') {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (titleA > titleB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Apr 9, 2019';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const startEditingSong = (song) => {
    setEditingSongId(song.id);
    setEditingTitle(song.title);
  };

  const saveSongTitle = async (songId) => {
    if (!editingTitle.trim()) {
      setEditingSongId(null);
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/songs/${songId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ title: editingTitle })
      });
      if (res.ok) {
        if (onSongUpdate) onSongUpdate();
      }
    } catch(e) {
      console.error(e);
    }
    setEditingSongId(null);
  };

  const handleSongKeyDown = (e, songId) => {
    if (e.key === 'Enter') {
      saveSongTitle(songId);
    } else if (e.key === 'Escape') {
      setEditingSongId(null);
    }
  };

  const openEditModal = () => {
    setEditName(activePlaylist.name);
    setEditDescription('');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (activePlaylist && onUpdatePlaylist) {
      onUpdatePlaylist({ ...activePlaylist, name: editName });
    }
    setIsEditModalOpen(false);
  };

  const renderHomeView = () => (
    <>
      <div className="main-header">
         <div className="main-filters">
           <button className="filter-chip active">All</button>
           <button className="filter-chip">Music</button>
           <button className="filter-chip">Podcasts</button>
         </div>
      </div>
      
      <div className="main-scroll-area">
        <section className="feed-section">
           <h2>Your Uploaded Songs</h2>
           <div className="card-grid">
              {songs.length === 0 ? (
                <p style={{color: 'var(--text-subdued)'}}>No songs uploaded yet.</p>
              ) : (
                songs.map(song => (
                  <div className="spotify-card" key={song.id}>
                     <div className="card-img-container">
                        <img 
                          src={song.cover_image_path ? `http://127.0.0.1:8000/storage/${song.cover_image_path}` : "https://misc.scdn.co/liked-songs/liked-songs-300.png"} 
                          alt={song.title} 
                        />
                        <button className="play-hover-btn" onClick={() => onPlaySong(song)}>
                          {currentSong?.id === song.id && isPlaying ? '⏸' : '▶'}
                        </button>
                     </div>
                     <div className="card-info">
                        <h4>{song.title}</h4>
                        <p>{song.artist}</p>
                     </div>
                  </div>
                ))
              )}
           </div>
        </section>
      </div>
    </>
  );

  const renderPlaylistView = () => {
    // Only the 'Work' playlist (or playlists with real backend songs) should display songs by default
    const playlistSongs = activePlaylist.name.toLowerCase() === 'work' ? songs : (activePlaylist.songs || []);
    const isEmpty = playlistSongs.length === 0;
    
    // Calculate realistic duration dynamically based on song duration
    const parseDuration = (d) => {
      if (!d) return 141;
      const p = d.split(':');
      return p.length === 2 ? parseInt(p[0]) * 60 + parseInt(p[1]) : 141;
    };
    const totalSeconds = playlistSongs.reduce((acc, song) => acc + parseDuration(song.duration), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let durationString = '';
    if (hours > 0) durationString += `${hours} hr `;
    if (minutes > 0) durationString += `${minutes} min `;
    if (hours === 0 && seconds > 0) durationString += `${seconds} sec`;
    durationString = durationString.trim();

    const randomCovers = [];
    if (playlistSongs.length > 0) {
      // Deterministic pseudo-random based on song IDs to prevent flickering
      const pseudoRandomSongs = [...playlistSongs].sort((a, b) => ((a.id * 7) % 5) - ((b.id * 7) % 5));
      for(let i = 0; i < 4; i++) {
        const song = pseudoRandomSongs[i % pseudoRandomSongs.length];
        randomCovers.push(song.cover_image_path ? `http://127.0.0.1:8000/storage/${song.cover_image_path}` : "https://misc.scdn.co/liked-songs/liked-songs-300.png");
      }
    }
    const defaultColors = ['#b00b69', '#1f1f1f', '#333', '#ff00ff'];

    return (
      <div className="playlist-detail-view">
        <div className="playlist-header">
           <div className="playlist-cover">
              {activePlaylist.name === 'Liked Songs' ? (
                <img src="https://misc.scdn.co/liked-songs/liked-songs-300.png" alt="Liked" />
              ) : activePlaylist.name.toLowerCase() === 'work' ? (
                <div className="work-playlist-cover">
                   {Array.from({ length: 4 }).map((_, i) => (
                     <div 
                       key={i}
                       style={randomCovers[i] 
                         ? { backgroundImage: `url(${randomCovers[i]})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                         : { backgroundColor: defaultColors[i] }
                       }
                     ></div>
                   ))}
                </div>
              ) : (
                <div className="playlist-placeholder-cover">
                  <svg viewBox="0 0 24 24" width="64" height="64"><path fill="currentColor" d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path></svg>
                </div>
              )}
           </div>
           <div className="playlist-header-info">
              <span className="playlist-type-label">Public Playlist</span>
              <h1 className="playlist-title" onClick={openEditModal} style={{cursor: 'pointer'}}>{activePlaylist.name}</h1>
              <div className="playlist-meta">
                 <div className="creator-avatar"></div>
                 <strong>{activePlaylist.creator}</strong> {isEmpty ? '' : `• 1 save • ${playlistSongs.length} song${playlistSongs.length === 1 ? '' : 's'}, ${durationString}`}
              </div>
           </div>
        </div>

        <div className="playlist-action-bar">
           {!isEmpty && (
             <button className="big-play-btn" onClick={() => playlistSongs.length > 0 && onPlaySong(playlistSongs[0])}>
                {currentSong?.id === playlistSongs[0]?.id && isPlaying ? (
                  <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg>
                )}
             </button>
           )}
           {!isEmpty && <button className="icon-btn action-icon"><FiShuffle size={24} /></button>}
           <button className="icon-btn action-icon" onClick={() => onOpenUpload && onOpenUpload(activePlaylist.id)} title="Upload to current playlist">
             <FiUploadCloud size={24} />
           </button>
           <button className="icon-btn action-icon"><FiUserPlus size={24} /></button>
           <button className="icon-btn action-icon">•••</button>
        </div>

        {isEmpty && (
          <div className="empty-playlist-actions">
            <button className="empty-action-btn"><FiPlus /> Add</button>
            <button className="empty-action-btn" onClick={openEditModal}><FiEdit2 /> Name & details</button>
          </div>
        )}

        <div className="playlist-songs-list">
           {isEmpty ? (
             <div className="empty-playlist-search-section">
                <div className="search-section-header">
                  <h3>Let's find something for your playlist</h3>
                  <button className="icon-btn"><FiX size={20} /></button>
                </div>
                <div className="playlist-search-box">
                  <FiSearch className="search-icon" />
                  <input type="text" placeholder="Search for songs or episodes" />
                </div>
             </div>
           ) : (
             <>
               <div className="songs-list-header">
                  <div className="col-hash">#</div>
                  <div className="col-title" onClick={() => handleSort('title')} style={{cursor: 'pointer'}}>
                     Title {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </div>
                  <div className="col-date" onClick={() => handleSort('date')} style={{cursor: 'pointer'}}>
                     Date added {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </div>
                  <div className="col-time">⏱</div>
                  <div className="col-edit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     <FiEdit2 size={14} />
                  </div>
               </div>
               {getSortedSongs(playlistSongs).map((song, idx) => (
                  <div className="song-row" key={song.id} onDoubleClick={() => onPlaySong(song)}>
                     <div className="col-hash">
                        <span className="row-number">{currentSong?.id === song.id && isPlaying ? <div className="playing-equalizer"><span/><span/><span/></div> : idx + 1}</span>
                        <button className="row-play-btn" onClick={(e) => { e.stopPropagation(); onPlaySong(song); }}>
                           {currentSong?.id === song.id && isPlaying ? '⏸' : '▶'}
                        </button>
                     </div>
                     <div className="col-title">
                        <img src={song.cover_image_path ? `http://127.0.0.1:8000/storage/${song.cover_image_path}` : "https://misc.scdn.co/liked-songs/liked-songs-300.png"} alt="cover" />
                        <div className="song-title-info" style={{width: '100%'}}>
                           {editingSongId === song.id ? (
                             <input 
                               type="text" 
                               className="song-name-input"
                               value={editingTitle}
                               onChange={e => setEditingTitle(e.target.value)}
                               onBlur={() => saveSongTitle(song.id)}
                               onKeyDown={e => handleSongKeyDown(e, song.id)}
                               autoFocus
                               onClick={e => e.stopPropagation()}
                               onDoubleClick={e => e.stopPropagation()}
                             />
                           ) : (
                             <div className="song-name" style={{color: currentSong?.id === song.id ? '#1db954' : '#fff'}}>{song.title}</div>
                           )}
                           <div className="song-artist">{song.artist}</div>
                        </div>
                     </div>
                     <div className="col-date">{formatDate(song.created_at)}</div>
                     <div className="col-time">{song.duration || '2:21'}</div>
                     <div className="col-edit">
                        <button className="row-edit-btn" onClick={(e) => { e.stopPropagation(); startEditingSong(song); }} title="Edit Song">
                           <FiEdit2 size={16} />
                        </button>
                     </div>
                  </div>
               ))}
             </>
           )}
        </div>
      </div>
    );
  };

  const renderArtistView = () => {
    if (!activeArtist) return null;
    
    // Group songs by this artist
    const artistSongs = songs.filter(s => s.artist === activeArtist);
    
    // Total duration calculation
    const parseDuration = (d) => {
      if (!d) return 141;
      const p = d.split(':');
      return p.length === 2 ? parseInt(p[0]) * 60 + parseInt(p[1]) : 141;
    };
    const totalSeconds = artistSongs.reduce((acc, song) => acc + parseDuration(song.duration), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    let durationStr = '';
    if (hours > 0) durationStr += `${hours} hr `;
    if (minutes > 0 || hours > 0) durationStr += `${minutes} min `;
    if (seconds > 0 || (hours === 0 && minutes === 0)) durationStr += `${seconds} sec`;

    const artistCover = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeArtist)}&background=random&size=232&font-size=0.33`;

    return (
      <div className="playlist-detail-view">
        <div className="playlist-header">
           <div className="playlist-cover" style={{ borderRadius: '50%', overflow: 'hidden' }}>
             <img src={artistCover} alt={activeArtist} />
           </div>
           <div>
             <span className="playlist-type-label" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <FiCheck style={{background: '#3d91f4', color: '#fff', borderRadius: '50%', padding: '2px'}}/>
                Verified Artist
             </span>
             <h1 className="playlist-title" style={{fontSize: '96px', marginBottom: '16px'}}>{activeArtist}</h1>
             <div className="playlist-meta">
                <strong>{artistSongs.length} {artistSongs.length === 1 ? 'song' : 'songs'}</strong>, {durationStr}
             </div>
           </div>
        </div>

        <div className="playlist-action-bar">
           <button className="big-play-btn" onClick={() => artistSongs.length > 0 && onPlaySong(artistSongs[0])}>
              {currentSong?.artist === activeArtist && isPlaying ? (
                <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg>
              )}
           </button>
           <button className="make-private-btn" style={{color: '#fff', borderColor: '#fff'}}>Follow</button>
        </div>

        <div className="playlist-songs-list">
           <h2 style={{color: '#fff', margin: '0 16px 16px', fontSize: '24px'}}>Popular</h2>
           <div className="songs-list-header">
              <div className="col-hash">#</div>
              <div className="col-title" onClick={() => handleSort('title')} style={{cursor: 'pointer'}}>
                 Title {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </div>
              <div className="col-date" onClick={() => handleSort('date')} style={{cursor: 'pointer'}}>
                 Date added {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </div>
              <div className="col-time">⏱</div>
              <div className="col-edit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <FiEdit2 size={14} />
              </div>
           </div>
           {getSortedSongs(artistSongs).map((song, idx) => (
              <div className="song-row" key={song.id} onDoubleClick={() => onPlaySong(song)}>
                 <div className="col-hash">
                    <span className="row-number">{currentSong?.id === song.id && isPlaying ? <div className="playing-equalizer"><span/><span/><span/></div> : idx + 1}</span>
                    <button className="row-play-btn" onClick={(e) => { e.stopPropagation(); onPlaySong(song); }}>
                       {currentSong?.id === song.id && isPlaying ? '⏸' : '▶'}
                    </button>
                 </div>
                 <div className="col-title">
                    <img src={song.cover_image_path ? `http://127.0.0.1:8000/storage/${song.cover_image_path}` : "https://misc.scdn.co/liked-songs/liked-songs-300.png"} alt="cover" />
                    <div className="song-title-info" style={{width: '100%'}}>
                       {editingSongId === song.id ? (
                         <input 
                           type="text" 
                           className="song-name-input"
                           value={editingTitle}
                           onChange={e => setEditingTitle(e.target.value)}
                           onBlur={() => saveSongTitle(song.id)}
                           onKeyDown={e => handleSongKeyDown(e, song.id)}
                           autoFocus
                           onClick={e => e.stopPropagation()}
                           onDoubleClick={e => e.stopPropagation()}
                         />
                       ) : (
                         <div className="song-name" style={{ color: currentSong?.id === song.id ? '#1db954' : 'var(--essential-base)' }}>{song.title}</div>
                       )}
                    </div>
                 </div>
                 <div className="col-date">{formatDate(song.created_at)}</div>
                 <div className="col-time">{song.duration || '2:21'}</div>
                 <div className="col-edit">
                    <button className="row-edit-btn" onClick={(e) => { e.stopPropagation(); startEditingSong(song); }} title="Edit Song">
                       <FiEdit2 size={16} />
                    </button>
                 </div>
              </div>
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="main-container panel">
      {activeArtist ? renderArtistView() : activePlaylist ? renderPlaylistView() : renderHomeView()}

      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="edit-playlist-modal" onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Edit details</h2>
              <button className="icon-btn" onClick={() => setIsEditModalOpen(false)}><FiX size={24}/></button>
            </div>
            <div className="edit-modal-body">
              <div className="edit-cover-placeholder">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path></svg>
              </div>
              <div className="edit-inputs">
                <input 
                  type="text" 
                  className="edit-name-input" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <textarea 
                  className="edit-desc-input" 
                  placeholder="Add an optional description"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="edit-modal-footer">
               <button className="make-private-btn">
                  <svg viewBox="0 0 16 16" width="16" height="16" style={{marginRight: 8}}><path fill="currentColor" d="M8 1.5a4 4 0 0 0-4 4v3H3v6h10v-6h-1v-3a4 4 0 0 0-4-4zm-2.5 4a2.5 2.5 0 0 1 5 0v3h-5v-3z"></path></svg>
                  Make private
               </button>
               <button className="save-btn" onClick={handleSaveEdit}>Save</button>
            </div>
            <p className="edit-disclaimer">By proceeding, you agree to give Stainify access to the image you choose to upload. Please make sure you have the right to upload the image.</p>
          </div>
        </div>
      )}
    </div>
  );
};
