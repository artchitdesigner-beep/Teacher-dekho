import { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, DollarSign, CreditCard } from 'lucide-react';

interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
}

// Mock Data
const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', type: 'credit', amount: 2000, description: 'Session with Rahul Kumar', status: 'completed', date: '2024-03-10' },
    { id: '2', type: 'credit', amount: 3500, description: 'Gold Plan - Priya Singh', status: 'pending', date: '2024-03-12' },
    { id: '3', type: 'debit', amount: 5000, description: 'Withdrawal to Bank Account', status: 'completed', date: '2024-03-05' },
    { id: '4', type: 'credit', amount: 1500, description: 'Session with Amit Patel', status: 'completed', date: '2024-03-01' },
];

export default function TeacherWallet() {
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [requesting, setRequesting] = useState(false);

    const handleWithdraw = () => {
        if (!withdrawAmount) return;
        setRequesting(true);
        // Simulate API call
        setTimeout(() => {
            alert('Withdrawal request submitted successfully!');
            setRequesting(false);
            setWithdrawAmount('');
        }, 1500);
    };

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">My Wallet</h1>
                <p className="text-slate-500">Manage your earnings and withdrawals.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-3xl p-6 text-white shadow-lg shadow-cyan-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Wallet size={24} className="text-white" />
                        </div>
                        <span className="font-medium text-cyan-100">Total Balance</span>
                    </div>
                    <div className="text-4xl font-bold mb-2">₹12,500</div>
                    <div className="text-sm text-cyan-100 bg-white/10 inline-block px-3 py-1 rounded-lg">
                        Available for withdrawal
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <Clock size={24} className="text-amber-500" />
                        </div>
                        <span className="font-medium text-slate-500">Pending Clearance</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 mb-2">₹3,500</div>
                    <div className="text-sm text-slate-400">
                        Will be available in 2-3 days
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                            <DollarSign size={24} className="text-emerald-500" />
                        </div>
                        <span className="font-medium text-slate-500">Total Earnings</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 mb-2">₹45,000</div>
                    <div className="text-sm text-slate-400">
                        Lifetime earnings
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction History */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                        {MOCK_TRANSACTIONS.map((tx, i) => (
                            <div key={tx.id} className={`p-5 flex items-center justify-between hover:bg-slate-50 transition-colors ${i !== MOCK_TRANSACTIONS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{tx.description}</div>
                                        <div className="text-xs text-slate-500">{tx.date} • <span className="capitalize">{tx.status}</span></div>
                                    </div>
                                </div>
                                <div className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Withdraw Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Withdraw Funds</h2>
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <CreditCard className="text-slate-400" />
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase">Linked Account</div>
                                <div className="font-bold text-slate-900">HDFC Bank •••• 4582</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Amount to Withdraw</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500 outline-none"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleWithdraw}
                            disabled={!withdrawAmount || requesting}
                            className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {requesting ? 'Processing...' : 'Request Withdrawal'}
                        </button>

                        <p className="text-xs text-center text-slate-400">
                            Withdrawals are processed within 24-48 hours.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
