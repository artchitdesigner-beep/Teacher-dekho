import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const articles = [
    {
        id: 1,
        title: "How to ace your Board Exams in 30 Days",
        excerpt: "A comprehensive guide to managing time, focusing on high-weightage topics, and staying stress-free...",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
        badge: "Study Tips"
    },
    {
        id: 2,
        title: "Parenting Tips: How to stay involved in your child's education",
        excerpt: "Learn effective strategies to support your child's learning journey without micromanaging their study schedule.",
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
        badge: "Parenting"
    },
    {
        id: 3,
        title: "Demystifying JEE Mains: Syllabus Changes for 2026",
        excerpt: "Everything you need to know about the latest NTA announcements and how to adapt your preparation strategy.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
        badge: "Exam Updates"
    }
];

export default function EducationSpotlight() {
    return (
        <section className="w-full py-16 bg-white">
            <Container>
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-end justify-between w-full">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-cyan-600" />
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                Education <span className="text-cyan-600 font-sans">Spotlight</span>
                            </h2>
                        </div>
                        <Link to="/blog" className="flex items-center gap-1 text-cyan-700 font-bold text-sm lg:text-base hover:underline hover:gap-2 transition-all group">
                            View All Articles <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <Link key={article.id} to={`/blog/${article.id}`} className="group">
                                <Card className="flex flex-col border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full p-0">
                                    {/* Image Box */}
                                    <div className="relative aspect-video w-full overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="secondary" className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm hover:bg-white/90 border-none">
                                                {article.badge}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Content Box */}
                                    <div className="flex flex-col p-6 flex-grow">
                                        <h3 className="font-bold text-lg text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-cyan-700 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center text-cyan-700 font-bold text-sm">
                                            Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
