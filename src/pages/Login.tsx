import { useState } from 'react';
import { ChevronLeft, Loader2, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import logoteal from '@/assets/logo.svg';
import Footer from '@/components/layout/Footer';

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
            <div className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-8 font-medium transition-colors"
                    >
                        <ChevronLeft size={18} /> Back
                    </Link>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                        <div className="mb-8">
                            <div className="mb-4">
                                <img src={logoteal} alt="TeacherDekho" className="h-16 w-auto" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">Welcome back</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Please enter your details to sign in.</p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                required
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition dark:text-white"
                            />
                            <input
                                required
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition dark:text-white"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Log In <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
