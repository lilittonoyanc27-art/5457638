import React, { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonTopicId, ExerciseItem } from './types.ts';
import { WEEKDAYS_THEORY, WEEKDAYS_EXERCISES, WEEKDAYS_DATA } from './dataWeekdays.ts';
import { NUMBERS_THEORY, NUMBERS_EXERCISES, NUMBERS_1_TO_100 } from './dataNumbers.ts';
import { POSSESSIVES_THEORY, POSSESSIVES_EXERCISES } from './dataPossessives.ts';
import { INTERROGATIVES_THEORY, INTERROGATIVES_EXERCISES } from './dataInterrogatives.ts';
import { SpanishRuText, ChoiceTranslateButton, TranslationNotice } from './spanishRuText.tsx';
import { sounds } from './sound.ts';

interface LessonViewProps {
  initialTopic?: LessonTopicId;
  onAddPoints: (amount: number) => void;
  onCompleteLesson: (lessonId: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  initialTopic = 'weekdays',
  onAddPoints,
  onCompleteLesson,
}) => {
  const [activeTopic, setActiveTopic] = useState<LessonTopicId>(initialTopic);
  const [activeTab, setActiveTab] = useState<'theory' | 'practice'>('theory');

  // Exercise state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);

  // Numbers table search filter
  const [numberSearch, setNumberSearch] = useState('');

  // Get current data based on topic
  const getTopicData = () => {
    switch (activeTopic) {
      case 'weekdays':
        return {
          title: 'Los días de la semana',
          titleRu: 'Дни недели',
          theory: WEEKDAYS_THEORY,
          exercises: WEEKDAYS_EXERCISES,
        };
      case 'numbers':
        return {
          title: 'Los números del 1 al 100',
          titleRu: 'Числа от 1 до 100',
          theory: NUMBERS_THEORY,
          exercises: NUMBERS_EXERCISES,
        };
      case 'possessives':
        return {
          title: 'Los posesivos',
          titleRu: 'Притяжательные местоимения',
          theory: POSSESSIVES_THEORY,
          exercises: POSSESSIVES_EXERCISES,
        };
      case 'interrogatives':
        return {
          title: 'Los interrogativos',
          titleRu: 'Вопросительные слова',
          theory: INTERROGATIVES_THEORY,
          exercises: INTERROGATIVES_EXERCISES,
        };
    }
  };

  const currentTopicData = getTopicData();
  const currentExercises = currentTopicData.exercises;
  const currentEx = currentExercises[currentIndex] || currentExercises[0];

  const handleSelectTopic = (topic: LessonTopicId) => {
    sounds.playClick();
    setActiveTopic(topic);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setSolvedCount(0);
  };

  const handleCheckAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isRight = option.trim().toLowerCase() === (currentEx.correctAnswer as string).trim().toLowerCase();
    setIsCorrect(isRight);

    if (isRight) {
      sounds.playCorrect();
      setScore((prev) => prev + 10);
      setSolvedCount((prev) => prev + 1);
      onAddPoints(10);
      onCompleteLesson(`${activeTopic}-${currentEx.id}`);
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex < currentExercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
  };

  // Filtered numbers
  const filteredNumbers = NUMBERS_1_TO_100.filter(
    (n) =>
      n.num.toString().includes(numberSearch.trim()) ||
      n.es.toLowerCase().includes(numberSearch.toLowerCase()) ||
      n.ru.toLowerCase().includes(numberSearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Topics Selector Bar */}
      <div className="bg-[#0b1a3d] p-2.5 rounded-2xl border border-sky-800/80 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => handleSelectTopic('weekdays')}
            className={`p-3 rounded-xl text-left transition-all ${
              activeTopic === 'weekdays'
                ? 'bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 border-2 border-amber-400 shadow-md'
                : 'hover:bg-white/5 text-stone-300'
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-amber-300 font-extrabold">Tema 1</div>
            <div className="font-heading font-bold text-white text-sm md:text-base">Los días</div>
            <div className="text-xs text-sky-200">Дни недели (40+ заданий)</div>
          </button>

          <button
            onClick={() => handleSelectTopic('numbers')}
            className={`p-3 rounded-xl text-left transition-all ${
              activeTopic === 'numbers'
                ? 'bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 border-2 border-amber-400 shadow-md'
                : 'hover:bg-white/5 text-stone-300'
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-amber-300 font-extrabold">Tema 2</div>
            <div className="font-heading font-bold text-white text-sm md:text-base">Los números</div>
            <div className="text-xs text-sky-200">Числа 1–100 (50+ заданий)</div>
          </button>

          <button
            onClick={() => handleSelectTopic('possessives')}
            className={`p-3 rounded-xl text-left transition-all ${
              activeTopic === 'possessives'
                ? 'bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 border-2 border-amber-400 shadow-md'
                : 'hover:bg-white/5 text-stone-300'
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-amber-300 font-extrabold">Tema 3</div>
            <div className="font-heading font-bold text-white text-sm md:text-base">Los posesivos</div>
            <div className="text-xs text-sky-200">Притяжательные (60+ заданий)</div>
          </button>

          <button
            onClick={() => handleSelectTopic('interrogatives')}
            className={`p-3 rounded-xl text-left transition-all ${
              activeTopic === 'interrogatives'
                ? 'bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 border-2 border-amber-400 shadow-md'
                : 'hover:bg-white/5 text-stone-300'
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-amber-300 font-extrabold">Tema 4</div>
            <div className="font-heading font-bold text-white text-sm md:text-base">Los interrogativos</div>
            <div className="text-xs text-sky-200">Вопросительные (55+ заданий)</div>
          </button>
        </div>
      </div>

      {/* Lesson Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-sky-900/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
              {currentTopicData.title}
            </h1>
            <span className="text-sm text-amber-300">({currentTopicData.titleRu})</span>
          </div>
          <p className="text-sm text-sky-100/80 mt-1 max-w-2xl">
            {currentTopicData.theory.descriptionEs}
          </p>
        </div>

        {/* Sub-tabs: Theory vs Practice */}
        <div className="flex items-center gap-1.5 p-1 bg-[#091533] rounded-xl border border-sky-800">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('theory');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'theory'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Teoría / Теория</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('practice');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'practice'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Práctica / Практика ({currentExercises.length})</span>
          </button>
        </div>
      </div>

      {/* Translation notice */}
      <TranslationNotice />

      {/* Tab 1: Theory View */}
      {activeTab === 'theory' && (
        <div className="space-y-8">
          {/* Weekdays specific quick grid */}
          {activeTopic === 'weekdays' && (
            <div className="bg-[#0b1a3d] p-6 rounded-2xl border border-sky-600/40 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-amber-300">Los 7 días de la semana:</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {WEEKDAYS_DATA.map((day) => (
                  <div
                    key={day.es}
                    className="bg-[#0e2456] hover:bg-[#15367c] border border-sky-400/30 p-3 rounded-xl text-center transition-all cursor-pointer group"
                  >
                    <span className="block text-xs text-amber-400 font-extrabold uppercase mb-1">
                      {day.abbr}
                    </span>
                    <SpanishRuText
                      es={day.es}
                      ru={day.ru}
                      size="base"
                      className="text-center font-bold"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Numbers specific full 1-100 Table */}
          {activeTopic === 'numbers' && (
            <div className="bg-[#0b1a3d] p-6 rounded-2xl border border-sky-600/40 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-amber-300">
                    Tabla interactiva del 1 al 100
                  </h2>
                  <p className="text-xs text-sky-200">
                    Toca cualquier número para ver su ortografía y traducción exacta.
                  </p>
                </div>
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={numberSearch}
                    onChange={(e) => setNumberSearch(e.target.value)}
                    placeholder="Buscar (ej. 23, veinte, тридцать)..."
                    className="w-full bg-[#07132e] border border-sky-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Numbers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 max-h-96 overflow-y-auto pr-1">
                {filteredNumbers.map((n) => (
                  <div
                    key={n.num}
                    className="bg-[#0e2456] hover:bg-[#15367c] border border-sky-500/20 p-2 rounded-lg text-center transition-all cursor-pointer group"
                  >
                    <div className="text-base font-extrabold text-amber-300">{n.num}</div>
                    <SpanishRuText es={n.es} ru={n.ru} size="sm" className="font-medium" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Possessives Table */}
          {activeTopic === 'possessives' && POSSESSIVES_THEORY.tables && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Short forms */}
              <div className="bg-[#0b1a3d] p-5 rounded-2xl border border-orange-500/40 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-orange-300">
                    Formas cortas (átonas)
                  </h3>
                  <span className="text-xs text-orange-400 font-mono">delante del sustantivo</span>
                </div>
                <div className="space-y-2">
                  {POSSESSIVES_THEORY.tables.shortForms.map((row) => (
                    <div
                      key={row.person}
                      className="bg-black/30 p-2.5 rounded-lg flex items-center justify-between text-xs"
                    >
                      <span className="text-sky-300 w-24 shrink-0 font-medium">{row.person}</span>
                      <div className="flex-1 font-bold text-white">
                        <span className="text-amber-300">{row.singular}</span> /{' '}
                        <span className="text-orange-300">{row.plural}</span>
                      </div>
                      <span className="text-stone-300 text-right">{row.ru}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tonic forms */}
              <div className="bg-[#0b1a3d] p-5 rounded-2xl border border-amber-500/40 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-amber-300">
                    Formas tónicas (completas)
                  </h3>
                  <span className="text-xs text-amber-400 font-mono">detrás / tras «ser»</span>
                </div>
                <div className="space-y-2">
                  {POSSESSIVES_THEORY.tables.tonicForms.map((row) => (
                    <div
                      key={row.person}
                      className="bg-black/30 p-2.5 rounded-lg flex items-center justify-between text-xs"
                    >
                      <span className="text-sky-300 w-24 shrink-0 font-medium">{row.person}</span>
                      <div className="flex-1 font-bold text-white text-[11px]">
                        <span className="text-amber-300">{row.singularM}</span> / {row.singularF} /{' '}
                        {row.pluralM} / {row.pluralF}
                      </div>
                      <span className="text-stone-300 text-right">{row.ru}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interrogatives Table */}
          {activeTopic === 'interrogatives' && INTERROGATIVES_THEORY.words && (
            <div className="bg-[#0b1a3d] p-5 rounded-2xl border border-sky-600/40 space-y-3 shadow-xl">
              <h3 className="text-base font-bold text-amber-300">
                Todas las partículas interrogativas con traducción y ejemplo:
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {INTERROGATIVES_THEORY.words.map((w) => (
                  <div
                    key={w.es}
                    className="bg-[#0e2456] hover:bg-[#15367c] border border-sky-400/30 p-3.5 rounded-xl space-y-1 transition-all"
                  >
                    <div className="font-heading font-extrabold text-lg text-amber-300">
                      {w.es}
                    </div>
                    <div className="text-xs text-sky-200 italic">{w.ru}</div>
                    <div className="pt-2 border-t border-sky-800">
                      <SpanishRuText es={w.exampleEs} ru={w.exampleRu} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Theory Rules Accordion / Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-white">
              Reglas y explicaciones gramaticales:
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {currentTopicData.theory.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b1a3d] border border-sky-800/80 hover:border-amber-400/60 p-5 rounded-2xl space-y-3 transition-all shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">
                        {rule.conceptEs}
                      </h3>
                      <p className="text-xs text-amber-300/90">{rule.conceptRu}</p>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-sky-100/90 leading-relaxed">
                    {rule.explanationRu}
                  </p>

                  <div className="bg-black/35 p-3 rounded-xl border border-sky-800/60">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                      Ejemplo / Пример (toca para traducir):
                    </span>
                    <SpanishRuText es={rule.exampleEs} ru={rule.exampleRu} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice CTA Banner */}
          <div className="bg-gradient-to-r from-[#0d275a] via-[#113883] to-[#0a1e45] p-6 rounded-2xl border-2 border-amber-400/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h3 className="text-xl font-heading font-extrabold text-white">
                ¿Listo para practicar?
              </h3>
              <p className="text-sm text-sky-100">
                Pon a prueba lo aprendido con {currentExercises.length} ejercicios interactivos.
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('practice');
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 font-extrabold hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>Comenzar práctica</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Practice Mode */}
      {activeTab === 'practice' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress & Score Bar */}
          <div className="flex items-center justify-between gap-4 bg-[#0b1a3d] p-4 rounded-xl border border-sky-800">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-400">Ejercicio</span>
              <span className="font-bold text-white text-base tabular-nums">
                {currentIndex + 1} / {currentExercises.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex-1 max-w-xs h-2.5 bg-[#07132e] rounded-full overflow-hidden border border-sky-900">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-amber-400 to-orange-500 transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / currentExercises.length) * 100}%`,
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-sky-200">Puntos:</span>
              <span className="font-bold text-amber-400 text-sm tabular-nums">+{score} pts</span>
            </div>
          </div>

          {/* Exercise Card */}
          <div className="bg-[#0b1a3d] p-6 md:p-8 rounded-2xl border-2 border-sky-600/50 space-y-6 shadow-2xl">
            {/* Instruction */}
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                {currentEx.instructionEs}
              </div>
              <p className="text-xs text-sky-200 italic">{currentEx.instructionRu}</p>
            </div>

            {/* Main Question with Interactive Translation */}
            <div className="bg-[#081534] p-4 rounded-xl border border-sky-700/60">
              <SpanishRuText
                es={currentEx.questionEs}
                ru={currentEx.questionRu}
                size="lg"
                className="font-bold"
              />
            </div>

            {/* Answer Options */}
            {currentEx.options && (
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {currentEx.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt.es;
                  const isRightOption =
                    opt.es.trim().toLowerCase() ===
                    (currentEx.correctAnswer as string).trim().toLowerCase();

                  let buttonStyles =
                    'bg-[#0e2456] hover:bg-[#15367c] border-sky-700 text-white';

                  if (isAnswered) {
                    if (isRightOption) {
                      buttonStyles =
                        'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
                    } else if (isSelected && !isRightOption) {
                      buttonStyles =
                        'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
                    } else {
                      buttonStyles = 'bg-stone-900/50 border-stone-800 text-stone-400 opacity-60';
                    }
                  } else if (isSelected) {
                    buttonStyles = 'bg-amber-500/30 border-amber-400 text-amber-200';
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleCheckAnswer(opt.es)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${buttonStyles}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-black/40 font-bold text-xs flex items-center justify-center shrink-0 text-amber-300">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-semibold text-sm md:text-base">{opt.es}</span>
                      </div>

                      {/* Independent Translation Button */}
                      <ChoiceTranslateButton ru={opt.ru} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Answer Feedback / Explanation */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    isCorrect
                      ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                      : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-bold text-sm">
                      {isCorrect ? '¡Excelente! Respuesta correcta (+10 pts)' : '¡Incorrecto!'}
                    </div>
                    {!isCorrect && (
                      <div className="text-xs text-sky-100">
                        Respuesta correcta:{' '}
                        <span className="font-bold text-amber-300">
                          {String(currentEx.correctAnswer)}
                        </span>
                      </div>
                    )}
                    {currentEx.explanationRu && (
                      <p className="text-xs text-sky-200 pt-1 leading-relaxed">
                        {currentEx.explanationRu}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
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
                onClick={handleRestart}
                className="p-2 text-sky-300 hover:text-white transition-colors"
                title="Reiniciar práctica"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === currentExercises.length - 1}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-stone-950 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
