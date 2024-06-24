import React from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";

const cardImages = [
  { src: "public/img/happiness.png", matched: false },
  { src: "public/img/neutral-face.png", matched: false },
  { src: "public/img/sad-face.png", matched: false },
  { src: "public/img/slumber.png", matched: false },
  { src: "public/img/bike.png", matched: false },
  { src: "public/img/car.png", matched: false },
  { src: "public/img/vehicle.png", matched: false },
  { src: "public/img/face.png", matched: false },
];

function App() {
  const [cards, setCards] = React.useState([]);
  const [turns, setTurns] = React.useState(0);
  const [choiceOne, setChoiceOne] = React.useState(null);
  const [choiceTwo, setChoiceTwo] = React.useState(null);
  const [disabled, setDisabled] = React.useState(false);
  const shuffle = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setTurns(0);
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
        })
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
      <button onClick={shuffle}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard key={card.id} card={card} handleChoice={handleChoice} flipped={card === choiceOne || card === choiceTwo || card.matched} disabled={disabled}/>
        ))}
      </div>

      <h2>no. of turns: {turns}</h2>
    </div>
  );
}

export default App;
