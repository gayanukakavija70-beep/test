import React, { useState } from 'react';
import { GODKG_NORMAL, GODKG_GLOWING } from '../assets/mascot';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GodKGMascotProps {
  message: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
}

export const GodKGMascot: React.FC<GodKGMascotProps> = ({
  message,
  actionButton,
  compact = false,
}) => {
  const [isGlowing, setIsGlowing] = useState<boolean>(false);
  const { colorClasses } = useTheme();

  const handleTouch = () => {
    setIsGlowing(true);
    setTimeout(() => {
      setIsGlowing(false);
    }, 1500);
  };

  return (
    <div
      className={`relative z-20 flex select-none transition-all duration-300 ${
        compact
          ? 'items-end justify-end'
          : 'flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4'
      }`}
    >
      {/* Speech Bubble */}
      <div
        className={`relative bg-white text-slate-900 border-[3px] border-black shadow-[4px_4px_0px_#000] p-3 sm:p-4 rounded-2xl max-w-xs sm:max-w-sm transition-all duration-200 ${
          compact ? 'mb-2 text-xs sm:text-sm shadow-[3px_3px_0px_#000]' : 'text-sm sm:text-base'
        }`}
      >
        {/* Tail */}
        <div className="hidden sm:block absolute -right-3 bottom-5 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-black" />
        <div className="hidden sm:block absolute -right-2 bottom-5 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-white" />

        {/* Small badge */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${colorClasses.bg} border border-black`} />
          <span className="font-comic text-[11px] tracking-wider text-slate-800 uppercase">
            GodKG Bio-Guardian
          </span>
          {isGlowing && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-400 animate-pulse">
              <Sparkles className="w-3 h-3" /> Bio-Energy
            </span>
          )}
        </div>

        {/* Message */}
        <p className="font-medium text-slate-900 leading-snug">
          {message}
        </p>

        {/* Action Button inside Speech Bubble if provided */}
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className={`mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn`}
          >
            <span>{actionButton.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Mascot Sprite Container */}
      <div
        onMouseEnter={() => setIsGlowing(true)}
        onMouseLeave={() => setIsGlowing(false)}
        onTouchStart={handleTouch}
        onClick={handleTouch}
        className="relative cursor-pointer group flex-shrink-0 transition-transform duration-200 active:scale-95"
        title="GodKG (Hover or touch to activate bio-glow!)"
      >
        {/* Halo aura when glowing */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 pointer-events-none ${
            isGlowing ? 'opacity-80 bg-emerald-400/50 scale-110' : 'opacity-0'
          }`}
        />

        {/* Pixel Art Frame */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-[3px] border-black shadow-[4px_4px_0px_#000] bg-slate-900">
          {/* Normal image */}
          <img
            src={GODKG_NORMAL}
            alt="GodKG Biology Hero"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isGlowing ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Glowing Eyes image */}
          <img
            src={GODKG_GLOWING}
            alt="GodKG Glowing Eyes"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isGlowing ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Comic corner stamp */}
          <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/50">
            GK
          </div>
        </div>
      </div>
    </div>
  );
};
