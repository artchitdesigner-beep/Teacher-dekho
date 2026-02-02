import { Star, Users, Clock, Repeat, UserMinus, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const stats = [
    {
        label: 'Total Students',
        value: '124',
        change: '+12%',
        trend: 'up',
        icon: Users,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
        label: 'Hours Taught',
        value: '486',
        change: '+24h',
        trend: 'up',
        icon: Clock,
        color: 'text-purple-600',
        bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
        label: 'Repeated Students',
        value: '85',
        change: '68% rate',
        trend: 'up',
        icon: Repeat,
        color: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-900/30',
        desc: 'Students who took >1 batch'
    },
    {
        label: 'One-Time Students',
        value: '39',
        change: '32% rate',
        trend: 'down',
        icon: UserMinus,
        color: 'text-amber-600',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        desc: 'Left after 1st batch'
    },
    {
        label: 'Demo Drop-offs',
        value: '12',
        change: '15% rate',
        trend: 'down',
        icon: UserMinus,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        desc: 'Left after 1st demo'
    }
];

const reviews = [
    {
        id: 1,
        student: "Aarav Patel",
        rating: 5,
        comment: "Excellent teaching style! The concepts were explained very clearly. Sir makes physics look easy.",
        date: "2 days ago",
        avatar: "A"
    },
    {
        id: 2,
        student: "Meera Singh",
        rating: 4,
        comment: "Great batch, learned a lot. Would love more practice problems in the next sessions.",
        date: "1 week ago",
        avatar: "M"
    },
    {
        id: 3,
        student: "Rohan Kumar",
        rating: 5,
        comment: "Best math teacher I've had. Highly recommended for calculus.",
        date: "2 weeks ago",
        avatar: "R"
    },
    {
        id: 4,
        student: "Sneha Gupta",
        rating: 3,
        comment: "Good content but the pace was a bit too fast for me.",
        date: "3 weeks ago",
        avatar: "S"
    }
];

export default function TeacherReports() {
    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Performance Reports</h1>
                <p className="text-slate-500 dark:text-slate-400">Track your impact and student feedback.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-md transition-all duration-300 border-slate-200 dark:border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {stat.label}
                            </CardTitle>
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className={`text-[10px] px-1.5 py-0.5 pointer-events-none ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
                                    {stat.change}
                                </Badge>
                                {stat.desc && <span className="text-[10px] text-slate-400 truncate">{stat.desc}</span>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rating Overview */}
                <Card className="lg:col-span-1 h-fit border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Overall Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-8">
                            <div className="text-6xl font-black text-slate-900 dark:text-slate-100 mb-2 tracking-tighter">4.8</div>
                            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
                                <Star fill="currentColor" size={24} />
                                <Star fill="currentColor" size={24} />
                                <Star fill="currentColor" size={24} />
                                <Star fill="currentColor" size={24} />
                                <Star fill="currentColor" size={24} className="text-amber-400/50" />
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Based on 124 reviews</p>
                        </div>

                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map(rating => (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="w-8 text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                        {rating} <Star size={10} fill="currentColor" className="text-amber-400" />
                                    </div>
                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full"
                                            style={{ width: rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '8%' : '2%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews List */}
                <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 py-4">
                        <CardTitle className="text-lg font-bold">Student Reviews</CardTitle>
                        <select className="text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2 pl-3 pr-8 focus:ring-0 cursor-pointer outline-none font-medium text-slate-600 dark:text-slate-300">
                            <option>Newest First</option>
                            <option>Highest Rated</option>
                            <option>Lowest Rated</option>
                        </select>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {reviews.map(review => (
                                <div key={review.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">
                                            {review.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{review.student}</h4>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={12}
                                                                fill="currentColor"
                                                                className={i < review.rating ? "text-amber-400" : "text-slate-300 dark:text-slate-700"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-500 font-medium">{review.date}</span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
