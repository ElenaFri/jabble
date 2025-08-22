import React, { useState, useEffect } from 'react';
import './App.css';

function JumpNRunGame({ game, onBack }: { game: any, onBack: () => void }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Jabble - Game #{game.id}</h2>
      <p>
        Move your character with the arrow keys.<br />
        Bump into animals to challenge them at Scrabble!
      </p>
      <div style={{
        width: 400, height: 200, background: '#14532d', margin: '2rem auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
      }}>
        [Jump'n'Run game area placeholder]
      </div>
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
}

function App() {
  const [quit, setQuit] = useState(false);
  const [games, setGames] = useState<any[]>([]);
  const [words, setWords] = useState<any[]>([]);
  const [mode, setMode] = useState<'home' | 'games' | 'playing'>('home');
  const [currentGame, setCurrentGame] = useState<any>(null);

  useEffect(() => {
    if (mode === 'games') {
      fetch('http://localhost:3000/words')
        .then(res => res.json())
        .then(setWords)
        .catch(() => setWords([]));
    }
  }, [mode]);

  const handleNewGame = async () => {
    try {
      const response = await fetch('http://localhost:3000/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: 1, playerId: 1 })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create a new game');
      setCurrentGame(data);
      setMode('playing');
    } catch (err: any) {
      alert('Error creating a new game: ' + err.message);
    }
  };

  const handleListGames = async () => {
    try {
      const response = await fetch('http://localhost:3000/games');
      const data = await response.json();
      setGames(data);
      setMode('games');
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

  if (mode === 'games') {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Saved Games</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {games.map(game => {
            const wordsForGame = words.filter(word => word.gameId === game.id);
            return (
              <li key={game.id}>
                Game #{game.id}
                {' — '}
                Saved on {
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
                {game.player?.score ?? 'N/A'} points
                {' — '}
                {wordsForGame.length} words placed
              </li>
            );
          })}
        </ul>
        <button onClick={() => setMode('home')}>Back</button>
      </div>
    );
  }

  if (mode === 'playing' && currentGame) {
    return (
      <JumpNRunGame
        game={currentGame}
        onBack={() => {
          setCurrentGame(null);
          setMode('home');
        }}
      />
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to Jabble!</h1>
      <div className="button-group">
        <button onClick={handleNewGame}>
          New Game
        </button>
        <button onClick={handleListGames}>
          Saved Games
        </button>
        <button onClick={handleQuit}>
          Quit
        </button>
      </div>
    </div>
  );
}

export default App;