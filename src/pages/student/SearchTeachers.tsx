import { useState, useEffect, useRef } from 'react';
import { Search, Plus, BookOpen, GraduationCap, Languages, Star, IndianRupee, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, getDocs, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import BookingSelectionModal from '@/components/booking/BookingSelectionModal';
import TeacherCard from '@/components/booking/TeacherCard';
// import BatchCard from '@/components/batches/BatchCard';
import BatchCardSmall from '@/components/batches/BatchCardSmall';
import PostRequestPromoCard from '@/components/search/PostRequestPromoCard';
import PageHero from '@/components/common/PageHero';
import { FilterDropdown } from '@/components/search/FilterDropdown';
import VideoOverlay from '@/components/common/VideoOverlay';
import CreateBatchRequestModal from '@/components/batches/CreateBatchRequestModal';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
                // Stick when hero pass the navbar boundary (80px)
                setIsSticky(heroBottom <= 80);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check in case we're already scrolled
        handleScroll();
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
            setLoading(true);
            try {
                // Publicly accessible query
                const teachersQuery = query(
                    collection(db, 'users'),
                    where('role', '==', 'teacher')
                    // Removed extra where filters that might trigger indexes or permissions
                );
                const teachersSnap = await getDocs(teachersQuery);
                const fetchedTeachers = teachersSnap.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        uid: doc.id, // Ensure uid matches doc id for booking
                        ...data,
                        rating: data.rating || (Math.random() * 2 + 3).toFixed(1), // Fallback rating
                        hourlyRate: data.hourlyRate || 500
                    };
                });
                setTeachers(fetchedTeachers);

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

                // --- MOCK DATA FOR DEMO ---
                // If we don't have enough upcoming batches, inject some for the UI demo as requested.
                // Create a future date
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 15); // 15 days from now
                const futureTimestamp = { seconds: Math.floor(futureDate.getTime() / 1000) };

                const mockUpcoming = [
                    {
                        id: 'mock-1',
                        title: 'Advanced Physics Crash Course',
                        teacherName: 'Dr. H.C. Verma',
                        subject: 'Physics',
                        class: '12th',
                        startDate: futureDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                        rawStartDate: futureTimestamp,
                        price: 4999,
                        studentCount: 12,
                        maxStudents: 30,
                        rating: 4.9,
                        image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=1000&auto=format&fit=crop'
                    },
                    {
                        id: 'mock-2',
                        title: 'Organic Chemistry Masterclass',
                        teacherName: 'Priya Mam',
                        subject: 'Chemistry',
                        class: '11th',
                        startDate: futureDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                        rawStartDate: futureTimestamp,
                        price: 2499,
                        studentCount: 45,
                        maxStudents: 50,
                        rating: 4.8,
                        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=1000&auto=format&fit=crop'
                    },
                    {
                        id: 'mock-3',
                        title: 'Calculus Zero to Hero',
                        teacherName: 'Math Wizard',
                        subject: 'Mathematics',
                        class: '12th',
                        startDate: futureDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                        rawStartDate: futureTimestamp,
                        price: 3999,
                        studentCount: 5,
                        maxStudents: 20,
                        rating: 5.0,
                        image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1000&auto=format&fit=crop'
                    },
                    {
                        id: 'mock-4',
                        title: 'English Literature Review',
                        teacherName: 'Sarah Jones',
                        subject: 'English',
                        class: '10th',
                        startDate: futureDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                        rawStartDate: futureTimestamp,
                        price: 999,
                        studentCount: 8,
                        maxStudents: 15,
                        rating: 4.7,
                        image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1000&auto=format&fit=crop'
                    }
                ];

                const combinedBatches = [...batchesData, ...mockUpcoming];
                setBatches(combinedBatches);
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
        if (s !== null) setSelectedSubject(s || 'All');
        if (c !== null) setSelectedClass(c || '');
        if (l !== null) setSelectedLanguage(l || '');
        if (r !== null) setMinRating(Number(r) || 0);
        if (p !== null) setPriceRange(p || 'all');
        if (a !== null) setAvailability(a || 'any');
    }, [searchParams]);

    const updateFilters = (updates: any) => {
        const newParams = new URLSearchParams(searchParams);
        const allUpdates = {
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

        Object.entries(allUpdates).forEach(([key, val]) => {
            if (!val || val === '0' || val === 'All' || val === 'all' || val === 'any' || val === '') {
                newParams.delete(key);
            } else {
                newParams.set(key, String(val));
            }
        });

        setSearchParams(newParams);
    };

    const filteredTeachers = teachers.filter(teacher => {
        const teacherName = (teacher.name || teacher.displayName || '').toLowerCase();
        const queryTerm = searchQuery.toLowerCase();
        const matchesSearch = !queryTerm ||
            teacherName.includes(queryTerm) ||
            teacher.subjects?.some((s: string) => s.toLowerCase().includes(queryTerm));

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

        const matchesRating = Number(teacher.rating || 0) >= minRating;

        return matchesSearch && matchesSubject && matchesClass && matchesLanguage && matchesRating;
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

    const getDisplayLabel = (options: any[], value: string | number) => {
        const option = options.find(o => o.value === String(value));
        return option ? option.label : String(value);
    };

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
            setSavedTeacherIds(savedTeacherIds); // Revert
        }
    };

    return (
        <div className={cn(
            isDashboard ? "" : "max-w-7xl mx-auto px-4 md:px-8",
            "space-y-8 pb-8 pt-0"
        )}>
            {/* Hero Section */}
            <div ref={heroRef} className="relative z-0">
                <PageHero
                    title={activeTab === 'batches' ? "Find your perfect batch" : "Find your perfect mentor"}
                    description={activeTab === 'batches' ? "Join structured courses from top educators." : "Search from over 2,000+ verified teachers and courses."}
                >
                    <div className="flex flex-col gap-6">
                        <div className={`flex flex-col md:flex-row items-center gap-4 ${activeTab === 'batches' ? 'justify-center' : ''}`}>
                            {activeTab === 'teachers' && (
                                <>
                                    <div className="relative flex-grow w-full bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-xl transition-all duration-300">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-200" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search for teacher or subject..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                updateFilters({ q: e.target.value });
                                            }}
                                            className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none transition text-base text-white placeholder:text-cyan-200/70"
                                        />
                                    </div>
                                    <span className="font-bold text-white/50">OR</span>
                                </>
                            )}

                            <div className="flex flex-col items-center gap-2 w-full md:w-auto flex-shrink-0">
                                {activeTab === 'batches' ? (
                                    <Button
                                        onClick={() => setIsBatchModalOpen(true)}
                                        className="h-auto w-full md:w-auto px-8 py-5 bg-white text-cyan-700 font-bold rounded-2xl hover:bg-cyan-50 transition-colors shadow-lg flex items-center justify-center gap-2 text-lg"
                                    >
                                        <Plus size={24} />
                                        Create Own Batch
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => navigate('/student/requests?action=new')}
                                        className="h-auto w-full md:w-auto px-6 py-4 bg-white text-cyan-700 font-bold rounded-2xl hover:bg-cyan-50 transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        <Plus size={20} />
                                        Open Request
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </PageHero>
            </div>

            {/* Unified Sticky Filter Bar */}
            <div className={cn(
                "sticky z-40 transition-all duration-300 top-[80px]",
                isSticky
                    ? "bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm py-2 border-b border-slate-100 dark:border-slate-800"
                    : "bg-transparent py-4"
            )}>
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        {/* Sticky Small Search Bar */}
                        {isSticky && (
                            <div className="relative flex-shrink-0 w-full md:w-64 animate-in slide-in-from-left-4 duration-300">
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

                        <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 w-full">
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
                                    className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all whitespace-nowrap lg:ml-auto"
                                >
                                    <X size={14} /> Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {
                activeTab === 'batches' ? (
                    <div className="space-y-12">
                        {/* Upcoming Batches - Horizontal Scroll */}
                        <div className="space-y-4 group/scroll relative">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Calendar size={20} className="text-cyan-600" />
                                    Upcoming Batches
                                </h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                                        onClick={() => {
                                            const container = document.getElementById('upcoming-scroll');
                                            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                                        }}
                                    >
                                        <ChevronLeft size={16} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                                        onClick={() => {
                                            const container = document.getElementById('upcoming-scroll');
                                            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                                        }}
                                    >
                                        <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>

                            <div
                                id="upcoming-scroll"
                                className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-1 scrollbar-hide scroll-smooth"
                            >
                                {batches
                                    .filter(b => {
                                        // Check if start date is in the future
                                        const isFuture = b.rawStartDate?.seconds ? (b.rawStartDate.seconds * 1000 > Date.now()) : false;
                                        // Also filter by search/filters if applied (except date status)
                                        // Note: Search query is hidden but filters might still apply if we want.
                                        // User asked to remove search bar, but filters dropdowns are still there.
                                        // We should respect the Filters.

                                        // Matches Subject
                                        const matchesSubject = selectedSubject === 'All' || (b.subject && b.subject.toLowerCase() === selectedSubject.toLowerCase());

                                        // Matches Class
                                        const matchesClass = !selectedClass || (b.class && String(b.class).toLowerCase() === selectedClass.toLowerCase());

                                        return isFuture && matchesSubject && matchesClass;
                                    })
                                    .map(batch => (
                                        <div key={batch.id} className="min-w-[280px] w-[280px] flex-shrink-0">
                                            <BatchCardSmall batch={batch} />
                                        </div>
                                    ))}

                                {batches.filter(b => b.rawStartDate?.seconds ? (b.rawStartDate.seconds * 1000 > Date.now()) : false).length === 0 && (
                                    <div className="w-full text-center py-8 text-slate-400 text-sm italic bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200">
                                        No upcoming batches found matching your filters.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Running Batches - Grid */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                Running Batches
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {batches
                                    .filter(b => {
                                        // Check if start date is past or today
                                        const isRunning = b.rawStartDate?.seconds ? (b.rawStartDate.seconds * 1000 <= Date.now()) : true; // Default to true if no date (assume running)

                                        // Matches Subject
                                        const matchesSubject = selectedSubject === 'All' || (b.subject && b.subject.toLowerCase() === selectedSubject.toLowerCase());

                                        // Matches Class
                                        const matchesClass = !selectedClass || (b.class && String(b.class).toLowerCase() === selectedClass.toLowerCase());

                                        return isRunning && matchesSubject && matchesClass;
                                    })
                                    .map(batch => (
                                        <BatchCardSmall key={batch.id} batch={batch} />
                                    ))}
                                {batches.filter(b => {
                                    const isRunning = b.rawStartDate?.seconds ? (b.rawStartDate.seconds * 1000 <= Date.now()) : true;
                                    return isRunning;
                                }).length === 0 && !loading && (
                                        <div className="col-span-full text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200">
                                            No running batches found.
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        <div className="flex-grow">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-slate-900 dark:text-slate-100 italic">
                                    {loading ? "Finding teachers..." : `${filteredTeachers.length} ${selectedSubject !== 'All' ? selectedSubject : ''} teachers found`}
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
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
                                            onBook={() => {
                                                if (!user) {
                                                    navigate('/login', { state: { from: `/teacher/${teacher.id}` } });
                                                } else {
                                                    setSelectedTeacher(teacher);
                                                }
                                            }}
                                            onPlayVideo={(url) => setPlayingVideoUrl(url)}
                                            isFocused={focusedCardId === teacher.id}
                                            onFocus={() => setFocusedCardId(teacher.id)}
                                            onSave={() => handleSaveTeacher(teacher.id)}
                                            isSaved={savedTeacherIds.includes(teacher.id)}
                                        />
                                    ))}

                                    {filteredTeachers.length > 0 && <PostRequestPromoCard />}

                                    {filteredTeachers.length === 0 && (
                                        <div className="py-10 text-center">
                                            <div className="text-slate-400 mb-4">
                                                {teachers.length === 0 && !user
                                                    ? "Sign in to see available tutors."
                                                    : "No teachers match your current filters."
                                                }
                                            </div>
                                            <PostRequestPromoCard />
                                            {!user && (
                                                <Button
                                                    onClick={() => navigate('/login')}
                                                    variant="outline"
                                                    className="mt-6 font-bold rounded-xl"
                                                >
                                                    Sign In to Explore
                                                </Button>
                                            )}
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

            <CreateBatchRequestModal
                isOpen={isBatchModalOpen}
                onClose={() => setIsBatchModalOpen(false)}
            />
        </div >
    );
}
