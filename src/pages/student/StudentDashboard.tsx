import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface Booking {
    id: string;
    teacherId: string;
    topic: string;
    scheduledAt: Timestamp;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    isDemo: boolean;
    members?: { name: string; phone: string }[];
    teacherRemarks?: string;
    paymentStatus?: string;
    createdAt: Timestamp;
}

import BatchCard from '@/components/batches/BatchCard';
import ReferralModal from '@/components/common/ReferralModal';

import BookingModal from '@/components/booking/BookingModal';
import LearningIntentHero from '@/components/dashboard/LearningIntentHero';
import UpcomingClassCard from '@/components/dashboard/UpcomingClassCard';
import CounsellingPromoCard from '@/components/dashboard/CounsellingPromoCard';
import DashboardNotifications from '@/components/dashboard/DashboardNotifications';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [upcomingClasses, setUpcomingClasses] = useState<Booking[]>([]);
    const [batches, setBatches] = useState<any[]>([]);


    const [loading, setLoading] = useState(true);
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);


    useEffect(() => {
        async function fetchDashboardData() {
            if (!user) return;

            try {
                const now = Timestamp.now();

                // 1. Fetch Bookings
                const bookingsRef = collection(db, 'bookings');
                const upcomingQuery = query(bookingsRef, where('studentId', '==', user.uid));
                const upcomingSnap = await getDocs(upcomingQuery);
                const allBookings = upcomingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

                const filteredBookings = allBookings
                    .filter(b => (b.status === 'confirmed' || b.status === 'pending') && b.scheduledAt.toMillis() > now.toMillis())
                    .sort((a, b) => a.scheduledAt.toMillis() - b.scheduledAt.toMillis())
                    .slice(0, 5);
                setUpcomingClasses(filteredBookings);

                // 2. Fetch Batches
                const batchesSnap = await getDocs(collection(db, 'batches'));
                setBatches(batchesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));





            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-64 bg-slate-200 rounded-3xl w-full"></div>
            <div className="h-32 bg-slate-200 rounded-xl w-full"></div>
        </div>;
    }

    return (
        <div className="space-y-8 pb-10">
            {/* 1. Learning Intent Hero */}
            <LearningIntentHero />

            {/* 2. Middle Section: Schedule, Counselling & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Your Schedule */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                Your Schedule
                                {upcomingClasses.length > 0 && (
                                    <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {upcomingClasses.length}
                                    </span>
                                )}
                            </h2>
                            <Link
                                to="/student/courses"
                                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                            >
                                My Courses
                            </Link>
                        </div>

                        {upcomingClasses.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                                <p className="text-slate-500 dark:text-slate-400 mb-4">No upcoming classes scheduled.</p>
                                <button
                                    onClick={async () => {
                                        if (!user) return;
                                        setLoading(true);
                                        const { seedBookings } = await import('@/lib/seed');
                                        await seedBookings(user.uid, user.displayName || 'Student');
                                        window.location.reload();
                                    }}
                                    className="text-sm text-cyan-700 font-bold hover:underline"
                                >
                                    Seed Demo Data
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                                {upcomingClasses.map(booking => (
                                    <div key={booking.id} className="snap-start">
                                        <UpcomingClassCard booking={booking} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Career Guidance (Moved here) */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Career Guidance</h2>
                        </div>
                        <CounsellingPromoCard />
                    </div>
                </div>

                {/* Right Column (1/3) */}
                <div className="space-y-6">
                    {/* Notifications (Moved here) */}
                    <div className="h-full">
                        <DashboardNotifications />
                    </div>
                </div>
            </div>



            {/* 5. Featured Batches */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Featured Batches</h2>
                    <Link to="/student/search?tab=batches" className="text-sm text-cyan-700 dark:text-cyan-400 font-medium hover:underline">View all</Link>
                </div>

                {batches.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
                        <p>No featured batches available at the moment.</p>
                    </div>
                ) : (
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                        {batches.map(batch => (
                            <div key={batch.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                                <BatchCard batch={batch} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Referral Modal */}
            <ReferralModal
                isOpen={showReferralModal}
                onClose={() => setShowReferralModal(false)}
                userRole="student"
                userName={user?.displayName || "Student"}
            />

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
