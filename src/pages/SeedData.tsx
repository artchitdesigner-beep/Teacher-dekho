import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Database } from 'lucide-react';

export default function SeedData() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const seedHarshData = async () => {
        setLoading(true);
        setStatus('Finding user Harsh@harsh.com...');

        try {
            // 1. Find User
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', 'Harsh@harsh.com'));
            const querySnapshot = await getDocs(q);

            let teacherId: string;
            let teacherName: string;

            if (querySnapshot.empty) {
                setStatus('User Harsh@harsh.com not found. Creating mock teacher...');

                // Create Mock Teacher
                const newTeacherRef = await addDoc(collection(db, 'users'), {
                    name: "Harsh Tutor",
                    email: "Harsh@harsh.com",
                    role: "teacher",
                    bio: "Experienced Physics and Math tutor with 5+ years of experience.",
                    subjects: ["Physics", "Mathematics"],
                    rating: 4.8,
                    experience: "5 years",
                    hourlyRate: 500,
                    createdAt: Timestamp.now(),
                    photoURL: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=150&h=150"
                });

                teacherId = newTeacherRef.id;
                teacherName = "Harsh Tutor";
                setStatus(`Created mock teacher: ${teacherName}. Seeding data...`);
            } else {
                const teacherDoc = querySnapshot.docs[0];
                teacherId = teacherDoc.id;
                teacherName = teacherDoc.data().name || 'Harsh';
                setStatus(`Found user: ${teacherName} (${teacherId}). Seeding data...`);
            }

            // 2. Seed Students (Bookings)
            const bookingsRef = collection(db, 'bookings');

            const demoStudents = [
                { name: 'Aarav Sharma', email: 'aarav@example.com', topic: 'Physics - Mechanics' },
                { name: 'Vivaan Gupta', email: 'vivaan@example.com', topic: 'Math - Calculus' },
                { name: 'Diya Patel', email: 'diya@example.com', topic: 'Chemistry - Organic' },
                { name: 'Ananya Singh', email: 'ananya@example.com', topic: 'Physics - Optics' },
                { name: 'Vihaan Kumar', email: 'vihaan@example.com', topic: 'Math - Algebra' },
            ];

            for (const student of demoStudents) {
                const totalSessions = 10;
                const sessions = [];

                // Add some completed sessions
                for (let i = 0; i < 3; i++) {
                    sessions.push({
                        id: 'sess_' + Math.random().toString(36).substr(2, 9),
                        scheduledAt: Timestamp.fromDate(new Date(Date.now() - (i + 1) * 86400000)), // Past
                        status: 'completed',
                        isDemo: false
                    });
                }

                // Add some confirmed/upcoming sessions
                for (let i = 0; i < 2; i++) {
                    sessions.push({
                        id: 'sess_up_' + Math.random().toString(36).substr(2, 9),
                        scheduledAt: Timestamp.fromDate(new Date(Date.now() + (i + 1) * 86400000)), // Future
                        status: 'confirmed',
                        isDemo: false
                    });
                }

                await addDoc(bookingsRef, {
                    teacherId: teacherId,
                    teacherName: teacherName,
                    studentId: 'demo_student_' + Math.random().toString(36).substr(2, 9),
                    studentName: student.name,
                    studentEmail: student.email,
                    topic: student.topic,
                    status: 'active',
                    totalSessions: totalSessions,
                    sessions: sessions,
                    scheduledAt: sessions[3].scheduledAt, // Use the first upcoming session as the main schedule
                    createdAt: Timestamp.now(),
                    amount: 500
                });
            }

            // 3. Seed Batches
            const batchesRef = collection(db, 'batches');
            const demoBatches = [
                { name: 'Class 12 Physics Crash Course', subject: 'Physics', students: 12, class: '12', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=400&h=300' },
                { name: 'JEE Mains Math Prep', subject: 'Mathematics', students: 8, class: '12+', image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=400&h=300' },
                { name: 'NEET Chemistry Foundation', subject: 'Chemistry', students: 15, class: '11', image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=400&h=300' },
            ];

            for (const [index, batch] of demoBatches.entries()) {
                await addDoc(batchesRef, {
                    teacherId: teacherId,
                    teacherName: teacherName, // Denormalized for easy display
                    name: batch.name,
                    title: batch.name, // Handle both name/title
                    subject: batch.subject,
                    class: batch.class || '12',
                    description: 'Intensive course for upcoming exams.',
                    startDate: index === 0 ? Timestamp.fromDate(new Date(Date.now() - 86400000)) : Timestamp.fromDate(new Date(Date.now() + 86400000)), // First is active, others upcoming
                    status: 'active',
                    enrolledCount: batch.students,
                    studentCount: batch.students,
                    maxStudents: 20,
                    price: 4999,
                    rating: 4.8,
                    image: batch.image || 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=400&h=300',
                    createdAt: Timestamp.now()
                });
            }

            setStatus('Seeding complete! Added 5 students and 3 batches.');

        } catch (error) {
            console.error('Seeding error:', error);
            setStatus('Error seeding data: ' + (error as any).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg border border-slate-200 mt-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Database className="text-cyan-700" />
                Seed Demo Data
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
                This will add demo students and batches for <strong>Harsh@harsh.com</strong>.
            </p>

            {status && (
                <div className={`p-3 rounded-lg text-sm font-medium mb-4 ${status.includes('Error') || status.includes('not found')
                    ? 'bg-red-50 text-red-600'
                    : 'bg-emerald-50 text-emerald-600'
                    }`}>
                    {status}
                </div>
            )}

            <button
                onClick={seedHarshData}
                disabled={loading}
                className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Seed Data for Harsh'}
            </button>
        </div>
    );
}
