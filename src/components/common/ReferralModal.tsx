import { useState } from 'react';
import { X, Copy, Share2, Gift, Coins, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
    userRole: 'student' | 'teacher';
    userName: string;
}

export default function ReferralModal({ isOpen, onClose, userRole, userName }: ReferralModalProps) {
    const [copied, setCopied] = useState(false);

    // Generate a deterministic but fake code based on name
    const referralCode = `REF-${userName.split(' ')[0].toUpperCase()}-${Math.floor(Math.random() * 1000 + 1000)}`;

    const referralLink = `https://teacherdekho.com/join?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join Teacher Dekho!',
                    text: `Use my code ${referralCode} to get ${userRole === 'student' ? '₹500 off your first booking' : 'a joining bonus'}!`,
                    url: referralLink,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            handleCopy();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-br from-cyan-700 to-violet-700 p-6 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
                            <Gift size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Refer & Earn</h2>
                        <p className="text-cyan-100 text-sm max-w-xs mx-auto">
                            Invite your friends to Teacher Dekho and earn rewards for every successful signup!
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Code Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Referral Code</label>
                            <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="flex-1 px-4 py-3 font-mono text-lg font-bold text-slate-700 tracking-wider text-center border-r border-slate-200 border-dashed">
                                    {referralCode}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="p-3 hover:bg-white rounded-lg transition-colors text-cyan-700 relative group"
                                    title="Copy Code"
                                >
                                    {copied ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-700/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Share2 size={18} /> Share with Friends
                        </button>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <div className="flex items-center gap-2 mb-1 text-amber-600 font-bold text-xs uppercase tracking-wider">
                                    <Coins size={14} /> Earnings
                                </div>
                                <div className="text-2xl font-bold text-slate-800">₹1,500</div>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <div className="flex items-center gap-2 mb-1 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                                    <CheckCircle2 size={14} /> Successful
                                </div>
                                <div className="text-2xl font-bold text-slate-800">3</div>
                            </div>
                        </div>

                        {/* History */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Referrals</h3>
                            <div className="space-y-3">
                                {[
                                    { name: "Rahul Sharma", status: "Completed", date: "2 days ago", reward: "₹500" },
                                    { name: "Priya Singh", status: "Pending", date: "5 days ago", reward: "-" },
                                    { name: "Amit Kumar", status: "Completed", date: "1 week ago", reward: "₹500" },
                                ].map((ref, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center font-bold text-xs">
                                                {ref.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-700">{ref.name}</div>
                                                <div className="text-xs text-slate-400">{ref.date}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`font-bold ${ref.status === 'Completed' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {ref.reward}
                                            </div>
                                            <div className={`text-[10px] font-bold uppercase tracking-wider ${ref.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {ref.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
