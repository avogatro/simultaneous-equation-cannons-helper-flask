import { useState, useMemo } from 'react';

export default function HomeView({ secState, onResetBanished, onResetExtraDeck }) {
  const [selectedSolution, setSelectedSolution] = useState(null);
  const colors = useMemo(() => secState.find_color_range(), [secState]);

  const totalCardsInExtraDeck = secState._fusion_levels.length + (secState._xyz_ranks.length * 2);
  const hasError = totalCardsInExtraDeck > 15;

  const handleReset = () => {
    setSelectedSolution(null);
    onResetBanished();
  };

  return (
    <div className="app-container">
      <h1>YGO SEC Helper</h1>
      <h2>༼ つ ◕_◕ ༽つ</h2>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '0.5em', marginBottom: '20px', alignItems: 'flex-start' }}>
        <div>
          <button className="reset-btn" onClick={handleReset} style={{ margin: 0 }}>
            Reset Banished
          </button>
        </div>

        {hasError ? (
          <div className="solution-info" style={{ marginTop: 0 }}>
            <p>Extra Deck Monster Over 15! Reset</p>
            <button className="reset-btn" onClick={onResetExtraDeck} style={{ marginTop: '10px' }}>
              Reset Extra Deck
            </button>
          </div>
        ) : (
          <div className="solution-info" style={{ marginTop: 0 }}>
            {!selectedSolution ? (
              <div>
                <p>Select Total Number</p>
                <p>to Get More Info</p>
              </div>
            ) : (
              <div className="solution-details-grid">
                <div className="grid-label">Send</div>
                <div className="grid-value"><span className="badge-xyz">Xyz</span> {selectedSolution.send_xyz_rank}</div>
                <div className="grid-value"><span className="badge-fusion">Fusion</span> {selectedSolution.send_fusion_level}</div>

                <div className="grid-label">Return</div>
                <div className="grid-value"><span className="badge-xyz">Xyz</span> {selectedSolution.returned_xyz_rank}</div>
                <div className="grid-value"><span className="badge-fusion">Fusion</span> {selectedSolution.returned_fusion_level}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="solution-table">
        {Object.keys(secState.value_table).map((levelKey) => {
          const solutions = secState.value_table[levelKey];
          if (solutions.length === 0) return null;

          const level = solutions[0].monster_level_on_board;

          return (
            <div key={levelKey} className="solution-row">
              <div className="level-label">Lvl {level}:</div>
              <div className="cards-container">
                {solutions.map((sol, i) => {
                  const hctColor = colors[sol.total_cards];
                  const isActive = selectedSolution === sol;

                  return (
                    <button
                      key={i}
                      className={`card-btn ${isActive ? 'active' : ''}`}
                      style={{
                        color: isActive ? 'var(--color-00)' : hctColor,
                        borderColor: hctColor,
                        backgroundColor: isActive ? hctColor : 'var(--color-00)'
                      }}
                      onClick={() => setSelectedSolution(sol)}
                    >
                      {sol.total_cards}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
