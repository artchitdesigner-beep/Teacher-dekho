import { Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BatchCardSmallProps {
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

export default function BatchCardSmall({ batch }: BatchCardSmallProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const progress = (batch.studentCount / batch.maxStudents) * 100;

    const handleJoin = () => {
        const isDashboard = location.pathname.startsWith('/student');
        const path = isDashboard ? `/student/batch/${batch.id}` : `/batch/${batch.id}`;
        navigate(path);
    };

    return (
        <Card className="w-full overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
            {/* Image Header - Compact */}
            <div className="relative h-32 overflow-hidden">
                <img
                    src={batch.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={batch.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                <Badge className="absolute top-2 left-2 bg-white/90 text-slate-900 backdrop-blur-md border-0 text-[10px] font-bold">
                    {batch.subject}
                </Badge>

                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Class {batch.class}</span>
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Star size={8} fill="currentColor" /> {batch.rating}
                    </div>
                </div>
            </div>

            <CardContent className="flex flex-col flex-grow p-4 gap-3">
                <div>
                    <h3 className="font-bold text-base leading-tight text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                        {batch.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-[10px]">
                            {batch.teacherName ? batch.teacherName.charAt(0) : '?'}
                        </span>
                        <span className="truncate">{batch.teacherName}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                        <div className="text-slate-400 font-medium text-[10px] mb-0.5">Start Date</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300 truncate">{batch.startDate}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                        <div className="text-slate-400 font-medium text-[10px] mb-0.5">Price</div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">₹{batch.price}</div>
                    </div>
                </div>

                <div className="mt-auto pt-1 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>{batch.studentCount}/{batch.maxStudents} Filled</span>
                    </div>
                    <Progress value={progress} className="h-1" indicatorClassName={progress >= 80 ? "bg-red-500" : "bg-cyan-600"} />

                    <Button
                        onClick={handleJoin}
                        className="w-full h-9 text-xs font-bold bg-slate-900 hover:bg-cyan-700 text-white rounded-xl mt-2"
                    >
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
