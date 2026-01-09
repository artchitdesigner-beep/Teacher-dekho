import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Layers, Plus } from 'lucide-react';
import GridBackground from '@/components/landing/GridBackground';

export default function LearningIntentHero() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/student/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl shadow-cyan-200 dark:shadow-none relative overflow-hidden text-center">
            {/* Grid Background */}
            <div className="absolute inset-0">
                <GridBackground
                    lineColor={[255, 255, 255]}
                    dotColor={[255, 255, 255]}
                    blockColor={[255, 255, 255]}
                    maxOpacity={0.15}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight drop-shadow-md">
                    What do you want to learn today?
                </h1>

                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for Python, Math, Piano..."
                        className="w-full pl-8 pr-16 py-4 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 shadow-xl text-lg font-medium"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-700 text-white rounded-xl flex items-center justify-center hover:bg-cyan-800 transition-colors shadow-lg"
                    >
                        <Search size={24} />
                    </button>
                </form>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/student/search')}
                        className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-medium transition-all border border-white/10 hover:scale-105 shadow-lg shadow-cyan-900/20"
                    >
                        <Users size={20} />
                        Find a Tutor
                    </button>
                    <button
                        onClick={() => navigate('/student/batches')}
                        className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-medium transition-all border border-white/10 hover:scale-105 shadow-lg shadow-cyan-900/20"
                    >
                        <Layers size={20} />
                        Explore Batches
                    </button>
                    <button
                        onClick={() => navigate('/student/requests?action=new')}
                        className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-medium transition-all border border-white/10 hover:scale-105 shadow-lg shadow-cyan-900/20"
                    >
                        <Plus size={20} />
                        Post a Request
                    </button>
                </div>
            </div>

            {/* Decorative Elements (Subtle Glows) */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        </div>
    );
}
