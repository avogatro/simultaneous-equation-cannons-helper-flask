export default function AboutView() {
  return (
    <div className="app-container">
      <h1>About</h1>
      <h2>About Simultaneous Equation Cannons Helper</h2>
      
      <div className="resource-links" style={{ marginTop: '20px' }}>
        <p className="resource-link" style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
          Github repo <a href="https://github.com/avogatro/simultaneous-equation-cannons-helper" style={{ color: 'var(--color-6)', textDecoration: 'none', fontWeight: 'bold' }}>Windows App here.</a>
        </p>
        <p className="resource-link" style={{ fontSize: '1.2rem' }}>
          Github repo <a href="https://github.com/avogatro/simultaneous-equation-cannons-helper-flask" style={{ color: 'var(--color-6)', textDecoration: 'none', fontWeight: 'bold' }}>Web App here.</a>
        </p>
      </div>
    </div>
  );
}
