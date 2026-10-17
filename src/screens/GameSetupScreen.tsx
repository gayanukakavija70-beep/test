import React from 'react';
import { useAuthData } from '../context/AuthDataContext';
import { useTheme } from '../context/ThemeContext';
import { LessonFolder, PlayMode } from '../types';
import { Shuffle, Calendar, AlertOctagon, Lock, Play, Layers } from 'lucide-react';

interface GameSetupScreenProps {
  folder: LessonFolder;
  lessonId: number;
  onStartGame: (mode: PlayMode) => void;
  onBack: () => void;
}

export const GameSetupScreen: React.FC<GameSetupScreenProps> = ({
  folder,
  lessonId,
  onStartGame,
  onBack,
}) => {
  const { cards } = useAuthData();
  const { colorClasses } = useTheme();

  const folderCards = cards.filter((c) => c.folderId === folder.id);
  const isPlayedBefore = folder.lastPercentage !== null;

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6">
      <div className="bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border-2 border-black text-xs font-bold text-slate-300 shadow-[2px_2px_0px_#000]">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>කාඩ්පත් {folderCards.length} ක් අඩංගුයි</span>
          </div>

          <h1 className="font-comic text-2xl sm:text-3xl text-white tracking-wide">
            ක්‍රීඩා ආකාරය තෝරන්න
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            "{folder.name}" සඳහා ක්‍රීඩා කිරීමට ඔබ කැමති පිළිවෙළ තෝරන්න.
          </p>
        </div>

        {folderCards.length === 0 ? (
          <div className="p-6 bg-slate-950/80 border-2 border-dashed border-slate-700 rounded-2xl text-center space-y-3">
            <p className="text-amber-300 text-sm font-semibold">
              මෙම ෆෝල්ඩරයේ තවම කාඩ්පත් නැත!
            </p>
            <p className="text-xs text-slate-400">
              ක්‍රීඩා කිරීමට පෙර Edit Mode වෙත ගොස් කාඩ්පත් කිහිපයක් එකතු කරන්න.
            </p>
            <button
              onClick={onBack}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn cursor-pointer`}
            >
              ආපසු යන්න
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* OPTION 1: Shuffle (random order) */}
            <button
              onClick={() => onStartGame('shuffle')}
              className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white border-[3px] border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-between cursor-pointer group text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-500/20 border-2 border-purple-400 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Shuffle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-comic text-lg tracking-wide text-white flex items-center gap-2">
                    <span>1. SHUFFLE</span>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500">
                      Random
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">
                    කාඩ්පත් අහඹු පිළිවෙළට දිස්වේ.
                  </div>
                </div>
              </div>
              <Play className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* OPTION 2: By date modified (most recently edited card first) */}
            <button
              onClick={() => onStartGame('dateModified')}
              className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white border-[3px] border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-between cursor-pointer group text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-comic text-lg tracking-wide text-white flex items-center gap-2">
                    <span>2. BY DATE MODIFIED</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">
                    මෑතකදී සංස්කරණය කළ කාඩ්පත් මුලින්ම දිස්වේ.
                  </div>
                </div>
              </div>
              <Play className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* OPTION 3: Forgotten first (locked until folder has been played at least once) */}
            <div className="relative">
              <button
                onClick={() => {
                  if (isPlayedBefore) {
                    onStartGame('forgottenFirst');
                  }
                }}
                disabled={!isPlayedBefore}
                className={`w-full p-4 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-between text-left transition-all ${
                  isPlayedBefore
                    ? 'bg-rose-950/80 hover:bg-rose-900/80 text-white cursor-pointer group active:translate-x-0.5 active:translate-y-0.5'
                    : 'bg-slate-950/70 border-slate-700 text-slate-500 cursor-not-allowed opacity-75'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${
                      isPlayedBefore
                        ? 'bg-rose-500/20 border-rose-400 text-rose-400'
                        : 'bg-slate-800 border-slate-700 text-slate-600'
                    }`}
                  >
                    {isPlayedBefore ? (
                      <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-comic text-lg tracking-wide flex items-center gap-2">
                      <span className={isPlayedBefore ? 'text-rose-200' : 'text-slate-500'}>
                        3. FORGOTTEN FIRST
                      </span>
                      {!isPlayedBefore && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/50">
                          අගුළු දමා ඇත (Locked)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">
                      පසුගිය වර වැරදුණු කාඩ්පත් මුලින්ම, පසුව වැඩිම වේලාවක් ගත් කාඩ්පත්.
                    </div>
                  </div>
                </div>

                {isPlayedBefore ? (
                  <Play className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {!isPlayedBefore && (
                <p className="text-[11px] text-amber-400/90 font-medium mt-1.5 pl-2">
                  * මෙම ෆෝල්ඩරය අවම වශයෙන් එක් වරක් හෝ ක්‍රීඩා කළ පසු මෙම විකල්පය විවෘත වේ.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
