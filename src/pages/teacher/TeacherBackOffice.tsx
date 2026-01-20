import { useState } from 'react';
import { Bell, Award, HelpCircle, Send, Clock, AlertTriangle, Download, FileText } from 'lucide-react';

export default function TeacherBackOffice() {
    const [activeTab, setActiveTab] = useState<'updates' | 'certificates' | 'requests'>('updates');
    const [requestForm, setRequestForm] = useState({ category: 'Payment', subject: '', description: '' });
    const [requests, setRequests] = useState([
        { id: 101, category: 'Payment', subject: 'Payout Discrepancy June', date: '3 days ago', status: 'In Progress' },
        { id: 102, category: 'Profile', subject: 'Update Qualification Documents', date: '1 week ago', status: 'Closed' }
    ]);

    const alerts = [
        { id: 1, type: 'alert', title: 'Maintenance Scheduled', message: 'The platform will be down for maintenance on Sunday, 2 AM - 4 AM.', date: 'Today' },
        { id: 2, type: 'notification', title: 'New Policy Update', message: 'We have updated our teaching guidelines. Please review the new terms.', date: 'Yesterday' }
    ];

    const certificates = [
        { id: 1, title: 'Verified Physics Tutor', issuer: 'Teacher Dekho', date: 'Jan 2025', image: 'bg-blue-50' },
        { id: 2, title: 'Student Favorite 2024', issuer: 'Teacher Dekho', date: 'Dec 2024', image: 'bg-amber-50' }
    ];

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newRequest = {
            id: Math.floor(Math.random() * 1000),
            category: requestForm.category,
            subject: requestForm.subject,
            date: 'Just now',
            status: 'Open'
        };
        setRequests([newRequest, ...requests]);
        setRequestForm({ category: 'Payment', subject: '', description: '' });
        alert('Request submitted successfully!');
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Back Office</h1>
                <p className="text-slate-500 dark:text-slate-400">Company communications, certificates, and support.</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                {[
                    { id: 'updates', label: 'Company Updates', icon: Bell },
                    { id: 'certificates', label: 'My Certificates', icon: Award },
                    { id: 'requests', label: 'Help & Requests', icon: HelpCircle }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-700 dark:bg-cyan-400 rounded-t-full"></div>}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'updates' && (
                    <div className="space-y-4 max-w-3xl">
                        {alerts.map((alert) => (
                            <div key={alert.id} className={`p-6 rounded-2xl border flex items-start gap-4 ${alert.type === 'alert' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/50' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50'}`}>
                                <div className={`p-2 rounded-full ${alert.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {alert.type === 'alert' ? <AlertTriangle size={20} /> : <Bell size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-slate-900 dark:text-slate-100">{alert.title}</h3>
                                        <span className="text-xs text-slate-500">{alert.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{alert.message}</p>
                                </div>
                            </div>
                        ))}
                        <div className="text-center text-sm text-slate-400 mt-8">No more updates</div>
                    </div>
                )}

                {activeTab === 'certificates' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className={`h-40 ${cert.image} flex items-center justify-center`}>
                                    <Award size={64} className="text-slate-900/10 dark:text-slate-100/10" />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">{cert.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4">Issued by {cert.issuer} • {cert.date}</p>
                                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                        <Download size={18} /> Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Raise Request Form */}
                        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
                            <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <Send size={20} className="text-cyan-700" /> Raise New Request
                            </h2>
                            <form onSubmit={handleRequestSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                    <select
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm"
                                        value={requestForm.category}
                                        onChange={e => setRequestForm({ ...requestForm, category: e.target.value })}
                                    >
                                        <option>Payment Issue</option>
                                        <option>Profile Update</option>
                                        <option>Technical Support</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm"
                                        placeholder="Brief summary..."
                                        value={requestForm.subject}
                                        onChange={e => setRequestForm({ ...requestForm, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm resize-none"
                                        placeholder="Explain your issue..."
                                        value={requestForm.description}
                                        onChange={e => setRequestForm({ ...requestForm, description: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-colors shadow-lg shadow-cyan-900/20">
                                    Submit Request
                                </button>
                            </form>
                        </div>

                        {/* Request History */}
                        <div className="lg:col-span-2">
                            <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <Clock size={20} className="text-slate-400" /> Request History
                            </h2>
                            <div className="space-y-4">
                                {requests.map((req) => (
                                    <div key={req.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100">{req.subject}</h3>
                                                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{req.category}</span>
                                                    <span>• {req.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${req.status === 'Open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            req.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            }`}>
                                            {req.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
