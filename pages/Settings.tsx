
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { TEXTS } from '../constants';
import { Theme } from '../types';
import { ArrowLeft, Moon, Sun, Cloud, Flower2, PenTool, Hash, Shield, User, ChevronRight, Monitor, Mic, PlayCircle, Cat, Bird, Ghost, Globe, ChevronDown } from 'lucide-react';

const Settings: React.FC = () => {
  const { language, setLanguage, theme, setTheme, themeMode, setThemeMode, reciterId, setReciterId, autoPlay, setAutoPlay } = useAppContext();
  const t = TEXTS;

  const themes: { id: Theme; name: string; color: string; icon: React.ReactNode }[] = [
    { id: 'default', name: 'Sky High ☁️', color: 'bg-[#00BCD4]', icon: <Bird size={24} className="text-white" /> },
    { id: 'sunset', name: 'Tiger Orange 🐯', color: 'bg-[#FF9800]', icon: <Cat size={24} className="text-white" /> },
    { id: 'forest', name: 'Froggy Green 🐸', color: 'bg-[#8BC34A]', icon: <Flower2 size={24} className="text-white" /> },
    { id: 'lavender', name: 'Unicorn Purple 🦄', color: 'bg-[#E91E63]', icon: <Ghost size={24} className="text-white" /> },
  ];

  const reciters = [
      { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy' },
      { id: 'Husary_Muallim_128kbps', name: 'Mahmoud Khalil Al-Husary (Muallim)' },
      { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit (Murattal)' },
      { id: 'Minshawy_Murattal_128kbps', name: 'Mohamed Siddiq Al-Minshawi' },
      { id: 'Ayman_Sowaid_64kbps', name: 'Dr. Ayman Sowaid (Tajweed)' },
  ];

  const fontClass = language === 'ur' ? 'font-urdu' : (language === 'ar' ? 'font-arabic' : 'font-sans');
  const isRtl = language === 'ur' || language === 'ar';

  return (
    <div className={`max-w-3xl mx-auto p-4 sm:p-6 ${isRtl ? 'rtl-text' : ''} ${fontClass}`}>
       <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/"
          className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:scale-110 text-slate-500 dark:text-slate-400 transition-all active:scale-95"
        >
          <ArrowLeft size={28} />
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{t.settings[language]}</h1>
      </div>

      {/* Language Section */}
      <section className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-lg border-2 border-slate-100 dark:border-slate-700 mb-8 animate-in slide-in-from-bottom-2 duration-200">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-500 flex items-center justify-center">
                <Globe size={24} />
              </div>
              Language
          </h2>
          <div className="relative">
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 outline-none focus:ring-4 focus:ring-brand/20 font-bold appearance-none cursor-pointer text-lg"
            >
                  <option value="en">English</option>
                  <option value="ur">اردو (Urdu)</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="fr">Français (French)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="id">Bahasa Indonesia</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="tr">Türkçe (Turkish)</option>
                  <option value="ru">Русский (Russian)</option>
                  <option value="zh">中文 (Chinese)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="ms">Bahasa Melayu (Malay)</option>
                  <option value="pt">Português (Portuguese)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown />
            </div>
          </div>
      </section>

      {/* Audio Settings Section */}
      <section className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-lg border-2 border-slate-100 dark:border-slate-700 mb-8 animate-in slide-in-from-bottom-2 duration-200">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 flex items-center justify-center">
                <Mic size={24} />
              </div>
              Audio Magic
          </h2>
          <div className="space-y-6">
              <div className="space-y-3">
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Choose Reciter</p>
                  <div className="relative">
                    <select 
                        value={reciterId}
                        onChange={(e) => setReciterId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 outline-none focus:ring-4 focus:ring-brand/20 font-bold appearance-none cursor-pointer"
                    >
                        {reciters.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronRight className="rotate-90" />
                    </div>
                  </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-blue-50 dark:bg-slate-700/50 rounded-2xl border-2 border-blue-100 dark:border-slate-600">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md">
                          <PlayCircle size={24} fill="currentColor" />
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Auto Play</h3>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Continue to next automatically</p>
                      </div>
                  </div>
                  <button 
                      onClick={() => setAutoPlay(!autoPlay)}
                      className={`w-16 h-8 rounded-full p-1 transition-colors relative ${autoPlay ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                      <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${autoPlay ? 'translate-x-8' : 'translate-x-0'}`} />
                  </button>
              </div>
          </div>
      </section>

      {/* Appearance Section */}
      <section className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-lg border-2 border-slate-100 dark:border-slate-700 mb-8 animate-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-500 flex items-center justify-center">
                <PenTool size={24} />
              </div>
              Fun Look
          </h2>
          
          {/* Mode Selector */}
          <div className="mb-8 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-lg">Screen Mode</h3>
              <div className="flex gap-2">
                  <button 
                    onClick={() => setThemeMode('auto')}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all border-2 ${themeMode === 'auto' ? 'bg-white dark:bg-slate-700 border-brand shadow-md text-brand scale-105' : 'bg-white dark:bg-slate-800 border-transparent text-slate-400 hover:bg-slate-100'}`}
                  >
                      <Monitor size={24} /> Auto
                  </button>
                  <button 
                    onClick={() => setThemeMode('light')}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all border-2 ${themeMode === 'light' ? 'bg-white dark:bg-slate-700 border-brand shadow-md text-brand scale-105' : 'bg-white dark:bg-slate-800 border-transparent text-slate-400 hover:bg-slate-100'}`}
                  >
                      <Sun size={24} /> Light
                  </button>
                  <button 
                    onClick={() => setThemeMode('dark')}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all border-2 ${themeMode === 'dark' ? 'bg-white dark:bg-slate-700 border-brand shadow-md text-brand scale-105' : 'bg-white dark:bg-slate-800 border-transparent text-slate-400 hover:bg-slate-100'}`}
                  >
                      <Moon size={24} /> Dark
                  </button>
              </div>
          </div>

          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-lg">Theme Color</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {themes.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id)}
                    className={`
                        relative p-4 rounded-3xl border-4 transition-all flex flex-col items-center gap-3 active:scale-95
                        ${theme === th.id 
                            ? 'border-brand/50 bg-brand-light dark:bg-brand-dark/20 shadow-lg scale-105 ring-2 ring-brand ring-offset-2 dark:ring-offset-slate-800' 
                            : 'border-transparent bg-slate-50 dark:bg-slate-700 hover:bg-slate-100'
                        }
                    `}
                  >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${th.color} transform transition-transform group-hover:rotate-12`}>
                          {th.icon}
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200 text-sm text-center">{th.name}</span>
                  </button>
              ))}
          </div>
      </section>

      {/* Parents Section */}
      <section className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-lg border-2 border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom-2 duration-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 flex items-center justify-center">
                <Shield size={24} />
              </div>
              Grown-ups Only
          </h2>
          <Link 
            to="/parents"
            className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 hover:border-brand hover:bg-brand-light/20 transition-all active:scale-[0.99] group duration-200"
          >
              <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white dark:bg-slate-700 text-slate-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <User size={28} />
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-brand transition-colors">Progress Dashboard</h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">View detailed analytics & progress</p>
                  </div>
              </div>
              <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm">
                <ChevronRight className="text-slate-400 group-hover:text-brand" />
              </div>
          </Link>
      </section>
    </div>
  );
};

export default Settings;
