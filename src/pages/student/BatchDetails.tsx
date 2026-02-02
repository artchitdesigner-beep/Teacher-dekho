import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, Clock, Calendar, Users, CheckCircle2, Loader2, ArrowRight, BookOpen, GraduationCap, ChevronDown, ChevronUp, Play, FileText, Share2, Heart } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

export default function BatchDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [batch, setBatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [expandedModule, setExpandedModule] = useState<number | null>(0);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        async function fetchBatch() {
            if (!id) return;
            try {
                const docRef = doc(db, 'batches', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBatch({
                        id: docSnap.id,
                        ...data,
                        startDate: data.startDate?.toDate ? data.startDate.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : data.startDate
                    });
                }
            } catch (error) {
                console.error("Error fetching batch:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBatch();
    }, [id]);

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (batch.studentCount >= batch.maxStudents) {
            alert("Sorry, this batch is full.");
            return;
        }

        setEnrolling(true);
        try {
            const bookingData: any = {
                studentId: user.uid,
                studentName: user.displayName || 'Student',
                teacherId: batch.teacherId || 'dummy_teacher_1', // Use actual teacherId if available
                teacherName: batch.teacherName,
                batchId: batch.id,
                topic: batch.title,
                description: batch.description,
                totalSessions: batch.totalSessions || 24,
                status: 'active',
                paymentStatus: 'pending',
                createdAt: Timestamp.now(),
                sessions: []
            };

            // Calculate first session based on schedule
            if (batch.schedule && batch.schedule.length > 0) {
                const daysMap: { [key: string]: number } = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
                const today = new Date();
                let nextSessionDate = new Date();
                let found = false;

                // Sort schedule by day index
                const sortedSchedule = [...batch.schedule].sort((a: any, b: any) => daysMap[a.day] - daysMap[b.day]);

                // Find next available slot
                for (let i = 0; i < 14; i++) { // Look ahead 2 weeks
                    nextSessionDate.setDate(today.getDate() + i + 1); // Start from tomorrow
                    const dayName = nextSessionDate.toLocaleDateString('en-US', { weekday: 'long' });
                    const slot = sortedSchedule.find((s: any) => s.day === dayName);

                    if (slot) {
                        // Parse time (e.g., "10:00 AM")
                        const [time, period] = slot.time.split(' ');
                        const [hours, minutes] = time.split(':');
                        let h = parseInt(hours);
                        if (period === 'PM' && h !== 12) h += 12;
                        if (period === 'AM' && h === 12) h = 0;

                        nextSessionDate.setHours(h, parseInt(minutes), 0, 0);

                        bookingData.sessions = [{
                            id: 's1',
                            scheduledAt: Timestamp.fromDate(nextSessionDate),
                            status: 'confirmed',
                            isDemo: true
                        }];
                        found = true;
                        break;
                    }
                }

                // Fallback if no schedule match found
                if (!found) {
                    bookingData.sessions = [{
                        id: 's1',
                        scheduledAt: Timestamp.fromDate(new Date(Date.now() + 86400000)), // Tomorrow
                        status: 'confirmed',
                        isDemo: true
                    }];
                }
            } else {
                bookingData.sessions = [{
                    id: 's1',
                    scheduledAt: Timestamp.fromDate(new Date(Date.now() + 86400000)), // Tomorrow
                    status: 'confirmed',
                    isDemo: true
                }];
            }

            const docRef = await addDoc(collection(db, 'bookings'), bookingData);
            navigate(`/student/courses/${docRef.id}`);
        } catch (error) {
            console.error("Error enrolling in batch:", error);
            alert("Failed to enroll. Please try again.");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-cyan-700" /></div>;
    if (!batch) return <div className="flex items-center justify-center min-h-screen">Batch not found</div>;

    const isDashboard = location.pathname.startsWith('/student');
    const progressVal = (batch.studentCount / batch.maxStudents) * 100;
    const isSmallGroup = batch.maxStudents <= 10;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40">
                <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-4`}>
                    <button onClick={() => navigate(-1)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 flex items-center gap-2 font-medium">
                        <ArrowRight size={16} className="rotate-180" /> Back to Batches
                    </button>
                </div>
            </div>

            <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-8 grid grid-cols-1 lg:grid-cols-3 gap-8`}>
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Profile Header */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        {/* Background Gradient */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-cyan-50 to-white dark:from-slate-800 dark:to-slate-900 z-0" />

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Image */}
                                <div className="w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 flex-shrink-0">
                                    <img src={batch.image} alt={batch.title} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-grow pt-2">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border-0 uppercase text-[10px] tracking-wider px-2 py-1">
                                            {batch.subject}
                                        </Badge>
                                        <Badge variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-200 uppercase text-[10px] tracking-wider px-2 py-1">
                                            Class {batch.class}
                                        </Badge>
                                        {isSmallGroup && (
                                            <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-200 border-0 uppercase text-[10px] tracking-wider px-2 py-1 flex items-center gap-1">
                                                <Users size={10} /> Small Group
                                            </Badge>
                                        )}
                                    </div>

                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
                                        {batch.title}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                                            <Star size={16} fill="currentColor" /> {batch.rating}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users size={16} className="text-cyan-700 dark:text-cyan-400" />
                                            <span className="font-medium">{batch.studentCount} Students</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} className="text-cyan-700 dark:text-cyan-400" />
                                            <span className="font-medium">Starts {batch.startDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none mb-8 gap-8 overflow-x-auto">
                            <TabsTrigger
                                value="overview"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <FileText size={18} /> Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="curriculum"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <BookOpen size={18} /> Curriculum
                            </TabsTrigger>
                            <TabsTrigger
                                value="instructor"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <GraduationCap size={18} /> Instructor
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-300">
                            {/* Description */}
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Course Overview</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg">
                                    {batch.description}
                                </p>
                            </section>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {batch.features?.map((feature: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Intro Video */}
                            {batch.introVideoUrl && (
                                <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer shadow-lg">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Play size={32} className="text-white ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                    <img
                                        src={batch.introVideoUrl}
                                        alt="Intro Video Thumbnail"
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <div className="font-bold text-lg mb-1">Watch Course Intro</div>
                                        <div className="text-sm opacity-80">Hear from the instructor</div>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="curriculum" className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Syllabus & Modules</h2>
                                <span className="text-sm text-slate-500">{batch.syllabus?.length || 0} Modules</span>
                            </div>
                            <div className="space-y-4">
                                {batch.syllabus?.map((module: any, index: number) => (
                                    <div key={index} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-cyan-100 dark:hover:border-cyan-800 transition-colors">
                                        <button
                                            onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-xl flex items-center justify-center font-bold text-sm">
                                                    {String(index + 1).padStart(2, '0')}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{module.title}</div>
                                                    <div className="text-sm text-slate-500">{module.lessons.length} Lessons</div>
                                                </div>
                                            </div>
                                            {expandedModule === index ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                        </button>
                                        {expandedModule === index && (
                                            <div className="px-6 pb-6 pt-2 space-y-3 border-t border-slate-100 dark:border-slate-800">
                                                {module.lessons.map((lesson: string, lIndex: number) => (
                                                    <div key={lIndex} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 pl-14">
                                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2" />
                                                        <span className="text-sm leading-relaxed">{lesson}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="instructor" className="animate-in fade-in duration-300">
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-slate-100 dark:border-slate-800 shadow-lg">
                                        <img src={batch.teacherImage} alt={batch.teacherName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{batch.teacherName}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                            <div className="flex items-center gap-1">
                                                <GraduationCap size={16} className="text-cyan-600" /> Lead Instructor
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                <Star size={14} fill="currentColor" /> {batch.rating} Rating
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                            {batch.teacherBio}
                                        </p>
                                        <Button variant="outline" onClick={() => navigate(`/teacher/${batch.teacherId}`)}>
                                            View Full Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Enrollment Card (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24 space-y-6">
                        <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <CardContent className="p-8">
                                <div className="mb-6">
                                    <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Course Fee</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">₹{batch.price}</span>
                                        <span className="text-slate-400 dark:text-slate-500 line-through text-lg">₹{Math.round(batch.price * 1.5)}</span>
                                    </div>
                                    <Badge className="mt-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">
                                        Save 33% Today
                                    </Badge>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <span>Batch Capacity</span>
                                        <span>{batch.studentCount}/{batch.maxStudents} Seats</span>
                                    </div>
                                    <Progress
                                        value={progressVal}
                                        className="h-2"
                                        indicatorClassName={batch.studentCount >= batch.maxStudents ? 'bg-rose-500' : 'bg-cyan-700'}
                                    />
                                    <p className={`text-[10px] text-center font-bold ${batch.studentCount >= batch.maxStudents ? 'text-rose-600' : 'text-cyan-600'}`}>
                                        {batch.studentCount >= batch.maxStudents ? 'Batch Full!' : `Only ${batch.maxStudents - batch.studentCount} seats left!`}
                                    </p>
                                </div>

                                <Separator className="my-6" />

                                <div className="space-y-4 mb-8">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Weekly Schedule</h4>
                                    {batch.schedule?.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">{item.day}</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{item.time}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleEnroll}
                                    disabled={enrolling || batch.studentCount >= batch.maxStudents}
                                    className="w-full py-6 text-lg font-bold shadow-xl shadow-cyan-700/20"
                                >
                                    {enrolling ? (
                                        <Loader2 className="animate-spin mr-2" />
                                    ) : batch.studentCount >= batch.maxStudents ? (
                                        <>Batch Full <Users size={20} className="ml-2" /></>
                                    ) : (
                                        <>Enroll Now <ArrowRight size={20} className="ml-2" /></>
                                    )}
                                </Button>

                                <div className="mt-4 flex gap-2">
                                    <Button variant="outline" className="flex-1" onClick={() => setIsSaved(!isSaved)}>
                                        <Heart size={18} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-rose-500" : ""} />
                                    </Button>
                                    <Button variant="outline" className="flex-1" onClick={() => { }}>
                                        <Share2 size={18} />
                                    </Button>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
                                        <Clock size={14} className="text-cyan-700 dark:text-cyan-400" />
                                        <span>Lifetime access to recordings</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
                                        <CheckCircle2 size={14} className="text-cyan-700 dark:text-cyan-400" />
                                        <span>Money-back guarantee</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
