import { UserPlus, FileCheck, Presentation, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';

export default function EliteJoin() {
    return (
        <section className="w-full py-24 bg-gradient-to-b from-[#172554] to-[#0f172a] text-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <Container className="relative z-10 flex flex-col items-center">

                {/* Header */}
                <div className="text-center max-w-2xl mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                        Become a Part of <br className="hidden md:block" />
                        the <span className="text-cyan-400">Teacher Dekho</span> Elite
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed">
                        Join an exclusive community of the best educators and mentors to empower the next generation.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-5xl mb-12">

                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl shadow-lg flex items-center justify-center text-cyan-400 mb-2 relative">
                            <div className="absolute -top-3 bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">STEP 1</div>
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Register Your Interest</h3>
                        <p className="text-sm text-slate-400 leading-relaxed px-4">
                            Submit a short application form with your education background, experience, and subjects.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl shadow-lg flex items-center justify-center text-cyan-400 mb-2 relative">
                            <div className="absolute -top-3 bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">STEP 2</div>
                            <FileCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Rigorous Verification</h3>
                        <p className="text-sm text-slate-400 leading-relaxed px-4">
                            Go through our 3-step screening process which includes an interaction, and background check.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl shadow-lg flex items-center justify-center text-cyan-400 mb-2 relative">
                            <div className="absolute -top-3 bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">STEP 3</div>
                            <Presentation className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Start School/Teaching</h3>
                        <p className="text-sm text-slate-400 leading-relaxed px-4">
                            Connect with students, track progress, and impact lives via your personalized dashboard.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <Button className="bg-white hover:bg-cyan-50 text-cyan-800 font-bold px-8 py-7 text-lg rounded-full shadow-xl transition-all flex items-center gap-2 group border-none">
                    Start Your Application <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

            </Container>
        </section>
    );
}
