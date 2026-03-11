import { ShieldCheck, UserCheck, RefreshCw, BarChart } from 'lucide-react';
import Container from '@/components/ui/Container';
import { Card } from '@/components/ui/card';

const features = [
    {
        title: 'Verified Expert Mentors',
        desc: 'Our teachers undergo a rigorous 3-step verification process ensuring only the best minds guide you.',
        icon: <ShieldCheck className="w-8 h-8 text-cyan-700" />
    },
    {
        title: '1-on-1 Personalized Attention',
        desc: 'Tailored learning paths that adapt to your pace, strengths, and areas of improvement.',
        icon: <UserCheck className="w-8 h-8 text-cyan-700" />
    },
    {
        title: 'Flexible Learning Options',
        desc: 'Switch between live batches, private tuitions, or consult with our experts for best recommendation and guidance.',
        icon: <RefreshCw className="w-8 h-8 text-cyan-700" />
    },
    {
        title: 'Interactive Learning Tools',
        desc: 'Real-time doubt resolution and advanced performance analytics to track your growth.',
        icon: <BarChart className="w-8 h-8 text-cyan-700" />
    }
];

export default function WhyChooseUs() {
    return (
        <section className="w-full py-24 bg-slate-50 relative overflow-hidden">
            <Container>
                <div className="flex flex-col gap-12">
                    {/* Header Area */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="flex flex-col gap-4 max-w-xl">
                            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm w-fit">
                                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Why Choose Us</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                                What makes Teacher Dekho <br className="hidden md:block" />
                                the preferred choice?
                            </h2>
                        </div>
                        <p className="text-slate-500 max-w-md text-base leading-relaxed md:pb-2">
                            We've built a platform that puts students first, providing quality education that's accessible, flexible, and effective.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {features.map((feature, idx) => (
                            <Card key={idx} className="bg-white p-8 pb-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
                                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-cyan-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity" />

                                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center mb-10 relative z-10 group-hover:bg-white transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-4 relative z-10">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-grow relative z-10">
                                    {feature.desc}
                                </p>

                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-800 cursor-pointer relative z-10 w-fit">
                                    Learn More <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
