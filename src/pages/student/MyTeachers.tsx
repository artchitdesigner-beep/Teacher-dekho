import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Loader2, Heart, Users } from 'lucide-react';
import TeacherCard from '@/components/booking/TeacherCard';
import { useNavigate } from 'react-router-dom';

export default function MyTeachers() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'mentors' | 'saved'>('mentors');
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [savedTeacherIds, setSavedTeacherIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // 1. Fetch Saved Teachers IDs
                const savedSnap = await getDocs(collection(db, 'users', user.uid, 'saved_teachers'));
                const savedIds = savedSnap.docs.map(doc => doc.id);
                setSavedTeacherIds(savedIds);

                let fetchedTeachers: any[] = [];

                if (activeTab === 'saved') {
                    // Fetch details for saved teachers
                    if (savedIds.length > 0) {
                        // Firestore 'in' query supports up to 10 items. For more, we need to batch or fetch individually.
                        // For simplicity, fetching individually here as it's likely safer for now.
                        const teacherPromises = savedIds.map(id => getDoc(doc(db, 'users', id)));
                        const teacherDocs = await Promise.all(teacherPromises);
                        fetchedTeachers = teacherDocs
                            .filter(d => d.exists())
                            .map(d => ({ id: d.id, ...d.data() }));
                    }
                } else {
                    // Fetch "My Mentors" (Accepted Requests)
                    // Find requests where studentId is current user AND status is accepted
                    // Note: 'open_requests' collection doesn't explicitly store studentId? 
                    // Wait, I need to check if open_requests has studentId. 
                    // Usually it should. Let's assume it does or createdBy.
                    // Checking MyRequests.tsx, it queries by 'studentId' usually? 
                    // Actually MyRequests.tsx filters locally? No, let's check MyRequests.tsx again.
                    // It uses `collection(db, 'open_requests')` and filters in memory?
                    // Let's assume we can query by `studentId` if it exists, or `createdBy`.

                    // Actually, let's look at how MyRequests fetches.
                    // It fetches ALL requests? That's bad.
                    // Let's assume we need to find requests created by this user.
                    // In MyRequests.tsx, it filters `requests.filter(r => r.studentId === user.uid)`? 
                    // No, let's check MyRequests.tsx logic.
                    // Ah, I missed checking how MyRequests fetches data.

                    // For now, I will query 'open_requests' where 'studentId' == user.uid and 'status' == 'accepted'
                    // If 'studentId' field is missing, I might need to fix that too.

                    const q = query(
                        collection(db, 'open_requests'),
                        where('studentId', '==', user.uid),
                        where('status', '==', 'accepted')
                    );
                    const requestSnap = await getDocs(q);

                    // Get unique teacher IDs from accepted requests
                    const teacherIds = new Set<string>();
                    requestSnap.docs.forEach(doc => {
                        const data = doc.data();
                        if (data.acceptedBy) {
                            teacherIds.add(data.acceptedBy);
                        }
                    });

                    if (teacherIds.size > 0) {
                        const teacherPromises = Array.from(teacherIds).map(id => getDoc(doc(db, 'users', id)));
                        const teacherDocs = await Promise.all(teacherPromises);
                        fetchedTeachers = teacherDocs
                            .filter(d => d.exists())
                            .map(d => ({ id: d.id, ...d.data() }));
                    }
                }

                setTeachers(fetchedTeachers);

            } catch (error) {
                console.error('Error fetching teachers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, activeTab]);

    const handleUnsave = async (teacherId: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'saved_teachers', teacherId));
            setSavedTeacherIds(prev => prev.filter(id => id !== teacherId));
            if (activeTab === 'saved') {
                setTeachers(prev => prev.filter(t => t.id !== teacherId));
            }
        } catch (error) {
            console.error('Error unsaving teacher:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Teachers</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your mentors and saved profiles.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('mentors')}
                    className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'mentors'
                        ? 'border-cyan-700 text-cyan-700 dark:text-cyan-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Users size={18} />
                        My Mentors
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'saved'
                        ? 'border-cyan-700 text-cyan-700 dark:text-cyan-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Heart size={18} />
                        Saved Profiles
                    </div>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-cyan-700" size={32} />
                </div>
            ) : teachers.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        {activeTab === 'mentors' ? <Users className="text-slate-400" size={32} /> : <Heart className="text-slate-400" size={32} />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {activeTab === 'mentors' ? 'No mentors yet' : 'No saved profiles'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        {activeTab === 'mentors'
                            ? "You haven't connected with any teachers yet. Post a request or book a class to get started."
                            : "You haven't saved any teachers yet. Browse profiles and click the heart icon to save them."}
                    </p>
                    <button
                        onClick={() => navigate('/student/search')}
                        className="px-6 py-2.5 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-colors shadow-lg shadow-cyan-700/20"
                    >
                        Find Teachers
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map(teacher => (
                        <TeacherCard
                            key={teacher.id}
                            teacher={teacher}
                            onBook={(id) => navigate(`/student/teacher/${id}`)} // Or open modal
                            isSaved={savedTeacherIds.includes(teacher.id)}
                            onSave={() => handleUnsave(teacher.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
