import React, { useState } from 'react';
import { Languages, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from './sound.ts';

interface SpanishRuTextProps {
  es: string;
  ru: string;
  className?: string;
  highlight?: boolean;
  inline?: boolean;
  size?: 'sm' | 'base' | 'lg' | 'xl';
  showTranslateIcon?: boolean;
}

export const SpanishRuText: React.FC<SpanishRuTextProps> = ({
  es,
  ru,
  className = '',
  highlight = false,
  inline = false,
  size = 'base',
  showTranslateIcon = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setIsOpen(!isOpen);
  };

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg md:text-xl font-medium',
    xl: 'text-xl md:text-2xl font-bold',
  }[size];

  if (inline) {
    return (
      <span className="inline-block relative">
        <span
          onClick={toggle}
          className={`cursor-pointer border-b-2 border-dotted border-amber-400 hover:text-amber-300 transition-colors ${className}`}
          title="Toca para ver la traducción al ruso / Нажмите для перевода"
        >
          {es}
        </span>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="block text-xs font-normal text-amber-200 bg-black/60 px-2 py-0.5 rounded mt-0.5 shadow-md"
            >
              {ru}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    );
  }

  return (
    <div
      onClick={toggle}
      className={`group cursor-pointer select-none transition-all rounded-lg p-2 hover:bg-white/5 ${
        highlight ? 'bg-amber-500/10 border border-amber-500/30' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`${sizeClasses} text-white tracking-wide leading-relaxed`}>
          {es}
        </div>
        {showTranslateIcon && (
          <button
            type="button"
            aria-label="Traducir al ruso"
            className="shrink-0 p-1 rounded hover:bg-white/10 text-amber-400/80 hover:text-amber-300 transition-colors"
          >
            <Languages className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden mt-1.5 pt-1.5 border-t border-amber-500/30"
          >
            <p className="text-sm font-normal text-amber-200 flex items-center gap-1.5 italic">
              <span className="text-xs uppercase tracking-wider not-italic text-amber-400 font-semibold">RU:</span>
              {ru}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ChoiceTranslateButtonProps {
  ru: string;
}

export const ChoiceTranslateButton: React.FC<ChoiceTranslateButtonProps> = ({ ru }) => {
  const [show, setShow] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setShow(!show);
  };

  return (
    <div className="relative inline-flex items-center shrink-0">
      <button
        type="button"
        onClick={toggle}
        title="Ver traducción al ruso (no elige la respuesta)"
        className={`px-2 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1 ${
          show
            ? 'bg-amber-400 text-stone-900 shadow-md font-bold'
            : 'bg-black/30 hover:bg-black/50 text-amber-300 border border-amber-400/40'
        }`}
      >
        <Languages className="w-3.5 h-3.5" />
        <span>RU</span>
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute z-30 bottom-full mb-1 right-0 min-w-[140px] max-w-[220px] bg-stone-950 text-amber-200 text-xs px-2.5 py-1.5 rounded-md shadow-2xl border border-amber-400/60 leading-tight"
          >
            <div className="font-semibold text-[10px] text-amber-400 uppercase tracking-wider mb-0.5 flex items-center justify-between">
              <span>Traducción</span>
              <button
                type="button"
                onClick={toggle}
                className="text-white hover:text-red-300 ml-2"
              >
                ✕
              </button>
            </div>
            {ru}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TranslationNotice: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-xs text-amber-300/80 bg-black/30 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit">
      <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>
        💡 Toca cualquier texto o el botón <span className="text-amber-300 font-bold">[RU]</span> para ver su traducción al ruso.
      </span>
    </div>
  );
};
