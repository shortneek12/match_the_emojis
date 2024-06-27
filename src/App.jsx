import React from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";

const cardImages = [
  { src: "/img/happiness.png", matched: false },
  { src: "/img/neutral-face.png", matched: false },
  { src: "/img/sad-face.png", matched: false },
  { src: "/img/slumber.png", matched: false },
  { src: "/img/bike.png", matched: false },
  { src: "/img/car.png", matched: false },
  { src: "/img/vehicle.png", matched: false },
  { src: "/img/face.png", matched: false },
];

function App() {
  const [cards, setCards] = React.useState([]);
  const [turns, setTurns] = React.useState(0);
  const [choiceOne, setChoiceOne] = React.useState(null);
  const [choiceTwo, setChoiceTwo] = React.useState(null);
  const [disabled, setDisabled] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState(null);
  const [gameCompleted, setGameCompleted] = React.useState(false);
  const [playerName, setPlayerName] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [highScores, setHighScores] = React.useState(() => JSON.parse(localStorage.getItem('highScores')) || {
    easy: [],
    medium: [],
    hard: []
  });

  const shuffle = (level) => {
    let selectedCards;
    if (level === "easy") {
      selectedCards = cardImages.slice(0, 4); // 4 pairs
    } else if (level === "medium") {
      selectedCards = cardImages.slice(0, 6); // 6 pairs
    } else if (level === "hard") {
      selectedCards = cardImages; // 8 pairs
    }

    const shuffledCards = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setTurns(0);
    setDifficulty(level);
    setChoiceOne(null);
    setChoiceTwo(null);
    setGameCompleted(false);
  };

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  React.useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  React.useEffect(() => {
    if (cards.length && cards.every(card => card.matched)) {
      setGameCompleted(true);
      updateHighScore(playerName, turns, difficulty);
    }
  }, [cards]);

  const updateHighScore = (name, score, level) => {
    setHighScores((prevHighScores) => {
      const normalizedName = name.trim();
      const levelScores = prevHighScores[level];

      const existingScore = levelScores.find(player => player.name === normalizedName);

      if (existingScore) {
        if (score < existingScore.score) {
          existingScore.score = score;
          notifyNewHighScore(name, score, level); // Notify if new high score is achieved
        }
      } else {
        levelScores.push({ name, score });
        notifyNewHighScore(name, score, level); // Notify if new high score is achieved
      }

      const updatedScores = {
        ...prevHighScores,
        [level]: levelScores.sort((a, b) => a.score - b.score).slice(0, 10) // Keep only top 10 scores
      };
      localStorage.setItem('highScores', JSON.stringify(updatedScores));
      return updatedScores;
    });
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  const notifyNewHighScore = (name, score, level) => {
    alert(`Congratulations ${name}! You've achieved a new high score of ${score} turns in ${level} mode.`);
  };

  const handleStartGame = (level) => {
    if (playerName.trim() === "") {
      alert("Username is required to start the game.");
      return;
    }
    setNameError("");
    shuffle(level);
  };

  return (
    <div className="app">
      <h1>Match The Emojis</h1>
      {difficulty === null ? (
        <div className="setup-container">
          <input
            type="text"
            placeholder="Enter your name: "
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          {nameError && <p className="error">{nameError}</p>}
          <div className="button-container">
            <button onClick={() => handleStartGame("easy")}>Easy</button>
            <button onClick={() => handleStartGame("medium")}>Medium</button>
            <button onClick={() => handleStartGame("hard")}>Hard</button>
          </div>
        </div>
      ) : (
        <div>
          {gameCompleted ? (
            <div className="completion-message">
              <h2 className="congrats">Congratulations! You've matched all the cards!</h2>
              <h2>Total turns: {turns}</h2>
              <button onClick={() => setDifficulty(null)}>Play Again</button>
            </div>
          ) : (
            <div>
              <div className="card-grid">
                {cards.map((card) => (
                  <SingleCard
                    key={card.id}
                    card={card}
                    handleChoice={handleChoice}
                    flipped={card === choiceOne || card === choiceTwo || card.matched}
                    disabled={disabled}
                  />
                ))}
              </div>
              <h2>Number of turns: {turns}</h2>
              <button onClick={() => setDifficulty(null)}>Restart</button>
            </div>
          )}
        </div>
      )}
      <h2 className="title">High Scores</h2>
      <div className="high-scores">
        <div className="score-level">
          <h3>Easy</h3>
          <ul>
            {highScores.easy.map(({ name, score }, index) => (
              <li key={index}>{name}: {score} turns</li>
            ))}
          </ul>
        </div>
        <div className="score-level">
          <h3>Medium</h3>
          <ul>
            {highScores.medium.map(({ name, score }, index) => (
              <li key={index}>{name}: {score} turns</li>
            ))}
          </ul>
        </div>
        <div className="score-level">
          <h3>Hard</h3>
          <ul>
            {highScores.hard.map(({ name, score }, index) => (
              <li key={index}>{name}: {score} turns</li>
            ))}
          </ul>
        </div>
      </div>
      <footer>
        <p>Made by: Gaurav Basu</p>
      </footer>
    </div>
  );
}

export default App;
