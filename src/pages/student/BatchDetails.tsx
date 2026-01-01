import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, Clock, Calendar, Users, CheckCircle2, Loader2, ArrowRight, BookOpen, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
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

        setEnrolling(true);
        try {
            const bookingData = {
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
                sessions: [
                    {
                        id: 's1',
                        scheduledAt: Timestamp.fromDate(new Date(Date.now() + 86400000)), // Tomorrow
                        status: 'confirmed',
                        isDemo: true
                    }
                ]
            };

            const docRef = await addDoc(collection(db, 'bookings'), bookingData);
            navigate(`/student/bookings/${docRef.id}`);
        } catch (error) {
            console.error("Error enrolling in batch:", error);
            alert("Failed to enroll. Please try again.");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-indigo-600" /></div>;
    if (!batch) return <div className="flex items-center justify-center min-h-screen">Batch not found</div>;

    const isDashboard = location.pathname.startsWith('/student');
    const progress = (batch.studentCount / batch.maxStudents) * 100;

    return (
        <div className="min-h-screen bg-[#FDFCF8] pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-slate-100">
                <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-4`}>
                    <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-2">
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
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                {batch.subject}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                Class {batch.class}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                            {batch.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star size={18} fill="currentColor" /> {batch.rating}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-indigo-600" />
                                <span className="font-medium">{batch.studentCount} Students Enrolled</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-indigo-600" />
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

                    {/* Description */}
                    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Course Overview</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            {batch.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {batch.features?.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className="font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Syllabus */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <BookOpen className="text-indigo-600" /> Curriculum
                        </h2>
                        <div className="space-y-4">
                            {batch.syllabus?.map((module: any, index: number) => (
                                <div key={index} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <span className="font-bold text-slate-900">{module.title}</span>
                                        </div>
                                        {expandedModule === index ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                    </button>
                                    {expandedModule === index && (
                                        <div className="px-6 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {module.lessons.map((lesson: string, lIndex: number) => (
                                                <div key={lIndex} className="flex items-center gap-3 text-slate-600 pl-12">
                                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
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
                    <section className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-white/10 shadow-2xl">
                                <img src={batch.teacherImage} alt={batch.teacherName} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <GraduationCap size={20} className="text-indigo-300" />
                                    <span className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Lead Instructor</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{batch.teacherName}</h3>
                                <p className="text-indigo-100/80 leading-relaxed mb-6 max-w-xl">
                                    {batch.teacherBio}
                                </p>
                                <button className="px-6 py-2.5 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-all active:scale-95 text-sm">
                                    View Full Profile
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Enrollment Card */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-2xl shadow-slate-200/50">
                            <div className="mb-8">
                                <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Course Fee</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-slate-900">₹{batch.price}</span>
                                    <span className="text-slate-400 line-through text-lg">₹{Math.round(batch.price * 1.5)}</span>
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
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-center text-rose-500 font-bold animate-pulse">
                                    Only {batch.maxStudents - batch.studentCount} seats left!
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <h4 className="text-sm font-bold text-slate-900 mb-3">Weekly Schedule</h4>
                                {batch.schedule?.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">{item.day}</span>
                                        <span className="font-bold text-slate-700">{item.time}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {enrolling ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>Enroll in Batch <ArrowRight size={20} /></>
                                )}
                            </button>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-500 text-xs">
                                    <Clock size={14} className="text-indigo-600" />
                                    <span>Lifetime access to recordings</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-xs">
                                    <CheckCircle2 size={14} className="text-indigo-600" />
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
