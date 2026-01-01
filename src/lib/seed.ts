import { db } from './firebase';
import { collection, addDoc, doc, setDoc, Timestamp, getDocs, deleteDoc } from 'firebase/firestore';

export const DUMMY_BATCHES = [
    {
        title: "Complete Physics Mastery - Class 12th",
        teacherName: "Dr. Priya Patel",
        subject: "Physics",
        class: "12th",
        startDate: "Jan 15, 2024",
        price: 4999,
        studentCount: 18,
        maxStudents: 25,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Master the entire Class 12th Physics syllabus with Dr. Priya Patel. This comprehensive course covers everything from Electrostatics to Modern Physics, designed specifically for Board Exams and Competitive Entrance Tests.",
        features: ["Live Interactive Classes", "Recorded Sessions", "Chapter-wise PDF Notes", "Weekly Doubt Clearing", "Mock Tests"],
        syllabus: [
            { title: "Electrostatics & Current Electricity", lessons: ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity"] },
            { title: "Magnetic Effects & Matter", lessons: ["Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction"] },
            { title: "Optics & Modern Physics", lessons: ["Ray Optics", "Wave Optics", "Dual Nature of Matter", "Atoms and Nuclei"] }
        ],
        schedule: [
            { day: "Monday", time: "6:00 PM - 7:30 PM" },
            { day: "Wednesday", time: "6:00 PM - 7:30 PM" },
            { day: "Friday", time: "6:00 PM - 7:30 PM" }
        ],
        teacherBio: "PhD in Physics with 10+ years of teaching experience. Helped over 5000+ students achieve their dream scores in Board exams.",
        teacherImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        title: "Mathematics Foundation - Class 11th",
        teacherName: "Prof. Rajesh Verma",
        subject: "Mathematics",
        class: "11th",
        startDate: "Jan 20, 2024",
        price: 3999,
        studentCount: 12,
        maxStudents: 30,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Build a rock-solid foundation in Mathematics. Prof. Rajesh Verma simplifies complex Calculus and Algebra concepts, making them intuitive and easy to apply.",
        features: ["Conceptual Clarity", "Problem Solving Workshops", "Daily Practice Papers", "Personalized Feedback"],
        syllabus: [
            { title: "Sets and Functions", lessons: ["Sets", "Relations and Functions", "Trigonometric Functions"] },
            { title: "Algebra", lessons: ["Complex Numbers", "Linear Inequalities", "Permutations and Combinations"] },
            { title: "Calculus & Statistics", lessons: ["Limits and Derivatives", "Statistics", "Probability"] }
        ],
        schedule: [
            { day: "Tuesday", time: "5:00 PM - 6:30 PM" },
            { day: "Thursday", time: "5:00 PM - 6:30 PM" },
            { day: "Saturday", time: "10:00 AM - 11:30 AM" }
        ],
        teacherBio: "Mathematics enthusiast and former Olympiad trainer. Known for making math fun and engaging.",
        teacherImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        title: "Biology Crash Course - NEET Special",
        teacherName: "Dr. Aditi Sharma",
        subject: "Biology",
        class: "12th",
        startDate: "Feb 1, 2024",
        price: 2999,
        studentCount: 45,
        maxStudents: 50,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Accelerate your NEET preparation with this intensive Biology crash course. Dr. Aditi Sharma covers high-yield topics with mnemonics and visual aids.",
        features: ["NEET Pattern Mock Tests", "High-Yield Mnemonics", "Diagram-based Learning", "Previous Year Question Analysis"],
        syllabus: [
            { title: "Diversity in Living World", lessons: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom"] },
            { title: "Cell Structure & Function", lessons: ["Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division"] },
            { title: "Human Physiology", lessons: ["Digestion and Absorption", "Breathing and Exchange of Gases", "Body Fluids and Circulation"] }
        ],
        schedule: [
            { day: "Monday", time: "4:00 PM - 6:00 PM" },
            { day: "Tuesday", time: "4:00 PM - 6:00 PM" },
            { day: "Wednesday", time: "4:00 PM - 6:00 PM" },
            { day: "Thursday", time: "4:00 PM - 6:00 PM" },
            { day: "Friday", time: "4:00 PM - 6:00 PM" }
        ],
        teacherBio: "Medical professional with a passion for teaching. Expert in Human Physiology and Genetics.",
        teacherImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
];

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
        avatarColor: "bg-blue-100",
        class: ["11th", "12th"],
        language: ["English", "Hindi"]
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
        avatarColor: "bg-green-100",
        class: ["12th"],
        language: ["English", "Hinglish"]
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
        avatarColor: "bg-purple-100",
        class: ["11th"],
        language: ["Hindi", "Hinglish"]
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
        avatarColor: "bg-orange-100",
        class: ["11th", "12th"],
        language: ["English"]
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
        avatarColor: "bg-pink-100",
        class: ["12th"],
        language: ["English", "Marathi"]
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
        avatarColor: "bg-indigo-100",
        class: ["11th", "12th"],
        language: ["English", "Hinglish"]
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
                batchId: "physics_batch_1", // Mock ID for linking
                topic: "Complete Physics Mastery - Class 12th",
                description: "Master the entire Class 12th Physics syllabus with Dr. Priya Patel. This comprehensive course covers everything from Electrostatics to Modern Physics.",
                scheduledAt: Timestamp.fromDate(tomorrow),
                status: "active",
                totalSessions: 24,
                sessions: [
                    { id: "s1", scheduledAt: Timestamp.fromDate(tomorrow), status: "confirmed", isDemo: true },
                    { id: "s2", scheduledAt: Timestamp.fromDate(dayAfter), status: "pending", isDemo: false }
                ],
                paymentStatus: "paid",
                teacherRemarks: "Please bring your textbook and a notebook.",
                createdAt: Timestamp.now()
            },
            {
                studentId,
                studentName,
                teacherId: "dummy_teacher_2",
                topic: "Mathematics Foundation - Class 11th",
                description: "Build a rock-solid foundation in Mathematics. Prof. Rajesh Verma simplifies complex Calculus and Algebra concepts.",
                scheduledAt: Timestamp.fromDate(dayAfter),
                status: "pending",
                totalSessions: 20,
                sessions: [
                    { id: "s1", scheduledAt: Timestamp.fromDate(dayAfter), status: "pending", isDemo: true }
                ],
                paymentStatus: "Trial Class - Pay After",
                teacherRemarks: "",
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

export const seedBatches = async () => {
    try {
        const batchesRef = collection(db, 'batches');
        const snapshot = await getDocs(batchesRef);

        // Delete existing batches to ensure fresh data with new fields
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        const batchIds = ["physics_batch_1", "math_batch_1", "chem_batch_1"];
        const promises = DUMMY_BATCHES.map((batchData, index) => {
            const id = batchIds[index] || `batch_${index}`;
            return setDoc(doc(db, 'batches', id), {
                ...batchData,
                createdAt: Timestamp.now()
            });
        });
        await Promise.all(promises);
        console.log('Dummy batches seeded successfully');
        return true;
    } catch (error) {
        console.error('Error seeding batches:', error);
        return false;
    }
};
