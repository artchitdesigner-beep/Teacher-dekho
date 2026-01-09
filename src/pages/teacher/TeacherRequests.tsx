import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { Loader2, User, CheckCircle, Search, SlidersHorizontal } from 'lucide-react';

interface Request {
    id: string;
    studentName: string;
    topic: string;
    description: string;
    budget: string;
    createdAt: Timestamp;
}

export default function TeacherRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');

    useEffect(() => {
        fetchRequests();
    }, []);

    async function fetchRequests() {
        try {
            const q = query(
                collection(db, 'open_requests'),
                where('status', '==', 'open'),
                orderBy('createdAt', 'desc')
            );
            const snap = await getDocs(q);
            setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request)));
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAccept = async (reqId: string) => {
        if (!user) return;
        setProcessing(reqId);
        try {
            await updateDoc(doc(db, 'open_requests', reqId), {
                status: 'accepted',
                acceptedBy: user.uid,
                acceptedAt: Timestamp.now()
            });

            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== reqId));
            alert('Request accepted! You can now contact the student.');
        } catch (error) {
            console.error('Error accepting request:', error);
        } finally {
            setProcessing(null);
        }
    };

    const subjects = ['All', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'English', 'Computer Science'];

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || req.topic.toLowerCase().includes(selectedSubject.toLowerCase());
        return matchesSearch && matchesSubject;
    });

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Open Requests</h1>
                <p className="text-slate-500">Find students looking for help in your subject.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none transition"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-slate-400" />
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-cyan-500"
                    >
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRequests.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-100">
                        <CheckCircle className="mx-auto text-slate-300 mb-3" size={32} />
                        <p className="text-slate-500">No open requests at the moment.</p>
                    </div>
                ) : (
                    filteredRequests.map(req => (
                        <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{req.studentName}</div>
                                        <div className="text-xs text-slate-500">{req.createdAt.toDate().toLocaleDateString()}</div>
                                    </div>
                                </div>
                                {req.budget && (
                                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold">
                                        ₹{req.budget}/hr
                                    </div>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2">{req.topic}</h3>
                            <p className="text-slate-500 text-sm mb-6">{req.description}</p>

                            <button
                                onClick={() => handleAccept(req.id)}
                                disabled={!!processing}
                                className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing === req.id ? <Loader2 className="animate-spin" /> : 'Accept Request'}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
