import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  PhoneCall,
  Users,
  Percent,
  LogOut,
  RotateCcw,
  Trophy,
  HelpCircle,
  ShieldCheck,
  Check,
  Languages,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { MillionaireQuestion } from './types.ts';
import { MILLIONAIRE_LADDER, MILLIONAIRE_QUESTIONS } from './dataMillionaire.ts';
import { sounds } from './sound.ts';

interface MillionaireGameProps {
  onAddPoints: (amount: number) => void;
  onRecordBestPrize: (amount: number) => void;
  bestPrizeEver: number;
}

export const MillionaireGame: React.FC<MillionaireGameProps> = ({
  onAddPoints,
  onRecordBestPrize,
  bestPrizeEver,
}) => {
  // Game session questions: 15 questions (5 from Tier 1, 5 from Tier 2, 5 from Tier 3)
  const [sessionQuestions, setSessionQuestions] = useState<MillionaireQuestion[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(1); // 1 to 15
  const [selectedLetter, setSelectedLetter] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  // Lifelines
  const [lifeline5050Used, setLifeline5050Used] = useState(false);
  const [lifelineFriendUsed, setLifelineFriendUsed] = useState(false);
  const [lifelineAudienceUsed, setLifelineAudienceUsed] = useState(false);

  // Active hidden options from 50:50
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);

  // Modals for lifelines
  const [friendModalOpen, setFriendModalOpen] = useState(false);
  const [audienceModalOpen, setAudienceModalOpen] = useState(false);
  const [audienceVotes, setAudienceVotes] = useState<Record<string, number>>({});

  // Resolution state
  const [isRevealed, setIsRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [walkedAway, setWalkedAway] = useState(false);
  const [finalPrize, setFinalPrize] = useState(0);

  // Translation visibility states
  const [showQuestionTranslation, setShowQuestionTranslation] = useState(false);
  const [optionTranslationsOpen, setOptionTranslationsOpen] = useState<Record<string, boolean>>({});

  // Initialize a new 15-question game
  const startNewGame = () => {
    sounds.playClick();
    const t1 = MILLIONAIRE_QUESTIONS.filter((q) => q.tier === 1).sort(() => Math.random() - 0.5).slice(0, 5);
    const t2 = MILLIONAIRE_QUESTIONS.filter((q) => q.tier === 2).sort(() => Math.random() - 0.5).slice(0, 5);
    const t3 = MILLIONAIRE_QUESTIONS.filter((q) => q.tier === 3).sort(() => Math.random() - 0.5).slice(0, 5);

    // Fallback if small pool
    const combined = [...t1, ...t2, ...t3];
    while (combined.length < 15) {
      combined.push(MILLIONAIRE_QUESTIONS[combined.length % MILLIONAIRE_QUESTIONS.length]);
    }

    setSessionQuestions(combined);
    setCurrentLevel(1);
    setSelectedLetter(null);
    setLifeline5050Used(false);
    setLifelineFriendUsed(false);
    setLifelineAudienceUsed(false);
    setHiddenOptions([]);
    setIsRevealed(false);
    setGameOver(false);
    setGameWon(false);
    setWalkedAway(false);
    setFinalPrize(0);
    setShowQuestionTranslation(false);
    setOptionTranslationsOpen({});
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const currentQ: MillionaireQuestion | undefined = sessionQuestions[currentLevel - 1];
  const currentLadder = MILLIONAIRE_LADDER[currentLevel - 1];

  // Calculate guaranteed checkpoint prize
  const getGuaranteedPrize = (level: number) => {
    if (level > 10) return 32000;
    if (level > 5) return 1000;
    return 0;
  };

  // Direct option selection without popup modal confirmation
  const handleSelectOption = (letter: 'A' | 'B' | 'C' | 'D') => {
    if (isRevealed || gameOver || gameWon || selectedLetter !== null || hiddenOptions.includes(letter) || !currentQ) return;
    sounds.playClick();
    sounds.playSuspense();
    setSelectedLetter(letter);

    // Dramatic suspense delay of 1.2 seconds before reveal
    setTimeout(() => {
      setIsRevealed(true);
      const isCorrect = letter === currentQ.correctLetter;

      if (isCorrect) {
        sounds.playCorrect();
        const currentPrize = currentLadder.amount;

        if (currentLadder.isCheckpoint && currentLevel < 15) {
          sounds.playCheckpoint();
        }

        if (currentLevel === 15) {
          // WON 1.000.000 €!
          sounds.playFanfare();
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
          });
          setGameWon(true);
          setFinalPrize(1000000);
          onAddPoints(1000);
          onRecordBestPrize(1000000);
        } else {
          // Proceed to next level after brief delay
          setTimeout(() => {
            setCurrentLevel((prev) => prev + 1);
            setSelectedLetter(null);
            setIsRevealed(false);
            setHiddenOptions([]);
            setShowQuestionTranslation(false);
            setOptionTranslationsOpen({});
          }, 1800);
        }
      } else {
        // Wrong answer
        sounds.playWrong();
        const guaranteed = getGuaranteedPrize(currentLevel);
        setFinalPrize(guaranteed);
        setGameOver(true);
        if (guaranteed > bestPrizeEver) {
          onRecordBestPrize(guaranteed);
        }
      }
    }, 1200);
  };

  // Walk away with current prize
  const handleWalkAway = () => {
    sounds.playClick();
    const currentPrize = currentLevel > 1 ? MILLIONAIRE_LADDER[currentLevel - 2].amount : 0;
    setFinalPrize(currentPrize);
    setWalkedAway(true);
    if (currentPrize > bestPrizeEver) {
      onRecordBestPrize(currentPrize);
    }
    onAddPoints(Math.floor(currentPrize / 100));
  };

  // Lifeline: 50:50
  const handleUse5050 = () => {
    if (lifeline5050Used || !currentQ || isRevealed) return;
    sounds.playLifeline();
    setLifeline5050Used(true);

    const incorrectLetters = currentQ.options
      .map((o) => o.letter)
      .filter((l) => l !== currentQ.correctLetter);

    // Shuffle and pick 2 to eliminate
    const shuffled = incorrectLetters.sort(() => Math.random() - 0.5);
    setHiddenOptions([shuffled[0], shuffled[1]]);
  };

  // Lifeline: Phone a Friend
  const handleUseFriend = () => {
    if (lifelineFriendUsed || !currentQ || isRevealed) return;
    sounds.playLifeline();
    setLifelineFriendUsed(true);
    setFriendModalOpen(true);
  };

  // Lifeline: Audience Vote
  const handleUseAudience = () => {
    if (lifelineAudienceUsed || !currentQ || isRevealed) return;
    sounds.playLifeline();
    setLifelineAudienceUsed(true);

    // Generate realistic audience distribution (favors correct answer)
    const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const correctLetter = currentQ.correctLetter;

    let correctPercent = 65;
    if (currentQ.tier === 1) correctPercent = 82;
    else if (currentQ.tier === 2) correctPercent = 68;
    else correctPercent = 52;

    const remaining = 100 - correctPercent;
    const other3 = letters.filter((l) => l !== correctLetter);
    const p1 = Math.floor(Math.random() * (remaining - 10));
    const p2 = Math.floor(Math.random() * (remaining - p1 - 5));
    const p3 = remaining - p1 - p2;

    const votes: Record<string, number> = {
      [correctLetter]: correctPercent,
      [other3[0]]: p1,
      [other3[1]]: p2,
      [other3[2]]: p3,
    };

    setAudienceVotes(votes);
    setAudienceModalOpen(true);
  };

  // Toggle option translation without answering
  const toggleOptionTranslation = (e: React.MouseEvent, letter: string) => {
    e.stopPropagation();
    sounds.playClick();
    setOptionTranslationsOpen((prev) => ({
      ...prev,
      [letter]: !prev[letter],
    }));
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#0a1a3e] via-[#07132e] to-[#040a1b] text-white p-4 md:p-8 rounded-3xl border border-sky-400/40 shadow-2xl relative overflow-hidden stage-glow">
      {/* Background ambient stage glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-orange-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Top TV Game Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d214d]/90 border border-sky-400/40 p-4 rounded-2xl shadow-lg backdrop-blur-md">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-400 to-orange-500 flex items-center justify-center font-extrabold text-stone-950 text-xl shadow-lg border-2 border-amber-300">
              €
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-base md:text-lg tracking-wider text-white uppercase text-gold-gradient">
                ¿Quién quiere ser millonario?
              </h1>
              <div className="text-[11px] text-sky-200 font-medium">
                Pregunta {currentLevel} de 15 · Premio en juego:{' '}
                <span className="font-bold text-amber-400">{currentLadder?.prize}</span>
              </div>
            </div>
          </div>

          {/* Lifelines */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-sky-300 mr-1 hidden sm:inline-block">
              Comodines:
            </span>

            {/* 50:50 */}
            <button
              onClick={handleUse5050}
              disabled={lifeline5050Used || isRevealed || selectedLetter !== null || gameOver || gameWon}
              title="50:50 — Elimina dos respuestas incorrectas"
              className={`w-12 h-10 rounded-xl font-extrabold text-xs flex items-center justify-center border transition-all ${
                lifeline5050Used
                  ? 'bg-blue-950/60 border-sky-900/50 text-slate-500 cursor-not-allowed line-through'
                  : 'bg-gradient-to-b from-amber-400 to-orange-500 text-stone-950 border-amber-300 hover:scale-105 shadow-md active:scale-95'
              }`}
            >
              50:50
            </button>

            {/* Llamada a un amigo */}
            <button
              onClick={handleUseFriend}
              disabled={lifelineFriendUsed || isRevealed || selectedLetter !== null || gameOver || gameWon}
              title="Llamada a un amigo — Consulta a un tutor nativo"
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                lifelineFriendUsed
                  ? 'bg-blue-950/60 border-sky-900/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-b from-amber-400 to-orange-500 text-stone-950 border-amber-300 hover:scale-105 shadow-md active:scale-95'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
            </button>

            {/* Preguntar al público */}
            <button
              onClick={handleUseAudience}
              disabled={lifelineAudienceUsed || isRevealed || selectedLetter !== null || gameOver || gameWon}
              title="Preguntar al público — Votación de la audiencia"
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                lifelineAudienceUsed
                  ? 'bg-blue-950/60 border-sky-900/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-b from-amber-400 to-orange-500 text-stone-950 border-amber-300 hover:scale-105 shadow-md active:scale-95'
              }`}
            >
              <Users className="w-4 h-4" />
            </button>

            {/* Retirarse */}
            {currentLevel > 1 && !gameOver && !gameWon && !isRevealed && selectedLetter === null && (
              <button
                onClick={handleWalkAway}
                className="ml-2 px-3 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/60 text-orange-200 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Plantarse y asegurar el dinero acumulado"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Plantarse</span>
              </button>
            )}
          </div>
        </div>

        {/* Game Main Layout: Question Stage (Left 70%) & Ladder (Right 30%) */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Main Stage */}
          <div className="lg:col-span-8 space-y-6">
            {/* Translation notice banner */}
            <div className="flex items-center justify-between text-xs text-sky-200 bg-[#071430]/70 border border-sky-400/30 px-3 py-2 rounded-xl">
              <span>
                💡 Toca la pregunta para ver su traducción. Toca el botón <b>[RU]</b> de una opción
                para traducirla sin elegirla.
              </span>
            </div>

            {/* Current Question Frame with Golden Borders */}
            {currentQ && (
              <div
                onClick={() => {
                  sounds.playClick();
                  setShowQuestionTranslation(!showQuestionTranslation);
                }}
                className="cursor-pointer bg-gradient-to-b from-[#0f285e] to-[#091a3e] border-2 border-amber-400/80 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_25px_rgba(234,179,8,0.2)] relative transition-all hover:border-amber-300"
              >
                <div className="text-[11px] uppercase tracking-widest text-amber-400 font-extrabold mb-2">
                  Pregunta {currentLevel} · {currentLadder?.prize}
                </div>
                <div className="text-xl md:text-2xl font-heading font-extrabold text-white leading-relaxed tracking-wide">
                  {currentQ.questionEs}
                </div>

                {/* Translation dropdown */}
                <AnimatePresence>
                  {showQuestionTranslation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-sky-400/30 overflow-hidden"
                    >
                      <p className="text-sm font-normal text-sky-100 italic">
                        <span className="text-xs uppercase font-bold text-amber-400 not-italic mr-1.5">
                          RU:
                        </span>
                        {currentQ.questionRu}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-[10px] text-sky-300/80 mt-2">
                  {showQuestionTranslation ? 'Toca para ocultar traducción' : 'Toca para ver traducción al ruso'}
                </div>
              </div>
            )}

            {/* 4 Large Choices A, B, C, D */}
            {currentQ && (
              <div className="grid sm:grid-cols-2 gap-4">
                {currentQ.options.map((opt) => {
                  const isHidden = hiddenOptions.includes(opt.letter);
                  const isSelected = selectedLetter === opt.letter;
                  const isCorrect = opt.letter === currentQ.correctLetter;

                  if (isHidden) {
                    return (
                      <div
                        key={opt.letter}
                        className="p-5 rounded-2xl border border-sky-950 bg-black/20 opacity-20 pointer-events-none min-h-[70px]"
                      />
                    );
                  }

                  let buttonClass =
                    'bg-[#0b1d42] hover:bg-[#132d66] border-sky-400/40 text-white hover:border-amber-400 shadow-md';

                  if (isRevealed) {
                    if (isCorrect) {
                      buttonClass =
                        'bg-emerald-950 border-emerald-400 text-emerald-200 ring-4 ring-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.5)]';
                    } else if (isSelected && !isCorrect) {
                      buttonClass =
                        'bg-red-950 border-red-500 text-red-200 ring-4 ring-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.5)]';
                    } else {
                      buttonClass = 'bg-[#060e22]/60 border-slate-800 text-slate-500 opacity-50';
                    }
                  } else if (isSelected) {
                    // Flashing pending answer
                    buttonClass =
                      'bg-amber-600/30 border-amber-400 text-amber-200 ring-2 ring-amber-400 animate-pulse';
                  }

                  const showTranslation = optionTranslationsOpen[opt.letter];

                  return (
                    <div
                      key={opt.letter}
                      onClick={() => handleSelectOption(opt.letter)}
                      className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[85px] ${buttonClass}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-black/50 border border-sky-400/50 text-amber-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                            {opt.letter}:
                          </span>
                          <span className="font-heading font-bold text-base md:text-lg">
                            {opt.textEs}
                          </span>
                        </div>

                        {/* Choice Independent Translation Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleOptionTranslation(e, opt.letter)}
                          title="Traducir esta opción sin responder"
                          className="px-2 py-1 text-xs font-semibold rounded bg-sky-950/80 text-sky-300 border border-sky-400/40 hover:bg-amber-400 hover:text-stone-950 transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Languages className="w-3.5 h-3.5" />
                          <span>RU</span>
                        </button>
                      </div>

                      {/* Revealed Translation for Option */}
                      <AnimatePresence>
                        {showTranslation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 pt-1.5 border-t border-sky-400/30 text-xs text-sky-200 italic"
                          >
                            RU: {opt.textRu}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Money Ladder Sidebar (Right 30%) */}
          <div className="lg:col-span-4 bg-[#091a3e] border border-sky-500/40 p-4 rounded-2xl shadow-xl space-y-1">
            <div className="text-xs uppercase tracking-wider text-amber-400 font-extrabold pb-2 border-b border-sky-400/20 flex items-center justify-between">
              <span>Escala de Premios</span>
              <span className="text-[10px] text-sky-300">Preguntas 1–15</span>
            </div>

            <div className="space-y-1 pt-1 font-mono text-xs">
              {[...MILLIONAIRE_LADDER].reverse().map((step) => {
                const isCurrent = step.level === currentLevel;
                const isPassed = step.level < currentLevel;

                let rowStyle = 'text-slate-400 hover:bg-white/5';
                if (isCurrent) {
                  rowStyle =
                    'bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-extrabold shadow-md scale-102';
                } else if (isPassed) {
                  rowStyle = 'text-emerald-400/90 font-medium';
                } else if (step.isCheckpoint) {
                  rowStyle = 'text-amber-300 font-bold';
                }

                return (
                  <div
                    key={step.level}
                    className={`px-3 py-1.5 rounded-lg flex items-center justify-between transition-all ${rowStyle}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-right font-bold">{step.level}</span>
                      {step.isCheckpoint && (
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <span className="tabular-nums font-bold tracking-wider">{step.prize}</span>
                  </div>
                );
              })}
            </div>

            {/* Checkpoints Legend */}
            <div className="pt-3 border-t border-sky-400/20 text-[11px] text-sky-300 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Niveles seguros: 1.000 € y 32.000 €</span>
              </div>
              <div>Mejor premio histórico: <b className="text-amber-400">{bestPrizeEver.toLocaleString()} €</b></div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: LLAMADA A UN AMIGO */}
      <AnimatePresence>
        {friendModalOpen && currentQ && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b1d42] border-2 border-amber-400 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-sky-400/20 pb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    Llamada a tu amigo (Mateo, tutor de español)
                  </h3>
                  <div className="text-xs text-emerald-400 font-semibold">
                    Confianza estimada: {currentQ.friendConfidence}%
                  </div>
                </div>
              </div>

              <div className="bg-[#061026] p-4 rounded-xl border border-sky-400/30 space-y-2">
                <p className="text-base text-white font-medium italic">
                  «{currentQ.friendHintEs}»
                </p>
                <p className="text-xs text-sky-200 pt-2 border-t border-sky-400/20">
                  Перевод подсказки друга: «{currentQ.friendHintRu}»
                </p>
              </div>

              <button
                onClick={() => setFriendModalOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-bold text-sm shadow transition-colors"
              >
                ¡Gracias Mateo! / Volver al juego
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: PREGUNTAR AL PÚBLICO */}
      <AnimatePresence>
        {audienceModalOpen && currentQ && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b1d42] border-2 border-amber-400 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-sky-400/20 pb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    Votación del público
                  </h3>
                  <div className="text-xs text-sky-200">
                    Resultados de los 100 espectadores en el plató
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="space-y-3 pt-2">
                {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                  const percent = audienceVotes[letter] || 0;
                  return (
                    <div key={letter} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-amber-400">Opción {letter}</span>
                        <span className="text-white tabular-nums">{percent}%</span>
                      </div>
                      <div className="h-4 bg-sky-950 rounded-full overflow-hidden border border-sky-900">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setAudienceModalOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-bold text-sm shadow transition-colors"
              >
                Volver al juego
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GAME OVER MODAL (Failed or Walked away or Jackpot Won) */}
      <AnimatePresence>
        {(gameOver || gameWon || walkedAway) && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-[#0b1d42] border-2 border-amber-400 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-yellow-400 to-orange-500 flex items-center justify-center shadow-xl border-2 border-amber-300">
                <Trophy className="w-10 h-10 text-stone-950" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-extrabold text-white">
                  {gameWon
                    ? '¡ENHORABUENA! ¡ERES MILLONARIO!'
                    : walkedAway
                    ? '¡JUEGO TERMINADO CON ÉXITO!'
                    : '¡RESPUESTA INCORRECTA!'}
                </h2>
                <p className="text-sm text-sky-200">
                  {gameWon
                    ? 'Has respondido las 15 preguntas correctamente y te llevas el bote máximo.'
                    : walkedAway
                    ? 'Te has plantado a tiempo y aseguras tu dinero acumulado.'
                    : 'Has alcanzado el nivel de seguridad garantizado.'}
                </p>
              </div>

              <div className="bg-[#061026] p-5 rounded-2xl border border-sky-400/40 space-y-1">
                <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  Premio Final Ganado:
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-gold-gradient tabular-nums">
                  {finalPrize.toLocaleString()} €
                </div>
              </div>

              <button
                onClick={startNewGame}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-extrabold text-base shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Jugar otra partida / Играть заново</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
