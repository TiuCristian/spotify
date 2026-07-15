import React, { useState, useEffect, useRef } from 'react';
import './Playbar.css';
import { FiPlayCircle, FiPauseCircle, FiSkipBack, FiSkipForward, FiRepeat, FiShuffle, FiMic, FiMonitor, FiVolume2, FiMaximize2 } from 'react-icons/fi';
import { BiLayer } from 'react-icons/bi';

export const Playbar = ({ currentSong, isPlaying, setIsPlaying, onNext, onPrev }) => {
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const filtersRef = useRef([]);
  const monoGainRef = useRef(null);
  const volumeGainRef = useRef(null);
  const compressorRef = useRef(null);

  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";
    audioRef.current.crossOrigin = "anonymous";
    
    // Initialize Web Audio API graph immediately to avoid latency on first play
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      
      const source = ctx.createMediaElementSource(audioRef.current);
      
      const frequencies = [60, 150, 400, 1000, 2400, 15000];
      const filters = frequencies.map(freq => {
        const filter = ctx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1;
        filter.gain.value = 0;
        return filter;
      });
      filtersRef.current = filters;

      const monoGain = ctx.createGain();
      monoGainRef.current = monoGain;

      const volumeGain = ctx.createGain();
      volumeGainRef.current = volumeGain;

      const compressor = ctx.createDynamicsCompressor();
      compressorRef.current = compressor;

      let prevNode = source;
      filters.forEach(filter => {
        prevNode.connect(filter);
        prevNode = filter;
      });
      
      prevNode.connect(monoGain);
      monoGain.connect(volumeGain);
      volumeGain.connect(compressor);
      compressor.connect(ctx.destination);
    } catch (e) {
      console.error("Audio Context Init Error:", e);
    }
  }
  const isDraggingRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('spotifySettings');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const handleSettingsChange = (e) => setSettings(e.detail);
    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, []);

  // Ensure AudioContext is resumed if suspended
  const resumeAudioContext = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      resumeAudioContext();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioCtxRef.current || !settings) return;
    if (settings.equalizer && settings.eqBands) {
      filtersRef.current.forEach((filter, idx) => {
        filter.gain.setTargetAtTime(settings.eqBands[idx], audioCtxRef.current.currentTime, 0.1);
      });
    } else {
      filtersRef.current.forEach((filter) => {
        filter.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
      });
    }

    if (monoGainRef.current) {
      if (settings.monoAudio) {
        monoGainRef.current.channelCount = 1;
        monoGainRef.current.channelCountMode = "explicit";
      } else {
        monoGainRef.current.channelCount = 2;
        monoGainRef.current.channelCountMode = "max";
      }
    }

    if (volumeGainRef.current) {
      let v = 1.0;
      if (settings.volumeLevel === 'Loud') v = 1.5;
      else if (settings.volumeLevel === 'Quiet') v = 0.5;
      volumeGainRef.current.gain.setTargetAtTime(v, audioCtxRef.current.currentTime, 0.1);
    }

    if (compressorRef.current) {
      if (settings.normalizeVolume) {
        compressorRef.current.threshold.setTargetAtTime(-24, audioCtxRef.current.currentTime, 0.1);
        compressorRef.current.ratio.setTargetAtTime(12, audioCtxRef.current.currentTime, 0.1);
      } else {
        compressorRef.current.threshold.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
        compressorRef.current.ratio.setTargetAtTime(1, audioCtxRef.current.currentTime, 0.1);
      }
    }
  }, [settings]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (currentSong) {
      resumeAudioContext();
      
      // Fetch the audio file completely to avoid locking the single-threaded PHP server
      fetch(`http://127.0.0.1:8000/api/audio/${currentSong.audio_file_path}`)
        .then(response => response.blob())
        .then(blob => {
          const objectUrl = URL.createObjectURL(blob);
          audioRef.current.src = objectUrl;
          audioRef.current.play().catch(e => console.error("Play error:", e));
          setIsPlaying(true);
        })
        .catch(e => console.error("Fetch audio error:", e));
      
      const userStr = localStorage.getItem('spotify_user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          fetch('http://localhost:8000/api/social/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userObj.email, song_id: currentSong.id })
          }).catch(err => console.error("Social status error", err));
        } catch(e) {}
      }
    }
  }, [currentSong, setIsPlaying]);

  useEffect(() => {
    if (isPlaying) {
      resumeAudioContext();
      if (audioRef.current.paused) {
        audioRef.current.play().catch(e => console.error("Play error:", e));
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => {
      if (!isDraggingRef.current) {
        const current = audio.currentTime;
        const total = audio.duration || 0;
        setProgress((current / total) * 100);
        setCurrentTime(formatTime(current));
      }
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

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        // Optional nudge to ensure it plays if it got stuck
        if (isPlaying && audioRef.current.paused) {
          audioRef.current.play().catch(e => console.error(e));
        }
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isPlaying]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (!currentSong) return;
    
    resumeAudioContext();
    
    // Execute synchronously to bypass React render delay
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Play error:", e));
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    if (!currentSong) return;
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current.duration) {
      setCurrentTime(formatTime((newProgress / 100) * audioRef.current.duration));
    }
  };

  const handleProgressDragEnd = (e) => {
    if (!currentSong) return;
    isDraggingRef.current = false;
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      // Explicitly call play to resume if the browser stalled during the seek
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Play error:", e));
      }
    }
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

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
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
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="0.1" 
              value={progress || 0}
              onMouseDown={() => { isDraggingRef.current = true; }}
              onTouchStart={() => { isDraggingRef.current = true; }}
              onChange={handleProgressChange}
              onMouseUp={handleProgressDragEnd}
              onTouchEnd={handleProgressDragEnd}
              className="range-slider"
            />
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
         <div className="volume-control">
            <button className="control-btn" onClick={() => setVolume(volume === 0 ? 0.7 : 0)}>
               <FiVolume2 />
            </button>
            <div className="progress-bar volume-bar">
               <input 
                 type="range" 
                 min="0" 
                 max="1" 
                 step="0.01" 
                 value={volume} 
                 onChange={handleVolumeChange} 
                 className="range-slider"
               />
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
