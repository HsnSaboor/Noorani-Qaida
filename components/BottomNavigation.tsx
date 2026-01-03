
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Gamepad2, Settings } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Don't show bottom nav on lesson pages (they have their own controls)
  if (currentPath.startsWith('/lesson/')) return null;

  const tabs = [
    { name: 'Home', path: '/dashboard', icon: <Home size={24} />, active: currentPath === '/dashboard' },
    { name: 'Lessons', path: '/', icon: <BookOpen size={24} />, active: currentPath === '/' },
    { name: 'Practice', path: '/practice', icon: <Gamepad2 size={24} />, active: currentPath === '/practice' },
    { name: 'Settings', path: '/settings', icon: <Settings size={24} />, active: currentPath === '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 z-50 lg:hidden backdrop-blur-md shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = tab.active;
          const activeClass = isActive 
            ? 'text-brand dark:text-brand-light transform -translate-y-1' 
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300';
          
          return (
            <Link 
                key={tab.name} 
                to={tab.path} 
                className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 active:scale-90 group ${activeClass}`}
            >
              <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-brand/10 dark:bg-brand/20' : ''}`}>
                  {tab.icon}
              </div>
              <span className={`text-[10px] font-bold mt-1 transition-colors duration-300 ${isActive ? 'text-brand dark:text-brand-light' : 'text-slate-400'}`}>
                  {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
