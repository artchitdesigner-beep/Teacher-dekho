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

            if (querySnapshot.empty) {
                setStatus('User Harsh@harsh.com not found!');
                setLoading(false);
                return;
            }

            const teacherDoc = querySnapshot.docs[0];
            const teacherId = teacherDoc.id;
            const teacherName = teacherDoc.data().name || 'Harsh';

            setStatus(`Found user: ${teacherName} (${teacherId}). Seeding data...`);

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
                await addDoc(bookingsRef, {
                    teacherId: teacherId,
                    teacherName: teacherName,
                    studentId: 'demo_student_' + Math.random().toString(36).substr(2, 9),
                    studentName: student.name,
                    studentEmail: student.email,
                    topic: student.topic,
                    status: 'confirmed',
                    scheduledAt: Timestamp.fromDate(new Date(Date.now() + Math.random() * 1000000000)), // Future date
                    createdAt: Timestamp.now(),
                    amount: 500
                });
            }

            // 3. Seed Batches
            const batchesRef = collection(db, 'batches');
            const demoBatches = [
                { name: 'Class 12 Physics Crash Course', subject: 'Physics', students: 12 },
                { name: 'JEE Mains Math Prep', subject: 'Mathematics', students: 8 },
                { name: 'NEET Chemistry Foundation', subject: 'Chemistry', students: 15 },
            ];

            for (const batch of demoBatches) {
                await addDoc(batchesRef, {
                    teacherId: teacherId,
                    name: batch.name,
                    subject: batch.subject,
                    description: 'Intensive course for upcoming exams.',
                    startDate: Timestamp.fromDate(new Date()),
                    status: 'active',
                    enrolledCount: batch.students,
                    maxStudents: 20,
                    price: 4999,
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
