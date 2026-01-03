
import React, { useState, useEffect } from 'react';
import { LessonItem } from '../../types';
import { RefreshCw, Trophy } from 'lucide-react';

interface MemoryGameProps {
  items: LessonItem[];
  onClose: () => void;
}

interface Card {
  id: string; // Unique ID for the card instance
  itemId: string; // The ID of the lesson item (used for matching)
  content: string; // Text to display
  type: 'arabic' | 'transliteration';
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ items, onClose }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize Game
  useEffect(() => {
    initializeGame();
  }, [items]);

  const initializeGame = () => {
    // Select 6 random items to keep the grid manageable (12 cards total)
    const gameItems = items.length > 6
      ? [...items].sort(() => 0.5 - Math.random()).slice(0, 6)
      : items;

    const newCards: Card[] = [];
    gameItems.forEach((item) => {
      // Card 1: Arabic
      newCards.push({
        id: `${item.id}-ar`,
        itemId: item.id,
        content: item.text_ar,
        type: 'arabic',
        isFlipped: false,
        isMatched: false,
      });
      // Card 2: English/Transliteration
      newCards.push({
        id: `${item.id}-en`,
        itemId: item.id,
        content: item.transliteration || '?',
        type: 'transliteration',
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    setCards(newCards.sort(() => 0.5 - Math.random()));
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setIsWon(false);
  };

  const handleCardClick = (clickedCard: Card) => {
    // Ignore if already flipped, matched, or if 2 cards are already flipped
    if (clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) return;

    // Flip the card
    const updatedCards = cards.map(c =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    // Check match if 2 cards flipped
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      checkForMatch(newFlipped, updatedCards);
    }
  };

  const checkForMatch = (currentFlipped: Card[], currentCards: Card[]) => {
    const [card1, card2] = currentFlipped;
    const isMatch = card1.itemId === card2.itemId;

    if (isMatch) {
      // Match Found
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === card1.id || c.id === card2.id
            ? { ...c, isMatched: true, isFlipped: true }
            : c
        ));
        setFlippedCards([]);
        setMatches(prev => {
          const newMatches = prev + 1;
          if (newMatches === cards.length / 2) setIsWon(true);
          return newMatches;
        });
      }, 500);
    } else {
      // No Match
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === card1.id || c.id === card2.id
            ? { ...c, isFlipped: false }
            : c
        ));
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 font-sans">Memory Match</h2>
        <div className="flex gap-4 text-sm font-bold text-slate-600">
          <span>Moves: {moves}</span>
          <span>Pairs: {matches}/{cards.length / 2}</span>
        </div>
      </div>

      {isWon ? (
        <div className="flex flex-col items-center justify-center h-64 animate-in zoom-in duration-300">
          <Trophy size={64} className="text-yellow-500 mb-4 animate-bounce" />
          <h3 className="text-3xl font-bold text-slate-800 mb-2">You Won!</h3>
          <p className="text-slate-500 mb-6">Great job matching all the letters.</p>
          <div className="flex gap-4">
            <button
              onClick={initializeGame}
              className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors"
            >
              <RefreshCw size={20} /> Play Again
            </button>
            <button
              onClick={onClose}
              className="text-slate-500 font-bold hover:text-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 flex-grow overflow-y-auto p-2">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="aspect-square perspective-1000 cursor-pointer group"
            >
              <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${card.isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front (Face Down) */}
                <div className="absolute w-full h-full bg-slate-200 rounded-xl border-4 border-white shadow-sm flex items-center justify-center backface-hidden group-hover:bg-slate-300 transition-colors">
                  <span className="text-4xl text-slate-400 opacity-50 font-bold">?</span>
                </div>

                {/* Back (Face Up) */}
                <div className={`absolute w-full h-full rounded-xl border-4 border-white shadow-md flex items-center justify-center backface-hidden rotate-y-180
                            ${card.isMatched ? 'bg-green-100 border-green-200' : 'bg-white'}
                        `}>
                  <span className={`${card.type === 'arabic' ? 'font-arabic text-4xl sm:text-5xl' : 'font-sans text-lg font-bold'} text-slate-800 text-center select-none`}>
                    {card.content}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
