
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Mic, Star, Zap, Crown, Smartphone, Globe, Headphones, Users, Video, Book } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Features: React.FC = () => {
    const { language } = useAppContext();

    const comparisonData = [
        { feature: 'Interactive Audio', us: true, others: false, icon: <Headphones size={16} /> },
        { feature: 'Voice Analysis (AI)', us: true, others: false, icon: <Mic size={16} /> },
        { feature: 'Gamified Progress (XP)', us: true, others: false, icon: <Star size={16} /> },
        { feature: 'Makhraj Visuals', us: true, others: true, icon: <Video size={16} /> },
        { feature: 'Surah Audio Sync', us: true, others: false, icon: <Zap size={16} /> },
        { feature: 'Smart Revision', us: true, others: false, icon: <Book size={16} /> },
        { feature: 'No Ads / Clean UI', us: true, others: false, icon: <Crown size={16} /> },
    ];

    const roadmap = [
        { title: 'AI Hifz Companion', desc: 'Recite full Surahs and get instant corrections on mistakes.', icon: <Mic className="text-purple-500" size={32} /> },
        { title: 'Multiplayer Racing', desc: 'Challenge friends to a Tajweed quiz battle in real-time.', icon: <Users className="text-orange-500" size={32} /> },
        { title: 'AR Makhraj Guide', desc: 'Use your camera to see correct tongue placement on your face.', icon: <Smartphone className="text-blue-500" size={32} /> },
        { title: 'Teacher Dashboard', desc: 'Allow teachers to track student progress remotely.', icon: <Globe className="text-emerald-500" size={32} /> },
    ];

    return (
        <div className={`max-w-4xl mx-auto p-4 sm:p-6 pb-24 ${language === 'ur' ? 'rtl-text font-urdu' : 'font-sans'}`}>
            <div className="flex items-center gap-4 mb-8">
                <Link to="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Why Mualim?</h1>
            </div>

            {/* Comparison Table */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 mb-12 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand to-cyan-400"></div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center">Comparison Chart</h2>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700">
                                <th className="py-4 pl-4 font-bold text-slate-500 dark:text-slate-400">Feature</th>
                                <th className="py-4 text-center font-bold text-brand text-lg">Mualim App</th>
                                <th className="py-4 text-center font-bold text-slate-400 text-sm">Others (PDF/Static)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((item, idx) => (
                                <tr key={idx} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="py-4 pl-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <span className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-500 dark:text-slate-400">{item.icon}</span>
                                        {item.feature}
                                    </td>
                                    <td className="py-4 text-center">
                                        <div className="flex justify-center">
                                            {item.us ? <CheckCircle className="text-green-500 fill-green-100 dark:fill-green-900" size={24} /> : <XCircle className="text-red-400" size={24} />}
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <div className="flex justify-center opacity-50">
                                            {item.others ? <CheckCircle className="text-slate-400" size={20} /> : <XCircle className="text-slate-300" size={20} />}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Unique Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-gradient-to-br from-brand to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <Mic size={48} className="mb-4 text-white/90" />
                        <h3 className="text-2xl font-bold mb-2">Voice AI Technology</h3>
                        <p className="text-blue-100 leading-relaxed">Unlike standard apps that just play audio, Mualim listens to you. Our advanced algorithms analyze your pronunciation against native Arabic speakers to give instant feedback.</p>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <Crown size={48} className="mb-4 text-yellow-500" />
                        <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Gamified Learning</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">We turned the Noorani Qaida into a game. Earn XP, unlock badges, and maintain streaks. This keeps children engaged and motivated to return every day.</p>
                    </div>
                </div>
            </div>

            {/* Roadmap */}
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Zap className="text-yellow-500" /> Coming Soon
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roadmap.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-brand/30 transition-all">
                        <div className="mb-4 bg-white dark:bg-slate-700 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                            {item.icon}
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;
