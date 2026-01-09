import { MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PostRequestBanner() {
    const navigate = useNavigate();

    return (
        <div className="bg-cyan-700 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-cyan-200 dark:shadow-none mb-8 relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-1">Can't find the perfect teacher?</h3>
                    <p className="text-cyan-100 text-sm md:text-base">Post your specific requirements and let top tutors contact you.</p>
                </div>
            </div>

            <button
                onClick={() => navigate('/student/requests?action=new')}
                className="relative z-10 px-6 py-3 bg-white text-cyan-700 font-bold rounded-xl hover:bg-cyan-50 transition-colors flex items-center gap-2 shadow-lg whitespace-nowrap"
            >
                Post a Request <ArrowRight size={18} />
            </button>

            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-cyan-500/50 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
}
