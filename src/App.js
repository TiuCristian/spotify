import React, { useState } from 'react';
import './App.css';
import { TopBar } from './Components/TopBar';
import { LeftSidebar } from './Components/LeftSidebar';
import { MainContainer } from './Components/MainContainer';
import { Playbar } from './Components/Playbar';
import { UploadModal } from './Components/UploadModal';

function App() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState([
    { id: 1, name: 'Work', type: 'Playlist', creator: 'Tiu Cristi' },
    { id: 2, name: 'Liked Songs', type: 'Playlist', creator: 'Tiu Cristi' }
  ]);
  const [activePlaylist, setActivePlaylist] = useState(null);

  const handleUploadSuccess = () => {
    setRefreshCount(prev => prev + 1);
  };

  const handleCreatePlaylist = () => {
    const newPlaylist = {
      id: playlists.length + 1,
      name: `My Playlist #${playlists.length + 1}`,
      type: 'Playlist',
      creator: 'You'
    };
    setPlaylists([newPlaylist, ...playlists]);
  };

  const handleUpdatePlaylist = (updatedPlaylist) => {
    setPlaylists(playlists.map(p => p.id === updatedPlaylist.id ? updatedPlaylist : p));
    setActivePlaylist(updatedPlaylist);
  };

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div className="App">
      <TopBar onOpenUpload={() => setIsUploadOpen(true)} />
      <LeftSidebar 
        playlists={playlists} 
        onCreatePlaylist={handleCreatePlaylist} 
        onSelectPlaylist={setActivePlaylist} 
      />
      <MainContainer 
        refreshCount={refreshCount} 
        onPlaySong={handlePlaySong} 
        currentSong={currentSong} 
        isPlaying={isPlaying} 
        activePlaylist={activePlaylist}
        onUpdatePlaylist={handleUpdatePlaylist}
      />
      <Playbar 
        currentSong={currentSong} 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying} 
      />
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadSuccess={handleUploadSuccess} 
      />
    </div>
  );
}

export default App;
