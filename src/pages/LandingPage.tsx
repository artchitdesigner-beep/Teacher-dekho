import { Zap, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import HeroRight from '@/assets/Hero iimage right.png';
import HeroLeft from '@/assets/Hero image Left.png';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFCF8] font-sans text-slate-900 selection:bg-indigo-100">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#FDFCF8]/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tight font-serif">
                        <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        TeacherDekho
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Platform</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Solutions</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Resources</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden md:block text-sm font-medium text-slate-600 hover:text-indigo-600">
                            Log in
                        </Link>
                        <Link
                            to="/onboarding"
                            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Sign up free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-block mb-6">
                        <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Education Redefined</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-slate-900 mb-8 leading-[1.1] max-w-5xl mx-auto">
                        Built by expert teachers, <br />
                        <span className="italic text-slate-600">for ambitious students.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The world's smartest students trust TeacherDekho to find the perfect mentor.
                        Personalized 1-on-1 learning that fits your schedule.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="px-8 py-4 bg-[#4B4ACF] text-white rounded-xl font-medium text-lg hover:bg-[#3f3eb5] transition-all shadow-xl shadow-indigo-200"
                        >
                            Book a demo
                        </button>
                        <Link
                            to="/onboarding"
                            className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium text-lg hover:border-indigo-300 hover:text-indigo-600 transition-all"
                        >
                            Sign up free
                        </Link>
                    </div>
                </div>

                {/* Floating Images */}
                <div className="hidden lg:block absolute top-1/2 left-0 -translate-y-1/2 w-64 xl:w-80 opacity-90 hover:scale-105 transition-transform duration-700 animate-float">
                    <img src={HeroLeft} alt="Student learning" className="w-full h-auto object-contain drop-shadow-2xl" />
                </div>
                <div className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 w-64 xl:w-80 opacity-90 hover:scale-105 transition-transform duration-700 animate-float-delayed">
                    <img src={HeroRight} alt="Teacher teaching" className="w-full h-auto object-contain drop-shadow-2xl" />
                </div>
            </header>

            {/* Stats Section */}
            <section className="py-10 bg-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-indigo-500/50">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold font-serif mb-1">500+</div>
                            <div className="text-indigo-200 text-sm font-medium">Expert Mentors</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold font-serif mb-1">10k+</div>
                            <div className="text-indigo-200 text-sm font-medium">Active Students</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold font-serif mb-1">50k+</div>
                            <div className="text-indigo-200 text-sm font-medium">Sessions Completed</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold font-serif mb-1">4.9/5</div>
                            <div className="text-indigo-200 text-sm font-medium">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 mb-4">How TeacherDekho Works</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Get started in 3 simple steps. No complicated processes, just pure learning.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-50 -z-10"></div>

                        <div className="text-center relative bg-white p-4">
                            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-sm border border-indigo-100">1</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Search</h3>
                            <p className="text-slate-500 leading-relaxed">Browse profiles of top teachers from IITs, AIIMS, and top universities. Filter by subject and budget.</p>
                        </div>
                        <div className="text-center relative bg-white p-4">
                            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-sm border border-indigo-100">2</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Book Demo</h3>
                            <p className="text-slate-500 leading-relaxed">Schedule a free trial class to see if the teacher's teaching style matches your learning needs.</p>
                        </div>
                        <div className="text-center relative bg-white p-4">
                            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-sm border border-indigo-100">3</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Learn</h3>
                            <p className="text-slate-500 leading-relaxed">Connect 1-on-1 via high-quality video calls. Get personalized attention and clear your doubts.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Subjects */}
            <section className="py-24 bg-[#FDFCF8] border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 mb-4">Popular Subjects</h2>
                            <p className="text-slate-500">Find expert guidance in the subjects that matter most.</p>
                        </div>
                        <Link to="/student/search" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                            View all subjects <Users size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {['Physics', 'Mathematics', 'Chemistry', 'Biology', 'English', 'Computer Science'].map(subject => (
                            <Link key={subject} to={`/student/search?subject=${subject}`} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all text-center group">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Zap size={20} />
                                </div>
                                <div className="font-bold text-slate-900">{subject}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 mb-4">Loved by Students & Parents</h2>
                        <p className="text-slate-500">Don't just take our word for it.</p>
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
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-[#4B4ACF] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to start learning?</h2>
                            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of students who are mastering their subjects with TeacherDekho today.</p>
                            <button
                                onClick={() => navigate('/onboarding')}
                                className="px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-xl"
                            >
                                Get Started for Free
                            </button>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-indigo-500/50 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#FDFCF8] border-t border-slate-200 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        <div>
                            <div className="flex items-center gap-2 font-bold text-xl mb-6 font-serif">
                                <div className="bg-indigo-600 text-white p-1 rounded">
                                    <Zap size={16} fill="currentColor" />
                                </div>
                                TeacherDekho
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Empowering the next generation of learners with expert guidance.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-indigo-600">Browse Teachers</a></li>
                                <li><a href="#" className="hover:text-indigo-600">How it Works</a></li>
                                <li><a href="#" className="hover:text-indigo-600">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
                                <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
                                <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-indigo-600">Privacy</a></li>
                                <li><a href="#" className="hover:text-indigo-600">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-slate-400 text-sm">
                        © 2024 TeacherDekho Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Feature component removed as it is no longer used

function Testimonial({ quote, author, role }: { quote: string, author: string, role: string }) {
    return (
        <div className="bg-[#FDFCF8] p-8 rounded-3xl border border-slate-100">
            <div className="flex gap-1 text-amber-400 mb-4">
                {[1, 2, 3, 4, 5].map(i => <Zap key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-slate-700 text-lg mb-6 leading-relaxed font-medium">"{quote}"</p>
            <div>
                <div className="font-bold text-slate-900">{author}</div>
                <div className="text-sm text-slate-500">{role}</div>
            </div>
        </div>
    )
}
