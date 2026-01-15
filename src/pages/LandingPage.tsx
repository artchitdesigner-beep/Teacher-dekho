import { Users, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GridBackground from '@/components/landing/GridBackground';

// Icons
import SearchIcon from '@/assets/icons for landing page/Search Icon.webp';
import BookDemoIcon from '@/assets/icons for landing page/Book Demo Icon.webp';
import LearnIcon from '@/assets/icons for landing page/Learn Icon.webp';
import PhysicsIcon from '@/assets/icons for landing page/physics.webp';
import MathIcon from '@/assets/icons for landing page/mathematics.webp';
import ChemistryIcon from '@/assets/icons for landing page/Chemistry.webp';
import BiologyIcon from '@/assets/icons for landing page/Biology.webp';
import EnglishIcon from '@/assets/icons for landing page/English.webp';
import CSIcon from '@/assets/icons for landing page/Computer Science.webp';

export default function LandingPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

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
                        maxOpacity={0.1}
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

                {/* Left Collage - Indian Teachers/Students */}
                <div className="hidden lg:block absolute top-1/2 left-4 -translate-y-1/2 w-[300px] xl:w-[400px] h-[500px] pointer-events-none select-none">
                    {/* Main Image - Senior Female Teacher */}
                    <div className="absolute top-10 right-10 w-40 xl:w-48 h-56 xl:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 transform -rotate-3 hover:scale-105 transition-transform duration-500 z-20">
                        <img
                            src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400&h=500"
                            alt="Senior Indian Teacher"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Secondary Image - Classroom/Blackboard */}
                    <div className="absolute bottom-20 left-4 w-32 xl:w-40 h-32 xl:h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 transform rotate-6 hover:scale-105 transition-transform duration-500 z-10">
                        <img
                            src="https://images.unsplash.com/photo-1577896334614-501d0c85b97e?auto=format&fit=crop&q=80&w=300&h=300"
                            alt="Classroom"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Small Accent Image - Male Teacher */}
                    <div className="absolute top-0 left-10 w-24 xl:w-32 h-24 xl:h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 transform -rotate-12 hover:scale-105 transition-transform duration-500 z-0 opacity-90">
                        <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300"
                            alt="Male Teacher"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Right Collage - Indian Teachers/Students */}
                <div className="hidden lg:block absolute top-1/2 right-4 -translate-y-1/2 w-[300px] xl:w-[400px] h-[500px] pointer-events-none select-none">
                    {/* Main Image - Male Professor */}
                    <div className="absolute top-20 left-10 w-40 xl:w-48 h-52 xl:h-60 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 transform rotate-3 hover:scale-105 transition-transform duration-500 z-20">
                        <img
                            src="https://images.unsplash.com/photo-1507537297725-24a1c029d3a8?auto=format&fit=crop&q=80&w=400&h=500"
                            alt="Indian Professor"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Secondary Image - Female Tutor */}
                    <div className="absolute bottom-10 right-10 w-36 xl:w-44 h-48 xl:h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 transform -rotate-6 hover:scale-105 transition-transform duration-500 z-10">
                        <img
                            src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400&h=500"
                            alt="Female Tutor"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Small Accent Image - Student */}
                    <div className="absolute top-0 right-20 w-24 xl:w-28 h-24 xl:h-28 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 transform rotate-12 hover:scale-105 transition-transform duration-500 z-0 opacity-90">
                        <img
                            src="https://images.unsplash.com/photo-1623582854588-d60de57fa33f?auto=format&fit=crop&q=80&w=300&h=300"
                            alt="Indian Student"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="py-10 bg-cyan-700 text-white">
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

            {/* How it Works */}
            <section className="py-24 bg-white dark:bg-slate-950/50 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-4">How TeacherDekho Works</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">Your journey to excellence in 3 simple steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-100 dark:via-cyan-900 to-transparent -translate-y-1/2 -z-10"></div>

                        {/* Step 1 */}
                        <div className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-xl hover:shadow-cyan-100/50 dark:hover:shadow-none transition-all duration-300 transform hover:-translate-y-1 text-center">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-cyan-700 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white dark:border-slate-900 shadow-lg z-10">1</div>
                            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-cyan-50 dark:bg-cyan-900/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                                <img src={SearchIcon} alt="Search" className="w-14 h-14 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Search Tutors</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Browse profiles of top teachers from IITs, AIIMS, and top universities. Filter by subject, budget, and experience.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-xl hover:shadow-cyan-100/50 dark:hover:shadow-none transition-all duration-300 transform hover:-translate-y-1 text-center">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-cyan-700 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white dark:border-slate-900 shadow-lg z-10">2</div>
                            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-cyan-50 dark:bg-cyan-900/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                                <img src={BookDemoIcon} alt="Book Demo" className="w-14 h-14 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Book Free Demo</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Schedule a free trial class to interact with the teacher and see if their teaching style matches your needs.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-xl hover:shadow-cyan-100/50 dark:hover:shadow-none transition-all duration-300 transform hover:-translate-y-1 text-center">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-cyan-700 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white dark:border-slate-900 shadow-lg z-10">3</div>
                            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-cyan-50 dark:bg-cyan-900/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                                <img src={LearnIcon} alt="Learn" className="w-14 h-14 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Start Learning</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Connect 1-on-1 via high-quality video calls. Get personalized attention, notes, and clear your doubts instantly.</p>
                        </div>
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
                    <p className="text-slate-500 dark:text-slate-400">Hear from our students, parents, and teachers.</p>
                </div>

                <div className="relative w-full">
                    {/* Gradient Masks */}
                    <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10"></div>
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10"></div>

                    {/* Marquee Container */}
                    <div className="flex gap-6 animate-marquee hover:pause">
                        {[...testimonials, ...testimonials].map((t, i) => (
                            <TestimonialCard key={i} {...t} />
                        ))}
                    </div>
                </div>

                {/* Custom Animation Style */}
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

            {/* CTA */}
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="bg-[#4B4ACF] rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 md:mb-6">Ready to start learning?</h2>
                            <p className="text-cyan-100 text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">Join thousands of students who are mastering their subjects with TeacherDekho today.</p>
                            <button
                                onClick={() => navigate('/onboarding')}
                                className="w-full md:w-auto px-8 md:px-10 py-3 md:py-4 bg-white text-cyan-700 rounded-xl font-bold text-base md:text-lg hover:bg-cyan-50 transition-colors shadow-xl"
                            >
                                Get Started for Free
                            </button>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-64 h-64 md:w-96 md:h-96 bg-cyan-500/50 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </section>
        </div>
    );
}

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
    },
    {
        quote: "The 1-on-1 attention I get here is unmatched. It's much better than crowded coaching centers. Highly recommended!",
        author: "Arjun Singh",
        role: "Student",
        location: "Kota",
        type: "student"
    },
    {
        quote: "Finding a female tutor for my daughter was my priority. This platform made it so simple and safe.",
        author: "Sunita Verma",
        role: "Parent",
        location: "Pune",
        type: "parent"
    },
    {
        quote: "I've been teaching here for 6 months. The student quality is great and the dashboard is very intuitive.",
        author: "Sneha Gupta",
        role: "Teacher",
        location: "Hyderabad",
        type: "teacher"
    }
];

function TestimonialCard({ quote, author, role, location, type }: { quote: string, author: string, role: string, location: string, type: string }) {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'student': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
            case 'parent': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'teacher': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    return (
        <div className="w-[350px] md:w-[400px] flex-shrink-0 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 border ${getTypeColor(type)}`}>
                <span className="capitalize">{role}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-base mb-6 leading-relaxed font-medium min-h-[80px]">"{quote}"</p>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${type === 'student' ? 'bg-cyan-500' : type === 'parent' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                    {author.charAt(0)}
                </div>
                <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{author}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{location}</div>
                </div>
            </div>
        </div>
    )
}
