import { useState, useEffect } from 'react';
import { Search, TrendingUp, X, ImageIcon, PlayCircle, Play, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ServiceCards from '@/components/landing/ServiceCards';
import BannerCarousel from '@/components/landing/BannerCarousel';
import FeaturedBatches from '@/components/landing/FeaturedBatches';
import DownloadAppSection from '@/components/landing/DownloadAppSection';
import TeacherCard from '@/components/booking/TeacherCard';
import { Button } from '@/components/ui/button';

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
    const [topTeachers, setTopTeachers] = useState<any[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(true);

    useEffect(() => {
        const fetchTopTeachers = async () => {
            try {
                const q = query(
                    collection(db, 'users'),
                    where('role', '==', 'teacher'),
                    limit(4)
                );
                const snap = await getDocs(q);
                const teachers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort client-side to handle missing rating
                const sortedTeachers = teachers.sort((a: any, b: any) => {
                    const ratingA = a.rating || 0;
                    const ratingB = b.rating || 0;
                    return ratingB - ratingA;
                }).slice(0, 4);

                setTopTeachers(sortedTeachers);
            } catch (error) {
                console.error('Error fetching top teachers:', error);
            } finally {
                setLoadingTeachers(false);
            }
        };
        fetchTopTeachers();
    }, []);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = [
        { text: 'Physics for Class 12', type: 'Batch' },
        { text: 'Alok Sir', type: 'Teacher' },
        { text: 'Mathematics Crash Course', type: 'Batch' },
        { text: 'Organic Chemistry', type: 'Subject' },
    ];


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
        }
    };

    return (
        <div className="pb-10">
            {/* 1. Full-Width Banner Section (First Section) */}
            <div className="w-full">
                <BannerCarousel />
            </div>

            {/* 2. Attractive Header Section (Search + Action Cards) */}
            <section className="relative py-16 overflow-hidden">
                {/* Background Design Elements */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 -z-10" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100/30 dark:bg-cyan-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    {/* Integrated Search Bar */}
                    <div className="relative max-w-3xl mx-auto z-20 mb-16">
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="absolute inset-0 bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500 -z-10 rounded-full" />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-600 dark:text-cyan-400" size={24} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="What do you want to learn today?"
                                className="w-full pl-14 pr-6 py-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 outline-none text-xl font-medium placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-500/10 shadow-2xl transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setShowSuggestions(false);
                                    }}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </form>

                        {/* Inline Suggestions Dropdown */}
                        {showSuggestions && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
                                <div className="absolute top-full left-0 right-0 mt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 z-20">
                                    <div className="p-3">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-3">Quick Results</h3>
                                        {suggestions.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    navigate(`/search?q=${encodeURIComponent(item.text)}`);
                                                    setShowSuggestions(false);
                                                }}
                                                className="w-full flex items-center justify-between p-4 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-xl group transition-all text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-600 group-hover:bg-cyan-100/50 dark:group-hover:bg-cyan-900/40 transition-all">
                                                        <TrendingUp size={18} />
                                                    </div>
                                                    <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-cyan-700 dark:group-hover:text-cyan-400">
                                                        {item.text}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-tighter">
                                                    {item.type}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action Cards (ServiceCards) */}
                    <div className="relative z-10">
                        <ServiceCards />
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-32">
                {/* Popular Teachers for You - Moved Up */}
                <section>
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Star size={28} className="text-amber-500" />
                                Top Rated <span className="text-cyan-600">Teachers</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-base mt-2 font-medium tracking-tight">Highly recommended mentors in your subjects.</p>
                        </div>
                        <Button variant="link" asChild className="text-cyan-700 font-bold text-sm p-0 h-auto">
                            <Link to="/search?tab=teachers">View All Teachers</Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loadingTeachers ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="h-[300px] bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800" />
                            ))
                        ) : (
                            topTeachers.map(teacher => (
                                <TeacherCard
                                    key={teacher.id}
                                    teacher={teacher}
                                    layout="vertical"
                                    onBook={() => { }}
                                    onSave={() => { }}
                                />
                            ))
                        )}
                        {!loadingTeachers && topTeachers.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-slate-500 font-medium tracking-tight">No top rated teachers found at the moment.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Featured Batches */}
                <FeaturedBatches />

                {/* Popular Subjects */}
                <section>
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                Explore <span className="text-cyan-600">Subjects</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-base mt-1.5 font-medium">Dive into our specialized learning paths.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { name: 'Physics', icon: PhysicsIcon, color: 'bg-indigo-50 border-indigo-100/50 text-indigo-700', glow: 'bg-indigo-400/20' },
                            { name: 'Mathematics', icon: MathIcon, color: 'bg-blue-50 border-blue-100/50 text-blue-700', glow: 'bg-blue-400/20' },
                            { name: 'Chemistry', icon: ChemistryIcon, color: 'bg-emerald-50 border-emerald-100/50 text-emerald-700', glow: 'bg-emerald-400/20' },
                            { name: 'Biology', icon: BiologyIcon, color: 'bg-rose-50 border-rose-100/50 text-rose-700', glow: 'bg-rose-400/20' },
                            { name: 'English', icon: EnglishIcon, color: 'bg-amber-50 border-amber-100/50 text-amber-700', glow: 'bg-amber-400/20' },
                            { name: 'Computer Sc.', icon: CSIcon, color: 'bg-cyan-50 border-cyan-100/50 text-cyan-700', glow: 'bg-cyan-400/20' },
                        ].map(subject => (
                            <Link
                                key={subject.name}
                                to={`/search?subject=${subject.name}`}
                                className={`group relative flex flex-col items-center p-8 ${subject.color} rounded-[2.5rem] border hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden shadow-sm`}
                            >
                                <div className={`absolute -top-10 -right-10 w-24 h-24 ${subject.glow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                                <div className={`absolute -bottom-10 -left-10 w-20 h-20 ${subject.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                <div className="relative z-10 w-16 h-16 mb-5 group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-lg">
                                    <img src={subject.icon} alt={subject.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="relative z-10 font-black text-sm tracking-tight text-center uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                                    {subject.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Image Gallery */}
                <section>
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
                                <ImageIcon size={24} className="text-cyan-600" />
                                Campus Gallery
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Glimpses of our vibrant learning community.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            'https://images.unsplash.com/photo-1523050335258-006277f3945a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        ].map((img, idx) => (
                            <div key={idx} className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden relative group cursor-pointer shadow-md">
                                <img
                                    src={img}
                                    alt="Gallery"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-bold border border-white px-4 py-2 rounded-lg backdrop-blur-sm">View</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Educational Videos */}
                <section>
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
                                <PlayCircle size={24} className="text-red-600" />
                                Free Learning Resources
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Watch curated video lessons from top mentors.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Calculus Fundamentals', duration: '45:20', views: '1.2k', thumb: 'https://img.youtube.com/vi/WuRT9M9YJ9Q/maxresdefault.jpg' },
                            { title: 'Organic Chemistry Basics', duration: '32:15', views: '850', thumb: 'https://img.youtube.com/vi/PpkE9zFjV5A/maxresdefault.jpg' },
                            { title: 'Physics: Laws of Motion', duration: '55:00', views: '2.5k', thumb: 'https://img.youtube.com/vi/kKKM8Y-u7ds/maxresdefault.jpg' }
                        ].map((video, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all group cursor-pointer">
                                <div className="aspect-video relative">
                                    <img src={video.thumb} alt={video.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 text-white group-hover:scale-110 transition-transform">
                                            <Play size={20} fill="currentColor" />
                                        </div>
                                    </div>
                                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">{video.duration}</span>
                                </div>
                                <div className="p-4 text-left">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1">{video.title}</h3>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{video.views} views • 2 days ago</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Message Banner */}
                <section>
                    <div className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden text-left">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Read top articles from education experts</h2>
                            <p className="text-cyan-100 mb-8 text-lg">Stay updated with the latest exam patterns and study tips.</p>
                            <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-colors shadow-lg">
                                Read Articles
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
                    </div>
                </section>

                {/* Download App Section */}
                <DownloadAppSection />
            </div>
        </div>
    );
}
