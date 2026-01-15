import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Clock, Award, ShieldCheck, Play, Video, Calendar, CheckCircle2, Loader2, Heart, Share2, Linkedin, Youtube, Twitter, Globe, FileText, PlayCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import BookingSelectionModal from '@/components/booking/BookingSelectionModal';
import AvailabilityMap from '@/components/booking/AvailabilityMap';
import { useAuth } from '@/lib/auth-context';

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
        async function fetchTeacher() {
            if (!id) return;
            try {
                const docRef = doc(db, 'users', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTeacher({ uid: docSnap.id, ...docSnap.data() });
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-4`}>
                    <button onClick={() => navigate(-1)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400">
                        &larr; Back to Search
                    </button>
                </div>
            </div>

            <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-8 grid grid-cols-1 lg:grid-cols-3 gap-8`}>
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Profile Header */}
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${teacher.avatarColor || 'bg-cyan-100 dark:bg-cyan-900/20'} flex-shrink-0 flex items-center justify-center text-3xl md:text-4xl font-bold text-cyan-700 dark:text-cyan-400 border-4 border-white dark:border-slate-800 shadow-lg`}>
                            {teacher.photoURL ? (
                                <img src={teacher.photoURL} alt={teacher.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                teacher.name.charAt(0)
                            )}
                        </div>
                        <div className="flex-grow w-full">
                            <div className="flex flex-row justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        {teacher.name || 'Teacher'}
                                        {teacher.kycStatus === 'verified' && <ShieldCheck size={20} className="text-emerald-500" fill="currentColor" stroke="white" />}
                                    </h1>
                                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium mb-2">{teacher.subject} Expert • {teacher.experience} Experience</p>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} /> {teacher.college || 'Online'}
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                                            <Star size={16} fill="currentColor" /> {teacher.rating || 'New'} ({teacher.reviewCount || 0})
                                        </div>
                                        {teacher.joiningDate && teacher.joiningDate.toDate && (
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

                    {/* Video Intro */}
                    <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer shadow-xl">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play size={32} className="text-white ml-1" fill="currentColor" />
                            </div>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute bottom-4 left-4 text-white">
                            <div className="font-bold text-lg">Meet {teacher.name?.split(' ')[0] || 'Teacher'}</div>
                            <div className="text-sm opacity-80">Watch introduction video</div>
                        </div>
                    </div>

                    {/* About Section */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">About {teacher.name?.split(' ')[0] || 'Teacher'}</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg">
                            {teacher.bio}
                            <br /><br />
                            I believe in a conceptual approach to learning. My teaching methodology focuses on real-world examples and problem-solving techniques that help students not just memorize, but understand the core principles.
                        </p>
                    </section>

                    {/* Education & Certifications */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Education & Qualifications</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl flex items-center justify-center text-cyan-700 dark:text-cyan-400">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-slate-100">PhD in {teacher.subject}</div>
                                    <div className="text-slate-500 dark:text-slate-400">{teacher.college || 'University'}, 2018</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
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
                    {teacher.certificates && teacher.certificates.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Certificates</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {teacher.certificates.map((cert: string, index: number) => (
                                    <div key={index} className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow">
                                        <img src={cert} alt={`Certificate ${index + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Public Resources */}
                    {teacher.resources && teacher.resources.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Free Resources</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {teacher.resources.map((resource: any, index: number) => (
                                    <a
                                        key={index}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-md transition-all group"
                                    >
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0 relative">
                                            <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                {resource.type === 'video' ? <PlayCircle size={24} className="text-white drop-shadow-md" /> : <FileText size={24} className="text-white drop-shadow-md" />}
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">{resource.title}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mb-2">{resource.type}</p>
                                            <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">View Resource &rarr;</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Reviews Preview */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Student Reviews</h2>

                        {/* Rating Breakdown */}
                        {teacher.ratingBreakdown && (
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl mb-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-slate-900 dark:text-slate-100">{teacher.rating}</div>
                                        <div className="flex text-amber-400 justify-center my-1">
                                            <Star size={16} fill="currentColor" />
                                            <Star size={16} fill="currentColor" />
                                            <Star size={16} fill="currentColor" />
                                            <Star size={16} fill="currentColor" />
                                            <Star size={16} fill="currentColor" className="text-slate-300 dark:text-slate-600" />
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{teacher.reviewCount} Reviews</div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = teacher.ratingBreakdown[star] || 0;
                                            const total = Object.values(teacher.ratingBreakdown).reduce((a: any, b: any) => a + b, 0) as number;
                                            const percentage = total > 0 ? (count / total) * 100 : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-3 text-xs">
                                                    <div className="w-8 font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">{star} <Star size={10} fill="currentColor" className="text-slate-400 dark:text-slate-500" /></div>
                                                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                    <div className="w-8 text-right text-slate-400 dark:text-slate-500">{count}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Excellent Teacher!</span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 mb-3">"Explains concepts very clearly. Highly recommended for anyone struggling with {teacher.subject}."</p>
                                    <div className="text-sm text-slate-400 dark:text-slate-500">- Student Name</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Social Links (Moved to Bottom) */}
                    {teacher.socialLinks && (
                        <section className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Connect with {teacher.name?.split(' ')[0] || 'Teacher'}</h2>
                            <div className="flex items-center gap-4">
                                {teacher.socialLinks.linkedin && (
                                    <a href={teacher.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-[#0077b5] text-white rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-[#0077b5]/20">
                                        <Linkedin size={20} />
                                    </a>
                                )}
                                {teacher.socialLinks.twitter && (
                                    <a href={teacher.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-[#1DA1F2]/20">
                                        <Twitter size={20} />
                                    </a>
                                )}
                                {teacher.socialLinks.youtube && (
                                    <a href={teacher.socialLinks.youtube} target="_blank" rel="noreferrer" className="p-3 bg-[#FF0000] text-white rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-[#FF0000]/20">
                                        <Youtube size={20} />
                                    </a>
                                )}
                                {teacher.socialLinks.website && (
                                    <a href={teacher.socialLinks.website} target="_blank" rel="noreferrer" className="p-3 bg-cyan-700 text-white rounded-full hover:bg-cyan-800 transition-colors shadow-lg shadow-cyan-700/20">
                                        <Globe size={20} />
                                    </a>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column: Booking Card */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">₹{teacher.hourlyRate}</div>
                                <div className="text-slate-500 dark:text-slate-400 text-sm">per hour</div>
                            </div>
                            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold">
                                <Clock size={12} /> Available Now
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                <Video size={18} className="text-cyan-700 dark:text-cyan-400" />
                                <span>1-on-1 Online Class</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                <Calendar size={18} className="text-cyan-700 dark:text-cyan-400" />
                                <span>Flexible Scheduling</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                <ShieldCheck size={18} className="text-cyan-700 dark:text-cyan-400" />
                                <span>Satisfaction Guaranteed</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="w-full py-3.5 md:py-4 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-700/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Book Class
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsSaved(!isSaved)}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-all border flex items-center justify-center gap-2 ${isSaved ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                >
                                    <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                                    {isSaved ? 'Saved' : 'Save'}
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        setShowShareToast(true);
                                        setTimeout(() => setShowShareToast(false), 2000);
                                    }}
                                    className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Share2 size={18} />
                                    Share
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-[10px] md:text-xs text-slate-400 dark:text-slate-500">
                            Pay after your first class. No upfront payment required.
                        </p>

                        <div className="mt-8">
                            <AvailabilityMap
                                availability={teacher.availability}
                                onSlotClick={handleSlotClick}
                            />
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
