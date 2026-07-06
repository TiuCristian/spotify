import React, { useState } from 'react';
import './UploadModal.css';

export const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile || !title || !artist) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('audio_file', audioFile);
    if (coverImage) {
      formData.append('cover_image', coverImage);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/songs', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        onUploadSuccess();
        onClose();
        setTitle('');
        setArtist('');
        setAudioFile(null);
        setCoverImage(null);
      } else {
        console.error('Failed to upload song');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Upload a new song</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Artist</label>
            <input type="text" value={artist} onChange={e => setArtist(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Audio File (MP3/WAV)</label>
            <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} required />
          </div>
          <div className="form-group">
            <label>Cover Image (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files[0])} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Song'}
          </button>
        </form>
      </div>
    </div>
  );
};
