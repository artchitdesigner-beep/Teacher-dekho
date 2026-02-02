import { useState } from 'react';
import { Bell, Award, HelpCircle, Send, Clock, AlertTriangle, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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
        <div className="w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Back Office</h1>
                <p className="text-slate-500 dark:text-slate-400">Company communications, certificates, and support.</p>
            </div>

            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
                <TabsList className="mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <TabsTrigger value="updates" className="rounded-lg px-6 py-2.5 flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">
                        <Bell size={16} /> Company Updates
                    </TabsTrigger>
                    <TabsTrigger value="certificates" className="rounded-lg px-6 py-2.5 flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">
                        <Award size={16} /> My Certificates
                    </TabsTrigger>
                    <TabsTrigger value="requests" className="rounded-lg px-6 py-2.5 flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">
                        <HelpCircle size={16} /> Help & Requests
                    </TabsTrigger>
                </TabsList>

                <div className="min-h-[400px]">
                    <TabsContent value="updates" className="mt-0">
                        <div className="space-y-4 max-w-3xl">
                            {alerts.map((alert) => (
                                <Card key={alert.id} className={`${alert.type === 'alert' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/50' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50'} border`}>
                                    <CardContent className="p-6 flex items-start gap-4">
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
                                    </CardContent>
                                </Card>
                            ))}
                            <div className="text-center text-sm text-slate-400 mt-8">No more updates</div>
                        </div>
                    </TabsContent>

                    <TabsContent value="certificates" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certificates.map((cert) => (
                                <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow group border-slate-200 dark:border-slate-800">
                                    <div className={`h-40 ${cert.image} flex items-center justify-center`}>
                                        <Award size={64} className="text-slate-900/10 dark:text-slate-100/10" />
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">{cert.title}</h3>
                                        <p className="text-sm text-slate-500 mb-4">Issued by {cert.issuer} • {cert.date}</p>
                                        <Button variant="outline" className="w-full gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-0">
                                            <Download size={18} /> Download
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="requests" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Raise Request Form */}
                            <Card className="lg:col-span-1 h-fit shadow-sm border-slate-200 dark:border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Send size={20} className="text-cyan-700" /> Raise New Request
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleRequestSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 outline-none"
                                                value={requestForm.category}
                                                onChange={e => setRequestForm({ ...requestForm, category: e.target.value })}
                                            >
                                                <option>Payment Issue</option>
                                                <option>Profile Update</option>
                                                <option>Technical Support</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Subject</label>
                                            <Input
                                                required
                                                placeholder="Brief summary..."
                                                value={requestForm.subject}
                                                onChange={e => setRequestForm({ ...requestForm, subject: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description</label>
                                            <textarea
                                                required
                                                rows={4}
                                                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 resize-none outline-none"
                                                placeholder="Explain your issue..."
                                                value={requestForm.description}
                                                onChange={e => setRequestForm({ ...requestForm, description: e.target.value })}
                                            />
                                        </div>
                                        <Button type="submit" className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold shadow-lg shadow-cyan-900/20">
                                            Submit Request
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Request History */}
                            <div className="lg:col-span-2 space-y-6">
                                <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Clock size={20} className="text-slate-400" /> Request History
                                </h2>
                                <div className="space-y-4">
                                    {requests.map((req) => (
                                        <Card key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-slate-200 dark:border-slate-800">
                                            <CardContent className="p-6 flex items-center justify-between">
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
                                                <Badge className={`${req.status === 'Open' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    req.status === 'In Progress' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400' :
                                                        'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                                    } border-0`}>
                                                    {req.status}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
