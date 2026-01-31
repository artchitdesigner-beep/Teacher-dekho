import { useState, useEffect, useRef } from 'react';
import { Search, Plus, BookOpen, GraduationCap, Languages, Star, IndianRupee, Calendar, X } from 'lucide-react';
import { collection, query, getDocs, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import BookingSelectionModal from '@/components/booking/BookingSelectionModal';

import TeacherCard from '@/components/booking/TeacherCard';
import BatchCard from '@/components/batches/BatchCard';
import PostRequestPromoCard from '@/components/search/PostRequestPromoCard';
import PageHero from '@/components/common/PageHero';
import { FilterDropdown } from '@/components/search/FilterDropdown';
import VideoOverlay from '@/components/common/VideoOverlay';
import CreateBatchRequestModal from '@/components/batches/CreateBatchRequestModal';

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
    const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all');
    const [availability, setAvailability] = useState(searchParams.get('availability') || 'any');
    const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

    const [activeTab, setActiveTab] = useState<'teachers' | 'batches'>('teachers');
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

    const [isSticky, setIsSticky] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (heroRef.current) {
                const heroBottom = heroRef.current.getBoundingClientRect().bottom;
                // When the bottom of the hero (minus some offset for the navbar) hits the top
                // Adjust 80 for navbar height roughly
                setIsSticky(heroBottom < 80);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                const batchesData = batchesSnap.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        startDate: data.startDate?.toDate ? data.startDate.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : data.startDate,
                        rawStartDate: data.startDate // Preserve for filtering
                    };
                });
                setBatches(batchesData);
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
        const p = searchParams.get('price');
        const a = searchParams.get('availability');

        if (q !== null) setSearchQuery(q);
        if (s !== null) setSelectedSubject(s);
        if (c !== null) setSelectedClass(c);
        if (l !== null) setSelectedLanguage(l);
        if (r !== null) setMinRating(Number(r));
        if (p !== null) setPriceRange(p);
        if (a !== null) setAvailability(a);
    }, [searchParams]);

    const updateFilters = (updates: any) => {
        const newParams = {
            q: searchQuery,
            subject: selectedSubject,
            class: selectedClass,
            lang: selectedLanguage,
            rating: minRating.toString(),
            price: priceRange,
            availability: availability,
            tab: activeTab,
            ...updates
        };
        // Remove empty params
        Object.keys(newParams).forEach(key => {
            if (newParams[key] === '' || newParams[key] === '0' || newParams[key] === 'All' || newParams[key] === 'all' || newParams[key] === 'any') {
                delete newParams[key];
            }
        });
        setSearchParams(newParams);
    };

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

        // Robust Subject Check
        const teacherSubjects = (teacher.subjects || []).map((s: string) => s.toLowerCase());
        if (teacher.subject) teacherSubjects.push(teacher.subject.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || teacherSubjects.includes(selectedSubject.toLowerCase());

        // Robust Class Check
        const teacherClasses = Array.isArray(teacher.class) ? teacher.class : [teacher.class];
        const normalizedClasses = teacherClasses.filter(Boolean).map((c: any) => String(c).toLowerCase());
        const matchesClass = !selectedClass || normalizedClasses.includes(selectedClass.toLowerCase());

        // Robust Language Check
        const teacherLanguages = Array.isArray(teacher.language) ? teacher.language : [teacher.language];
        const normalizedLanguages = teacherLanguages.filter(Boolean).map((l: any) => String(l).toLowerCase());
        const matchesLanguage = !selectedLanguage || normalizedLanguages.includes(selectedLanguage.toLowerCase());

        const matchesRating = (teacher.rating || 0) >= minRating;

        // Mock Price Check (since we might not have price data on all teachers yet)
        const matchesPrice = true;

        // Mock Availability Check
        const matchesAvailability = true;

        return matchesSearch && matchesSubject && matchesClass && matchesLanguage && matchesRating && matchesPrice && matchesAvailability;
    });

    const subjectOptions = [
        { label: 'All Subjects', value: 'All' },
        { label: 'Physics', value: 'Physics' },
        { label: 'Mathematics', value: 'Mathematics' },
        { label: 'Chemistry', value: 'Chemistry' },
        { label: 'Biology', value: 'Biology' },
        { label: 'English', value: 'English' },
        { label: 'Computer Science', value: 'Computer Science' }
    ];

    const classOptions = [
        { label: 'All Classes', value: '' },
        { label: 'Class 11th', value: '11th' },
        { label: 'Class 12th', value: '12th' },
        { label: 'Class 10th', value: '10th' },
        { label: 'Class 9th', value: '9th' }
    ];

    const languageOptions = [
        { label: 'All Languages', value: '' },
        { label: 'English', value: 'English' },
        { label: 'Hinglish', value: 'Hinglish' },
        { label: 'Hindi', value: 'Hindi' },
        { label: 'Marathi', value: 'Marathi' }
    ];

    const ratingOptions = [
        { label: 'Any Rating', value: '0' },
        { label: '4+ Stars', value: '4' },
        { label: '3+ Stars', value: '3' }
    ];

    const priceOptions = [
        { label: 'Any Price', value: 'all' },
        { label: 'Under ₹500', value: 'under_500' },
        { label: '₹500 - ₹1000', value: '500_1000' },
        { label: 'Above ₹1000', value: 'above_1000' }
    ];

    const availabilityOptions = [
        { label: 'Any Time', value: 'any' },
        { label: 'Weekdays', value: 'weekdays' },
        { label: 'Weekends', value: 'weekends' },
        { label: 'Evenings', value: 'evenings' }
    ];

    const isDashboard = location.pathname.startsWith('/student');

    // Helper to get display label
    const getDisplayLabel = (options: any[], value: string | number) => {
        const option = options.find(o => o.value === String(value));
        return option ? option.label : String(value);
    };

    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsNavbarVisible(false);
            } else {
                setIsNavbarVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const FilterBar = ({ sticky = false }) => (
        <div className={`
            ${sticky
                ? `fixed left-0 right-0 z-40 bg-white dark:bg-slate-900 shadow-md py-3 transition-all duration-300 ease-in-out ${isNavbarVisible ? 'top-[48px]' : 'top-[-32px]'}`
                : 'w-full py-4'
            }
        `}>
            <div className={`${sticky ? 'max-w-7xl mx-auto px-4 md:px-8' : ''}`}>
                <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 items-center">

                    {/* Small Search Bar - Only visible when sticky */}
                    {sticky && (
                        <div className="relative flex-shrink-0 w-64 mr-2 hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    updateFilters({ q: e.target.value });
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-cyan-500/20 outline-none"
                            />
                        </div>
                    )}

                    <FilterDropdown
                        label="Subject"
                        value={getDisplayLabel(subjectOptions, selectedSubject)}
                        selectedValue={selectedSubject}
                        icon={BookOpen}
                        options={subjectOptions}
                        onChange={(val) => {
                            setSelectedSubject(val);
                            updateFilters({ subject: val });
                        }}
                    />

                    <FilterDropdown
                        label="Class"
                        value={getDisplayLabel(classOptions, selectedClass)}
                        selectedValue={selectedClass}
                        icon={GraduationCap}
                        options={classOptions}
                        onChange={(val) => {
                            setSelectedClass(val);
                            updateFilters({ class: val });
                        }}
                    />

                    <FilterDropdown
                        label="Language"
                        value={getDisplayLabel(languageOptions, selectedLanguage)}
                        selectedValue={selectedLanguage}
                        icon={Languages}
                        options={languageOptions}
                        onChange={(val) => {
                            setSelectedLanguage(val);
                            updateFilters({ lang: val });
                        }}
                    />

                    <FilterDropdown
                        label="Rating"
                        value={getDisplayLabel(ratingOptions, minRating)}
                        selectedValue={String(minRating)}
                        icon={Star}
                        options={ratingOptions}
                        onChange={(val) => {
                            setMinRating(Number(val));
                            updateFilters({ rating: val });
                        }}
                    />

                    <FilterDropdown
                        label="Price"
                        value={getDisplayLabel(priceOptions, priceRange)}
                        selectedValue={priceRange}
                        icon={IndianRupee}
                        options={priceOptions}
                        onChange={(val) => {
                            setPriceRange(val);
                            updateFilters({ price: val });
                        }}
                    />

                    <FilterDropdown
                        label="Availability"
                        value={getDisplayLabel(availabilityOptions, availability)}
                        selectedValue={availability}
                        icon={Calendar}
                        options={availabilityOptions}
                        onChange={(val) => {
                            setAvailability(val);
                            updateFilters({ availability: val });
                        }}
                    />

                    {/* Clear Filters */}
                    {(selectedClass || selectedLanguage || minRating > 0 || selectedSubject !== 'All' || priceRange !== 'all' || availability !== 'any') && (
                        <button
                            onClick={() => {
                                setSelectedClass('');
                                setSelectedLanguage('');
                                setMinRating(0);
                                setSelectedSubject('All');
                                setPriceRange('all');
                                setAvailability('any');
                                updateFilters({ class: '', lang: '', rating: '0', subject: 'All', price: 'all', availability: 'any' });
                            }}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors whitespace-nowrap ml-auto"
                        >
                            <X size={16} /> Clear
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
    const [focusedCardId, setFocusedCardId] = useState<string | null>(null);

    const [savedTeacherIds, setSavedTeacherIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchSavedTeachers = async () => {
            if (!user) return;
            try {
                const savedSnap = await getDocs(collection(db, 'users', user.uid, 'saved_teachers'));
                setSavedTeacherIds(savedSnap.docs.map(doc => doc.id));
            } catch (error) {
                console.error('Error fetching saved teachers:', error);
            }
        };
        fetchSavedTeachers();
    }, [user]);

    const handleSaveTeacher = async (teacherId: string) => {
        if (!user) {
            alert('Please login to save teachers');
            return;
        }

        const isSaved = savedTeacherIds.includes(teacherId);
        const newSavedIds = isSaved
            ? savedTeacherIds.filter(id => id !== teacherId)
            : [...savedTeacherIds, teacherId];

        setSavedTeacherIds(newSavedIds); // Optimistic update

        try {
            const docRef = doc(db, 'users', user.uid, 'saved_teachers', teacherId);
            if (isSaved) {
                await deleteDoc(docRef);
            } else {
                await setDoc(docRef, {
                    savedAt: new Date()
                });
            }
        } catch (error) {
            console.error('Error saving teacher:', error);
            // Revert on error
            setSavedTeacherIds(savedTeacherIds);
        }
    };

    return (
        <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 md:px-8'} space-y-8 pb-8 pt-0`}>
            {/* Header / Search Bar */}
            <div ref={heroRef}>
                <PageHero
                    title="Find your perfect mentor"
                    description="Search from over 2,000+ verified teachers and courses."
                >
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative flex-grow w-full bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-xl">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-200" size={20} />
                                <input
                                    type="text"
                                    placeholder={activeTab === 'teachers' ? "Search for teacher or subject..." : "Search for courses..."}
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        updateFilters({ q: e.target.value });
                                    }}
                                    className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none transition text-base text-white placeholder:text-cyan-200/70"
                                />
                            </div>

                            <span className="font-bold text-white/50">OR</span>

                            <div className="flex flex-col items-center gap-2 w-full md:w-auto flex-shrink-0">
                                {activeTab === 'batches' ? (
                                    <button
                                        onClick={() => setIsBatchModalOpen(true)}
                                        className="w-full md:w-auto px-6 py-4 bg-white text-cyan-700 font-bold rounded-2xl hover:bg-cyan-50 transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        <Plus size={20} />
                                        Create Own Batch
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate('/student/requests?action=new')}
                                        className="w-full md:w-auto px-6 py-4 bg-white text-cyan-700 font-bold rounded-2xl hover:bg-cyan-50 transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        <Plus size={20} />
                                        Open Request
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </PageHero>
            </div>

            {/* Filters (visible when NOT sticky) - Moved outside Hero */}
            {
                !isSticky && activeTab === 'teachers' && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <FilterBar sticky={false} />
                    </div>
                )
            }

            {/* Sticky Filter Bar (visible when sticky) */}
            {
                isSticky && activeTab === 'teachers' && (
                    <FilterBar sticky={true} />
                )
            }

            {
                activeTab === 'batches' ? (
                    <div className="space-y-12">
                        {/* Running Batches */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Running Batches
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {batches
                                    .filter(b => {
                                        const isRunning = b.rawStartDate?.seconds * 1000 <= Date.now();
                                        return isRunning && (b.title || b.name)?.toLowerCase().includes(searchQuery.toLowerCase());
                                    })
                                    .map(batch => (
                                        <BatchCard
                                            key={batch.id}
                                            batch={batch}
                                        />
                                    ))}
                                {batches.filter(b => b.rawStartDate?.seconds * 1000 <= Date.now()).length === 0 && (
                                    <div className="col-span-full text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        No running batches found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Batches */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <Calendar size={20} className="text-cyan-600" />
                                Upcoming Batches
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {batches
                                    .filter(b => {
                                        const isUpcoming = b.rawStartDate?.seconds * 1000 > Date.now();
                                        return isUpcoming && (b.title || b.name)?.toLowerCase().includes(searchQuery.toLowerCase());
                                    })
                                    .map(batch => (
                                        <BatchCard
                                            key={batch.id}
                                            batch={batch}
                                        />
                                    ))}
                                {batches.filter(b => b.rawStartDate?.seconds * 1000 > Date.now()).length === 0 && (
                                    <div className="col-span-full text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        No upcoming batches found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {/* Main Content: Teacher List */}
                        <div className="flex-grow">
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
                                            onPlayVideo={(url) => setPlayingVideoUrl(url)}
                                            isFocused={focusedCardId === teacher.id}
                                            onFocus={() => setFocusedCardId(teacher.id)}
                                            onSave={() => handleSaveTeacher(teacher.id)}
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
                )
            }



            {
                selectedTeacher && user && (
                    <BookingSelectionModal
                        teacher={selectedTeacher}
                        studentId={user.uid}
                        onClose={() => setSelectedTeacher(null)}
                    />
                )
            }

            {
                playingVideoUrl && (
                    <VideoOverlay
                        videoUrl={playingVideoUrl}
                        onClose={() => setPlayingVideoUrl(null)}
                    />
                )
            }
            {/* Batch Request Modal */}
            <CreateBatchRequestModal
                isOpen={isBatchModalOpen}
                onClose={() => setIsBatchModalOpen(false)}
            />
        </div >
    );
}
