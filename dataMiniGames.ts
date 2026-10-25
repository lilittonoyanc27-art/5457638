import { MiniGameTask } from './types.ts';

// 1. ENCUENTRA EL ERROR (Find the error in grammar/spelling)
export const ERROR_HUNT_TASKS: MiniGameTask[] = [
  {
    id: 'err-1',
    type: 'error',
    promptEs: 'Encuentra la frase con un error gramatical:',
    promptRu: 'Найдите предложение с грамматической ошибкой:',
    options: [
      { es: 'En el lunes estudio español.', ru: 'В понедельник я учу испанский (ошибка: en не нужен)' },
      { es: 'El lunes estudio español.', ru: 'В понедельник я учу испанский (правильно)' },
      { es: 'Los lunes estudio español.', ru: 'По понедельникам я учу испанский (правильно)' },
      { es: 'Hoy es lunes.', ru: 'Сегодня понедельник (правильно)' },
    ],
    correctAnswer: 'En el lunes estudio español.',
    explanationRu: 'В испанском языке перед днями недели не употребляется предлог «en»! Правильно: «El lunes...».',
  },
  {
    id: 'err-2',
    type: 'error',
    promptEs: '¿Dónde está el error de acentuación?',
    promptRu: 'Где ошибка в ударении?',
    options: [
      { es: '¿Donde vives?', ru: 'Где ты живёшь? (ошибка: нет тильды на Dónde)' },
      { es: '¿Dónde vives?', ru: 'Правильно с тильдой' },
      { es: '¿Qué haces?', ru: 'Правильно' },
      { es: '¿Cómo estás?', ru: 'Правильно' },
    ],
    correctAnswer: '¿Donde vives?',
    explanationRu: 'Вопросительное слово «Dónde» обязательно пишется с ударением: «¿Dónde vives?».',
  },
  {
    id: 'err-3',
    type: 'error',
    promptEs: 'Encuentra el número mal escrito:',
    promptRu: 'Найдите число, написанное с ошибкой:',
    options: [
      { es: 'Veinte y tres', ru: '23 (ошибка: должно писаться слитно veintitrés)' },
      { es: 'Veintitrés', ru: '23 (правильно)' },
      { es: 'Treinta y tres', ru: '33 (правильно)' },
      { es: 'Cuarenta y tres', ru: '43 (правильно)' },
    ],
    correctAnswer: 'Veinte y tres',
    explanationRu: 'Числа от 16 до 29 пишутся слитно в одно слово: veintitrés.',
  },
  {
    id: 'err-4',
    type: 'error',
    promptEs: 'Encuentra el posesivo mal empleado:',
    promptRu: 'Найдите ошибку в употреблении притяжательного слова:',
    options: [
      { es: 'El mi libro es nuevo.', ru: 'Моя книга новая (ошибка: артикль перед mi запрещён)' },
      { es: 'Mi libro es nuevo.', ru: 'Моя книга новая (правильно)' },
      { es: 'El libro mío es nuevo.', ru: 'Моя книга новая (правильно)' },
      { es: 'Este libro es mío.', ru: 'Эта книга моя (правильно)' },
    ],
    correctAnswer: 'El mi libro es nuevo.',
    explanationRu: 'Определенный артикль никогда не ставится перед краткими формами mi/tu/su.',
  },
  {
    id: 'err-5',
    type: 'error',
    promptEs: 'Encuentra la frase incorrecta:',
    promptRu: 'Найдите неверную фразу:',
    options: [
      { es: '¿Cuál día tienes libre?', ru: 'Какой день у тебя свободен? (ошибка: какой + сущ. = qué)' },
      { es: '¿Qué día tienes libre?', ru: 'Правильно (qué + существительное)' },
      { es: '¿Cuál es tu día favorito?', ru: 'Правильно (cuál + es)' },
      { es: '¿Cuándo tienes tiempo libre?', ru: 'Правильно' },
    ],
    correctAnswer: '¿Cuál día tienes libre?',
    explanationRu: 'Перед существительным используется ТОЛЬКО «qué»: «¿Qué día...?». Конструкция «cuál + сущ.» недопустима.',
  },
  {
    id: 'err-6',
    type: 'error',
    promptEs: 'Encuentra el error de concordancia:',
    promptRu: 'Найдите ошибку в согласовании:',
    options: [
      { es: 'Tengo veintiuno casas.', ru: 'У меня 21 дом (ошибка: casas женского рода -> veintiuna)' },
      { es: 'Tengo veintiuna casas.', ru: 'Правильно' },
      { es: 'Tengo veintiún libros.', ru: 'Правильно' },
      { es: 'Tengo veinte casas.', ru: 'Правильно' },
    ],
    correctAnswer: 'Tengo veintiuno casas.',
    explanationRu: 'Перед существительным женского рода (casas) форма числительного согласуется: veintiuna casas.',
  },
  {
    id: 'err-7',
    type: 'error',
    promptEs: 'Encuentra el error en el plural del día de la semana:',
    promptRu: 'Найдите ошибку во множественном числе дня недели:',
    options: [
      { es: 'Los marteses juego al tenis.', ru: 'По вторникам играю в теннис (ошибка: marteses не существует)' },
      { es: 'Los martes juego al tenis.', ru: 'Правильно (los martes)' },
      { es: 'Los sábados juego al tenis.', ru: 'Правильно (los sábados)' },
      { es: 'Los domingos juego al tenis.', ru: 'Правильно (los domingos)' },
    ],
    correctAnswer: 'Los marteses juego al tenis.',
    explanationRu: 'Дни на -s не меняются во множественном числе: los martes, los lunes, los miércoles.',
  },
  {
    id: 'err-8',
    type: 'error',
    promptEs: 'Encuentra el error en el pronombre interrogativo:',
    promptRu: 'Найдите ошибку в вопросе:',
    options: [
      { es: '¿Quiénes es el profesor nuevo?', ru: 'Кто новый учитель? (ошибка: quiénes для множественного числа, а глагол es в единственном)' },
      { es: '¿Quién es el profesor nuevo?', ru: 'Правильно в единственном числе' },
      { es: '¿Quiénes son los profesores nuevos?', ru: 'Правильно во множественном числе' },
      { es: '¿Cómo se llama el profesor nuevo?', ru: 'Правильно' },
    ],
    correctAnswer: '¿Quiénes es el profesor nuevo?',
    explanationRu: 'Quiénes требует глагола во множественном числе (son). Для единственного числа (es) используется «Quién».',
  },
  {
    id: 'err-9',
    type: 'error',
    promptEs: 'Encuentra la frase con error en el posesivo:',
    promptRu: 'Найдите ошибку в притяжательном местоимении:',
    options: [
      { es: 'La casa es mi.', ru: 'Дом мой (ошибка: краткая форма mi не может быть сказуемым)' },
      { es: 'La casa es mía.', ru: 'Правильно' },
      { es: 'Es mi casa.', ru: 'Правильно' },
      { es: 'Esta casa es nuestra.', ru: 'Правильно' },
    ],
    correctAnswer: 'La casa es mi.',
    explanationRu: 'После глагола ser используется полная форма: «La casa es mía».',
  },
  {
    id: 'err-10',
    type: 'error',
    promptEs: 'Encuentra la ortografía incorrecta del número 16:',
    promptRu: 'Найдите неверное написание числа 16:',
    options: [
      { es: 'Diez y seis', ru: '16 (устаревшее/ошибочное написание)' },
      { es: 'Dieciséis', ru: '16 (правильно слитно с ударением)' },
      { es: 'Diecisiete', ru: '17' },
      { es: 'Dieciocho', ru: '18' },
    ],
    correctAnswer: 'Diez y seis',
    explanationRu: 'Число 16 пишется в одно слово с тильдой: dieciséis.',
  },
];

// 2. ORDENA LAS PALABRAS (Unscramble the sentence)
export const WORD_ORDER_TASKS: {
  id: string;
  scrambled: string[];
  correct: string[];
  ru: string;
}[] = [
  {
    id: 'wo-1',
    scrambled: ['estudia', 'Mi', 'hermana', 'los', 'lunes.'],
    correct: ['Mi', 'hermana', 'estudia', 'los', 'lunes.'],
    ru: 'Моя сестра учится по понедельникам.',
  },
  {
    id: 'wo-2',
    scrambled: ['es', 'Hoy', 'mañana', 'es', 'miércoles', 'jueves.', 'y'],
    correct: ['Hoy', 'es', 'miércoles', 'y', 'mañana', 'es', 'jueves.'],
    ru: 'Сегодня среда, а завтра четверг.',
  },
  {
    id: 'wo-3',
    scrambled: ['viernes.', 'Trabajamos', 'de', 'lunes', 'a'],
    correct: ['Trabajamos', 'de', 'lunes', 'a', 'viernes.'],
    ru: 'Мы работаем с понедельника по пятницу.',
  },
  {
    id: 'wo-4',
    scrambled: ['veinticinco', 'Ana', 'tiene', 'años.'],
    correct: ['Ana', 'tiene', 'veinticinco', 'años.'],
    ru: 'Ане двадцать пять лет.',
  },
  {
    id: 'wo-5',
    scrambled: ['es', 'Este', 'libro', 'mío.'],
    correct: ['Este', 'libro', 'es', 'mío.'],
    ru: 'Эта книга — моя.',
  },
  {
    id: 'wo-6',
    scrambled: ['en', '¿Dónde', 'tú?', 'vives'],
    correct: ['¿Dónde', 'vives', 'tú?'],
    ru: 'Где ты живёшь?',
  },
  {
    id: 'wo-7',
    scrambled: ['muy', 'Nuestra', 'casa', 'es', 'grande.'],
    correct: ['Nuestra', 'casa', 'es', 'muy', 'grande.'],
    ru: 'Наш дом очень большой.',
  },
  {
    id: 'wo-8',
    scrambled: ['empieza', '¿A', 'hora', 'la', 'qué', 'clase?'],
    correct: ['¿A', 'qué', 'hora', 'empieza', 'la', 'clase?'],
    ru: 'Во сколько начинается урок?',
  },
  {
    id: 'wo-9',
    scrambled: ['al', 'sábados', 'fútbol.', 'Jugamos', 'los'],
    correct: ['Jugamos', 'al', 'fútbol', 'los', 'sábados.'],
    ru: 'По субботам мы играем в футбол.',
  },
  {
    id: 'wo-10',
    scrambled: ['cuesta', 'El', 'dieciséis', 'billete', 'euros.'],
    correct: ['El', 'billete', 'cuesta', 'dieciséis', 'euros.'],
    ru: 'Билет стоит шестнадцать евро.',
  },
];

// 3. COMPLETA LA FRASE (Fill in the blank)
export const COMPLETE_SENTENCE_TASKS: MiniGameTask[] = [
  {
    id: 'cs-1',
    type: 'complete',
    promptEs: 'Completa la frase con el día correcto:',
    promptRu: 'Вставьте правильный день недели:',
    subtextEs: 'El último día de la semana es el ___.',
    subtextRu: 'Последний день недели — это...',
    options: [
      { es: 'domingo', ru: 'воскресенье' },
      { es: 'sábado', ru: 'суббота' },
      { es: 'viernes', ru: 'пятница' },
      { es: 'lunes', ru: 'понедельник' },
    ],
    correctAnswer: 'domingo',
    explanationRu: 'Последний день недели — domingo (воскресенье).',
  },
  {
    id: 'cs-2',
    type: 'complete',
    promptEs: 'Completa con la forma adecuada del posesivo:',
    promptRu: 'Вставьте правильную форму притяжательного местоимения:',
    subtextEs: 'Elena y Marta limpian ___ habitaciones.',
    subtextRu: 'Елена и Марта убирают свои комнаты.',
    options: [
      { es: 'sus', ru: 'свои (множественное число)' },
      { es: 'su', ru: 'свою (единственное число)' },
      { es: 'suyas', ru: 'полная форма' },
      { es: 'mis', ru: 'мои' },
    ],
    correctAnswer: 'sus',
    explanationRu: 'Habitaciones во множественном числе -> sus habitaciones.',
  },
  {
    id: 'cs-3',
    type: 'complete',
    promptEs: 'Completa con el número en letras:',
    promptRu: 'Вставьте числительное прописью:',
    subtextEs: 'Un mes normalmente tiene ___ o treinta y un días.',
    subtextRu: 'В месяце обычно 30 или 31 день.',
    options: [
      { es: 'treinta', ru: 'тридцать' },
      { es: 'veinte', ru: 'двадцать' },
      { es: 'cuarenta', ru: 'сорок' },
      { es: 'quince', ru: 'пятнадцать' },
    ],
    correctAnswer: 'treinta',
    explanationRu: '30 = treinta.',
  },
  {
    id: 'cs-4',
    type: 'complete',
    promptEs: 'Completa con la pregunta correcta:',
    promptRu: 'Вставьте правильное вопросительное слово:',
    subtextEs: '— ¿___ cuesta este café? — Cuesta dos euros.',
    subtextRu: '— Сколько стоит этот кофе? — Стоит два евро.',
    options: [
      { es: 'Cuánto', ru: 'Сколько' },
      { es: 'Qué', ru: 'Что' },
      { es: 'Cuál', ru: 'Который' },
      { es: 'Cómo', ru: 'Как' },
    ],
    correctAnswer: 'Cuánto',
    explanationRu: 'О цене спрашивают: ¿Cuánto cuesta...?',
  },
  {
    id: 'cs-5',
    type: 'complete',
    promptEs: 'Completa con la forma tónica:',
    promptRu: 'Вставьте полную форму притяжательного:',
    subtextEs: '— ¿Es tu coche? — Sí, el coche es ___.',
    subtextRu: '— Это твоя машина? — Да, эта машина моя.',
    options: [
      { es: 'mío', ru: 'мой (мужской род, coche)' },
      { es: 'mía', ru: 'моя' },
      { es: 'mi', ru: 'краткая форма' },
      { es: 'mis', ru: 'мои' },
    ],
    correctAnswer: 'mío',
    explanationRu: 'Coche мужского рода: el coche es mío.',
  },
];

// 4. ELIGE LA RESPUESTA (Rapid-fire Q&A choice)
export const CHOOSE_ANSWER_TASKS: MiniGameTask[] = [
  {
    id: 'ca-1',
    type: 'choose',
    promptEs: '— ¿Qué día viene antes del martes?',
    promptRu: '— Какой день идёт перед вторником?',
    options: [
      { es: 'Lunes', ru: 'Понедельник' },
      { es: 'Miércoles', ru: 'Среда' },
      { es: 'Jueves', ru: 'Четверг' },
      { es: 'Domingo', ru: 'Воскресенье' },
    ],
    correctAnswer: 'Lunes',
    explanationRu: 'Перед вторником идёт понедельник (lunes).',
  },
  {
    id: 'ca-2',
    type: 'choose',
    promptEs: '— ¿Cuántos años tienes?',
    promptRu: '— Сколько тебе лет?',
    options: [
      { es: 'Tengo dieciocho años.', ru: 'Мне восемнадцать лет.' },
      { es: 'Soy dieciocho años.', ru: 'Ошибочно с глаголом ser' },
      { es: 'Estoy dieciocho años.', ru: 'Ошибочно с estar' },
      { es: 'Hago dieciocho años.', ru: 'Ошибочно с hacer' },
    ],
    correctAnswer: 'Tengo dieciocho años.',
    explanationRu: 'Возраст в испанском выражается глаголом tener: «Tengo ... años».',
  },
  {
    id: 'ca-3',
    type: 'choose',
    promptEs: '— ¿De quién es esta maleta?',
    promptRu: '— Чей это чемодан?',
    options: [
      { es: 'Es suya.', ru: 'Его / Её (maleta — женский род)' },
      { es: 'Es suyo.', ru: 'Мужской род' },
      { es: 'Es su.', ru: 'Краткая форма' },
      { es: 'Es sus.', ru: 'Множественное число' },
    ],
    correctAnswer: 'Es suya.',
    explanationRu: 'Maleta женского рода: es suya.',
  },
  {
    id: 'ca-4',
    type: 'choose',
    promptEs: '— ¿Por qué estudias español?',
    promptRu: '— Почему ты учишь испанский?',
    options: [
      { es: 'Porque quiero viajar a España.', ru: 'Потому что я хочу поехать в Испанию.' },
      { es: 'Por qué quiero viajar a España.', ru: 'Ошибочно с ударением' },
      { es: 'Para qué quiero viajar a España.', ru: 'Ошибочно' },
      { es: 'Porqué quiero viajar a España.', ru: 'Ошибочно' },
    ],
    correctAnswer: 'Porque quiero viajar a España.',
    explanationRu: 'В ответе используется «porque» слитно и без ударения.',
  },
  {
    id: 'ca-5',
    type: 'choose',
    promptEs: '— ¿Cuál es la capital de España?',
    promptRu: '— Какая столица Испании?',
    options: [
      { es: 'Madrid', ru: 'Мадрид' },
      { es: 'Barcelona', ru: 'Барселона' },
      { es: 'Valencia', ru: 'Валенсия' },
      { es: 'Sevilla', ru: 'Севилья' },
    ],
    correctAnswer: 'Madrid',
    explanationRu: 'Столица Испании — Мадрид.',
  },
];

// 5. PREGUNTA Y RESPUESTA (Match question to answer)
export const QA_MATCH_TASKS: MiniGameTask[] = [
  {
    id: 'qa-1',
    type: 'qa',
    promptEs: 'Respuesta: «A las siete y media de la mañana». ¿Cuál es la pregunta?',
    promptRu: 'Ответ: «В семь тридцать утра». Какой был вопрос?',
    options: [
      { es: '¿A qué hora te levantas?', ru: 'Во сколько ты встаёшь?' },
      { es: '¿Dónde te levantas?', ru: 'Где ты встаёшь?' },
      { es: '¿Cómo te levantas?', ru: 'Как ты встаёшь?' },
      { es: '¿Quién se levanta?', ru: 'Кто встаёт?' },
    ],
    correctAnswer: '¿A qué hora te levantas?',
    explanationRu: 'Ответ со временем «A las...» соответствует вопросу «¿A qué hora...?».',
  },
  {
    id: 'qa-2',
    type: 'qa',
    promptEs: 'Respuesta: «Soy de Colombia». ¿Cuál es la pregunta?',
    promptRu: 'Ответ: «Я из Колумбии». Какой был вопрос?',
    options: [
      { es: '¿De dónde eres?', ru: 'Откуда ты?' },
      { es: '¿Dónde vives?', ru: 'Где ты живёшь?' },
      { es: '¿Adónde vas?', ru: 'Куда ты идёшь?' },
      { es: '¿Quién eres?', ru: 'Кто ты?' },
    ],
    correctAnswer: '¿De dónde eres?',
    explanationRu: 'Ответ «Soy de...» указывает на происхождение: «¿De dónde eres?».',
  },
  {
    id: 'qa-3',
    type: 'qa',
    promptEs: 'Respuesta: «En el supermercado de la esquina». ¿Cuál es la pregunta?',
    promptRu: 'Ответ: «В супермаркете на углу». Какой был вопрос?',
    options: [
      { es: '¿Dónde compras la comida?', ru: 'Где ты покупаешь еду?' },
      { es: '¿Cuándo compras la comida?', ru: 'Когда ты покупаешь еду?' },
      { es: '¿Por qué compras la comida?', ru: 'Почему ты покупаешь еду?' },
      { es: '¿Qué compras?', ru: 'Что ты покупаешь?' },
    ],
    correctAnswer: '¿Dónde compras la comida?',
    explanationRu: 'Место действия отвечает на вопрос «¿Dónde...?».',
  },
];

// 6. ¿DE QUIÉN ES? (Possessive ownership challenges)
export const WHOSE_IS_IT_TASKS: MiniGameTask[] = [
  {
    id: 'dq-1',
    type: 'whose',
    promptEs: 'Este cuaderno pertenece a mí. ¿De quién es el cuaderno?',
    promptRu: 'Эта тетрадь принадлежит мне. Чья тетрадь?',
    options: [
      { es: 'Es mío.', ru: 'Мой (cuaderno мужского рода)' },
      { es: 'Es mía.', ru: 'Моя' },
      { es: 'Es tuyo.', ru: 'Твой' },
      { es: 'Es suyo.', ru: 'Его' },
    ],
    correctAnswer: 'Es mío.',
    explanationRu: 'Cuaderno мужского рода: «Es mío».',
  },
  {
    id: 'dq-2',
    type: 'whose',
    promptEs: 'Esta casa pertenece a nosotros. ¿De quién es la casa?',
    promptRu: 'Этот дом принадлежит нам. Чей дом?',
    options: [
      { es: 'Es nuestra.', ru: 'Наш (casa женского рода)' },
      { es: 'Es nuestro.', ru: 'Мужской род' },
      { es: 'Es vuestra.', ru: 'Ваш' },
      { es: 'Es suya.', ru: 'Их' },
    ],
    correctAnswer: 'Es nuestra.',
    explanationRu: 'Casa женского рода: «Es nuestra».',
  },
  {
    id: 'dq-3',
    type: 'whose',
    promptEs: 'Estas gafas pertenecen a ti. ¿De quién son las gafas?',
    promptRu: 'Эти очки принадлежат тебе. Чьи очки?',
    options: [
      { es: 'Son tuyas.', ru: 'Твои (gafas женского рода во мн. числе)' },
      { es: 'Son tuyos.', ru: 'Мужской род' },
      { es: 'Son mías.', ru: 'Мои' },
      { es: 'Son sus.', ru: 'Краткая форма' },
    ],
    correctAnswer: 'Son tuyas.',
    explanationRu: 'Gafas — женский род множественного числа: «Son tuyas».',
  },
];

// 7. ORDENA LOS DÍAS (Order the weekdays)
export const DAYS_SEQUENCE = [
  { id: 'lunes', es: 'Lunes', ru: 'Понедельник', order: 1 },
  { id: 'martes', es: 'Martes', ru: 'Вторник', order: 2 },
  { id: 'miercoles', es: 'Miércoles', ru: 'Среда', order: 3 },
  { id: 'jueves', es: 'Jueves', ru: 'Четверг', order: 4 },
  { id: 'viernes', es: 'Viernes', ru: 'Пятница', order: 5 },
  { id: 'sabado', es: 'Sábado', ru: 'Суббота', order: 6 },
  { id: 'domingo', es: 'Domingo', ru: 'Воскресенье', order: 7 },
];
