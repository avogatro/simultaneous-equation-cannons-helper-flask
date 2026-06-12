import { useState } from 'react';

export default function DeckConfigView({ title, subtitle, fusion, setFusion, xyz, setXyz, onSave, showReset }) {
  const [copied, setCopied] = useState(false);
  const isExtraDeck = !showReset;
  const totalSlots = fusion.length + (xyz.length * 2);
  const slotsWarning = totalSlots > 15;

  const toggleFusion = (level) => {
    if (fusion.includes(level)) {
      setFusion(fusion.filter(l => l !== level));
    } else {
      setFusion([...fusion, level]);
    }
  };

  const toggleXyz = (rank) => {
    if (xyz.includes(rank)) {
      setXyz(xyz.filter(r => r !== rank));
    } else {
      setXyz([...xyz, rank]);
    }
  };

  const handleReset = () => {
    setFusion([]);
    setXyz([]);
  };

  return (
    <div className="app-container">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>

      {isExtraDeck && (
        <div style={{ marginBottom: '1rem', fontSize: '1.2rem', color: slotsWarning ? 'var(--color-8)' : 'var(--white)' }}>
          Extra Deck Space: <strong>{totalSlots} / 15</strong>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button className="save-btn" onClick={onSave} style={{ marginRight: '10px' }}>
          Done
        </button>
        {isExtraDeck && (
          <button
            className="save-btn"
            style={{ marginRight: '10px' }}
            onClick={() => {
              const url = new URL(window.location.origin + window.location.pathname);
              if (fusion.length > 0) url.searchParams.set('fusion', fusion.join(','));
              if (xyz.length > 0) url.searchParams.set('xyz', xyz.join(','));
              navigator.clipboard.writeText(url.toString());
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? 'Copied!' : 'Share Extra Deck Setup'}
          </button>
        )}
        {showReset && (
          <button className="reset-btn" onClick={handleReset}>
            Reset Banished
          </button>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <label className="checkbox-group-label"><span className="badge-xyz">Xyz</span> Monster Rank Selection</label>
        <div className="checkbox-group">
          {[...Array(13)].map((_, i) => {
            const rank = i + 1;
            const isChecked = xyz.includes(rank);
            return (
              <div key={`xyz-${rank}`} className="checkbox-wrapper">
                <button
                  className={`checkbox-label-xyz ${isChecked ? 'checked' : ''}`}
                  onClick={() => toggleXyz(rank)}
                >
                  {rank}
                </button>
              </div>
            );
          })}
        </div>

        <label className="checkbox-group-label" style={{ marginTop: '2rem' }}><span className="badge-fusion">Fusion</span> Monster Level Selection</label>
        <div className="checkbox-group">
          {[...Array(12)].map((_, i) => {
            const level = i + 1;
            const isChecked = fusion.includes(level);
            return (
              <div key={`fusion-${level}`} className="checkbox-wrapper">
                <button
                  className={`checkbox-label-fusion ${isChecked ? 'checked' : ''}`}
                  onClick={() => toggleFusion(level)}
                >
                  {level}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
