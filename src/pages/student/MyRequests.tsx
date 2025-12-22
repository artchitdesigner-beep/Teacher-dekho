import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { Plus, MessageSquare, Loader2, CheckCircle, Clock } from 'lucide-react';

interface Request {
    id: string;
    topic: string;
    description: string;
    budget: string;
    status: 'open' | 'accepted' | 'closed';
    createdAt: Timestamp;
}

export default function MyRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        topic: '',
        description: '',
        budget: ''
    });

    useEffect(() => {
        if (user) fetchRequests();
    }, [user]);

    async function fetchRequests() {
        if (!user) return;
        try {
            const q = query(
                collection(db, 'open_requests'),
                where('studentId', '==', user.uid),
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);

        try {
            await addDoc(collection(db, 'open_requests'), {
                studentId: user.uid,
                studentName: user.displayName || 'Student',
                topic: formData.topic,
                description: formData.description,
                budget: formData.budget,
                status: 'open',
                createdAt: Timestamp.now()
            });

            setFormData({ topic: '', description: '', budget: '' });
            setShowForm(false);
            fetchRequests(); // Refresh list
        } catch (error) {
            console.error('Error creating request:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">My Requests</h1>
                    <p className="text-slate-500">Post a requirement and let teachers contact you.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    New Request
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Request</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                required
                                placeholder="Topic (e.g. Organic Chemistry)"
                                value={formData.topic}
                                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <input
                                type="number"
                                placeholder="Budget (₹/hr) - Optional"
                                value={formData.budget}
                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <textarea
                            required
                            rows={3}
                            placeholder="Describe what you need help with..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : 'Post Request'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {requests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                        <MessageSquare className="mx-auto text-slate-300 mb-3" size={32} />
                        <p className="text-slate-500">You haven't posted any requests yet.</p>
                    </div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-slate-900 text-lg">{req.topic}</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase ${req.status === 'open' ? 'bg-blue-50 text-blue-600' :
                                            req.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {req.status}
                                    </span>
                                </div>
                                <p className="text-slate-500 mb-2">{req.description}</p>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {req.createdAt.toDate().toLocaleDateString()}</span>
                                    {req.budget && <span>Budget: ₹{req.budget}/hr</span>}
                                </div>
                            </div>
                            {req.status === 'accepted' && (
                                <button className="px-4 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-xl flex items-center gap-2">
                                    <CheckCircle size={18} /> Accepted
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
