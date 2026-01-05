import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Mail, Phone, MapPin, Shield, Trash2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { clearAllData, seedTeachers, seedBatches } from '@/lib/seed';

export default function StudentProfile() {
    const { user, userRole } = useAuth();
    const [isClearing, setIsClearing] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account and data settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-12 mb-6">
                            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-lg inline-block">
                                <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {user?.displayName?.[0] || 'U'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user?.displayName || 'Student Name'}</h2>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 capitalize">
                                    <Shield size={12} />
                                    {userRole} Account
                                </span>
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
                                    <div className="font-medium text-slate-900 dark:text-slate-100">+91 98765 43210</div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:col-span-2">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                                        <MapPin size={16} /> Location
                                    </div>
                                    <div className="font-medium text-slate-900 dark:text-slate-100">Mumbai, Maharashtra</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Management Card */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 h-fit">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <RefreshCw size={20} className="text-indigo-600 dark:text-indigo-400" />
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
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
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
