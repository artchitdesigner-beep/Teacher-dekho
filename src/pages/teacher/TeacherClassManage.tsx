import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Users,
    Calendar,
    Clock,
    CheckCircle,
    FileText,
    MessageSquare,
    Video,
    ArrowLeft,
    MoreVertical,
    UserPlus,
    BarChart
} from 'lucide-react';

interface Student {
    id: string;
    name: string;
    email: string;
    joinedDate: string;
    attendance: number;
    status: 'active' | 'inactive';
}

interface Session {
    id: string;
    date: string;
    time: string;
    topic: string;
    status: 'completed' | 'upcoming' | 'cancelled';
}

export default function TeacherClassManage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'students' | 'sessions' | 'resources'>('students');

    // Dummy data for visualization
    const [classData] = useState({
        id: id,
        name: 'Physics Mechanics Masterclass',
        type: 'batch',
        subject: 'Physics',
        students: 12,
        maxStudents: 20,
        progress: 45,
        totalSessions: 24,
        completedSessions: 11,
        nextSession: '2025-02-03 10:00 AM'
    });

    const [students] = useState<Student[]>([
        { id: '1', name: 'Aarav Sharma', email: 'aarav@example.com', joinedDate: '2025-01-15', attendance: 90, status: 'active' },
        { id: '2', name: 'Vivaan Gupta', email: 'vivaan@example.com', joinedDate: '2025-01-16', attendance: 85, status: 'active' },
        { id: '3', name: 'Diya Patel', email: 'diya@example.com', joinedDate: '2025-01-16', attendance: 100, status: 'active' },
        { id: '4', name: 'Ananya Singh', email: 'ananya@example.com', joinedDate: '2025-01-18', attendance: 75, status: 'active' },
    ]);

    const [sessions] = useState<Session[]>([
        { id: 's1', date: '2025-02-03', time: '10:00 AM', topic: 'Circular Motion', status: 'upcoming' },
        { id: 's2', date: '2025-02-05', time: '10:00 AM', topic: 'Angular Momentum', status: 'upcoming' },
        { id: 's3', date: '2025-01-30', time: '10:00 AM', topic: 'Laws of Motion Revision', status: 'completed' },
        { id: 's4', date: '2025-01-27', time: '10:00 AM', topic: 'Friction and its types', status: 'completed' },
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/teacher/batches" className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-cyan-600 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">{classData.name}</h1>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-lg">
                                {classData.type}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">{classData.subject} • Group ID: #{id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Video size={16} /> Start Class
                    </button>
                    <button className="px-4 py-2 bg-cyan-700 text-white font-bold rounded-xl text-sm hover:bg-cyan-800 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-900/20">
                        <MessageSquare size={16} /> Group Chat
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Students</div>
                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{classData.students}</div>
                        <div className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">Limit: {classData.maxStudents}</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Session Progress</div>
                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{classData.completedSessions}/{classData.totalSessions}</div>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-cyan-600" style={{ width: `${(classData.completedSessions / classData.totalSessions) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Avg. Attendance</div>
                    <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">88%</div>
                        <BarChart size={20} className="text-emerald-500" />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Next Session</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{classData.nextSession}</div>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('students')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'students'
                        ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Users size={16} /> Students
                </button>
                <button
                    onClick={() => setActiveTab('sessions')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'sessions'
                        ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Calendar size={16} /> Sessions
                </button>
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'resources'
                        ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <FileText size={16} /> Resources
                </button>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                {activeTab === 'students' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Enrolled Students</h3>
                            <button className="p-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-xl hover:bg-cyan-100 transition-colors">
                                <UserPlus size={20} />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-950/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {students.map(student => (
                                        <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold">
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{student.name}</div>
                                                        <div className="text-xs text-slate-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(student.joinedDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full ${student.attendance > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${student.attendance}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{student.attendance}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-lg">
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-slate-400 hover:text-cyan-600 p-2">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'sessions' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <Clock className="text-cyan-600" /> Upcoming Sessions
                            </h3>
                            <div className="space-y-4">
                                {sessions.filter(s => s.status === 'upcoming').map(session => (
                                    <div key={session.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group hover:border-cyan-200 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">{new Date(session.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{session.topic}</div>
                                                <div className="text-xs text-slate-500">{session.time} • Online</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline">Reschedule</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm opacity-80">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <CheckCircle className="text-emerald-600" /> Past Sessions
                            </h3>
                            <div className="space-y-4">
                                {sessions.filter(s => s.status === 'completed').map(session => (
                                    <div key={session.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-xl flex flex-col items-center justify-center opacity-50">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-lg font-bold text-slate-900 leading-none">{new Date(session.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{session.topic}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <CheckCircle size={12} className="text-emerald-500" /> Completed
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-xs font-bold text-slate-400 hover:text-slate-600">View Report</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">No resources uploaded yet</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">Upload notes, question banks, or reference materials for your students.</p>
                        <button className="px-6 py-2 bg-cyan-700 text-white font-bold rounded-xl text-sm hover:bg-cyan-800 transition-all">
                            Upload Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
