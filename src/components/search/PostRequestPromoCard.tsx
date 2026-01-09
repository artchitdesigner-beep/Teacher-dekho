import { MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PostRequestPromoCard() {
    const navigate = useNavigate();

    return (
        <div className="bg-cyan-50 dark:bg-cyan-900/10 rounded-2xl border-2 border-dashed border-cyan-200 dark:border-cyan-800 p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px] hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors group">
            <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Can't find what you're looking for?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
                Post a specific requirement and let the perfect teacher contact you directly.
            </p>
            <button
                onClick={() => navigate('/student/requests?action=new')}
                className="px-6 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-200 dark:shadow-none"
            >
                Post a Requirement <ArrowRight size={18} />
            </button>
        </div>
    );
}
