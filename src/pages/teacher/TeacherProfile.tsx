import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Save, AlertCircle, CheckCircle, Database, Trash2 } from 'lucide-react';

export default function TeacherProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        hourlyRate: '',
        bio: '',
        videoIntroUrl: '',
        college: '',
        experience: '',
        kycStatus: 'pending'
    });

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        name: data.name || '',
                        subject: data.subject || '',
                        hourlyRate: data.hourlyRate?.toString() || '',
                        bio: data.bio || '',
                        videoIntroUrl: data.videoIntroUrl || '',
                        college: data.college || '',
                        experience: data.experience || '',
                        kycStatus: data.kycStatus || 'pending'
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage({ type: 'error', text: 'Failed to load profile' });
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        setMessage(null);

        try {
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                name: formData.name,
                subject: formData.subject,
                hourlyRate: parseFloat(formData.hourlyRate),
                bio: formData.bio,
                videoIntroUrl: formData.videoIntroUrl,
                college: formData.college,
                experience: formData.experience
            });

            // Also update the public 'teachers' collection if it exists
            const teacherRef = doc(db, 'teachers', user.uid);
            const teacherSnap = await getDoc(teacherRef);
            if (teacherSnap.exists()) {
                await updateDoc(teacherRef, {
                    name: formData.name,
                    subject: formData.subject,
                    hourlyRate: parseFloat(formData.hourlyRate),
                    bio: formData.bio,
                    college: formData.college,
                    experience: formData.experience
                });
            }

            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleSeedData = async () => {
        if (!user) return;
        if (!confirm('This will add demo students and batches to your account. Continue?')) return;

        setSaving(true);
        setMessage(null);
        try {
            // Seed Students (Bookings)
            const bookingsRef = collection(db, 'bookings');
            const demoStudents = [
                { name: 'Aarav Sharma', email: 'aarav@example.com', topic: 'Physics - Mechanics' },
                { name: 'Vivaan Gupta', email: 'vivaan@example.com', topic: 'Math - Calculus' },
                { name: 'Diya Patel', email: 'diya@example.com', topic: 'Chemistry - Organic' },
                { name: 'Ananya Singh', email: 'ananya@example.com', topic: 'Physics - Optics' },
                { name: 'Vihaan Kumar', email: 'vihaan@example.com', topic: 'Math - Algebra' },
            ];

            for (const student of demoStudents) {
                await addDoc(bookingsRef, {
                    teacherId: user.uid,
                    teacherName: formData.name || 'Teacher',
                    studentId: 'demo_student_' + Math.random().toString(36).substr(2, 9),
                    studentName: student.name,
                    studentEmail: student.email,
                    topic: student.topic,
                    status: 'confirmed',
                    scheduledAt: Timestamp.fromDate(new Date(Date.now() + Math.random() * 1000000000)), // Future date
                    createdAt: Timestamp.now(),
                    amount: 500
                });
            }

            // Seed Batches
            const batchesRef = collection(db, 'batches');
            const demoBatches = [
                { name: 'Class 12 Physics Crash Course', subject: 'Physics', students: 12 },
                { name: 'JEE Mains Math Prep', subject: 'Mathematics', students: 8 },
                { name: 'NEET Chemistry Foundation', subject: 'Chemistry', students: 15 },
            ];

            for (const batch of demoBatches) {
                await addDoc(batchesRef, {
                    teacherId: user.uid,
                    name: batch.name,
                    subject: batch.subject,
                    description: 'Intensive course for upcoming exams.',
                    startDate: Timestamp.fromDate(new Date()),
                    status: 'active',
                    enrolledCount: batch.students,
                    maxStudents: 20,
                    price: 4999,
                    createdAt: Timestamp.now()
                });
            }
            setMessage({ type: 'success', text: 'Demo data added successfully!' });
        } catch (error) {
            console.error('Error seeding data:', error);
            setMessage({ type: 'error', text: 'Failed to seed data.' });
        } finally {
            setSaving(false);
        }
    };

    const handleClearData = async () => {
        if (!user) return;
        if (!confirm('This will DELETE all your students and batches. This cannot be undone. Continue?')) return;

        setSaving(true);
        setMessage(null);
        try {
            // Delete Bookings
            const bookingsQ = query(collection(db, 'bookings'), where('teacherId', '==', user.uid));
            const bookingsSnap = await getDocs(bookingsQ);
            const deleteBookingPromises = bookingsSnap.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deleteBookingPromises);

            // Delete Batches
            const batchesQ = query(collection(db, 'batches'), where('teacherId', '==', user.uid));
            const batchesSnap = await getDocs(batchesQ);
            const deleteBatchPromises = batchesSnap.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deleteBatchPromises);

            setMessage({ type: 'success', text: 'All data cleared successfully!' });
        } catch (error) {
            console.error('Error clearing data:', error);
            setMessage({ type: 'error', text: 'Failed to clear data.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-cyan-700" /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-2">Profile & KYC</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your public profile and verification status.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 mb-8">
                <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.kycStatus === 'verified' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                        formData.kycStatus === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                            'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        }`}>
                        {formData.kycStatus === 'verified' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 capitalize">KYC Status: {formData.kycStatus}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            {formData.kycStatus === 'verified'
                                ? 'Your profile is verified and visible to students.'
                                : 'Complete your profile to get verified.'}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition text-slate-900 dark:text-slate-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hourly Rate (₹)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.hourlyRate}
                                onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition text-slate-900 dark:text-slate-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Video Intro URL (Optional)</label>
                            <input
                                type="url"
                                placeholder="https://youtube.com/..."
                                value={formData.videoIntroUrl}
                                onChange={e => setFormData({ ...formData, videoIntroUrl: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">College/University</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. IIT Delhi"
                                value={formData.college}
                                onChange={e => setFormData({ ...formData, college: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition text-slate-900 dark:text-slate-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Years of Experience</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 5 years"
                                value={formData.experience}
                                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition resize-none text-slate-900 dark:text-slate-100"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Developer Tools */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Database size={20} className="text-cyan-600" />
                    Developer Tools
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                    Use these tools to populate your dashboard with dummy data for testing purposes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        type="button"
                        onClick={handleSeedData}
                        disabled={saving}
                        className="px-6 py-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 font-bold rounded-xl hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                        Seed Demo Data
                    </button>
                    <button
                        type="button"
                        onClick={handleClearData}
                        disabled={saving}
                        className="px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                        Clear All Data
                    </button>
                </div>
            </div>
        </div>
    );
}
