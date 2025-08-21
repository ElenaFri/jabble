import React, { useState } from 'react';
import './App.css';

function App() {
  const [quit, setQuit] = useState(false);
  const [games, setGames] = useState<any[]>([]);
  const [showGames, setShowGames] = useState(false);
  const [words, setWords] = useState<any[]>([]);

  const handleNewGame = async () => {
    try {
      const response = await fetch('http://localhost:3000/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: 1, playerId: 1 })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create a new game');
      alert(`New game created! Game ID: ${data.id}`);
    } catch (err: any) {
      alert('Error creating a new game: ' + err.message);
    }
  };

  const handleListGames = async () => {
    try {
      const response = await fetch('http://localhost:3000/games');
      const data = await response.json();
      setGames(data);
      setShowGames(true);
    } catch (err: any) {
      alert('Error fetching games: ' + err.message);
    }
  };

  const handleQuit = () => {
    setQuit(true);
  };

  if (quit) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Thank you for playing Jabble!</h2>
        <p>You can now close this tab.</p>
      </div>
    );
  }

  if (showGames) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Saved Games</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {games.map(game => {
            const wordsForGame = words.filter(word => word.gameId === game.id);
            return (
              <li>
                {
                  (game.endedAt || game.startedAt)
                    ? `${new Date(game.endedAt || game.startedAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}, at ${new Date(game.endedAt || game.startedAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}`
                    : 'N/A'
                }
                {' — '}
                {game.player?.score ?? 'N/A'} points,
                {' '}
                {wordsForGame.length} words placed
              </li>
            );
          })}
        </ul>
        <button onClick={() => setShowGames(false)}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to Jabble!</h1>
      <button onClick={handleNewGame}>
        New Game
      </button>
      <br />
      <button onClick={handleListGames}>
        Saved Games
      </button>
      <br />
      <button onClick={handleQuit}>
        Quit
      </button>
    </div>
  );
}

export default App;