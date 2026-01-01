import { Calendar, Users, ArrowRight, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BatchCardProps {
    batch: {
        id: string;
        title: string;
        teacherName: string;
        subject: string;
        class: string;
        startDate: string;
        price: number;
        studentCount: number;
        maxStudents: number;
        rating: number;
        image?: string;
    };
}

export default function BatchCard({ batch }: BatchCardProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const progress = (batch.studentCount / batch.maxStudents) * 100;

    const handleJoin = () => {
        const isDashboard = location.pathname.startsWith('/student');
        const path = isDashboard ? `/student/batch/${batch.id}` : `/batch/${batch.id}`;
        navigate(path);
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group flex flex-col h-full">
            {/* Image/Header */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={batch.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={batch.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {batch.subject}
                    </span>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs font-bold">
                        <Star size={12} className="text-amber-400" fill="currentColor" />
                        {batch.rating}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow flex flex-col">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {batch.title}
                    </h3>
                    <p className="text-sm text-slate-500">by <span className="font-semibold text-slate-700">{batch.teacherName}</span></p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Users size={14} className="text-indigo-600" />
                        <span>Class {batch.class}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Calendar size={14} className="text-indigo-600" />
                        <span>Starts {batch.startDate}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <span>Seats Filled</span>
                        <span>{batch.studentCount}/{batch.maxStudents}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold text-slate-900">₹{batch.price}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Course</div>
                    </div>
                    <button
                        onClick={handleJoin}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-all active:scale-95 group/btn"
                    >
                        Join Now
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
