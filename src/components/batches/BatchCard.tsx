import { Calendar, Users, ArrowRight, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

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
        <Card className="overflow-hidden hover:shadow-2xl hover:shadow-cyan-100/50 dark:hover:shadow-none transition-all duration-300 group h-full flex flex-col border-slate-200 dark:border-slate-800">
            {/* Image Header */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={batch.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={batch.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-md shadow-sm border-0 font-bold text-[10px] uppercase tracking-wider">
                        {batch.subject}
                    </Badge>
                    {batch.rating >= 4.5 && (
                        <Badge className="bg-amber-500 text-white border-0 hover:bg-amber-600 font-bold text-[10px] flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> Top Rated
                        </Badge>
                    )}
                </div>

                {/* Bottom info overlaid on image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-300 mb-1">Class {batch.class}</p>
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 text-white shadow-black drop-shadow-md">
                        {batch.title}
                    </h3>
                </div>
            </div>

            <CardContent className="flex-grow p-5 space-y-4">
                {/* Teacher Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xs ring-2 ring-white dark:ring-slate-950">
                            {batch.teacherName ? batch.teacherName.charAt(0) : '?'}
                        </span>
                        <span>by <span className="font-semibold text-slate-900 dark:text-slate-100">{batch.teacherName || 'Unknown Teacher'}</span></span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-xs font-bold border border-amber-100 dark:border-amber-900/30">
                        <Star size={10} fill="currentColor" /> {batch.rating}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-1">
                            <Calendar size={12} /> Start Date
                        </div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {batch.startDate}
                        </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-1">
                            <Users size={12} /> Enrollment
                        </div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {batch.studentCount}/{batch.maxStudents} Students
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Slots Filled</span>
                        <span className={progress >= 80 ? "text-red-500" : "text-emerald-500"}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <Progress value={progress} className="h-1.5" indicatorClassName={progress >= 80 ? "bg-red-500" : "bg-cyan-600"} />
                </div>
            </CardContent>

            <Separator />

            <CardFooter className="p-4 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Fee</span>
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-bold text-slate-900 dark:text-slate-100">₹{batch.price}</span>
                        <span className="text-[10px] text-slate-500 font-medium">/total</span>
                    </div>
                </div>

                <Button
                    onClick={handleJoin}
                    className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-cyan-700 dark:hover:bg-cyan-200 shadow-lg shadow-slate-900/10 transition-all font-bold group/btn"
                >
                    View Details
                    <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
            </CardFooter>
        </Card>
    );
}
