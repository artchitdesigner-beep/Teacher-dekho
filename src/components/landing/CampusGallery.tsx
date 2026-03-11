import { Image as ImageIcon, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';

const galleryImages = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1470&auto=format&fit=crop',
        alt: 'Books stack'
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1287&auto=format&fit=crop',
        alt: 'Books macro'
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop',
        alt: 'Student working on laptop'
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1532&auto=format&fit=crop',
        alt: 'Classroom teaching'
    }
];

export default function CampusGallery() {
    return (
        <section className="w-full bg-transparent pb-[80px]">
            <Container>
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-end justify-between w-full">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-slate-800" />
                                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">
                                    Campus Gallery
                                </h2>
                            </div>
                            <p className="text-[12px] font-semibold text-slate-800 mt-1">
                                Glimpses of our vibrant community.
                            </p>
                        </div>
                        <a href="#gallery" className="flex items-center gap-1 text-[#007ec3] font-bold text-[14px] hover:underline">
                            View All <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {galleryImages.map((image) => (
                            <div
                                key={image.id}
                                className="group relative aspect-[16/9] md:aspect-[296/166.5] bg-slate-200 rounded-xl overflow-hidden shadow-sm"
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="backdrop-blur-sm border border-white/50 bg-white/10 px-4 py-1.5 rounded-full text-white font-semibold text-[12px]">
                                        View
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
