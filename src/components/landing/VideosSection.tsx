import { ArrowRight, Play, Video } from 'lucide-react';
import Container from '@/components/ui/Container';
import { Card } from '@/components/ui/card';

const videos = [
    { id: 1, title: 'Calculus Fundamentals', time: '45:20', thumb: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop' },
    { id: 2, title: 'Organic Chemistry Basics', time: '32:15', thumb: 'https://images.unsplash.com/photo-1603126857599-f6e15782faec?q=80&w=1200&auto=format&fit=crop' },
    { id: 3, title: 'Physics: Laws of Motion', time: '55:00', thumb: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=1200&auto=format&fit=crop' },
    { id: 4, title: 'Biology: Cell Structure', time: '28:10', thumb: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop' },
];

export default function VideosSection() {
    return (
        <section className="w-full py-16 bg-white overflow-hidden">
            <Container>
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-end justify-between w-full">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <Video className="w-5 h-5 text-cyan-600" />
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Videos From Teacher Dekho
                                </h2>
                            </div>
                            <p className="text-sm font-semibold text-slate-500 mt-1">
                                Life At Teacher Dekho
                            </p>
                        </div>
                        <a href="#videos" className="flex items-center gap-1 text-cyan-700 font-bold text-sm hover:underline">
                            View All <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Videos Row (like Campus Gallery) */}
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                        {videos.map((video) => (
                            <Card
                                key={video.id}
                                className="group relative aspect-video w-[278px] shrink-0 bg-slate-200 rounded-[20px] overflow-hidden shadow-sm cursor-pointer border border-slate-100 snap-center p-0"
                            >
                                <img
                                    src={video.thumb}
                                    alt={video.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />

                                {/* Play Button Hover */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur border border-white/50 text-white rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-lg">
                                        <Play className="w-5 h-5 ml-1" fill="currentColor" />
                                    </div>
                                </div>

                                {/* Bottom Info */}
                                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                    <div className="font-bold text-white text-sm line-clamp-1 truncate w-48 drop-shadow-md">
                                        {video.title}
                                    </div>
                                    <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-white text-[10px] font-bold">
                                        {video.time}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
