
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Home, Trophy, Settings as SettingsIcon, ChevronDown, UserCircle, Zap, Star, Globe } from 'lucide-react';
import { LESSONS, IMG_LOGO } from '../constants';

const Header: React.FC = () => {
  const { language, setLanguage, progress } = useAppContext();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isSettings = location.pathname === '/settings';
  const isProfile = location.pathname === '/profile';
  const isFeatures = location.pathname === '/features';

  // Calculate Overall Progress safely
  const totalLessons = LESSONS ? LESSONS.length : 0;
  const completedLessons = progress?.completedLessons?.length || 0;
  const percentage = totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0;

  // Circle params for desktop progress ring
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Circle params for mobile progress ring
  const mobileRadius = 10;
  const mobileCircumference = 2 * Math.PI * mobileRadius;
  const mobileStrokeDashoffset = mobileCircumference - (percentage / 100) * mobileCircumference;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm border-b-2 border-slate-100 dark:border-slate-800 mb-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform duration-200">
          <div className="flex flex-col justify-center -mt-1 hidden sm:flex">
            <span className="text-[10px] font-black text-brand-light bg-brand px-2 py-0.5 rounded-full uppercase tracking-widest self-start transform -rotate-2">Kids</span>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white font-sans tracking-tight">
              Mualim<span className="text-brand">.app</span>
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">

          {/* Mobile Progress Ring (Visible only on mobile/tablet) */}
          <div className="lg:hidden relative w-8 h-8 flex items-center justify-center mr-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r={mobileRadius} className="text-slate-100 dark:text-slate-700" strokeWidth="3" fill="transparent" stroke="currentColor" />
              <circle cx="12" cy="12" r={mobileRadius} className="text-brand" strokeWidth="3" fill="transparent" stroke="currentColor" strokeDasharray={mobileCircumference} strokeDashoffset={mobileStrokeDashoffset} strokeLinecap="round" />
            </svg>
            <span className="absolute text-[8px] font-black text-slate-600 dark:text-slate-300">{percentage}%</span>
          </div>

          {/* Progress Pill & XP - Playful Style (Hidden on small screens) */}
          <Link to="/profile" className="hidden lg:flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-4 py-2 rounded-full border-2 border-yellow-200 dark:border-yellow-700 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-1 active:scale-95">
            {/* Progress Ring */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                <circle
                  className="text-yellow-200 dark:text-yellow-800"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="16"
                  cy="16"
                />
                <circle
                  className="text-yellow-500"
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="16"
                  cy="16"
                />
              </svg>
            </div>

            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 uppercase">Level {Math.floor(progress.xp / 500) + 1}</span>
              <span className="font-black text-yellow-700 dark:text-yellow-400 text-base">{progress.xp} XP</span>
            </div>
          </Link>

          {/* Streak Pill - Playful Style */}
          <Link to="/profile" className="hidden lg:flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 px-4 py-2 rounded-full border-2 border-orange-200 dark:border-orange-700 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-1 active:scale-95 group">
            <div className="text-xl group-hover:animate-bounce-short">🔥</div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-500 uppercase">Streak</span>
              <span className="font-black text-orange-700 dark:text-orange-400 text-base">{progress.currentStreak} Day</span>
            </div>
          </Link>

          {/* Navigation Bar (Desktop) */}
          <nav className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border-2 border-slate-200 dark:border-slate-700">
            {[
              { to: "/", icon: <Home size={20} strokeWidth={2.5} />, active: isHome },
              { to: "/profile", icon: <UserCircle size={20} strokeWidth={2.5} />, active: isProfile },
              { to: "/features", icon: <Zap size={20} strokeWidth={2.5} />, active: isFeatures },
              { to: "/settings", icon: <SettingsIcon size={20} strokeWidth={2.5} />, active: isSettings }
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className={`
                    p-2.5 sm:p-3 rounded-full transition-all duration-300 ease-out active:scale-90
                    ${item.active
                    ? 'bg-white dark:bg-slate-700 text-brand shadow-md scale-110'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/50'
                  }
                  `}
              >
                {item.icon}
              </Link>
            ))}
          </nav>

          {/* Language Dropdown - Now visible on mobile */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
              <Globe size={16} className="text-indigo-400" />
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="appearance-none bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-bold py-2 pl-8 pr-8 sm:py-2.5 sm:pl-10 sm:pr-10 rounded-full text-xs sm:text-sm hover:bg-indigo-100 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-100 border-2 border-indigo-100 dark:border-slate-700 max-w-[5rem] sm:max-w-none truncate"
            >
              <option value="en">English</option>
              <option value="ur">اردو</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="id">Indonesia</option>
              <option value="hi">हिंदी</option>
              <option value="bn">বাংলা</option>
              <option value="tr">Türkçe</option>
              <option value="ru">Русский</option>
              <option value="zh">中文</option>
              <option value="de">Deutsch</option>
              <option value="ms">Melayu</option>
              <option value="pt">Português</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none group-hover:translate-y-0.5 transition-transform" strokeWidth={3} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
