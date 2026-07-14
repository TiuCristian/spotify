import React, { useState } from 'react';
import './UploadModal.css';

export const UploadModal = ({ isOpen, onClose, onUploadSuccess, playlistId, user }) => {
  const [artist, setArtist] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const newSelectedFiles = [];

    files.forEach((file) => {
      let title = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      let parsedArtist = '';
      if (title.includes(' - ')) {
        const parts = title.split(' - ');
        parsedArtist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }
      
      const audioObj = { file, title, artist: parsedArtist, duration: null };
      
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        audioObj.duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        // Trigger re-render by replacing array if we want, but since it's just duration it's fine
      };
      
      newSelectedFiles.push(audioObj);
    });

    setSelectedFiles(newSelectedFiles);
  };

  const handleTitleChange = (index, newTitle) => {
    const updated = [...selectedFiles];
    updated[index].title = newTitle;
    setSelectedFiles(updated);
  };

  const handleArtistChange = (index, newArtist) => {
    const updated = [...selectedFiles];
    updated[index].artist = newArtist;
    setSelectedFiles(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setLoading(true);
    setProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const item = selectedFiles[i];
      const formData = new FormData();
      formData.append('title', item.title);
      formData.append('artist', item.artist || artist || 'Unknown Artist');
      formData.append('audio_file', item.file);
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }
      if (item.duration) {
        formData.append('duration', item.duration);
      }
      if (playlistId) {
        formData.append('playlist_id', playlistId);
      }
      if (user && user.email) {
        formData.append('email', user.email);
      }

      try {
        await fetch('http://127.0.0.1:8000/api/songs', {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        console.error(err);
      }
      setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
    }

    setLoading(false);
    onUploadSuccess();
    onClose();
    setArtist('');
    setSelectedFiles([]);
    setCoverImage(null);
    setProgress(0);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{maxWidth: '600px'}}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Upload {selectedFiles.length > 1 ? 'Songs' : 'a new song'}</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Audio Files (MP3/WAV)</label>
            <input type="file" accept="audio/*" multiple onChange={handleFilesChange} required />
          </div>

          {selectedFiles.length > 0 && (
            <div className="scanned-files-list" style={{background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '4px', marginBottom: '15px', maxHeight: '250px', overflowY: 'auto'}}>
              <h4 style={{margin: '0 0 10px 0', fontSize: '12px', color: '#b3b3b3'}}>SCANNED FILES ({selectedFiles.length})</h4>
              {selectedFiles.map((item, idx) => (
                <div key={idx} style={{display: 'flex', gap: '10px', marginBottom: '8px'}}>
                  <input 
                    type="text" 
                    value={item.artist} 
                    placeholder="Artist"
                    onChange={e => handleArtistChange(idx, e.target.value)}
                    style={{flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff', padding: '4px 8px', borderRadius: '4px'}}
                  />
                  <input 
                    type="text" 
                    value={item.title} 
                    placeholder="Title"
                    onChange={e => handleTitleChange(idx, e.target.value)}
                    style={{flex: 2, background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff', padding: '4px 8px', borderRadius: '4px'}}
                  />
                  <span style={{color: '#b3b3b3', fontSize: '12px', display: 'flex', alignItems: 'center', width: '35px'}}>{item.duration || '...'}</span>
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label>Global Artist Fallback (Optional)</label>
            <input type="text" value={artist} onChange={e => setArtist(e.target.value)} placeholder="Applied to songs missing an artist" />
          </div>

          <div className="form-group">
            <label>Cover Image (Optional, applied to all)</label>
            <input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files[0])} />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading || selectedFiles.length === 0}>
            {loading ? `Uploading... ${progress}%` : `Upload ${selectedFiles.length > 1 ? selectedFiles.length + ' Songs' : 'Song'}`}
          </button>
        </form>
      </div>
    </div>
  );
};
