import { useState } from 'react';
import { ChevronLeft, Loader2, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import logoteal from '@/assets/td_longlogo.png';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log('Login successful');

            // Fetch user role to redirect correctly
            try {
                const { doc, getDoc } = await import('firebase/firestore');
                const { db } = await import('@/lib/firebase');
                const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    if (role === 'teacher') {
                        navigate('/teacher/dashboard');
                    } else {
                        navigate('/');
                    }
                } else {
                    // Fallback if no user doc found (shouldn't happen ideally)
                    navigate('/');
                }
            } catch (roleError) {
                console.error('Error fetching role:', roleError);
                navigate('/');
            }

        } catch (err: any) {
            console.error('Login Error:', err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors">
            <div className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-8 font-bold transition-colors w-fit"
                    >
                        <ChevronLeft size={18} /> Back
                    </Link>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                        <div className="mb-8">
                            <div className="mb-6">
                                <img src={logoteal} alt="TeacherDekho" className="h-[48px] w-auto" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">Welcome back</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please enter your details to sign in.</p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4 font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password <span className="text-red-500">*</span></label>
                                    <a href="#" className="text-sm font-bold text-cyan-700 hover:text-cyan-800">Forgot password?</a>
                                </div>
                                <Input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 mt-6 bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] border-none text-base"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Log In <ArrowRight size={18} /></>}
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Don't have an account? <Link to="/onboarding" className="text-cyan-700 font-bold hover:underline">Sign up</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
