import { useState, useEffect } from 'react';
import { X, Loader2, Clock } from 'lucide-react';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

interface CreateBatchRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    preSelectedTeacherId?: string;
}

export default function CreateBatchRequestModal({ isOpen, onClose, preSelectedTeacherId }: CreateBatchRequestModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        teacherId: preSelectedTeacherId || '',
        batchName: '',
        subject: '',
        grade: '',
        startDate: '',
        startTime: '',
        endTime: '',
        days: [] as string[],
        fees: '',
        maxStudents: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchTeachers();
            if (preSelectedTeacherId) {
                setFormData(prev => ({ ...prev, teacherId: preSelectedTeacherId }));
            }
        }
    }, [isOpen, preSelectedTeacherId]);

    const fetchTeachers = async () => {
        try {
            const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
            const snap = await getDocs(q);
            setTeachers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            const selectedTeacher = teachers.find(t => t.id === formData.teacherId);

            await addDoc(collection(db, 'batch_requests'), {
                studentId: user.uid,
                studentName: user.displayName || 'Student',
                teacherId: formData.teacherId,
                teacherName: selectedTeacher?.name || 'Unknown Teacher',
                batchName: formData.batchName,
                subject: formData.subject,
                grade: formData.grade,
                startDate: Timestamp.fromDate(new Date(formData.startDate)),
                startTime: formData.startTime,
                endTime: formData.endTime,
                days: formData.days,
                fees: Number(formData.fees),
                maxStudents: Number(formData.maxStudents),
                status: 'pending',
                createdAt: Timestamp.now()
            });

            onClose();
            alert('Batch request sent successfully!');
            setFormData({
                teacherId: '',
                batchName: '',
                subject: '',
                grade: '',
                startDate: '',
                startTime: '',
                endTime: '',
                days: [],
                fees: '',
                maxStudents: ''
            });
        } catch (error) {
            console.error('Error creating batch request:', error);
            alert('Failed to send request.');
        } finally {
            setLoading(false);
        }
    };

    const toggleDay = (day: string) => {
        setFormData(prev => {
            const days = prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day];
            return { ...prev, days };
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Request Custom Batch</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Teacher Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Teacher</label>
                        <select
                            required
                            value={formData.teacherId}
                            onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white"
                        >
                            <option value="">Choose a teacher...</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name} ({teacher.subject})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Batch Name / Topic</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Physics Mechanics Masterclass"
                                value={formData.batchName}
                                onChange={e => setFormData({ ...formData, batchName: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                                <select
                                    required
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white"
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
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Grade / Class</label>
                                <select
                                    required
                                    value={formData.grade}
                                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white"
                                >
                                    <option value="">Select Grade</option>
                                    <option value="Class 10">Class 10</option>
                                    <option value="Class 11">Class 11</option>
                                    <option value="Class 12">Class 12</option>
                                    <option value="JEE">JEE</option>
                                    <option value="NEET">NEET</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Students</label>
                                <input
                                    type="number"
                                    placeholder="20"
                                    value={formData.maxStudents}
                                    onChange={e => setFormData({ ...formData, maxStudents: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Schedule Builder */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Clock size={18} className="text-cyan-600" /> Proposed Schedule
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Start Time</label>
                                    <input
                                        required
                                        type="time"
                                        value={formData.startTime}
                                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold outline-none focus:border-cyan-500 transition-colors dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">End Time</label>
                                    <input
                                        required
                                        type="time"
                                        value={formData.endTime}
                                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold outline-none focus:border-cyan-500 transition-colors dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Class Days</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                        <label key={day} className="cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="hidden peer"
                                                checked={formData.days.includes(day)}
                                                onChange={() => toggleDay(day)}
                                            />
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 peer-checked:bg-cyan-700 peer-checked:text-white peer-checked:border-cyan-700 transition-all">
                                                {day}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Proposed Fees (₹)</label>
                            <input
                                required
                                type="number"
                                placeholder="5000"
                                value={formData.fees}
                                onChange={e => setFormData({ ...formData, fees: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-colors shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Send Batch Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
