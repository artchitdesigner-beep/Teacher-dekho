import { Zap, Users, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import HeroRight from '@/assets/right boy.webp';
import HeroLeft from '@/assets/left girl.webp';
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
    const [selectedClass, setSelectedClass] = useState('12th');
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery);
        params.set('class', selectedClass);
        params.set('lang', selectedLanguage);
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
            <header className="relative pt-20 pb-32 overflow-hidden bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950 transition-colors duration-300">
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

                    <h1 className="text-4xl md:text-7xl font-serif font-medium text-slate-900 dark:text-white mb-6 md:mb-8 leading-[1.1] max-w-5xl mx-auto">
                        Built by expert teachers, <br />
                        <span className="italic text-cyan-700 dark:text-cyan-200">for ambitious students.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The world's smartest students trust TeacherDekho to find the perfect mentor.
                        Personalized 1-on-1 learning that fits your schedule.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-cyan-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-none mb-6">
                            <div className="flex flex-col md:flex-row items-center gap-2">
                                <div className="relative flex-grow w-full">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search for teacher or subject..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-14 pr-4 py-4 bg-transparent outline-none text-lg dark:text-white dark:placeholder-slate-500"
                                    />
                                </div>

                                <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full md:w-auto px-4 py-4 bg-transparent font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                                >
                                    <option value="11th">Class 11th</option>
                                    <option value="12th">Class 12th</option>
                                </select>

                                <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="w-full md:w-auto px-4 py-4 bg-transparent font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                                >
                                    <option value="English">English</option>
                                    <option value="Hinglish">Hinglish</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Marathi">Marathi</option>
                                </select>

                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-10 py-4 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-700/20"
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

                {/* Floating Images */}
                <div className="hidden lg:block absolute top-1/2 left-0 -translate-y-1/2 w-80 xl:w-96 opacity-100 hover:scale-105 transition-transform duration-700 animate-float">
                    <img src={HeroLeft} alt="Student learning" className="w-full h-auto object-contain" />
                </div>
                <div className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 w-80 xl:w-96 opacity-100 hover:scale-105 transition-transform duration-700 animate-float-delayed">
                    <img src={HeroRight} alt="Teacher teaching" className="w-full h-auto object-contain" />
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
            <section className="py-24 bg-white dark:bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-4">How TeacherDekho Works</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Get started in 3 simple steps. No complicated processes, just pure learning.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-50 via-cyan-100 to-cyan-50 -z-10"></div>

                        <div className="text-center relative bg-white dark:bg-slate-900 p-4 rounded-2xl">
                            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <img src={SearchIcon} alt="Search" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Search</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Browse profiles of top teachers from IITs, AIIMS, and top universities. Filter by subject and budget.</p>
                        </div>
                        <div className="text-center relative bg-white dark:bg-slate-900 p-4 rounded-2xl">
                            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <img src={BookDemoIcon} alt="Book Demo" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Book Demo</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Schedule a free trial class to see if the teacher's teaching style matches your learning needs.</p>
                        </div>
                        <div className="text-center relative bg-white dark:bg-slate-900 p-4 rounded-2xl">
                            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <img src={LearnIcon} alt="Learn" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Learn</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Connect 1-on-1 via high-quality video calls. Get personalized attention and clear your doubts.</p>
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

            {/* Testimonials */}
            <section className="py-24 bg-white dark:bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-4">Loved by Students & Parents</h2>
                        <p className="text-slate-500 dark:text-slate-400">Don't just take our word for it.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Testimonial
                            quote="I was struggling with Calculus for months. Found an amazing teacher from ISI Kolkata here who cleared my concepts in just 3 classes!"
                            author="Rohan Mehta"
                            role="Class 12 Student, Mumbai"
                        />
                        <Testimonial
                            quote="As a parent, I love how easy it is to find verified tutors. My daughter's physics scores have improved significantly."
                            author="Mrs. Priya Iyer"
                            role="Parent, Bangalore"
                        />
                        <Testimonial
                            quote="The 1-on-1 attention I get here is unmatched. It's much better than crowded coaching centers. Highly recommended!"
                            author="Arjun Singh"
                            role="JEE Aspirant, Delhi"
                        />
                    </div>
                </div>
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

// Feature component removed as it is no longer used

function Testimonial({ quote, author, role }: { quote: string, author: string, role: string }) {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="flex gap-1 text-amber-400 mb-4">
                {[1, 2, 3, 4, 5].map(i => <Zap key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-lg mb-6 leading-relaxed font-medium">"{quote}"</p>
            <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{author}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{role}</div>
            </div>
        </div>
    )
}
