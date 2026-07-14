import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

const defaultSettings = {
  language: 'English (English)',
  explicit: true,
  autoplay: true,
  streamingQuality: 'Automatic',
  downloadQuality: 'High',
  autoAdjustQuality: true,
  crossfade: false,
  automix: true,
  smartShuffle: true,
  normalizeVolume: true,
  volumeLevel: 'Normal',
  monoAudio: false,
  equalizer: false,
  eqPreset: 'Flat',
  eqBands: [0, 0, 0, 0, 0, 0] // 60, 150, 400, 1000, 2400, 15000
};

const presets = {
  Flat: [0, 0, 0, 0, 0, 0],
  Acoustic: [3, 2, 1, 0, 1, 2],
  'Bass booster': [6, 4, 0, 0, -1, -2],
  'Bass reducer': [-6, -4, 0, 0, 1, 2],
  Classical: [2, 1, 0, -1, 1, 2],
  Dance: [4, 2, 0, -1, 2, 3],
  Deep: [3, 2, -1, 1, 2, -1],
  Electronic: [3, 1, -1, 1, -1, 2],
  HipHop: [4, 3, 0, -1, 1, 2],
  Jazz: [2, 1, -1, 1, -1, 2],
  Latin: [3, 1, 0, 0, -1, 2],
  Loudness: [5, 3, 0, 0, 1, 3],
  Lounge: [-2, -1, 1, 2, -1, -2],
  Piano: [1, 0, -1, 2, 1, 0],
  Pop: [1, 2, 3, 1, -1, -1]
};

export const SettingsModal = ({ onClose }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('spotifySettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('spotifySettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('settingsChanged', { detail: settings }));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateEqBand = (index, value) => {
    const newBands = [...settings.eqBands];
    newBands[index] = value;
    setSettings(prev => ({ ...prev, eqBands: newBands, eqPreset: 'Custom' }));
  };

  const handlePresetChange = (presetName) => {
    if (presets[presetName]) {
      setSettings(prev => ({ ...prev, eqPreset: presetName, eqBands: presets[presetName] }));
    } else {
      setSettings(prev => ({ ...prev, eqPreset: presetName }));
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h1>Settings</h1>
        </div>

        <div className="settings-content">
          <section>
            <h2>Account</h2>
            <div className="setting-row">
              <div className="setting-info">
                <span>Edit login methods</span>
              </div>
              <button className="settings-outline-btn">Edit <svg viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M1 2.75A.75.75 0 0 1 1.75 2H7v1.5H2.5v11h10V9.5H14v5.75a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75V2.75zm12.955 1.545a.25.25 0 0 0-.25-.25H8.5V2.5h5.5A1.5 1.5 0 0 1 15.5 4v5.5h-1.5V4.295zM10.47 7.03l-5.47 5.47-1.06-1.06 5.47-5.47H5V4.5h6.5v6.5h-1.5V7.03z"></path></svg></button>
            </div>
          </section>

          <section>
            <h2>Language</h2>
            <div className="setting-row">
              <div className="setting-info">
                <span>Choose language - Changes will be applied after restarting the app</span>
              </div>
              <select 
                className="settings-select" 
                value={settings.language} 
                onChange={e => updateSetting('language', e.target.value)}
              >
                <option>English (English)</option>
                <option>Spanish (Español)</option>
                <option>French (Français)</option>
              </select>
            </div>
          </section>

          <section>
            <h2>Explicit content</h2>
            <div className="setting-row">
              <div className="setting-info">
                <span>Allow explicit content</span>
                <small>Explicit content (labeled with the E tag) is playable.</small>
                <small>When off, explicit music and podcasts are skipped, and explicit audiobooks (where available) are hidden.</small>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={settings.explicit} onChange={e => updateSetting('explicit', e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>
          </section>

          <section>
            <h2>Autoplay</h2>
            <div className="setting-row">
              <div className="setting-info">
                <span>Enjoy nonstop listening. When your audio ends, we'll play you something similar</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={settings.autoplay} onChange={e => updateSetting('autoplay', e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>
          </section>

          <section>
            <h2>Audio quality</h2>
            <small style={{display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px'}}><svg viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm9 3h-2V7h2v4zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path></svg> Quality changes on next track</small>
            
            <div className="setting-row">
              <div className="setting-info"><span>Streaming quality</span></div>
              <select className="settings-select" value={settings.streamingQuality} onChange={e => updateSetting('streamingQuality', e.target.value)}>
                <option>Automatic</option>
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
                <option>Very high</option>
              </select>
            </div>
            
            <div className="setting-row">
              <div className="setting-info"><span>Download</span></div>
              <select className="settings-select" value={settings.downloadQuality} onChange={e => updateSetting('downloadQuality', e.target.value)}>
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
                <option>Very high</option>
              </select>
            </div>
            
            <div className="setting-row">
              <div className="setting-info">
                <span>Auto adjust quality - Recommended setting: On</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={settings.autoAdjustQuality} onChange={e => updateSetting('autoAdjustQuality', e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>
          </section>

          <section>
            <h2>Playback</h2>
            <div className="setting-row">
              <div className="setting-info"><span>Crossfade songs</span></div>
              <label className="toggle-switch">
                <input type="checkbox" checked={settings.crossfade} onChange={e => updateSetting('crossfade', e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info"><span>Automix - Allow seamless transitions between songs on select playlists</span></div>
              <label className="toggle-switch">
                <input type="checkbox" checked={settings.automix} onChange={e => updateSetting('automix', e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span>Include Smart Shuffle in play modes - Turning this off will remove the Smart Shuffle option. You'll still be able to use other play modes, like Play in order or Shuffle.</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={settings.smartShuffle} onChange={e => updateSetting('smartShuffle', e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info"><span>Normalize volume - Set the same volume level for all songs and podcasts</span></div>
              <label className="toggle-switch">
                <input type="checkbox" checked={settings.normalizeVolume} onChange={e => updateSetting('normalizeVolume', e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span>Volume level - Adjust the volume for your environment. Loud may diminish audio quality. No effect on audio quality in Normal or Quiet.</span>
              </div>
              <select className="settings-select" value={settings.volumeLevel} onChange={e => updateSetting('volumeLevel', e.target.value)}>
                <option>Loud</option>
                <option>Normal</option>
                <option>Quiet</option>
              </select>
            </div>

            <div className="setting-row">
              <div className="setting-info"><span>Mono audio - Makes the left and right speakers play the same audio</span></div>
              <label className="toggle-switch">
                <input type="checkbox" checked={settings.monoAudio} onChange={e => updateSetting('monoAudio', e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info"><span>Equalizer</span></div>
              <label className="toggle-switch">
                <input type="checkbox" checked={settings.equalizer} onChange={e => updateSetting('equalizer', e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className={`eq-container ${!settings.equalizer ? 'disabled' : ''}`}>
              <div className="eq-presets">
                <span>Presets</span>
                <select className="settings-select eq-select" value={settings.eqPreset} onChange={e => handlePresetChange(e.target.value)}>
                  <option value="Custom" disabled hidden>Custom</option>
                  {Object.keys(presets).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              
              <div className="eq-graph">
                <div className="eq-y-axis">
                  <span>+12dB</span>
                  <span></span>
                  <span>-12dB</span>
                </div>
                <div className="eq-bands">
                  {settings.eqBands.map((val, idx) => (
                    <div className="eq-band" key={idx}>
                      <input 
                        type="range" 
                        min="-12" 
                        max="12" 
                        step="0.1" 
                        value={val} 
                        onChange={e => updateEqBand(idx, parseFloat(e.target.value))}
                        disabled={!settings.equalizer}
                        orient="vertical"
                      />
                      <div className="eq-band-fill" style={{height: `${((6 + 138 * ((val + 12) / 24)) / 150) * 100}%`}}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
};
