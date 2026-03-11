import Container from '@/components/ui/Container';


export default function HeroSection() {
    return (
        <section className="relative w-full pt-6 md:pt-8 pb-4 md:pb-6 bg-transparent transition-colors z-10">
            <Container>
                <div className="relative z-10 flex flex-col items-center">

                    {/* Main Banner matching Figma */}
                    <div className="w-full h-[250px] md:h-[350px] lg:h-[400px] rounded-[30px] overflow-hidden shadow-2xl relative">
                        {/* Background Image / Banner */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {/* Linear Gradient for styling over the raw image if needed, or perfectly clean */}
                            <div className="absolute inset-0 bg-emerald-900/30 mix-blend-multiply" />
                        </div>

                        {/* Hero Slider Dots - Positioned as in Figma */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            <div className="w-2.5 h-2.5 rounded-full bg-white/40 cursor-pointer hover:bg-white/60 transition-colors" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/40 cursor-pointer hover:bg-white/60 transition-colors" />
                            <div className="w-6 h-2.5 rounded-full bg-white cursor-pointer shadow-sm" />
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
