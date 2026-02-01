import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerCarousel() {
    const banners = [
        {
            id: 1,
            title: "Crack JEE Mains 2026",
            subtitle: "Join the elite batch starting next week.",
            color: "bg-gradient-to-r from-indigo-600 to-blue-600",
            image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800&h=400"
        },
        {
            id: 2,
            title: "Master English Speaking",
            subtitle: "1-on-1 sessions with native speakers.",
            color: "bg-gradient-to-r from-emerald-600 to-teal-600",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800&h=400"
        },
        {
            id: 3,
            title: "Physics Olympiad Prep",
            subtitle: "Learn from Gold Medalists.",
            color: "bg-gradient-to-r from-orange-600 to-red-600",
            image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800&h=400"
        }
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    return (
        <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden group">
            <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className={`w-full h-full flex-shrink-0 relative ${banner.color}`}>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 z-10"></div>

                        {/* Content */}
                        <div className="absolute inset-0 z-20 flex items-center justify-between px-8 md:px-16">
                            <div className="max-w-lg text-white">
                                <h2 className="text-2xl md:text-4xl font-bold font-serif mb-2 md:mb-4">{banner.title}</h2>
                                <p className="text-sm md:text-lg text-white/90 mb-6">{banner.subtitle}</p>
                                <button className="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors">
                                    Explore Now
                                </button>
                            </div>
                            <div className="hidden md:block w-1/3 h-full relative">
                                {/* Image Mask */}
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10"></div>
                            </div>
                        </div>

                        {/* Background Image (Optional, if you want it to cover) */}
                        <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" />
                    </div>
                ))}
            </div>

            {/* Controls */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100 z-30"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100 z-30"
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'w-6 bg-white' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
}
