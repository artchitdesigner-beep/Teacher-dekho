import { db } from './firebase';
import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';

export const DUMMY_TEACHERS = [
    {
        name: "Dr. Aditi Sharma",
        email: "aditi.sharma@example.com",
        role: "teacher",
        subject: "Physics",
        experience: "8 years",
        hourlyRate: 800,
        rating: 4.9,
        reviewCount: 124,
        bio: "PhD in Physics from IIT Bombay. I specialize in making complex concepts easy to understand. Expert in Mechanics and Thermodynamics.",
        college: "IIT Bombay",
        kycStatus: "verified",
        avatarColor: "bg-blue-100"
    },
    {
        name: "Prof. Rajesh Verma",
        email: "rajesh.verma@example.com",
        role: "teacher",
        subject: "Mathematics",
        experience: "12 years",
        hourlyRate: 1200,
        rating: 5.0,
        reviewCount: 215,
        bio: "Former Olympiad trainer. I help students fall in love with numbers. Calculus and Algebra are my forte.",
        college: "ISI Kolkata",
        kycStatus: "verified",
        avatarColor: "bg-green-100"
    },
    {
        name: "Anita Roy",
        email: "anita.roy@example.com",
        role: "teacher",
        subject: "Chemistry",
        experience: "5 years",
        hourlyRate: 600,
        rating: 4.7,
        reviewCount: 89,
        bio: "Passionate about Organic Chemistry. I use visual aids to explain reaction mechanisms.",
        college: "Delhi University",
        kycStatus: "verified",
        avatarColor: "bg-purple-100"
    },
    {
        name: "Vikram Singh",
        email: "vikram.singh@example.com",
        role: "teacher",
        subject: "English",
        experience: "15 years",
        hourlyRate: 1500,
        rating: 4.8,
        reviewCount: 312,
        bio: "Literature enthusiast and certified IELTS trainer. Improve your communication skills with personalized lessons.",
        college: "JNU",
        kycStatus: "verified",
        avatarColor: "bg-orange-100"
    },
    {
        name: "Dr. Priya Patel",
        email: "priya.patel@example.com",
        role: "teacher",
        subject: "Biology",
        experience: "6 years",
        hourlyRate: 700,
        rating: 4.9,
        reviewCount: 156,
        bio: "Medical student turned educator. I make Biology interesting with real-life examples.",
        college: "AIIMS Delhi",
        kycStatus: "verified",
        avatarColor: "bg-pink-100"
    },
    {
        name: "Arjun Mehta",
        email: "arjun.mehta@example.com",
        role: "teacher",
        subject: "Computer Science",
        experience: "4 years",
        hourlyRate: 900,
        rating: 4.6,
        reviewCount: 45,
        bio: "Software Engineer at a top tech firm. Learn coding from someone who does it every day.",
        college: "IIIT Hyderabad",
        kycStatus: "verified",
        avatarColor: "bg-indigo-100"
    }
];

export async function seedTeachers() {
    try {
        const promises = DUMMY_TEACHERS.map(teacher => {
            // Create a new doc reference with auto-generated ID
            const newDocRef = doc(collection(db, "users"));
            return setDoc(newDocRef, {
                ...teacher,
                createdAt: Timestamp.now()
            });
        });
        await Promise.all(promises);
        console.log("Teachers seeded successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding teachers:", error);
        return false;
    }
}

export async function seedBookings(studentId: string, studentName: string) {
    try {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(14, 0, 0, 0);

        const dayAfter = new Date(now);
        dayAfter.setDate(dayAfter.getDate() + 2);
        dayAfter.setHours(10, 0, 0, 0);

        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(10, 0, 0, 0);

        const pastDate = new Date(now);
        pastDate.setDate(pastDate.getDate() - 2);
        pastDate.setHours(16, 0, 0, 0);

        const bookings = [
            {
                studentId,
                studentName,
                teacherId: "dummy_teacher_1",
                topic: "Calculus Limits",
                scheduledAt: Timestamp.fromDate(tomorrow),
                status: "confirmed",
                isDemo: true,
                paymentStatus: "Trial Class - Pay After",
                teacherRemarks: "Please bring your textbook and a notebook.",
                members: [
                    { name: studentName, phone: "9876543210" },
                    { name: "Rahul Singh", phone: "9988776655" }
                ],
                createdAt: Timestamp.now()
            },
            {
                studentId,
                studentName,
                teacherId: "dummy_teacher_2",
                topic: "Organic Chemistry Basics",
                scheduledAt: Timestamp.fromDate(dayAfter),
                status: "pending",
                isDemo: true,
                paymentStatus: "Trial Class - Pay After",
                teacherRemarks: "",
                members: [
                    { name: studentName, phone: "9876543210" }
                ],
                createdAt: Timestamp.now()
            },
            {
                studentId,
                studentName,
                teacherId: "dummy_teacher_3",
                topic: "Physics Kinematics",
                scheduledAt: Timestamp.fromDate(nextWeek),
                status: "confirmed",
                isDemo: false,
                paymentStatus: "Regular Class",
                teacherRemarks: "Great progress in the last session! Let's dive deeper into motion equations.",
                members: [
                    { name: studentName, phone: "9876543210" }
                ],
                createdAt: Timestamp.now()
            }
        ];

        const promises = bookings.map(booking => addDoc(collection(db, "bookings"), booking));
        await Promise.all(promises);
        console.log("Rich bookings seeded successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding bookings:", error);
        return false;
    }
}
