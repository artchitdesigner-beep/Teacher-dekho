import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, Clock, BookOpen, MoreVertical } from 'lucide-react';

export default function TeacherBatches() {
    const [activeTab, setActiveTab] = useState<'create' | 'running' | 'upcoming'>('running');

    // Dummy data for visualization
    // Dummy data for visualization with types
    const runningClasses = [
        { id: '1', name: 'Physics Mechanics', type: 'batch', students: 12, time: '10:00 AM', days: 'Mon, Wed, Fri', progress: 45 },
        { id: '2', name: 'Organic Chemistry', type: 'batch', students: 8, time: '04:00 PM', days: 'Tue, Thu', progress: 20 },
        { id: '3', name: 'Math - Calculus (Aarav)', type: 'personal', students: 1, time: '02:00 PM', days: 'Mon, Thu', progress: 60 },
    ];

    const upcomingClasses = [
        { id: '4', name: 'JEE Mains Prep', type: 'batch', startDate: '2025-02-01', registered: 5, maxStudents: 20, time: '06:00 PM' },
        { id: '5', name: 'Physics - Mechanics (Vivaan)', type: 'personal', startDate: '2025-02-05', registered: 1, maxStudents: 1, time: '05:00 PM' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Batches</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your group classes and schedules.</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('running')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'running'
                            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        Running
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'create'
                            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Plus size={16} /> Create New
                    </button>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming'
                            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        Upcoming
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'create' && (
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto shadow-sm animate-in zoom-in-95 duration-300">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <Plus className="text-cyan-600" /> Create New Batch
                    </h2>
                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Batch Name / Topic</label>
                                <input type="text" placeholder="e.g. Physics Mechanics Masterclass" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                                    <select className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white">
                                        <option>Select Subject</option>
                                        <option>Mathematics</option>
                                        <option>Physics</option>
                                        <option>Chemistry</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Students</label>
                                    <input type="number" placeholder="20" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                                <input type="date" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white" />
                            </div>

                            {/* Standardized Schedule Builder */}
                            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Clock size={18} className="text-cyan-600" /> Class Schedule
                                </h3>

                                {/* Time Selection */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Start Time</label>
                                        <input type="time" className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold outline-none focus:border-cyan-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">End Time</label>
                                        <input type="time" className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold outline-none focus:border-cyan-500 transition-colors" />
                                    </div>
                                </div>

                                {/* Day Selection */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-bold text-slate-500">Class Days</label>
                                        <div className="flex gap-1">
                                            {[
                                                { label: 'MWF', days: ['Mon', 'Wed', 'Fri'] },
                                                { label: 'TTS', days: ['Tue', 'Thu', 'Sat'] },
                                                { label: 'Mon-Sat', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
                                                { label: 'All Days', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
                                            ].map(pattern => (
                                                <button
                                                    key={pattern.label}
                                                    type="button"
                                                    className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded hover:bg-cyan-100 hover:text-cyan-700 transition-colors"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // Logic to set days would go here
                                                        console.log(`Set pattern: ${pattern.label}`);
                                                    }}
                                                >
                                                    {pattern.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                            <label key={day} className="cursor-pointer">
                                                <input type="checkbox" className="hidden peer" />
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 peer-checked:bg-cyan-700 peer-checked:text-white peer-checked:border-cyan-700 transition-all">
                                                    {day}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fees (₹)</label>
                                <input type="number" placeholder="5000" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white" />
                            </div>
                        </div>
                        <button className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-colors shadow-lg shadow-cyan-900/20">
                            Create Batch
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'running' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                    {runningClasses.map(batch => (
                        <div key={batch.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 ${batch.type === 'batch' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600'} rounded-2xl flex items-center justify-center`}>
                                        {batch.type === 'batch' ? <BookOpen size={24} /> : <Users size={24} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{batch.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${batch.type === 'batch' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                {batch.type}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">ID: #{batch.id}</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-cyan-600"><MoreVertical size={20} /></button>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Users size={16} className="text-cyan-500" />
                                    <span>{batch.students} Students Enrolled</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Clock size={16} className="text-cyan-500" />
                                    <span>{batch.time} • {batch.days}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Course Progress</span>
                                    <span className="font-bold text-cyan-600">{batch.progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${batch.progress}%` }}></div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Attendance
                                </button>
                                <Link
                                    to={`/teacher/batches/${batch.id}`}
                                    className="flex-1 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 font-bold rounded-xl text-sm hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors flex items-center justify-center"
                                >
                                    Manage
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'upcoming' && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    {upcomingClasses.map(batch => (
                        <div key={batch.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6">
                            <div className={`w-16 h-16 ${batch.type === 'batch' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                                {batch.type === 'batch' ? <Calendar size={32} /> : <Clock size={32} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">{batch.name}</h3>
                                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase ${batch.type === 'batch' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'
                                        }`}>
                                        {batch.type}
                                    </span>
                                    <span className="px-3 py-1 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full border border-slate-100 dark:border-slate-800">
                                        Starts {new Date(batch.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1"><Users size={16} /> {batch.registered}/{batch.maxStudents} Registered</span>
                                    <span className="flex items-center gap-1"><Clock size={16} /> {batch.time}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Edit
                                </button>
                                <button className="flex-1 md:flex-none px-6 py-2 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-colors text-nowrap">
                                    Share Link
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
