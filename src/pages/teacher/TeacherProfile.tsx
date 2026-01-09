import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Loader2, Save, AlertCircle, CheckCircle } from 'lucide-react';

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

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-cyan-700" /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Profile & KYC</h1>
                <p className="text-slate-500">Manage your public profile and verification status.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-8">
                <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-600' :
                            formData.kycStatus === 'rejected' ? 'bg-red-100 text-red-600' :
                                'bg-amber-100 text-amber-600'
                        }`}>
                        {formData.kycStatus === 'verified' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 capitalize">KYC Status: {formData.kycStatus}</div>
                        <div className="text-sm text-slate-500">
                            {formData.kycStatus === 'verified'
                                ? 'Your profile is verified and visible to students.'
                                : 'Complete your profile to get verified.'}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Subject</label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Hourly Rate (₹)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.hourlyRate}
                                onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Video Intro URL (Optional)</label>
                            <input
                                type="url"
                                placeholder="https://youtube.com/..."
                                value={formData.videoIntroUrl}
                                onChange={e => setFormData({ ...formData, videoIntroUrl: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">College/University</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. IIT Delhi"
                                value={formData.college}
                                onChange={e => setFormData({ ...formData, college: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Years of Experience</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 5 years"
                                value={formData.experience}
                                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Bio</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition resize-none"
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
        </div>
    );
}
