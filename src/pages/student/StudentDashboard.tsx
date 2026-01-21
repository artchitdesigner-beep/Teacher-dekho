import { useState, useEffect } from 'react';
import { Search, TrendingUp, X, Image, PlayCircle, Play, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ServiceCards from '@/components/landing/ServiceCards';
import BannerCarousel from '@/components/landing/BannerCarousel';
import FeaturedBatches from '@/components/landing/FeaturedBatches';
import DownloadAppSection from '@/components/landing/DownloadAppSection';
import TeacherCard from '@/components/booking/TeacherCard';

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
                    limit(10) // Fetch a few more to filter/sort client-side
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

            {/* Image Gallery */}
            <section className="mb-12">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Image size={24} className="text-cyan-600" />
                            Campus Gallery
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Glimpses of our vibrant learning community.</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden relative group cursor-pointer">
                            <img
                                src={`https://source.unsplash.com/random/800x600?classroom,education&sig=${item}`}
                                alt="Gallery"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-bold border border-white px-4 py-2 rounded-lg">View</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Educational Videos */}
            <section className="mb-12">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <PlayCircle size={24} className="text-red-600" />
                            Free Learning Resources
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Watch curated video lessons from top mentors.</p>
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
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1">{video.title}</h3>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{video.views} views • 2 days ago</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular Teachers for You */}
            <section className="mb-12">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Star size={24} className="text-amber-500" />
                            Top Rated Teachers
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Highly recommended mentors in your subjects.</p>
                    </div>
                    <Link to="/search" className="text-cyan-700 font-bold text-sm hover:underline">View All</Link>
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
                                onBook={() => { }} // Placeholder or navigate to profile
                                onSave={() => { }} // Placeholder
                            />
                        ))
                    )}
                    {/* Fallback if no teachers found */}
                    {!loadingTeachers && topTeachers.length === 0 && (
                        <div className="col-span-full text-center py-8 text-slate-500">
                            No top rated teachers found at the moment.
                        </div>
                    )}
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
