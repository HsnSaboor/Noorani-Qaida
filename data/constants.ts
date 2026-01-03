
import { Lesson, LessonQuiz, Translation } from '../types';
import { getToonData, getLessonMeta, getQuizData, ToonQuiz } from './toonData';
import { toonToLessonItems } from './toonParser';
import { allLessons } from './lessons/list';
export * from './assets';

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
};

// --- SYLLABUS DEFINITION ---
const BASE_SYLLABUS: Lesson[] = [
    // PHASE 1-7 (1-41)
    { lesson_id: 1, title: { en: "1. The Alphabet", ur: "۱. حروف مفردات", fr: "1. L'Alphabet" }, description: { en: "Arabic Alphabet Recognition.", ur: "عربی حروف کی پہچان۔", fr: "Reconnaissance." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 29 } },
    { lesson_id: 2, title: { en: "2. Letter Shapes", ur: "۲. حروف کی اشکال", fr: "2. Formes" }, description: { en: "Initial, Medial, Final shapes.", ur: "حروف کی اشکال۔", fr: "Formes." }, meta: { estimated_minutes: 20, difficulty: "Beginner", layout: 'grid', item_count: 60 } },
    { lesson_id: 3, title: { en: "3. Similar Letters", ur: "۳. ملتے جلتے حروف", fr: "3. Lettres similaires" }, description: { en: "Differentiation of look-alikes.", ur: "ملتی جلتی شکلوں میں فرق۔", fr: "Différenciation." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 10 } },
    { lesson_id: 4, title: { en: "4. Heavy vs Light", ur: "۴. موٹے اور باریک حروف", fr: "4. Lourd vs Léger" }, description: { en: "Introduction to heavy letters.", ur: "موٹے حروف کا تعارف۔", fr: "Lettres lourdes." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 7 } },
    { lesson_id: 5, title: { en: "5. Makharij (Sounds)", ur: "۵. مخارج", fr: "5. Makharij" }, description: { en: "Proper articulation points.", ur: "حروف کے مخارج۔", fr: "Articulation." }, meta: { estimated_minutes: 20, difficulty: "Beginner", layout: 'grid', item_count: 17 } },
    { lesson_id: 6, title: { en: "6. Fatha", ur: "۶. زبر", fr: "6. Fatha" }, description: { en: "Short vowel 'A'.", ur: "زبر۔", fr: "Fatha." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 30 } },
    { lesson_id: 7, title: { en: "7. Kasra", ur: "۷. زیر", fr: "7. Kasra" }, description: { en: "Short vowel 'E'.", ur: "زیر۔", fr: "Kasra." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 30 } },
    { lesson_id: 8, title: { en: "8. Damma", ur: "۸. پیش", fr: "8. Damma" }, description: { en: "Short vowel 'U'.", ur: "پیش۔", fr: "Damma." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 30 } },
    { lesson_id: 9, title: { en: "9. Mixed Harakat", ur: "۹. حرکات کی مشق", fr: "9. Harakat" }, description: { en: "Practice vowels.", ur: "مشق۔", fr: "Pratique." }, meta: { estimated_minutes: 20, difficulty: "Beginner", layout: 'grid', item_count: 40 } },
    { lesson_id: 10, title: { en: "10. Full Drill", ur: "۱۰. مکمل مشق", fr: "10. Drill" }, description: { en: "Alphabet with vowels.", ur: "مکمل مشق۔", fr: "Drill complet." }, meta: { estimated_minutes: 10, difficulty: "Beginner", layout: 'grid', item_count: 29 } },
    { lesson_id: 11, title: { en: "11. Murakkabat", ur: "۱۱. مرکبات", fr: "11. Murakkabat" }, description: { en: "Joining letters.", ur: "مرکبات۔", fr: "Joindre." }, meta: { estimated_minutes: 20, difficulty: "Beginner", layout: 'grid', item_count: 50 } },
    { lesson_id: 12, title: { en: "12. Tanween Fath", ur: "۱۲. دو زبر", fr: "12. Tanween Fath" }, description: { en: "Double Fatha.", ur: "دو زبر۔", fr: "Double Fatha." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 13, title: { en: "13. Tanween Kasr", ur: "۱۳. دو زیر", fr: "13. Tanween Kasr" }, description: { en: "Double Kasra.", ur: "دو زیر۔", fr: "Double Kasra." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 14, title: { en: "14. Tanween Damm", ur: "۱۴. دو پیش", fr: "14. Tanween Damm" }, description: { en: "Double Damma.", ur: "دو پیش۔", fr: "Double Damma." }, meta: { estimated_minutes: 15, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 15, title: { en: "15. Standing Fatha", ur: "۱۵. کھڑا زبر", fr: "15. Fatha debout" }, description: { en: "Long A.", ur: "کھڑا زبر۔", fr: "Long A." }, meta: { estimated_minutes: 10, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 16, title: { en: "16. Standing Kasra", ur: "۱۶. کھڑا زیر", fr: "16. Kasra debout" }, description: { en: "Long E.", ur: "کھڑا زیر۔", fr: "Long E." }, meta: { estimated_minutes: 10, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 17, title: { en: "17. Standing Damma", ur: "۱۷. الٹا پیش", fr: "17. Damma inversé" }, description: { en: "Long U.", ur: "الٹا پیش۔", fr: "Long U." }, meta: { estimated_minutes: 10, difficulty: "Beginner", layout: 'grid', item_count: 20 } },
    { lesson_id: 18, title: { en: "18. Madd Asli", ur: "۱۸. مد اصلی", fr: "18. Madd Asli" }, description: { en: "Natural Madd.", ur: "مد اصلی۔", fr: "Madd naturel." }, meta: { estimated_minutes: 20, difficulty: "Beginner", layout: 'grid', item_count: 30 } },
    { lesson_id: 19, title: { en: "19. Sukoon", ur: "۱۹. سکون", fr: "19. Sukoon" }, description: { en: "Jazm.", ur: "جزم۔", fr: "Jazm." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'grid', item_count: 40 } },
    { lesson_id: 20, title: { en: "20. Sukoon Practice", ur: "۲۰. مشق", fr: "20. Pratique" }, description: { en: "Practice.", ur: "مشق۔", fr: "Pratique." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'grid', item_count: 30 } },
    { lesson_id: 21, title: { en: "21. Qalqala", ur: "۲۱. قلقلہ", fr: "21. Qalqala" }, description: { en: "Echo sound.", ur: "قلقلہ۔", fr: "Écho." }, meta: { estimated_minutes: 15, difficulty: "Intermediate", layout: 'grid', item_count: 20 } },
    { lesson_id: 22, title: { en: "22. Shaddah", ur: "۲۲. تشدید", fr: "22. Shaddah" }, description: { en: "Emphasis.", ur: "تشدید۔", fr: "Emphase." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'grid', item_count: 30 } },
    { lesson_id: 23, title: { en: "23. Shaddah & Harakat", ur: "۲۳. تشدید اور حرکات", fr: "23. Harakat" }, description: { en: "Shaddah+Vowels.", ur: "تشدید۔", fr: "Harakat." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'grid', item_count: 30 } },
    { lesson_id: 24, title: { en: "24. Shaddah & Tanween", ur: "۲۴. تشدید اور تنوین", fr: "24. Tanween" }, description: { en: "Shaddah+Tanween.", ur: "تشدید۔", fr: "Tanween." }, meta: { estimated_minutes: 15, difficulty: "Intermediate", layout: 'grid', item_count: 20 } },
    { lesson_id: 25, title: { en: "25. Nun Sakin Intro", ur: "۲۵. نون ساکن", fr: "25. Intro" }, description: { en: "Rules Intro.", ur: "تعارف۔", fr: "Intro." }, meta: { estimated_minutes: 10, difficulty: "Intermediate", layout: 'list', item_count: 5 } },
    { lesson_id: 26, title: { en: "26. Izhar", ur: "۲۶. اظہار", fr: "26. Izhar" }, description: { en: "Clear.", ur: "اظہار۔", fr: "Clair." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'grid', item_count: 30 } },
    { lesson_id: 27, title: { en: "27. Idgham", ur: "۲۷. ادغام", fr: "27. Idgham" }, description: { en: "Merge.", ur: "ادغام۔", fr: "Fusion." }, meta: { estimated_minutes: 25, difficulty: "Intermediate", layout: 'grid', item_count: 40 } },
    { lesson_id: 28, title: { en: "28. Iqlab", ur: "۲۸. اقلاب", fr: "28. Iqlab" }, description: { en: "Change.", ur: "اقلاب۔", fr: "Change." }, meta: { estimated_minutes: 15, difficulty: "Intermediate", layout: 'grid', item_count: 15 } },
    { lesson_id: 29, title: { en: "29. Ikhfa", ur: "۲۹. اخفاء", fr: "29. Ikhfa" }, description: { en: "Hide.", ur: "اخفاء۔", fr: "Cacher." }, meta: { estimated_minutes: 25, difficulty: "Advanced", layout: 'grid', item_count: 40 } },
    { lesson_id: 30, title: { en: "30. Meem Sakin", ur: "۳۰. میم ساکن", fr: "30. Meem Sakin" }, description: { en: "Meem Rules.", ur: "میم۔", fr: "Meem." }, meta: { estimated_minutes: 20, difficulty: "Intermediate", layout: 'list', item_count: 20 } },
    { lesson_id: 31, title: { en: "31. Muqatta'at", ur: "۳۱. مقطعات", fr: "31. Lettres Disjointes" }, description: { en: "Disjoined Letters.", ur: "حروف مقطعات۔", fr: "Lettres." }, meta: { estimated_minutes: 25, difficulty: "Advanced", layout: 'grid', item_count: 13 } },
    { lesson_id: 32, title: { en: "32. Madd Far'i", ur: "۳۲. مد فرعی", fr: "32. Madd Far'i" }, description: { en: "Derived Madd.", ur: "مد فرعی۔", fr: "Dérivé." }, meta: { estimated_minutes: 10, difficulty: "Advanced", layout: 'list', item_count: 5 } },
    { lesson_id: 33, title: { en: "33. Madd Muttasil", ur: "۳۳. مد متصل", fr: "33. Madd Muttasil" }, description: { en: "Connected.", ur: "مد متصل۔", fr: "Connecté." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 15 } },
    { lesson_id: 34, title: { en: "34. Madd Munfasil", ur: "۳۴. مد منفصل", fr: "34. Madd Munfasil" }, description: { en: "Detached.", ur: "مد منفصل۔", fr: "Détaché." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 15 } },
    { lesson_id: 35, title: { en: "35. Madd Lazim", ur: "۳۵. مد لازم", fr: "35. Madd Lazim" }, description: { en: "Compulsory.", ur: "مد لازم۔", fr: "Obligatoire." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 15 } },
    { lesson_id: 36, title: { en: "36. Madd Arid", ur: "۳۶. مد عارض", fr: "36. Madd Arid" }, description: { en: "Temporary.", ur: "مد عارض۔", fr: "Temporaire." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'list', item_count: 15 } },
    { lesson_id: 37, title: { en: "37. Madd Lin", ur: "۳۷. مد لین", fr: "37. Madd Lin" }, description: { en: "Leen.", ur: "مد لین۔", fr: "Leen." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid', item_count: 20 } },
    { lesson_id: 38, title: { en: "38. Ghunnah Rules", ur: "۳۸. غنہ", fr: "38. Ghunnah" }, description: { en: "Nasal.", ur: "غنہ۔", fr: "Nasal." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid', item_count: 20 } },
    { lesson_id: 39, title: { en: "39. Tafkheem", ur: "۳۹. تفخیم", fr: "39. Tafkheem" }, description: { en: "Heavy/Light.", ur: "موٹا/باریک۔", fr: "Lourd/Léger." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 20 } },
    { lesson_id: 40, title: { en: "40. Salah (Namaz)", ur: "۴۰. نماز", fr: "40. Prière" }, description: { en: "Prayer.", ur: "نماز۔", fr: "Prière." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 20 } },
    { lesson_id: 41, title: { en: "41. Sun & Moon", ur: "۴۱. شمسی و قمری", fr: "41. Solaires" }, description: { en: "Al-Lam.", ur: "ال۔", fr: "Al." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'grid', item_count: 15 } },
    { lesson_id: 42, title: { en: "42. Hamza Rules", ur: "۴۲. ہمزہ کے قواعد", fr: "42. Hamza" }, description: { en: "Wasl & Qat.", ur: "وصل و قطع۔", fr: "Wasl." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 100 } },
    { lesson_id: 43, title: { en: "43. Silent Letters", ur: "۴۳. خاموش حروف", fr: "43. Lettres Muettes" }, description: { en: "Silent letters.", ur: "خاموش حروف۔", fr: "Muettes." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 100 } },
    { lesson_id: 44, title: { en: "44. Waqf Signs", ur: "۴۴. وصل و وقف", fr: "44. Wasl/Waqf" }, description: { en: "Connecting.", ur: "وصل و وقف۔", fr: "Connexion." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 100 } },
    { lesson_id: 45, title: { en: "45. Waqf Signs", ur: "۴۵. رموز اوقاف", fr: "45. Signes" }, description: { en: "Punctuation.", ur: "رموز۔", fr: "Ponctuation." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 100 } },
    { lesson_id: 46, title: { en: "46. Sun & Moon", ur: "۴۶. شمسی و قمری", fr: "46. Solaires" }, description: { en: "Al-Lam rules.", ur: "ال کے قواعد۔", fr: "Règles Lam." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'grid', item_count: 100 } },
    { lesson_id: 47, title: { en: "47. Meaning Stops", ur: "۴۷. معنوی وقف", fr: "47. Sens" }, description: { en: "Meaning stops.", ur: "معنوی وقف۔", fr: "Sens." }, meta: { estimated_minutes: 15, difficulty: "Advanced", layout: 'list', item_count: 100 } },
    { lesson_id: 48, title: { en: "48. General Review", ur: "۴۸. اعادہ", fr: "48. Révision" }, description: { en: "Review.", ur: "اعادہ۔", fr: "Révision." }, meta: { estimated_minutes: 30, difficulty: "Advanced", layout: 'grid', item_count: 100 } },
    { lesson_id: 49, title: { en: "49. Word-by-Word", ur: "۴۹. لفظ بہ لفظ", fr: "49. Mot à Mot" }, description: { en: "Analysis.", ur: "تجزیہ۔", fr: "Analyse." }, meta: { estimated_minutes: 30, difficulty: "Advanced", layout: 'grid', item_count: 100 } },
    { lesson_id: 50, title: { en: "50. Tajweed Mushaf", ur: "۵۰. تجویدی مصحف", fr: "50. Mushaf" }, description: { en: "Colors.", ur: "رنگ۔", fr: "Couleurs." }, meta: { estimated_minutes: 30, difficulty: "Advanced", layout: 'grid', item_count: 100 } },
    { lesson_id: 51, title: { en: "51. Fluency Drills", ur: "۵۱. روانی", fr: "51. Fluidité" }, description: { en: "Drills.", ur: "مشق۔", fr: "Drills." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 100 } },
    { lesson_id: 52, title: { en: "52. Tarteel", ur: "۵۲. ترتیل", fr: "52. Tarteel" }, description: { en: "Slow reading.", ur: "ترتیل۔", fr: "Lent." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 50 } },
    { lesson_id: 53, title: { en: "53. Tahqeeq", ur: "۵۳. تحقیق", fr: "53. Tahqeeq" }, description: { en: "Precise.", ur: "تحقیق۔", fr: "Précis." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 50 } },
    { lesson_id: 54, title: { en: "54. Names of Allah", ur: "۵۴. اسماء الحسنیٰ", fr: "54. Noms d'Allah" }, description: { en: "99 Names.", ur: "۹۹ نام۔", fr: "99 Noms." }, meta: { estimated_minutes: 30, difficulty: "Advanced", layout: 'grid', item_count: 99 } },
    { lesson_id: 55, title: { en: "55. Breath Control", ur: "۵۵. سانس", fr: "55. Souffle" }, description: { en: "Breathing.", ur: "سانس۔", fr: "Souffle." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 50 } },
    { lesson_id: 56, title: { en: "56. Common Mistakes", ur: "۵۶. غلطیاں", fr: "56. Erreurs" }, description: { en: "Errors.", ur: "غلطیاں۔", fr: "Erreurs." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 50 } },
    { lesson_id: 57, title: { en: "57. Ethics (Parents)", ur: "۵۷. والدین", fr: "57. Parents" }, description: { en: "Kindness.", ur: "حسن سلوک۔", fr: "Bonté." }, meta: { estimated_minutes: 15, difficulty: "Intermediate", layout: 'list', item_count: 9 } },
    { lesson_id: 58, title: { en: "58. Rare Rules", ur: "۵۸. متفرق", fr: "58. Rares" }, description: { en: "Rare.", ur: "متفرق۔", fr: "Rares." }, meta: { estimated_minutes: 20, difficulty: "Advanced", layout: 'list', item_count: 8 } },
    { lesson_id: 64, title: { en: "64. Vocabulary", ur: "۶۴. الفاظ", fr: "64. Vocabulaire" }, description: { en: "Words.", ur: "الفاظ۔", fr: "Mots." }, meta: { estimated_minutes: 25, difficulty: "Intermediate", layout: 'grid', item_count: 50 } },
    { lesson_id: 65, title: { en: "65. Duas", ur: "۶۵. دعائیں", fr: "65. Duas" }, description: { en: "Duas.", ur: "دعائیں۔", fr: "Duas." }, meta: { estimated_minutes: 30, difficulty: "Beginner", layout: 'list', item_count: 20 } },
    { lesson_id: 66, title: { en: "66. Imala", ur: "۶۶. امالہ", fr: "66. Imala" }, description: { en: "Imala.", ur: "امالہ۔", fr: "Imala." }, meta: { estimated_minutes: 10, difficulty: "Advanced", layout: 'list', item_count: 1 } },
    { lesson_id: 67, title: { en: "67. Ayat-ul-Kursi", ur: "۶۷. آیت الکرسی", fr: "67. Ayat-ul-Kursi" }, description: { en: "Verse of Throne.", ur: "آیت الکرسی۔", fr: "Verset du Trône." }, meta: { estimated_minutes: 30, difficulty: "Advanced", layout: 'list', item_count: 50 } },
    { lesson_id: 68, title: { en: "68. Dua Qunoot", ur: "۶۸. دعائے قنوت", fr: "68. Dua Qunoot" }, description: { en: "Witr Dua.", ur: "وتر دعا۔", fr: "Dua Witr." }, meta: { estimated_minutes: 30, difficulty: "Advanced", layout: 'list', item_count: 10 } },
    { lesson_id: 99, title: { en: "99 Names of Allah", ur: "اسماء الحسنیٰ", fr: "99 Noms" }, description: { en: "Asma-ul-Husna.", ur: "اللہ کے نام۔", fr: "Noms d'Allah." }, meta: { estimated_minutes: 30, difficulty: "All", layout: 'grid', item_count: 99 } },
];

const SURAH_META: Lesson[] = [
    { lesson_id: 70, title: { en: "Surah Al-Fatiha", ur: "سورۃ الفاتحہ", fr: "Al-Fatiha" }, description: { en: "The Opening.", ur: "افتتاحی۔", fr: "L'Ouverture." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 7 } },
    { lesson_id: 71, title: { en: "Surah Al-Fil", ur: "سورۃ الفیل", fr: "Al-Fil" }, description: { en: "The Elephant.", ur: "ہاتھی۔", fr: "L'Éléphant." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 5 } },
    { lesson_id: 72, title: { en: "Surah Quraish", ur: "سورۃ قریش", fr: "Quraish" }, description: { en: "Quraish.", ur: "قریش۔", fr: "Quraish." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 4 } },
    { lesson_id: 73, title: { en: "Surah Al-Ma'un", ur: "سورۃ الماعون", fr: "Al-Ma'un" }, description: { en: "Small Kindnesses.", ur: "چھوٹی نیکی۔", fr: "L'Entraide." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 7 } },
    { lesson_id: 74, title: { en: "Surah Al-Kawthar", ur: "سورۃ الکوثر", fr: "Al-Kawthar" }, description: { en: "Abundance.", ur: "کثرت۔", fr: "L'Abondance." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 3 } },
    { lesson_id: 75, title: { en: "Surah Al-Kafirun", ur: "سورۃ الکافرون", fr: "Al-Kafirun" }, description: { en: "The Disbelievers.", ur: "کافر۔", fr: "Les Infidèles." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 6 } },
    { lesson_id: 76, title: { en: "Surah An-Nasr", ur: "سورۃ النصر", fr: "An-Nasr" }, description: { en: "The Help.", ur: "مدد۔", fr: "Le Secours." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 3 } },
    { lesson_id: 77, title: { en: "Surah Al-Masad", ur: "سورۃ المسد", fr: "Al-Masad" }, description: { en: "Palm Fiber.", ur: "کھجور کی چھال۔", fr: "Les Fibres." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 5 } },
    { lesson_id: 78, title: { en: "Surah Al-Ikhlas", ur: "سورۃ الاخلاص", fr: "Al-Ikhlas" }, description: { en: "Sincerity.", ur: "اخلاص۔", fr: "Le Monothéisme." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 4 } },
    { lesson_id: 79, title: { en: "Surah Al-Falaq", ur: "سورۃ الفلق", fr: "Al-Falaq" }, description: { en: "The Daybreak.", ur: "صبح۔", fr: "L'Aube." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 5 } },
    { lesson_id: 80, title: { en: "Surah An-Nas", ur: "سورۃ الناس", fr: "An-Nas" }, description: { en: "Mankind.", ur: "انسان۔", fr: "Les Hommes." }, meta: { estimated_minutes: 5, difficulty: "Advanced", layout: 'list', item_count: 6 } }
];

export const LESSONS = [...BASE_SYLLABUS, ...SURAH_META];

// --- DYNAMIC LOADER (using bundled toon data) ---
const lessonCache: Record<number, Lesson> = {};

// Convert ToonQuiz to LessonQuiz format
function toonQuizToLessonQuiz(toonQuizzes: ToonQuiz[], lessonId: number): LessonQuiz[] {
    return toonQuizzes.map((q, i) => ({
        id: q.id || `q${lessonId}_${i}`,
        type: 'text',
        question: { en: q.question, ur: q.question, fr: q.question },
        options: q.options,
        correct: q.correct
    }));
}

// Build full Lesson object from toon data
function buildLessonFromToon(id: number): Lesson | undefined {
    const listItem = allLessons.find(l => l.id === String(id));
    const toonMeta = getLessonMeta(id);

    if (!listItem) return undefined;

    const toonItems = getToonData(id);
    const toonQuizzes = getQuizData(id);

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

