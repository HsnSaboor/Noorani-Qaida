import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Trophy, Star, Shield, Flame, Target, Award, User, BookOpen, Play, Edit2, Check, X as XIcon, Camera, Upload, Trash2 } from 'lucide-react';
import { LESSONS } from '../constants';

const StudentProfile: React.FC = () => {
    const { language, progress, updateProfile } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: progress.name || '',
        age: progress.age || 0,
        gender: (progress.gender as 'boy' | 'girl' | 'premium') || 'boy',
        avatarUrl: progress.avatarUrl || ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const presetAvatars = {
        boy: ['/avatars/boy.png', '/avatars/boy2.png'],
        girl: ['/avatars/girl.png', '/avatars/girl2.png'],
        premium: ['/avatars/teacher.png', '/avatars/elder.png']
    };

    const handleEditClick = () => {
        // Detect category from current avatar if possible
        let currentGender: 'boy' | 'girl' | 'premium' = (progress.gender as any) || 'boy';

        // If the current avatar is specifically from a list, force that category
        if (progress.avatarUrl) {
            if (presetAvatars.premium.includes(progress.avatarUrl)) currentGender = 'premium';
            else if (presetAvatars.girl.includes(progress.avatarUrl)) currentGender = 'girl';
            else if (presetAvatars.boy.includes(progress.avatarUrl)) currentGender = 'boy';
        }

        setEditForm({
            name: progress.name || '',
            age: progress.age || 0,
            gender: currentGender,
            avatarUrl: progress.avatarUrl || ''
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        updateProfile(editForm);
        setIsEditing(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setEditForm(prev => ({ ...prev, avatarUrl: base64 }));
        };
        reader.readAsDataURL(file);
    };

    const getCurrentAvatar = () => {
        if (editForm.avatarUrl) return editForm.avatarUrl;
        return editForm.gender === 'girl' ? '/avatars/girl.png' : '/avatars/boy.png';
    };

    const getDisplayAvatar = () => {
        if (isEditing) {
            return editForm.avatarUrl || (editForm.gender === 'girl' ? '/avatars/girl.png' : '/avatars/boy.png');
        }
        return progress.avatarUrl || (progress.gender === 'girl' ? '/avatars/girl.png' : '/avatars/boy.png');
    };

    // Mock leaderboard data (would come from backend in a real app)
    const leaderboard = [
        { id: 1, name: 'Ali', xp: 2500, avatar: '/avatars/boy.png', gender: 'boy' },
        { id: 2, name: 'Sara', xp: 2100, avatar: '/avatars/girl.png', gender: 'girl' },
        { id: 3, name: 'You', xp: progress.xp, avatar: getDisplayAvatar(), isMe: true, gender: progress.gender },
        { id: 4, name: 'Omar', xp: 1200, avatar: '/avatars/boy.png', gender: 'boy' },
    ].sort((a, b) => b.xp - a.xp);

    const activeLesson = progress.lastActiveLessonId
        ? LESSONS.find(l => l.lesson_id === progress.lastActiveLessonId)
        : null;

    return (
        <div className={`max-w-4xl mx-auto p-4 sm:p-6 pb-24 ${language === 'ur' ? 'rtl-text font-urdu' : 'font-sans'}`}>

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-brand to-brand-dark rounded-3xl p-8 text-white mb-8 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg relative group overflow-hidden">
                        <img
                            src={getDisplayAvatar()}
                            alt="Avatar"
                            className="w-full h-full rounded-full bg-slate-100 object-cover"
                        />
                        {isEditing && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera size={24} />
                                <span className="text-[10px] font-bold mt-1">Change</span>
                            </div>
                        )}
                        {!isEditing && (
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-full shadow-lg border-4 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
                                {progress.gender === 'girl' ? '👧' : '👦'}
                            </div>
                        )}
                    </div>

                    {!isEditing ? (
                        <div className="text-center sm:text-left flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                                <h1 className="text-4xl font-black">{progress.name || 'Student'}</h1>
                                {progress.age ? (
                                    <span className="bg-white/20 px-3 py-0.5 rounded-full text-sm font-bold backdrop-blur-md">
                                        {progress.age} Years Old
                                    </span>
                                ) : null}
                                <button
                                    onClick={handleEditClick}
                                    className="ml-auto bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors flex items-center gap-2 text-sm font-bold"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                            </div>
                            <p className="text-brand-light opacity-90 font-black uppercase tracking-widest text-sm">Level: {Math.floor(progress.xp / 500) + 1} Scholar</p>
                            <div className="flex flex-wrap gap-4 mt-6 justify-center sm:justify-start">
                                <div className="bg-white/20 px-5 py-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-md border border-white/10 hover:bg-white/30 transition-colors">
                                    <Star className="text-yellow-300 fill-yellow-300" size={20} />
                                    <span className="font-extrabold text-lg">{progress.xp} XP</span>
                                </div>
                                <div className="bg-white/20 px-5 py-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-md border border-white/10 hover:bg-white/30 transition-colors">
                                    <Flame className="text-orange-300 fill-orange-300" size={20} />
                                    <span className="font-extrabold text-lg">{progress.currentStreak} Day Streak</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 w-full space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase opacity-70">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-brand font-bold"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase opacity-70">Age</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={editForm.age > 10 ? 'custom' : editForm.age || ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val !== 'custom') setEditForm(prev => ({ ...prev, age: parseInt(val) }));
                                            }}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-brand font-bold text-slate-800 dark:text-white [&>option]:text-slate-900"
                                        >
                                            <option value="0" disabled>Select Age</option>
                                            {[4, 5, 6, 7, 8, 9, 10].map(a => <option key={a} value={a}>{a} Years</option>)}
                                            <option value="custom">Custom...</option>
                                        </select>
                                        {(editForm.age > 10 || editForm.age === 0) && (
                                            <input
                                                type="number"
                                                value={editForm.age || ''}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                                                className="w-20 bg-white/10 border border-white/20 rounded-xl px-2 py-2 outline-none focus:ring-2 ring-brand font-bold text-center"
                                                placeholder="#"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase opacity-70">Choose Avatar</label>
                                <div className="flex items-center gap-4 mb-2">
                                    <button
                                        onClick={() => setEditForm(prev => ({ ...prev, gender: 'boy' }))}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${editForm.gender === 'boy' ? 'bg-white text-brand' : 'bg-white/10'}`}
                                    >
                                        Boys
                                    </button>
                                    <button
                                        onClick={() => setEditForm(prev => ({ ...prev, gender: 'girl' }))}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${editForm.gender === 'girl' ? 'bg-white text-brand' : 'bg-white/10'}`}
                                    >
                                        Girls
                                    </button>
                                    <button
                                        onClick={() => setEditForm(prev => ({ ...prev, gender: 'premium' as any }))}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${editForm.gender === 'premium' ? 'bg-white text-brand' : 'bg-white/10'}`}
                                    >
                                        Special
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                                    {presetAvatars[editForm.gender as keyof typeof presetAvatars].map((av, i) => (
                                        <div
                                            key={av}
                                            onClick={() => setEditForm(prev => ({ ...prev, avatarUrl: av }))}
                                            className={`w-14 h-14 rounded-full border-4 transition-all cursor-pointer hover:scale-105 active:scale-95 ${editForm.avatarUrl === av ? 'border-yellow-400 scale-110 shadow-lg' : 'border-transparent'}`}
                                        >
                                            <img src={av} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`w-14 h-14 rounded-full border-4 border-dashed border-white/30 flex flex-col items-center justify-center hover:bg-white/10 transition-colors ${editForm.avatarUrl.startsWith('data:') ? 'border-yellow-400 bg-white/10' : ''}`}
                                    >
                                        <Upload size={18} />
                                        <span className="text-[8px] font-bold mt-0.5">Custom</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    onClick={handleSave}
                                    className="w-full bg-white text-brand hover:bg-yellow-50 font-black py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-3"
                                >
                                    <Check size={20} /> Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl active:scale-95 transition-all text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            </div>

            {/* Active Lesson Card (Bookmark) */}
            {
                activeLesson && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl p-6 mb-8 border-2 border-indigo-100 dark:border-indigo-800 flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold text-lg">
                                {activeLesson.lesson_id}
                            </div>
                            <div>
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Continue Learning</span>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-arabic">{activeLesson.title[language]}</h3>
                            </div>
                        </div>
                        <Link
                            to={`/lesson/${activeLesson.lesson_id}`}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
                        >
                            <Play size={24} fill="currentColor" />
                        </Link>
                    </div>
                )
            }

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Badges Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 animate-in slide-in-from-left-4 duration-500">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Award className="text-yellow-500" /> Badges Collection
                    </h2>
                    {progress.badges.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                            {progress.badges.map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors border border-slate-100 dark:border-slate-600">
                                    <div className="text-4xl mb-2">{badge.icon}</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <p>No badges yet. Keep learning!</p>
                        </div>
                    )}
                </div>

                {/* Leaderboard Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 animate-in slide-in-from-right-4 duration-500">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Trophy className="text-orange-500" /> Leaderboard
                    </h2>
                    <div className="space-y-4">
                        {leaderboard.map((user, idx) => (
                            <div key={user.id} className={`flex items-center justify-between p-3 rounded-xl ${user.isMe ? 'bg-brand-light dark:bg-brand-dark/30 border-brand/20 border' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold w-6 text-center ${idx < 3 ? 'text-orange-500' : 'text-slate-400'}`}>#{idx + 1}</span>
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-slate-100 object-cover" />
                                    <span className={`font-bold ${user.isMe ? 'text-brand-dark dark:text-brand-light' : 'text-slate-700 dark:text-slate-200'}`}>{user.name} {user.isMe && '(You)'}</span>
                                </div>
                                <span className="font-bold text-slate-600 dark:text-slate-400 text-sm">{user.xp} XP</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default StudentProfile;
