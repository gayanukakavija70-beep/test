import React from 'react';
import { ArrowLeft, Settings as SettingsIcon, CloudCheck, RefreshCw, WifiOff, Sparkles } from 'lucide-react';
import { useAuthData } from '../context/AuthDataContext';
import { useTheme } from '../context/ThemeContext';
import { SyncStatus } from '../types';

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  onOpenSettings?: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onBack,
  showBack = false,
  onOpenSettings,
  title,
  subtitle,
}) => {
  const { syncStatus, profile, user } = useAuthData();
  const { colorClasses } = useTheme();

  const renderSyncBadge = (status: SyncStatus) => {
    switch (status) {
      case 'synced':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border-2 border-emerald-500 rounded-full text-emerald-300 text-xs font-semibold shadow-[2px_2px_0px_#000]">
            <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">සමමුහුර්තයි</span>
            <span className="sm:hidden">Sync</span>
          </div>
        );
      case 'saving':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/80 border-2 border-amber-500 rounded-full text-amber-300 text-xs font-semibold shadow-[2px_2px_0px_#000] animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="hidden sm:inline">සුරැකෙමින්...</span>
            <span className="sm:hidden">Saving</span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-950/80 border-2 border-rose-500 rounded-full text-rose-300 text-xs font-semibold shadow-[2px_2px_0px_#000]">
            <WifiOff className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">නොබැඳි</span>
            <span className="sm:hidden">Offline</span>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/90 backdrop-blur-md border-b-[3px] border-black px-3 sm:px-6 py-2.5 sm:py-3 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Back button or Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="ආපසු යන්න (Back)"
              className="p-2 sm:p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl manga-btn border-[2px] border-black flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : null}

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${colorClasses.bg} border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000] text-slate-950`}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-comic text-lg sm:text-2xl tracking-wide text-white drop-shadow-[2px_2px_0px_#000]">
                  {title || 'KG RECALL'}
                </h1>
                <span className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded border border-black ${colorClasses.bg} text-slate-950 shadow-[1px_1px_0px_#000]`}>
                  BIO
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-tight -mt-0.5 hidden xs:block">
                {subtitle || 'Decode Biology, Deck by Deck.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Sync indicator & Settings button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {renderSyncBadge(syncStatus)}

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              aria-label="සැකසුම් (Settings)"
              className="p-2 sm:p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl manga-btn border-[2px] border-black flex items-center justify-center cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {user && (
            <div
              onClick={onOpenSettings}
              className="cursor-pointer hidden sm:flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-900 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]"
              title={profile?.username || user.displayName || 'User Profile'}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={profile?.username || 'Avatar'}
                  className="w-6 h-6 rounded-lg border border-black object-cover"
                />
              ) : (
                <div className={`w-6 h-6 rounded-lg ${colorClasses.bg} text-slate-950 font-bold text-xs flex items-center justify-center border border-black`}>
                  {(profile?.username || user.displayName || 'K')[0].toUpperCase()}
                </div>
              )}
              <span className="text-xs font-bold text-slate-200 max-w-[100px] truncate">
                {profile?.username || user.displayName || 'User'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
