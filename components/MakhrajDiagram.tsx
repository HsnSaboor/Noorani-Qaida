import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface MakhrajDiagramProps {
    highlightRegion?: string;
    letter?: string; // New prop to identify specific image
    size?: number;
    className?: string;
}

const MakhrajDiagram: React.FC<MakhrajDiagramProps> = ({
    highlightRegion,
    letter = '',
    size = 140,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Determine image source based on letter and region logic
    const getImageSource = () => {
        const l = letter.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, ''); // Clean tashkeel

        // Specific image mapping
        if (['ا', 'و', 'ي'].includes(l)) return '/makhraj_jauf_alif_waw_ya.webp';

        if (['ء', 'ه'].includes(l)) return '/makhraj_deep_throat_hamza_ha.webp';
        if (['ع', 'ح'].includes(l)) return '/makhraj_throat_ain_ha.webp';
        if (['غ', 'خ'].includes(l)) return '/makhraj_upper_throat_ghain_kha.webp';

        if (['ق'].includes(l)) return '/makhraj_tongue_back_qaf_soft.webp';
        if (['ك'].includes(l)) return '/makhraj_tongue_back_kaaf_hard.webp';
        if (['ج', 'ش', 'ي'].includes(l) && highlightRegion?.includes('tongue-middle')) return '/makhraj_tongue_middle_jeem_sheen_ya.webp';

        if (['ض'].includes(l)) return '/makhraj_tongue_side_daad.webp';

        if (['ل'].includes(l)) return '/makhraj_tongue_tip_laam.webp';
        if (['ن'].includes(l)) return '/makhraj_tongue_tip_noon.webp';
        if (['ر'].includes(l)) return '/makhraj_tongue_tip_ra.webp';

        if (['ط', 'د', 'ت'].includes(l)) return '/makhraj_tongue_tip_upper_teeth_ta_daal_tha.webp';
        if (['ظ', 'ذ', 'ث'].includes(l)) return '/makhraj_tongue_tip_teeth_edge_za_dhal_tha.webp';
        if (['ص', 'ز', 'س'].includes(l)) return '/makhraj_whistle_seen_suwad_zae.webp';

        if (['ف'].includes(l)) return '/makhraj_lips_faa.webp';
        if (['ب', 'm', 'م', 'و'].includes(l) && highlightRegion?.includes('lips')) return '/makhraj_lips_ba_meem_waw.webp';

        if (highlightRegion === 'nasal') return '/makhraj_nasal_nun_meem.webp';

        // Fallback or default
        return '/makhraj_tongue_tip_laam.webp'; // Safe default
    };

    const imgSrc = getImageSource();

    return (
        <>
            {/* Thumbnail View */}
            <div
                className={`relative group cursor-zoom-in overflow-hidden rounded-xl ${className}`}
                style={{ width: size, height: size }}
                onClick={() => setIsOpen(true)}
            >
                {/* Image with hover zoom */}
                <img
                    src={imgSrc}
                    alt={`Makhraj for ${letter}`}
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                    style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                    }}
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                    <ZoomIn className="text-black/50 w-6 h-6" />
                </div>
            </div>

            {/* Lightbox Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-8"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                    >
                        <X size={24} />
                    </button>

                    {/* Content Container - shifted up slightly (mb-10) for better optical centering */}
                    <div
                        className="relative max-w-5xl w-full flex flex-col items-center justify-center mb-32 sm:mb-48"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={imgSrc}
                            alt={`Makhraj for ${letter} (Zoomed)`}
                            className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        />
                        <p className="mt-4 text-white/50 text-sm font-medium animate-in slide-in-from-top-2 delay-100">
                            Tap anywhere to close
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default MakhrajDiagram;
