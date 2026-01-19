import { useState } from 'react';
import { Search, TrendingUp, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ServiceCards from '@/components/landing/ServiceCards';
import BannerCarousel from '@/components/landing/BannerCarousel';
import FeaturedBatches from '@/components/landing/FeaturedBatches';
import DownloadAppSection from '@/components/landing/DownloadAppSection';

// Icons
import PhysicsIcon from '@/assets/icons for landing page/physics.webp';
import MathIcon from '@/assets/icons for landing page/mathematics.webp';
import ChemistryIcon from '@/assets/icons for landing page/Chemistry.webp';
import BiologyIcon from '@/assets/icons for landing page/Biology.webp';
import EnglishIcon from '@/assets/icons for landing page/English.webp';
import CSIcon from '@/assets/icons for landing page/Computer Science.webp';

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = [
        { text: 'Physics for Class 12', type: 'Batch' },
        { text: 'Alok Sir', type: 'Teacher' },
        { text: 'Mathematics Crash Course', type: 'Batch' },
        { text: 'Organic Chemistry', type: 'Subject' },
    ];

    const subjects = [
        { name: 'Physics', icon: PhysicsIcon },
        { name: 'Mathematics', icon: MathIcon },
        { name: 'Chemistry', icon: ChemistryIcon },
        { name: 'Biology', icon: BiologyIcon },
        { name: 'English', icon: EnglishIcon },
        { name: 'Computer Science', icon: CSIcon },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Top Search Bar (Inline) */}
            <div className="relative max-w-3xl mx-auto z-20">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search for teachers, batches, or subjects..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-lg font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setShowSuggestions(false);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={18} />
                        </button>
                    )}
                </form>

                {/* Inline Suggestions Dropdown */}
                {showSuggestions && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-20">
                            <div className="p-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Suggestions</h3>
                                {suggestions.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            navigate(`/search?q=${encodeURIComponent(item.text)}`);
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg group transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-600 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20 transition-colors">
                                                <TrendingUp size={16} />
                                            </div>
                                            <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-cyan-700 dark:group-hover:text-cyan-400">
                                                {item.text}
                                            </span>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                                            {item.type}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Service Cards */}
            <ServiceCards />

            {/* Banner Carousel */}
            <BannerCarousel />

            {/* Popular Subjects */}
            <section className="mb-12">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Popular Subjects</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Find expert guidance in top subjects.</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {subjects.map(subject => (
                        <Link key={subject.name} to={`/search?subject=${subject.name}`} className="flex flex-col items-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-lg transition-all group">
                            <div className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform">
                                <img src={subject.icon} alt={subject.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="font-bold text-slate-700 dark:text-slate-300 text-sm text-center">{subject.name}</div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Batches */}
            <FeaturedBatches />

            {/* Message Banner */}
            <section className="mb-16">
                <div className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Read top articles from education experts</h2>
                        <p className="text-cyan-100 mb-8 text-lg">Stay updated with the latest exam patterns and study tips.</p>
                        <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-colors">
                            Read Articles
                        </button>
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Download App Section */}
            <DownloadAppSection />
        </div>
    );
}
