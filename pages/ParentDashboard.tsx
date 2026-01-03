
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LESSONS, fetchLessonContent } from '../constants';
import { LessonItem } from '../types';
import { ArrowLeft, BookOpen, Star, Calendar, AlertCircle, CheckCircle, Lock, BarChart2, Loader2 } from 'lucide-react';

const ParentDashboard: React.FC = () => {
  const { progress } = useAppContext();
  
  const totalLessons = LESSONS.length;
  const completedCount = progress.completedLessons.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  const [bookmarkedItems, setBookmarkedItems] = useState<(LessonItem & { lessonTitle: string })[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);

  // Identify areas for practice (Bookmarked items)
  useEffect(() => {
    const fetchBookmarks = async () => {
        setLoadingBookmarks(true);
        const resolvedItems: (LessonItem & { lessonTitle: string })[] = [];
        
        const lessonsToFetch = new Set<number>();
        progress.bookmarks.forEach(bid => {
            if (bid.startsWith('l')) {
                const parts = bid.split('_');
                const lid = parseInt(parts[0].substring(1));
                if (!isNaN(lid)) lessonsToFetch.add(lid);
            } else if (bid.startsWith('s')) {
                 // Surahs are mapped starting from Lesson 28 (ID 28 = S1).
                 // Surah IDs are 105-114 except Fatiha (1).
                 // Logic: S1 -> L28. S105 -> L29... S114 -> L38.
                 const parts = bid.split('_');
                 const surahNum = parseInt(parts[0].substring(1));
                 let lid = 0;
                 if (surahNum === 1) lid = 28;
                 else if (surahNum >= 105) lid = 29 + (surahNum - 105);
                 
                 if (lid >= 28 && lid <= 38) lessonsToFetch.add(lid);
            }
            // Mappings updated based on supplementary.ts shift
            else if (bid.startsWith('r_')) lessonsToFetch.add(39); // Ramoz
            else if (bid.startsWith('n_')) lessonsToFetch.add(40); // Namaz
            else if (bid.startsWith('k_')) lessonsToFetch.add(41); // Kalmas
            else if (bid.startsWith('ak_')) lessonsToFetch.add(42); // Ayat Kursi
            else if (bid.startsWith('dq_')) lessonsToFetch.add(43); // Qunoot
            else if (bid.startsWith('d_')) lessonsToFetch.add(44); // Daily Duas
            else if (bid.startsWith('m_')) lessonsToFetch.add(45); // Makhraj
        });

        const lessonIds = Array.from(lessonsToFetch);
        if (lessonIds.length === 0) {
            setLoadingBookmarks(false);
            return;
        }

        try {
            const lessons = await Promise.all(lessonIds.map(id => fetchLessonContent(id)));
            
            progress.bookmarks.forEach(bid => {
                // Find item in loaded lessons
                for (const lesson of lessons) {
                    if (!lesson) continue;
                    const item = lesson.items?.find(i => i.id === bid) || lesson.practice?.find(p => p.id === bid);
                    if (item) {
                        resolvedItems.push({ ...item, lessonTitle: lesson.title.en });
                        break;
                    }
                }
            });
            setBookmarkedItems(resolvedItems);
        } catch (e) {
            console.error("Error loading bookmarks", e);
        } finally {
            setLoadingBookmarks(false);
        }
    };

    if (progress.bookmarks.length > 0) {
        fetchBookmarks();
    } else {
        setLoadingBookmarks(false);
    }
  }, [progress.bookmarks]);

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'intermediate': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'advanced': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 font-sans pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/settings" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors active:scale-95">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Parent Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Completion Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
           <div className="flex items-center gap-3 mb-2 text-slate-500">
              <BookOpen size={20} />
              <span className="font-semibold text-xs uppercase tracking-wider">Course Completion</span>
           </div>
           <div className="text-4xl font-bold text-slate-800 mb-4">{progressPercentage}%</div>
           <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-brand h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
           </div>
           <p className="text-sm text-slate-500 mt-2">{completedCount} of {totalLessons} lessons completed</p>
        </div>

        {/* Rewards Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
           <div className="flex items-center gap-3 mb-2 text-slate-500">
              <Star size={20} />
              <span className="font-semibold text-xs uppercase tracking-wider">Achievements</span>
           </div>
           <div className="text-4xl font-bold text-slate-800 mb-4">{progress.xp} <span className="text-sm text-slate-400 font-normal">XP</span></div>
           <div className="flex gap-2 mt-auto">
               <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100 flex items-center gap-1">
                   <Star size={12} fill="currentColor" /> {progress.badges.length} Badges
               </div>
           </div>
        </div>

        {/* Activity Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
           <div className="flex items-center gap-3 mb-2 text-slate-500">
              <Calendar size={20} />
              <span className="font-semibold text-xs uppercase tracking-wider">Consistency</span>
           </div>
           <div className="text-4xl font-bold text-slate-800 mb-4">{progress.currentStreak} <span className="text-sm text-slate-400 font-normal">Days</span></div>
           <p className="text-sm text-slate-500 mt-2">Longest Streak: {progress.longestStreak} days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Areas for Improvement */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="text-orange-500" size={20} />
                  <span>Bookmarks & Review</span>
              </h2>
              
              {loadingBookmarks ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" /></div>
              ) : bookmarkedItems.length > 0 ? (
                  <div className="space-y-3">
                      {bookmarkedItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <div>
                                  <div className="font-arabic font-bold text-xl text-slate-800">{item.text_ar}</div>
                                  <div className="text-xs text-slate-500">{item.lessonTitle}</div>
                              </div>
                              <Link to={`/lesson/${item.id.split('_')[0].replace('l','')}`} className="text-xs font-bold text-brand hover:underline">
                                  Review
                              </Link>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-10 text-slate-400">
                      <CheckCircle className="mx-auto mb-2 text-green-400" size={32} />
                      <p>No items marked for review yet.</p>
                  </div>
              )}
          </div>

          {/* Lesson Status List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart2 className="text-blue-500" size={20} />
                  <span>Lesson Progress</span>
              </h2>
              <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
                  {LESSONS.map((lesson) => {
                      const isCompleted = progress.completedLessons.includes(lesson.lesson_id);
                      return (
                          <div key={lesson.lesson_id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                              <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                      {isCompleted ? <CheckCircle size={14} /> : lesson.lesson_id}
                                  </div>
                                  <div>
                                      <div className="text-sm font-bold text-slate-700">{lesson.title.en}</div>
                                      <div className="text-[10px] text-slate-400">{lesson.meta.estimated_minutes} min • {lesson.meta.difficulty}</div>
                                  </div>
                              </div>
                              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isCompleted ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                                  {isCompleted ? 'Done' : 'ToDo'}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
