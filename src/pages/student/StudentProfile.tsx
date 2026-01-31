import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Mail, Phone, MapPin, Shield, Trash2, RefreshCw, CheckCircle, AlertCircle, GraduationCap, BookOpen, School as SchoolIcon, Edit2, Camera, Save, Loader2 } from 'lucide-react';
import { clearAllData, seedTeachers, seedBatches } from '@/lib/seed';

export default function StudentProfile() {
    const { user, userRole } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
        grade: '',
        stream: '',
        school: ''
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
                        name: data.name || user.displayName || '',
                        phone: data.phone || '',
                        location: data.location || '',
                        grade: data.grade || '',
                        stream: data.stream || '',
                        school: data.school || ''
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        setMessage(null);
        try {
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                name: formData.name,
                phone: formData.phone,
                location: formData.location,
                grade: formData.grade,
                stream: formData.stream,
                school: formData.school
            });
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleClearData = async () => {
        if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) return;

        setIsClearing(true);
        setMessage(null);
        try {
            const success = await clearAllData();
            if (success) {
                setMessage({ type: 'success', text: 'All data cleared successfully. You can now re-populate.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to clear data.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred.' });
        } finally {
            setIsClearing(false);
        }
    };

    const handleSeedData = async () => {
        setIsSeeding(true);
        setMessage(null);
        try {
            const teachersSuccess = await seedTeachers();
            const batchesSuccess = await seedBatches();

            if (teachersSuccess && batchesSuccess) {
                setMessage({ type: 'success', text: 'Data populated successfully! Refresh the page to see changes.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to populate some data.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred during seeding.' });
        } finally {
            setIsSeeding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 text-cyan-700 animate-spin" />
                <p className="text-slate-500 animate-pulse">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account and data settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-cyan-500 to-violet-600 relative">
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-white/30 transition-colors flex items-center gap-2">
                                    <Camera size={16} /> Change Cover
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-12 mb-6 flex justify-between items-end">
                            <div className="relative group">
                                <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-lg inline-block">
                                    <div className="w-full h-full bg-cyan-100 dark:bg-cyan-900/20 rounded-xl flex items-center justify-center text-3xl font-bold text-cyan-700 dark:text-cyan-400 overflow-hidden relative">
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            user?.displayName?.[0] || 'U'
                                        )}
                                    </div>
                                </div>
                                {isEditing && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                            <div className="mb-2">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                    >
                                        <Edit2 size={16} /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="px-4 py-2 bg-cyan-700 text-white font-bold rounded-xl text-sm hover:bg-cyan-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="text-2xl font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 w-full max-w-md focus:ring-2 focus:ring-cyan-500 outline-none"
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formData.name}</h2>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 capitalize">
                                        <Shield size={12} />
                                        {userRole} Account
                                    </span>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                        ID: {user?.uid?.slice(0, 8).toUpperCase() || 'STU-123456'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                                        <Mail size={16} /> Email Address
                                    </div>
                                    <div className="font-medium text-slate-900 dark:text-slate-100">{user?.email}</div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                                        <Phone size={16} /> Phone
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-cyan-500 outline-none"
                                        />
                                    ) : (
                                        <div className="font-medium text-slate-900 dark:text-slate-100">{formData.phone}</div>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:col-span-2">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                                        <MapPin size={16} /> Location
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-cyan-500 outline-none"
                                        />
                                    ) : (
                                        <div className="font-medium text-slate-900 dark:text-slate-100">{formData.location}</div>
                                    )}
                                </div>

                                {/* New Fields */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                                        <GraduationCap size={16} /> Class
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.grade}
                                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                            className="font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-cyan-500 outline-none"
                                        />
                                    ) : (
                                        <div className="font-medium text-slate-900 dark:text-slate-100">{formData.grade || 'Not specified'}</div>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                                        <BookOpen size={16} /> Stream
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.stream}
                                            onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                                            className="font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-cyan-500 outline-none"
                                        />
                                    ) : (
                                        <div className="font-medium text-slate-900 dark:text-slate-100">{formData.stream}</div>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:col-span-2">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                                        <SchoolIcon size={16} /> School
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.school}
                                            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                            className="font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-cyan-500 outline-none"
                                        />
                                    ) : (
                                        <div className="font-medium text-slate-900 dark:text-slate-100">{formData.school}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Management Card */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 h-fit">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <RefreshCw size={20} className="text-cyan-700 dark:text-cyan-400" />
                            Data Management
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Use these tools to reset the application data. Useful for testing new features.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={handleClearData}
                                disabled={isClearing}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                            >
                                {isClearing ? (
                                    <RefreshCw size={18} className="animate-spin" />
                                ) : (
                                    <Trash2 size={18} />
                                )}
                                {isClearing ? 'Clearing...' : 'Clear All Data'}
                            </button>

                            <button
                                onClick={handleSeedData}
                                disabled={isSeeding}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors disabled:opacity-50"
                            >
                                {isSeeding ? (
                                    <RefreshCw size={18} className="animate-spin" />
                                ) : (
                                    <RefreshCw size={18} />
                                )}
                                {isSeeding ? 'Populating...' : 'Populate Dummy Data'}
                            </button>
                        </div>

                        {message && (
                            <div className={`mt-4 p-3 rounded-xl flex items-start gap-2 text-sm ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                }`}>
                                {message.type === 'success' ? (
                                    <CheckCircle size={16} className="mt-0.5 shrink-0" />
                                ) : (
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                )}
                                {message.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
