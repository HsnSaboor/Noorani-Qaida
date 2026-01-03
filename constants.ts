
import { Lesson, LessonQuiz, Translation } from './types';
export * from './data/assets';

// --- TEXT CONSTANTS ---
export const TEXTS: Translation = {
    appTitle: {
        en: 'Noorani Qaida', ur: 'نورانی قاعدہ', fr: 'Noorani Qaida', es: 'Noorani Qaida', id: 'Noorani Qaida',
        hi: 'नूरानी कायदा', bn: 'নূরানী কায়দা', tr: 'Noorani Kaide', ru: 'Нурани Каида',
        ar: 'القاعدة النورانية', zh: '诺拉尼凯达', de: 'Noorani Qaida', ms: 'Noorani Qaida', pt: 'Noorani Qaida'
    },
    dashboard: {
        en: 'Dashboard', ur: 'ڈیش بورڈ', fr: 'Tableau de bord', es: 'Panel', id: 'Dasbor',
        hi: 'डैशबोर्ड', bn: 'ড্যাশবোর্ড', tr: 'Kontrol Paneli', ru: 'Панель',
        ar: 'لوحة القيادة', zh: '仪表盘', de: 'Übersicht', ms: 'Papan Pemuka', pt: 'Painel'
    },
    home: {
        en: 'Home', ur: 'ہوم', fr: 'Accueil', es: 'Inicio', id: 'Beranda',
        hi: 'होम', bn: 'হোম', tr: 'Ev', ru: 'Домой',
        ar: 'الرئيسية', zh: '首页', de: 'Startseite', ms: 'Utama', pt: 'Início'
    },
    stars: {
        en: 'XP', ur: 'پوائنٹس', fr: 'XP', es: 'XP', id: 'XP',
        hi: 'अंक (XP)', bn: 'এক্সপি', tr: 'XP', ru: 'XP',
        ar: 'نقاط', zh: '经验值', de: 'EP', ms: 'XP', pt: 'XP'
    },
    lesson: {
        en: 'Lesson', ur: 'سبق', fr: 'Leçon', es: 'Lección', id: 'Pelajaran',
        hi: 'पाठ', bn: 'पाठ', tr: 'Ders', ru: 'Урок',
        ar: 'درس', zh: '课程', de: 'Lektion', ms: 'Pelajaran', pt: 'Lição'
    },
    autoPlay: {
        en: 'Auto Play', ur: 'آٹو پلے', fr: 'Lecture auto', es: 'Auto Reprod.', id: 'Putar Otomatis',
        hi: 'ऑटो प्ले', bn: 'অটো প্লে', tr: 'Otomatik Oynat', ru: 'Авто',
        ar: 'تشغيل تلقائي', zh: '自动播放', de: 'Autoplay', ms: 'Automain', pt: 'Reprodução Auto'
    },
    minutes: {
        en: 'Min', ur: 'منٹ', fr: 'Min', es: 'Min', id: 'Min',
        hi: 'मिनट', bn: 'মিনিট', tr: 'Dk', ru: 'Мин',
        ar: 'دقيقة', zh: '分钟', de: 'Min', ms: 'Min', pt: 'Min'
    },
    start: {
        en: 'Start Learning', ur: 'سیکھنا شروع کریں', fr: 'Commencer', es: 'Comenzar', id: 'Mulai Belajar',
        hi: 'सीखना शुरू करें', bn: 'শেখা শুরু করুন', tr: 'Öğrenmeye Başla', ru: 'Начать',
        ar: 'ابدأ التعلم', zh: '开始学习', de: 'Starten', ms: 'Mula Belajar', pt: 'Começar'
    },
    locked: {
        en: 'Locked', ur: 'مقفل', fr: 'Verrouillé', es: 'Bloqueado', id: 'Terkunci',
        hi: 'लॉक है', bn: 'তালাবদ্ধ', tr: 'Kilitli', ru: 'Закрыто',
        ar: 'مغلق', zh: '已锁定', de: 'Gesperrt', ms: 'Dikunci', pt: 'Bloqueado'
    },
    quizTitle: {
        en: 'Quiz', ur: 'امتحان', fr: 'Quiz', es: 'Prueba', id: 'Kuis',
        hi: 'प्रश्नोत्तरी', bn: 'কুইজ', tr: 'Test', ru: 'Тест',
        ar: 'اختبار', zh: '测验', de: 'Quiz', ms: 'Kuiz', pt: 'Quiz'
    },
    next: {
        en: 'Next', ur: 'اگلا', fr: 'Suivant', es: 'Siguiente', id: 'Lanjut',
        hi: 'अगला', bn: 'পরবর্তী', tr: 'İleri', ru: 'Далее',
        ar: 'التالي', zh: '下一个', de: 'Weiter', ms: 'Seterusnya', pt: 'Próximo'
    },
    tryAgain: {
        en: 'Try Again', ur: 'دوبارہ کوشش کریں', fr: 'Réessayer', es: 'Reintentar', id: 'Coba Lagi',
        hi: 'पुनः प्रयास करें', bn: 'আবার চেষ্টা করুন', tr: 'Tekrar Dene', ru: 'Повторить',
        ar: 'حاول مرة أخرى', zh: '再试一次', de: 'Nochmal', ms: 'Cuba Lagi', pt: 'Tente Novamente'
    },
    practiceMode: {
        en: 'Practice Mode', ur: 'مشق کریں', fr: 'Mode Pratique', es: 'Práctica', id: 'Mode Latihan',
        hi: 'अभ्यास मोड', bn: 'অনুশীলনী মোড', tr: 'Pratik Modu', ru: 'Практика',
        ar: 'وضع الممارسة', zh: '练习模式', de: 'Übungsmodus', ms: 'Mod Latihan', pt: 'Modo Prática'
    },
    touchToPlay: {
        en: 'Touch to Play', ur: 'سننے کے لیے چھوئیں', fr: 'Touchez pour écouter', es: 'Toca para oír', id: 'Sentuh untuk memutar',
        hi: 'सुनने के लिए छुएं', bn: 'শুনতে স্পর্শ করুন', tr: 'Dinlemek için dokun', ru: 'Нажми, чтобы слушать',
        ar: 'المس للاستماع', zh: '点击播放', de: 'Tippen zum Abspielen', ms: 'Sentuh untuk Main', pt: 'Toque para Ouvir'
    },
    settings: {
        en: 'Settings', ur: 'سیٹنگز', fr: 'Paramètres', es: 'Ajustes', id: 'Pengaturan',
        hi: 'सेटिंग्स', bn: 'সেটিংস', tr: 'Ayarlar', ru: 'Настройки',
        ar: 'الإعدادات', zh: '设置', de: 'Einstellungen', ms: 'Tetapan', pt: 'Configurações'
    },
    startLesson: {
        en: 'Start Lesson', ur: 'سبق شروع کریں', fr: 'Commencer la leçon', es: 'Comenzar lección', id: 'Mulai Pelajaran',
        hi: 'पाठ शुरू करें', bn: 'পাঠ শুরু করুন', tr: 'Dersi Başlat', ru: 'Начать урок',
        ar: 'بدء الدرس', zh: '开始课程', de: 'Lektion beginnen', ms: 'Mula Pelajaran', pt: 'Iniciar Lição'
    },
    // Home Page Sections
    heroSubtitle: {
        en: "Let's learn to read Quran together!", ur: "آئیے ایک ساتھ قرآن پڑھنا سیکھیں!", fr: "Apprenons à lire le Coran ensemble!",
        ar: "هيا نتعلم قراءة القرآن معاً!"
    },
    continueBtn: {
        en: "Continue Lesson", ur: "سبق جاری رکھیں", fr: "Continuer la leçon", ar: "متابعة الدرس"
    },
    // SECTION TRANSLATIONS
    phase1Title: { en: 'Phase 1: Foundation', ur: 'پہلا مرحلہ: بنیاد', fr: 'Phase 1: Fondation', ar: 'المرحلة 1: الأساس' },
    phase1Desc: { en: 'Letters, Shapes & Vowels', ur: 'حروف، اشکال اور حرکات', fr: 'Lettres, Formes et Voyelles', ar: 'الحروف والأشكال والحركات' },

    phase2Title: { en: 'Phase 2: Building', ur: 'دوسرا مرحلہ: تعمیر', fr: 'Phase 2: Construction', ar: 'المرحلة 2: البناء' },
    phase2Desc: { en: 'Connecting Words & Sukoon', ur: 'الفاظ جوڑنا اور سکون', fr: 'Mots et Sukoon', ar: 'تركيب الكلمات والسكون' },

    phase3Title: { en: 'Phase 3: Tajweed', ur: 'تیسرا مرحلہ: تجوید', fr: 'Phase 3: Tajweed', ar: 'المرحلة 3: التجويد' },
    phase3Desc: { en: 'Mastering the Rules', ur: 'تجوید کے اصول', fr: 'Maîtriser les règles', ar: 'إتقان الأحكام' },

    phase4Title: { en: 'Phase 4: Advanced', ur: 'چوتھا مرحلہ: اعلیٰ', fr: 'Phase 4: Avancé', ar: 'المرحلة 4: المتقدم' },
    phase4Desc: { en: 'Application & Recitation', ur: 'تلاوت اور اطلاق', fr: 'Application et Récitation', ar: 'التطبيق والتلاوة' },

    phase5Title: { en: 'The Quran', ur: 'قرآن مجید', fr: 'Le Coran', ar: 'القرآن' },
    phase5Desc: { en: 'Surahs & Duas', ur: 'سورتیں اور دعائیں', fr: 'Sourates et Duas', ar: 'السور والأدعية' },
    // Quiz translations
    identify: { en: 'Identify:', ur: 'پہچانیں:', fr: 'Identifiez:', ar: 'حدد:' },
    whatDoesInitialMean: { en: "What does the 'Initial' shape correspond to?", ur: "'ابتدائی' شکل کا کیا مطلب ہے؟", fr: "À quoi correspond la forme 'Initiale'?", ar: "ما معنى الشكل 'الابتدائي'؟" },
    startOfWord: { en: 'Start of the word', ur: 'لفظ کی شروعات', fr: 'Début du mot', ar: 'بداية الكلمة' },
    middleOfWord: { en: 'Middle of the word', ur: 'لفظ کا درمیان', fr: 'Milieu du mot', ar: 'وسط الكلمة' },
    endOfWord: { en: 'End of the word', ur: 'لفظ کا آخر', fr: 'Fin du mot', ar: 'نهاية الكلمة' },
    separateLetter: { en: 'Separate letter', ur: 'الگ حرف', fr: 'Lettre séparée', ar: 'حرف منفصل' },
    yes: { en: 'Yes', ur: 'ہاں', fr: 'Oui', ar: 'نعم' },
    no: { en: 'No', ur: 'نہیں', fr: 'Non', ar: 'لا' },
    always: { en: 'Always', ur: 'ہمیشہ', fr: 'Toujours', ar: 'دائماً' },
    never: { en: 'Never', ur: 'کبھی نہیں', fr: 'Jamais', ar: 'أبداً' },
    sometimes: { en: 'Sometimes', ur: 'کبھی کبھی', fr: 'Parfois', ar: 'أحياناً' },
    initial: { en: 'Initial', ur: 'ابتدائی', fr: 'Initiale', ar: 'ابتدائي' },
    medial: { en: 'Medial', ur: 'درمیانی', fr: 'Médiale', ar: 'وسطي' },
    final: { en: 'Final', ur: 'آخری', fr: 'Finale', ar: 'نهائي' },
    isolated: { en: 'Isolated', ur: 'مفرد', fr: 'Isolée', ar: 'منفصل' },
};

// --- SYLLABUS DEFINITION ---
const BASE_SYLLABUS: Lesson[] = [
    // PHASE 1-7 (1-41)
    { lesson_id: 1, title: { en: "The Alphabet", ur: "حروف مفردات", fr: "L'Alphabet" }, description: { en: "Arabic Alphabet Recognition.", ur: "عربی حروف کی پہچان۔", fr: "Reconnaissance." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 29 } },
    { lesson_id: 2, title: { en: "Letter Shapes", ur: "حروف کی اشکال", fr: "Formes" }, description: { en: "Initial, Medial, Final shapes.", ur: "حروف کی اشکال۔", fr: "Formes." }, meta: { estimated_minutes: 20, difficulty: "Beginner", layout: 'grid', item_count: 60 } },
    { lesson_id: 3, title: { en: "Similar Letters", ur: "ملتے جلتے حروف", fr: "Lettres similaires" }, description: { en: "Differentiation of look-alikes.", ur: "ملتی جلتی شکلوں میں فرق۔", fr: "Différenciation." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 10 } },
    { lesson_id: 4, title: { en: "Heavy vs Light", ur: "موٹے اور باریک حروف", fr: "Lourd vs Léger" }, description: { en: "Introduction to heavy letters.", ur: "موٹے حروف کا تعارف۔", fr: "Lettres lourdes." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 7 } },
    { lesson_id: 5, title: { en: "Makharij (Sounds)", ur: "مخارج", fr: "Makharij" }, description: { en: "Proper articulation points.", ur: "حروف کے مخارج۔", fr: "Articulation." }, meta: { estimated_minutes: 20, difficulty: "Beginner", layout: 'grid', item_count: 17 } },
    { lesson_id: 6, title: { en: "Fatha", ur: "زبر", fr: "Fatha" }, description: { en: "Short vowel 'A'.", ur: "زبر۔", fr: "Fatha." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 30 } },
    { lesson_id: 7, title: { en: "Kasra", ur: "زیر", fr: "Kasra" }, description: { en: "Short vowel 'E'.", ur: "زیر۔", fr: "Kasra." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 30 } },
    { lesson_id: 8, title: { en: "Damma", ur: "پیش", fr: "Damma" }, description: { en: "Short vowel 'U'.", ur: "پیش۔", fr: "Damma." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 30 } },
    { lesson_id: 9, title: { en: "Mixed Harakat", ur: "حرکات کی مشق", fr: "Harakat" }, description: { en: "Practice vowels.", ur: "مشق۔", fr: "Pratique." }, meta: { estimated_minutes: 20, difficulty: "Beginner", layout: 'grid', item_count: 40 } },
    { lesson_id: 10, title: { en: "Full Drill", ur: "مکمل مشق", fr: "Drill" }, description: { en: "Alphabet with vowels.", ur: "مکمل مشق۔", fr: "Drill complet." }, meta: { estimated_minutes: 10, difficulty: "Beginner", layout: 'grid', item_count: 29 } },
    { lesson_id: 11, title: { en: "Murakkabat", ur: "مرکبات", fr: "Murakkabat" }, description: { en: "Joining letters.", ur: "مرکبات۔", fr: "Joindre." }, meta: { estimated_minutes: 20, difficulty: "Beginner", layout: 'grid', item_count: 50 } },
    { lesson_id: 12, title: { en: "Tanween Fath", ur: "دو زبر", fr: "Tanween Fath" }, description: { en: "Double Fatha.", ur: "دو زبر۔", fr: "Double Fatha." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 13, title: { en: "Tanween Kasr", ur: "دو زیر", fr: "Tanween Kasr" }, description: { en: "Double Kasra.", ur: "دو زیر۔", fr: "Double Kasra." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 14, title: { en: "Tanween Damm", ur: "دو پیش", fr: "Tanween Damm" }, description: { en: "Double Damma.", ur: "دو پیش۔", fr: "Double Damma." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 15, title: { en: "Standing Fatha", ur: "کھڑا زبر", fr: "Fatha debout" }, description: { en: "Long A.", ur: "کھڑا زبر۔", fr: "Long A." }, meta: { estimated_minutes: 10, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 16, title: { en: "Standing Kasra", ur: "کھڑا زیر", fr: "Kasra debout" }, description: { en: "Long E.", ur: "کھڑا زیر۔", fr: "Long E." }, meta: { estimated_minutes: 10, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 17, title: { en: "Standing Damma", ur: "الٹا پیش", fr: "Damma inversé" }, description: { en: "Long U.", ur: "الٹا پیش۔", fr: "Long U." }, meta: { estimated_minutes: 10, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 18, title: { en: "Madd Asli", ur: "مد اصلی", fr: "Madd Asli" }, description: { en: "Natural Madd.", ur: "مد اصلی۔", fr: "Madd naturel." }, meta: { estimated_minutes: 20, difficulty: "Beginner", layout: 'grid', item_count: 30 } },
    { lesson_id: 19, title: { en: "Sukoon", ur: "سکون", fr: "Sukoon" }, description: { en: "Jazm.", ur: "جزم۔", fr: "Jazm." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'grid', item_count: 40 } },
    { lesson_id: 20, title: { en: "Sukoon Practice", ur: "مشق", fr: "Pratique" }, description: { en: "Practice.", ur: "مشق۔", fr: "Pratique." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'grid', item_count: 30 } },
    { lesson_id: 21, title: { en: "Qalqala", ur: "قلقلہ", fr: "Qalqala" }, description: { en: "Echo sound.", ur: "قلقلہ۔", fr: "Écho." }, meta: { estimated_minutes: 15, difficulty: "Intermediate", layout: 'grid', item_count: 20 } },
    { lesson_id: 22, title: { en: "Shaddah", ur: "تشدید", fr: "Shaddah" }, description: { en: "Emphasis.", ur: "تشدید۔", fr: "Emphase." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'grid', item_count: 30 } },
    { lesson_id: 23, title: { en: "Shaddah & Harakat", ur: "تشدید اور حرکات", fr: "Harakat" }, description: { en: "Shaddah+Vowels.", ur: "تشدید۔", fr: "Harakat." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'grid', item_count: 30 } },
    { lesson_id: 24, title: { en: "Shaddah & Tanween", ur: "تشدید اور تنوین", fr: "Tanween" }, description: { en: "Shaddah+Tanween.", ur: "تشدید۔", fr: "Tanween." }, meta: { estimated_minutes: 15, difficulty: "Intermediate", layout: 'grid', item_count: 20 } },
    { lesson_id: 25, title: { en: "Nun Sakin Intro", ur: "نون ساکن", fr: "Intro" }, description: { en: "Rules Intro.", ur: "تعارف۔", fr: "Intro." }, meta: { estimated_minutes: 10, difficulty: "Intermediate", layout: 'list', item_count: 5 } },
    { lesson_id: 26, title: { en: "Izhar", ur: "اظہار", fr: "Izhar" }, description: { en: "Clear.", ur: "اظہار۔", fr: "Clair." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'grid', item_count: 30 } },
    { lesson_id: 27, title: { en: "Idgham", ur: "ادغام", fr: "Idgham" }, description: { en: "Merge.", ur: "ادغام۔", fr: "Fusion." }, meta: { estimated_minutes: 25, difficulty: "Intermediate", layout: 'grid', item_count: 40 } },
    { lesson_id: 28, title: { en: "Iqlab", ur: "اقلاب", fr: "Iqlab" }, description: { en: "Change.", ur: "اقلاب۔", fr: "Change." }, meta: { estimated_minutes: 15, difficulty: "Intermediate", layout: 'grid', item_count: 15 } },
    { lesson_id: 29, title: { en: "Ikhfa", ur: "اخفاء", fr: "Ikhfa" }, description: { en: "Hide.", ur: "اخفاء۔", fr: "Cacher." }, meta: { estimated_minutes: 25, difficulty: "Advanced", layout: 'grid', item_count: 40 } },
    { lesson_id: 30, title: { en: "Meem Sakin", ur: "میم ساکن", fr: "Meem Sakin" }, description: { en: "Meem Rules.", ur: "میم۔", fr: "Meem." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'list', item_count: 20 } },
    { lesson_id: 31, title: { en: "Muqatta'at", ur: "مقطعات", fr: "Lettres Disjointes" }, description: { en: "Disjoined Letters.", ur: "حروف مقطعات۔", fr: "Lettres." }, meta: { estimated_minutes: 25, difficulty: "Advanced", layout: 'grid', item_count: 13 } },
    { lesson_id: 32, title: { en: "Madd Far'i", ur: "مد فرعی", fr: "Madd Far'i" }, description: { en: "Derived Madd.", ur: "مد فرعی۔", fr: "Dérivé." }, meta: { estimated_minutes: 10, difficulty: "Advanced", layout: 'list', item_count: 5 } },
    { lesson_id: 33, title: { en: "Madd Muttasil", ur: "مد متصل", fr: "Madd Muttasil" }, description: { en: "Connected.", ur: "مد متصل۔", fr: "Connecté." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 15 } },
    { lesson_id: 34, title: { en: "Madd Munfasil", ur: "مد منفصل", fr: "Madd Munfasil" }, description: { en: "Detached.", ur: "مد منفصل۔", fr: "Détaché." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 15 } },
    { lesson_id: 35, title: { en: "Madd Lazim", ur: "مد لازم", fr: "Madd Lazim" }, description: { en: "Compulsory.", ur: "مد لازم۔", fr: "Obligatoire." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 15 } },
    { lesson_id: 36, title: { en: "Madd Arid", ur: "مد عارض", fr: "Madd Arid" }, description: { en: "Temporary.", ur: "مد عارض۔", fr: "Temporaire." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'list', item_count: 15 } },
    { lesson_id: 37, title: { en: "Madd Lin", ur: "مد لین", fr: "Madd Lin" }, description: { en: "Leen.", ur: "مد لین۔", fr: "Leen." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid', item_count: 20 } },
    { lesson_id: 38, title: { en: "Ghunnah Rules", ur: "غنہ", fr: "Ghunnah" }, description: { en: "Nasal.", ur: "غنہ۔", fr: "Nasal." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid', item_count: 20 } },
    { lesson_id: 39, title: { en: "Tafkheem", ur: "تفخیم", fr: "Tafkheem" }, description: { en: "Heavy/Light.", ur: "موٹا/باریک۔", fr: "Lourd/Léger." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 20 } },
    { lesson_id: 40, title: { en: "Salah (Namaz)", ur: "نماز", fr: "Prière" }, description: { en: "Prayer.", ur: "نماز۔", fr: "Prière." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 20 } },
    { lesson_id: 41, title: { en: "Ayat-ul-Kursi", ur: "آیۃ الکرسی", fr: "Ayat-ul-Kursi" }, description: { en: "The Greatest Verse of the Quran.", ur: "قرآن مجید کی عظیم ترین آیت۔", fr: "Le verset du Trône." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 1 } },
    { lesson_id: 42, title: { en: "Dua-e-Qanoot", ur: "دعائے قنوت", fr: "Dua-e-Qanoot" }, description: { en: "The Supplication of Witr Prayer.", ur: "نمازِ وتر کی دعا۔", fr: "Dua Qanoot." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid', item_count: 1 } },
    { lesson_id: 43, title: { en: "Sun & Moon", ur: "شمسی و قمری", fr: "Solaires" }, description: { en: "Al-Lam Rules.", ur: "ال۔", fr: "Al." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid', item_count: 15 } },
    { lesson_id: 44, title: { en: "Hamza Rules", ur: "ہمزہ کے قواعد", fr: "Hamza" }, description: { en: "Wasl & Qat.", ur: "وصل و قطع۔", fr: "Wasl." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 20 } },
    { lesson_id: 45, title: { en: "Silent Letters", ur: "خاموش حروف", fr: "Lettres Muettes" }, description: { en: "Silent letters.", ur: "خاموش حروف۔", fr: "Muettes." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 20 } },
    { lesson_id: 46, title: { en: "Waqf Signs", ur: "رموز اوقاف", fr: "Signes" }, description: { en: "Punctuation.", ur: "رموز۔", fr: "Ponctuation." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 20 } },
    { lesson_id: 47, title: { en: "Meaning Stops", ur: "معنوی وقف", fr: "Sens" }, description: { en: "Meaning stops.", ur: "معنوی وقف۔", fr: "Sens." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'list', item_count: 10 } },
    { lesson_id: 48, title: { en: "General Review", ur: "اعادہ", fr: "Révision" }, description: { en: "Mixed Rules Practice.", ur: "تمام قواعد کی مشق۔", fr: "Pratique Mixte." }, meta: { estimated_minutes: 30, difficulty: "Advanced", layout: 'grid' as const, item_count: 50 } },
    { lesson_id: 49, title: { en: "Fatiha Words", ur: "سورۃ فاتحہ کے الفاظ", fr: "Mots de Fatiha" }, description: { en: "Vocabulary analysis of the Opening.", ur: "سورۃ فاتحہ کی لفظی تشریح۔", fr: "Analyse." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid' as const, item_count: 30 } },
    { lesson_id: 50, title: { en: "Tauheed Words", ur: "توحید کے الفاظ", fr: "Mots de l'Unicité" }, description: { en: "Words related to Oneness of Allah.", ur: "توحید سے متعلق الفاظ۔", fr: "Théologie." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid' as const, item_count: 20 } },
    { lesson_id: 51, title: { en: "Prophetic Duas", ur: "مسنون دعائیں", fr: "Duas Prophétiques" }, description: { en: "Supplications for daily life.", ur: "روزمرہ کی مسنون دعائیں۔", fr: "Invocations." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid' as const, item_count: 20 } },
    { lesson_id: 52, title: { en: "Quranic Fluency I", ur: "قرآنی روانی ۱", fr: "Fluidité I" }, description: { en: "Advanced reading practice.", ur: "تلاوت کی روانی۔", fr: "Lecture." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid' as const, item_count: 40 } },
    { lesson_id: 53, title: { en: "Quranic Fluency II", ur: "قرآنی روانی ۲", fr: "Fluidité II" }, description: { en: "Continuous recitation practice.", ur: "تلاوت کی پختگی۔", fr: "Lecture." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid' as const, item_count: 40 } },
    { lesson_id: 54, title: { en: "Names of Allah", ur: "اسماء الحسنٰی", fr: "Noms d'Allah" }, description: { en: "Selection of Beautiful Names.", ur: "اللہ کے خوبصورت نام۔", fr: "Noms d'Allah." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid' as const, item_count: 20 } },
    { lesson_id: 55, title: { en: "Morning Azkar", ur: "صبح کے اذکار", fr: "Azkar du Matin" }, description: { en: "Daily morning protections.", ur: "صبح کے مسنون اذکار۔", fr: "Protections." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid' as const, item_count: 15 } },
    { lesson_id: 56, title: { en: "Evening Azkar", ur: "شام کے اذکار", fr: "Azkar du Soir" }, description: { en: "Daily evening protections.", ur: "شام کے مسنون اذکار۔", fr: "Protections." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid' as const, item_count: 15 } },
    { lesson_id: 57, title: { en: "Kindness to Parents", ur: "والدین کی خدمت", fr: "Parents" }, description: { en: "Quranic verses on parents.", ur: "والدین کے حقوق۔", fr: "Parents." }, meta: { estimated_minutes: 10, difficulty: "Advanced", layout: 'grid' as const, item_count: 5 } },
    { lesson_id: 58, title: { en: "Rare Rules", ur: "متفرقات", fr: "Rares" }, description: { en: "Rare Arabic reading rules.", ur: "عربی کے متفرقات قواعد۔", fr: "Règles." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list' as const, item_count: 8 } },
];

const SURAH_META: Lesson[] = [
    { id: 1, name: 'Al-Fatiha', verses: 7 },
    { id: 95, name: 'At-Tin', verses: 8 },
    { id: 96, name: 'Al-Alaq', verses: 19 },
    { id: 97, name: 'Al-Qadr', verses: 5 },
    { id: 98, name: 'Al-Bayyina', verses: 8 },
    { id: 99, name: 'Az-Zalzala', verses: 8 },
    { id: 100, name: 'Al-Adiyat', verses: 11 },
    { id: 101, name: 'Al-Qari\'a', verses: 11 },
    { id: 102, name: 'At-Takathur', verses: 8 },
    { id: 103, name: 'Al-Asr', verses: 3 },
    { id: 104, name: 'Al-Humaza', verses: 9 },
    { id: 105, name: 'Al-Fil', verses: 5 },
    { id: 106, name: 'Quraish', verses: 4 },
    { id: 107, name: 'Al-Ma\'un', verses: 7 },
    { id: 108, name: 'Al-Kawthar', verses: 3 },
    { id: 109, name: 'Al-Kafirun', verses: 6 },
    { id: 110, name: 'An-Nasr', verses: 3 },
    { id: 111, name: 'Al-Masad', verses: 5 },
    { id: 112, name: 'Al-Ikhlas', verses: 4 },
    { id: 113, name: 'Al-Falaq', verses: 5 },
    { id: 114, name: 'An-Nas', verses: 6 }
].map((s, idx) => ({
    lesson_id: 69 + idx,
    title: { en: `Surah ${s.name}`, ur: `سورۃ ${s.name}`, fr: `Sourate ${s.name}` },
    description: { en: `The ${s.name}.`, ur: `${s.name}۔`, fr: `La ${s.name}.` },
    meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: s.verses }
}));

export const LESSONS = [...BASE_SYLLABUS, ...SURAH_META];

// --- DYNAMIC LOADER (using bundled toon data) ---
import { getToonData, getLessonMeta, getQuizData, ToonQuiz } from './data/toonData';
import { toonToLessonItems } from './data/toonParser';
import { allLessons, PHASES } from './data/lessons/list';
import { mkWBWAudio } from './data/utils';

const lessonCache: Record<number, Lesson> = {};

// Audio map for quiz questions in lessons 1-4 (matches toonParser LESSON1_AUDIO_MAP)
const QUIZ_AUDIO_MAP: Record<string, string> = {
    'ا': 'alif', 'ب': 'ba', 'ت': 'ta', 'ث': 'tha', 'ج': 'jeem', 'ح': 'ha_h', 'خ': 'kha',
    'د': 'dal', 'ذ': 'dhal', 'ر': 'ra', 'ز': 'za', 'س': 'seen', 'ش': 'sheen', 'ص': 'sad',
    'ض': 'dad', 'ط': 'toa', 'ظ': 'zoa', 'ع': 'ain', 'غ': 'ghain', 'ف': 'fa', 'ق': 'qaf',
    'ك': 'kaf', 'ل': 'lam', 'م': 'meem', 'ن': 'noon', 'و': 'waw', 'ه': 'ha_s', 'ء': 'hamza', 'ي': 'ya'
};

// Quiz text translation mapping (English -> translations)
const QUIZ_TRANSLATIONS: Record<string, { en: string; ur: string; fr: string; ar?: string }> = {
    // Questions
    "What does the 'Initial' shape correspond to?": { en: "What does the 'Initial' shape correspond to?", ur: "'ابتدائی' شکل کس چیز کو ظاہر کرتی ہے؟", fr: "À quoi correspond la forme 'Initiale'?" },
    "Which letter breaks the connection (does NOT join to the left)?": { en: "Which letter does NOT join to the left?", ur: "کون سا حرف بائیں طرف نہیں جڑتا؟", fr: "Quelle lettre ne se joint pas à gauche?" },
    "Which group of letters never joins to the left?": { en: "Which letters never join left?", ur: "کون سے حروف بائیں طرف نہیں جڑتے؟", fr: "Quelles lettres ne se joignent jamais à gauche?" },
    "Can 'Ra' (ر) connect to the letter BEFORE it?": { en: "Can 'Ra' (ر) connect before?", ur: "کیا 'ر' پہلے والے حرف سے جڑ سکتا ہے؟", fr: "'Ra' (ر) peut-il se connecter avant?" },
    "Can 'Ra' (ر) connect to the letter AFTER it?": { en: "Can 'Ra' (ر) connect after?", ur: "کیا 'ر' بعد والے حرف سے جڑ سکتا ہے؟", fr: "'Ra' (ر) peut-il se connecter après?" },
    "Identify the connected form:": { en: "Identify:", ur: "پہچانیں:", fr: "Identifiez:" },
    // Options
    "Start of the word": { en: "Start of the word", ur: "لفظ کی شروعات", fr: "Début du mot" },
    "Middle of the word": { en: "Middle of the word", ur: "لفظ کا درمیان", fr: "Milieu du mot" },
    "End of the word": { en: "End of the word", ur: "لفظ کا آخر", fr: "Fin du mot" },
    "Separate letter": { en: "Separate letter", ur: "الگ حرف", fr: "Lettre séparée" },
    "Yes": { en: "Yes", ur: "ہاں", fr: "Oui" },
    "No": { en: "No", ur: "نہیں", fr: "Non" },
    "Always": { en: "Always", ur: "ہمیشہ", fr: "Toujours" },
    "Never": { en: "Never", ur: "کبھی نہیں", fr: "Jamais" },
    "Sometimes": { en: "Sometimes", ur: "کبھی کبھی", fr: "Parfois" },
    "Only if it's Alif": { en: "Only if Alif", ur: "صرف الف ہو تو", fr: "Seulement si Alif" },
    "Look for the 'head' and dots": { en: "Look for head & dots", ur: "سر اور نقطے دیکھیں", fr: "Cherchez la tête et points" },
    "Look at the tail": { en: "Look at tail", ur: "دم دیکھیں", fr: "Regardez la queue" },
    "Look at the color": { en: "Look at color", ur: "رنگ دیکھیں", fr: "Regardez la couleur" },
    "Guess": { en: "Guess", ur: "اندازہ", fr: "Deviner" },
    "Yes, significantly": { en: "Yes, a lot", ur: "ہاں، بہت", fr: "Oui, beaucoup" },
    "Only at the end": { en: "Only at end", ur: "صرف آخر میں", fr: "Seulement à la fin" },
    "Only slightly": { en: "Slightly", ur: "تھوڑا سا", fr: "Légèrement" },
    "No, it sits on a carrier or alone": { en: "No, sits alone", ur: "نہیں، اکیلا بیٹھتا ہے", fr: "Non, reste seul" },
    // Letter forms
    "(Initial)": { en: "(Initial)", ur: "(ابتدائی)", fr: "(Initiale)" },
    "(Medial)": { en: "(Medial)", ur: "(درمیانی)", fr: "(Médiale)" },
    "(Final)": { en: "(Final)", ur: "(آخری)", fr: "(Finale)" },
};

// Helper to translate quiz text
function translateQuizText(text: string, lang: string): string {
    // Check for exact match
    if (QUIZ_TRANSLATIONS[text]) {
        return QUIZ_TRANSLATIONS[text][lang as keyof typeof QUIZ_TRANSLATIONS[string]] || text;
    }

    // Check for partial matches (for questions with Arabic letters embedded)
    let translated = text;
    for (const [key, translations] of Object.entries(QUIZ_TRANSLATIONS)) {
        if (text.includes(key)) {
            const translatedPart = translations[lang as keyof typeof translations] || key;
            translated = translated.replace(key, translatedPart);
        }
    }

    return translated;
}

// Convert ToonQuiz to LessonQuiz format
function toonQuizToLessonQuiz(toonQuizzes: ToonQuiz[], lessonId: number): LessonQuiz[] {
    // Get toon items for this lesson to find audio paths
    const toonItems = getToonData(lessonId);

    return toonQuizzes.map((q, i) => {
        // Check if question is Arabic-only (for letter identification quizzes)
        const isArabicOnly = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s]+$/.test(q.question.trim());
        const arabicTarget = isArabicOnly ? q.question.trim() : q.question.replace(/Identify:\s*/, '').trim();

        // Create translated questions
        const translatedQuestions = isArabicOnly ? {
            en: `Identify: ${arabicTarget}`,
            ur: `پہچانیں: ${arabicTarget}`,
            fr: `Identifiez: ${arabicTarget}`,
            ar: `حدد: ${arabicTarget}`
        } : {
            en: translateQuizText(q.question, 'en'),
            ur: translateQuizText(q.question, 'ur'),
            fr: translateQuizText(q.question, 'fr')
        };

        // Translate options
        const translatedOptions = q.options.map(opt => ({
            en: translateQuizText(opt, 'en'),
            ur: translateQuizText(opt, 'ur'),
            fr: translateQuizText(opt, 'fr')
        }));

        // Translate correct answer
        const translatedCorrect = {
            en: translateQuizText(q.correct, 'en'),
            ur: translateQuizText(q.correct, 'ur'),
            fr: translateQuizText(q.correct, 'fr')
        };

        let audioPath = '';

        // For lessons 1-4: Use local lesson1 audio
        if (lessonId <= 4 && arabicTarget) {
            const cleanLetter = arabicTarget.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').charAt(0);
            const audioName = QUIZ_AUDIO_MAP[cleanLetter];
            if (audioName) {
                audioPath = `/audio/lesson1/${audioName}.mp3`;
            }
        }

        // For lessons 5+: Find matching item and use its WBW audio
        if (lessonId >= 5 && arabicTarget) {
            const matchingItem = toonItems.find(item =>
                item.text_ar === arabicTarget ||
                item.text_ar.includes(arabicTarget) ||
                arabicTarget.includes(item.text_ar)
            );
            if (matchingItem?.surah && matchingItem?.ayah && matchingItem?.word_index) {
                audioPath = mkWBWAudio(matchingItem.surah, matchingItem.ayah, matchingItem.word_index);
            }
        }

        return {
            id: q.id || `q${lessonId}_${i}`,
            type: 'audio' as const,
            question: translatedQuestions,
            options: translatedOptions,
            correct: translatedCorrect,
            audio: audioPath || undefined
        };
    });
}

// Build full Lesson object from toon data
function buildLessonFromToon(id: number): Lesson | undefined {
    // Get metadata from list
    const listItem = allLessons.find(l => l.id === String(id));
    const toonMeta = getLessonMeta(id);

    if (!listItem) return undefined;

    // Get content and quiz
    const toonItems = getToonData(id);
    const toonQuizzes = getQuizData(id);

    // Lesson rules for ALL lessons (Phase 1-4)
    const LESSON_RULES: Record<number, { en: string; ur: string; fr: string }> = {
        // Phase 1: The Alphabet (1-10)
        1: { en: "Listen carefully to each letter and repeat after the audio. Pay attention to the unique sound of each Arabic letter.", ur: "ہر حرف کو غور سے سنیں اور آڈیو کے بعد دہرائیں۔ ہر عربی حرف کی منفرد آواز پر توجہ دیں۔", fr: "Écoutez attentivement chaque lettre et répétez après l'audio." },
        2: { en: "Arabic letters change shape based on their position in a word: Initial (beginning), Medial (middle), Final (end), or Isolated.", ur: "عربی حروف لفظ میں اپنی جگہ کے مطابق شکل بدلتے ہیں: ابتدائی، درمیانی، آخری، یا مفرد۔", fr: "Les lettres arabes changent de forme selon leur position dans un mot." },
        3: { en: "Many Arabic letters look similar! The key difference is usually in the number and position of dots (nuqta). Pay close attention!", ur: "بہت سے عربی حروف ایک جیسے نظر آتے ہیں! فرق عموماً نقطوں کی تعداد اور پوزیشن میں ہوتا ہے۔", fr: "De nombreuses lettres se ressemblent ! La différence réside dans les points." },
        4: { en: "Heavy letters (خ ص ض غ ط ق ظ) are pronounced with fullness in the mouth. Light letters are pronounced softly.", ur: "بھاری حروف (خ ص ض غ ط ق ظ) منہ میں بھاری آواز سے ادا ہوتے ہیں۔ ہلکے حروف نرم آواز سے ادا ہوتے ہیں۔", fr: "Les lettres lourdes se prononcent avec plénitude. Les lettres légères sont douces." },
        5: { en: "Every Arabic letter has a specific articulation point (Makhraj). Study where each sound originates from.", ur: "ہر عربی حرف کا ایک مخصوص مخرج ہے۔ سیکھیں کہ ہر آواز کہاں سے نکلتی ہے۔", fr: "Chaque lettre arabe a un point d'articulation spécifique (Makhraj)." },
        6: { en: "Fatha (زَبَر) is the short 'A' vowel. It appears as a small line above the letter and gives an 'A' sound.", ur: "فتحہ (زَبَر) مختصر 'ا' کی آواز ہے۔ یہ حرف کے اوپر چھوٹی لکیر ہے۔", fr: "La Fatha est la voyelle courte 'A'. Elle apparaît comme une petite ligne au-dessus de la lettre." },
        7: { en: "Kasra (زِیر) is the short 'I' vowel. It appears as a small line below the letter and gives an 'I' sound.", ur: "کسرہ (زِیر) مختصر 'ای' کی آواز ہے۔ یہ حرف کے نیچے چھوٹی لکیر ہے۔", fr: "La Kasra est la voyelle courte 'I'. Elle apparaît sous la lettre." },
        8: { en: "Damma (پِیش) is the short 'U' vowel. It appears as a small curve above the letter and gives an 'U' sound.", ur: "ضمہ (پِیش) مختصر 'او' کی آواز ہے۔ یہ حرف کے اوپر چھوٹا گول نشان ہے۔", fr: "La Damma est la voyelle courte 'U'. Elle apparaît comme une petite courbe au-dessus de la lettre." },
        9: { en: "Practice distinguishing between Fatha (A), Kasra (I), and Damma (U) on the same letters.", ur: "ایک ہی حروف پر فتحہ، کسرہ اور ضمہ میں فرق کی مشق کریں۔", fr: "Pratiquez la distinction entre Fatha (A), Kasra (I) et Damma (U) sur les mêmes lettres." },
        10: { en: "Master voice diction: Pronounce each letter with perfect Fatha, Kasra, and Damma.", ur: "آوازوں پر عبور حاصل کریں: ہر حرف فتحہ، کسرہ اور ضمہ کے ساتھ ادا کریں۔", fr: "Maîtrisez la diction: Prononcez chaque lettre avec Fatha, Kasra et Damma parfaits." },
        // Phase 2: Foundations (11-24)
        11: { en: "Murakkabat are compound letters joined together. Practice reading joined letter combinations.", ur: "مرکبات جڑے ہوئے حروف ہیں۔ ملے ہوئے حروف پڑھنے کی مشق کریں۔", fr: "Les Murakkabat sont des lettres composées jointes ensemble." },
        12: { en: "Tanween Fath (تنوین فتح ً) adds an 'an' sound at the end. It appears as two Fathas.", ur: "تنوین فتح آخر میں 'اَن' کی آواز دیتی ہے۔ یہ دو زَبر کی شکل میں ہے۔", fr: "Le Tanween Fath ajoute un son 'an' à la fin." },
        13: { en: "Tanween Kasr (تنوین کسر ٍ) adds an 'in' sound at the end. It appears as two Kasras.", ur: "تنوین کسر آخر میں 'اِن' کی آواز دیتی ہے۔ یہ دو زِیر کی شکل میں ہے۔", fr: "Le Tanween Kasr ajoute un son 'in' à la fin." },
        14: { en: "Tanween Damm (تنوین ضم ٌ) adds an 'un' sound at the end. It appears as two Dammas.", ur: "تنوین ضم آخر میں 'اُن' کی آواز دیتی ہے۔ یہ دو پِیش کی شکل میں ہے۔", fr: "Le Tanween Damm ajoute un son 'un' à la fin." },
        15: { en: "Standing Fatha (کھڑا زبر) extends the 'A' sound longer. Written as a vertical line.", ur: "کھڑا زبر 'آ' کی آواز کو لمبا کرتا ہے۔ کھڑی لکیر کے طور پر لکھا جاتا ہے۔", fr: "La Fatha debout prolonge le son 'A'." },
        16: { en: "Standing Kasra (کھڑا زیر) extends the 'I' sound longer.", ur: "کھڑا زیر 'ای' کی آواز کو لمبا کرتا ہے۔", fr: "La Kasra debout prolonge le son 'I'." },
        17: { en: "Standing Damma (الٹا پیش) extends the 'U' sound longer.", ur: "الٹا پیش 'او' کی آواز کو لمبا کرتا ہے۔", fr: "La Damma debout prolonge le son 'U'." },
        18: { en: "Madd Asli (Natural Madd) is the natural elongation of vowels through Alif, Waw, and Ya.", ur: "مد اصلی الف، واو اور یا کے ذریعے آواز کا قدرتی اضافہ ہے۔", fr: "Le Madd Asli est l'allongement naturel des voyelles." },
        19: { en: "Sukoon (سکون) means silence. A letter with Sukoon has no vowel sound and stops shortly.", ur: "سکون کا مطلب خاموشی ہے۔ سکون والا حرف بے آواز ہے۔", fr: "Le Sukoon signifie silence. Une lettre avec Sukoon n'a pas de voyelle." },
        20: { en: "Practice reading letters with Sukoon. Be careful not to add extra sounds.", ur: "سکون والے حروف پڑھنے کی مشق کریں۔ اضافی آواز نہ ڈالیں۔", fr: "Pratiquez la lecture des lettres avec Sukoon." },
        21: { en: "Qalqala (قلقلہ) is the echo/bounce sound on ق ط ب ج د when they have Sukoon.", ur: "قلقلہ ق ط ب ج د پر سکون ہونے پر گونج کی آواز ہے۔", fr: "La Qalqala est le son d'écho sur ق ط ب ج د avec Sukoon." },
        22: { en: "Shaddah (تشدید) doubles the letter. Pronounce it with emphasis and hold the sound.", ur: "شدہ حرف کو دو بار پڑھا جاتا ہے۔ زور سے ادا کریں۔", fr: "La Shaddah double la lettre. Prononcez avec emphase." },
        23: { en: "Shaddah combines with vowels. Practice Shaddah with Fatha, Kasra, and Damma.", ur: "شدہ حرکات کے ساتھ ملتی ہے۔ فتحہ، کسرہ اور ضمہ کے ساتھ مشق کریں۔", fr: "La Shaddah se combine avec les voyelles." },
        24: { en: "Shaddah with Tanween creates doubled sound with 'n' ending.", ur: "شدہ تنوین کے ساتھ دوگنی آواز اور نون ختم کرتا ہے۔", fr: "La Shaddah avec Tanween crée un son doublé avec une terminaison en 'n'." },
        // Phase 3: Tajweed Rules (25-48)
        25: { en: "Nun Sakin (نون ساکن) and Tanween have 4 rules: Izhar, Idgham, Iqlab, Ikhfa.", ur: "نون ساکن اور تنوین کے 4 احکام ہیں: اظہار، ادغام، اقلاب، اخفاء۔", fr: "Le Noun Sakin et Tanween ont 4 règles: Izhar, Idgham, Iqlab, Ikhfa." },
        26: { en: "Izhar (اظہار): Pronounce Nun clearly when followed by throat letters: ء ھ ع ح غ خ.", ur: "اظہار: نون ساکن حلقی حروف سے پہلے صاف ادا ہو: ء ھ ع ح غ خ", fr: "Izhar: Prononcez le Noun clairement devant les lettres de la gorge." },
        27: { en: "Idgham (ادغام): Merge Nun into the following letters: ی ر م ل و ن. Some with Ghunnah, some without.", ur: "ادغام: نون ساکن ان حروف میں مل جائے: ی ر م ل و ن۔ کچھ غنہ کے ساتھ، کچھ بغیر۔", fr: "Idgham: Fusionnez le Noun avec les lettres suivantes." },
        28: { en: "Iqlab (اقلاب): When Nun Sakin is followed by ب, change the Nun to Meem with Ghunnah.", ur: "اقلاب: نون ساکن ب سے پہلے میم میں بدل جائے غنہ کے ساتھ۔", fr: "Iqlab: Changez le Noun en Meem lorsqu'il est suivi de ب." },
        29: { en: "Ikhfa (اخفاء): Hide the Nun with a nasal sound before these 15 letters.", ur: "اخفاء: نون ساکن ان 15 حروف سے پہلے چھپ جائے غنہ کے ساتھ۔", fr: "Ikhfa: Cachez le Noun avec un son nasal devant ces 15 lettres." },
        30: { en: "Meem Sakin has 3 rules: Ikhfa Shafawi (before ب), Idgham Shafawi (before م), Izhar Shafawi.", ur: "میم ساکن کے 3 احکام: اخفاء شفوی، ادغام شفوی، اظہار شفوی۔", fr: "Le Meem Sakin a 3 règles: Ikhfa, Idgham et Izhar Shafawi." },
        31: { en: "Muqatta'at are the mysterious disconnected letters at the start of some Surahs.", ur: "مقطعات سورتوں کے شروع میں الگ حروف ہیں۔", fr: "Les Muqatta'at sont les lettres mystérieuses au début de certaines sourates." },
        32: { en: "Madd Far'i is elongation beyond natural length due to a reason (Hamza, Sukoon).", ur: "مد فرعی قدرتی لمبائی سے زیادہ کسی سبب سے ہے۔", fr: "Le Madd Far'i est un allongement au-delà de la longueur naturelle." },
        33: { en: "Madd Muttasil: Elongate 4-5 counts when Hamza comes after the Madd letter in the same word.", ur: "مد متصل: اگر ہمزہ اسی لفظ میں مد کے بعد ہو تو 4-5 گنا کریں۔", fr: "Madd Muttasil: Allongez 4-5 temps quand le Hamza suit la lettre Madd dans le même mot." },
        34: { en: "Madd Munfasil: Elongate 2-5 counts when Hamza comes in the next word.", ur: "مد منفصل: اگر ہمزہ اگلے لفظ میں ہو تو 2-5 گنا کریں۔", fr: "Madd Munfasil: Allongez 2-5 temps quand le Hamza est dans le mot suivant." },
        35: { en: "Madd Lazim: Compulsory 6-count elongation when there's a Sukoon or Shaddah after Madd.", ur: "مد لازم: سکون یا شدہ کے بعد 6 گنا لازمی مد ہے۔", fr: "Madd Lazim: Allongement obligatoire de 6 temps." },
        36: { en: "Madd Arid Lis-Sukoon: Elongate 2-6 counts when stopping on a word.", ur: "مد عارض للسکون: لفظ پر رکتے وقت 2-6 گنا کریں۔", fr: "Madd Arid: Allongez 2-6 temps en s'arrêtant sur un mot." },
        37: { en: "Madd Lin: When stopping on a word with و or ی preceded by a Fatha.", ur: "مد لین: فتحہ کے بعد و یا ی پر رکتے وقت۔", fr: "Madd Lin: En s'arrêtant sur un mot avec و ou ی précédé de Fatha." },
        38: { en: "Ghunnah is a nasal sound from the nose, held for 2 counts on Noon and Meem with Shaddah.", ur: "غنہ ناک سے نکلنے والی آواز ہے، نون اور میم شدہ پر 2 گنا۔", fr: "La Ghunnah est un son nasal tenu 2 temps sur Noon et Meem avec Shaddah." },
        39: { en: "Tafkheem (heavy) vs Tarqeeq (light). Heavy letters are always thick. Others depend on context.", ur: "تفخیم (بھاری) بمقابلہ ترقیق (ہلکا)۔ بھاری حروف ہمیشہ موٹے ہیں۔", fr: "Tafkheem (lourd) vs Tarqeeq (léger). Les lettres lourdes sont toujours épaisses." },
        40: { en: "Learn the Quranic recitation for daily prayers (Salah/Namaz).", ur: "روزانہ نماز کی قرآنی قراءت سیکھیں۔", fr: "Apprenez la récitation coranique pour les prières quotidiennes." },
        41: { en: "Ayat-ul-Kursi is the greatest verse of the Quran. Practice its proper recitation.", ur: "آیۃ الکرسی قرآن کی عظیم ترین آیت ہے۔ اس کی صحیح قراءت کی مشق کریں۔", fr: "Ayat-ul-Kursi est le plus grand verset du Coran." },
        42: { en: "Dua-e-Qanoot is recited in Witr prayer. Learn its proper pronunciation.", ur: "دعائے قنوت وتر کی نماز میں پڑھی جاتی ہے۔ درست تلفظ سیکھیں۔", fr: "Dua-e-Qanoot est récité dans la prière Witr." },
        43: { en: "Al-Shamsiyah (Sun): Lam assimilates. Al-Qamariyah (Moon): Lam is pronounced clearly.", ur: "الشمسی: لام ملتا ہے۔ القمری: لام صاف پڑھا جاتا ہے۔", fr: "Al-Shamsiyah: Le Lam s'assimile. Al-Qamariyah: Le Lam est prononcé clairement." },
        44: { en: "Hamza rules: Hamza Wasl (connecting) is silent when continuing. Hamza Qat' is always pronounced.", ur: "ہمزہ وصل جوڑتے ہوئے ساکت ہے۔ ہمزہ قطع ہمیشہ پڑھا جاتا ہے۔", fr: "Hamza Wasl est silencieux en continuant. Hamza Qat' est toujours prononcé." },
        45: { en: "Some letters are written but not pronounced. Learn to recognize silent letters.", ur: "کچھ حروف لکھے جاتے ہیں لیکن پڑھے نہیں جاتے۔ خاموش حروف پہچانیں۔", fr: "Certaines lettres sont écrites mais non prononcées." },
        46: { en: "Waqf signs tell you where to stop, pause, or continue. Learn each symbol.", ur: "وقف کے نشانات بتاتے ہیں کہاں رکنا ہے۔ ہر نشان سیکھیں۔", fr: "Les signes de Waqf indiquent où s'arrêter ou continuer." },
        47: { en: "Meaningful stops preserve the meaning. Wrong stops can change the meaning entirely.", ur: "معنی والے وقف مفہوم محفوظ رکھتے ہیں۔ غلط وقف معنی بدل سکتا ہے۔", fr: "Les arrêts significatifs préservent le sens." },
        48: { en: "General review: Practice applying all Tajweed rules together in real Quranic text.", ur: "عمومی جائزہ: تمام تجوید کے اصول قرآنی متن میں ایک ساتھ لاگو کریں۔", fr: "Revue générale: Pratiquez l'application de toutes les règles ensemble." },
    };

    const LESSON_OBJECTIVES: Record<number, { en: string; ur: string; fr: string }> = {
        // Phase 1
        1: { en: "Recognize and pronounce all 29 Arabic letters correctly.", ur: "تمام 29 عربی حروف کو پہچاننا اور درست تلفظ کرنا۔", fr: "Reconnaître et prononcer correctement les 29 lettres arabes." },
        2: { en: "Learn how letters connect and change shape in words.", ur: "سیکھیں کہ حروف کیسے جڑتے ہیں اور لفظوں میں شکل بدلتے ہیں۔", fr: "Apprendre comment les lettres se connectent." },
        3: { en: "Distinguish between similar-looking letters by their dots and shapes.", ur: "ملتے جلتے حروف کو ان کے نقطوں اور شکلوں سے پہچانیں۔", fr: "Distinguer les lettres similaires par leurs points." },
        4: { en: "Differentiate between heavy (Tafkheem) and light (Tarqeeq) letters.", ur: "بھاری (تفخیم) اور ہلکے (ترقیق) حروف میں فرق کریں۔", fr: "Différencier les lettres lourdes et légères." },
        5: { en: "Master the articulation points of all Arabic letters.", ur: "تمام عربی حروف کے مخارج میں مہارت حاصل کریں۔", fr: "Maîtriser les points d'articulation de toutes les lettres." },
        6: { en: "Correctly pronounce letters with Fatha vowel.", ur: "فتحہ کے ساتھ حروف درست ادا کریں۔", fr: "Prononcer correctement les lettres avec Fatha." },
        7: { en: "Correctly pronounce letters with Kasra vowel.", ur: "کسرہ کے ساتھ حروف درست ادا کریں۔", fr: "Prononcer correctement les lettres avec Kasra." },
        8: { en: "Correctly pronounce letters with Damma vowel.", ur: "ضمہ کے ساتھ حروف درست ادا کریں۔", fr: "Prononcer correctement les lettres avec Damma." },
        9: { en: "Fluently switch between all three short vowels.", ur: "تینوں مختصر حرکات میں روانی سے بولیں۔", fr: "Basculer couramment entre les trois voyelles courtes." },
        10: { en: "Master the complete alphabet with all vowel combinations.", ur: "تمام حرکات کے ساتھ مکمل حروف تہجی میں مہارت۔", fr: "Maîtriser l'alphabet complet avec toutes les voyelles." },
        // Phase 2
        11: { en: "Read compound letters (Murakkabat) fluently.", ur: "مرکبات روانی سے پڑھیں۔", fr: "Lire les lettres composées couramment." },
        12: { en: "Recognize and pronounce Tanween Fath correctly.", ur: "تنوین فتح درست پہچانیں اور پڑھیں۔", fr: "Reconnaître et prononcer correctement le Tanween Fath." },
        13: { en: "Recognize and pronounce Tanween Kasr correctly.", ur: "تنوین کسر درست پہچانیں اور پڑھیں۔", fr: "Reconnaître et prononcer correctement le Tanween Kasr." },
        14: { en: "Recognize and pronounce Tanween Damm correctly.", ur: "تنوین ضم درست پہچانیں اور پڑھیں۔", fr: "Reconnaître et prononcer correctement le Tanween Damm." },
        15: { en: "Master long 'A' sound with standing Fatha.", ur: "کھڑے زبر سے لمبی 'آ' کی آواز میں مہارت۔", fr: "Maîtriser le son 'A' long avec Fatha debout." },
        16: { en: "Master long 'I' sound with standing Kasra.", ur: "کھڑے زیر سے لمبی 'ای' کی آواز میں مہارت۔", fr: "Maîtriser le son 'I' long avec Kasra debout." },
        17: { en: "Master long 'U' sound with standing Damma.", ur: "الٹے پیش سے لمبی 'او' کی آواز میں مہارت۔", fr: "Maîtriser le son 'U' long avec Damma debout." },
        18: { en: "Apply natural elongation rules correctly.", ur: "قدرتی مد کے اصول درست لاگو کریں۔", fr: "Appliquer correctement les règles d'allongement naturel." },
        19: { en: "Recognize and apply Sukoon correctly.", ur: "سکون درست پہچانیں اور لاگو کریں۔", fr: "Reconnaître et appliquer correctement le Sukoon." },
        20: { en: "Read words with Sukoon fluently without adding extra sounds.", ur: "سکون والے الفاظ بغیر اضافی آواز کے روانی سے پڑھیں۔", fr: "Lire les mots avec Sukoon couramment." },
        21: { en: "Apply Qalqala echo sound on the 5 Qalqala letters.", ur: "5 قلقلہ حروف پر قلقلہ کی آواز لاگو کریں۔", fr: "Appliquer le son Qalqala sur les 5 lettres Qalqala." },
        22: { en: "Pronounce Shaddah with proper emphasis.", ur: "شدہ درست زور سے ادا کریں۔", fr: "Prononcer la Shaddah avec l'emphase appropriée." },
        23: { en: "Combine Shaddah with all vowels correctly.", ur: "شدہ تمام حرکات کے ساتھ درست ملائیں۔", fr: "Combiner correctement la Shaddah avec toutes les voyelles." },
        24: { en: "Master Shaddah with Tanween combinations.", ur: "شدہ تنوین کے ساتھ مہارت حاصل کریں۔", fr: "Maîtriser la Shaddah avec les combinaisons Tanween." },
        // Phase 3
        25: { en: "Understand the four rules of Nun Sakin and Tanween.", ur: "نون ساکن اور تنوین کے چار اصول سمجھیں۔", fr: "Comprendre les quatre règles du Noun Sakin et Tanween." },
        26: { en: "Apply Izhar rule when Nun Sakin meets throat letters.", ur: "حلقی حروف پر اظہار کا اصول لاگو کریں۔", fr: "Appliquer la règle Izhar." },
        27: { en: "Apply Idgham rule with and without Ghunnah.", ur: "غنہ کے ساتھ اور بغیر ادغام کا اصول لاگو کریں۔", fr: "Appliquer la règle Idgham avec et sans Ghunnah." },
        28: { en: "Apply Iqlab rule when Nun Sakin meets Ba.", ur: "با سے پہلے اقلاب کا اصول لاگو کریں۔", fr: "Appliquer la règle Iqlab." },
        29: { en: "Apply Ikhfa rule on the 15 Ikhfa letters.", ur: "15 اخفاء حروف پر اخفاء کا اصول لاگو کریں۔", fr: "Appliquer la règle Ikhfa." },
        30: { en: "Master all three Meem Sakin rules.", ur: "میم ساکن کے تینوں اصولوں میں مہارت حاصل کریں۔", fr: "Maîtriser les trois règles du Meem Sakin." },
        31: { en: "Recite Muqatta'at letters with proper elongation.", ur: "مقطعات درست مد کے ساتھ پڑھیں۔", fr: "Réciter les lettres Muqatta'at avec allongement approprié." },
        32: { en: "Understand and apply Madd Far'i elongation.", ur: "مد فرعی سمجھیں اور لاگو کریں۔", fr: "Comprendre et appliquer l'allongement Madd Far'i." },
        33: { en: "Apply Madd Muttasil 4-5 count elongation.", ur: "مد متصل 4-5 گنا لاگو کریں۔", fr: "Appliquer l'allongement Madd Muttasil 4-5 temps." },
        34: { en: "Apply Madd Munfasil 2-5 count elongation.", ur: "مد منفصل 2-5 گنا لاگو کریں۔", fr: "Appliquer l'allongement Madd Munfasil 2-5 temps." },
        35: { en: "Apply Madd Lazim 6 count elongation.", ur: "مد لازم 6 گنا لاگو کریں۔", fr: "Appliquer l'allongement Madd Lazim 6 temps." },
        36: { en: "Apply Madd Arid when stopping on words.", ur: "الفاظ پر رکتے وقت مد عارض لاگو کریں۔", fr: "Appliquer Madd Arid en s'arrêtant sur les mots." },
        37: { en: "Apply Madd Lin when stopping on Waw/Ya after Fatha.", ur: "فتحہ کے بعد و/ی پر مد لین لاگو کریں۔", fr: "Appliquer Madd Lin." },
        38: { en: "Produce proper Ghunnah nasal sound for 2 counts.", ur: "2 گنا کے لیے درست غنہ ناسی آواز بنائیں۔", fr: "Produire un son nasal Ghunnah approprié." },
        39: { en: "Distinguish and apply Tafkheem vs Tarqeeq correctly.", ur: "تفخیم بمقابلہ ترقیق درست پہچانیں اور لاگو کریں۔", fr: "Distinguer et appliquer correctement Tafkheem vs Tarqeeq." },
        40: { en: "Recite prayer recitations with proper Tajweed.", ur: "نماز کی قراءت صحیح تجوید سے پڑھیں۔", fr: "Réciter les prières avec un Tajweed approprié." },
        41: { en: "Memorize and recite Ayat-ul-Kursi perfectly.", ur: "آیۃ الکرسی حفظ کریں اور بے عیب پڑھیں۔", fr: "Mémoriser et réciter parfaitement Ayat-ul-Kursi." },
        42: { en: "Memorize and recite Dua-e-Qanoot correctly.", ur: "دعائے قنوت حفظ کریں اور درست پڑھیں۔", fr: "Mémoriser et réciter correctement Dua-e-Qanoot." },
        43: { en: "Apply Sun and Moon letter rules correctly.", ur: "شمسی اور قمری حروف کے اصول درست لاگو کریں۔", fr: "Appliquer correctement les règles des lettres Soleil et Lune." },
        44: { en: "Know when to pronounce or skip Hamza.", ur: "جانیں کب ہمزہ پڑھنا ہے اور کب چھوڑنا ہے۔", fr: "Savoir quand prononcer ou sauter le Hamza." },
        45: { en: "Identify silent letters and skip them when reading.", ur: "خاموش حروف پہچانیں اور پڑھتے وقت چھوڑیں۔", fr: "Identifier les lettres silencieuses." },
        46: { en: "Recognize all Waqf (stopping) signs.", ur: "تمام وقف کے نشانات پہچانیں۔", fr: "Reconnaître tous les signes de Waqf." },
        47: { en: "Stop at meaningful places without changing meaning.", ur: "معنی بدلے بغیر معنی خیز جگہوں پر رکیں۔", fr: "S'arrêter aux endroits significatifs." },
        48: { en: "Apply all Tajweed rules in continuous Quran recitation.", ur: "مسلسل قرآن کی قراءت میں تمام تجوید کے اصول لاگو کریں۔", fr: "Appliquer toutes les règles de Tajweed." },
    };

    // Convert to Lesson type
    const lesson: Lesson = {
        lesson_id: id,
        title: {
            en: listItem.title,
            ur: toonMeta?.title_ur || listItem.title,
            fr: listItem.title
        },
        description: {
            en: listItem.subtitle,
            ur: toonMeta?.description_ur || listItem.subtitle,
            fr: listItem.subtitle
        },
        rule: LESSON_RULES[id],
        objective: LESSON_OBJECTIVES[id],
        meta: {
            estimated_minutes: Math.max(5, Math.ceil(toonItems.length / 5)),
            difficulty: id <= 24 ? 'Beginner' : id <= 48 ? 'Intermediate' : 'Advanced',
            layout: toonItems.length > 20 ? 'grid' : 'list',
            item_count: toonItems.length
        },
        items: toonToLessonItems(toonItems, id),
        quiz: toonQuizToLessonQuiz(toonQuizzes, id)
    };

    return lesson;
}

export const fetchLessonContent = async (id: number): Promise<Lesson | undefined> => {
    if (lessonCache[id]) return lessonCache[id];

    try {
        const lesson = buildLessonFromToon(id);
        if (lesson) {
            lessonCache[id] = lesson;
            return lesson;
        }
    } catch (e) {
        console.error(`Failed to load lesson ${id}`, e);
    }

    return undefined;
};


// Force reload for data update: v2
