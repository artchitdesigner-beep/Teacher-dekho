import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, Clock, Calendar, Users, CheckCircle2, Loader2, ArrowRight, BookOpen, GraduationCap, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';

export default function BatchDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [batch, setBatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [expandedModule, setExpandedModule] = useState<number | null>(0);

    useEffect(() => {
        async function fetchBatch() {
            if (!id) return;
            try {
                const docRef = doc(db, 'batches', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBatch({ id: docSnap.id, ...docSnap.data() });
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
    const progress = (batch.studentCount / batch.maxStudents) * 100;
    const isSmallGroup = batch.maxStudents <= 10;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-4`}>
                    <button onClick={() => navigate(-1)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 flex items-center gap-2">
                        <ArrowRight size={16} className="rotate-180" /> Back to Batches
                    </button>
                </div>
            </div>

            <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-8 grid grid-cols-1 lg:grid-cols-3 gap-8`}>
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                {batch.subject}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                Class {batch.class}
                            </span>
                            {isSmallGroup && (
                                <span className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <Users size={12} /> Small Group Cohort
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {batch.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star size={18} fill="currentColor" /> {batch.rating}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-cyan-700 dark:text-cyan-400" />
                                <span className="font-medium">{batch.studentCount} Students Enrolled</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-cyan-700 dark:text-cyan-400" />
                                <span className="font-medium">Starts {batch.startDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Banner Image */}
                    <div className="rounded-3xl overflow-hidden aspect-[21/9] shadow-xl">
                        <img
                            src={batch.image}
                            alt={batch.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Intro Video */}
                    {batch.introVideoUrl && (
                        <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative group cursor-pointer shadow-xl">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play size={40} className="text-white ml-1" fill="currentColor" />
                                </div>
                            </div>
                            <img
                                src={batch.introVideoUrl}
                                alt="Intro Video Thumbnail"
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute bottom-6 left-6 text-white">
                                <div className="font-bold text-xl mb-1">Watch Course Intro</div>
                                <div className="text-sm opacity-80">Hear from {batch.teacherName} about what you'll learn</div>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Course Overview</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            {batch.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {batch.features?.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                    <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className="font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Syllabus */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                            <BookOpen className="text-cyan-700 dark:text-cyan-400" /> Curriculum
                        </h2>
                        <div className="space-y-4">
                            {batch.syllabus?.map((module: any, index: number) => (
                                <div key={index} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-lg flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-slate-100">{module.title}</span>
                                        </div>
                                        {expandedModule === index ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                    </button>
                                    {expandedModule === index && (
                                        <div className="px-6 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {module.lessons.map((lesson: string, lIndex: number) => (
                                                <div key={lIndex} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 pl-12">
                                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                                    <span className="text-sm">{lesson}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Instructor */}
                    <section className="bg-cyan-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-white/10 shadow-2xl">
                                <img src={batch.teacherImage} alt={batch.teacherName} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <GraduationCap size={20} className="text-cyan-300" />
                                    <span className="text-cyan-200 font-bold uppercase tracking-widest text-xs">Lead Instructor</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{batch.teacherName}</h3>
                                <p className="text-cyan-100/80 leading-relaxed mb-6 max-w-xl">
                                    {batch.teacherBio}
                                </p>
                                <button className="px-6 py-2.5 bg-white text-cyan-900 font-bold rounded-xl hover:bg-cyan-50 transition-all active:scale-95 text-sm">
                                    View Full Profile
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Enrollment Card */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                            <div className="mb-8">
                                <div className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Course Fee</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">₹{batch.price}</span>
                                    <span className="text-slate-400 dark:text-slate-500 line-through text-lg">₹{Math.round(batch.price * 1.5)}</span>
                                </div>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                                    Save 33% Today
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <span>Batch Capacity</span>
                                    <span>{batch.studentCount}/{batch.maxStudents} Seats</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${batch.studentCount >= batch.maxStudents ? 'bg-rose-500' : 'bg-cyan-700'}`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className={`text-[10px] text-center font-bold animate-pulse ${batch.studentCount >= batch.maxStudents ? 'text-rose-600' : 'text-rose-500'}`}>
                                    {batch.studentCount >= batch.maxStudents ? 'Batch Full!' : `Only ${batch.maxStudents - batch.studentCount} seats left!`}
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Weekly Schedule</h4>
                                {batch.schedule?.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">{item.day}</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.time}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleEnroll}
                                disabled={enrolling || batch.studentCount >= batch.maxStudents}
                                className="w-full py-4 bg-cyan-700 text-white font-bold rounded-2xl hover:bg-cyan-700 transition-all shadow-xl shadow-cyan-700/20 active:scale-95 mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                            >
                                {enrolling ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : batch.studentCount >= batch.maxStudents ? (
                                    <>Batch Full <Users size={20} /></>
                                ) : (
                                    <>Enroll in Batch <ArrowRight size={20} /></>
                                )}
                            </button>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
                                    <Clock size={14} className="text-cyan-700 dark:text-cyan-400" />
                                    <span>Lifetime access to recordings</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
                                    <CheckCircle2 size={14} className="text-cyan-700 dark:text-cyan-400" />
                                    <span>Money-back guarantee</span>
                                </div>
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="bg-slate-900 rounded-3xl p-6 text-white">
                            <h4 className="font-bold mb-2">Need help?</h4>
                            <p className="text-sm text-slate-400 mb-4">Talk to our academic counselors for guidance.</p>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all text-sm">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
