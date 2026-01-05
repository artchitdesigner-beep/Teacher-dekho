import { Search, Calendar, Video, Award, CheckCircle2, Users, ShieldCheck, Zap } from 'lucide-react';

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6">How TeacherDekho Works</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        We've simplified the process of finding and booking the perfect tutor. Whether you're a student looking to excel or a teacher ready to inspire, we've got you covered.
                    </p>
                </div>

                {/* For Students */}
                <section className="mb-32">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Users size={24} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">For Students</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Search className="text-indigo-600" size={32} />,
                                title: "1. Find Your Tutor",
                                description: "Browse through our verified network of expert tutors. Filter by subject, class, language, and rating to find your perfect match."
                            },
                            {
                                icon: <Calendar className="text-indigo-600" size={32} />,
                                title: "2. Book a Class",
                                description: "Check your tutor's availability and book a 1-on-1 online session at a time that suits you. No upfront payment required."
                            },
                            {
                                icon: <Video className="text-indigo-600" size={32} />,
                                title: "3. Start Learning",
                                description: "Join your interactive online classroom and start learning. Pay only after your first class if you're satisfied with the experience."
                            }
                        ].map((step, index) => (
                            <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-none transition-all duration-300 group">
                                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* For Teachers */}
                <section className="mb-32">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            <Award size={24} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">For Teachers</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="text-emerald-600" size={32} />,
                                title: "1. Create Your Profile",
                                description: "Sign up and showcase your expertise. Highlight your experience, subjects, and teaching methodology to attract students."
                            },
                            {
                                icon: <ShieldCheck className="text-emerald-600" size={32} />,
                                title: "2. Get Verified",
                                description: "Our team reviews your credentials to ensure high standards. Once verified, your profile becomes visible to thousands of students."
                            },
                            {
                                icon: <CheckCircle2 className="text-emerald-600" size={32} />,
                                title: "3. Start Teaching",
                                description: "Manage your schedule, accept booking requests, and conduct classes. Build your reputation and grow your teaching career."
                            }
                        ].map((step, index) => (
                            <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 dark:hover:shadow-none transition-all duration-300 group">
                                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 relative z-10">Ready to get started?</h2>
                    <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto relative z-10">
                        Join thousands of students and teachers who are already transforming the way they learn and teach.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                            Find a Tutor
                        </button>
                        <button className="px-8 py-4 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-400 transition-all border border-indigo-400 shadow-lg active:scale-95">
                            Become a Tutor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
