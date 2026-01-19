import AppBanner from '@/assets/3d-icons/app-banner.png';
import { Apple, Play } from 'lucide-react';

export default function DownloadAppSection() {
    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl my-12 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-sm font-bold mb-6">
                        Mobile App
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                        Learning is better on the <span className="text-cyan-600">TeacherDekho App</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                        Get unlimited access to structured courses, live doubt solving, and personalized mentorship. Download the app now and start learning anytime, anywhere.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="flex items-center gap-3 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            <Apple size={24} />
                            <div className="text-left">
                                <div className="text-[10px] uppercase font-bold opacity-80">Download on the</div>
                                <div className="text-sm font-bold leading-none">App Store</div>
                            </div>
                        </button>
                        <button className="flex items-center gap-3 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            <Play size={24} fill="currentColor" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase font-bold opacity-80">Get it on</div>
                                <div className="text-sm font-bold leading-none">Google Play</div>
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800"></div>
                            ))}
                        </div>
                        <p>Trusted by 50k+ students</p>
                    </div>
                </div>

                <div className="relative flex justify-center md:justify-end">
                    <div className="relative w-full max-w-md aspect-square">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full"></div>
                        <img
                            src={AppBanner}
                            alt="TeacherDekho App"
                            className="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-700"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
