import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import BookingModal from '@/components/booking/BookingModal';
import TeacherCard from '@/components/booking/TeacherCard';

export default function SearchTeachers() {
    const { user } = useAuth();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

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

    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.subject?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || teacher.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    const subjects = ['All', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'English', 'Computer Science'];

    return (
        <div className="space-y-8">
            {/* Header / Search Bar */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="max-w-3xl">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">Find your perfect mentor</h1>
                    <p className="text-sm md:text-base text-slate-500 mb-6">Search from over 2,000+ verified teachers.</p>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by subject or teacher name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-base md:text-lg"
                        />
                    </div>
                </div>
            </div>

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

                    <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block bg-white p-6 rounded-2xl border border-slate-100 sticky top-4 animate-in fade-in slide-in-from-top-2 lg:animate-none`}>
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

                        {/* Other Filters (Mock) */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">Preferences</h4>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm text-slate-600">Verified Only</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm text-slate-600">Available Today</span>
                                </label>
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
                                    onBook={() => setSelectedTeacher(teacher)}
                                />
                            ))}

                            {filteredTeachers.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">No teachers found</h3>
                                    <p className="text-slate-500 mb-4">Try adjusting your filters or search query.</p>
                                    <button
                                        onClick={async () => {
                                            setLoading(true);
                                            const { seedTeachers } = await import('@/lib/seed');
                                            await seedTeachers();
                                            await fetchTeachers();
                                        }}
                                        className="px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                                    >
                                        Populate Demo Teachers
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

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
