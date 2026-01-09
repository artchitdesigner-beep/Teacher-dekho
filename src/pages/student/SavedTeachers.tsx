import { useState, useEffect } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import TeacherCard from '@/components/booking/TeacherCard';

export default function SavedTeachers() {
    const { } = useAuth();
    const [savedTeachers, setSavedTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch from a 'saved_teachers' collection
        // For now, we'll just fetch some teachers as a mock
        const fetchSavedTeachers = async () => {
            try {
                const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
                const querySnapshot = await getDocs(q);
                const teacherData = querySnapshot.docs.slice(0, 2).map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSavedTeachers(teacherData);
            } catch (error) {
                console.error('Error fetching saved teachers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedTeachers();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-2">Saved Teachers</h1>
                    <p className="text-slate-500 dark:text-slate-400">Teachers you've bookmarked for later.</p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800" />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {savedTeachers.map(teacher => (
                        <TeacherCard
                            key={teacher.id}
                            teacher={teacher}
                            onBook={() => { }}
                        />
                    ))}

                    {savedTeachers.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 border-dashed">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">No saved teachers yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">Start exploring and bookmark teachers you like!</p>
                            <button className="px-6 py-2 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2 mx-auto">
                                Find Teachers <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
