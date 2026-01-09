import { useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, History, CreditCard, Gift, Info } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ReferralModal from '@/components/common/ReferralModal';

export default function Wallet() {
    const { user } = useAuth();
    const [showReferralModal, setShowReferralModal] = useState(false);

    // Mock Data
    const balance = 1250;
    const transactions = [
        { id: 1, type: 'credit', amount: 500, description: 'Referral Bonus - Rahul Kumar', date: '2024-03-15', status: 'completed' },
        { id: 2, type: 'debit', amount: 1000, description: 'Course Purchase - Physics Batch', date: '2024-03-10', status: 'completed' },
        { id: 3, type: 'credit', amount: 500, description: 'Referral Bonus - Priya Singh', date: '2024-03-05', status: 'completed' },
        { id: 4, type: 'credit', amount: 1000, description: 'Wallet Top-up', date: '2024-03-01', status: 'completed' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Wallet</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your earnings and transactions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Creative Wallet Card */}
                <div className="md:col-span-2 group h-64 [perspective:1000px]">
                    <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(10deg)]">

                        {/* Wallet Back/Inside */}
                        <div className="absolute inset-0 bg-slate-900 rounded-3xl [transform:translateZ(-20px)] shadow-2xl overflow-hidden border border-slate-800">
                            {/* Inner Leather Texture (CSS Radial Gradient) */}
                            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                        </div>

                        {/* The Card (Money) */}
                        <div className="absolute top-6 left-6 right-6 h-48 bg-gradient-to-br from-emerald-500 via-cyan-700 to-emerald-800 rounded-2xl shadow-xl transition-all duration-700 ease-out [transform:translateY(-40px)_translateZ(5px)] group-hover:[transform:translateY(-90px)_translateZ(20px)_rotateX(-5deg)] z-10 p-6 text-white border-t border-white/20 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-emerald-100/80 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Total Balance</p>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-sm tracking-tight">₹{balance.toLocaleString()}</h2>
                                </div>
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                                    <WalletIcon className="text-white" size={20} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Chip & Contactless */}
                                <div className="flex items-center gap-3 opacity-80">
                                    <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 border border-yellow-500/30 shadow-sm relative overflow-hidden">
                                        <div className="absolute inset-0 border-r border-yellow-600/20 w-1/3 left-1/3"></div>
                                        <div className="absolute inset-0 border-b border-yellow-600/20 h-1/2 top-1/4"></div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full border border-white/30"></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="text-sm font-mono text-emerald-50 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        **** **** **** 4291
                                    </div>
                                    <div className="text-[10px] uppercase font-bold text-emerald-200">Platinum Card</div>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Front */}
                        <div className="absolute inset-0 bg-slate-900 rounded-3xl shadow-2xl z-20 overflow-hidden border-t border-slate-700 flex flex-col justify-end p-8 transition-transform duration-700 origin-bottom [transform-style:preserve-3d] [transform:rotateX(5deg)] group-hover:[transform:rotateX(25deg)]">
                            {/* Leather Texture Effect */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-black/50"></div>

                            {/* Stitching Details */}
                            <div className="absolute top-3 left-3 right-3 h-[calc(100%-24px)] border-2 border-dashed border-slate-700/50 rounded-2xl pointer-events-none"></div>

                            <div className="relative z-30 [transform:translateZ(20px)]">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-700 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-900/50 border border-white/10">
                                        <Gift className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight">TeacherDekho</h3>
                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Student Wallet</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                                    <p className="text-cyan-200 text-xs flex items-center gap-2 font-medium">
                                        <Info size={14} />
                                        <span>Hover to reveal balance</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <div
                        onClick={() => setShowReferralModal(true)}
                        className="bg-gradient-to-br from-cyan-700 to-violet-600 p-6 rounded-3xl text-white cursor-pointer hover:shadow-lg hover:shadow-cyan-200 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <Gift size={20} />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Refer & Earn</h3>
                            <p className="text-cyan-100 text-xs mb-3">Invite friends and earn ₹500 per referral.</p>
                            <span className="inline-block bg-white text-cyan-700 text-xs font-bold px-3 py-1 rounded-lg">Invite Now</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                                <CreditCard size={16} />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Saved Cards</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Manage your saved payment methods.</p>
                        <button className="text-cyan-700 dark:text-cyan-400 text-xs font-bold hover:underline">View Cards</button>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <History size={20} className="text-slate-400" />
                        Transaction History
                    </h3>
                    <button className="text-sm text-cyan-700 dark:text-cyan-400 font-bold hover:underline">View All</button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transactions.map(tx => (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}>
                                    {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{tx.description}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ReferralModal
                isOpen={showReferralModal}
                onClose={() => setShowReferralModal(false)}
                userRole="student"
                userName={user?.displayName || "Student"}
            />
        </div>
    );
}
