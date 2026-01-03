
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { TEXTS, LESSONS } from '../constants';
import { BarChart, Clock, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { language, progress } = useAppContext();
  const t = TEXTS;

  const totalLessons = LESSONS.length;
  const completedCount = progress.completedLessons.length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className={`max-w-4xl mx-auto p-4 sm:p-6 pb-24 ${language === 'ur' ? 'rtl-text font-urdu' : 'font-sans'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">{t.dashboard[language] || t.dashboard['en']}</h1>
        <Link to="/" className="text-sm text-brand font-bold hover:underline hover:text-brand-dark dark:hover:text-brand-light transition-colors">{t.home[language] || t.home['en']}</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-full mb-3 shadow-inner"><BarChart size={24} /></div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wide">Progress</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{percentage}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400 rounded-full mb-3 shadow-inner"><Award size={24} /></div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wide">{t.stars[language] || 'Stars'}</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{progress.stars}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 rounded-full mb-3 shadow-inner"><Clock size={24} /></div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wide">Last Practice</h3>
          <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">{progress.lastPracticeDate ? new Date(progress.lastPracticeDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 animate-in fade-in slide-in-from-bottom-2">Lesson Breakdown</h2>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        {LESSONS.map((lesson) => {
          const isCompleted = progress.completedLessons.includes(lesson.lesson_id);
          const title = lesson.title ? (lesson.title[language] || lesson.title['en']) : `Lesson ${lesson.lesson_id}`;
          const desc = lesson.description ? (lesson.description[language] || lesson.description['en']) : '';
          
          return (
            <div key={lesson.lesson_id} className="p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
              <div className="flex items-center gap-4">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>{lesson.lesson_id}</div>
                 <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{desc}</p>
                 </div>
              </div>
              <div>{isCompleted && <CheckCircle className="text-green-500 dark:text-green-400 animate-in zoom-in" size={20} />}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
