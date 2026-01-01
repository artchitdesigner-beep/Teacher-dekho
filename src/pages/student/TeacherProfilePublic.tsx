import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Clock, Award, ShieldCheck, Play, Video, Calendar, CheckCircle2, Loader2, Heart, Share2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import BookingModal from '@/components/booking/BookingModal';
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
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
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

    const handleSlotClick = (day: string, slot: string) => {
        if (!user) {
            navigate('/login', { state: { from: `/teacher/${id}` } });
            return;
        }
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const targetDayIndex = days.indexOf(day);
        const today = new Date();
        const currentDayIndex = today.getDay();

        let diff = targetDayIndex - currentDayIndex;
        if (diff < 0) diff += 7; // Next week

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);

        const dateString = targetDate.toISOString().split('T')[0];
        setSelectedDate(dateString);
        setSelectedTime(slot);
        setShowBookingModal(true);
    };

    const handleBookClick = () => {
        if (!user) {
            navigate('/login', { state: { from: `/teacher/${id}` } });
            return;
        }
        setShowBookingModal(true);
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-indigo-600" /></div>;
    if (!teacher) return <div className="flex items-center justify-center min-h-screen">Teacher not found</div>;

    const isDashboard = location.pathname.startsWith('/student');

    return (
        <div className="min-h-screen bg-[#FDFCF8] pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-slate-100">
                <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-4`}>
                    <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-indigo-600">
                        &larr; Back to Search
                    </button>
                </div>
            </div>

            <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} py-8 grid grid-cols-1 lg:grid-cols-3 gap-8`}>
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Profile Header */}
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${teacher.avatarColor || 'bg-indigo-100'} flex-shrink-0 flex items-center justify-center text-3xl md:text-4xl font-bold text-indigo-600 border-4 border-white shadow-lg`}>
                            {teacher.photoURL ? (
                                <img src={teacher.photoURL} alt={teacher.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                teacher.name.charAt(0)
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                {teacher.name}
                                {teacher.kycStatus === 'verified' && <ShieldCheck size={20} className="text-emerald-500" fill="currentColor" stroke="white" />}
                            </h1>
                            <p className="text-base md:text-lg text-slate-600 font-medium mb-2">{teacher.subject} Expert • {teacher.experience} Experience</p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} /> {teacher.college || 'Online'}
                                </div>
                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                    <Star size={16} fill="currentColor" /> {teacher.rating || 'New'} ({teacher.reviewCount || 0})
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6">
                                <button
                                    onClick={() => setIsSaved(!isSaved)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isSaved ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600'}`}
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
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                                >
                                    <Share2 size={18} />
                                    Share
                                </button>
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
                            <div className="font-bold text-lg">Meet {teacher.name.split(' ')[0]}</div>
                            <div className="text-sm opacity-80">Watch introduction video</div>
                        </div>
                    </div>

                    {/* About Section */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">About {teacher.name.split(' ')[0]}</h2>
                        <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                            {teacher.bio}
                            <br /><br />
                            I believe in a conceptual approach to learning. My teaching methodology focuses on real-world examples and problem-solving techniques that help students not just memorize, but understand the core principles.
                        </p>
                    </section>

                    {/* Education & Certifications */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Education & Qualifications</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">PhD in {teacher.subject}</div>
                                    <div className="text-slate-500">{teacher.college || 'University'}, 2018</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">Certified Online Educator</div>
                                    <div className="text-slate-500">Global Teaching Association, 2020</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Reviews Preview */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Student Reviews</h2>
                        <div className="grid gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">Excellent Teacher!</span>
                                    </div>
                                    <p className="text-slate-600 mb-3">"Explains concepts very clearly. Highly recommended for anyone struggling with {teacher.subject}."</p>
                                    <div className="text-sm text-slate-400">- Student Name</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Booking Card */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24 bg-white rounded-3xl border border-slate-200 p-6 shadow-xl shadow-slate-200/50">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-slate-900">₹{teacher.hourlyRate}</div>
                                <div className="text-slate-500 text-sm">per hour</div>
                            </div>
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold">
                                <Clock size={12} /> Available Now
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <Video size={18} className="text-indigo-600" />
                                <span>1-on-1 Online Class</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <Calendar size={18} className="text-indigo-600" />
                                <span>Flexible Scheduling</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <ShieldCheck size={18} className="text-indigo-600" />
                                <span>Satisfaction Guaranteed</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBookClick}
                            className="w-full py-3.5 md:py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 mb-4"
                        >
                            Book Class
                        </button>

                        <p className="text-center text-[10px] md:text-xs text-slate-400">
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
                <BookingModal
                    teacher={teacher}
                    studentId={user.uid}
                    studentName={user.displayName || 'Student'}
                    initialDate={selectedDate}
                    initialTime={selectedTime}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedDate('');
                        setSelectedTime('');
                    }}
                    onSuccess={() => {
                        alert('Booking request sent!');
                        setShowBookingModal(false);
                    }}
                />
            )}
        </div>
    );
}
