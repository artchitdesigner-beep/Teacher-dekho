import { useState } from 'react';
import { MonitorPlay, Camera, Mic, Speaker, Cpu, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function TeacherExpenses() {
    const [hasApplied, setHasApplied] = useState(false);

    const studioItems = [
        { id: 1, name: 'Interactive V-Panel', icon: MonitorPlay, desc: '75" 4K Touch Display for immersive teaching', price: '₹1,50,000' },
        { id: 2, name: '4K PTZ Camera', icon: Camera, desc: 'Ultra-HD camera with auto-tracking', price: '₹45,000' },
        { id: 3, name: 'Professional Mic', icon: Mic, desc: 'Studio-grade condenser microphone', price: '₹12,000' },
        { id: 4, name: 'Audio Monitor', icon: Speaker, desc: 'High-fidelity clamp-on speakers', price: '₹8,500' },
        { id: 5, name: 'Workstation PC', icon: Cpu, desc: 'i9 Processor, 32GB RAM, RTX 4060', price: '₹1,20,000' },
        { id: 6, name: 'Studio Lighting', icon: Lightbulb, desc: 'Softbox kit with color temp control', price: '₹15,000' }
    ];

    const handleApply = () => {
        // In a real app, this would send a request to the backend
        setHasApplied(true);
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Expenses & Assets</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your company-provided assets and expense claims.</p>
            </div>

            {/* Studio Setup Application Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Upgrade to Professional Studio</h2>
                            <p className="text-slate-300 max-w-xl">
                                Teacher Dekho provides a complete studio setup to top-rated educators.
                                Apply now to get the full hardware kit delivered to your home.
                            </p>
                        </div>
                        {hasApplied ? (
                            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-3 rounded-xl flex items-center gap-3 font-bold">
                                <CheckCircle2 size={24} />
                                Application Pending
                            </div>
                        ) : (
                            <button
                                onClick={handleApply}
                                className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 active:scale-95"
                            >
                                Apply for Setup
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {studioItems.map((item) => (
                            <div key={item.id} className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/15 transition-colors">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <item.icon size={24} className="text-cyan-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-xs text-slate-300 mb-1">{item.desc}</p>
                                    <div className="text-sm font-bold text-cyan-300">{item.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Placeholder for future Expenses List */}
            <div className="mt-12 opacity-50 pointer-events-none filter grayscale">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Expenses</h2>
                    <button className="text-sm font-bold text-cyan-700">View All</button>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400">
                    No expense claims found.
                </div>
            </div>
        </div>
    );
}
