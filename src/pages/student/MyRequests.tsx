import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Plus, MessageSquare, Loader2, CheckCircle, Clock, Edit2, Trash2, Search, SlidersHorizontal, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

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
    const [openDialog, setOpenDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setOpenDialog(true);
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
            setRequests(all.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    }

    const resetForm = () => {
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
        setEditingId(null);
    };

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

            resetForm();
            setOpenDialog(false);
            fetchRequests();
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
        setOpenDialog(true);
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

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="w-full space-y-8 p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Requests</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Post a requirement and let teachers contact you.</p>
                </div>

                <Dialog open={openDialog} onOpenChange={(open) => {
                    setOpenDialog(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-cyan-700 hover:bg-cyan-800 text-white gap-2 font-bold px-6">
                            <Plus size={18} /> New Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Request' : 'Create New Request'}</DialogTitle>
                            <DialogDescription>
                                Describe your learning requirements to find the perfect teacher.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => setFormData({ ...formData, type: 'tuition' })}
                                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${formData.type === 'tuition' ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-950' : 'border-slate-100 hover:border-slate-200 dark:border-slate-800'}`}
                                >
                                    <h3 className={`font-bold ${formData.type === 'tuition' ? 'text-cyan-700' : 'text-slate-700 dark:text-slate-300'}`}>Private Tuition</h3>
                                    <p className="text-xs text-slate-500 mt-1">One-on-one custom learning</p>
                                </div>
                                <div
                                    onClick={() => setFormData({ ...formData, type: 'batch' })}
                                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${formData.type === 'batch' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950' : 'border-slate-100 hover:border-slate-200 dark:border-slate-800'}`}
                                >
                                    <h3 className={`font-bold ${formData.type === 'batch' ? 'text-purple-700' : 'text-slate-700 dark:text-slate-300'}`}>Group Batch</h3>
                                    <p className="text-xs text-slate-500 mt-1">Learn with other students</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <Select value={formData.subject} onValueChange={(val: string) => setFormData({ ...formData, subject: val })} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                                            <SelectItem value="Physics">Physics</SelectItem>
                                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                                            <SelectItem value="Biology">Biology</SelectItem>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Course / Level</label>
                                    <Select value={formData.course} onValueChange={(val: string) => setFormData({ ...formData, course: val })} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="JEE Mains/Adv">JEE Mains/Adv</SelectItem>
                                            <SelectItem value="NEET">NEET</SelectItem>
                                            <SelectItem value="CBSE Board (10th)">CBSE Board (10th)</SelectItem>
                                            <SelectItem value="CBSE Board (12th)">CBSE Board (12th)</SelectItem>
                                            <SelectItem value="ICSE/ISC">ICSE/ISC</SelectItem>
                                            <SelectItem value="Foundation (8-10)">Foundation (8-10)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Specific Topic</label>
                                <Input
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    placeholder="e.g. Organic Chemistry, Calculus, Shakespeare"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Preferred Time</label>
                                    <Select value={formData.timeSlot} onValueChange={(val: string) => setFormData({ ...formData, timeSlot: val })} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Time Slot" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</SelectItem>
                                            <SelectItem value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</SelectItem>
                                            <SelectItem value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</SelectItem>
                                            <SelectItem value="Night (8 PM - 11 PM)">Night (8 PM - 11 PM)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Budget (₹{formData.budget}/hr)</label>
                                    <Input
                                        type="range"
                                        min="200"
                                        max="2000"
                                        step="50"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="h-2 p-0 bg-transparent border-0"
                                    />
                                    <div className="flex justify-between text-[10px] text-zinc-500">
                                        <span>₹200</span>
                                        <span>₹2000</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description (Optional)</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Any specific requirements or details..."
                                    rows={3}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Preferred Teacher (Optional)</label>
                                <Select
                                    value={formData.preferredTeacherId || "any"}
                                    onValueChange={(val: string) => {
                                        const processedVal = val === 'any' ? '' : val;
                                        const teacher = teachers.find(t => t.id === processedVal);
                                        setFormData({
                                            ...formData,
                                            preferredTeacherId: processedVal,
                                            preferredTeacherName: teacher ? teacher.name : ''
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Any Teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any Teacher</SelectItem>
                                        {teachers.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name} ({t.subject})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                <Button type="submit" disabled={submitting} className="bg-cyan-700 hover:bg-cyan-800 text-white">
                                    {submitting && <Loader2 className="animate-spin mr-2" size={16} />}
                                    {editingId ? 'Update Request' : 'Post Request'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        type="text"
                        placeholder="Search your requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-0 bg-transparent focus-visible:ring-0"
                    />
                </div>
                <div className="w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
                <div className="flex items-center gap-2 px-2">
                    <SlidersHorizontal size={18} className="text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent text-sm font-medium outline-none cursor-pointer text-slate-700 dark:text-slate-300 border-none focus:ring-0"
                    >
                        <option value="All">All Status</option>
                        <option value="Open">Open</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="text-slate-400" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                                No requests found
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                                Try adjusting your filters or create a new request to get started.
                            </p>
                            <Button onClick={() => setOpenDialog(true)} className="bg-cyan-700 hover:bg-cyan-800 text-white">
                                <Plus size={16} className="mr-2" /> New Request
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredRequests.map(req => (
                        <Card key={req.id} className="overflow-hidden hover:shadow-md transition-all">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row">
                                    <div className={`w-full sm:w-2 bg-gradient-to-b ${req.status === 'accepted' ? 'from-emerald-400 to-emerald-600' : req.status === 'closed' ? 'from-slate-300 to-slate-400' : 'from-cyan-400 to-blue-600'} h-2 sm:h-auto`} />

                                    <div className="flex-1 p-6 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline" className={`${req.type === 'batch' ? 'border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/20' : 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20'}`}>
                                                        {req.type === 'batch' ? 'Group Batch' : 'Private Tuition'}
                                                    </Badge>
                                                    <Badge variant={req.status === 'accepted' ? 'default' : req.status === 'closed' ? 'secondary' : 'outline'} className={req.status === 'accepted' ? 'bg-emerald-600' : req.status === 'open' ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}>
                                                        {req.status === 'accepted' && <CheckCircle size={12} className="mr-1" />}
                                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{req.topic}</h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1.5"><BookOpen size={14} /> {req.subject}</span>
                                                    <span className="flex items-center gap-1.5"><GraduationCap size={14} /> {req.course}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-cyan-700 dark:text-cyan-400">₹{req.budget}<span className="text-sm font-normal text-slate-500">/hr</span></div>
                                                <div className="text-xs text-slate-400 mt-1 flex items-center justify-end gap-1">
                                                    <Clock size={12} /> {req.timeSlot}
                                                </div>
                                            </div>
                                        </div>

                                        {req.description && (
                                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-300">
                                                {req.description}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="text-xs text-slate-400">
                                                Posted on {req.createdAt.toDate().toLocaleDateString()}
                                            </div>
                                            {req.status === 'open' && (
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(req)} className="h-8 w-8 p-0 text-slate-500 hover:text-cyan-700">
                                                        <Edit2 size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(req.id)} className="h-8 w-8 p-0 text-slate-500 hover:text-red-600">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
