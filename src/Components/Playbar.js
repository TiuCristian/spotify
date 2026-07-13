import React, { useState, useEffect, useRef } from 'react';
import './Playbar.css';
import { FiPlayCircle, FiPauseCircle, FiSkipBack, FiSkipForward, FiRepeat, FiShuffle, FiMic, FiMonitor, FiVolume2, FiMaximize2 } from 'react-icons/fi';
import { BiLayer } from 'react-icons/bi';

export const Playbar = ({ currentSong, isPlaying, setIsPlaying, onNext, onPrev }) => {
  const audioRef = useRef(new Audio());
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = `http://127.0.0.1:8000/storage/${currentSong.audio_file_path}`;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong, setIsPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => {
      const current = audio.currentTime;
      const total = audio.duration || 0;
      setProgress((current / total) * 100);
      setCurrentTime(formatTime(current));
    };

    const updateDuration = () => {
      setDuration(formatTime(audio.duration));
    };

    const onEnded = () => {
      if (isRepeat) {
         audio.currentTime = 0;
         audio.play();
      } else {
         if (onNext) onNext(isShuffle);
         else setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [setIsPlaying, isRepeat, isShuffle, onNext]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    if (!currentSong) return;
    const bar = e.currentTarget;
    const clickX = e.clientX - bar.getBoundingClientRect().left;
    const newProgress = (clickX / bar.offsetWidth) * 100;
    audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
  };

  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const handleMouseMove = (e) => {
    if (!currentSong) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const hoverPercent = Math.max(0, Math.min(1, hoverX / bar.offsetWidth));
    const time = hoverPercent * (audioRef.current.duration || 0);
    
    setHoverPosition(hoverX);
    setHoverTime(formatTime(time));
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  const handleVolumeClick = (e) => {
    const bar = e.currentTarget;
    const clickX = e.clientX - bar.getBoundingClientRect().left;
    const newVolume = Math.max(0, Math.min(1, clickX / bar.offsetWidth));
    setVolume(newVolume);
  };

  return (
    <div className="playbar">
      <div className="now-playing">
        {currentSong ? (
          <>
            <img 
              className="now-playing-img" 
              src={currentSong.cover_image_path ? `http://127.0.0.1:8000/storage/${currentSong.cover_image_path}` : "https://misc.scdn.co/liked-songs/liked-songs-300.png"} 
              alt={currentSong.title} 
              style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }}
            />
            <div className="now-playing-info">
              <div className="title">{currentSong.title}</div>
              <div className="artist">{currentSong.artist}</div>
            </div>
            <button className="like-btn">♡</button>
          </>
        ) : (
          <div className="now-playing-info">
             <div className="title" style={{color: 'var(--text-subdued)'}}>Select a song to play</div>
          </div>
        )}
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button className="control-btn" style={{color: isShuffle ? 'var(--text-bright-accent)' : ''}} onClick={() => setIsShuffle(!isShuffle)}>
            <FiShuffle />
            <span className="tooltip">{isShuffle ? 'Disable shuffle' : 'Enable shuffle'}</span>
          </button>
          <button className="control-btn" onClick={() => onPrev && onPrev()}>
            <FiSkipBack className="fill-icon" />
            <span className="tooltip">Previous</span>
          </button>
          <button className="control-btn play-btn" onClick={togglePlay}>
            {isPlaying ? (
               <svg viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
            ) : (
               <svg viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
            )}
            <span className="tooltip">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button className="control-btn" onClick={() => onNext && onNext(isShuffle)}>
            <FiSkipForward className="fill-icon" />
            <span className="tooltip">Next</span>
          </button>
          <button className="control-btn" style={{color: isRepeat ? 'var(--text-bright-accent)' : ''}} onClick={() => setIsRepeat(!isRepeat)}>
            <FiRepeat />
            <span className="tooltip">{isRepeat ? 'Disable repeat' : 'Enable repeat'}</span>
          </button>
        </div>
        <div className="playback-bar">
          <span className="time">{currentTime}</span>
          <div 
            className="progress-bar" 
            onClick={handleProgressClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {hoverTime && (
              <div className="hover-tooltip" style={{ left: hoverPosition }}>
                {hoverTime}
              </div>
            )}
            <div className="progress-bar-fill" style={{width: `${progress || 0}%`}}>
               <div className="progress-bar-thumb"></div>
            </div>
          </div>
          <span className="time">{duration}</span>
        </div>
      </div>

      <div className="extra-controls">
         <button className="control-btn"><FiMic /></button>
         <button className="control-btn"><BiLayer /></button>
         <button className="control-btn"><FiMonitor /></button>
         <div className="volume-control">
            <button className="control-btn" onClick={() => setVolume(volume === 0 ? 0.7 : 0)}>
               <FiVolume2 />
            </button>
            <div className="progress-bar volume-bar" onClick={handleVolumeClick}>
               <div className="progress-bar-fill" style={{width: `${volume * 100}%`}}>
                  <div className="progress-bar-thumb"></div>
               </div>
            </div>
         </div>
         <button className="control-btn"><FiMaximize2 /></button>
      </div>
    </div>
  );
};
