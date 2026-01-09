import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="text-center max-w-md w-full">
                <div className="mb-8 relative inline-block">
                    <div className="text-9xl font-bold text-cyan-100 dark:text-cyan-900/30">404</div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Page Not Found
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Oops! You seem to be lost.
                </h1>

                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    The page you are looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-700/20"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>

                    <Link
                        to="/search"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors"
                    >
                        <Search size={18} />
                        Find Teachers
                    </Link>
                </div>
            </div>
        </div>
    );
}
