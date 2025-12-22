import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Plus, MessageSquare, Loader2, CheckCircle, Clock } from 'lucide-react';

interface Request {
    id: string;
    topic: string;
    description: string;
    budget: string;
    subject: string;
    course: string;
    timeSlot: string;
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
        budget: '500',
        subject: '',
        course: '',
        timeSlot: ''
    });

    useEffect(() => {
        if (user) fetchRequests();
    }, [user]);

    async function fetchRequests() {
        if (!user) return;
        try {
            const q = query(
                collection(db, 'open_requests'),
                where('studentId', '==', user.uid)
            );
            const snap = await getDocs(q);
            const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request));
            // Memory sort to avoid composite index
            setRequests(all.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
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
                subject: formData.subject,
                course: formData.course,
                timeSlot: formData.timeSlot,
                status: 'open',
                createdAt: Timestamp.now()
            });

            setFormData({ topic: '', description: '', budget: '500', subject: '', course: '', timeSlot: '' });
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">My Requests</h1>
                    <p className="text-sm md:text-base text-slate-500">Post a requirement and let teachers contact you.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    New Request
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl animate-in slide-in-from-top-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Request</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                <select
                                    required
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                >
                                    <option value="">Select Subject</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Biology">Biology</option>
                                    <option value="English">English</option>
                                    <option value="Computer Science">Computer Science</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Course / Level</label>
                                <select
                                    required
                                    value={formData.course}
                                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                >
                                    <option value="">Select Course</option>
                                    <option value="JEE Mains/Adv">JEE Mains/Adv</option>
                                    <option value="NEET">NEET</option>
                                    <option value="CBSE Board (10th)">CBSE Board (10th)</option>
                                    <option value="CBSE Board (12th)">CBSE Board (12th)</option>
                                    <option value="ICSE/ISC">ICSE/ISC</option>
                                    <option value="Foundation (8-10)">Foundation (8-10)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Specific Topic</label>
                                <input
                                    required
                                    placeholder="e.g. Organic Chemistry, Calculus"
                                    value={formData.topic}
                                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Time Slot</label>
                                <select
                                    required
                                    value={formData.timeSlot}
                                    onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                >
                                    <option value="">Select Time Slot</option>
                                    <option value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</option>
                                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                                    <option value="Night (8 PM - 11 PM)">Night (8 PM - 11 PM)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700">Budget: ₹{formData.budget}/hr</label>
                            </div>
                            <input
                                type="range"
                                min="200"
                                max="2000"
                                step="50"
                                value={formData.budget}
                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                <span>₹200</span>
                                <span>₹2000</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
                            <textarea
                                rows={3}
                                placeholder="Describe what you need help with..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
                            />
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="w-full sm:w-auto px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full sm:w-auto px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 text-sm"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Post Request'}
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
                        <div key={req.id} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-900 text-base md:text-lg truncate">{req.topic}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${req.status === 'open' ? 'bg-blue-50 text-blue-600' :
                                        req.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {req.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="text-[10px] md:text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">{req.subject}</span>
                                    <span className="text-[10px] md:text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-medium">{req.course}</span>
                                    <span className="text-[10px] md:text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-lg font-medium">{req.timeSlot}</span>
                                </div>
                                <p className="text-slate-500 mb-3 text-sm line-clamp-2">{req.description}</p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] md:text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {req.createdAt.toDate().toLocaleDateString()}</span>
                                    {req.budget && <span className="font-bold text-slate-600">Budget: ₹{req.budget}/hr</span>}
                                </div>
                            </div>
                            {req.status === 'accepted' && (
                                <div className="flex sm:justify-end">
                                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-bold rounded-xl flex items-center gap-2">
                                        <CheckCircle size={18} /> Accepted
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
