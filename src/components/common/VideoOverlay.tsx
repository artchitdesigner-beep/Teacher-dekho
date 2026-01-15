import { X } from 'lucide-react';
import { useEffect } from 'react';

interface VideoOverlayProps {
    videoUrl: string;
    onClose: () => void;
}

export default function VideoOverlay({ videoUrl, onClose }: VideoOverlayProps) {
    // Prevent scrolling when overlay is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
                <X size={32} />
            </button>

            {/* Click outside to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />

            {/* Video Container */}
            <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mx-4 animate-in zoom-in-95 duration-300">
                <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}
