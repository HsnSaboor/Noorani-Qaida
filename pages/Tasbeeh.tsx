import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, RotateCcw, Plus } from 'lucide-react';

const Tasbeeh: React.FC = () => {
  const { language } = useAppContext();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);

  const increment = () => {
      setCount(prev => prev + 1);
      // Vibrate if supported for feedback
      if (navigator.vibrate) navigator.vibrate(20);
  };

  const reset = () => {
      if(window.confirm("Reset counter?")) {
        setCount(0);
      }
  };

  return (
    <div className={`max-w-md mx-auto p-4 min-h-[80vh] flex flex-col ${language === 'ur' ? 'rtl-text font-urdu' : 'font-sans'}`}>
       <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/settings"
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Tasbeeh</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center gap-8">
          
          {/* Display */}
          <div className="bg-white border-4 border-slate-100 rounded-full w-64 h-64 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
              <div className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-2">Count</div>
              <div className="text-7xl font-bold text-slate-800 font-mono">{count}</div>
              
              <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-100">
                   <div className="bg-brand h-full transition-all duration-300" style={{ width: `${(count % target) / target * 100}%` }}></div>
              </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 w-full px-8">
              <button 
                onClick={increment}
                className="bg-brand hover:bg-brand-dark active:scale-95 transition-all text-white rounded-2xl py-8 shadow-lg flex items-center justify-center"
              >
                  <Plus size={48} />
              </button>
              
              <div className="flex gap-4">
                  <button 
                    onClick={reset}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl py-4 font-bold flex items-center justify-center gap-2"
                  >
                      <RotateCcw size={20} /> Reset
                  </button>
                  <div className="flex-1 flex items-center justify-center gap-2 bg-slate-50 rounded-xl text-slate-500 font-mono text-sm border border-slate-200">
                      Target: {target}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Tasbeeh;