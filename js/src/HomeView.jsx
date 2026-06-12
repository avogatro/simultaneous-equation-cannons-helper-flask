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
              <p>Select Total Number to Get More Info</p>
            ) : (
              <>
                <p>Send Xyz {selectedSolution.send_xyz_rank} Fusion {selectedSolution.send_fusion_level}</p>
                <p>Return Xyz {selectedSolution.returned_xyz_rank} Fusion {selectedSolution.returned_fusion_level}</p>
              </>
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
