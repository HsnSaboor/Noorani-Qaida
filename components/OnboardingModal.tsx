
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Baby, Star, ArrowRight, Check } from 'lucide-react';

const OnboardingModal: React.FC = () => {
    const { progress, updateProfile } = useAppContext();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState<'boy' | 'girl' | null>(null);

    if (progress.onboardingCompleted) return null;

    const handleComplete = () => {
        if (name && age && gender) {
            updateProfile({ name, age: Number(age), gender });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border-4 border-brand-light dark:border-brand-dark animate-in zoom-in duration-300">

                {/* Header */}
                <div className="bg-brand p-8 text-center text-white relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-4 left-4 text-4xl leading-none">✨</div>
                        <div className="absolute bottom-4 right-4 text-4xl leading-none">🌟</div>
                    </div>
                    <h2 className="text-3xl font-black mb-1">Welcome! Explorer</h2>
                    <p className="opacity-90 font-bold">Let's set up your profile</p>

                    {/* Progress Indicator */}
                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="p-8">
                    {step === 1 && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-brand/10 w-20 h-20 rounded-3xl flex items-center justify-center text-brand mb-6 mx-auto">
                                <User size={40} strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-6">What is your name?</h3>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Type your name here..."
                                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-lg font-bold text-center focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all"
                                autoFocus
                            />
                            <button
                                disabled={!name.trim()}
                                onClick={() => setStep(2)}
                                className="w-full mt-6 bg-brand text-white py-4 rounded-2xl font-black shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
                            >
                                Next <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-amber-100 w-20 h-20 rounded-3xl flex items-center justify-center text-amber-600 mb-6 mx-auto">
                                <Baby size={40} strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-6">How old are you?</h3>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                placeholder="Enter your age..."
                                min="1"
                                max="100"
                                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-lg font-bold text-center focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all no-spinner"
                                autoFocus
                            />
                            <button
                                disabled={!age || Number(age) < 1}
                                onClick={() => setStep(3)}
                                className="w-full mt-6 bg-brand text-white py-4 rounded-2xl font-black shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
                            >
                                Next <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="w-full mt-6 py-2 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-purple-100 w-20 h-20 rounded-3xl flex items-center justify-center text-purple-600 mb-6 mx-auto">
                                <Star size={40} strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-6">Are you a boy or a girl?</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setGender('boy')}
                                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-4 transition-all ${gender === 'boy' ? 'border-brand bg-brand/5 scale-105 shadow-xl' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 opacity-60'}`}
                                >
                                    <span className="text-5xl">👦</span>
                                    <span className="font-black text-slate-800 dark:text-white">BOY</span>
                                    {gender === 'boy' && <Check className="text-brand" />}
                                </button>
                                <button
                                    onClick={() => setGender('girl')}
                                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-4 transition-all ${gender === 'girl' ? 'border-pink-500 bg-pink-50 scale-105 shadow-xl' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 opacity-60'}`}
                                >
                                    <span className="text-5xl">👧</span>
                                    <span className="font-black text-slate-800 dark:text-white">GIRL</span>
                                    {gender === 'girl' && <Check className="text-pink-500" />}
                                </button>
                            </div>

                            <button
                                disabled={!gender}
                                onClick={handleComplete}
                                className="w-full mt-8 bg-gradient-to-r from-brand to-emerald-500 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                            >
                                Let's Start! ✨
                            </button>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full mt-4 py-2 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
