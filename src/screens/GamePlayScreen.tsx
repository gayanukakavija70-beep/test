import React, { useState, useEffect, useRef } from 'react';
import { useAuthData } from '../context/AuthDataContext';
import { useTheme } from '../context/ThemeContext';
import { Flashcard, GameCardReviewResult, GameSessionSummary, LessonFolder, PlayMode } from '../types';
import {
  Check,
  X,
  Eye,
  LogOut,
  HelpCircle,
  Timer,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

interface GamePlayScreenProps {
  folder: LessonFolder;
  lessonId: number;
  playMode: PlayMode;
  onFinishGame: (summary: GameSessionSummary) => void;
  onExit: () => void;
}

export const GamePlayScreen: React.FC<GamePlayScreenProps> = ({
  folder,
  lessonId,
  playMode,
  onFinishGame,
  onExit,
}) => {
  const { cards, saveGameSessionResults } = useAuthData();
  const { colorClasses } = useTheme();

  // Prepare cards array based on playMode
  const [deck, setDeck] = useState<Flashcard[]>(() => {
    const folderCards = cards.filter((c) => c.folderId === folder.id);
    const sorted = [...folderCards];

    if (playMode === 'shuffle') {
      return sorted.sort(() => Math.random() - 0.5);
    } else if (playMode === 'dateModified') {
      return sorted.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else if (playMode === 'forgottenFirst') {
      return sorted.sort((a, b) => {
        const aWrong = a.lastResult === 'wrong' ? 1 : 0;
        const bWrong = b.lastResult === 'wrong' ? 1 : 0;
        if (aWrong !== bWrong) {
          return bWrong - aWrong; // wrong cards first
        }
        return (b.lastTimeSpentMs || 0) - (a.lastTimeSpentMs || 0); // longest time spent first
      });
    }
    return sorted;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [sessionResults, setSessionResults] = useState<GameCardReviewResult[]>([]);

  // Time recording for current card
  const cardStartTimeRef = useRef<number>(Date.now());
  const [elapsedCardSeconds, setElapsedCardSeconds] = useState<number>(0);

  // Reset timer on card change
  useEffect(() => {
    cardStartTimeRef.current = Date.now();
    setElapsedCardSeconds(0);
    setIsChecked(false);

    const interval = setInterval(() => {
      setElapsedCardSeconds(
        Math.floor((Date.now() - cardStartTimeRef.current) / 1000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const currentCard = deck[currentIndex];
  const totalCards = deck.length;
  const progressPercent = totalCards > 0 ? (currentIndex / totalCards) * 100 : 0;

  const handleCheck = () => {
    setIsChecked(true);
  };

  const handleDecision = async (isCorrect: boolean) => {
    const timeSpentMs = Date.now() - cardStartTimeRef.current;
    const reviewResult: GameCardReviewResult = {
      cardId: currentCard.id,
      question: currentCard.question,
      answer: currentCard.answer,
      isCorrect,
      timeSpentMs,
    };

    const newResults = [...sessionResults, reviewResult];
    setSessionResults(newResults);

    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    const newWrong = !isCorrect ? wrongCount + 1 : wrongCount;

    if (isCorrect) {
      setCorrectCount(newCorrect);
    } else {
      setWrongCount(newWrong);
    }

    // Next card or finish
    if (currentIndex + 1 < totalCards) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Game Finished!
      const percentage = Math.round((newCorrect / totalCards) * 100);
      // Sort all cards from longest time spent to shortest
      const sortedByTime = [...newResults].sort((a, b) => b.timeSpentMs - a.timeSpentMs);

      // Save results to Firestore
      try {
        await saveGameSessionResults(
          folder.id,
          percentage,
          newResults.map((r) => ({
            cardId: r.cardId,
            isCorrect: r.isCorrect,
            timeSpentMs: r.timeSpentMs,
          }))
        );
      } catch (err) {
        console.error('Error saving game results:', err);
      }

      onFinishGame({
        folderId: folder.id,
        lessonId,
        folderName: folder.name,
        totalCards,
        correctCount: newCorrect,
        wrongCount: newWrong,
        percentage,
        cardResults: sortedByTime,
      });
    }
  };

  if (!currentCard) {
    return (
      <div className="max-w-md mx-auto p-6 text-center space-y-4">
        <p className="text-white">කාඩ්පත් කිසිවක් හමු නොවීය.</p>
        <button
          onClick={onExit}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl manga-btn"
        >
          ආපසු යන්න
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* Top Header Bar: Exit button, Counters, and Progress bar */}
      <div className="bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_#000] rounded-2xl p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          {/* Exit Button */}
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl manga-btn border-2 border-black text-xs font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>

          {/* Live Tick & Cross Counters */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Correct Counter */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-emerald-950/80 border-2 border-emerald-500 rounded-full text-emerald-400 text-xs sm:text-sm font-black shadow-[2px_2px_0px_#000]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{correctCount}</span>
            </div>

            {/* Wrong Counter */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-rose-950/80 border-2 border-rose-500 rounded-full text-rose-400 text-xs sm:text-sm font-black shadow-[2px_2px_0px_#000]">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>{wrongCount}</span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1 text-slate-400 text-xs font-mono font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-700">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>{elapsedCardSeconds}s</span>
            </div>
          </div>

          {/* Current Card Index */}
          <div className="text-xs sm:text-sm font-comic text-white">
            <span className="text-emerald-400">{currentIndex + 1}</span> / {totalCards}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-950 border-2 border-black rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${colorClasses.bg}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div className="bg-slate-900 border-[4px] border-black shadow-[7px_7px_0px_#000] rounded-3xl p-6 sm:p-9 min-h-[360px] flex flex-col justify-between relative overflow-hidden transition-all">
        {/* Comic Halftone accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500 border-b-2 border-black" />

        {/* Question Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg border-2 border-black ${colorClasses.bg} text-slate-950 font-comic text-xs tracking-wider shadow-[1px_1px_0px_#000]`}>
                QUESTION #{currentIndex + 1}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {folder.name}
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white leading-relaxed whitespace-pre-wrap">
            {currentCard.question}
          </h2>
        </div>

        {/* Answer Section (Shown only after clicking Check) */}
        {isChecked ? (
          <div className="mt-6 pt-6 border-t-[3px] border-black space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg border-2 border-black bg-cyan-400 text-slate-950 font-comic text-xs tracking-wider shadow-[1px_1px_0px_#000]">
                ANSWER (පිළිතුර)
              </span>
            </div>

            <div className="bg-slate-950/80 border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_#000]">
              <p className="text-lg sm:text-xl font-medium text-emerald-300 leading-relaxed whitespace-pre-wrap">
                {currentCard.answer}
              </p>
            </div>

            {/* Tick and Cross decision buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3 sm:gap-4">
              {/* CROSS: I didn't remember */}
              <button
                onClick={() => handleDecision(false)}
                className="py-4 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-sm sm:text-base border-[3px] border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                <span>අමතකයි (I didn't)</span>
              </button>

              {/* TICK: I remembered */}
              <button
                onClick={() => handleDecision(true)}
                className="py-4 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-sm sm:text-base border-[3px] border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                <span>මතකයි (I remembered)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Check Button */
          <div className="mt-8 pt-4 flex justify-center">
            <button
              onClick={handleCheck}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-comic text-lg sm:text-xl text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn flex items-center justify-center gap-2.5 cursor-pointer`}
            >
              <Eye className="w-6 h-6 stroke-[2.5]" />
              <span>CHECK (පිළිතුර බලන්න)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
