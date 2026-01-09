import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Users, Calendar, DollarSign, BookOpen } from 'lucide-react';
import GridBackground from '@/components/landing/GridBackground';

export default function BecomeTutor() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-white dark:bg-slate-950">
                <div className="absolute inset-0">
                    <GridBackground
                        darkLineColor={[255, 255, 255]}
                        darkDotColor={[99, 102, 241]}
                        darkBlockColor={[79, 70, 229]}
                        maxOpacity={0.1}
                    />
                </div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6 tracking-tight font-serif">
                        Share your knowledge,<br />
                        <span className="text-cyan-700 dark:text-cyan-400">earn on your terms.</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join thousands of teachers who are transforming lives through education. Set your own schedule, prices, and curriculum.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/onboarding"
                            className="px-8 py-4 bg-cyan-700 text-white text-lg font-bold rounded-2xl hover:bg-cyan-700 transition-all shadow-xl shadow-cyan-700/20 hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            Start Teaching Today <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/how-it-works"
                            className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-lg font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            How it works
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                                <Calendar size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Flexible Schedule</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                You decide when you want to teach. Sync your calendar and accept bookings only when you're available.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                                <DollarSign size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Set Your Rates</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Control your earnings by setting your own hourly rates. Get paid directly and securely.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                                <Users size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Global Reach</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Connect with eager students from around the world. Expand your impact beyond your local community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Step-by-Step Guide */}
            <section className="py-20 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 font-serif">
                            How to become a teacher
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Four simple steps to start your teaching journey with us.
                        </p>
                    </div>

                    <div className="space-y-12 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block" />

                        {[
                            {
                                title: "Sign up as a Teacher",
                                desc: "Create your account in seconds. Choose 'Teacher' as your role during onboarding.",
                                icon: <Users size={24} />
                            },
                            {
                                title: "Complete your Profile",
                                desc: "Add your bio, subjects, qualifications, and a friendly profile picture to stand out.",
                                icon: <BookOpen size={24} />
                            },
                            {
                                title: "Set your Availability",
                                desc: "Define your weekly schedule. Choose the days and times you are free to take classes.",
                                icon: <Calendar size={24} />
                            },
                            {
                                title: "Start getting bookings",
                                desc: "Students will find you and book sessions. You'll get notified instantly.",
                                icon: <CheckCircle size={24} />
                            }
                        ].map((step, index) => (
                            <div key={index} className="flex gap-6 md:gap-10 relative">
                                <div className="shrink-0 w-14 h-14 bg-cyan-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-cyan-700/20 z-10 font-bold text-xl">
                                    {index + 1}
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link
                            to="/onboarding"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl"
                        >
                            Create Teacher Account <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
