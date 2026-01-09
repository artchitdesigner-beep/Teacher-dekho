import { Link } from 'react-router-dom';
import { Clock, Video, Calendar } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface UpcomingClassCardProps {
    booking: {
        id: string;
        topic: string;
        scheduledAt: Timestamp;
        status: string;
        teacherId: string;
        // Ideally we'd have teacher name/avatar here too, but for now we'll use topic
    };
}

export default function UpcomingClassCard({ booking }: UpcomingClassCardProps) {
    const date = booking.scheduledAt.toDate();
    const isToday = new Date().toDateString() === date.toDateString();

    return (
        <div className="min-w-[260px] bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group relative overflow-hidden">


            <div className="flex items-start justify-between mb-3">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <Calendar size={12} />
                    {isToday ? 'Today' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1" title={booking.topic}>
                {booking.topic}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">1 hour session</p>

            <div className="flex items-center gap-2">
                {booking.status === 'confirmed' ? (
                    <button className="flex-1 bg-cyan-700 text-white text-xs font-bold py-2 rounded-xl hover:bg-cyan-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-200 dark:shadow-none">
                        <Video size={14} />
                        Join Class
                    </button>
                ) : (
                    <div className="flex-1 bg-amber-50 text-amber-700 text-xs font-bold py-2 rounded-xl text-center border border-amber-100">
                        Pending
                    </div>
                )}
                <Link
                    to={`/student/bookings/${booking.id}`}
                    className="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    Details
                </Link>
            </div>
        </div>
    );
}
