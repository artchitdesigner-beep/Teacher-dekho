import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Clock, Award, ShieldCheck, Play, Video, Calendar, CheckCircle2, Loader2, Heart, Share2, Linkedin, Youtube, Twitter, Globe, FileText, PlayCircle, BookOpen, MessageSquare } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import BookingSelectionModal from '@/components/booking/BookingSelectionModal';
import AvailabilityMap from '@/components/booking/AvailabilityMap';
import { useAuth } from '@/lib/auth-context';
import { getMinMonthlyRate } from '@/lib/plans';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TeacherProfilePublic() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userRole } = useAuth();

    useEffect(() => {
        if (user && userRole === 'student' && location.pathname.startsWith('/teacher/')) {
            const teacherId = location.pathname.split('/')[2];
            navigate(`/student/teacher/${teacherId}`, { replace: true });
        }
    }, [user, userRole, location.pathname, navigate]);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    useEffect(() => {
        console.log("TeacherProfilePublic mounted. ID:", id);
        async function fetchTeacher() {
            if (!id) {
                console.error("No ID found in params");
                return;
            }
            try {
                console.log("Fetching teacher with ID:", id);
                const docRef = doc(db, 'users', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    console.log("Teacher data found:", docSnap.data());
                    setTeacher({ uid: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("Teacher document does not exist");
                }
            } catch (error) {
                console.error("Error fetching teacher:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTeacher();
    }, [id]);

    const handleSlotClick = () => {
        if (!user) {
            navigate('/login', { state: { from: `/teacher/${id}` } });
            return;
        }
        setShowBookingModal(true);
    };



    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-cyan-700" /></div>;
    if (!teacher) return <div className="flex items-center justify-center min-h-screen">Teacher not found</div>;

    const isDashboard = location.pathname.startsWith('/student');
    const monthlyRate = getMinMonthlyRate();

    const videoSection = (
        <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative group cursor-pointer shadow-xl mb-6 border border-slate-200 dark:border-slate-800">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30">
                    <Play size={28} className="text-white ml-1" fill="currentColor" />
                </div>
            </div>
            <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Video Thumbnail"
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute bottom-4 left-4 text-white">
                <div className="font-bold text-sm">Meet {typeof teacher.name === 'string' ? teacher.name.split(' ')[0] : 'Teacher'}</div>
                <div className="text-[10px] opacity-80 font-medium">Watch introduction video</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-4`}>
                    <button onClick={() => navigate(-1)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 flex items-center gap-2">
                        <span>&larr;</span> Back to Search
                    </button>
                </div>
            </div>

            <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-8 grid grid-cols-1 lg:grid-cols-3 gap-8`}>
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Profile Header */}
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${teacher.avatarColor || 'bg-cyan-100 dark:bg-cyan-900/20'} flex-shrink-0 flex items-center justify-center text-3xl md:text-4xl font-bold text-cyan-700 dark:text-cyan-400 border-4 border-white dark:border-slate-800 shadow-lg`}>
                            {teacher.photoURL ? (
                                <img src={teacher.photoURL} alt={teacher.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                (teacher.name || 'T').charAt(0)
                            )}
                        </div>
                        <div className="flex-grow w-full">
                            <div className="flex flex-row justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        {typeof teacher.name === 'string' ? teacher.name : 'Teacher'}
                                        {teacher.kycStatus === 'verified' && <ShieldCheck size={20} className="text-emerald-500" fill="currentColor" stroke="white" />}
                                    </h1>
                                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium mb-2">
                                        {typeof teacher.subject === 'string' ? teacher.subject : 'Subject'} Expert • {typeof teacher.experience === 'string' || typeof teacher.experience === 'number' ? teacher.experience : '0'} Experience
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} /> {typeof teacher.college === 'string' ? teacher.college : 'Online'}
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                                            <Star size={16} fill="currentColor" /> {typeof teacher.rating === 'number' || typeof teacher.rating === 'string' ? teacher.rating : 'New'} ({typeof teacher.reviewCount === 'number' ? teacher.reviewCount : 0})
                                        </div>
                                        {teacher.joiningDate && typeof teacher.joiningDate.toDate === 'function' && (
                                            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                                                <Calendar size={16} /> Joined {teacher.joiningDate.toDate().toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showShareToast && (
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-emerald-400" />
                            Link copied to clipboard!
                        </div>
                    )}

                    {/* Tabs Refactoring */}
                    <Tabs defaultValue="about" className="w-full">
                        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none mb-8 gap-8">
                            <TabsTrigger
                                value="about"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <BookOpen size={18} /> About Teacher
                            </TabsTrigger>
                            <TabsTrigger
                                value="resources"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <FileText size={18} /> Free Resources
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="bg-transparent text-slate-500 dark:text-slate-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cyan-700 dark:data-[state=active]:border-cyan-400 rounded-none px-2 py-3 font-bold flex items-center gap-2 transition-all"
                            >
                                <MessageSquare size={18} /> Student Reviews
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="about" className="space-y-8 animate-in fade-in duration-300">
                            {/* About Section */}
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">About {typeof teacher.name === 'string' ? teacher.name.split(' ')[0] : 'Teacher'}</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg">
                                    {typeof teacher.bio === 'string' ? teacher.bio : 'No bio available.'}
                                    <br /><br />
                                    I believe in a conceptual approach to learning. My teaching methodology focuses on real-world examples and problem-solving techniques that help students not just memorize, but understand the core principles.
                                </p>
                            </section>

                            {/* Education & Certifications */}
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Education & Qualifications</h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-slate-100">PhD in {teacher.subject}</div>
                                            <div className="text-slate-500 dark:text-slate-400">{teacher.college || 'University'}, 2018</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-slate-100">Certified Online Educator</div>
                                            <div className="text-slate-500 dark:text-slate-400">Global Teaching Association, 2020</div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Certificates Gallery */}
                            {Array.isArray(teacher.certificates) && teacher.certificates.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Certificates</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {teacher.certificates.map((cert: string, index: number) => (
                                            typeof cert === 'string' ? (
                                                <div key={index} className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow">
                                                    <img src={cert} alt={`Certificate ${index + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Social Links */}
                            {teacher.socialLinks && typeof teacher.socialLinks === 'object' && (
                                <section className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Connect with {typeof teacher.name === 'string' ? teacher.name.split(' ')[0] : 'Teacher'}</h2>
                                    <div className="flex items-center gap-4">
                                        {teacher.socialLinks?.linkedin && typeof teacher.socialLinks.linkedin === 'string' && (
                                            <a href={teacher.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-[#0077b5] text-white rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-[#0077b5]/20">
                                                <Linkedin size={20} />
                                            </a>
                                        )}
                                        {teacher.socialLinks?.twitter && typeof teacher.socialLinks.twitter === 'string' && (
                                            <a href={teacher.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-[#1DA1F2]/20">
                                                <Twitter size={20} />
                                            </a>
                                        )}
                                        {teacher.socialLinks?.youtube && typeof teacher.socialLinks.youtube === 'string' && (
                                            <a href={teacher.socialLinks.youtube} target="_blank" rel="noreferrer" className="p-3 bg-[#FF0000] text-white rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-[#FF0000]/20">
                                                <Youtube size={20} />
                                            </a>
                                        )}
                                        {teacher.socialLinks?.website && typeof teacher.socialLinks.website === 'string' && (
                                            <a href={teacher.socialLinks.website} target="_blank" rel="noreferrer" className="p-3 bg-cyan-700 text-white rounded-full hover:bg-cyan-800 transition-colors shadow-lg shadow-cyan-700/20">
                                                <Globe size={20} />
                                            </a>
                                        )}
                                    </div>
                                </section>
                            )}
                        </TabsContent>

                        <TabsContent value="resources" className="animate-in fade-in duration-300">
                            {/* Public Resources */}
                            {Array.isArray(teacher.resources) && teacher.resources.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {teacher.resources.map((resource: any, index: number) => (
                                        resource && typeof resource === 'object' ? (
                                            <a
                                                key={index}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-md transition-all group"
                                            >
                                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0 relative">
                                                    <img src={resource.thumbnail} alt={resource.title || 'Resource'} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                        {resource.type === 'video' ? <PlayCircle size={24} className="text-white drop-shadow-md" /> : <FileText size={24} className="text-white drop-shadow-md" />}
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">{resource.title || 'Untitled'}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mb-2">{resource.type || 'Resource'}</p>
                                                    <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">View Resource &rarr;</span>
                                                </div>
                                            </a>
                                        ) : null
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                    <p className="text-slate-500 dark:text-slate-400">No free resources available yet.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="reviews" className="animate-in fade-in duration-300">
                            {/* Reviews Section */}
                            <div>
                                {/* Rating Breakdown */}
                                {teacher.ratingBreakdown && typeof teacher.ratingBreakdown === 'object' && (
                                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl mb-8 shadow-sm">
                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="text-center md:border-r border-slate-100 dark:border-slate-800 md:pr-8">
                                                <div className="text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">{teacher.rating || '0.0'}</div>
                                                <div className="flex text-amber-400 justify-center mb-2">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} size={20} fill={s <= Math.floor(teacher.rating || 0) ? "currentColor" : "none"} className={s > Math.floor(teacher.rating || 0) ? "text-slate-200 dark:text-slate-700" : ""} />
                                                    ))}
                                                </div>
                                                <div className="text-sm font-bold text-slate-500 dark:text-slate-400">{teacher.reviewCount || 0} Reviews</div>
                                            </div>
                                            <div className="flex-1 w-full space-y-3">
                                                {[5, 4, 3, 2, 1].map((star) => {
                                                    const count = teacher.ratingBreakdown?.[star] || 0;
                                                    const total = Object.values(teacher.ratingBreakdown).reduce((a: any, b: any) => Number(a) + Number(b), 0) as number;
                                                    const percentage = total > 0 ? (count / total) * 100 : 0;
                                                    return (
                                                        <div key={star} className="flex items-center gap-4 text-sm">
                                                            <div className="w-12 font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">{star} <Star size={14} fill="currentColor" className="text-amber-400" /></div>
                                                            <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div className="h-full bg-cyan-700 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                                                            </div>
                                                            <div className="w-10 text-right font-medium text-slate-400 dark:text-slate-500">{count}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid gap-6">
                                    {teacher.reviewCount > 0 ? (
                                        [1, 2].map((i) => (
                                            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="flex text-amber-400">
                                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Excellent Teacher!</span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed italic">"Explains concepts very clearly. Highly recommended for anyone struggling with {typeof teacher.subject === 'string' ? teacher.subject : 'this subject'}."</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">S</div>
                                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Verified Student</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                            <MessageSquare size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                            <p className="text-slate-500 dark:text-slate-400">No reviews yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Video & Booking Card */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24 space-y-6">
                        {/* Video moved here */}
                        {videoSection}

                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        ₹{monthlyRate}
                                    </div>
                                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">per month</div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold border border-green-100 dark:border-green-900/30">
                                    <Clock size={12} /> Available Now
                                </div>
                            </div>

                            <div className="space-y-4 mb-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                    <div className="w-8 h-8 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg flex items-center justify-center text-cyan-700 dark:text-cyan-400">
                                        <Video size={18} />
                                    </div>
                                    <span className="font-medium">1-on-1 Online Class</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                    <div className="w-8 h-8 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg flex items-center justify-center text-cyan-700 dark:text-cyan-400">
                                        <Calendar size={18} />
                                    </div>
                                    <span className="font-medium">Flexible Scheduling</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                    <div className="w-8 h-8 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg flex items-center justify-center text-cyan-700 dark:text-cyan-400">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <span className="font-medium">Satisfaction Guaranteed</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => setShowBookingModal(true)}
                                    className="w-full py-4 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-700/20 active:scale-95 flex items-center justify-center gap-2 text-lg"
                                >
                                    Book a Class
                                </button>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setIsSaved(!isSaved)}
                                        className={`w-full py-3.5 rounded-xl font-bold transition-all border flex items-center justify-center gap-2 ${isSaved ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                    >
                                        <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                                        {isSaved ? 'Tutor Saved' : 'Save My Tutor'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            setShowShareToast(true);
                                            setTimeout(() => setShowShareToast(false), 2000);
                                        }}
                                        className="w-full py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Share2 size={18} />
                                        Share Tutor
                                    </button>
                                </div>
                            </div>

                            <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                Pay after your first class. No upfront payment required.
                            </p>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Availability</h3>
                                <AvailabilityMap
                                    availability={teacher.availability}
                                    onSlotClick={handleSlotClick}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showBookingModal && user && (
                <BookingSelectionModal
                    teacher={teacher}
                    studentId={user.uid}
                    onClose={() => setShowBookingModal(false)}
                />
            )}
        </div>
    );
}
