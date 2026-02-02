import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Loader2, Heart, Users } from 'lucide-react';
import TeacherCard from '@/components/booking/TeacherCard';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
                        const teacherPromises = savedIds.map(id => getDoc(doc(db, 'users', id)));
                        const teacherDocs = await Promise.all(teacherPromises);
                        fetchedTeachers = teacherDocs
                            .filter(d => d.exists())
                            .map(d => ({ id: d.id, ...d.data() }));
                    }
                } else {
                    // Fetch "My Mentors" (Accepted Requests)
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
        <div className="w-full space-y-8 p-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Teachers</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your mentors and saved profiles.</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="mentors" value={activeTab} onValueChange={(val) => setActiveTab(val as 'mentors' | 'saved')} className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="mentors" className="flex items-center gap-2">
                        <Users size={16} />
                        My Mentors
                    </TabsTrigger>
                    <TabsTrigger value="saved" className="flex items-center gap-2">
                        <Heart size={16} />
                        Saved Profiles
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="mentors" className="mt-0">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-cyan-700" size={32} />
                        </div>
                    ) : teachers.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <Users className="text-slate-400" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                                    No mentors yet
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                                    You haven't connected with any teachers yet. Post a request or book a class to get started.
                                </p>
                                <Button onClick={() => navigate('/student/search')} className="bg-cyan-700 hover:bg-cyan-800 text-white">
                                    Find Teachers
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teachers.map(teacher => (
                                <TeacherCard
                                    key={teacher.id}
                                    teacher={teacher}
                                    onBook={(id) => navigate(`/student/teacher/${id}`)}
                                    isSaved={savedTeacherIds.includes(teacher.id)}
                                    onSave={() => handleUnsave(teacher.id)}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="saved" className="mt-0">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-cyan-700" size={32} />
                        </div>
                    ) : teachers.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <Heart className="text-slate-400" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                                    No saved profiles
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                                    You haven't saved any teachers yet. Browse profiles and click the heart icon to save them.
                                </p>
                                <Button onClick={() => navigate('/student/search')} className="bg-cyan-700 hover:bg-cyan-800 text-white">
                                    Find Teachers
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teachers.map(teacher => (
                                <TeacherCard
                                    key={teacher.id}
                                    teacher={teacher}
                                    onBook={(id) => navigate(`/student/teacher/${id}`)}
                                    isSaved={savedTeacherIds.includes(teacher.id)}
                                    onSave={() => handleUnsave(teacher.id)}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
