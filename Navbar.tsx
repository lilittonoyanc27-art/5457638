import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy } from 'lucide-react';
import { AppMode } from './types.ts';
import { sounds } from './sound.ts';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  points: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  points,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#07132e]/95 backdrop-blur-md border-b border-sky-900/60 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => {
            sounds.playClick();
            onSelectMode('home');
          }}
          className="text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-sky-500 flex items-center justify-center font-bold text-stone-950 text-base shadow-md border border-amber-300">
              ES
            </span>
            <div className="whitespace-nowrap">
              <span className="font-heading font-extrabold text-lg md:text-xl tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Olé Español
              </span>
              <span className="hidden sm:inline-block text-xs text-sky-400 font-bold ml-2">
                A1–A2
              </span>
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-200">
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('lessons');
            }}
            className={`whitespace-nowrap transition-colors hover:text-amber-300 pb-0.5 ${
              currentMode === 'lessons'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'text-stone-300'
            }`}
          >
            Lecciones
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('translate');
            }}
            className={`whitespace-nowrap transition-colors hover:text-amber-300 pb-0.5 ${
              currentMode === 'translate'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'text-stone-300'
            }`}
          >
            Traduce al español
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('reading');
            }}
            className={`whitespace-nowrap transition-colors hover:text-amber-300 pb-0.5 ${
              currentMode === 'reading'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'text-stone-300'
            }`}
          >
            Lectura
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('minigames');
            }}
            className={`whitespace-nowrap transition-colors hover:text-amber-300 pb-0.5 ${
              currentMode === 'minigames'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'text-stone-300'
            }`}
          >
            Juegos
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('millionaire');
            }}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              currentMode === 'millionaire'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow-lg scale-102'
                : 'bg-amber-400/15 text-amber-300 border border-amber-400/40 hover:bg-amber-400/25'
            }`}
          >
            ¿Millonario? 1.000.000 €
          </button>
        </nav>

        {/* Zone 3: Points, Sound toggle, Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            className="p-2 rounded-xl bg-[#0e214d]/80 hover:bg-[#152e69] border border-sky-800 text-amber-300 transition-colors shadow-sm"
            title={soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-300" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>

          {/* Points Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e214d]/90 border border-amber-500/40 text-xs font-bold text-amber-300 shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums">{points}</span>
            <span className="text-[10px] text-amber-200/70 font-normal">pts</span>
          </div>

          {/* Mobile switcher */}
          {currentMode === 'millionaire' ? (
            <button
              onClick={() => {
                sounds.playClick();
                onSelectMode('lessons');
              }}
              className="lg:hidden px-3 py-1.5 text-xs font-bold rounded-xl bg-sky-700 text-white hover:bg-sky-600 transition-colors whitespace-nowrap"
            >
              Lecciones
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                onSelectMode('millionaire');
              }}
              className="lg:hidden px-3 py-1.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow-md whitespace-nowrap flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Millonario
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
