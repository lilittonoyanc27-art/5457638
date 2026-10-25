import React, { useState, useEffect } from 'react';
import { Gamepad2, CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, HelpCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ERROR_HUNT_TASKS,
  WORD_ORDER_TASKS,
  COMPLETE_SENTENCE_TASKS,
  CHOOSE_ANSWER_TASKS,
  QA_MATCH_TASKS,
  WHOSE_IS_IT_TASKS,
  DAYS_SEQUENCE,
} from './dataMiniGames.ts';
import { ChoiceTranslateButton, TranslationNotice } from './spanishRuText.tsx';
import { sounds } from './sound.ts';

interface MiniGamesViewProps {
  onAddPoints: (amount: number) => void;
}

type MiniGameId =
  | 'error'
  | 'order-words'
  | 'complete'
  | 'choose'
  | 'guess-number'
  | 'qa'
  | 'whose'
  | 'order-days';

export const MiniGamesView: React.FC<MiniGamesViewProps> = ({ onAddPoints }) => {
  const [activeGame, setActiveGame] = useState<MiniGameId>('error');
  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Word order game state
  const [userWords, setUserWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  // Guess Number mini-game state
  const [secretNumber, setSecretNumber] = useState<number>(42);
  const [guessInput, setGuessInput] = useState<string>('');
  const [guessFeedback, setGuessFeedback] = useState<string>('');
  const [guessAttempts, setGuessAttempts] = useState<number>(0);
  const [guessSolved, setGuessSolved] = useState<boolean>(false);

  // Days order game state
  const [daysDeck, setDaysDeck] = useState<typeof DAYS_SEQUENCE>([]);
  const [placedDays, setPlacedDays] = useState<typeof DAYS_SEQUENCE>([]);
  const [daysOrderSolved, setDaysOrderSolved] = useState<boolean>(false);

  // Initialize word order when moving to word order game or changing task
  useEffect(() => {
    if (activeGame === 'order-words') {
      const current = WORD_ORDER_TASKS[taskIndex] || WORD_ORDER_TASKS[0];
      setAvailableWords([...current.scrambled].sort(() => Math.random() - 0.5));
      setUserWords([]);
      setIsAnswered(false);
    }
  }, [activeGame, taskIndex]);

  // Initialize guess number
  useEffect(() => {
    if (activeGame === 'guess-number') {
      initGuessGame();
    }
  }, [activeGame]);

  const initGuessGame = () => {
    const num = Math.floor(Math.random() * 99) + 1;
    setSecretNumber(num);
    setGuessInput('');
    setGuessFeedback('¡He pensado un número del 1 al 100! Escribe tu intento en números o palabras.');
    setGuessAttempts(0);
    setGuessSolved(false);
  };

  // Initialize days order
  useEffect(() => {
    if (activeGame === 'order-days') {
      initDaysOrder();
    }
  }, [activeGame]);

  const initDaysOrder = () => {
    const shuffled = [...DAYS_SEQUENCE].sort(() => Math.random() - 0.5);
    setDaysDeck(shuffled);
    setPlacedDays([]);
    setDaysOrderSolved(false);
  };

  const handleSelectGame = (game: MiniGameId) => {
    sounds.playClick();
    setActiveGame(game);
    setTaskIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  // Choice task check
  const handleChoiceCheck = (chosen: string, correct: string) => {
    if (isAnswered) return;
    setSelectedAnswer(chosen);
    setIsAnswered(true);

    const right = chosen.trim().toLowerCase() === correct.trim().toLowerCase();
    setIsCorrect(right);
    if (right) {
      sounds.playCorrect();
      onAddPoints(10);
    } else {
      sounds.playWrong();
    }
  };

  // Word order handlers
  const handleAddWord = (word: string, index: number) => {
    sounds.playClick();
    setUserWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (word: string, index: number) => {
    sounds.playClick();
    setAvailableWords((prev) => [...prev, word]);
    setUserWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVerifyWordOrder = () => {
    const current = WORD_ORDER_TASKS[taskIndex];
    const isExact =
      userWords.join(' ').trim().toLowerCase() === current.correct.join(' ').trim().toLowerCase();

    setIsAnswered(true);
    setIsCorrect(isExact);
    if (isExact) {
      sounds.playCorrect();
      onAddPoints(15);
    } else {
      sounds.playWrong();
    }
  };

  // Guess Number Submit
  const handleGuessSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(guessInput.trim(), 10);
    if (isNaN(val)) return;

    sounds.playClick();
    const nextAttempts = guessAttempts + 1;
    setGuessAttempts(nextAttempts);

    if (val === secretNumber) {
      sounds.playFanfare();
      setGuessSolved(true);
      setGuessFeedback(`¡CORRECTO! 🎉 El número secreto es el ${secretNumber}. Lo has adivinado en ${nextAttempts} intentos.`);
      onAddPoints(30);
    } else if (val < secretNumber) {
      sounds.playWrong();
      const parity = secretNumber % 2 === 0 ? 'número par (чётное)' : 'número impar (нечётное)';
      setGuessFeedback(`¡El número es MÁS ALTO que ${val}! Pista adicional: es un ${parity}.`);
    } else {
      sounds.playWrong();
      const parity = secretNumber % 2 === 0 ? 'número par (чётное)' : 'número impar (нечётное)';
      setGuessFeedback(`¡El número es MÁS BAJO que ${val}! Pista adicional: es un ${parity}.`);
    }
  };

  // Place Day in sequence
  const handlePlaceDay = (day: (typeof DAYS_SEQUENCE)[0]) => {
    sounds.playClick();
    const expectedOrder = placedDays.length + 1;
    if (day.order === expectedOrder) {
      sounds.playCorrect();
      const newPlaced = [...placedDays, day];
      setPlacedDays(newPlaced);
      setDaysDeck((prev) => prev.filter((d) => d.id !== day.id));

      if (newPlaced.length === 7) {
        sounds.playFanfare();
        setDaysOrderSolved(true);
        onAddPoints(25);
      }
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0b1a3d] p-6 rounded-2xl border border-sky-800 shadow-xl space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Zona de Arcade Educativo
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-amber-400" />
            Juegos Interactivos
          </h1>
          <p className="text-sm text-sky-200 mt-1">
            8 мини-игр для закрепления дней недели, чисел, притяжательных форм и вопросов.
          </p>
        </div>

        {/* 8 Game Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-sky-900/60">
          <button
            onClick={() => handleSelectGame('error')}
            className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
              activeGame === 'error'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            1. Encuentra el error
          </button>
          <button
            onClick={() => handleSelectGame('order-words')}
            className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
              activeGame === 'order-words'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            2. Ordena las palabras
          </button>
          <button
            onClick={() => handleSelectGame('complete')}
            className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
              activeGame === 'complete'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            3. Completa la frase
          </button>
          <button
            onClick={() => handleSelectGame('choose')}
            className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
              activeGame === 'choose'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            4. Elige la respuesta
          </button>
          <button
            onClick={() => handleSelectGame('guess-number')}
            className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
              activeGame === 'guess-number'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            5. Adivina el número
          </button>
          <button
            onClick={() => handleSelectGame('qa')}
            className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
              activeGame === 'qa'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            6. Pregunta y respuesta
          </button>
          <button
            onClick={() => handleSelectGame('whose')}
            className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
              activeGame === 'whose'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            7. ¿De quién es?
          </button>
          <button
            onClick={() => handleSelectGame('order-days')}
            className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
              activeGame === 'order-days'
                ? 'bg-amber-400 text-stone-950 font-bold shadow'
                : 'bg-[#07132e] text-stone-300 hover:text-white border border-sky-800'
            }`}
          >
            8. Ordena los días
          </button>
        </div>
      </div>

      <TranslationNotice />

      {/* GAME 1: ENCUENTRA EL ERROR */}
      {activeGame === 'error' && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>ENCUENTRA EL ERROR GRAMATICAL</span>
            <span>
              {taskIndex + 1} / {ERROR_HUNT_TASKS.length}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">
              {ERROR_HUNT_TASKS[taskIndex].promptEs}
            </h2>
            <p className="text-xs text-sky-200 italic">
              RU: {ERROR_HUNT_TASKS[taskIndex].promptRu}
            </p>
          </div>

          <div className="space-y-3">
            {ERROR_HUNT_TASKS[taskIndex].options?.map((opt, idx) => {
              const isSelected = selectedAnswer === opt.es;
              const isTargetError = opt.es === ERROR_HUNT_TASKS[taskIndex].correctAnswer;

              let style = 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white';
              if (isAnswered) {
                if (isTargetError)
                  style = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
                else if (isSelected)
                  style = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
                else style = 'bg-stone-900/50 border-stone-800 text-stone-500 opacity-60';
              }

              return (
                <div
                  key={idx}
                  onClick={() =>
                    handleChoiceCheck(opt.es, ERROR_HUNT_TASKS[taskIndex].correctAnswer as string)
                  }
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-black/40 text-xs font-bold flex items-center justify-center shrink-0 text-amber-300">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-sm md:text-base">{opt.es}</span>
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
                {isCorrect ? '¡Bien visto! (+10 pts)' : '¡Esa frase es correcta!'}
              </div>
              <p>{ERROR_HUNT_TASKS[taskIndex].explanationRu}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={() => {
                if (taskIndex > 0) {
                  setTaskIndex((p) => p - 1);
                  setIsAnswered(false);
                  setSelectedAnswer(null);
                }
              }}
              disabled={taskIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => {
                if (taskIndex < ERROR_HUNT_TASKS.length - 1) {
                  setTaskIndex((p) => p + 1);
                  setIsAnswered(false);
                  setSelectedAnswer(null);
                }
              }}
              disabled={taskIndex === ERROR_HUNT_TASKS.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* GAME 2: ORDENA LAS PALABRAS */}
      {activeGame === 'order-words' && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>ORDENA LAS PALABRAS PARA FORMAR LA FRASE</span>
            <span>
              {taskIndex + 1} / {WORD_ORDER_TASKS.length}
            </span>
          </div>

          <div className="bg-[#07132e] p-4 rounded-xl border border-sky-700/60">
            <div className="text-xs uppercase text-amber-400 font-bold mb-1">
              Traducción deseada en ruso:
            </div>
            <div className="text-lg font-bold text-white">
              «{WORD_ORDER_TASKS[taskIndex].ru}»
            </div>
          </div>

          {/* Constructed Sentence Slot */}
          <div className="space-y-2">
            <div className="text-xs text-sky-200 font-semibold">Tu frase construida:</div>
            <div className="min-h-[60px] p-3 rounded-xl bg-[#050e24] border-2 border-dashed border-sky-700 flex flex-wrap items-center gap-2">
              {userWords.length === 0 ? (
                <span className="text-xs text-sky-300 italic">
                  Toca las palabras de abajo para agregarlas en orden...
                </span>
              ) : (
                userWords.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => handleRemoveWord(word, i)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-bold text-sm shadow hover:bg-rose-400 hover:text-white transition-all flex items-center gap-1"
                  >
                    <span>{word}</span>
                    <span className="text-[10px] opacity-70">✕</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Available Word Bank */}
          <div className="space-y-2">
            <div className="text-xs text-sky-200 font-semibold">Palabras disponibles:</div>
            <div className="flex flex-wrap items-center gap-2">
              {availableWords.map((word, i) => (
                <button
                  key={i}
                  onClick={() => handleAddWord(word, i)}
                  className="px-3.5 py-2 rounded-lg bg-[#0e2456] hover:bg-[#15367c] border border-sky-500/40 text-white font-medium text-sm transition-all hover:scale-105"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Verify button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleVerifyWordOrder}
              disabled={userWords.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 font-extrabold text-sm disabled:opacity-40 shadow transition-all"
            >
              Comprobar orden
            </button>
            <button
              onClick={() => {
                const current = WORD_ORDER_TASKS[taskIndex];
                setAvailableWords([...current.scrambled].sort(() => Math.random() - 0.5));
                setUserWords([]);
                setIsAnswered(false);
              }}
              className="p-2.5 rounded-xl bg-[#07132e] border border-sky-700 text-sky-300 hover:text-white transition-colors"
              title="Reiniciar frase"
            >
              <RotateCcw className="w-4 h-4" />
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
                {isCorrect ? '¡Perfecto! Frase ordenada (+15 pts)' : '¡El orden no es correcto!'}
              </div>
              <p>
                Orden correcto:{' '}
                <span className="font-bold text-amber-300">
                  {WORD_ORDER_TASKS[taskIndex].correct.join(' ')}
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={() => {
                if (taskIndex > 0) setTaskIndex((p) => p - 1);
              }}
              disabled={taskIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => {
                if (taskIndex < WORD_ORDER_TASKS.length - 1) setTaskIndex((p) => p + 1);
              }}
              disabled={taskIndex === WORD_ORDER_TASKS.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* GAME 3: COMPLETA LA FRASE */}
      {activeGame === 'complete' && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>COMPLETA LA FRASE</span>
            <span>
              {taskIndex + 1} / {COMPLETE_SENTENCE_TASKS.length}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">
              {COMPLETE_SENTENCE_TASKS[taskIndex].subtextEs}
            </h2>
            <p className="text-xs text-amber-300 italic">
              RU: {COMPLETE_SENTENCE_TASKS[taskIndex].subtextRu}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {COMPLETE_SENTENCE_TASKS[taskIndex].options?.map((opt, idx) => (
              <div
                key={idx}
                onClick={() =>
                  handleChoiceCheck(
                    opt.es,
                    COMPLETE_SENTENCE_TASKS[taskIndex].correctAnswer as string
                  )
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isAnswered
                    ? opt.es === COMPLETE_SENTENCE_TASKS[taskIndex].correctAnswer
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                      : selectedAnswer === opt.es
                      ? 'bg-rose-950 border-rose-500 text-rose-200'
                      : 'bg-stone-900/50 border-stone-800 text-stone-500'
                    : 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white'
                }`}
              >
                <span className="font-semibold text-sm">{opt.es}</span>
                <ChoiceTranslateButton ru={opt.ru} />
              </div>
            ))}
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
              <p>{COMPLETE_SENTENCE_TASKS[taskIndex].explanationRu}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={() => {
                if (taskIndex > 0) {
                  setTaskIndex((p) => p - 1);
                  setIsAnswered(false);
                  setSelectedAnswer(null);
                }
              }}
              disabled={taskIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => {
                if (taskIndex < COMPLETE_SENTENCE_TASKS.length - 1) {
                  setTaskIndex((p) => p + 1);
                  setIsAnswered(false);
                  setSelectedAnswer(null);
                }
              }}
              disabled={taskIndex === COMPLETE_SENTENCE_TASKS.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* GAME 4: ELIGE LA RESPUESTA */}
      {activeGame === 'choose' && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>ELIGE LA RESPUESTA CORRECTA</span>
            <span>
              {taskIndex + 1} / {CHOOSE_ANSWER_TASKS.length}
            </span>
          </div>

          <div className="bg-[#07132e] p-4 rounded-xl border border-sky-700/60">
            <div className="text-xl font-bold text-white">
              {CHOOSE_ANSWER_TASKS[taskIndex].promptEs}
            </div>
            <div className="text-xs text-amber-300 mt-1 italic">
              RU: {CHOOSE_ANSWER_TASKS[taskIndex].promptRu}
            </div>
          </div>

          <div className="space-y-3">
            {CHOOSE_ANSWER_TASKS[taskIndex].options?.map((opt, idx) => (
              <div
                key={idx}
                onClick={() =>
                  handleChoiceCheck(opt.es, CHOOSE_ANSWER_TASKS[taskIndex].correctAnswer as string)
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isAnswered
                    ? opt.es === CHOOSE_ANSWER_TASKS[taskIndex].correctAnswer
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                      : selectedAnswer === opt.es
                      ? 'bg-rose-950 border-rose-500 text-rose-200'
                      : 'bg-stone-900/50 border-stone-800 text-stone-500'
                    : 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white'
                }`}
              >
                <span className="font-semibold text-sm md:text-base">{opt.es}</span>
                <ChoiceTranslateButton ru={opt.ru} />
              </div>
            ))}
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
              <p>{CHOOSE_ANSWER_TASKS[taskIndex].explanationRu}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={() => {
                if (taskIndex > 0) {
                  setTaskIndex((p) => p - 1);
                  setIsAnswered(false);
                  setSelectedAnswer(null);
                }
              }}
              disabled={taskIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => {
                if (taskIndex < CHOOSE_ANSWER_TASKS.length - 1) {
                  setTaskIndex((p) => p + 1);
                  setIsAnswered(false);
                  setSelectedAnswer(null);
                }
              }}
              disabled={taskIndex === CHOOSE_ANSWER_TASKS.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* GAME 5: ADIVINA EL NÚMERO */}
      {activeGame === 'guess-number' && (
        <div className="max-w-2xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl text-center">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Minijuego Especial
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
              ADIVINA EL NÚMERO (1 al 100)
            </h2>
            <p className="text-xs text-sky-200">
              Угадайте число от 1 до 100, ориентируясь на подсказки на испанском языке.
            </p>
          </div>

          {/* Feedback Display */}
          <div className="bg-[#07132e] p-5 rounded-2xl border border-sky-700/60 space-y-2">
            <div className="text-sm md:text-base font-semibold text-amber-300 leading-relaxed">
              {guessFeedback}
            </div>
            <div className="text-xs text-sky-200 font-medium">
              Intentos realizados (попыток):{' '}
              <span className="font-bold text-white tabular-nums">{guessAttempts}</span>
            </div>
          </div>

          {/* Input & Form */}
          {!guessSolved ? (
            <form onSubmit={handleGuessSubmit} className="space-y-4 max-w-sm mx-auto">
              <input
                type="number"
                min="1"
                max="100"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                placeholder="Escribe un número (ej. 42)..."
                className="w-full text-center text-2xl font-bold bg-[#050e24] border-2 border-sky-500 text-white rounded-xl py-3 focus:outline-none focus:border-amber-400 shadow-inner"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 font-extrabold text-base shadow hover:shadow-lg transition-all"
              >
                Adivinar / Проверить число
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <button
                onClick={initGuessGame}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 font-extrabold text-base shadow hover:shadow-lg transition-all"
              >
                Jugar otra vez / Играть ещё раз
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 6: PREGUNTA Y RESPUESTA */}
      {activeGame === 'qa' && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>PREGUNTA Y RESPUESTA</span>
            <span>
              {taskIndex + 1} / {QA_MATCH_TASKS.length}
            </span>
          </div>

          <div className="bg-[#07132e] p-5 rounded-xl border border-sky-700/60 space-y-1">
            <div className="text-lg font-bold text-white">{QA_MATCH_TASKS[taskIndex].promptEs}</div>
            <div className="text-xs text-amber-300 italic">
              RU: {QA_MATCH_TASKS[taskIndex].promptRu}
            </div>
          </div>

          <div className="space-y-3">
            {QA_MATCH_TASKS[taskIndex].options?.map((opt, idx) => (
              <div
                key={idx}
                onClick={() =>
                  handleChoiceCheck(opt.es, QA_MATCH_TASKS[taskIndex].correctAnswer as string)
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isAnswered
                    ? opt.es === QA_MATCH_TASKS[taskIndex].correctAnswer
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                      : selectedAnswer === opt.es
                      ? 'bg-rose-950 border-rose-500 text-rose-200'
                      : 'bg-stone-900/50 border-stone-800 text-stone-500'
                    : 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white'
                }`}
              >
                <span className="font-semibold text-sm md:text-base">{opt.es}</span>
                <ChoiceTranslateButton ru={opt.ru} />
              </div>
            ))}
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
              <p>{QA_MATCH_TASKS[taskIndex].explanationRu}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={() => {
                if (taskIndex > 0) {
                  setTaskIndex((p) => p - 1);
                  setIsAnswered(false);
                  setSelectedAnswer(null);
                }
              }}
              disabled={taskIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => {
                if (taskIndex < QA_MATCH_TASKS.length - 1) {
                  setTaskIndex((p) => p + 1);
                  setIsAnswered(false);
                  setSelectedAnswer(null);
                }
              }}
              disabled={taskIndex === QA_MATCH_TASKS.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* GAME 7: ¿DE QUIÉN ES? */}
      {activeGame === 'whose' && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-sky-800 pb-3">
            <span>¿DE QUIÉN ES? (POSESIVOS)</span>
            <span>
              {taskIndex + 1} / {WHOSE_IS_IT_TASKS.length}
            </span>
          </div>

          <div className="bg-[#07132e] p-5 rounded-xl border border-sky-700/60 space-y-1">
            <div className="text-lg font-bold text-white">
              {WHOSE_IS_IT_TASKS[taskIndex].promptEs}
            </div>
            <div className="text-xs text-amber-300 italic">
              RU: {WHOSE_IS_IT_TASKS[taskIndex].promptRu}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {WHOSE_IS_IT_TASKS[taskIndex].options?.map((opt, idx) => (
              <div
                key={idx}
                onClick={() =>
                  handleChoiceCheck(opt.es, WHOSE_IS_IT_TASKS[taskIndex].correctAnswer as string)
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isAnswered
                    ? opt.es === WHOSE_IS_IT_TASKS[taskIndex].correctAnswer
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                      : selectedAnswer === opt.es
                      ? 'bg-rose-950 border-rose-500 text-rose-200'
                      : 'bg-stone-900/50 border-stone-800 text-stone-500'
                    : 'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white'
                }`}
              >
                <span className="font-semibold text-sm md:text-base">{opt.es}</span>
                <ChoiceTranslateButton ru={opt.ru} />
              </div>
            ))}
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
              <p>{WHOSE_IS_IT_TASKS[taskIndex].explanationRu}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sky-800">
            <button
              onClick={() => {
                if (taskIndex > 0) {
                  setTaskIndex((p) => p - 1);
                  setIsAnswered(false);
                  setSelectedAnswer(null);
                }
              }}
              disabled={taskIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#091533] border border-sky-700 text-xs font-semibold text-sky-200 disabled:opacity-40 hover:bg-[#102758] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => {
                if (taskIndex < WHOSE_IS_IT_TASKS.length - 1) {
                  setTaskIndex((p) => p + 1);
                  setIsAnswered(false);
                  setSelectedAnswer(null);
                }
              }}
              disabled={taskIndex === WHOSE_IS_IT_TASKS.length - 1}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* GAME 8: ORDENA LOS DÍAS */}
      {activeGame === 'order-days' && (
        <div className="max-w-3xl mx-auto bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
          <div className="space-y-1 border-b border-sky-800 pb-3">
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Desafío de Secuencia
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Ordena los 7 días de la semana
            </h2>
            <p className="text-xs text-sky-200">
              Нажимайте на дни в правильном порядке: с понедельника по воскресенье.
            </p>
          </div>

          {/* Sequence target line */}
          <div className="space-y-2">
            <div className="text-xs text-sky-200 font-semibold">Semana ordenada:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 min-h-[70px]">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const day = placedDays.find((d) => d.order === num);
                return (
                  <div
                    key={num}
                    className={`p-2.5 rounded-xl border text-center flex flex-col justify-center ${
                      day
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                        : 'bg-black/30 border-dashed border-sky-700 text-sky-500'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-sky-300">Día {num}</span>
                    <span className="font-bold text-sm">{day ? day.es : '—'}</span>
                    {day && <span className="text-[10px] text-emerald-300 italic">{day.ru}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available deck */}
          {!daysOrderSolved && (
            <div className="space-y-2 pt-2">
              <div className="text-xs text-amber-400 font-semibold">
                Toca el siguiente día que corresponde:
              </div>
              <div className="flex flex-wrap gap-2">
                {daysDeck.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => handlePlaceDay(day)}
                    className="px-4 py-2.5 rounded-xl bg-[#0e2456] hover:bg-[#15367c] border border-sky-500/40 text-white font-bold text-sm shadow hover:scale-105 transition-all"
                  >
                    <div>{day.es}</div>
                    <div className="text-[10px] text-amber-300 font-normal">{day.ru}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {daysOrderSolved && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-400 text-center space-y-2">
              <div className="text-base font-bold text-emerald-300">
                ¡Enhorabuena! Has ordenado los 7 días de la semana a la perfección (+25 pts)
              </div>
              <button
                onClick={initDaysOrder}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-extrabold text-xs"
              >
                Volver a jugar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
