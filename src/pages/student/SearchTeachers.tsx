import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import BookingModal from '@/components/booking/BookingModal';
import TeacherCard from '@/components/booking/TeacherCard';
import BatchCard from '@/components/batches/BatchCard';

export default function SearchTeachers() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userRole } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (user && userRole === 'student' && location.pathname === '/search') {
            navigate('/student/search' + location.search, { replace: true });
        }
    }, [user, userRole, location.pathname, navigate, location.search]);

    const [teachers, setTeachers] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || 'All');
    const [selectedClass, setSelectedClass] = useState(searchParams.get('class') || '12th');
    const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || 'English');
    const [minRating, setMinRating] = useState(Number(searchParams.get('rating')) || 0);
    const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        fetchTeachers();
        fetchBatches();
    }, []);

    useEffect(() => {
        const q = searchParams.get('q');
        const s = searchParams.get('subject');
        const c = searchParams.get('class');
        const l = searchParams.get('lang');
        const r = searchParams.get('rating');
        if (q !== null) setSearchQuery(q);
        if (s !== null) setSelectedSubject(s);
        if (c !== null) setSelectedClass(c);
        if (l !== null) setSelectedLanguage(l);
        if (r !== null) setMinRating(Number(r));
    }, [searchParams]);

    const fetchTeachers = async () => {
        try {
            const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
            const querySnapshot = await getDocs(q);
            const teacherData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTeachers(teacherData);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBatches = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'batches'));
            const batchData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBatches(batchData);
        } catch (error) {
            console.error('Error fetching batches:', error);
        }
    };

    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.subject?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || teacher.subject === selectedSubject;

        // New filters
        const matchesClass = !selectedClass || teacher.class?.includes(selectedClass);
        const matchesLanguage = !selectedLanguage || teacher.language?.includes(selectedLanguage);
        const matchesRating = teacher.rating >= minRating;

        return matchesSearch && matchesSubject && matchesClass && matchesLanguage && matchesRating;
    });

    const subjects = ['All', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'English', 'Computer Science'];

    const handleBook = (teacher: any) => {
        if (!user) {
            navigate('/login', { state: { from: `/teacher/${teacher.id}` } });
            return;
        }
        setSelectedTeacher(teacher);
    };

    const [activeTab, setActiveTab] = useState<'teachers' | 'batches'>('teachers');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'batches') setActiveTab('batches');
        else setActiveTab('teachers');
    }, [searchParams]);

    const handleTabChange = (tab: 'teachers' | 'batches') => {
        setActiveTab(tab);
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('tab', tab);
            return newParams;
        });
    };

    const isDashboard = location.pathname.startsWith('/student');

    return (
        <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} space-y-8 py-8`}>
            {/* Header / Search Bar */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="max-w-3xl">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">Find your perfect mentor</h1>
                    <p className="text-sm md:text-base text-slate-500 mb-6">Search from over 2,000+ verified teachers and courses.</p>

                    {/* Tabs */}
                    <div className="flex p-1 bg-slate-100 rounded-xl w-fit mb-6">
                        <button
                            onClick={() => handleTabChange('teachers')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'teachers' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Find Teachers
                        </button>
                        <button
                            onClick={() => handleTabChange('batches')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'batches' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Explore Batches
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder={activeTab === 'teachers' ? "Search by subject or teacher name..." : "Search for courses..."}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSearchParams({
                                        q: e.target.value,
                                        subject: selectedSubject,
                                        class: selectedClass,
                                        lang: selectedLanguage,
                                        rating: minRating.toString(),
                                        tab: activeTab
                                    });
                                }}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-base"
                            />
                        </div>

                        {activeTab === 'teachers' && (
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <select
                                    value={selectedClass}
                                    onChange={(e) => {
                                        setSelectedClass(e.target.value);
                                        setSearchParams({
                                            q: searchQuery,
                                            subject: selectedSubject,
                                            class: e.target.value,
                                            lang: selectedLanguage,
                                            rating: minRating.toString(),
                                            tab: activeTab
                                        });
                                    }}
                                    className="flex-grow md:flex-grow-0 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="11th">Class 11th</option>
                                    <option value="12th">Class 12th</option>
                                </select>

                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => {
                                        setSelectedLanguage(e.target.value);
                                        setSearchParams({
                                            q: searchQuery,
                                            subject: selectedSubject,
                                            class: selectedClass,
                                            lang: e.target.value,
                                            rating: minRating.toString(),
                                            tab: activeTab
                                        });
                                    }}
                                    className="flex-grow md:flex-grow-0 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="English">English</option>
                                    <option value="Hinglish">Hinglish</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Marathi">Marathi</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {activeTab === 'batches' ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-serif font-bold text-slate-900">Available Batches</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches
                            .filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(batch => (
                                <BatchCard
                                    key={batch.id}
                                    batch={batch}
                                />
                            ))}
                    </div>
                    {batches.length === 0 && (
                        <div className="text-center py-20 text-slate-500">No batches found.</div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 mb-4 font-bold text-slate-900"
                        >
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={20} /> Filters
                            </div>
                            <span className="text-indigo-600 text-sm">{showMobileFilters ? 'Hide' : 'Show'}</span>
                        </button>

                        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block bg-white p-6 rounded-2xl border border-slate-100 sticky top-24 animate-in fade-in slide-in-from-top-2 lg:animate-none`}>
                            <div className="hidden lg:flex items-center gap-2 font-bold text-slate-900 mb-6">
                                <SlidersHorizontal size={20} /> Filters
                            </div>

                            {/* Subject Filter */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">Subject</h4>
                                <div className="space-y-2">
                                    {subjects.map(subject => (
                                        <label key={subject} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedSubject === subject ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-400'}`}>
                                                {selectedSubject === subject && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="subject"
                                                className="hidden"
                                                checked={selectedSubject === subject}
                                                onChange={() => {
                                                    setSelectedSubject(subject);
                                                    setSearchParams({
                                                        q: searchQuery,
                                                        subject: subject,
                                                        class: selectedClass,
                                                        lang: selectedLanguage,
                                                        rating: minRating.toString(),
                                                        tab: activeTab
                                                    });
                                                    if (window.innerWidth < 1024) setShowMobileFilters(false);
                                                }}
                                            />
                                            <span className={`text-sm ${selectedSubject === subject ? 'text-indigo-600 font-medium' : 'text-slate-600'}`}>
                                                {subject}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter (Mock) */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">Hourly Rate</h4>
                                <div className="space-y-4">
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="w-1/2 h-full bg-indigo-600 rounded-full"></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                                        <span>₹100</span>
                                        <span>₹2000+</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">Rating</h4>
                                <div className="space-y-2">
                                    {[4, 3, 2, 0].map(rating => (
                                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${minRating === rating ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-400'}`}>
                                                {minRating === rating && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="rating"
                                                className="hidden"
                                                checked={minRating === rating}
                                                onChange={() => {
                                                    setMinRating(rating);
                                                    setSearchParams({
                                                        q: searchQuery,
                                                        subject: selectedSubject,
                                                        class: selectedClass,
                                                        lang: selectedLanguage,
                                                        rating: rating.toString(),
                                                        tab: activeTab
                                                    });
                                                    if (window.innerWidth < 1024) setShowMobileFilters(false);
                                                }}
                                            />
                                            <span className={`text-sm ${minRating === rating ? 'text-indigo-600 font-medium' : 'text-slate-600'} flex items-center gap-1`}>
                                                {rating === 0 ? 'Any Rating' : `${rating}+ Stars`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Teacher List */}
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-slate-900">
                                {filteredTeachers.length} {selectedSubject !== 'All' ? selectedSubject : ''} teachers found
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                Sort by: <span className="font-medium text-slate-900">Best Match</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-slate-100" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredTeachers.map(teacher => (
                                    <TeacherCard
                                        key={teacher.id}
                                        teacher={teacher}
                                        onBook={() => handleBook(teacher)}
                                    />
                                ))}

                                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Populate Demo Data</h3>
                                    <p className="text-slate-500 mb-4">Click the button below to seed the database with rich batch and teacher data.</p>
                                    <button
                                        onClick={async () => {
                                            setLoading(true);
                                            const { seedTeachers, seedBatches, seedBookings } = await import('@/lib/seed');
                                            await seedTeachers();
                                            await seedBatches();
                                            await seedBookings(user?.uid || 'dummy_student_1', user?.displayName || 'Demo Student');
                                            window.location.reload();
                                        }}
                                        className="px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                                    >
                                        Populate Demo Data
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedTeacher && user && (
                <BookingModal
                    teacher={selectedTeacher}
                    studentId={user.uid}
                    studentName={user.displayName || 'Student'}
                    onClose={() => setSelectedTeacher(null)}
                    onSuccess={() => {
                        setSelectedTeacher(null);
                        // Optional: Show success toast
                    }}
                />
            )}
        </div>
    );
}
