import { Search, MapPin, CheckCircle, Lightbulb } from 'lucide-react';
import Container from '@/components/ui/Container';
import { Card } from '@/components/ui/card';

const steps = [
    {
        title: 'Search Teachers',
        desc: 'Browse through thousands of verified tutors based on your subject, budget, or location.',
        icon: <Search className="w-6 h-6 text-white" />
    },
    {
        title: 'Book Free Demo',
        desc: 'Book a 30-min trial session to interact and ensure the perfect match.',
        icon: <MapPin className="w-6 h-6 text-white" />
    },
    {
        title: 'Select & Enroll',
        desc: 'Choose your preferred package and start learning instantly from anywhere.',
        icon: <CheckCircle className="w-6 h-6 text-white" />
    },
    {
        title: 'Start Learning',
        desc: 'Access your classes, track progress, and conquer your academic goals.',
        icon: <Lightbulb className="w-6 h-6 text-white" />
    }
];

export default function LearningCycle() {
    return (
        <section className="w-full py-24 bg-[#1e293b] text-white">
            <Container>
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center lg:items-start justify-between">
                    {/* Header */}
                    <div className="flex flex-col gap-4 max-w-sm shrink-0">
                        <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                            How It Works
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                            The Learning Cycle That Delivers Results
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mt-2">
                            Let us fill in any possible blanks... Find the perfect teacher and start your journey today.
                        </p>
                    </div>

                    {/* Cycle Steps Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 w-full lg:max-w-3xl">
                        {steps.map((step, idx) => (
                            <Card key={idx} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500 transition-all p-6 flex flex-col gap-4 relative group rounded-2xl">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 shadow-lg flex items-center justify-center border border-slate-700 group-hover:border-cyan-500 transition-colors">
                                    {step.icon}
                                    {/* Small circle badge */}
                                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-900 border-2 border-[#1e293b]">
                                        {idx + 1}
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-slate-100 mb-2 leading-tight">{step.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed pr-6">{step.desc}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
