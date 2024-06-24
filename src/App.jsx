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

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  return (
    <div>
      <h1>Match The Emojis</h1>
      {difficulty === null ? (
        <div className="button-container">
          <button onClick={() => shuffle("easy")}>Easy</button>
          <button onClick={() => shuffle("medium")}>Medium</button>
          <button onClick={() => shuffle("hard")}>Hard</button>
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
  );
}

export default App;
