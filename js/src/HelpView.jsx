export default function HelpView() {
  return (
    <div className="glass-container" style={{ padding: '2rem' }}>
      <h1>Tutorials</h1>
      <h2>Usage</h2>
      
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Use the <strong style={{ color: 'var(--accent-1)' }}>Extra Deck</strong> page to setup levels and ranks available.
      </p>

      <div className="help-grid">
        <div>
          <p>Count the number of cards:</p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <li>in your opponent's hand</li>
            <li>on your opponent's side of the field</li>
            <li>in your hand</li>
            <li>on your side of the field</li>
          </ul>
          <p>Add those numbers together. This is the <b>total cards</b>.</p>
        </div>
        <div>
          <img className="help-img" src="/img/total_cards.webp" alt="total-cards" />
        </div>

        <div>
          <p>The opponent has monsters on the field that are not Link monsters, with a rank/level in the data. This is the <b>monster level to match</b>.</p>
        </div>
        <div>
          <img className="help-img" src="/img/level_to_match.webp" alt="level-to-match" />
        </div>

        <div>
          <p>On the main screen of this app, you can see in every row:</p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <li><b>monster level to match</b></li>
            <li>followed by a list of <b>total cards</b></li>
          </ul>
          <p>If SEC resolves and at that moment:</p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <li>A <b>monster with level to match</b> is still on the field and</li>
            <li>the current <b>total cards</b> is still on the right side of that <b>monster level to match</b></li>
          </ul>
          <p>then you can banish your opponent's entire field.</p>
        </div>
        <div>
          {/* Empty spacer or we can put another image if available */}
        </div>

        <div>
          <p>If you click on the <b>total cards</b> button, you will see exactly what to send and what to return from the banish zone.</p>
        </div>
        <div>
          <img className="help-img" src="/img/what_to_send.webp" alt="what-to-send" />
        </div>

        <div>
          <p>If you activate a second SEC, the monsters to send and to return do not have to be the same.</p>
          <p>Use the <b>Banished Monsters</b> page to define the previously banished monsters.</p>
        </div>
        <div>
          <img className="help-img" src="/img/pre_banish.webp" alt="pre-banish" />
        </div>
      </div>
    </div>
  );
}
