import { useState } from 'react';
import { ChevronLeft, User, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'role' | 'form'>('role');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        subject: '',
        bio: '',
        hourlyRate: ''
    });

    const handleRoleSelect = (selectedRole: 'student' | 'teacher') => {
        setRole(selectedRole);
        setStep('form');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('Starting signup process...');

        try {
            // 1. Create Auth User
            console.log('Step 1: Creating Auth User...');
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            console.log('Step 1: Auth User Created', user.uid);

            // 2. Update Profile
            console.log('Step 2: Updating Profile...');
            await updateProfile(user, { displayName: formData.name });
            console.log('Step 2: Profile Updated');

            // 3. Create Firestore Document
            console.log('Step 3: Creating Firestore Document...');
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                uid: user.uid,
                name: formData.name,
                email: formData.email,
                role: role,
                createdAt: serverTimestamp(),
                // Role specific fields
                ...(role === 'teacher' ? {
                    subject: formData.subject,
                    bio: formData.bio,
                    hourlyRate: parseFloat(formData.hourlyRate),
                    kycStatus: 'pending',
                    rating: 0,
                    reviewCount: 0
                } : {
                    walletBalance: 500 // Demo credits
                })
            });
            console.log('Step 3: Firestore Document Created');

            // 4. If teacher, add to public teachers collection for easier searching (optional, but good for NoSQL)
            if (role === 'teacher') {
                console.log('Step 4: Creating Teacher Document...');
                await setDoc(doc(db, 'teachers', user.uid), {
                    uid: user.uid,
                    name: formData.name,
                    subject: formData.subject,
                    bio: formData.bio,
                    hourlyRate: parseFloat(formData.hourlyRate),
                    rating: 0,
                    reviewCount: 0,
                    avatarColor: 'bg-indigo-100 text-indigo-600' // Default
                });
                console.log('Step 4: Teacher Document Created');
            }

            console.log('Signup Complete!');
            navigate('/');
        } catch (err: any) {
            console.error('Signup Error:', err);
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                <button
                    onClick={step === 'role' ? () => navigate('/') : () => setStep('role')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-medium transition-colors"
                >
                    <ChevronLeft size={18} /> Back
                </button>

                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    {step === 'role' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Welcome!</h2>
                            <p className="text-slate-500 mb-8">Choose how you want to use TeacherDekho.</p>

                            <div className="space-y-4">
                                <button
                                    onClick={() => handleRoleSelect('student')}
                                    className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group flex items-center gap-4 text-left"
                                >
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">I am a Student</div>
                                        <div className="text-sm text-slate-500">I want to find mentors and learn.</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleRoleSelect('teacher')}
                                    className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group flex items-center gap-4 text-left"
                                >
                                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <GraduationCap size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">I am a Teacher</div>
                                        <div className="text-sm text-slate-500">I want to teach and earn.</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-slate-900">Create {role} account</h2>
                                <p className="text-slate-500 text-sm">Fill in your details to get started.</p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <input
                                    required
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                                <input
                                    required
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                                <input
                                    required
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />

                                {role === 'teacher' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                required
                                                type="text"
                                                placeholder="Subject (e.g. Physics)"
                                                value={formData.subject}
                                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                            <input
                                                required
                                                type="number"
                                                placeholder="Rate (₹/hr)"
                                                value={formData.hourlyRate}
                                                onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                        </div>
                                        <textarea
                                            required
                                            placeholder="Short Bio..."
                                            value={formData.bio}
                                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition h-24 resize-none"
                                        />
                                    </>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
