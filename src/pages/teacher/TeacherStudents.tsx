import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Search, Filter, User, MoreVertical, Mail, Loader2, Users, BookOpen, Clock, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    const [activeTab, setActiveTab] = useState<'requests' | 'current' | 'refer'>('requests');
    const [requestType, setRequestType] = useState<'tuition' | 'batch'>('tuition');
    const [referMode, setReferMode] = useState<'new' | 'existing'>('new');
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<StudentStats[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    async function fetchData() {
        if (!user) return;
        try {
            // Fetch students logic (simplified for now to basic confirmed bookings)
            const q = query(
                collection(db, 'bookings'),
                where('teacherId', '==', user.uid),
            );
            const snap = await getDocs(q);
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

            // Process Students
            const studentMap = new Map<string, StudentStats>();

            data.forEach(booking => {
                // Only count active confirmed students for 'Current Students' tab essentially
                // logic can be refined based on stricter 'active' status
                const studentId = booking.studentId || booking.studentName;

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

    // Dummy data for New Requests (Using 'requests' tab now instead of separate page? User said "New Requests" in "My Students" page)
    // Note: User also has a separate "Requests" page in sidebar. This might be redundant or a specific "New Student Inquiries" tab. 
    // I will implement a placeholder list for "New Requests" here as requested.
    const newRequests = [
        { id: 1, type: 'tuition', name: "Rahul Gupta", subject: "Physics", message: "Interested in your mechanics batch.", date: "2 mins ago" },
        { id: 2, type: 'tuition', name: "Sneha Redy", subject: "Maths", message: "Do you teach Calculus?", date: "1 hour ago" },
        { id: 3, type: 'batch', name: "Group Study", subject: "Organic Chemistry", message: "5 students waiting for a batch.", date: "3 hours ago", count: 5 },
        { id: 4, type: 'batch', name: "Physics Class 12", subject: "Electrostatics", message: "Looking for weekend masterclass.", date: "5 hours ago", count: 8 },
    ];

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Students</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your student relationships.</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'requests'
                            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        New Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('current')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'current'
                            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        Current Students
                    </button>
                    <button
                        onClick={() => setActiveTab('refer')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'refer'
                            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        Refer Students
                    </button>
                </div>
            </div>

            {navContent()}
        </div>
    );

    function navContent() {
        switch (activeTab) {
            case 'requests': {
                const tuitionReqs = newRequests.filter(r => r.type === 'tuition');
                const batchReqs = newRequests.filter(r => r.type === 'batch');

                return (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <Tabs value={requestType} onValueChange={(v: any) => setRequestType(v)} className="w-full">
                            <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                                <TabsTrigger value="tuition" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm font-bold px-6">
                                    Tuition Requests
                                    <Badge className="ml-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-none">{tuitionReqs.length}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="batch" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm font-bold px-6">
                                    Batch Requests
                                    <Badge className="ml-2 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 border-none">{batchReqs.length}</Badge>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="tuition" className="space-y-4 outline-none">
                                {tuitionReqs.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">No new tuition requests.</div>
                                ) : (
                                    tuitionReqs.map(req => (
                                        <Card key={req.id} className="rounded-3xl border-slate-200 dark:border-slate-800 overflow-hidden hover:border-cyan-200 transition-colors">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center font-bold text-lg">
                                                            {req.name[0]}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-bold text-slate-900 dark:text-slate-100">{req.name}</h3>
                                                                <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-200 uppercase font-black tracking-tight">Direct Tuition</Badge>
                                                            </div>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{req.message}</p>
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 uppercase">
                                                                    <BookOpen size={10} className="text-cyan-500" /> {req.subject}
                                                                </span>
                                                                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                                                    <Clock size={10} className="text-cyan-500" /> {req.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-none border-slate-50 dark:border-slate-800">
                                                        <Button variant="ghost" size="sm" className="flex-1 sm:flex-none rounded-xl text-slate-500 font-bold hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                                                            <X size={16} className="mr-2" /> Reject
                                                        </Button>
                                                        <Button size="sm" className="flex-1 sm:flex-none rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold shadow-lg shadow-cyan-900/20">
                                                            <Check size={16} className="mr-2" /> Accept
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="batch" className="space-y-4 outline-none">
                                {batchReqs.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">No new batch formation requests.</div>
                                ) : (
                                    batchReqs.map(req => (
                                        <Card key={req.id} className="rounded-3xl border-slate-200 dark:border-slate-800 overflow-hidden hover:border-cyan-200 transition-colors">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center font-bold text-lg">
                                                            <Users size={24} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-bold text-slate-900 dark:text-slate-100">{req.name}</h3>
                                                                <Badge variant="outline" className="text-[10px] text-cyan-600 border-cyan-200 uppercase font-black tracking-tight">Batch Creation</Badge>
                                                            </div>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{req.message}</p>
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 uppercase">
                                                                    <BookOpen size={10} className="text-cyan-500" /> {req.subject}
                                                                </span>
                                                                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 uppercase">
                                                                    <Users size={10} className="text-cyan-500" /> {req.count} Students Interested
                                                                </span>
                                                                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                                                    <Clock size={10} className="text-cyan-500" /> {req.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-none border-slate-50 dark:border-slate-800">
                                                        <Button variant="ghost" size="sm" className="flex-1 sm:flex-none rounded-xl text-slate-500 font-bold hover:bg-slate-100">
                                                            Interested
                                                        </Button>
                                                        <Button size="sm" className="flex-1 sm:flex-none rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 group">
                                                            Create Batch <Check size={16} className="ml-2 group-hover:scale-125 transition-transform" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                );
            }
            case 'current':
                return (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Search & Filter */}
                        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border-none rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20 dark:text-white"
                                />
                            </div>
                            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                <Filter size={20} />
                            </button>
                        </div>

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
                    </div>
                );
            case 'refer': {
                // Dummy data for referred history
                const referredHistory = [
                    { id: 1, name: "Amit Sharma", status: 'Joined', date: '2 days ago' },
                    { id: 2, name: "Priya Patel", status: 'Pending', date: '1 week ago' },
                ];

                return (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Referral Form Section */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <User size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Refer a Student</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8">Know a student looking for guidance? Refer them to other expert teachers on the platform or invite them to join.</p>

                                <div className="bg-slate-50 dark:bg-slate-950 p-1 rounded-xl flex mb-6">
                                    <button
                                        onClick={() => setReferMode('new')}
                                        type="button"
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${referMode === 'new' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        New Student
                                    </button>
                                    <button
                                        onClick={() => setReferMode('existing')}
                                        type="button"
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${referMode === 'existing' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        Existing Student
                                    </button>
                                </div>

                                <form className="space-y-4 text-left">
                                    {referMode === 'new' ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Student Name</label>
                                                <input type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white" placeholder="Enter name" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                                <input type="email" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white" placeholder="Enter email" />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Student</label>
                                            <select className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white">
                                                <option>Select from your students...</option>
                                                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                                            </select>
                                        </div>
                                    )}

                                    <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">Send Invitation</button>
                                </form>
                            </div>
                        </div>

                        {/* Referred History List */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Referred Students</h3>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {referredHistory.map((student) => (
                                    <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500">
                                                {student.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-slate-100">{student.name}</div>
                                                <div className="text-xs text-slate-500">{student.date}</div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === 'Joined'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }
        }
    }
}
