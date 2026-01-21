import { Heart, Target, Shield, Star, Users, Award, Zap, CheckCircle2, History, Play, Image as ImageIcon, ArrowRight } from 'lucide-react';
import GridBackground from '@/components/landing/GridBackground';
import { Link } from 'react-router-dom';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-white dark:bg-slate-950">
                <div className="absolute inset-0">
                    <GridBackground
                        darkLineColor={[255, 255, 255]}
                        darkDotColor={[99, 102, 241]}
                        darkBlockColor={[79, 70, 229]}
                        maxOpacity={0.1}
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Star size={16} className="fill-cyan-700 dark:fill-cyan-300" />
                            <span>Revolutionizing Education Since 2020</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Empowering Education through <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Personalized Mentorship</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            At TeacherDekho, we believe that every student deserves access to high-quality, personalized education. Our mission is to bridge the gap between expert educators and eager learners.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-cyan-100/30 dark:hover:shadow-none transition-all duration-500 group">
                        <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                            <Target size={32} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6">Our Mission</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            To create a global community where knowledge is shared freely and effectively. We strive to make finding the right mentor as easy as a few clicks, ensuring that no student is left behind due to a lack of guidance.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-emerald-100/30 dark:hover:shadow-none transition-all duration-500 group">
                        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                            <Heart size={32} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6">Our Vision</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            To become the world's most trusted platform for personalized learning. We envision a future where every learner can find their perfect match, unlocking their full potential through tailored mentorship and support.
                        </p>
                    </div>
                </div>

                {/* Our Journey (Timeline) */}
                <section className="mb-32 relative">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
                            <History size={24} />
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-4">Our Journey</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">From a small dorm room idea to a global platform.</p>
                    </div>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

                        <div className="space-y-12 md:space-y-24">
                            {[
                                { year: '2020', title: 'The Inception', desc: 'TeacherDekho was born out of a need for quality home tutors during the lockdown.', align: 'left' },
                                { year: '2021', title: 'First 100 Tutors', desc: 'We onboarded our first 100 verified tutors and served 500+ students in Delhi NCR.', align: 'right' },
                                { year: '2022', title: 'Going Digital', desc: 'Launched our online classroom platform, enabling remote learning across cities.', align: 'left' },
                                { year: '2023', title: 'Mobile App Launch', desc: 'Released our top-rated mobile app, making learning accessible on the go.', align: 'right' },
                                { year: '2024', title: 'Global Reach', desc: 'Expanded to 5 countries with over 10,000 active students and 2,000 mentors.', align: 'left' }
                            ].map((item, idx) => (
                                <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="flex-1 text-center md:text-right px-8">
                                        {item.align === 'left' && (
                                            <div className="md:text-right">
                                                <span className="text-6xl font-bold text-slate-200 dark:text-slate-800 block mb-2">{item.year}</span>
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500 border-4 border-white dark:border-slate-950 shadow-lg flex items-center justify-center text-white font-bold">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>

                                    <div className="flex-1 px-8">
                                        {item.align === 'right' && (
                                            <div className="md:text-left">
                                                <span className="text-6xl font-bold text-slate-200 dark:text-slate-800 block mb-2">{item.year}</span>
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                                            </div>
                                        )}
                                        {/* Mobile View Content (always shown below dot on mobile) */}
                                        <div className="block md:hidden text-center mt-4">
                                            <span className="text-4xl font-bold text-slate-200 dark:text-slate-800 block mb-2">{item.year}</span>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Media Gallery (Life at TeacherDekho) */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
                            <ImageIcon size={24} />
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-4">Life at TeacherDekho</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">A glimpse into our vibrant culture and events.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                        <div className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team Meeting" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                <h3 className="text-white text-2xl font-bold mb-2">Team Collaboration</h3>
                                <p className="text-slate-300">Brainstorming the next big feature.</p>
                            </div>
                        </div>
                        <div className="relative group rounded-3xl overflow-hidden cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80" alt="Office Event" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Play size={48} className="text-white fill-white" />
                            </div>
                        </div>
                        <div className="relative group rounded-3xl overflow-hidden cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" alt="Workshop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <h3 className="text-white font-bold">Annual Workshop</h3>
                            </div>
                        </div>
                        <div className="md:col-span-2 relative group rounded-3xl overflow-hidden cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80" alt="Community" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                <h3 className="text-white text-xl font-bold mb-1">Community Meetups</h3>
                                <p className="text-slate-300 text-sm">Connecting mentors and students offline.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-4">Our Core Values</h2>
                        <p className="text-slate-500 dark:text-slate-400">The principles that guide everything we do.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Shield className="text-cyan-700" size={24} />,
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
                                icon: <Zap className="text-cyan-700" size={24} />,
                                title: "Innovation",
                                description: "We continuously improve our platform to provide the best learning experience."
                            }
                        ].map((value, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                                    {value.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">{value.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Section */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-4">Meet the Visionaries</h2>
                        <p className="text-slate-500 dark:text-slate-400">The passionate team driving the future of education.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Archit Gupta', role: 'Founder & CEO', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
                            { name: 'Priya Sharma', role: 'Head of Education', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
                            { name: 'Rohan Mehta', role: 'CTO', img: 'https://randomuser.me/api/portraits/men/86.jpg' }
                        ].map((member, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-center group hover:shadow-xl transition-all">
                                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-cyan-50 dark:border-cyan-900/20 group-hover:scale-110 transition-transform">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{member.name}</h3>
                                <p className="text-cyan-600 font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="bg-slate-900 dark:bg-slate-800 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">Why Choose TeacherDekho?</h2>
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
                                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="text-slate-300 text-lg">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10">
                                <Link to="/search" className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-colors text-lg">
                                    Find a Tutor
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold">2,000+</div>
                                        <div className="text-sm text-slate-400">Verified Tutors</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold">10,000+</div>
                                        <div className="text-sm text-slate-400">Happy Students</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold">4.9/5</div>
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
