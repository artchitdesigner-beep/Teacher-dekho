import { MessageCircleQuestion, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CounsellingPromoCard() {
    return (
        <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-purple-100 flex items-center justify-center mb-4 text-purple-600">
                    <MessageCircleQuestion size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Confused about your career?</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    Book a 1-on-1 counselling session with our expert mentors to find your path.
                </p>
            </div>

            <div className="relative z-10">
                <Link
                    to="/student/counselling"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                    Book Counselling <ArrowRight size={14} />
                </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-200/30 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            {/* Image Placeholder from screenshot */}
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-white rounded-2xl border border-purple-100 shadow-sm flex items-center justify-center opacity-80">
                <div className="text-purple-200">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                </div>
            </div>
        </div>
    );
}
