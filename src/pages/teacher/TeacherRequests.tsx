import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { Loader2, User, CheckCircle, Search, SlidersHorizontal, X } from 'lucide-react';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');

    // Remark Modal State
    const [remarkModal, setRemarkModal] = useState<{ isOpen: boolean, reqId: string | null }>({
        isOpen: false,
        reqId: null
    });
    const [remarkText, setRemarkText] = useState('');
    const [processing, setProcessing] = useState(false);

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

    const openAcceptModal = (reqId: string) => {
        setRemarkModal({ isOpen: true, reqId });
        setRemarkText('');
    };

    const handleAccept = async () => {
        if (!user || !remarkModal.reqId) return;
        setProcessing(true);
        try {
            await updateDoc(doc(db, 'open_requests', remarkModal.reqId), {
                status: 'accepted',
                acceptedBy: user.uid,
                acceptedAt: Timestamp.now(),
                teacherRemark: remarkText
            });

            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== remarkModal.reqId));

        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Failed to accept request.');
        } finally {
            setProcessing(false);
            setRemarkModal({ isOpen: false, reqId: null });
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
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Open Requests</h1>
                <p className="text-slate-500 dark:text-slate-400">Find students looking for help in your subject.</p>
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
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none transition text-slate-900 dark:text-slate-100"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-slate-400" />
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:ring-2 focus:ring-cyan-500"
                    >
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRequests.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={32} />
                        <p className="text-slate-500 dark:text-slate-400">No open requests at the moment.</p>
                    </div>
                ) : (
                    filteredRequests.map(req => (
                        <div key={req.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-slate-100">{req.studentName}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{req.createdAt.toDate().toLocaleDateString()}</div>
                                    </div>
                                </div>
                                {req.budget && (
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg text-sm font-bold">
                                        ₹{req.budget}/hr
                                    </div>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{req.topic}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{req.description}</p>

                            <button
                                onClick={() => openAcceptModal(req.id)}
                                className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                Accept Request
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Remark Modal */}
            {remarkModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Accept Request</h3>
                            <button onClick={() => setRemarkModal({ isOpen: false, reqId: null })} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                <X size={20} className="text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>

                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                            Add a note for the student (e.g., "I can help you with this. I am available from 5 PM.").
                        </p>

                        <textarea
                            value={remarkText}
                            onChange={(e) => setRemarkText(e.target.value)}
                            placeholder="Write your remark here..."
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none resize-none h-32 mb-6 text-slate-900 dark:text-slate-100"
                        ></textarea>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setRemarkModal({ isOpen: false, reqId: null })}
                                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={processing || !remarkText.trim()}
                                className="flex-1 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : 'Confirm Accept'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
