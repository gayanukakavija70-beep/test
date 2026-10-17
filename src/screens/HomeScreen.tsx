import React, { useMemo, useState } from 'react';
import { useAuthData } from '../context/AuthDataContext';
import { useTheme } from '../context/ThemeContext';
import { BIOLOGY_LESSONS } from '../data/lessons';
import { GodKGMascot } from '../components/GodKGMascot';
import { LessonFolder } from '../types';
import {
  Folder,
  Layers,
  AlertCircle,
  PlayCircle,
  Sparkles,
  ChevronRight,
  BookOpen,
  Microscope,
  Dna,
  GitBranch,
  Sprout,
  HeartPulse,
  Share2,
  Binary,
  Trees,
  Bug,
  FlaskConical,
} from 'lucide-react';

interface HomeScreenProps {
  onSelectLesson: (lessonId: number) => void;
  onOpenFolderDirect: (folder: LessonFolder) => void;
}

const LESSON_ICONS: Record<string, React.ElementType> = {
  Microscope,
  Dna,
  GitBranch,
  Sprout,
  HeartPulse,
  Share2,
  Binary,
  Trees,
  Bug,
  FlaskConical,
};

const GODKG_VISIT_QUESTIONS = [
  'අද ඔබ බලාපොරොත්තු වන්නේ මොනවාද? ජීව විද්‍යාව නැවත මතක් කරගනිමු!',
  'අද මොන පාඩමද කරන්නේ? පහතින් ඔබ කැමති පාඩමක් තෝරන්න.',
  'ජීවයේ රහස් සොයා යන්න! Deck එකෙන් Deck එකට විභාගය ජයගනිමු.',
  'අද දින පුහුණුව මඟින් ඔබේ විභාග ලකුණු ඉහළ නංවාගන්න!',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectLesson,
  onOpenFolderDirect,
}) => {
  const { profile, folders, cards, seedStarterDecks } = useAuthData();
  const { colorClasses } = useTheme();

  // Random prompt for GodKG on each visit
  const [mascotMessageIndex] = useState<number>(() =>
    Math.floor(Math.random() * GODKG_VISIT_QUESTIONS.length)
  );

  // Compute lesson statistics: folders count and cards count per lesson
  const lessonStats = useMemo(() => {
    const stats: Record<number, { foldersCount: number; cardsCount: number }> = {};
    for (let i = 1; i <= 10; i++) {
      const lessonFolders = folders.filter((f) => f.lessonId === i);
      const lessonFolderIds = new Set(lessonFolders.map((f) => f.id));
      const lessonCards = cards.filter((c) => lessonFolderIds.has(c.folderId));
      stats[i] = {
        foldersCount: lessonFolders.length,
        cardsCount: lessonCards.length,
      };
    }
    return stats;
  }, [folders, cards]);

  // Priority Attention Folder algorithm:
  // "Directly below it, a prominent panel highlighting the folder that needs attention most:
  //  a never-practised folder first, otherwise the folder with the lowest score.
  //  Label it with the folder name, for example:
  //  'ඔබට මේක අමතකයි: [folder name]' (red) or 'තවම පුහුණු වී නැත: [folder name]' (amber).
  //  Tapping it opens that folder."
  const priorityFolderData = useMemo<{
    folder: LessonFolder;
    type: 'never_practised' | 'lowest_score';
    label: string;
  } | null>(() => {
    if (folders.length === 0) return null;

    // 1. Check for never-practised folder (lastPercentage === null)
    const neverPractised = folders.find((f) => f.lastPercentage === null);
    if (neverPractised) {
      return {
        folder: neverPractised,
        type: 'never_practised',
        label: `තවම පුහුණු වී නැත: ${neverPractised.name}`,
      };
    }

    // 2. Otherwise find the folder with lowest score
    let lowest = folders[0];
    for (const f of folders) {
      const currentScore = f.lastPercentage ?? 100;
      const lowestScore = lowest.lastPercentage ?? 100;
      if (currentScore < lowestScore) {
        lowest = f;
      }
    }

    return {
      folder: lowest,
      type: 'lowest_score',
      label: `ඔබට මේක අමතකයි: ${lowest.name}`,
    };
  }, [folders]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* 1. GREETING AT THE VERY TOP */}
      <div className="bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_#000] rounded-3xl p-5 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-block w-3 h-3 rounded-full ${colorClasses.bg} border border-black`} />
              <span className="font-comic text-xs uppercase tracking-wider text-slate-400">
                Daily Bio Dashboard
              </span>
            </div>
            <h1 className="font-comic text-2xl sm:text-3xl text-white tracking-wide">
              Hi {profile?.username || 'ජීව විද්‍යා මිතුරා'}! 👋
            </h1>
            <p className="text-slate-300 font-medium text-sm sm:text-base mt-1">
              ඔබ අද ප්රැක්ටිස් කරනවද? අලුත් card එකක් හදමුද?
            </p>
          </div>

          {folders.length === 0 && (
            <button
              onClick={() => seedStarterDecks()}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn self-start sm:self-auto cursor-pointer`}
            >
              <Sparkles className="w-4 h-4" />
              <span>ආදර්ශ Decks එකතු කරන්න</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. PROMINENT PRIORITY ATTENTION PANEL */}
      {priorityFolderData && (
        <div
          onClick={() => onOpenFolderDirect(priorityFolderData.folder)}
          className={`cursor-pointer border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-5 sm:p-6 transition-transform hover:-translate-y-0.5 active:translate-y-1 relative overflow-hidden ${
            priorityFolderData.type === 'lowest_score'
              ? 'bg-rose-950/90 hover:bg-rose-900/90'
              : 'bg-amber-950/90 hover:bg-amber-900/90'
          }`}
        >
          {/* Halftone / Comic Corner Tag */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black text-xs font-bold uppercase shadow-[2px_2px_0px_#000] ${
                priorityFolderData.type === 'lowest_score'
                  ? 'bg-rose-500 text-slate-950'
                  : 'bg-amber-400 text-slate-950'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>
                {priorityFolderData.type === 'lowest_score'
                  ? 'අවධානය අවශ්‍යයි (Needs Review)'
                  : 'නව පුහුණුව (Unpractised)'}
              </span>
            </span>

            <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <span>Game වෙත යන්න</span>
              <PlayCircle className="w-4 h-4 text-white" />
            </span>
          </div>

          <h2
            className={`font-comic text-xl sm:text-2xl tracking-wide ${
              priorityFolderData.type === 'lowest_score' ? 'text-rose-200' : 'text-amber-200'
            }`}
          >
            {priorityFolderData.label}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Folder className="w-4 h-4" />
              <span>පාඩම {priorityFolderData.folder.lessonId}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>කාඩ්පත් {priorityFolderData.folder.cardCount || 0} ක්</span>
            </span>
            {priorityFolderData.folder.lastPercentage !== null ? (
              <span className="font-bold text-rose-400">
                පසුගිය ලකුණු: {priorityFolderData.folder.lastPercentage}%
              </span>
            ) : (
              <span className="font-bold text-amber-400">තවම ක්‍රීඩා කර නැත</span>
            )}
          </div>
        </div>
      )}

      {/* 3. TABLE OF CONTENTS: 10 FIXED LESSONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="font-comic text-xl sm:text-2xl text-white tracking-wide">
              ප්‍රධාන පාඩම් (Table of Contents)
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg">
            පාඩම් 10 යි
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {BIOLOGY_LESSONS.map((lesson) => {
            const stats = lessonStats[lesson.id] || { foldersCount: 0, cardsCount: 0 };
            const IconComponent = LESSON_ICONS[lesson.iconName] || Microscope;

            return (
              <div
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className="group cursor-pointer bg-slate-900 hover:bg-slate-850 border-[3px] border-black rounded-2xl p-4 sm:p-4.5 shadow-[4px_4px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-all flex items-center justify-between gap-3 active:translate-x-0.5 active:translate-y-0.5"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Number Badge */}
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 border-2 border-black flex-shrink-0 flex items-center justify-center shadow-[2px_2px_0px_#000] text-emerald-400 group-hover:scale-105 transition-transform`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-comic px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-black">
                        #{lesson.number}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-white truncate group-hover:text-emerald-400 transition-colors">
                        {lesson.title}
                      </h3>
                    </div>

                    <p className="text-slate-400 text-xs truncate mt-0.5">
                      {lesson.englishTitle}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-300 font-semibold">
                      <span className="flex items-center gap-1">
                        <Folder className="w-3.5 h-3.5 text-amber-400" />
                        <span>{stats.foldersCount} ෆෝල්ඩර</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{stats.cardsCount} කාඩ්පත්</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 text-slate-500 group-hover:text-emerald-400 transition-colors">
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. GODKG MASCOT ON HOME SCREEN */}
      {/* On desktop: anchored at bottom right; on mobile: integrated or bottom corner */}
      <div className="pt-4 flex justify-end">
        <GodKGMascot
          message={
            priorityFolderData
              ? `"${priorityFolderData.folder.name}" සඳහා පුහුණුවක් ආරම්භ කරමුද?`
              : GODKG_VISIT_QUESTIONS[mascotMessageIndex]
          }
          actionButton={
            priorityFolderData
              ? {
                  label: 'පුහුණු වෙමු',
                  onClick: () => onOpenFolderDirect(priorityFolderData.folder),
                }
              : undefined
          }
        />
      </div>
    </div>
  );
};
