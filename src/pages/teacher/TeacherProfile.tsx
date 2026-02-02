import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Save, AlertCircle, CheckCircle, Database, Trash2, Clock, Zap, User, ShieldCheck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function TeacherProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [activeTab, setActiveTab] = useState<'basic' | 'kyc' | 'bank'>('basic');
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        hourlyRate: '',
        bio: '',
        videoIntroUrl: '',
        college: '',
        experience: '',
        kycStatus: 'pending',
        aadhar: '',
        pan: '',
        bankName: '',
        accountNumber: '',
        ifsc: ''
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
                        kycStatus: data.kycStatus || 'pending',
                        aadhar: data.aadhar || '',
                        pan: data.pan || '',
                        bankName: data.bankName || '',
                        accountNumber: data.accountNumber || '',
                        ifsc: data.ifsc || ''
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
                experience: formData.experience,
                aadhar: formData.aadhar,
                pan: formData.pan,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                ifsc: formData.ifsc
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
        <div className="w-full">
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
                        <div className="font-bold text-slate-900 dark:text-slate-100 capitalize flex items-center gap-2">
                            KYC Status: <Badge variant={formData.kycStatus === 'verified' ? 'default' : 'secondary'} className={formData.kycStatus === 'verified' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>{formData.kycStatus}</Badge>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {formData.kycStatus === 'verified'
                                ? 'Your profile is verified and visible to students.'
                                : 'Complete your profile to get verified.'}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-xl flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">120+ Hrs</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Time Saved on Admin</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">98%</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Profile Completion</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center">
                            <Zap size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">Super</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Teacher Status</div>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <TabsTrigger value="basic" className="rounded-lg py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm">
                            <User size={16} className="mr-2" /> Basic Details
                        </TabsTrigger>
                        <TabsTrigger value="kyc" className="rounded-lg py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm">
                            <ShieldCheck size={16} className="mr-2" /> KYC Verification
                        </TabsTrigger>
                        <TabsTrigger value="bank" className="rounded-lg py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm">
                            <CreditCard size={16} className="mr-2" /> Bank Info
                        </TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                }`}>
                                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                {message.text}
                            </div>
                        )}

                        <TabsContent value="basic" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Subject</label>
                                    <Input
                                        required
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Hourly Rate (₹)</label>
                                    <Input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.hourlyRate}
                                        onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Years of Experience</label>
                                    <Input
                                        required
                                        placeholder="e.g. 5 years"
                                        value={formData.experience}
                                        onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">College/University</label>
                                <Input
                                    required
                                    placeholder="e.g. IIT Delhi"
                                    value={formData.college}
                                    onChange={e => setFormData({ ...formData, college: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bio</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="kyc" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-0">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Aadhar Number</label>
                                <Input
                                    placeholder="XXXX-XXXX-XXXX"
                                    value={formData.aadhar}
                                    onChange={e => setFormData({ ...formData, aadhar: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PAN Number</label>
                                <Input
                                    placeholder="ABCDE1234F"
                                    value={formData.pan}
                                    onChange={e => setFormData({ ...formData, pan: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Video Intro URL (Optional)</label>
                                <Input
                                    type="url"
                                    placeholder="https://youtube.com/..."
                                    value={formData.videoIntroUrl}
                                    onChange={e => setFormData({ ...formData, videoIntroUrl: e.target.value })}
                                />
                            </div>
                            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 rounded-xl">
                                <div className="flex gap-3 text-amber-700 dark:text-amber-400">
                                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                    <p className="text-xs font-medium">
                                        Your government IDs are encrypted and visible only to authorized staff for verification purposes.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="bank" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-0">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bank Name</label>
                                <Input
                                    placeholder="e.g. HDFC Bank"
                                    value={formData.bankName}
                                    onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Account Number</label>
                                <Input
                                    placeholder="XXXXXXXXXXXX"
                                    value={formData.accountNumber}
                                    onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">IFSC Code</label>
                                <Input
                                    placeholder="HDFC0001234"
                                    value={formData.ifsc}
                                    onChange={e => setFormData({ ...formData, ifsc: e.target.value })}
                                />
                            </div>
                            <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900 rounded-xl">
                                <div className="flex gap-3 text-cyan-700 dark:text-cyan-400">
                                    <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                                    <p className="text-xs font-medium">
                                        Earnings are credited every Sunday to your linked bank account.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto h-12 px-8 bg-cyan-700 hover:bg-cyan-800 text-base font-bold rounded-xl shadow-lg shadow-cyan-900/10"
                            >
                                {saving ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save size={20} className="mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Tabs>
            </div>

            {/* Developer Tools */}
            <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                        <Database size={20} className="text-cyan-600" />
                        Developer Tools
                    </CardTitle>
                    <CardDescription>
                        Use these tools to populate your dashboard with dummy data for testing purposes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Button
                        variant="outline"
                        onClick={handleSeedData}
                        disabled={saving}
                        className="flex-1 bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800 dark:hover:bg-cyan-900/50"
                    >
                        {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Database size={16} className="mr-2" />}
                        Seed Demo Data
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleClearData}
                        disabled={saving}
                        className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/50"
                    >
                        {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Trash2 size={16} className="mr-2" />}
                        Clear All Data
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
