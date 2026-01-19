import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Search, Filter, User, BookOpen, MoreVertical, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Session {
    id: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    scheduledAt: Timestamp;
}

interface Booking {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail?: string; // Assuming we might have this
    topic: string;
    totalSessions: number;
    sessions: Session[];
    status: 'active' | 'pending' | 'completed' | 'rejected';
    createdAt: Timestamp;
}

interface StudentStats {
    id: string;
    name: string;
    email: string;
    totalBatches: number;
    activeBatches: number;
    completedSessions: number;
    joinedAt: Date;
}

export default function TeacherStudents() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'students' | 'batches'>('students');
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [students, setStudents] = useState<StudentStats[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    async function fetchData() {
        if (!user) return;
        try {
            const q = query(
                collection(db, 'bookings'),
                where('teacherId', '==', user.uid)
            );
            const snap = await getDocs(q);
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
            setBookings(data);

            // Process Students
            const studentMap = new Map<string, StudentStats>();

            data.forEach(booking => {
                const studentId = booking.studentId || booking.studentName; // Fallback

                if (!studentMap.has(studentId)) {
                    studentMap.set(studentId, {
                        id: studentId,
                        name: booking.studentName,
                        email: booking.studentEmail || 'No email',
                        totalBatches: 0,
                        activeBatches: 0,
                        completedSessions: 0,
                        joinedAt: booking.createdAt.toDate()
                    });
                }

                const stats = studentMap.get(studentId)!;
                stats.totalBatches += 1;
                if (booking.status === 'active') stats.activeBatches += 1;
                stats.completedSessions += booking.sessions?.filter(s => s.status === 'completed').length || 0;

                // Keep earliest date
                if (booking.createdAt.toDate() < stats.joinedAt) {
                    stats.joinedAt = booking.createdAt.toDate();
                }
            });

            setStudents(Array.from(studentMap.values()));

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredBatches = bookings.filter(b =>
        b.status === 'active' &&
        (b.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Students</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your students and running batches.</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'students'
                            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        Students
                    </button>
                    <button
                        onClick={() => setActiveTab('batches')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'batches'
                            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        Running Batches
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder={activeTab === 'students' ? "Search students..." : "Search batches..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border-none rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                </div>
                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <Filter size={20} />
                </button>
            </div>

            {/* Content */}
            {activeTab === 'students' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map(student => (
                        <div key={student.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-2xl flex items-center justify-center font-bold text-lg">
                                        {student.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-slate-100">{student.name}</h3>
                                        <p className="text-xs text-slate-500">Joined {student.joinedAt.toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                    <div className="text-xs text-slate-500 mb-1">Active Batches</div>
                                    <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{student.activeBatches}</div>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                    <div className="text-xs text-slate-500 mb-1">Sessions Done</div>
                                    <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{student.completedSessions}</div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 font-bold rounded-xl text-sm hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors flex items-center justify-center gap-2">
                                    <Mail size={16} /> Message
                                </button>
                                <button className="flex-1 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                                    <User size={16} /> Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-slate-500 text-sm">Batch Name</th>
                                    <th className="px-6 py-4 font-bold text-slate-500 text-sm">Student</th>
                                    <th className="px-6 py-4 font-bold text-slate-500 text-sm">Progress</th>
                                    <th className="px-6 py-4 font-bold text-slate-500 text-sm">Next Session</th>
                                    <th className="px-6 py-4 font-bold text-slate-500 text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredBatches.map(batch => {
                                    const completed = batch.sessions?.filter(s => s.status === 'completed').length || 0;
                                    const progress = (completed / batch.totalSessions) * 100;
                                    const nextSession = batch.sessions?.find(s => s.status === 'confirmed' && s.scheduledAt.toMillis() > Date.now());

                                    return (
                                        <tr key={batch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-700 dark:text-cyan-400">
                                                        <BookOpen size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-slate-100">{batch.topic}</div>
                                                        <div className="text-xs text-slate-500">ID: {batch.id.slice(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-bold">
                                                        {batch.studentName[0]}
                                                    </div>
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">{batch.studentName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-32">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-bold text-slate-500">{completed}/{batch.totalSessions}</span>
                                                        <span className="font-bold text-cyan-700">{Math.round(progress)}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {nextSession ? (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                        <Calendar size={14} className="text-cyan-500" />
                                                        {nextSession.scheduledAt.toDate().toLocaleDateString()}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Not scheduled</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/teacher/bookings/${batch.id}`}
                                                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-700 transition-all"
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
