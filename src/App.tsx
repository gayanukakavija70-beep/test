import React, { useState } from 'react';
import { AuthDataProvider, useAuthData } from './context/AuthDataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { UsernamePromptModal } from './components/UsernamePromptModal';
import { SignInScreen } from './screens/SignInScreen';
import { HomeScreen } from './screens/HomeScreen';
import { FolderListScreen } from './screens/FolderListScreen';
import { EditModeScreen } from './screens/EditModeScreen';
import { GameSetupScreen } from './screens/GameSetupScreen';
import { GamePlayScreen } from './screens/GamePlayScreen';
import { GameResultScreen } from './screens/GameResultScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { GameSessionSummary, LessonFolder, PlayMode, Screen } from './types';
import { BIOLOGY_LESSONS } from './data/lessons';

function AppContent() {
  const { user, authLoading, profile, profileLoading, folders } = useAuthData();
  const [screen, setScreen] = useState<Screen>({ type: 'home' });

  // Loading state while Firebase auth initializes
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-8 text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center animate-spin">
            <div className="w-5 h-5 rounded-full border-2 border-emerald-400 border-t-transparent" />
          </div>
          <h2 className="font-comic text-xl text-white">KG RECALL</h2>
          <p className="text-slate-400 text-xs font-semibold">
            සෛලීය දත්ත පූරණය වෙමින් පවතී... (Loading Data)
          </p>
        </div>
      </div>
    );
  }

  // If not signed in with Google, show Sign In Screen
  if (!user) {
    return <SignInScreen />;
  }

  // First time sign-in: ask once for a username and never ask again
  const showUsernameModal = user && !profile && !profileLoading;

  // Navigation handlers
  const handleBack = () => {
    switch (screen.type) {
      case 'folders':
        setScreen({ type: 'home' });
        break;
      case 'edit':
        setScreen({ type: 'folders', lessonId: screen.lessonId });
        break;
      case 'game_setup':
        setScreen({ type: 'folders', lessonId: screen.lessonId });
        break;
      case 'game_play':
        setScreen({ type: 'folders', lessonId: screen.lessonId });
        break;
      case 'game_result':
        setScreen({ type: 'home' });
        break;
      case 'settings':
        setScreen({ type: 'home' });
        break;
      default:
        setScreen({ type: 'home' });
        break;
    }
  };

  const getHeaderTitle = () => {
    switch (screen.type) {
      case 'folders': {
        const lesson = BIOLOGY_LESSONS.find((l) => l.id === screen.lessonId);
        return lesson ? `පාඩම ${lesson.number}` : 'FOLDERS';
      }
      case 'edit':
        return 'EDIT MODE';
      case 'game_setup':
        return 'GAME SETUP';
      case 'game_play':
        return 'GAME IN PROGRESS';
      case 'game_result':
        return 'RESULTS';
      case 'settings':
        return 'SETTINGS';
      default:
        return 'KG RECALL';
    }
  };

  const getHeaderSubtitle = () => {
    switch (screen.type) {
      case 'folders': {
        const lesson = BIOLOGY_LESSONS.find((l) => l.id === screen.lessonId);
        return lesson?.title || '';
      }
      case 'edit':
        return 'Add or modify flashcards';
      case 'game_setup':
        return 'Select study order';
      case 'game_play':
        return 'Active recall session';
      case 'game_result':
        return 'Performance summary';
      case 'settings':
        return 'Preferences & themes';
      default:
        return 'Decode Biology, Deck by Deck.';
    }
  };

  return (
    <div className="min-h-screen halftone-bg flex flex-col text-slate-100">
      {/* Top Header */}
      <Header
        showBack={screen.type !== 'home'}
        onBack={handleBack}
        onOpenSettings={() => setScreen({ type: 'settings' })}
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {screen.type === 'home' && (
          <HomeScreen
            onSelectLesson={(lessonId) => setScreen({ type: 'folders', lessonId })}
            onOpenFolderDirect={(folder) =>
              setScreen({ type: 'game_setup', folderId: folder.id, lessonId: folder.lessonId })
            }
          />
        )}

        {screen.type === 'folders' && (
          <FolderListScreen
            lessonId={screen.lessonId}
            onSelectFolderGame={(folder) =>
              setScreen({ type: 'game_setup', folderId: folder.id, lessonId: screen.lessonId })
            }
            onSelectFolderEdit={(folder) =>
              setScreen({ type: 'edit', folderId: folder.id, lessonId: screen.lessonId })
            }
          />
        )}

        {screen.type === 'edit' && (() => {
          const folder = folders.find((f) => f.id === screen.folderId);
          if (!folder) {
            return (
              <div className="p-8 text-center text-slate-400">
                ෆෝල්ඩරය හමු නොවීය.{' '}
                <button onClick={handleBack} className="text-emerald-400 underline font-bold">
                  ආපසු යන්න
                </button>
              </div>
            );
          }
          return (
            <EditModeScreen
              folder={folder}
              lessonId={screen.lessonId}
              onBack={handleBack}
            />
          );
        })()}

        {screen.type === 'game_setup' && (() => {
          const folder = folders.find((f) => f.id === screen.folderId);
          if (!folder) {
            return (
              <div className="p-8 text-center text-slate-400">
                ෆෝල්ඩරය හමු නොවීය.{' '}
                <button onClick={handleBack} className="text-emerald-400 underline font-bold">
                  ආපසු යන්න
                </button>
              </div>
            );
          }
          return (
            <GameSetupScreen
              folder={folder}
              lessonId={screen.lessonId}
              onStartGame={(playMode: PlayMode) =>
                setScreen({
                  type: 'game_play',
                  folderId: folder.id,
                  lessonId: screen.lessonId,
                  playMode,
                })
              }
              onBack={handleBack}
            />
          );
        })()}

        {screen.type === 'game_play' && (() => {
          const folder = folders.find((f) => f.id === screen.folderId);
          if (!folder) {
            return (
              <div className="p-8 text-center text-slate-400">
                ෆෝල්ඩරය හමු නොවීය.{' '}
                <button onClick={handleBack} className="text-emerald-400 underline font-bold">
                  ආපසු යන්න
                </button>
              </div>
            );
          }
          return (
            <GamePlayScreen
              folder={folder}
              lessonId={screen.lessonId}
              playMode={screen.playMode}
              onFinishGame={(summary: GameSessionSummary) =>
                setScreen({ type: 'game_result', summary })
              }
              onExit={handleBack}
            />
          );
        })()}

        {screen.type === 'game_result' && (
          <GameResultScreen
            summary={screen.summary}
            onPlayAgain={() =>
              setScreen({
                type: 'game_setup',
                folderId: screen.summary.folderId,
                lessonId: screen.summary.lessonId,
              })
            }
            onBackToFolders={() =>
              setScreen({ type: 'folders', lessonId: screen.summary.lessonId })
            }
            onGoHome={() => setScreen({ type: 'home' })}
          />
        )}

        {screen.type === 'settings' && (
          <SettingsScreen onBack={() => setScreen({ type: 'home' })} />
        )}
      </main>

      {/* One-time Username onboarding modal */}
      {showUsernameModal && <UsernamePromptModal />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthDataProvider>
        <AppContent />
      </AuthDataProvider>
    </ThemeProvider>
  );
}
