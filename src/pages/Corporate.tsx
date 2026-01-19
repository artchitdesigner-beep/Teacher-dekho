import { Building2, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Corporate() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-white dark:bg-slate-900">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Building2 size={14} /> For Enterprise
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            Empower your workforce with <span className="text-cyan-700 dark:text-cyan-400">world-class training.</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl">
                            TeacherDekho provides customized corporate training solutions, connecting your team with industry-leading experts for upskilling and professional development.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-8 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-700/20">
                                Contact Sales
                            </button>
                            <Link to="/search" className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                Explore Tutors
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats / Trust */}
            <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 uppercase tracking-widest">Trusted by forward-thinking companies</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for Company Logos - Using Text for now */}
                        <span className="text-xl font-bold text-slate-400">ACME Corp</span>
                        <span className="text-xl font-bold text-slate-400">GlobalTech</span>
                        <span className="text-xl font-bold text-slate-400">Nebula Systems</span>
                        <span className="text-xl font-bold text-slate-400">Vertex Inc</span>
                        <span className="text-xl font-bold text-slate-400">Horizon Group</span>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Why choose TeacherDekho for Business?</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">We understand the unique challenges of corporate learning and offer tailored solutions.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Expert Vetted Trainers",
                                desc: "Access a network of top-tier professionals and subject matter experts vetted for their teaching ability."
                            },
                            {
                                icon: TrendingUp,
                                title: "Customized Curriculum",
                                desc: "Training programs tailored to your specific business goals, technology stack, and team needs."
                            },
                            {
                                icon: CheckCircle,
                                title: "Measurable ROI",
                                desc: "Track progress and performance with detailed analytics and assessment reports for every employee."
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800 transition-all group">
                                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA / Contact Form Placeholder */}
            <section className="py-24 bg-cyan-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-800/20 skew-x-12 transform origin-top-right"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Ready to transform your team?</h2>
                            <p className="text-cyan-100 text-lg mb-8 leading-relaxed">
                                Get in touch with our enterprise team to discuss your training requirements and get a custom quote.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <CheckCircle size={20} className="text-cyan-400" />
                                    <span>Dedicated Account Manager</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle size={20} className="text-cyan-400" />
                                    <span>Flexible Scheduling</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle size={20} className="text-cyan-400" />
                                    <span>Volume Discounts</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100">
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">First Name</label>
                                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Last Name</label>
                                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Work Email</label>
                                    <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="john@company.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Company Name</label>
                                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Acme Inc." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Training Needs</label>
                                    <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 h-24" placeholder="Tell us about your requirements..."></textarea>
                                </div>
                                <button type="button" className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-colors flex items-center justify-center gap-2">
                                    Request Consultation <ArrowRight size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
