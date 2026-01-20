import { Star, Users, Clock, Repeat, UserMinus, TrendingUp, TrendingDown } from 'lucide-react';

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
                    <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
                            {stat.desc && <div className="text-xs text-slate-400 mt-1">{stat.desc}</div>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rating Overview */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-1 h-fit">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-6">Overall Rating</h2>
                    <div className="text-center mb-8">
                        <div className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">4.8</div>
                        <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
                            <Star fill="currentColor" size={24} />
                            <Star fill="currentColor" size={24} />
                            <Star fill="currentColor" size={24} />
                            <Star fill="currentColor" size={24} />
                            <Star fill="currentColor" size={24} className="text-amber-400/50" />
                        </div>
                        <div className="text-sm text-slate-500">Based on 124 reviews</div>
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
                </div>

                {/* Reviews List */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Student Reviews</h2>
                        <select className="text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2 pl-3 pr-8 focus:ring-0 cursor-pointer">
                            <option>Newest First</option>
                            <option>Highest Rated</option>
                            <option>Lowest Rated</option>
                        </select>
                    </div>
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
                                            <span className="text-xs text-slate-500">{review.date}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
