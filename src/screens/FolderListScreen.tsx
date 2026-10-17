import React, { useState } from 'react';
import { useAuthData } from '../context/AuthDataContext';
import { useTheme } from '../context/ThemeContext';
import { BIOLOGY_LESSONS } from '../data/lessons';
import { LessonFolder } from '../types';
import { GodKGMascot } from '../components/GodKGMascot';
import {
  Plus,
  Folder,
  Layers,
  Gamepad2,
  Edit3,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  FolderPlus,
} from 'lucide-react';

interface FolderListScreenProps {
  lessonId: number;
  onSelectFolderGame: (folder: LessonFolder) => void;
  onSelectFolderEdit: (folder: LessonFolder) => void;
}

export const FolderListScreen: React.FC<FolderListScreenProps> = ({
  lessonId,
  onSelectFolderGame,
  onSelectFolderEdit,
}) => {
  const { folders, cards, createFolder } = useAuthData();
  const { colorClasses } = useTheme();

  const lesson = BIOLOGY_LESSONS.find((l) => l.id === lessonId) || BIOLOGY_LESSONS[0];
  const lessonFolders = folders.filter((f) => f.lessonId === lessonId);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Folder Action Modal (Game mode or Edit mode)
  const [selectedFolder, setSelectedFolder] = useState<LessonFolder | null>(null);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      setIsCreating(true);
      await createFolder(lessonId, newFolderName);
      setNewFolderName('');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  // Helper to get actual card count from cards collection
  const getFolderCardCount = (folderId: string) => {
    return cards.filter((c) => c.folderId === folderId).length;
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Lesson Banner */}
      <div className="bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_#000] rounded-3xl p-5 sm:p-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-comic px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-black">
                පාඩම {lesson.number}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {lesson.englishTitle}
              </span>
            </div>
            <h1 className="font-comic text-2xl sm:text-3xl text-white tracking-wide">
              {lesson.title}
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              {lesson.description}
            </p>
          </div>

          {/* Add Folder Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn self-start sm:self-auto cursor-pointer`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>නව ෆෝල්ඩරයක් (Add)</span>
          </button>
        </div>
      </div>

      {/* Folder Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-comic text-lg sm:text-xl text-white tracking-wide flex items-center gap-2">
            <Folder className="w-5 h-5 text-amber-400" />
            <span>උප මාතෘකා ෆෝල්ඩර ({lessonFolders.length})</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Tapping opens Game or Edit
          </span>
        </div>

        {lessonFolders.length === 0 ? (
          <div className="bg-slate-900/60 border-2 border-dashed border-slate-700 rounded-3xl p-8 sm:p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 border-2 border-black flex items-center justify-center text-slate-400 shadow-[2px_2px_0px_#000]">
              <FolderPlus className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-white">තවම ෆෝල්ඩර සාදා නැත</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
              මෙම පාඩම යටතේ ඔබේ පළමු උප මාතෘකා ෆෝල්ඩරය සකසා කාඩ්පත් එකතු කරන්න.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn cursor-pointer`}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>පළමු ෆෝල්ඩරය හදමු</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {lessonFolders.map((folder) => {
              const cardCount = getFolderCardCount(folder.id);
              const percentage = folder.lastPercentage;

              // Progress bar styling rule:
              // red under 40%, amber under 70%, green from 70%
              let progressColorClass = 'bg-slate-600';
              let progressBadgeColor = 'text-slate-400 bg-slate-800 border-slate-700';

              if (percentage !== null) {
                if (percentage < 40) {
                  progressColorClass = 'bg-rose-500';
                  progressBadgeColor = 'text-rose-300 bg-rose-950/80 border-rose-500';
                } else if (percentage < 70) {
                  progressColorClass = 'bg-amber-400';
                  progressBadgeColor = 'text-amber-300 bg-amber-950/80 border-amber-500';
                } else {
                  progressColorClass = 'bg-emerald-500';
                  progressBadgeColor = 'text-emerald-300 bg-emerald-950/80 border-emerald-500';
                }
              }

              return (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder)}
                  className="cursor-pointer bg-slate-900 hover:bg-slate-850 border-[3px] border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#000]">
                        <Folder className="w-5 h-5 fill-amber-400/30" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white line-clamp-1">
                          {folder.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Layers className="w-3.5 h-3.5 text-cyan-400" />
                          <span>කාඩ්පත් {cardCount} ක්</span>
                        </p>
                      </div>
                    </div>

                    {percentage !== null ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${progressBadgeColor} shadow-[1px_1px_0px_#000]`}>
                        {percentage}%
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-400">
                        නොපැවැත්විණි
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                      <span>පසුගිය සැසියේ ප්‍රතිශතය</span>
                      <span>{percentage !== null ? `${percentage}%` : 'තවම නැත'}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 border-2 border-black rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColorClass}`}
                        style={{ width: `${percentage !== null ? percentage : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mascot GodKG on Folder List Screen */}
      <div className="pt-4 flex justify-end">
        <GodKGMascot
          message={
            lessonFolders.length > 0
              ? 'ඕනෑම ෆෝල්ඩරයක් තෝරා Game Mode හෝ Edit Mode වෙත පිවිසෙන්න.'
              : 'ඉහත Add බොත්තම ඔබා ඔබේ පළමු ෆෝල්ඩරය සාදන්න!'
          }
        />
      </div>

      {/* MODAL 1: Create Folder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-comic text-xl text-white mb-2 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-amber-400" />
              <span>නව ෆෝල්ඩරයක් එකතු කිරීම</span>
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-4">
              {lesson.title} යටතේ නව උප මාතෘකාව හෝ කොටසේ නම ඇතුළත් කරන්න.
            </p>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  ෆෝල්ඩර නම (Folder Name)
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  maxLength={100}
                  required
                  placeholder="උදා: සෛල පටලය හා ප්‍රවාහනය"
                  className="w-full px-4 py-3 bg-slate-950 border-[3px] border-black rounded-2xl text-white placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_#000]"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border-2 border-black bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm cursor-pointer"
                >
                  අවලංගු කරන්න
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newFolderName.trim()}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn cursor-pointer ${
                    isCreating ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  {isCreating ? 'සාදමින්...' : 'ෆෝල්ඩරය සාදන්න'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tapping a Folder asks: Game mode or Edit mode */}
      {selectedFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 relative">
            <button
              onClick={() => setSelectedFolder(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/50">
                <Folder className="w-5 h-5" />
              </span>
              <h3 className="font-comic text-xl text-white truncate">
                {selectedFolder.name}
              </h3>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mb-5 font-medium">
              මෙම ෆෝල්ඩරය සඳහා ඔබට අවශ්‍ය කුමක්ද? තෝරන්න:
            </p>

            <div className="space-y-3">
              {/* Game Mode Choice */}
              <button
                onClick={() => {
                  const f = selectedFolder;
                  setSelectedFolder(null);
                  onSelectFolderGame(f);
                }}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 border-[3px] border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 border-2 border-black flex items-center justify-center text-slate-950">
                    <Gamepad2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="text-left">
                    <div className="font-comic text-lg tracking-wide">
                      GAME MODE
                    </div>
                    <div className="text-xs font-semibold text-slate-900">
                      ක්‍රීඩා කර මතකය පරීක්ෂා කරන්න
                    </div>
                  </div>
                </div>
                <Play className="w-5 h-5 fill-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Edit Mode Choice */}
              <button
                onClick={() => {
                  const f = selectedFolder;
                  setSelectedFolder(null);
                  onSelectFolderEdit(f);
                }}
                className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white border-[3px] border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-comic text-lg tracking-wide text-cyan-300">
                      EDIT MODE
                    </div>
                    <div className="text-xs font-medium text-slate-300">
                      කාඩ්පත් එකතු කිරීම, සංස්කරණය හෝ මකා දැමීම
                    </div>
                  </div>
                </div>
                <Edit3 className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
