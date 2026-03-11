import { PhoneCall } from 'lucide-react';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';

export default function RightPath() {
    return (
        <section className="w-full py-16 bg-white">
            <Container>
                <div className="w-full bg-[#f0fdf7] rounded-[32px] overflow-hidden border border-[#d1fae5] shadow-sm relative flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-8">

                    {/* Left Content */}
                    <div className="flex flex-col gap-6 max-w-xl z-10 relative">
                        <div className="text-emerald-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Career Guidance
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Confused about the <br className="hidden md:block" />
                            Right Path?
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-md">
                            Connect with our expert mentors for a quick, personalized session and let us help you map out the perfect learning roadmap.
                        </p>

                        <div className="flex items-center gap-4 mt-4">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-7 rounded-xl shadow-lg transition-all flex items-center gap-2 border-none">
                                Request Callback
                            </Button>
                            <span className="text-slate-400 text-sm font-medium">or</span>
                            <div className="flex items-center gap-2 text-slate-700 font-bold bg-white px-4 py-3 rounded-xl border border-slate-200">
                                <PhoneCall className="w-4 h-4 text-emerald-600" />
                                1800-123-4567
                            </div>
                        </div>
                    </div>

                    {/* Right Image area - Using a generic Unsplash student/mentor photo to mimic Figma */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end relative z-10 mt-8 md:mt-0">
                        <div className="relative w-full max-w-sm aspect-square md:aspect-auto md:h-80">
                            {/* Decorative blobs behind image */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-200 rounded-full blur-[60px] opacity-60" />
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                                alt="Expert Mentor"
                                className="w-full h-full object-cover rounded-[32px] shadow-2xl relative z-10 border-4 border-white"
                            />
                            {/* Floating badge */}
                            <div className="absolute -left-8 md:-left-12 bottom-12 bg-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xl">
                                    🎓
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">Expert Guidance</div>
                                    <div className="text-slate-500 text-xs font-semibold">100% Free Consultation</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
