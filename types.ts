export type AppMode = 
  | 'home'
  | 'lessons'
  | 'translate'
  | 'reading'
  | 'minigames'
  | 'millionaire';

export type LessonTopicId = 'weekdays' | 'numbers' | 'possessives' | 'interrogatives';

export interface ExerciseItem {
  id: string;
  type: 'choice' | 'order' | 'missing' | 'fix' | 'dialogue' | 'qa' | 'translate';
  instructionEs: string;
  instructionRu: string;
  questionEs: string;
  questionRu: string;
  options?: { es: string; ru: string }[];
  correctAnswer: string | string[]; // Single string or array of words for order
  explanationEs?: string;
  explanationRu?: string;
  contextEs?: string;
  contextRu?: string;
}

export interface ReadingSentence {
  id: string;
  es: string;
  ru: string;
  highlightTypes?: ('day' | 'number' | 'possessive' | 'question')[];
}

export interface ReadingComprehensionQ {
  id: string;
  questionEs: string;
  questionRu: string;
  options: { es: string; ru: string }[];
  correctIndex: number;
  explanationRu: string;
}

export interface TrueFalseQ {
  id: string;
  statementEs: string;
  statementRu: string;
  isTrue: boolean;
  explanationRu: string;
}

export interface BlankExercise {
  id: string;
  sentenceWithBlankEs: string;
  sentenceRu: string;
  options: { es: string; ru: string }[];
  correctAnswer: string;
  explanationRu: string;
}

export interface GrammarFromTextQ {
  id: string;
  questionEs: string;
  questionRu: string;
  options: { es: string; ru: string }[];
  correctIndex: number;
  explanationRu: string;
}

export interface TextStory {
  id: string;
  titleEs: string;
  titleRu: string;
  descriptionEs: string;
  descriptionRu: string;
  sentences: ReadingSentence[];
  comprehensionQuestions: ReadingComprehensionQ[];
  trueFalseTasks: TrueFalseQ[];
  multipleChoiceTests: ReadingComprehensionQ[];
  blankExercises: BlankExercise[];
  grammarQuestions: GrammarFromTextQ[];
  retellPrompts: { es: string; ru: string }[];
}

export interface MillionaireQuestion {
  id: string;
  tier: 1 | 2 | 3; // 1: 1-5 (easy), 2: 6-10 (medium), 3: 11-15 (hard)
  questionEs: string;
  questionRu: string;
  topic: 'weekdays' | 'numbers' | 'possessives' | 'interrogatives' | 'general';
  options: {
    letter: 'A' | 'B' | 'C' | 'D';
    textEs: string;
    textRu: string;
  }[];
  correctLetter: 'A' | 'B' | 'C' | 'D';
  friendHintEs: string;
  friendHintRu: string;
  friendConfidence: number; // e.g. 90% or 60%
}

export interface TranslateItem {
  id: string;
  topic: LessonTopicId;
  russianSentence: string;
  acceptableSpanish: string[];
  canonicalSpanish: string;
  hintEs: string;
  hintRu: string;
  explanationRu: string;
}

export interface MiniGameTask {
  id: string;
  type: string;
  promptEs: string;
  promptRu: string;
  subtextEs?: string;
  subtextRu?: string;
  options?: { es: string; ru: string }[];
  correctAnswer: string | string[];
  explanationEs?: string;
  explanationRu?: string;
}

export interface UserStats {
  points: number;
  completedLessons: string[];
  translateCompletedIds: string[];
  millionaireBestPrize: number;
  millionaireWins: number;
  soundEnabled: boolean;
}
