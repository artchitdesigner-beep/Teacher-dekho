import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Mail, Phone, MapPin, Shield, Trash2, RefreshCw, CheckCircle, AlertCircle, GraduationCap, BookOpen, School as SchoolIcon, Edit2, Camera, Save, Loader2, User } from 'lucide-react';
import { clearAllData, seedTeachers, seedBatches } from '@/lib/seed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account and data settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="h-32 bg-gradient-to-r from-cyan-500 to-violet-600 relative">
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity">
                                <Button variant="secondary" size="sm" className="gap-2 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30">
                                    <Camera size={16} /> Change Cover
                                </Button>
                            </div>
                        )}
                    </div>
                    <CardContent className="px-8 pb-8">
                        <div className="relative -mt-12 mb-6 flex flex-col sm:flex-row justify-between items-end gap-4">
                            <div className="relative group">
                                <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full p-1 shadow-lg pointer-events-none">
                                    <div className="w-full h-full bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center text-3xl font-bold text-cyan-700 dark:text-cyan-400 overflow-hidden relative">
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            user?.displayName?.[0] || <User size={32} />
                                        )}
                                    </div>
                                </div>
                                {isEditing && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto">
                                        <Camera className="text-white" size={24} />
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                            <div className="w-full sm:w-auto flex items-center justify-end">
                                {!isEditing ? (
                                    <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                                        <Edit2 size={16} /> Edit Profile
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSaveProfile} disabled={saving} className="bg-cyan-700 hover:bg-cyan-800 text-white gap-2">
                                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex flex-col gap-1 mb-2">
                                    {isEditing ? (
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="text-xl font-bold h-10"
                                            placeholder="Your Name"
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formData.name}</h2>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="gap-1 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400 hover:bg-cyan-100 border-cyan-100">
                                        <Shield size={12} />
                                        {userRole} Account
                                    </Badge>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                        ID: {user?.uid?.slice(0, 8).toUpperCase() || 'STU-123456'}
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-slate-500">
                                        <Mail size={16} /> Email Address
                                    </Label>
                                    <Input value={user?.email || ''} disabled className="bg-slate-50 dark:bg-slate-800 border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-slate-500">
                                        <Phone size={16} /> Phone
                                    </Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="+91..."
                                        className={!isEditing ? "bg-slate-50 dark:bg-slate-800 border-slate-200" : ""}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="flex items-center gap-2 text-slate-500">
                                        <MapPin size={16} /> Location
                                    </Label>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="City, State"
                                        className={!isEditing ? "bg-slate-50 dark:bg-slate-800 border-slate-200" : ""}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-slate-500">
                                        <GraduationCap size={16} /> Class / Grade
                                    </Label>
                                    <Input
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="e.g. 12th Grade"
                                        className={!isEditing ? "bg-slate-50 dark:bg-slate-800 border-slate-200" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-slate-500">
                                        <BookOpen size={16} /> Stream
                                    </Label>
                                    <Input
                                        value={formData.stream}
                                        onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="e.g. Science (PCM)"
                                        className={!isEditing ? "bg-slate-50 dark:bg-slate-800 border-slate-200" : ""}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="flex items-center gap-2 text-slate-500">
                                        <SchoolIcon size={16} /> School / College
                                    </Label>
                                    <Input
                                        value={formData.school}
                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="School Name"
                                        className={!isEditing ? "bg-slate-50 dark:bg-slate-800 border-slate-200" : ""}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management Card */}
                <div className="space-y-6">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCw size={20} className="text-cyan-700 dark:text-cyan-400" />
                                Data Management
                            </CardTitle>
                            <CardDescription>
                                Reset or populate application data for testing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                variant="destructive"
                                onClick={handleClearData}
                                disabled={isClearing}
                                className="w-full gap-2"
                            >
                                {isClearing ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                {isClearing ? 'Clearing...' : 'Clear All Data'}
                            </Button>

                            <Button
                                onClick={handleSeedData}
                                disabled={isSeeding}
                                className="w-full bg-cyan-700 hover:bg-cyan-800 text-white gap-2"
                            >
                                {isSeeding ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                                {isSeeding ? 'Populating...' : 'Populate Dummy Data'}
                            </Button>

                            {message && (
                                <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className={message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300' : ''}>
                                    {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                                    <AlertDescription>{message.text}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
