import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* TODO: Integrate vtlib-footer web component after setting up proper type declarations */}
      {/* For now, using a simple placeholder footer */}
      <div style={{ background: '#630031', color: 'white', padding: '2rem', textAlign: 'center' }}>
        <p>© 2024 Virginia Tech Digital Libraries</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="#" style={{ color: 'white', margin: '0 1rem' }}>Twitter</a>
          <a href="#" style={{ color: 'white', margin: '0 1rem' }}>Instagram</a>
          <a href="#" style={{ color: 'white', margin: '0 1rem' }}>YouTube</a>
          <a href="#" style={{ color: 'white', margin: '0 1rem' }}>Facebook</a>
        </div>
      </div>
    </footer>
  );
}
