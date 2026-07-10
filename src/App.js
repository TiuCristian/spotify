import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { TopBar } from './Components/TopBar';
import { LeftSidebar } from './Components/LeftSidebar';
import { MainContainer } from './Components/MainContainer';
import { Playbar } from './Components/Playbar';
import { UploadModal } from './Components/UploadModal';
import { Login } from './Components/Login';
import { Register } from './Components/Register';

function SpotifyApp() {
  const location = useLocation();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('spotify_user')));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const loginName = params.get('login_name');
    const loginEmail = params.get('login_email');
    if (loginName && loginEmail) {
      const newUser = { name: loginName, email: loginEmail };
      localStorage.setItem('spotify_user', JSON.stringify(newUser));
      setUser(newUser);
      window.history.replaceState({}, document.title, "/");
    }
  }, [location]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [activeArtist, setActiveArtist] = useState(null);

  const handleUploadSuccess = () => {
    setRefreshCount(prev => prev + 1);
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/songs')
      .then(res => res.json())
      .then(data => {
        setSongs(data);
      })
      .catch(err => console.error("Failed to fetch songs", err));
  }, [refreshCount]);

  // Fetch playlists on load
  useEffect(() => {
    if (user && user.email) {
      fetch(`http://localhost:8000/api/playlists?email=${encodeURIComponent(user.email)}`, {
        headers: { 'Accept': 'application/json' }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPlaylists(data);
      })
      .catch(console.error);
    } else {
      setPlaylists([]);
    }
  }, [user]);

  const handleCreatePlaylist = async () => {
    if (!user || !user.email) return;
    const playlistName = `My Playlist #${playlists.length + 1}`;
    try {
      const response = await fetch('http://localhost:8000/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: user.email, name: playlistName })
      });
      if (response.ok) {
        const newPlaylist = await response.json();
        setPlaylists([newPlaylist, ...playlists]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePlaylist = async (updatedPlaylist) => {
    // Optimistic UI update
    setPlaylists(playlists.map(p => p.id === updatedPlaylist.id ? updatedPlaylist : p));
    setActivePlaylist(updatedPlaylist);

    try {
      await fetch(`http://localhost:8000/api/playlists/${updatedPlaylist.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name: updatedPlaylist.name })
      });
    } catch (err) {
      console.error('Failed to update playlist in DB:', err);
    }
  };

  const handleDeletePlaylist = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/playlists/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setPlaylists(playlists.filter(p => p.id !== id));
        if (activePlaylist && activePlaylist.id === id) {
          setActivePlaylist(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaySong = (song) => {
    if (currentSong && currentSong.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <div className="App">
      <TopBar onOpenUpload={() => setIsUploadOpen(true)} user={user} />
      <LeftSidebar 
        playlists={playlists} 
        songs={songs}
        onCreatePlaylist={handleCreatePlaylist} 
        onSelectPlaylist={(p) => { setActivePlaylist(p); setActiveArtist(null); }} 
        onSelectArtist={(a) => { setActiveArtist(a); setActivePlaylist(null); }}
        onDeletePlaylist={handleDeletePlaylist}
      />
      <MainContainer 
        refreshCount={refreshCount} 
        songs={songs}
        onPlaySong={handlePlaySong} 
        currentSong={currentSong} 
        isPlaying={isPlaying} 
        activePlaylist={activePlaylist}
        activeArtist={activeArtist}
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<SpotifyApp />} />
      </Routes>
    </Router>
  );
}

export default App;
