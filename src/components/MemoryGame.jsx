import React, { useState, useEffect } from 'react';
import './MemoryGame.css'; 

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setCards(generateGrid());
  }, []);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isFlipped)) {
      setIsCompleted(true);
    }
  }, [cards]);

  const handleCardClick = (id) => {
    if (isLocked || flippedCards.length === 2 || cards.find(card => card.id === id).isFlipped) return;

    const newCards = cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, newCards.find(card => card.id === id)];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      if (newFlippedCards[0].number === newFlippedCards[1].number) {
        setFlippedCards([]);
      } else {
        setIsLocked(true);
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card => 
            newFlippedCards.some(flippedCard => flippedCard.id === card.id)
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setIsLocked(false);
        }, 3000);
      }
    }
  };

  return (
    <div>
      <h1>Memory Game</h1>
      <div className="grid">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className={`card ${card.isFlipped ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.isFlipped ? card.number : '?'}
          </div>
        ))}
      </div>
      {isCompleted && <h2 style={{ color: 'green' }}>Completed!</h2>}
    </div>
  );
}

function generateGrid() {
  const arr = Array.from({ length: 18 }, (_, index) => index + 1);
  const grid = [...arr, ...arr];
  grid.sort(() => Math.random() - 0.5);
  
  return grid.map((number, index) => ({
    id: index,
    number,
    isFlipped: false
  }));
}
