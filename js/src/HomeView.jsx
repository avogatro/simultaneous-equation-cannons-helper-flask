import { useState, useMemo, useEffect } from 'react';
import { SimultaneousEquationCannonsState } from './Model';

export default function HomeView({ secState, onResetBanished, onResetExtraDeck }) {
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [isMatrixView, setIsMatrixView] = useState(() => {
    const saved = localStorage.getItem('sec_matrix_view');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sec_matrix_view', JSON.stringify(isMatrixView));
  }, [isMatrixView]);

  // Persistent reference to the initial configuration (unbanished state)
  const initialSecState = useMemo(() => {
    return new SimultaneousEquationCannonsState(
      secState._fusion_levels,
      secState._xyz_ranks,
      [],
      []
    );
  }, [secState._fusion_levels, secState._xyz_ranks]);

  // Clear selected solution if it is no longer available in the current table
  useEffect(() => {
    if (selectedSolution) {
      const levelKey = selectedSolution.monster_level_on_board;
      const currentSolutions = secState.value_table[levelKey] || [];
      const stillExists = currentSolutions.some(
        (s) => s.total_cards === selectedSolution.total_cards
      );
      if (!stillExists) {
        setSelectedSolution(null);
      }
    }
  }, [secState.value_table, selectedSolution]);

  const colors = useMemo(() => secState.find_color_range(), [secState]);
  const totalCardsInExtraDeck = secState._fusion_levels.length + (secState._xyz_ranks.length * 2);
  const hasError = totalCardsInExtraDeck > 15;

  const handleReset = () => {
    setSelectedSolution(null);
    onResetBanished();
  };

  const allTotalCards = useMemo(() => {
    const totals = new Set();
    Object.values(initialSecState.value_table).forEach((solutions) => {
      solutions.forEach((sol) => {
        totals.add(sol.total_cards);
      });
    });
    return Array.from(totals).sort((a, b) => a - b);
  }, [initialSecState.value_table]);

  return (
    <div className="app-container">
      <h1>YGO SEC Helper</h1>
      <h2>༼ つ ◕_◕ ༽つ</h2>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '0.5em', marginBottom: '20px', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="reset-btn" onClick={handleReset} style={{ margin: 0, width: '100%' }}>
            Reset Banished
          </button>
          <button
            className="btn-primary"
            onClick={() => setIsMatrixView(!isMatrixView)}
            style={{ margin: 0, width: '100%' }}
          >
            {isMatrixView ? 'Switch to List' : 'Switch to Grid'}
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
        {isMatrixView && allTotalCards.length > 0 && (
          <div className="header-row">
            <div className="header-spacer">Lvl \ Cards</div>
            {allTotalCards.map((total) => (
              <div key={total} className="header-label" style={{ color: colors[total] }}>
                {total}
              </div>
            ))}
          </div>
        )}
        {Object.keys(isMatrixView ? initialSecState.value_table : secState.value_table).map((levelKey) => {
          const initialSolutions = initialSecState.value_table[levelKey] || [];
          const currentSolutions = secState.value_table[levelKey] || [];

          if (isMatrixView) {
            if (initialSolutions.length === 0) return null;
            const level = initialSolutions[0].monster_level_on_board;

            return (
              <div key={levelKey} className="solution-row">
                <div className="level-label">Lvl {level}:</div>
                <div className="cards-container" style={{ flexWrap: 'nowrap' }}>
                  {allTotalCards.map((total) => {
                    const currentSol = currentSolutions.find((s) => s.total_cards === total);
                    const initialSol = initialSolutions.find((s) => s.total_cards === total);

                    if (currentSol) {
                      const hctColor = colors[currentSol.total_cards];
                      const isActive = selectedSolution === currentSol;
                      return (
                        <button
                          key={total}
                          className={`card-btn ${isActive ? 'active' : ''}`}
                          style={{
                            color: isActive ? 'var(--color-00)' : hctColor,
                            borderColor: hctColor,
                            backgroundColor: isActive ? hctColor : 'var(--color-00)'
                          }}
                          onClick={() => setSelectedSolution(currentSol)}
                        >
                          {currentSol.total_cards}
                        </button>
                      );
                    } else if (initialSol) {
                      return (
                        <button
                          key={total}
                          className="card-btn disabled"
                          disabled
                          style={{
                            color: 'hsl(0, 0%, 30%)',
                            borderColor: 'hsl(0, 0%, 20%)',
                            backgroundColor: 'transparent',
                            cursor: 'not-allowed',
                            opacity: 0.3
                          }}
                        >
                          {total}
                        </button>
                      );
                    } else {
                      return (
                        <div key={total} className="card-placeholder" />
                      );
                    }
                  })}
                </div>
              </div>
            );
          } else {
            if (currentSolutions.length === 0) return null;
            const level = currentSolutions[0].monster_level_on_board;

            return (
              <div key={levelKey} className="solution-row">
                <div className="level-label">Lvl {level}:</div>
                <div className="cards-container" style={{ flexWrap: 'wrap' }}>
                  {currentSolutions.map((sol, i) => {
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
          }
        })}
      </div>
    </div>
  );
}
