import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import BookingModal from '@/components/booking/BookingModal';
import TeacherCard from '@/components/booking/TeacherCard';
import BatchCard from '@/components/batches/BatchCard';
import PostRequestPromoCard from '@/components/search/PostRequestPromoCard';
import PostRequestBanner from '@/components/search/PostRequestBanner';
import PageHero from '@/components/common/PageHero';

export default function SearchTeachers() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userRole } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [teachers, setTeachers] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || 'All');
    const [selectedClass, setSelectedClass] = useState(searchParams.get('class') || '');
    const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || '');
    const [minRating, setMinRating] = useState(Number(searchParams.get('rating')) || 0);
    const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [activeTab, setActiveTab] = useState<'teachers' | 'batches'>('teachers');

    useEffect(() => {
        if (user && userRole === 'student' && location.pathname === '/search') {
            navigate('/student/search' + location.search, { replace: true });
        }
    }, [user, userRole, location.pathname, navigate, location.search]);

    useEffect(() => {
        if (location.pathname === '/student/batches') {
            setActiveTab('batches');
        } else if (location.pathname === '/student/search') {
            setActiveTab('teachers');
        }
    }, [location.pathname]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teachersQuery = query(collection(db, 'users'), where('role', '==', 'teacher'));
                const teachersSnap = await getDocs(teachersQuery);
                setTeachers(teachersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                const batchesSnap = await getDocs(collection(db, 'batches'));
                setBatches(batchesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    const handleBook = (teacher: any) => {
        if (!user) {
            navigate('/login', { state: { from: `/teacher/${teacher.id}` } });
            return;
        }
        setSelectedTeacher(teacher);
    };

    const filteredTeachers = teachers.filter(teacher => {
        const teacherName = teacher.name || teacher.displayName || '';
        const matchesSearch = teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.subjects?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        // Robust Subject Check (Case-insensitive, handles 'subject' and 'subjects')
        const teacherSubjects = (teacher.subjects || []).map((s: string) => s.toLowerCase());
        if (teacher.subject) teacherSubjects.push(teacher.subject.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || teacherSubjects.includes(selectedSubject.toLowerCase());

        // Robust Class Check (Case-insensitive, handles array/string)
        const teacherClasses = Array.isArray(teacher.class) ? teacher.class : [teacher.class];
        const normalizedClasses = teacherClasses.filter(Boolean).map((c: any) => String(c).toLowerCase());
        const matchesClass = !selectedClass || normalizedClasses.includes(selectedClass.toLowerCase());

        // Robust Language Check (Case-insensitive, handles array/string)
        const teacherLanguages = Array.isArray(teacher.language) ? teacher.language : [teacher.language];
        const normalizedLanguages = teacherLanguages.filter(Boolean).map((l: any) => String(l).toLowerCase());
        const matchesLanguage = !selectedLanguage || normalizedLanguages.includes(selectedLanguage.toLowerCase());

        const matchesRating = (teacher.rating || 0) >= minRating;

        return matchesSearch && matchesSubject && matchesClass && matchesLanguage && matchesRating;
    });

    const subjects = ['All', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'English', 'Computer Science'];
    const isDashboard = location.pathname.startsWith('/student');

    return (
        <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} space-y-8 py-8`}>
            {/* Header / Search Bar */}
            <PageHero
                title="Find your perfect mentor"
                description="Search from over 2,000+ verified teachers and courses."
            >
                <div className="flex flex-col md:flex-row items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-xl">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-200" size={20} />
                        <input
                            type="text"
                            placeholder={activeTab === 'teachers' ? "Search for teacher or subject..." : "Search for courses..."}
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
                            className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none transition text-base text-white placeholder:text-cyan-200/70"
                        />
                    </div>

                    {activeTab === 'teachers' && (
                        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
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
                                className="flex-grow md:flex-grow-0 w-full md:w-auto px-4 py-3 bg-white/10 border-none rounded-xl font-medium text-white outline-none cursor-pointer hover:bg-white/20 transition-colors [&>option]:text-slate-900"
                            >
                                <option value="">All Classes</option>
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
                                className="flex-grow md:flex-grow-0 w-full md:w-auto px-4 py-3 bg-white/10 border-none rounded-xl font-medium text-white outline-none cursor-pointer hover:bg-white/20 transition-colors [&>option]:text-slate-900"
                            >
                                <option value="">All Languages</option>
                                <option value="English">English</option>
                                <option value="Hinglish">Hinglish</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Marathi">Marathi</option>
                            </select>

                            <button className="w-full md:w-auto px-8 py-3 bg-white text-cyan-700 font-bold rounded-xl hover:bg-cyan-50 transition-colors shadow-lg">
                                Search
                            </button>
                        </div>
                    )}
                </div>
            </PageHero>

            {activeTab === 'batches' ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">Available Batches</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches
                            .filter(b => b.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(batch => (
                                <BatchCard
                                    key={batch.id}
                                    batch={batch}
                                />
                            ))}
                    </div>
                    {batches.length === 0 && (
                        <div className="text-center py-20 text-slate-500 dark:text-slate-400">No batches found.</div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4 font-bold text-slate-900 dark:text-slate-100"
                        >
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={20} /> Filters
                            </div>
                            <span className="text-cyan-700 text-sm">{showMobileFilters ? 'Hide' : 'Show'}</span>
                        </button>

                        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 sticky top-24 animate-in fade-in slide-in-from-top-2 lg:animate-none`}>
                            <div className="hidden lg:flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-6">
                                <SlidersHorizontal size={20} /> Filters
                            </div>

                            {/* Subject Filter */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Subject</h4>
                                <div className="space-y-2">
                                    {subjects.map(subject => (
                                        <label key={subject} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedSubject === subject ? 'bg-cyan-700 border-cyan-700' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-cyan-400'}`}>
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
                                            <span className={`text-sm ${selectedSubject === subject ? 'text-cyan-700 dark:text-cyan-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {subject}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter (Mock) */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Hourly Rate</h4>
                                <div className="space-y-4">
                                    <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="w-1/2 h-full bg-cyan-700 rounded-full"></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                                        <span>₹100</span>
                                        <span>₹2000+</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Rating</h4>
                                <div className="space-y-2">
                                    {[4, 3, 2, 0].map(rating => (
                                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${minRating === rating ? 'bg-cyan-700 border-cyan-700' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-cyan-400'}`}>
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
                                            <span className={`text-sm ${minRating === rating ? 'text-cyan-700 dark:text-cyan-400 font-medium' : 'text-slate-600 dark:text-slate-400'} flex items-center gap-1`}>
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
                        <PostRequestBanner />

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-slate-900 dark:text-slate-100">
                                {filteredTeachers.length} {selectedSubject !== 'All' ? selectedSubject : ''} teachers found
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                Sort by: <span className="font-medium text-slate-900 dark:text-slate-100">Best Match</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800" />
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

                                {filteredTeachers.length > 0 && <PostRequestPromoCard />}

                                {filteredTeachers.length === 0 && (
                                    <div className="py-10">
                                        <PostRequestPromoCard />
                                    </div>
                                )}
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
                    }}
                />
            )}
        </div>
    );
}
