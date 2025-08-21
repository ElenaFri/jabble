import React, { useState } from 'react';

function App() {
  const [quit, setQuit] = useState(false);

  const handleNewGame = () => {
    alert('Start a new game (to be implemented)');
  };

  const handleListGames = () => {
    alert('List all games (to be implemented)');
  };

  const handleQuit = () => {
    setQuit(true);
  };

  if (quit) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>Thank you for playing Jabble!</h2>
        <p>You can now close this tab.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>Welcome to Jabble!</h1>
      <button onClick={handleNewGame} style={{ margin: '1rem', padding: '1rem 2rem' }}>
        New Game
      </button>
      <br />
      <button onClick={handleListGames} style={{ margin: '1rem', padding: '1rem 2rem' }}>
        Saved Games
      </button>
      <br />
      <button onClick={handleQuit} style={{ margin: '1rem', padding: '1rem 2rem' }}>
        Quit
      </button>
    </div>
  );
}

export default App;