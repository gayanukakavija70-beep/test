import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameSessionSummary } from '../types';
import { useTheme } from '../context/ThemeContext';
import { GodKGMascot } from '../components/GodKGMascot';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Timer,
  RotateCcw,
  Home,
  Folder,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface GameResultScreenProps {
  summary: GameSessionSummary;
  onPlayAgain: () => void;
  onBackToFolders: () => void;
  onGoHome: () => void;
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({
  summary,
  onPlayAgain,
  onBackToFolders,
  onGoHome,
}) => {
  const { colorClasses } = useTheme();

  // Fire confetti if score >= 70%
  useEffect(() => {
    if (summary.percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899'],
      });
    }
  }, [summary.percentage]);

  const isGoodScore = summary.percentage >= 70;
  const isMidScore = summary.percentage >= 40 && summary.percentage < 70;

  // Mascot Sinhala feedback message
  const getMascotMessage = () => {
    if (summary.percentage === 100) {
      return 'විශිෂ්ටයි! 100% ක් සම්පූර්ණයි! ඔබ මෙම ජීව විද්‍යා කොටස අතිවිශිෂ්ට ලෙස ප්‍රගුණ කර ඇත!';
    } else if (isGoodScore) {
      return `විශිෂ්ටයි! ඔබ ලබාගත් ලකුණු ${summary.percentage}% කි. ඔබ විභාගයට මනාව සූදානම් වෙමින් සිටී!`;
    } else if (isMidScore) {
      return `හොඳ උත්සාහයක්! ${summary.percentage}% ක් මතකයි. වැඩි වේලාවක් ගත් සහ වැරදුණු කාඩ්පත් නැවත පුහුණු වෙමු!`;
    } else {
      return `අධෛර්යවත් නොවන්න! ක්‍රමානුකූලව පුහුණු වීමෙන් මතකය වර්ධනය වේ. Forgotten First ක්‍රමයෙන් නැවත උත්සාහ කරමු!`;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Main Score Banner */}
      <div className="bg-slate-900 border-[4px] border-black shadow-[7px_7px_0px_#000] rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Top Trophy Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-950 border-[3px] border-black shadow-[4px_4px_0px_#000] mb-4">
          <Trophy
            className={`w-8 h-8 sm:w-10 sm:h-10 ${
              isGoodScore
                ? 'text-emerald-400 fill-emerald-400/20'
                : isMidScore
                ? 'text-amber-400 fill-amber-400/20'
                : 'text-rose-400 fill-rose-400/20'
            }`}
          />
        </div>

        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="font-comic text-xs uppercase px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-black">
            {summary.folderName}
          </span>
        </div>

        <h1 className="font-comic text-3xl sm:text-5xl text-white tracking-wide">
          SESSION COMPLETE!
        </h1>

        {/* Percentage Display */}
        <div className="my-5">
          <div
            className={`inline-block font-comic text-6xl sm:text-7xl tracking-tight drop-shadow-[3px_3px_0px_#000] ${
              isGoodScore
                ? 'text-emerald-400'
                : isMidScore
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {summary.percentage}%
          </div>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-1">
            සාර්ථකත්ව ප්‍රතිශතය (Saved to Folder)
          </p>
        </div>

        {/* Stats Grid: Correct vs Wrong */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
          <div className="bg-slate-950/80 border-2 border-emerald-500 rounded-2xl p-3 shadow-[2px_2px_0px_#000] flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div className="text-left">
              <span className="font-comic text-2xl text-white block leading-none">
                {summary.correctCount}
              </span>
              <span className="text-[11px] font-bold text-emerald-400">මතකයි (Correct)</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border-2 border-rose-500 rounded-2xl p-3 shadow-[2px_2px_0px_#000] flex items-center justify-center gap-3">
            <XCircle className="w-6 h-6 text-rose-400" />
            <div className="text-left">
              <span className="font-comic text-2xl text-white block leading-none">
                {summary.wrongCount}
              </span>
              <span className="text-[11px] font-bold text-rose-400">අමතකයි (Wrong)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onPlayAgain}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn flex items-center gap-2 cursor-pointer`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>නැවත ක්‍රීඩා කරන්න (Play Again)</span>
          </button>

          <button
            onClick={onBackToFolders}
            className="px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 manga-btn border-2 border-black flex items-center gap-2 cursor-pointer"
          >
            <Folder className="w-4 h-4" />
            <span>ෆෝල්ඩර වෙත (Folders)</span>
          </button>

          <button
            onClick={onGoHome}
            className="px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 manga-btn border-2 border-black flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>මුල් පිටුවට (Home)</span>
          </button>
        </div>
      </div>

      {/* GODKG MASCOT ON RESULTS SCREEN */}
      <div className="flex justify-center sm:justify-end">
        <GodKGMascot
          message={getMascotMessage()}
          actionButton={
            summary.wrongCount > 0
              ? {
                  label: 'නැවත පුහුණු වෙමු',
                  onClick: onPlayAgain,
                }
              : undefined
          }
        />
      </div>

      {/* DETAILED CARD REVIEW LIST SORTED FROM LONGEST TIME TO SHORTEST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-comic text-lg sm:text-xl text-white flex items-center gap-2">
            <Timer className="w-5 h-5 text-amber-400" />
            <span>කාඩ්පත් සමාලෝචනය (වැඩිම වේලාවේ සිට අඩුම වේලාවට)</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {summary.cardResults.length} Cards
          </span>
        </div>

        <div className="space-y-2.5">
          {summary.cardResults.map((item, index) => {
            const seconds = (item.timeSpentMs / 1000).toFixed(1);

            return (
              <div
                key={item.cardId}
                className={`bg-slate-900 border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                  item.isCorrect
                    ? 'border-l-[8px] border-l-emerald-500'
                    : 'border-l-[8px] border-l-rose-500'
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-comic px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-black">
                      #{index + 1}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        item.isCorrect
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                          : 'bg-rose-950/80 border-rose-500 text-rose-400'
                      }`}
                    >
                      {item.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>මතකයි (Right)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>අමතකයි (Wrong)</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="font-bold text-white text-sm sm:text-base leading-snug">
                    {item.question}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {item.answer}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-black shadow-[1px_1px_0px_#000]">
                    <Timer className="w-3.5 h-3.5" />
                    <span>{seconds}s</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">ගතවූ කාලය</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
