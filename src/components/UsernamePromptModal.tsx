import React, { useState } from 'react';
import { useAuthData } from '../context/AuthDataContext';
import { useTheme } from '../context/ThemeContext';
import { GodKGMascot } from './GodKGMascot';
import { User, Check } from 'lucide-react';

export const UsernamePromptModal: React.FC = () => {
  const { user, saveUsername } = useAuthData();
  const { colorClasses } = useTheme();
  const [usernameInput, setUsernameInput] = useState<string>(
    user?.displayName || ''
  );
  const [saving, setSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    try {
      setSaving(true);
      await saveUsername(usernameInput);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-4">
        {/* Manga Panel */}
        <div className="bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 sm:p-7 relative">
          <div className="flex items-center gap-2 mb-3">
            <span className={`p-2 rounded-xl ${colorClasses.bg} text-slate-950 border-2 border-black shadow-[2px_2px_0px_#000]`}>
              <User className="w-5 h-5 stroke-[2.5]" />
            </span>
            <h2 className="font-comic text-xl sm:text-2xl text-white">
              ඔබගේ නම කුමක්ද?
            </h2>
          </div>

          <p className="text-slate-300 text-sm mb-5 font-medium">
            ජීව විද්‍යා අධ්‍යයන කාඩ්පත් ආරම්භ කිරීමට පෙර ඔබ අමතන නම ඇතුළත් කරන්න. (මෙය නැවත අසනු නොලැබේ).
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Username / නම
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                maxLength={50}
                required
                placeholder="උදා: කසුන් / Kasun"
                className="w-full px-4 py-3 bg-slate-950 border-[3px] border-black rounded-2xl text-white placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_#000]"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={saving || !usernameInput.trim()}
              className={`w-full py-3.5 px-6 rounded-2xl font-display font-bold text-base text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn flex items-center justify-center gap-2 cursor-pointer ${
                saving ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{saving ? 'සුරැකෙමින්...' : 'තහවුරු කර ඉදිරියට යන්න'}</span>
            </button>
          </form>
        </div>

        {/* GodKG Mascot guiding the user */}
        <div className="flex justify-center sm:justify-end">
          <GodKGMascot
            message="ඉහත කොටුවේ ඔබගේ නම සටහන් කරන්න! එතැන් පටන් මා ඔබව එම නමින් අමතන්නම්."
            compact
          />
        </div>
      </div>
    </div>
  );
};
