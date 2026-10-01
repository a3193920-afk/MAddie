import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy, HelpCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { webAudioService } from '../../lib/webAudio';
import { GameGuideModal } from './GameGuideModal';

interface Props {
  onComplete: () => void;
}

interface Card {
  id: number;
  symbol: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MINDFUL_PAIRS = [
  { symbol: '🌿', label: 'Breathe' },
  { symbol: '☕', label: 'Warm Chai' },
  { symbol: '📖', label: 'Perspective' },
  { symbol: '🧘', label: 'Stillness' },
  { symbol: '🌙', label: 'Rest' },
  { symbol: '🎵', label: 'Harmony' },
  { symbol: '🌊', label: 'Flow' },
  { symbol: '🕯️', label: 'Grounded' },
];

export const MindMatchGame: React.FC<Props> = ({ onComplete }) => {
  const [showGuide, setShowGuide] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [isHinting, setIsHinting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const initGame = () => {
    const deck: Card[] = [...MINDFUL_PAIRS, ...MINDFUL_PAIRS]
      .sort(() => Math.random() - 0.5)
      .map((item, idx) => ({
        id: idx,
        symbol: item.symbol,
        label: item.label,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairsCount(0);
    setSeconds(0);
    setHintsRemaining(3);
    setIsHinting(false);
    setIsCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer
  useEffect(() => {
    if (showGuide || isCompleted) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [showGuide, isCompleted]);

  const handleCardClick = (index: number) => {
    if (showGuide || isHinting || flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    webAudioService.playGentleChime();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // Matched!
        setTimeout(() => {
          // Play harmonic celebratory chord
          webAudioService.playHarmonicChord(matchedPairsCount + 1);

          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatchedPairsCount((c) => {
            const nextCount = c + 1;
            if (nextCount === MINDFUL_PAIRS.length) {
              setIsCompleted(true);
              setTimeout(() => onComplete(), 1600);
            }
            return nextCount;
          });
        }, 400);
      } else {
        // Not matched, flip back gently
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleUseHint = () => {
    if (hintsRemaining <= 0 || isHinting || flippedIndices.length > 0 || isCompleted) return;

    // Find the first unmatched pair
    const unmatchedCards = cards.filter((c) => !c.isMatched);
    if (unmatchedCards.length < 2) return;

    const targetSymbol = unmatchedCards[0].symbol;
    const targetIndices = cards
      .map((c, i) => (c.symbol === targetSymbol && !c.isMatched ? i : -1))
      .filter((i) => i !== -1);

    if (targetIndices.length < 2) return;

    setIsHinting(true);
    setHintsRemaining((h) => h - 1);
    webAudioService.playHarmonicChord(0);

    // Briefly reveal the matched pair
    const hintedCards = [...cards];
    targetIndices.forEach((i) => {
      hintedCards[i].isFlipped = true;
    });
    setCards(hintedCards);

    setTimeout(() => {
      const resetCards = [...cards];
      targetIndices.forEach((i) => {
        resetCards[i].isFlipped = false;
      });
      setCards(resetCards);
      setIsHinting(false);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden select-none min-h-[460px]">
      {/* Pre-Game Guide Modal */}
      <GameGuideModal
        isOpen={showGuide}
        onStart={() => setShowGuide(false)}
        title="Mind Match: Working Memory Restoration"
        subtitle="Gentle pairing of calming sensory cues to anchor attention"
        icon="🧩"
        neurosciencePurpose="Focusing on matching visuospatial patterns gently re-engages the dorsolateral prefrontal cortex, deactivating over-stimulated stress circuits without testing or grading you."
        steps={[
          "Tap on any two cards to reveal their soothing wellness symbols.",
          "Match all 8 pairs at your own pace without pressure or time penalties.",
          "Use the gentle Hint button if your focus feels tired or overloaded."
        ]}
        recommendedDuration="2 - 4 minutes"
      />

      {/* Top Header & Stats */}
      <div className="w-full flex items-center justify-between z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-calm-700 bg-calm-50 border border-calm-200 px-3 py-0.5 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Game 2: Mind Match
          </span>
          <button
            onClick={() => setShowGuide(true)}
            className="p-1 text-slate-400 hover:text-calm-700 rounded-full hover:bg-slate-100 transition"
            title="View Mindful Purpose & Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={handleUseHint}
            disabled={hintsRemaining <= 0 || isHinting || isCompleted}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition ${
              hintsRemaining > 0 && !isHinting
                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 cursor-pointer'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Reveal 1 matching pair briefly"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Hint ({hintsRemaining})</span>
          </button>

          <div className="bg-slate-100 px-3 py-1 rounded-full text-slate-700">
            Time: {seconds}s
          </div>
          <div className="bg-calm-50 border border-calm-200 text-calm-800 px-3 py-1 rounded-full">
            Pairs: {matchedPairsCount} / {MINDFUL_PAIRS.length}
          </div>
          <button
            onClick={initGame}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            title="Shuffle & Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of 16 cards (4 x 4) */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-md mx-auto py-2">
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={isRevealed || isHinting}
              className={`h-16 sm:h-20 rounded-2xl border-2 transition-all duration-300 transform flex flex-col items-center justify-center p-1 relative cursor-pointer ${
                card.isMatched
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-800 scale-98 shadow-xs opacity-90'
                  : card.isFlipped
                  ? 'bg-calm-50 border-calm-400 scale-102 shadow-md'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 active:scale-95 shadow-xs'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-center animate-fade-in">
                  <span className="text-xl sm:text-2xl">{card.symbol}</span>
                  <span className="text-[10px] font-medium text-slate-600 tracking-tight mt-0.5 hidden sm:block">
                    {card.label}
                  </span>
                  {card.isMatched && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 absolute top-1.5 right-1.5" />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center opacity-60">
                  <span className="text-lg">🌱</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl w-full text-center space-y-1 animate-fade-in shadow-xs">
          <Trophy className="w-7 h-7 text-amber-500 mx-auto animate-bounce" />
          <h4 className="text-sm font-bold text-slate-800">Mind Match Complete</h4>
          <p className="text-xs text-slate-600">
            All 8 mindful pairs matched in {moves} turns ({seconds} seconds). Your focus is re-centered.
          </p>
        </div>
      )}

      {/* Grounding Footer */}
      <div className="text-[11px] text-slate-400 text-center">
        No ranking, no pressure. Take your time to discover each calming element.
      </div>
    </div>
  );
};
