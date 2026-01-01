import { Heart, Target, Shield, Star, Users, Award, Zap, CheckCircle2 } from 'lucide-react';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-[#FDFCF8] py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Empowering Education through Personalized Mentorship</h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        At TeacherDekho, we believe that every student deserves access to high-quality, personalized education. Our mission is to bridge the gap between expert educators and eager learners.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                            <Target size={28} />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To create a global community where knowledge is shared freely and effectively. We strive to make finding the right mentor as easy as a few clicks, ensuring that no student is left behind due to a lack of guidance.
                        </p>
                    </div>
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/30 transition-all duration-500">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                            <Heart size={28} />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Our Vision</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To become the world's most trusted platform for personalized learning. We envision a future where every learner can find their perfect match, unlocking their full potential through tailored mentorship and support.
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Our Core Values</h2>
                        <p className="text-slate-500">The principles that guide everything we do.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Shield className="text-indigo-600" size={24} />,
                                title: "Trust & Safety",
                                description: "We rigorously verify every tutor to ensure a safe and reliable learning environment."
                            },
                            {
                                icon: <Star className="text-amber-500" size={24} />,
                                title: "Quality First",
                                description: "We prioritize educational excellence and student satisfaction above all else."
                            },
                            {
                                icon: <Users className="text-emerald-600" size={24} />,
                                title: "Community",
                                description: "We foster a supportive community of learners and educators growing together."
                            },
                            {
                                icon: <Zap className="text-indigo-600" size={24} />,
                                title: "Innovation",
                                description: "We continuously improve our platform to provide the best learning experience."
                            }
                        ].map((value, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                                    {value.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{value.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">Why Choose TeacherDekho?</h2>
                            <div className="space-y-6">
                                {[
                                    "Hand-picked, verified expert tutors",
                                    "Personalized 1-on-1 learning experience",
                                    "Flexible scheduling to fit your life",
                                    "Transparent pricing with no hidden fees",
                                    "Interactive online classroom tools",
                                    "Dedicated support for every student"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
                            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">2,000+</div>
                                        <div className="text-sm text-slate-400">Verified Tutors</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">10,000+</div>
                                        <div className="text-sm text-slate-400">Happy Students</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">4.9/5</div>
                                        <div className="text-sm text-slate-400">Average Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
