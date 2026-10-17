import React, { useState } from 'react';
import { useAuthData } from '../context/AuthDataContext';
import { useTheme } from '../context/ThemeContext';
import { GodKGMascot } from '../components/GodKGMascot';
import { ThemeColor } from '../types';
import {
  User,
  MousePointer,
  Palette,
  LogOut,
  Save,
  Check,
  Sparkles,
  Smartphone,
  Monitor,
} from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
}

const ACCENT_OPTIONS: { id: ThemeColor; label: string; sinhalaName: string; hex: string; bgClass: string }[] = [
  { id: 'emerald', label: 'Bio Emerald', sinhalaName: 'හරිත සෛල', hex: '#10b981', bgClass: 'bg-emerald-500' },
  { id: 'cyan', label: 'Electric Cyan', sinhalaName: 'විද්‍යුත් නිල්', hex: '#06b6d4', bgClass: 'bg-cyan-500' },
  { id: 'amber', label: 'Plasma Amber', sinhalaName: 'ප්ලාස්මා කහ', hex: '#f59e0b', bgClass: 'bg-amber-500' },
  { id: 'pink', label: 'Cyber Pink', sinhalaName: 'සයිබර් රෝස', hex: '#ec4899', bgClass: 'bg-pink-500' },
  { id: 'purple', label: 'RNA Purple', sinhalaName: 'RNA දම්', hex: '#a855f7', bgClass: 'bg-purple-500' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { profile, updateProfileSettings, logout } = useAuthData();
  const { accentColor, setAccentColor, customCursor, setCustomCursor, colorClasses } = useTheme();

  const [usernameInput, setUsernameInput] = useState<string>(profile?.username || '');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    try {
      setIsSavingProfile(true);
      await updateProfileSettings({ username: usernameInput.trim() });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleColorChange = async (color: ThemeColor) => {
    setAccentColor(color);
    try {
      await updateProfileSettings({ accentColor: color });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCursorToggle = async (enabled: boolean) => {
    setCustomCursor(enabled);
    try {
      await updateProfileSettings({ customCursor: enabled });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('ඔබට නිසැකවම ගිණුමෙන් පිටවීමට අවශ්‍යද? (Sign Out)')) {
      await logout();
      onBack();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <h1 className="font-comic text-2xl sm:text-3xl text-white tracking-wide">
          සැකසුම් (SETTINGS)
        </h1>
      </div>

      {/* 1. Change Username */}
      <div className="bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_#000] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`p-2 rounded-xl ${colorClasses.bg} text-slate-950 border-2 border-black shadow-[2px_2px_0px_#000]`}>
              <User className="w-5 h-5 stroke-[2.5]" />
            </span>
            <h2 className="font-comic text-lg sm:text-xl text-white">
              පරිශීලක නම (Change Username)
            </h2>
          </div>

          {savedNotice && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>සුරැකිණි!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveUsername} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              maxLength={50}
              required
              className="flex-1 px-4 py-2.5 bg-slate-950 border-[3px] border-black rounded-2xl text-white font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_#000]"
            />
            <button
              type="submit"
              disabled={isSavingProfile || !usernameInput.trim()}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn flex items-center justify-center gap-2 cursor-pointer ${
                isSavingProfile ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSavingProfile ? 'සුරැකෙමින්...' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Choose Accent Colour (5 choices) */}
      <div className="bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_#000] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border-2 border-purple-400 shadow-[2px_2px_0px_#000]">
            <Palette className="w-5 h-5 stroke-[2.5]" />
          </span>
          <div>
            <h2 className="font-comic text-lg sm:text-xl text-white">
              තේමා වර්ණය (Accent Colour - 5 Choices)
            </h2>
            <p className="text-xs text-slate-400">
              යෙදුමේ ප්‍රධාන අංග සඳහා කැමති වර්ණයක් තෝරන්න
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {ACCENT_OPTIONS.map((opt) => {
            const isSelected = accentColor === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleColorChange(opt.id)}
                className={`p-3 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_#000] flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 scale-105 ring-2 ring-white shadow-[4px_4px_0px_#000]'
                    : 'bg-slate-950 hover:bg-slate-800'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 border-black shadow-[1px_1px_0px_#000] flex items-center justify-center ${opt.bgClass}`}
                >
                  {isSelected && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-white block">
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {opt.sinhalaName}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Biological Cell Cursor Toggle */}
      <div className="bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_#000] rounded-3xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400 shadow-[2px_2px_0px_#000]">
              <MousePointer className="w-5 h-5 stroke-[2.5]" />
            </span>
            <div>
              <h2 className="font-comic text-lg sm:text-xl text-white">
                ජෛව සෛල කර්සරය (Bio Cell Cursor)
              </h2>
              <p className="text-xs text-slate-400">
                න්‍යෂ්ටියක් සහිත සෛලයක හැඩැති සජීවී මවුස් කර්සරය
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => handleCursorToggle(!customCursor)}
            className={`w-14 h-8 rounded-full border-2 border-black p-1 transition-colors relative cursor-pointer shadow-[2px_2px_0px_#000] ${
              customCursor ? colorClasses.bg : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-slate-950 border border-black transition-transform ${
                customCursor ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. Sign Out */}
      <div className="bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_#000] rounded-3xl p-5 sm:p-6 flex items-center justify-between">
        <div>
          <h2 className="font-comic text-base sm:text-lg text-white">
            ගිණුමෙන් ඉවත්වීම (Sign Out)
          </h2>
          <p className="text-xs text-slate-400">
            {profile?.email || 'Logged in via Google'}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="px-4 py-2.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl manga-btn border-2 border-black text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* GODKG MASCOT ON SETTINGS SCREEN */}
      <div className="pt-2 flex justify-end">
        <GodKGMascot
          message="මෙහිදී ඔබ කැමති තේමා වර්ණය සහ ජෛව සෛල කර්සරය සකසා ගත හැක!"
        />
      </div>
    </div>
  );
};
