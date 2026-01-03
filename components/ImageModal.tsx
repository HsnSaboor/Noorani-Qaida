import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    altText?: string;
    title?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageSrc, altText = 'Image', title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col items-center animate-in zoom-in-95 duration-200">
                <div className="absolute top-2 right-2 z-20">
                    <button
                        onClick={onClose}
                        className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                {title && (
                    <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-lg mb-4 text-slate-800 dark:text-white font-bold text-lg animate-in slide-in-from-top-4">
                        {title}
                    </div>
                )}

                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <img
                        src={imageSrc}
                        alt={altText}
                        className="w-full h-full object-contain max-h-[85vh] bg-white"
                    />
                </div>

                <p className="mt-4 text-white/80 text-sm font-medium flex items-center gap-2">
                    <ZoomIn size={16} /> Tap anywhere outside to close
                </p>
            </div>
        </div>
    );
};

export default ImageModal;