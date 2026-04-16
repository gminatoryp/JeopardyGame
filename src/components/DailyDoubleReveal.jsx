// DailyDoubleReveal — shown when a Daily Double cell is clicked
// Lets the host optionally display an image or video before revealing the clue.
import { useState } from 'react';

export default function DailyDoubleReveal({ clue, category, onProceed }) {
  const [mediaType, setMediaType] = useState(null); // 'image' | 'video' | null
  const [urlInput,  setUrlInput]  = useState('');
  const [liveUrl,   setLiveUrl]   = useState('');

  const isYouTube = (u) => u.includes('youtube.com') || u.includes('youtu.be');
  const toEmbed   = (u) => {
    const m = u.match(/(?:v=|youtu\.be\/)([^&?]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : u;
  };

  const reset = () => {
    setMediaType(null);
    setLiveUrl('');
    setUrlInput('');
  };

  return (
    <div className="jp-dd-wrap">
      <span className="jp-dd-badge">Daily Double!</span>
      <p className="jp-dd-sub">
        {category}&nbsp;·&nbsp;${clue.value}
      </p>

      {!mediaType ? (
        <>
          <button className="jp-dd-media-btn" onClick={() => setMediaType('image')}>
            Show Image
          </button>
          <button className="jp-dd-media-btn" onClick={() => setMediaType('video')}>
            Show Video
          </button>
          <br />
          <button className="jp-dd-proceed" onClick={onProceed}>
            Show Clue →
          </button>
        </>
      ) : (
        <>
          <div className="jp-dd-url-row">
            <input
              className="jp-dd-input"
              placeholder={
                mediaType === 'image'
                  ? 'Paste image URL…'
                  : 'Paste video or YouTube URL…'
              }
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button
              className="jp-dd-load"
              onClick={() => setLiveUrl(urlInput.trim())}
            >
              Load
            </button>
          </div>

          {liveUrl && (
            <div className="jp-dd-preview">
              {mediaType === 'image' && (
                <img src={liveUrl} alt="Daily Double media" />
              )}
              {mediaType === 'video' && (
                isYouTube(liveUrl)
                  ? <iframe src={toEmbed(liveUrl)} allowFullScreen title="dd-video" />
                  : <video src={liveUrl} controls autoPlay />
              )}
            </div>
          )}

          <button className="jp-dd-back" onClick={reset}>Back</button>
          <button className="jp-dd-proceed" onClick={onProceed}>
            Show Clue →
          </button>
        </>
      )}
    </div>
  );
}
