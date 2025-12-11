import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import RotateCwIcon from './icons/RotateCwIcon';

interface Card {
  id: number;
  front: string;
  back: string;
}

const FlashcardMaker: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    { id: 1, front: 'What is React?', back: 'A JavaScript library for building user interfaces.' },
    { id: 2, front: 'What is a component?', back: 'A reusable piece of UI.' },
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [view, setView] = useState<'study' | 'edit'>('study');

  const addCard = () => {
    setCards([...cards, { id: Date.now(), front: '', back: '' }]);
  };

  const handleCardChange = (id: number, side: 'front' | 'back', value: string) => {
    setCards(cards.map(c => c.id === id ? { ...c, [side]: value } : c));
  };
  
  const removeCard = (id: number) => {
    setCards(cards.filter(c => c.id !== id));
    if(currentCardIndex >= cards.length - 1) {
        setCurrentCardIndex(Math.max(0, cards.length - 2));
    }
  };
  
  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };
  
  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const currentCard = cards[currentCardIndex];

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6">
          <button onClick={() => setView('study')} className={`flex-1 py-2 rounded-md ${view === 'study' ? 'bg-brand-primary text-white' : ''}`}>Study</button>
          <button onClick={() => setView('edit')} className={`flex-1 py-2 rounded-md ${view === 'edit' ? 'bg-brand-primary text-white' : ''}`}>Edit Cards</button>
        </div>

        {view === 'study' ? (
          <div>
            {cards.length > 0 ? (
                <>
                <div className="perspective-1000 h-64 mb-4">
                    <div className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center p-4 text-center text-xl font-semibold text-gray-800 dark:text-white">{currentCard?.front}</div>
                        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-brand-accent/20 dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center p-4 text-center text-lg text-gray-700 dark:text-gray-300">{currentCard?.back}</div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <button onClick={prevCard} className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-brand-accent/50"><ArrowLeftIcon /></button>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">{currentCardIndex + 1} / {cards.length}</span>
                    <button onClick={nextCard} className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-brand-accent/50"><ArrowRightIcon /></button>
                </div>
                <div className="text-center mt-4">
                    <button onClick={() => setIsFlipped(!isFlipped)} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary dark:text-brand-accent"><RotateCwIcon className="w-4 h-4" /> Flip Card</button>
                </div>
                </>
            ) : <p className="text-center text-gray-500 py-10">No cards to study. Go to 'Edit Cards' to add some.</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card, index) => (
              <div key={card.id} className="grid grid-cols-12 gap-2 items-start bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                  <span className="col-span-1 flex items-center justify-center h-full font-bold text-gray-400">{index + 1}</span>
                  <textarea placeholder="Front" value={card.front} onChange={e => handleCardChange(card.id, 'front', e.target.value)} className="col-span-5 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[80px] resize-y" />
                  <textarea placeholder="Back" value={card.back} onChange={e => handleCardChange(card.id, 'back', e.target.value)} className="col-span-5 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[80px] resize-y" />
                  <button onClick={() => removeCard(card.id)} className="col-span-1 text-gray-400 hover:text-red-500 pt-1"><CloseIcon className="w-5 h-5 mx-auto"/></button>
              </div>
            ))}
            <button onClick={addCard} className="w-full mt-2 py-2 text-sm font-semibold text-brand-primary dark:text-brand-accent hover:underline bg-gray-200 dark:bg-gray-800 rounded-md">
              + Add New Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardMaker;