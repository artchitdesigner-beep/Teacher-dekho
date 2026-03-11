import { Star } from 'lucide-react';
import Container from '@/components/ui/Container';
import { Card } from '@/components/ui/card';

const testimonials = [
    {
        id: 1,
        quote: "I was struggling with Calculus for months. Found an amazing teacher from ISI Kolkata here who cleared my concepts in just 3 classes! The platform is super easy to use.",
        author: "Rohan Mehta",
        role: "Student",
        rating: 5,
        type: "student"
    },
    {
        id: 2,
        quote: "As a parent, I love how easy it is to find verified tutors. My daughter's physics scores have improved significantly. The rigorous verification gives us total peace of mind.",
        author: "Priya Iyer",
        role: "Parent",
        rating: 5,
        type: "parent"
    },
    {
        id: 3,
        quote: "TeacherDekho has given me a platform to reach students globally. The payment system is transparent and timely. The dashboard helps me track my batches efficiently.",
        author: "Dr. Alok Sharma",
        role: "Teacher",
        rating: 5,
        type: "teacher"
    }
];

export default function TestimonialsGrid() {
    return (
        <section className="w-full py-24 bg-slate-50 border-t border-slate-100">
            <Container>
                <div className="flex flex-col items-center gap-12 text-center">

                    {/* Header */}
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
                            Loved by Students & Parents,<br />
                            <span className="text-cyan-600">and teachers too</span>
                        </h2>
                        <p className="text-slate-500 text-base">
                            Don't just take our word for it. Here's what our community has to say.
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                        {testimonials.map((t) => (
                            <Card key={t.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col h-full relative">
                                {/* Stars */}
                                <div className="flex items-center gap-0.5 mb-6 text-amber-400">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4" fill="currentColor" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-600 text-[15px] leading-relaxed mb-8 flex-grow">
                                    "{t.quote}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                                        {t.author[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">
                                            {t.author}
                                        </div>
                                        <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                            {t.role}
                                        </div>
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
