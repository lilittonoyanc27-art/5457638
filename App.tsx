import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Trophy,
  ArrowRight,
  RotateCcw,
  Calendar,
  Hash,
  KeyRound,
  FileQuestion,
  Languages,
  Library,
  Gamepad2,
  ChevronRight,
} from 'lucide-react';
import { AppMode, LessonTopicId } from './types.ts';
import { Navbar } from './Navbar.tsx';
import { LessonView } from './LessonView.tsx';
import { TranslatePracticeView } from './TranslatePracticeView.tsx';
import { ReadingView } from './ReadingView.tsx';
import { MiniGamesView } from './MiniGamesView.tsx';
import { MillionaireGame } from './MillionaireGame.tsx';
import { SpanishRuText } from './spanishRuText.tsx';
import { sounds } from './sound.ts';

const STORAGE_KEY = 'ole_espanol_stats_v1';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('home');
  const [activeLessonTopic, setActiveLessonTopic] = useState<LessonTopicId>('weekdays');

  // Stats in localStorage
  const [points, setPoints] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [translateCompletedIds, setTranslateCompletedIds] = useState<string[]>([]);
  const [millionaireBestPrize, setMillionaireBestPrize] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.points === 'number') setPoints(parsed.points);
        if (Array.isArray(parsed.completedLessons)) setCompletedLessons(parsed.completedLessons);
        if (Array.isArray(parsed.translateCompletedIds)) setTranslateCompletedIds(parsed.translateCompletedIds);
        if (typeof parsed.millionaireBestPrize === 'number') setMillionaireBestPrize(parsed.millionaireBestPrize);
        if (typeof parsed.soundEnabled === 'boolean') {
          setSoundEnabled(parsed.soundEnabled);
          sounds.enabled = parsed.soundEnabled;
        }
      }
    } catch {
      //
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      const data = {
        points,
        completedLessons,
        translateCompletedIds,
        millionaireBestPrize,
        soundEnabled,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      //
    }
  }, [points, completedLessons, translateCompletedIds, millionaireBestPrize, soundEnabled]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  const handleAddPoints = (amount: number) => {
    setPoints((prev) => prev + amount);
  };

  const handleCompleteLesson = (id: string) => {
    setCompletedLessons((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleRecordTranslate = (id: string) => {
    setTranslateCompletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleRecordMillionairePrize = (amount: number) => {
    if (amount > millionaireBestPrize) {
      setMillionaireBestPrize(amount);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('¿Deseas reiniciar todo tu progreso y puntos? / Вы уверены, что хотите сбросить прогресс?')) {
      sounds.playClick();
      setPoints(0);
      setCompletedLessons([]);
      setTranslateCompletedIds([]);
      setMillionaireBestPrize(0);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const navigateToLesson = (topic: LessonTopicId) => {
    sounds.playClick();
    setActiveLessonTopic(topic);
    setCurrentMode('lessons');
  };

  return (
    <div className="min-h-screen bg-[#060e22] text-white flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        points={points}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full pb-16">
        {currentMode === 'home' && (
          <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="inline-block px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold uppercase tracking-wider">
                Plataforma Educativa Interactiva A1–A2
              </span>
              <h1 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-white leading-tight">
                Aprende Español con Traducción Instantánea
              </h1>
              <p className="text-base md:text-lg text-sky-100/90 leading-relaxed">
                Нажимайте на любой испанский текст, предложение или слово, чтобы мгновенно увидеть точный русский перевод. Учитесь в ярком интерактивном формате и выигрывайте 1.000.000 € в телевизионной викторине!
              </p>
            </div>

            {/* Translation sample pill */}
            <div className="max-w-md mx-auto text-center">
              <div className="bg-[#0b1b3d]/90 border border-sky-400/30 p-4 rounded-2xl shadow-xl">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                  Ejemplo interactivo (toca para traducir):
                </span>
                <SpanishRuText
                  es="¿Qué día es hoy? — Hoy es viernes y estudio español."
                  ru="Какой сегодня день? — Сегодня пятница, и я учу испанский."
                  size="base"
                  className="font-semibold text-center"
                />
              </div>
            </div>

            {/* TWO BIG MAIN BUTTONS REQUIRED BY SECTION 1 */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              {/* BUTTON 1: APRENDER Y PRACTICAR */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentMode('lessons');
                }}
                className="group relative text-left p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0c2452] via-[#091b3f] to-[#06122d] border-2 border-sky-400/60 hover:border-sky-300 hover:shadow-[0_0_35px_rgba(56,189,248,0.35)] transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-400/25 transition-all" />

                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg border border-sky-200">
                    <BookOpen className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wider text-sky-300 font-extrabold">
                      Sección 1 · Teoría y Práctica
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white group-hover:text-sky-200 transition-colors">
                      APRENDER Y PRACTICAR
                    </h2>
                    <p className="text-sm font-semibold text-amber-300">
                      Учиться и практиковаться
                    </p>
                  </div>

                  <p className="text-xs md:text-sm text-sky-100/80 leading-relaxed">
                    4 подробные темы (дни недели, числа 1–100, притяжательные формы, вопросительные слова), интерактивный переводчик и чтение с тестами.
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-sm font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>Entrar a las lecciones</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* BUTTON 2: ¿QUIÉN QUIERE SER MILLONARIO? */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentMode('millionaire');
                }}
                className="group relative text-left p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#121c44] via-[#0b1436] to-[#060c22] border-2 border-amber-400/80 hover:border-amber-300 hover:shadow-[0_0_40px_rgba(250,204,21,0.35)] transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/25 transition-all" />

                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-orange-500 text-stone-950 flex items-center justify-center font-extrabold text-2xl shadow-lg border-2 border-amber-200">
                    1M €
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wider text-amber-400 font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Juego de Televisión Oficial</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white text-gold-gradient group-hover:opacity-90 transition-opacity">
                      ¿QUIÉN QUIERE SER MILLONARIO?
                    </h2>
                    <p className="text-sm font-semibold text-orange-300">
                      Кто хочет стать миллионером?
                    </p>
                  </div>

                  <p className="text-xs md:text-sm text-sky-100/80 leading-relaxed">
                    15 уровней сложности, 3 подсказки (50:50, звонок другу, зал), несгораемые суммы, звуки телешоу и перевод каждого вопроса по нажатию.
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-sm font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>Jugar por 1.000.000 €</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            </div>

            {/* Quick Curriculum Modules Grid */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between border-b border-sky-900/60 pb-3">
                <h3 className="text-xl font-heading font-bold text-white">
                  Temas y Módulos de Aprendizaje A1–A2
                </h3>
                <span className="text-xs text-sky-400 font-medium">Acceso directo</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Topic 1 */}
                <div
                  onClick={() => navigateToLesson('weekdays')}
                  className="bg-[#0b1a3d] hover:bg-[#102758] p-5 rounded-2xl border border-sky-600/40 hover:border-sky-400 transition-all cursor-pointer group space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center font-bold">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                      40+ ejercicios
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-300 transition-colors">
                      Los días de la semana
                    </h4>
                    <p className="text-xs text-sky-200/80">Дни недели, ayer/hoy/mañana</p>
                  </div>
                  <div className="text-xs text-sky-300 font-semibold flex items-center gap-1">
                    <span>Abrir lección</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Topic 2 */}
                <div
                  onClick={() => navigateToLesson('numbers')}
                  className="bg-[#0b1a3d] hover:bg-[#102758] p-5 rounded-2xl border border-orange-500/40 hover:border-orange-400 transition-all cursor-pointer group space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-300 flex items-center justify-center font-bold">
                      <Hash className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                      50+ ejercicios
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-300 transition-colors">
                      Los números del 1 al 100
                    </h4>
                    <p className="text-xs text-sky-200/80">Таблица 1–100, правила, ударения</p>
                  </div>
                  <div className="text-xs text-orange-300 font-semibold flex items-center gap-1">
                    <span>Abrir lección</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Topic 3 */}
                <div
                  onClick={() => navigateToLesson('possessives')}
                  className="bg-[#0b1a3d] hover:bg-[#102758] p-5 rounded-2xl border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer group space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                      60+ ejercicios
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-300 transition-colors">
                      Los posesivos
                    </h4>
                    <p className="text-xs text-sky-200/80">mi vs mío, tu vs tuyo, su vs suyo</p>
                  </div>
                  <div className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                    <span>Abrir lección</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Topic 4 */}
                <div
                  onClick={() => navigateToLesson('interrogatives')}
                  className="bg-[#0b1a3d] hover:bg-[#102758] p-5 rounded-2xl border border-sky-500/40 hover:border-sky-400 transition-all cursor-pointer group space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center font-bold">
                      <FileQuestion className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                      55+ ejercicios
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-300 transition-colors">
                      Los interrogativos
                    </h4>
                    <p className="text-xs text-sky-200/80">¿Qué?, ¿Dónde?, ¿Quién?, ¿Cuál?</p>
                  </div>
                  <div className="text-xs text-sky-300 font-semibold flex items-center gap-1">
                    <span>Abrir lección</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Special Section Cards */}
            <div className="grid md:grid-cols-3 gap-6 pt-4">
              <div
                onClick={() => {
                  sounds.playClick();
                  setCurrentMode('translate');
                }}
                className="bg-[#0b1a3d] hover:bg-[#122b5e] border border-amber-400/40 p-6 rounded-2xl cursor-pointer transition-all space-y-3 shadow-xl group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold border border-amber-400/30">
                  <Languages className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  Traduce al español
                </h4>
                <p className="text-xs text-sky-100/80 leading-relaxed">
                  50+ практических предложений для перевода с русского на испанский со специальной клавиатурой ударений и мгновенной проверкой.
                </p>
                <span className="text-xs font-bold text-amber-400 block pt-1">
                  Abrir entrenador →
                </span>
              </div>

              <div
                onClick={() => {
                  sounds.playClick();
                  setCurrentMode('reading');
                }}
                className="bg-[#0b1a3d] hover:bg-[#122b5e] border border-sky-400/40 p-6 rounded-2xl cursor-pointer transition-all space-y-3 shadow-xl group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold border border-sky-400/30">
                  <Library className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                  Lecturas y comprensión
                </h4>
                <p className="text-xs text-sky-100/80 leading-relaxed">
                  Полноценные тексты («La semana de Ana», «La familia de Pablo», «Un día en el instituto») с переводом каждого предложения и тестами.
                </p>
                <span className="text-xs font-bold text-sky-300 block pt-1">
                  Leer historias →
                </span>
              </div>

              <div
                onClick={() => {
                  sounds.playClick();
                  setCurrentMode('minigames');
                }}
                className="bg-[#0b1a3d] hover:bg-[#122b5e] border border-orange-400/40 p-6 rounded-2xl cursor-pointer transition-all space-y-3 shadow-xl group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-300 flex items-center justify-center font-bold border border-orange-400/30">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                  Juegos interactivos
                </h4>
                <p className="text-xs text-sky-100/80 leading-relaxed">
                  8 мини-игр: найди ошибку, составь предложение, угадай число, подбери вопрос и расставь дни по порядку.
                </p>
                <span className="text-xs font-bold text-orange-300 block pt-1">
                  Jugar ahora →
                </span>
              </div>
            </div>

            {/* Bottom Progress Reset */}
            <div className="pt-8 border-t border-sky-900/60 flex items-center justify-between text-xs text-sky-300/70">
              <div>
                Progreso guardado automáticamente en tu navegador (localStorage).
              </div>
              <button
                onClick={handleResetProgress}
                className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar datos</span>
              </button>
            </div>
          </div>
        )}

        {/* Lecciones */}
        {currentMode === 'lessons' && (
          <LessonView
            initialTopic={activeLessonTopic}
            onAddPoints={handleAddPoints}
            onCompleteLesson={handleCompleteLesson}
          />
        )}

        {/* Traduce al español */}
        {currentMode === 'translate' && (
          <TranslatePracticeView
            onAddPoints={handleAddPoints}
            onRecordCompleted={handleRecordTranslate}
            completedIds={translateCompletedIds}
          />
        )}

        {/* Lecturas */}
        {currentMode === 'reading' && <ReadingView onAddPoints={handleAddPoints} />}

        {/* Mini-juegos */}
        {currentMode === 'minigames' && <MiniGamesView onAddPoints={handleAddPoints} />}

        {/* ¿Quién quiere ser millonario? */}
        {currentMode === 'millionaire' && (
          <MillionaireGame
            onAddPoints={handleAddPoints}
            onRecordBestPrize={handleRecordMillionairePrize}
            bestPrizeEver={millionaireBestPrize}
          />
        )}
      </main>
    </div>
  );
}
