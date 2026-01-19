import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BatchCard from '@/components/batches/BatchCard';

export default function FeaturedBatches() {
    const batches = [
        {
            id: '1',
            title: "Class 12 Physics - Board Exam Special",
            teacherName: "Alok Sir",
            subject: "Physics",
            class: "12",
            startDate: "Nov 15, 2023",
            price: 4999,
            studentCount: 120,
            maxStudents: 150,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=400&h=300"
        },
        {
            id: '2',
            title: "Complete Python Bootcamp 2024",
            teacherName: "Neha Sharma",
            subject: "Computer Science",
            class: "11-12",
            startDate: "Dec 01, 2023",
            price: 2999,
            studentCount: 450,
            maxStudents: 500,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=400&h=300"
        },
        {
            id: '3',
            title: "IELTS Preparation - Speaking & Writing",
            teacherName: "Robert Smith",
            subject: "English",
            class: "Any",
            startDate: "Nov 20, 2023",
            price: 3500,
            studentCount: 85,
            maxStudents: 100,
            rating: 5.0,
            image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400&h=300"
        },
        {
            id: '4',
            title: "Mathematics - Calculus Masterclass",
            teacherName: "Priya Gupta",
            subject: "Mathematics",
            class: "12",
            startDate: "Nov 25, 2023",
            price: 4500,
            studentCount: 210,
            maxStudents: 250,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=400&h=300"
        }
    ];

    return (
        <section className="mb-16">
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Featured Batches</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Join top-rated batches for structured learning.</p>
                </div>
                <Link to="/student/search?tab=batches" className="text-cyan-700 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ArrowRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {batches.map((batch) => (
                    <div key={batch.id} className="h-full">
                        <BatchCard batch={batch} />
                    </div>
                ))}
            </div>
        </section>
    );
}
