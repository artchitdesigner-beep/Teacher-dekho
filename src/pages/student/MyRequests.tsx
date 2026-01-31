import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Plus, MessageSquare, Loader2, CheckCircle, Clock, Edit2, Trash2, X, Search, SlidersHorizontal } from 'lucide-react';

interface Request {
    id: string;
    topic: string;
    description: string;
    budget: string;
    subject: string;
    course: string;
    timeSlot: string;
    type: 'tuition' | 'batch';
    status: 'open' | 'accepted' | 'closed';
    createdAt: Timestamp;
    preferredTeacherId?: string;
    preferredTeacherName?: string;
}

export default function MyRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<Request[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setShowForm(true);
            // Clear the param so refreshing doesn't reopen it
            setSearchParams({}, { replace: true });
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        topic: '',
        description: '',
        budget: '500',
        subject: '',
        course: '',
        timeSlot: '',
        type: 'tuition' as 'tuition' | 'batch',
        preferredTeacherId: '',
        preferredTeacherName: ''
    });

    useEffect(() => {
        if (user) {
            fetchRequests();
            fetchTeachers();
        }
    }, [user]);

    async function fetchTeachers() {
        try {
            const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
            const snap = await getDocs(q);
            setTeachers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    }

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
            const data = {
                studentId: user.uid,
                studentName: user.displayName || 'Student',
                topic: formData.topic,
                description: formData.description,
                budget: formData.budget,
                subject: formData.subject,
                course: formData.course,
                timeSlot: formData.timeSlot,
                type: formData.type,
                preferredTeacherId: formData.preferredTeacherId || null,
                preferredTeacherName: formData.preferredTeacherName || null,
                status: 'open',
                updatedAt: Timestamp.now()
            };

            if (editingId) {
                await updateDoc(doc(db, 'open_requests', editingId), data);
            } else {
                await addDoc(collection(db, 'open_requests'), {
                    ...data,
                    createdAt: Timestamp.now()
                });
            }

            setFormData({
                topic: '',
                description: '',
                budget: '500',
                subject: '',
                course: '',
                timeSlot: '',
                type: 'tuition',
                preferredTeacherId: '',
                preferredTeacherName: ''
            });
            setShowForm(false);
            setEditingId(null);
            fetchRequests(); // Refresh list
        } catch (error) {
            console.error('Error saving request:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (req: Request) => {
        setFormData({
            topic: req.topic,
            description: req.description,
            budget: req.budget,
            subject: req.subject,
            course: req.course,
            timeSlot: req.timeSlot,
            type: req.type || 'tuition',
            preferredTeacherId: req.preferredTeacherId || '',
            preferredTeacherName: req.preferredTeacherName || ''
        });
        setEditingId(req.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this request?')) return;
        try {
            await deleteDoc(doc(db, 'open_requests', id));
            setRequests(requests.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || req.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Requests</h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">Post a requirement and let teachers contact you.</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm && editingId) {
                            setEditingId(null);
                            setFormData({
                                topic: '',
                                description: '',
                                budget: '500',
                                subject: '',
                                course: '',
                                timeSlot: '',
                                type: 'tuition',
                                preferredTeacherId: '',
                                preferredTeacherName: ''
                            });
                        } else {
                            setShowForm(!showForm);
                        }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all flex items-center justify-center gap-2"
                >
                    {showForm && editingId ? <X size={20} /> : <Plus size={20} />}
                    {showForm && editingId ? 'Cancel Edit' : 'New Request'}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search your requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none transition dark:text-white"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Open">Open</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl animate-in slide-in-from-top-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                        {editingId ? 'Edit Request' : 'Create New Request'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'tuition' })}
                                className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${formData.type === 'tuition' ? 'border-cyan-700 bg-cyan-50/50 dark:bg-cyan-900/20' : 'border-slate-100 dark:border-slate-800'}`}
                            >
                                <div className="font-bold text-slate-900 dark:text-slate-100 italic">Personal Tuition</div>
                                <div className="text-xs text-slate-500">One-on-one session for specific topics</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'batch' })}
                                className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${formData.type === 'batch' ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-900/20' : 'border-slate-100 dark:border-slate-800'}`}
                            >
                                <div className="font-bold text-slate-900 dark:text-slate-100 italic">Batch Request</div>
                                <div className="text-xs text-slate-500">Request to start a new group batch</div>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                                <select
                                    required
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm dark:text-white"
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
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Course / Level</label>
                                <select
                                    required
                                    value={formData.course}
                                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm dark:text-white"
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
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Specific Topic</label>
                                <input
                                    required
                                    placeholder="e.g. Organic Chemistry, Calculus"
                                    value={formData.topic}
                                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preferred Time Slot</label>
                                <select
                                    required
                                    value={formData.timeSlot}
                                    onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm dark:text-white"
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
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preferred Teacher (Optional)</label>
                            <select
                                value={formData.preferredTeacherId}
                                onChange={e => {
                                    const teacher = teachers.find(t => t.id === e.target.value);
                                    setFormData({
                                        ...formData,
                                        preferredTeacherId: e.target.value,
                                        preferredTeacherName: teacher ? teacher.name : ''
                                    });
                                }}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm dark:text-white"
                            >
                                <option value="">Any Teacher</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name} ({teacher.subject})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Budget: ₹{formData.budget}/hr</label>
                            </div>
                            <input
                                type="range"
                                min="200"
                                max="2000"
                                step="50"
                                value={formData.budget}
                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-700"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                <span>₹200</span>
                                <span>₹2000</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description (Optional)</label>
                            <textarea
                                rows={3}
                                placeholder="Describe what you need help with..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none resize-none text-sm dark:text-white"
                            />
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="w-full sm:w-auto px-6 py-2.5 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full sm:w-auto px-8 py-2.5 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all disabled:opacity-50 shadow-lg shadow-cyan-100 flex items-center justify-center gap-2 text-sm"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Update Request' : 'Post Request')}
                            </button>
                        </div>
                    </form>
                </div >
            )
            }

            <div className="grid grid-cols-1 gap-4">
                {filteredRequests.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <MessageSquare className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={32} />
                        <p className="text-slate-500 dark:text-slate-400">No requests found matching your criteria.</p>
                    </div>
                ) : (
                    filteredRequests.map(req => (
                        <div key={req.id} className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base md:text-lg truncate">{req.topic}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${req.type === 'batch' ? 'bg-purple-100 text-purple-700' : 'bg-cyan-100 text-cyan-700'}`}>
                                        {req.type || 'tuition'}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${req.status === 'open' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                                        req.status === 'accepted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                        }`}>
                                        {req.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="text-[10px] md:text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium">{req.subject}</span>
                                    <span className="text-[10px] md:text-xs bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 px-2 py-1 rounded-lg font-medium">{req.course}</span>
                                    <span className="text-[10px] md:text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg font-medium">{req.timeSlot}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 mb-3 text-sm line-clamp-2">{req.description}</p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] md:text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {req.createdAt.toDate().toLocaleDateString()}</span>
                                    {req.budget && <span className="font-bold text-slate-600 dark:text-slate-300">Budget: ₹{req.budget}/hr</span>}
                                </div>
                            </div>
                            {req.status === 'open' && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(req)}
                                        className="p-2 text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-all"
                                        title="Edit Request"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(req.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                        title="Delete Request"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                            {req.status === 'accepted' && (
                                <div className="flex sm:justify-end">
                                    <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-xl flex items-center gap-2">
                                        <CheckCircle size={18} /> Accepted
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div >
    );
}
