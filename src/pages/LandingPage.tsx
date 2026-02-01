import { Search, Sparkles, Users, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import TeacherCard from '@/components/booking/TeacherCard';
import { Button } from '@/components/ui/button';
import GridBackground from '@/components/landing/GridBackground';
import FeaturedBatches from '@/components/landing/FeaturedBatches';
import DownloadAppSection from '@/components/landing/DownloadAppSection';

// Icons
import PhysicsIcon from '@/assets/icons for landing page/physics.webp';
import MathIcon from '@/assets/icons for landing page/mathematics.webp';
import ChemistryIcon from '@/assets/icons for landing page/Chemistry.webp';
import BiologyIcon from '@/assets/icons for landing page/Biology.webp';
import EnglishIcon from '@/assets/icons for landing page/English.webp';
import CSIcon from '@/assets/icons for landing page/Computer Science.webp';

// Icons
import { Search as SearchIconLucide, BookOpen as BookDemoIconLucide, Video as LearnIconLucide } from 'lucide-react';

// Testimonial Data
const testimonials = [
    {
        quote: "I was struggling with Calculus for months. Found an amazing teacher from ISI Kolkata here who cleared my concepts in just 3 classes!",
        author: "Rohan Mehta",
        role: "Student",
        location: "Mumbai",
        type: "student"
    },
    {
        quote: "As a parent, I love how easy it is to find verified tutors. My daughter's physics scores have improved significantly.",
        author: "Mrs. Priya Iyer",
        role: "Parent",
        location: "Bangalore",
        type: "parent"
    },
    {
        quote: "TeacherDekho has given me a platform to reach students globally. The payment system is transparent and timely.",
        author: "Dr. Alok Sharma",
        role: "Teacher",
        location: "Delhi",
        type: "teacher"
    }
];

function TestimonialCard({ quote, author }: { quote: string, author: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 min-w-[300px] max-w-[300px]">
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">"{quote}"</p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs">
                    {author[0]}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{author}</div>
            </div>
        </div>
    );
}

export default function LandingPage() {
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
                const sortedTeachers = teachers.sort((a: any, b: any) => {
                    const ratingA = a.rating || 0;
                    const ratingB = b.rating || 0;
                    return ratingB - ratingA;
                }).slice(0, 4);
                setTopTeachers(sortedTeachers);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            } finally {
                setLoadingTeachers(false);
            }
        };
        fetchTopTeachers();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery);
        navigate(`/search?${params.toString()}`);
    };

    const subjects = [
        { name: 'Physics', icon: PhysicsIcon },
        { name: 'Mathematics', icon: MathIcon },
        { name: 'Chemistry', icon: ChemistryIcon },
        { name: 'Biology', icon: BiologyIcon },
        { name: 'English', icon: EnglishIcon },
        { name: 'Computer Science', icon: CSIcon },
    ];

    return (
        <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 selection:bg-cyan-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Hero Section */}
            <header className="relative pt-16 pb-24 overflow-hidden bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950 transition-colors duration-300">
                <div className="absolute inset-0">
                    <GridBackground
                        darkLineColor={[255, 255, 255]}
                        darkDotColor={[99, 102, 241]}
                        darkBlockColor={[79, 70, 229]}
                        maxOpacity={0.03}
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-block mb-6">
                        <span className="text-xs font-bold tracking-widest text-cyan-700 dark:text-cyan-400 uppercase">Education Redefined</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-slate-900 dark:text-white mb-6 md:mb-8 leading-[1.1] max-w-5xl mx-auto">
                        Built by expert teachers, <br />
                        <span className="italic text-cyan-700 dark:text-cyan-200">for ambitious students.</span>
                    </h1>

                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The world's smartest students trust TeacherDekho to find the perfect mentor.
                        Personalized 1-on-1 learning that fits your schedule.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto mb-12">
                        <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-cyan-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-none mb-6">
                            <div className="flex flex-col md:flex-row items-center gap-2">
                                <div className="relative flex-grow w-full">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search for teacher or subject..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-14 pr-4 py-3 bg-transparent outline-none text-lg dark:text-white dark:placeholder-slate-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-8 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-700/20"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Popular Suggestions */}
                        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                                <Sparkles size={14} /> Popular:
                            </div>
                            <Link to="/search?q=Physics" className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold hover:bg-green-200 transition-colors">Physics</Link>
                            <Link to="/search?q=Mathematics" className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-bold hover:bg-amber-200 transition-colors">Mathematics</Link>
                            <Link to="/search?q=Thermodynamics" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold hover:bg-blue-200 transition-colors">Thermodynamics</Link>
                            <Link to="/search?q=Alok Sir" className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition-colors border border-slate-200">Alok Sir</Link>
                        </div>
                    </div>
                </div>

                {/* Collages Removed as per request */}
            </header>



            {/* Top Rated Teachers & Featured Batches */}
            <div className="max-w-7xl mx-auto px-6 pt-16 space-y-32">
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
                            <Link to="/search">View All</Link>
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
                                />
                            ))
                        )}
                    </div>
                </section>

                <FeaturedBatches />
            </div>

            {/* How it Works */}
            <section className="py-24 bg-white dark:bg-slate-950/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-4">How TeacherDekho Works</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">Your journey to excellence in 3 simple steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-100 dark:via-cyan-900 to-transparent -translate-y-1/2 -z-10"></div>

                        {/* Steps */}
                        {[
                            { step: 1, title: "Search Tutors", desc: "Browse profiles of top teachers.", icon: SearchIconLucide },
                            { step: 2, title: "Book Free Demo", desc: "Schedule a free trial class.", icon: BookDemoIconLucide },
                            { step: 3, title: "Start Learning", desc: "Connect 1-on-1 via video calls.", icon: LearnIconLucide }
                        ].map((item) => (
                            <div key={item.step} className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-xl transition-all text-center">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-cyan-700 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white dark:border-slate-900 shadow-lg z-10">{item.step}</div>
                                <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center bg-cyan-50 dark:bg-cyan-900/20 rounded-full group-hover:scale-110 transition-transform">
                                    <item.icon size={64} className="text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Subjects */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-4">Popular Subjects</h2>
                            <p className="text-slate-500 dark:text-slate-400">Find expert guidance in the subjects that matter most.</p>
                        </div>
                        <Link to="/search" className="hidden md:flex items-center gap-2 text-cyan-700 font-bold hover:gap-3 transition-all">
                            View all subjects <Users size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {subjects.map(subject => (
                            <Link key={subject.name} to={`/search?subject=${subject.name}`} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-lg transition-all text-center group">
                                <div className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <img src={subject.icon} alt={subject.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="font-bold text-slate-900 dark:text-slate-100">{subject.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Marquee */}
            <section className="py-24 bg-white dark:bg-slate-950/50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-4">Loved by the Community</h2>
                </div>
                <div className="relative w-full">
                    <div className="flex gap-6 animate-marquee hover:pause">
                        {[...testimonials, ...testimonials].map((t, i) => (
                            <TestimonialCard key={i} {...t} />
                        ))}
                    </div>
                </div>
                <style>{`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 40s linear infinite;
                        width: max-content;
                    }
                    .hover\\:pause:hover {
                        animation-play-state: paused;
                    }
                `}</style>
            </section>

            {/* Stats Section (Moved to Bottom) */}
            <section className="py-16 bg-cyan-700 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-cyan-500/50">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold font-serif mb-1">500+</div>
                            <div className="text-cyan-200 text-sm font-medium">Expert Mentors</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold font-serif mb-1">10k+</div>
                            <div className="text-cyan-200 text-sm font-medium">Active Students</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold font-serif mb-1">50k+</div>
                            <div className="text-cyan-200 text-sm font-medium">Sessions Completed</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold font-serif mb-1">4.9/5</div>
                            <div className="text-cyan-200 text-sm font-medium">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download App Section */}
            <div className="max-w-7xl mx-auto px-6 pt-16">
                <DownloadAppSection />
            </div>

            {/* CTA */}
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="bg-[#4B4ACF] rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 md:mb-6">Ready to start learning?</h2>
                            <button
                                onClick={() => navigate('/onboarding')}
                                className="w-full md:w-auto px-8 md:px-10 py-3 md:py-4 bg-white text-cyan-700 rounded-xl font-bold text-base md:text-lg hover:bg-cyan-50 transition-colors shadow-xl"
                            >
                                Get Started for Free
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* WhatsApp Support Button */}
            <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
                aria-label="Chat on WhatsApp"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="absolute right-full mr-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-1 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Chat with us
                </span>
            </a>
        </div>
    );
}
