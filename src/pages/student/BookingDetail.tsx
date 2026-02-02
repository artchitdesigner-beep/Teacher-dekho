import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import {
    Clock, AlertCircle,
    Video, Info, User,
    ExternalLink, ChevronLeft, Trash2, CreditCard,
    Crown, Zap, Star, CheckCircle2,
    Calendar, FileText, MessageSquare, Users, Megaphone, Download, File
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface Session {
    id: string;
    scheduledAt: Timestamp;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    isDemo: boolean;
}

interface Booking {
    id: string;
    teacherId: string;
    teacherName: string;
    studentId: string;
    studentName: string;
    topic: string;
    description?: string;
    totalSessions: number;
    sessions: Session[];
    status: 'active' | 'pending' | 'completed' | 'rejected';
    paymentStatus: 'pending' | 'paid' | 'required';
    teacherRemarks?: string;
    members?: { name: string; phone: string }[];

    selectedDays?: string[];
    createdAt: Timestamp;
}

export default function BookingDetail() {
    const { id: bookingId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [batch, setBatch] = useState<any>(null);

    useEffect(() => {
        async function fetchBooking() {
            if (!bookingId || !user) return;
            try {
                const docRef = doc(db, 'bookings', bookingId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Booking;
                    if (data.studentId !== user.uid && data.teacherId !== user.uid) {
                        setError("You don't have permission to view this course.");
                    } else {
                        setBooking({ ...data, id: docSnap.id });

                        // Fetch batch details if batchId exists
                        if ((data as any).batchId) {
                            const batchRef = doc(db, 'batches', (data as any).batchId);
                            const batchSnap = await getDoc(batchRef);
                            if (batchSnap.exists()) {
                                setBatch(batchSnap.data());
                            }
                        }
                    }
                } else {
                    setError("Course not found.");
                }
            } catch (err) {
                console.error("Error fetching course:", err);
                setError("Failed to load course details.");
            } finally {
                setLoading(false);
            }
        }

        fetchBooking();
    }, [bookingId, user]);

    // function handleCancelBooking removed.

    const handlePayment = async () => {
        if (!booking) return;
        // Mock payment process
        try {
            const docRef = doc(db, 'bookings', booking.id);
            await updateDoc(docRef, { paymentStatus: 'paid' });
            setBooking({ ...booking, paymentStatus: 'paid' });
            alert("Payment successful! (Mock)");
        } catch (err) {
            console.error("Error processing payment:", err);
            alert("Payment failed.");
        }
    };

    const getNextSession = () => {
        if (!booking?.sessions) return null;
        const now = Date.now();
        return booking.sessions
            .filter(s => s.status === 'confirmed' && s.scheduledAt.toMillis() > now)
            .sort((a, b) => a.scheduledAt.toMillis() - b.scheduledAt.toMillis())[0];
    };

    const nextSession = getNextSession();
    const firstSessionCompleted = booking?.sessions?.some(s => s.isDemo && s.status === 'completed');

    // Calculate progress
    const completedSessions = booking?.sessions?.filter(s => s.status === 'completed').length || 0;
    const progressPercent = booking ? (completedSessions / booking.totalSessions) * 100 : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700"></div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="max-w-2xl mx-auto mt-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Oops!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{error || "Something went wrong."}</p>
                <Button onClick={() => navigate('/student/courses')}>
                    Go Back
                </Button>
            </div>
        );
    }

    const canJoin = nextSession && booking.status === 'active';

    return (
        <div className="w-full space-y-8 pb-12">
            {/* Navigation & Status */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/student/courses')}
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 font-medium transition-colors"
                >
                    <ChevronLeft size={20} />
                    Back to Courses
                </button>
                <Badge variant="outline" className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${booking.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    booking.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                    {booking.status}
                </Badge>
            </div>

            {/* Main Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row gap-8 justify-between">
                    <div className="space-y-4 flex-grow max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="secondary" className="text-cyan-700 bg-cyan-50">
                                {booking.totalSessions} Sessions
                            </Badge>
                            {/* Plan Badge */}
                            {(booking as any).planType && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    {(booking as any).planType === 'platinum' && <Crown size={12} className="text-cyan-500" />}
                                    {(booking as any).planType === 'gold' && <Zap size={12} className="text-amber-500" />}
                                    {(booking as any).planType === 'silver' && <Star size={12} className="text-slate-400" />}
                                    <span className="capitalize">{(booking as any).planType} Plan</span>
                                </Badge>
                            )}
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-500 text-sm flex items-center gap-1 font-medium">
                                <User size={14} /> {booking.teacherName}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {booking.topic}
                        </h1>

                        <div className="flex items-center gap-4 pt-2">
                            <div className="flex-1 max-w-md">
                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                                    <span>Progress</span>
                                    <span>{Math.round(progressPercent)}%</span>
                                </div>
                                <Progress value={progressPercent} className="h-2" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[240px] shrink-0">
                        {canJoin ? (
                            <Button
                                className="w-full py-6 text-lg font-bold shadow-xl shadow-cyan-700/20"
                                onClick={() => { }} // Integration logic would go here
                            >
                                <Video size={20} className="mr-2" /> Join Class Now
                            </Button>
                        ) : (
                            <Button disabled className="w-full py-6 text-lg font-bold opacity-50">
                                <Video size={20} className="mr-2" /> No Class Now
                            </Button>
                        )}

                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800 hover:border-cyan-300" onClick={() => alert("Upgrade Plan feature coming soon!")}>
                                <Crown size={16} className="mr-2" /> Upgrade Plan
                            </Button>
                            {/* Cancel button removed as per requirement */}
                        </div>
                    </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-50/50 dark:bg-cyan-900/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Tabs Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="sessions" className="w-full">
                        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none mb-8 gap-6 overflow-x-auto">
                            <TabsTrigger
                                value="sessions"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <Clock size={16} /> Sessions
                            </TabsTrigger>
                            <TabsTrigger
                                value="resources"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <FileText size={16} /> Resources
                            </TabsTrigger>
                            <TabsTrigger
                                value="announcements"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <Megaphone size={16} /> Updates
                            </TabsTrigger>
                            <TabsTrigger
                                value="curriculum"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <Info size={16} /> Course Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="group"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <Users size={16} /> Study Group
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="sessions" className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            {booking.sessions?.map((session, idx) => (
                                <Card key={session.id} className={`border transition-all ${session.id === nextSession?.id ? 'border-cyan-200 bg-cyan-50/50 dark:border-cyan-800 dark:bg-cyan-900/10 shadow-md' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${session.id === nextSession?.id ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                                                <span className="text-lg leading-none">{session.scheduledAt.toDate().getDate()}</span>
                                                <span className="text-[9px] uppercase font-bold">{session.scheduledAt.toDate().toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">Session {idx + 1}</span>
                                                    {session.isDemo && <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-cyan-100 text-cyan-700 uppercase">Demo</Badge>}
                                                </div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                    <Clock size={14} /> {session.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    <span className="text-slate-300">•</span>
                                                    <span>{session.scheduledAt.toDate().toLocaleDateString('en-US', { weekday: 'long' })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge variant={session.status === 'completed' ? 'default' : session.status === 'confirmed' ? 'outline' : 'secondary'}
                                                className={session.status === 'completed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' :
                                                    session.status === 'confirmed' ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}>
                                                {session.status}
                                            </Badge>

                                            {session.id === nextSession?.id && (
                                                <Button size="sm" className="bg-cyan-700 hover:bg-cyan-800 text-white shadow-lg shadow-cyan-100">
                                                    Start <Video size={14} className="ml-1.5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="resources" className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <Card className="rounded-[2rem] border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <FileText className="text-cyan-700" size={20} />
                                        <CardTitle className="text-lg">Class Resources</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Files and documents shared by your teacher.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer border border-slate-100 dark:border-slate-700">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                                                    <File size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-slate-100">Lecture {i} Notes.pdf</div>
                                                    <div className="text-xs text-slate-500">Uploaded {i} days ago • 2.4 MB</div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-cyan-700">
                                                <Download size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-2xl border border-cyan-100 dark:border-cyan-800 text-center text-sm text-cyan-800 dark:text-cyan-300">
                                        No more resources available.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="announcements" className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <Card className="rounded-[2rem] border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Megaphone className="text-cyan-700" size={20} />
                                        <CardTitle className="text-lg">Announcements</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Latest updates from your teacher.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {[
                                        { title: "Class Rescheduled", date: "2 days ago", content: "The class scheduled for Friday is moved to Saturday at 10 AM.", important: true },
                                        { title: "Exam Preparation", date: "1 week ago", content: "Please review Chapter 4 before the next session." }
                                    ].map((update, i) => (
                                        <div key={i} className={`p-5 rounded-2xl border ${update.important ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                                    {update.title}
                                                    {update.important && <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0 h-5">Important</Badge>}
                                                </div>
                                                <span className="text-xs text-slate-500">{update.date}</span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                                {update.content}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="curriculum" className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <Card className="rounded-[2rem] border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="text-cyan-700" size={20} />
                                        <CardTitle className="text-lg">Course Information</CardTitle>
                                    </div>
                                    <CardDescription>
                                        You are learning <strong>{booking.topic}</strong> with <strong>{booking.teacherName}</strong>.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {batch && (
                                        <>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                                    <CheckCircle2 size={16} className="text-cyan-600" /> Syllabus
                                                </h4>
                                                <div className="space-y-3">
                                                    {batch.syllabus?.map((module: any, i: number) => (
                                                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                                            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2">{module.title}</div>
                                                            <div className="space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                                                {module.lessons.map((lesson: string, li: number) => (
                                                                    <div key={li} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                                        <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                                                                        {lesson}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                                    <Calendar size={16} className="text-cyan-600" /> Weekly Schedule
                                                </h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {batch.schedule?.map((item: any, i: number) => (
                                                        <div key={i} className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-100 dark:border-cyan-900/30 text-xs text-center">
                                                            <div className="font-bold text-cyan-700 dark:text-cyan-400 mb-1">{item.day}</div>
                                                            <div className="text-cyan-600 dark:text-cyan-300 bg-white dark:bg-slate-900 rounded px-2 py-0.5 inline-block text-[10px]">{item.time}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Fallback schedule display if no batch linked */}
                                    {booking.selectedDays && booking.selectedDays.length > 0 && !batch && (
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Weekly Schedule</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {booking.selectedDays.map((day, i) => (
                                                    <Badge key={i} variant="secondary" className="px-3 py-1 bg-cyan-50 text-cyan-700">
                                                        {day}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="group" className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <Card className="rounded-[2rem] border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="text-cyan-700" size={20} />
                                        <CardTitle className="text-lg">Study Group</CardTitle>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => {
                                        const name = prompt("Enter student name:");
                                        if (!name) return;
                                        const phone = prompt("Enter student phone:");
                                        if (!phone) return;
                                        const newMember = { name, phone };
                                        const updatedMembers = [...(booking.members || []), newMember];
                                        updateDoc(doc(db, 'bookings', booking.id), { members: updatedMembers })
                                            .then(() => setBooking({ ...booking, members: updatedMembers }));
                                    }}>
                                        + Add Member
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {booking.members && booking.members.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {booking.members.map((member, idx) => (
                                                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 relative group flex items-start justify-between">
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-slate-100">{member.name}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{member.phone}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (!confirm('Remove this member?')) return;
                                                            const updatedMembers = booking.members!.filter((_, i) => i !== idx);
                                                            updateDoc(doc(db, 'bookings', booking.id), { members: updatedMembers })
                                                                .then(() => setBooking({ ...booking, members: updatedMembers }));
                                                        }}
                                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                            <Users size={32} className="mx-auto text-slate-300 mb-3" />
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">No other students added to this group.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Payment & Help */}
                <div className="space-y-6">
                    <Card className="rounded-[2rem] border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 pb-4">
                            <div className="flex items-center gap-2">
                                <CreditCard className="text-cyan-700" size={20} />
                                <CardTitle className="text-lg">Payment</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-6 space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <span className="text-slate-500 text-sm font-medium">Status</span>
                                <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'destructive'}
                                    className={booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                                    {booking.paymentStatus || 'pending'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between px-2">
                                <span className="text-slate-500 text-sm">Total Fee</span>
                                <span className="font-bold text-xl text-slate-900 dark:text-slate-100">₹{booking.totalSessions * 500}</span>
                            </div>

                            {booking.paymentStatus === 'required' && (
                                <Button className="w-full bg-cyan-700 hover:bg-cyan-800 shadow-lg shadow-cyan-100" onClick={handlePayment}>
                                    Pay Course Fee
                                </Button>
                            )}

                            {booking.paymentStatus === 'pending' && !firstSessionCompleted && (
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-800 leading-relaxed flex gap-2">
                                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                    <span>Payment required after the demo session to continue.</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {booking.teacherRemarks && (
                        <Card className="rounded-[2rem] border-slate-200 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={20} className="text-cyan-700" />
                                    <CardTitle className="text-lg">Remarks</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl italic text-slate-600 dark:text-slate-300 text-sm border border-slate-100">
                                    "{booking.teacherRemarks}"
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="rounded-[2rem] bg-slate-900 text-white shadow-xl shadow-slate-200">
                        <CardContent className="p-8">
                            <h3 className="font-bold mb-2">Need Help?</h3>
                            <p className="text-slate-400 text-sm mb-6">Contact support if you face any issues.</p>
                            <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                                Contact Support <ExternalLink size={16} className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
