import { useState } from 'react';
import { ChevronLeft, User, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import logoteal from '@/assets/td_longlogo.png';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'role' | 'account' | 'teacher_pro' | 'teacher_bio' | 'student_info'>('role');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        subject: '',
        bio: '',
        hourlyRate: '',
        experience: '',
        college: '',
        grade: '',
        school: '',
        location: ''
    });

    const handleRoleSelect = (selectedRole: 'student' | 'teacher') => {
        setRole(selectedRole);
        setStep('account');
    };

    const nextStep = () => {
        if (step === 'role') setStep('account');
        else if (step === 'account') {
            if (role === 'teacher') setStep('teacher_pro');
            else setStep('student_info');
        } else if (step === 'teacher_pro') setStep('teacher_bio');
        else registerUser();
    };

    const prevStep = () => {
        if (step === 'account') setStep('role');
        else if (step === 'teacher_pro') setStep('account');
        else if (step === 'teacher_bio') setStep('teacher_pro');
        else if (step === 'student_info') setStep('account');
    };

    const registerUser = async () => {
        setError('');
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: formData.name });

            const userDocRef = doc(db, 'users', user.uid);
            const commonData = {
                uid: user.uid,
                name: formData.name,
                email: formData.email,
                role: role,
                createdAt: serverTimestamp(),
            };

            if (role === 'teacher') {
                const teacherData = {
                    ...commonData,
                    subject: formData.subject,
                    bio: formData.bio,
                    hourlyRate: parseFloat(formData.hourlyRate),
                    experience: formData.experience,
                    college: formData.college,
                    kycStatus: 'pending',
                    rating: 0,
                    reviewCount: 0
                };
                await setDoc(userDocRef, teacherData);
                await setDoc(doc(db, 'teachers', user.uid), {
                    uid: user.uid,
                    name: formData.name,
                    subject: formData.subject,
                    bio: formData.bio,
                    hourlyRate: parseFloat(formData.hourlyRate),
                    experience: formData.experience,
                    college: formData.college,
                    rating: 0,
                    reviewCount: 0,
                    avatarColor: 'bg-cyan-100 text-cyan-700'
                });
            } else {
                await setDoc(userDocRef, {
                    ...commonData,
                    grade: formData.grade,
                    school: formData.school,
                    location: formData.location,
                    walletBalance: 500
                });
            }

            navigate(role === 'teacher' ? '/teacher/dashboard' : '/');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors">
            <div className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <button
                        onClick={prevStep}
                        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-8 font-bold transition-colors w-fit"
                    >
                        <ChevronLeft size={18} /> Back
                    </button>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">

                        <div className="mb-8 flex justify-center">
                            <img src={logoteal} alt="TeacherDekho" className="h-[40px] w-auto opacity-80" />
                        </div>

                        {step === 'role' ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome!</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8">Choose how you want to use TeacherDekho.</p>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleRoleSelect('student')}
                                        className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-cyan-700 dark:hover:border-cyan-500 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20 transition-all group flex items-center gap-4 text-left bg-white dark:bg-slate-900"
                                    >
                                        <div className="w-12 h-12 bg-cyan-100/50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-slate-100">I am a Student</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">I want to find mentors and learn.</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleRoleSelect('teacher')}
                                        className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-cyan-700 dark:hover:border-cyan-500 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20 transition-all group flex items-center gap-4 text-left bg-white dark:bg-slate-900"
                                    >
                                        <div className="w-12 h-12 bg-orange-100/50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <GraduationCap size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-slate-100">I am a Teacher</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">I want to teach and earn.</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                                {/* Progress Bar */}
                                <div className="flex gap-2 mb-6">
                                    {['account', role === 'teacher' ? 'teacher_pro' : 'student_info', ...(role === 'teacher' ? ['teacher_bio'] : [])].map((s, i) => (
                                        <div
                                            key={s}
                                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step === s ? 'bg-[#09946c] w-full' : (i < ['account', role === 'teacher' ? 'teacher_pro' : 'student_info', 'teacher_bio'].indexOf(step)) ? 'bg-[#96e625]' : 'bg-slate-100 dark:bg-slate-800'}`}
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                                        {error}
                                    </div>
                                )}

                                {step === 'account' && (
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create {role === 'teacher' ? 'Teacher' : 'Student'} account</h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Fill in your details to get started.</p>
                                        </div>
                                        <div className="space-y-4 pt-2">
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 'teacher_pro' && (
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Professional Details</h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Tell us about your teaching background.</p>
                                        </div>
                                        <div className="space-y-4 pt-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Subject <span className="text-red-500">*</span></label>
                                                    <Input
                                                        required
                                                        type="text"
                                                        placeholder="e.g. Physics"
                                                        value={formData.subject}
                                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                                        className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Rate (₹/hr) <span className="text-red-500">*</span></label>
                                                    <Input
                                                        required
                                                        type="number"
                                                        placeholder="500"
                                                        value={formData.hourlyRate}
                                                        onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                                                        className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Years of Experience <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. 5 Years"
                                                    value={formData.experience}
                                                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">College/University <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. IIT Delhi"
                                                    value={formData.college}
                                                    onChange={e => setFormData({ ...formData, college: e.target.value })}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 'teacher_bio' && (
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">About You</h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Write a short bio to attract students.</p>
                                        </div>
                                        <div className="pt-2">
                                            <Textarea
                                                required
                                                placeholder="Write your bio here... (min 50 characters)"
                                                value={formData.bio}
                                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition h-40 resize-none dark:text-white font-medium"
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 'student_info' && (
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">School Details</h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Help us personalize your learning experience.</p>
                                        </div>
                                        <div className="space-y-4 pt-2">
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Class/Grade <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. 10th Standard"
                                                    value={formData.grade}
                                                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">School Name <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    type="text"
                                                    placeholder="Delhi Public School"
                                                    value={formData.school}
                                                    onChange={e => setFormData({ ...formData, school: e.target.value })}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Location <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    type="text"
                                                    placeholder="City, State"
                                                    value={formData.location}
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 mt-6 bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] border-none text-base"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            {step === 'teacher_bio' || step === 'student_info' ? 'Complete Onboarding' : 'Continue'}
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

