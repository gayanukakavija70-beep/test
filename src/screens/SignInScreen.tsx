import React, { useState } from 'react';
import { useAuthData } from '../context/AuthDataContext';
import { useTheme } from '../context/ThemeContext';
import { GodKGMascot } from '../components/GodKGMascot';
import { Sparkles, Dna, ShieldCheck, Zap, Smartphone, Monitor } from 'lucide-react';

export const SignInScreen: React.FC = () => {
  const { loginWithGoogle, authLoading } = useAuthData();
  const { colorClasses } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Google පිවිසීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4 text-slate-100 relative overflow-hidden">
      {/* Decorative comic background elements */}
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10 space-y-6">
        {/* Main Comic Card */}
        <div className="bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
          {/* Top Banner Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border-2 border-black text-xs font-bold text-slate-300 mb-4 shadow-[2px_2px_0px_#000]">
            <Dna className="w-3.5 h-3.5 text-emerald-400" />
            <span>A/L Biology Flashcards in Sinhala</span>
          </div>

          {/* Title */}
          <h1 className="font-comic text-4xl sm:text-5xl tracking-wide text-white drop-shadow-[3px_3px_0px_#000] leading-none mb-2">
            KG RECALL
          </h1>
          <p className="font-display font-semibold text-lg text-emerald-400 tracking-tight mb-6">
            Decode Biology, Deck by Deck.
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
            ජීව විද්‍යාව විෂය නිර්දේශයේ සියලුම පාඩම් කාඩ්පත් මඟින් පහසුවෙන් මතක තබාගන්න. ජංගම දුරකථනයෙන් හා පරිගණකයෙන් සජීවීව සමමුහුර්ත වේ.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
            <div className="p-3 bg-slate-950/70 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000] flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">Active Recall</span>
                <span className="text-slate-400 text-[11px]">මතකය තහවුරු කිරීම</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000] flex items-center gap-2.5">
              <div className="flex items-center text-cyan-400">
                <Smartphone className="w-4 h-4" />
                <Monitor className="w-4 h-4 -ml-1" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Live Sync</span>
                <span className="text-slate-400 text-[11px]">Phone & PC එකවර</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-950/80 border-2 border-rose-500 rounded-xl text-xs text-rose-300 text-left font-medium">
              {errorMsg}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={loading || authLoading}
            className={`w-full py-3.5 px-6 rounded-2xl font-display font-bold text-base sm:text-lg text-slate-950 bg-white hover:bg-slate-100 active:bg-slate-200 manga-btn flex items-center justify-center gap-3 cursor-pointer ${
              loading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {/* Google Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.26v3.15C3.25 21.37 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.41l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.59l4.02 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
              />
            </svg>
            <span>{loading ? 'ඇතුල් වෙමින් පවතී...' : 'Google මඟින් පිවිසෙන්න'}</span>
          </button>

          <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>එක් වරක් පිවිසීමෙන් පසු නැවත ඇතුල් වීමට අවශ්‍ය නොවේ</span>
          </p>
        </div>

        {/* Mascot on Sign In */}
        <div className="flex justify-center sm:justify-end">
          <GodKGMascot
            message="ආයුබෝවන්! මම GodKG. ජීව විද්‍යාව විභාගයට සූදානම් වන ඔබට මම නිරන්තර මගපෙන්වන්නා වෙමි! ආරම්භ කිරීමට Google මඟින් පිවිසෙන්න."
          />
        </div>
      </div>
    </div>
  );
};
