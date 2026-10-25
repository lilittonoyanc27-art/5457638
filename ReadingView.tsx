import React, { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Filter, MessageSquareQuote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { READING_STORIES } from './dataReadings.ts';
import { TextStory, ReadingSentence } from './types.ts';
import { ChoiceTranslateButton, TranslationNotice } from './spanishRuText.tsx';
import { sounds } from './sound.ts';

interface ReadingViewProps {
  onAddPoints: (amount: number) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ onAddPoints }) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>('ana-semana');
  const [highlightFilter, setHighlightFilter] = useState<'all' | 'day' | 'number' | 'possessive' | 'question'>('all');

  // Sub-tabs for post-reading exercises
  const [readingSubTab, setReadingSubTab] = useState<
    'text' | 'comprehension' | 'truefalse' | 'multiplechoice' | 'blanks' | 'grammar' | 'retell'
  >('text');

  // Translation active set for clicked sentences
  const [openSentenceIds, setOpenSentenceIds] = useState<Set<string>>(new Set());

  // Question indices & state for post-reading
  const [qIndex, setQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const story: TextStory =
    READING_STORIES.find((s) => s.id === selectedStoryId) || READING_STORIES[0];

  const toggleSentenceTranslation = (id: string) => {
    sounds.playClick();
    setOpenSentenceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectStory = (id: string) => {
    sounds.playClick();
    setSelectedStoryId(id);
    setReadingSubTab('text');
    setOpenSentenceIds(new Set());
    setQIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleSelectSubTab = (tab: typeof readingSubTab) => {
    sounds.playClick();
    setReadingSubTab(tab);
    setQIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  // Generic handler for post-reading questions
  const handleCheckAnswer = (chosen: number | string, correct: number | string) => {
    if (isAnswered) return;
    setSelectedAnswer(chosen);
    setIsAnswered(true);

    const right = chosen === correct;
    setIsCorrect(right);
    if (right) {
      sounds.playCorrect();
      onAddPoints(10);
    } else {
      sounds.playWrong();
    }
  };

  const nextQuestion = (maxLen: number) => {
    sounds.playClick();
    if (qIndex < maxLen - 1) {
      setQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const prevQuestion = () => {
    sounds.playClick();
    if (qIndex > 0) {
      setQIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Story Tabs */}
      <div className="bg-[#0b1a3d] p-3 rounded-2xl border border-sky-800 flex flex-wrap gap-2 shadow-xl">
        {READING_STORIES.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelectStory(s.id)}
            className={`px-4 py-2.5 rounded-xl text-left transition-all flex-1 min-w-[200px] ${
              selectedStoryId === s.id
                ? 'bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 border-2 border-amber-400 text-white shadow-md'
                : 'hover:bg-white/5 text-stone-300'
            }`}
          >
            <div className="font-heading font-extrabold text-sm md:text-base">{s.titleEs}</div>
            <div className="text-xs text-sky-200">{s.titleRu}</div>
          </button>
        ))}
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-sky-900/60">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
            {story.titleEs}
          </h1>
          <p className="text-sm text-sky-200 mt-1 max-w-2xl">{story.descriptionRu}</p>
        </div>

        {/* Post-reading Navigation Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#07132e] rounded-xl border border-sky-800 text-xs font-semibold">
          <button
            onClick={() => handleSelectSubTab('text')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              readingSubTab === 'text'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Texto / Текст
          </button>
          <button
            onClick={() => handleSelectSubTab('comprehension')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              readingSubTab === 'comprehension'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Comprensión ({story.comprehensionQuestions.length})
          </button>
          <button
            onClick={() => handleSelectSubTab('truefalse')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              readingSubTab === 'truefalse'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Verdadero / Falso ({story.trueFalseTasks.length})
          </button>
          <button
            onClick={() => handleSelectSubTab('multiplechoice')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              readingSubTab === 'multiplechoice'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Tests ({story.multipleChoiceTests.length})
          </button>
          <button
            onClick={() => handleSelectSubTab('blanks')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              readingSubTab === 'blanks'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Huecos ({story.blankExercises.length})
          </button>
          <button
            onClick={() => handleSelectSubTab('grammar')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              readingSubTab === 'grammar'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Gramática ({story.grammarQuestions.length})
          </button>
          <button
            onClick={() => handleSelectSubTab('retell')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              readingSubTab === 'retell'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Preguntas clave
          </button>
        </div>
      </div>

      <TranslationNotice />

      {/* Sub-Tab 1: Reading Text */}
      {readingSubTab === 'text' && (
        <div className="space-y-6">
          {/* Highlighter Controls */}
          <div className="bg-[#0b1a3d] p-3 rounded-xl border border-sky-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-sky-200 font-semibold">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Resaltar elementos en el texto:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setHighlightFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  highlightFilter === 'all'
                    ? 'bg-white text-stone-950 font-bold'
                    : 'bg-[#07132e] text-stone-400'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setHighlightFilter('day')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  highlightFilter === 'day'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'bg-[#07132e] text-amber-300'
                }`}
              >
                Días de la semana
              </button>
              <button
                onClick={() => setHighlightFilter('number')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  highlightFilter === 'number'
                    ? 'bg-orange-500 text-white font-bold'
                    : 'bg-[#07132e] text-orange-300'
                }`}
              >
                Números 1–100
              </button>
              <button
                onClick={() => setHighlightFilter('possessive')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  highlightFilter === 'possessive'
                    ? 'bg-sky-500 text-white font-bold'
                    : 'bg-[#07132e] text-sky-300'
                }`}
              >
                Posesivos (mi/mío)
              </button>
            </div>
          </div>

          {/* Interactive Text Paragraphs */}
          <div className="bg-[#0b1a3d] p-6 md:p-10 rounded-2xl border-2 border-sky-600/50 shadow-2xl space-y-4 leading-relaxed">
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center justify-between border-b border-sky-800 pb-3">
              <span>Nivel A1–A2 · Presente de Indicativo</span>
              <span className="text-sky-200">Toca cada frase para ver su traducción</span>
            </div>

            <div className="space-y-3 pt-2">
              {story.sentences.map((sent: ReadingSentence, index: number) => {
                const isOpen = openSentenceIds.has(sent.id);
                const isFiltered =
                  highlightFilter === 'all' ||
                  (sent.highlightTypes && sent.highlightTypes.includes(highlightFilter));

                return (
                  <div
                    key={sent.id}
                    onClick={() => toggleSentenceTranslation(sent.id)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isOpen
                        ? 'bg-[#10295e] border-amber-400 shadow-md'
                        : isFiltered && highlightFilter !== 'all'
                        ? 'bg-white/10 border-sky-400'
                        : 'hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xs text-amber-400 font-mono pt-1 select-none font-bold">
                          {index + 1}.
                        </span>
                        <span
                          className={`text-base md:text-lg text-white tracking-wide ${
                            isFiltered && highlightFilter !== 'all' ? 'font-semibold text-amber-200' : ''
                          }`}
                        >
                          {sent.es}
                        </span>
                      </div>

                      {/* Pill indicator */}
                      <span className="text-[10px] font-bold text-amber-300 bg-[#07132e] px-2 py-0.5 rounded border border-amber-500/40 shrink-0">
                        {isOpen ? 'Ocultar RU' : 'Ver RU'}
                      </span>
                    </div>

                    {/* Sentence translation dropdown */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2.5 pt-2 border-t border-sky-700/60 overflow-hidden"
                        >
                          <p className="text-sm font-normal text-amber-200 pl-6 italic">
                            <span className="not-italic text-amber-400 font-bold uppercase text-[10px] mr-1.5">
                              RU:
                            </span>
                            {sent.ru}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action to test comprehension */}
          <div className="bg-gradient-to-r from-[#0d275a] via-[#113883] to-[#0a1e45] p-6 rounded-2xl border-2 border-amber-400/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">¿Has terminado de leer?</h3>
              <p className="text-xs text-sky-100">
                Pasa a las preguntas de comprensión, verdadero/falso y ejercicios de gramática.
              </p>
            </div>
            <button
              onClick={() => handleSelectSubTab('comprehension')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 font-extrabold text-sm hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>Preguntas de comprensión</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Comprehension Questions */}
      {readingSubTab === 'comprehension' && story.comprehensionQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>PREGUNTAS DE COMPRENSIÓN LECTORA</span>
            <span>
              {qIndex + 1} / {story.comprehensionQuestions.length}
            </span>
          </div>

          <div className="bg-[#07132e] p-4 rounded-xl border border-sky-700/60">
            <div className="text-lg md:text-xl font-bold text-white">
              {story.comprehensionQuestions[qIndex].questionEs}
            </div>
            <div className="text-xs text-amber-300 mt-1 italic">
              RU: {story.comprehensionQuestions[qIndex].questionRu}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {story.comprehensionQuestions[qIndex].options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectIdx = idx === story.comprehensionQuestions[qIndex].correctIndex;

              let style = 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white';
              if (isAnswered) {
                if (isCorrectIdx)
                  style = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
                else if (isSelected)
                  style = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
                else style = 'bg-stone-900/50 border-stone-800 text-stone-500 opacity-60';
              }

              return (
                <div
                  key={idx}
                  onClick={() =>
                    handleCheckAnswer(idx, story.comprehensionQuestions[qIndex].correctIndex)
                  }
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${style}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-black/40 text-xs font-bold flex items-center justify-center shrink-0 text-amber-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-semibold text-sm">{opt.es}</span>
                  </div>
                  <ChoiceTranslateButton ru={opt.ru} />
                </div>
              );
            })}
          </div>

          {isAnswered && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                isCorrect
                  ? 'bg-emerald-950/50 border-emerald-400/60 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
              }`}
            >
              <div className="font-bold text-sm mb-1">
                {isCorrect ? '¡Correcto! (+10 pts)' : '¡Incorrecto!'}
              </div>
              <p>{story.comprehensionQuestions[qIndex].explanationRu}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={prevQuestion}
              disabled={qIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => nextQuestion(story.comprehensionQuestions.length)}
              disabled={qIndex === story.comprehensionQuestions.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: True / False */}
      {readingSubTab === 'truefalse' && story.trueFalseTasks.length > 0 && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>VERDADERO O FALSO (V / F)</span>
            <span>
              {qIndex + 1} / {story.trueFalseTasks.length}
            </span>
          </div>

          <div className="bg-[#07132e] p-5 rounded-xl border border-sky-700/60 space-y-1">
            <div className="text-xl font-bold text-white">
              «{story.trueFalseTasks[qIndex].statementEs}»
            </div>
            <div className="text-xs text-amber-300 italic">
              RU: {story.trueFalseTasks[qIndex].statementRu}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleCheckAnswer('true', story.trueFalseTasks[qIndex].isTrue ? 'true' : 'false')}
              className={`p-4 rounded-xl border text-center font-bold text-base transition-all ${
                isAnswered
                  ? story.trueFalseTasks[qIndex].isTrue
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                    : selectedAnswer === 'true'
                    ? 'bg-rose-950 border-rose-500 text-rose-200'
                    : 'bg-stone-900/50 border-stone-800 text-stone-500'
                  : 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white'
              }`}
            >
              Verdadero (Правда)
            </button>

            <button
              onClick={() => handleCheckAnswer('false', story.trueFalseTasks[qIndex].isTrue ? 'true' : 'false')}
              className={`p-4 rounded-xl border text-center font-bold text-base transition-all ${
                isAnswered
                  ? !story.trueFalseTasks[qIndex].isTrue
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                    : selectedAnswer === 'false'
                    ? 'bg-rose-950 border-rose-500 text-rose-200'
                    : 'bg-stone-900/50 border-stone-800 text-stone-500'
                  : 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white'
              }`}
            >
              Falso (Ложь)
            </button>
          </div>

          {isAnswered && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                isCorrect
                  ? 'bg-emerald-950/50 border-emerald-400/60 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
              }`}
            >
              <div className="font-bold text-sm mb-1">
                {isCorrect ? '¡Correcto! (+10 pts)' : '¡Incorrecto!'}
              </div>
              <p>{story.trueFalseTasks[qIndex].explanationRu}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={prevQuestion}
              disabled={qIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => nextQuestion(story.trueFalseTasks.length)}
              disabled={qIndex === story.trueFalseTasks.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Multiple Choice Tests */}
      {readingSubTab === 'multiplechoice' && story.multipleChoiceTests.length > 0 && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>TESTS CON CUATRO OPCIONES</span>
            <span>
              {qIndex + 1} / {story.multipleChoiceTests.length}
            </span>
          </div>

          <div className="bg-[#07132e] p-4 rounded-xl border border-sky-700/60">
            <div className="text-lg md:text-xl font-bold text-white">
              {story.multipleChoiceTests[qIndex].questionEs}
            </div>
            <div className="text-xs text-amber-300 mt-1 italic">
              RU: {story.multipleChoiceTests[qIndex].questionRu}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {story.multipleChoiceTests[qIndex].options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectIdx = idx === story.multipleChoiceTests[qIndex].correctIndex;

              let style = 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white';
              if (isAnswered) {
                if (isCorrectIdx)
                  style = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
                else if (isSelected)
                  style = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
                else style = 'bg-stone-900/50 border-stone-800 text-stone-500 opacity-60';
              }

              return (
                <div
                  key={idx}
                  onClick={() =>
                    handleCheckAnswer(idx, story.multipleChoiceTests[qIndex].correctIndex)
                  }
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${style}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-black/40 text-xs font-bold flex items-center justify-center shrink-0 text-amber-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-semibold text-sm">{opt.es}</span>
                  </div>
                  <ChoiceTranslateButton ru={opt.ru} />
                </div>
              );
            })}
          </div>

          {isAnswered && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                isCorrect
                  ? 'bg-emerald-950/50 border-emerald-400/60 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
              }`}
            >
              <div className="font-bold text-sm mb-1">
                {isCorrect ? '¡Correcto! (+10 pts)' : '¡Incorrecto!'}
              </div>
              <p>{story.multipleChoiceTests[qIndex].explanationRu}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={prevQuestion}
              disabled={qIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => nextQuestion(story.multipleChoiceTests.length)}
              disabled={qIndex === story.multipleChoiceTests.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Blank Exercises */}
      {readingSubTab === 'blanks' && story.blankExercises.length > 0 && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>RELLENAR HUECOS</span>
            <span>
              {qIndex + 1} / {story.blankExercises.length}
            </span>
          </div>

          <div className="bg-[#07132e] p-5 rounded-xl border border-sky-700/60 space-y-1">
            <div className="text-xl font-bold text-white">
              {story.blankExercises[qIndex].sentenceWithBlankEs}
            </div>
            <div className="text-xs text-amber-300 italic">
              RU: {story.blankExercises[qIndex].sentenceRu}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {story.blankExercises[qIndex].options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt.es;
              const isRight = opt.es === story.blankExercises[qIndex].correctAnswer;

              let style = 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white';
              if (isAnswered) {
                if (isRight)
                  style = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
                else if (isSelected)
                  style = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
                else style = 'bg-stone-900/50 border-stone-800 text-stone-500 opacity-60';
              }

              return (
                <div
                  key={idx}
                  onClick={() =>
                    handleCheckAnswer(opt.es, story.blankExercises[qIndex].correctAnswer)
                  }
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${style}`}
                >
                  <span className="font-semibold text-sm">{opt.es}</span>
                  <ChoiceTranslateButton ru={opt.ru} />
                </div>
              );
            })}
          </div>

          {isAnswered && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                isCorrect
                  ? 'bg-emerald-950/50 border-emerald-400/60 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
              }`}
            >
              <div className="font-bold text-sm mb-1">{isCorrect ? '¡Correcto!' : '¡Error!'}</div>
              <p>{story.blankExercises[qIndex].explanationRu}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={prevQuestion}
              disabled={qIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => nextQuestion(story.blankExercises.length)}
              disabled={qIndex === story.blankExercises.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 6: Grammar Questions */}
      {readingSubTab === 'grammar' && story.grammarQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>PREGUNTAS DE GRAMÁTICA DEL TEXTO</span>
            <span>
              {qIndex + 1} / {story.grammarQuestions.length}
            </span>
          </div>

          <div className="bg-[#07132e] p-4 rounded-xl border border-sky-700/60">
            <div className="text-lg md:text-xl font-bold text-white">
              {story.grammarQuestions[qIndex].questionEs}
            </div>
            <div className="text-xs text-amber-300 mt-1 italic">
              RU: {story.grammarQuestions[qIndex].questionRu}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {story.grammarQuestions[qIndex].options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectIdx = idx === story.grammarQuestions[qIndex].correctIndex;

              let style = 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white';
              if (isAnswered) {
                if (isCorrectIdx)
                  style = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
                else if (isSelected)
                  style = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
                else style = 'bg-stone-900/50 border-stone-800 text-stone-500 opacity-60';
              }

              return (
                <div
                  key={idx}
                  onClick={() =>
                    handleCheckAnswer(idx, story.grammarQuestions[qIndex].correctIndex)
                  }
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${style}`}
                >
                  <span className="font-semibold text-xs md:text-sm">{opt.es}</span>
                  <ChoiceTranslateButton ru={opt.ru} />
                </div>
              );
            })}
          </div>

          {isAnswered && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                isCorrect
                  ? 'bg-emerald-950/50 border-emerald-400/60 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
              }`}
            >
              <div className="font-bold text-sm mb-1">
                {isCorrect ? '¡Correcto! (+10 pts)' : '¡Incorrecto!'}
              </div>
              <p>{story.grammarQuestions[qIndex].explanationRu}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={prevQuestion}
              disabled={qIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => nextQuestion(story.grammarQuestions.length)}
              disabled={qIndex === story.grammarQuestions.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 7: Retell Prompts */}
      {readingSubTab === 'retell' && story.retellPrompts.length > 0 && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="space-y-1 border-b border-sky-800 pb-3">
            <h2 className="text-lg font-bold text-amber-300">
              Preguntas de apoyo para resumir el texto
            </h2>
            <p className="text-xs text-sky-200">
              Опорные вопросы для устного или письменного пересказа истории.
            </p>
          </div>

          <div className="space-y-4">
            {story.retellPrompts.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#07132e] p-4 rounded-xl border border-sky-700/60 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-400/40">
                    {idx + 1}
                  </span>
                  <div className="text-base font-bold text-white">{item.es}</div>
                </div>
                <div className="text-xs text-amber-200 pl-8 italic">RU: {item.ru}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
