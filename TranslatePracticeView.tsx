import React, { useState } from 'react';
import { Check, Lightbulb, Eye, RotateCcw, ArrowRight, ArrowLeft, CheckCircle2, XCircle, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRANSLATE_ITEMS } from './dataTranslate.ts';
import { LessonTopicId, TranslateItem } from './types.ts';
import { sounds } from './sound.ts';

interface TranslatePracticeViewProps {
  onAddPoints: (amount: number) => void;
  onRecordCompleted: (id: string) => void;
  completedIds: string[];
}

export const TranslatePracticeView: React.FC<TranslatePracticeViewProps> = ({
  onAddPoints,
  onRecordCompleted,
  completedIds,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<'all' | LessonTopicId>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    tested: boolean;
    isCorrect: boolean;
    feedbackRu: string;
  }>({
    tested: false,
    isCorrect: false,
    feedbackRu: '',
  });

  const filteredItems = TRANSLATE_ITEMS.filter((item) =>
    selectedTopic === 'all' ? true : item.topic === selectedTopic
  );

  const currentItem: TranslateItem = filteredItems[currentIndex] || filteredItems[0];

  const normalizeText = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[¿?¡!.,;:]/g, '')
      .replace(/\s+/g, ' ');
  };

  const handleCheck = () => {
    sounds.playClick();
    if (!userInput.trim()) return;

    const normalizedUser = normalizeText(userInput);
    const normalizedCanonical = normalizeText(currentItem.canonicalSpanish);
    const isAccepted =
      normalizedUser === normalizedCanonical ||
      currentItem.acceptableSpanish.some((acc) => normalizeText(acc) === normalizedUser);

    if (isAccepted) {
      sounds.playCorrect();
      setValidationResult({
        tested: true,
        isCorrect: true,
        feedbackRu: '¡Excelente traducción! Gramática y vocabulario correctos.',
      });
      onAddPoints(15);
      onRecordCompleted(currentItem.id);
    } else {
      sounds.playWrong();
      setValidationResult({
        tested: true,
        isCorrect: false,
        feedbackRu: currentItem.explanationRu || 'Revisa la ortografía, la concordancia o los acentos.',
      });
    }
  };

  const handleInsertChar = (char: string) => {
    sounds.playClick();
    setUserInput((prev) => prev + char);
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetItemState();
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetItemState();
    }
  };

  const resetItemState = () => {
    setUserInput('');
    setShowHint(false);
    setShowAnswer(false);
    setValidationResult({ tested: false, isCorrect: false, feedbackRu: '' });
  };

  const handleTopicChange = (topic: 'all' | LessonTopicId) => {
    sounds.playClick();
    setSelectedTopic(topic);
    setCurrentIndex(0);
    resetItemState();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0b1a3d] p-6 rounded-2xl border border-sky-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Sección Especial
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
              TRADUCE AL ESPAÑOL
            </h1>
            <p className="text-sm text-sky-100/90 mt-1">
              Переводите русские предложения на испанский язык и проверяйте правильность написания.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#06122d] px-3.5 py-1.5 rounded-xl border border-sky-700/80 text-xs text-amber-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-bold tabular-nums">
              {completedIds.length} / {TRANSLATE_ITEMS.length}
            </span>
            <span className="text-sky-200">completados</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-sky-900/60">
          <button
            onClick={() => handleTopicChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTopic === 'all'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            Todas las frases ({TRANSLATE_ITEMS.length})
          </button>
          <button
            onClick={() => handleTopicChange('weekdays')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTopic === 'weekdays'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            Días de la semana
          </button>
          <button
            onClick={() => handleTopicChange('numbers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTopic === 'numbers'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            Números 1–100
          </button>
          <button
            onClick={() => handleTopicChange('possessives')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTopic === 'possessives'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            Posesivos
          </button>
          <button
            onClick={() => handleTopicChange('interrogatives')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTopic === 'interrogatives'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            Interrogativos
          </button>
        </div>
      </div>

      {/* Main Translation Workbench */}
      <div className="bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between text-xs text-sky-200 pb-3 border-b border-sky-800">
          <span className="font-bold text-amber-400 uppercase">
            Frase {currentIndex + 1} de {filteredItems.length}
          </span>
          <span className="capitalize text-sky-100 font-medium">Tema: {currentItem.topic}</span>
        </div>

        {/* Russian Target Sentence */}
        <div className="bg-[#07132e] p-5 rounded-xl border border-sky-700/60 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
            Traducción al español de:
          </div>
          <div className="text-xl md:text-2xl font-bold text-white tracking-wide">
            «{currentItem.russianSentence}»
          </div>
        </div>

        {/* Spanish Input Field */}
        <div className="space-y-3">
          <label className="block text-xs uppercase font-bold text-sky-200">
            Tu respuesta en español:
          </label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCheck();
            }}
            placeholder="Escribe la frase en español aquí..."
            className="w-full bg-[#050e24] border-2 border-sky-700 focus:border-amber-400 text-white placeholder-stone-400 rounded-xl px-4 py-3 text-base md:text-lg focus:outline-none transition-colors shadow-inner"
          />

          {/* Quick Accents Toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-sky-200 mr-1 font-semibold">Caracteres especiales:</span>
            {['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'].map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => handleInsertChar(ch)}
                className="w-8 h-8 rounded-lg bg-[#0e2456] hover:bg-[#15367c] border border-sky-600 text-amber-300 font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Comprobar, Pista, Mostrar Respuesta */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleCheck}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 font-extrabold text-sm hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>COMPROBAR — Проверить</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setShowHint(!showHint);
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${
              showHint
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-[#0e2456] border-sky-700 text-stone-200 hover:text-white'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>PISTA — Подсказка</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setShowAnswer(!showAnswer);
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${
              showAnswer
                ? 'bg-orange-500/20 border-orange-400 text-orange-300'
                : 'bg-[#0e2456] border-sky-700 text-stone-200 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4 text-orange-400" />
            <span>MOSTRAR RESPUESTA — Показать ответ</span>
          </button>
        </div>

        {/* Hint Callout */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-500/10 border border-amber-400/40 p-4 rounded-xl space-y-1 text-xs"
            >
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Pistas de ayuda / Подсказка:</span>
              </div>
              <p className="text-white font-medium">Claves: {currentItem.hintEs}</p>
              <p className="text-sky-200 italic">{currentItem.hintRu}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed Canonical Answer */}
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-orange-500/15 border border-orange-400/40 p-4 rounded-xl space-y-2 text-xs"
            >
              <div className="font-bold text-orange-300">Respuesta modelo / Образцовый ответ:</div>
              <div className="text-base font-bold text-white tracking-wide">
                {currentItem.canonicalSpanish}
              </div>
              {currentItem.explanationRu && (
                <p className="text-sky-100 pt-1 leading-relaxed border-t border-orange-500/20">
                  {currentItem.explanationRu}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Result Banner */}
        <AnimatePresence>
          {validationResult.tested && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                validationResult.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-400/80 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/80 text-rose-200'
              }`}
            >
              {validationResult.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-sm">
                  {validationResult.isCorrect
                    ? '¡Correcto! (+15 pts)'
                    : 'Hay errores en la respuesta'}
                </div>
                {!validationResult.isCorrect && (
                  <div className="text-xs text-sky-100 font-medium">
                    Respuesta sugerida:{' '}
                    <span className="font-bold text-amber-300">
                      {currentItem.canonicalSpanish}
                    </span>
                  </div>
                )}
                <p className="text-xs text-sky-200 leading-relaxed">
                  {validationResult.feedbackRu}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation bottom bar */}
        <div className="flex items-center justify-between pt-4 border-t border-sky-800">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#102758] transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <button
            onClick={resetItemState}
            className="p-2 text-sky-300 hover:text-white transition-colors"
            title="Limpiar campo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === filteredItems.length - 1}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Siguiente frase</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
