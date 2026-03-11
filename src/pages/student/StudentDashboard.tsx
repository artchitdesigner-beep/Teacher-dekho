import { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Container from '@/components/ui/Container';

// Components
import HeroSection from '@/components/landing/HeroSection';
import SearchBar from '@/components/landing/SearchBar';
import ServiceCards from '@/components/landing/ServiceCards';
import CampusGallery from '@/components/landing/CampusGallery';
import FeaturedBatches from '@/components/landing/FeaturedBatches';
import DownloadAppSection from '@/components/landing/DownloadAppSection';
import VideosSection from '@/components/landing/VideosSection';
import ExploreSubjects from '@/components/landing/ExploreSubjects';
import TopRatedTeachers from '@/components/landing/TopRatedTeachers';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import LearningCycle from '@/components/landing/LearningCycle';
import RightPath from '@/components/landing/RightPath';
import EliteJoin from '@/components/landing/EliteJoin';
import EducationSpotlight from '@/components/landing/EducationSpotlight';
import TestimonialsGrid from '@/components/landing/TestimonialsGrid';

export default function StudentDashboard() {
    const [topTeachers, setTopTeachers] = useState<any[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(true);

    useEffect(() => {
        const fetchTopTeachers = async () => {
            try {
                const q = query(
                    collection(db, 'users'),
                    where('role', '==', 'teacher'),
                    limit(4)
                );
                const snap = await getDocs(q);
                const teachers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort client-side to handle missing rating
                const sortedTeachers = teachers.sort((a: any, b: any) => {
                    const ratingA = a.rating || 0;
                    const ratingB = b.rating || 0;
                    return ratingB - ratingA;
                }).slice(0, 4);

                setTopTeachers(sortedTeachers);
            } catch (error) {
                console.error('Error fetching top teachers:', error);
            } finally {
                setLoadingTeachers(false);
            }
        };
        fetchTopTeachers();
    }, []);

    return (
        <div className="w-full pb-10 flex flex-col gap-0 relative bg-grid-pattern">
            {/* 1. Hero Section */}
            <HeroSection />

            {/* 2. Search Bar Section */}
            <SearchBar />

            {/* 3. Service Cards Section */}
            <ServiceCards />

            {/* 4. Featured Batches Section */}
            <div className="w-full py-8 md:py-12">
                <Container>
                    <FeaturedBatches />
                </Container>
            </div>

            {/* 5. Campus Gallery Section */}
            <CampusGallery />

            {/* 6. Videos Section */}
            <VideosSection />

            {/* 7. Explore Subjects */}
            <ExploreSubjects />

            {/* 8. Top Rated Teachers */}
            <TopRatedTeachers topTeachers={topTeachers} loadingTeachers={loadingTeachers} />

            {/* 9. Why Choose Us */}
            <WhyChooseUs />

            {/* 10. The Learning Cycle */}
            <LearningCycle />

            {/* 11. Right Path (Callback) */}
            <RightPath />

            {/* 12. Become a Part of Elite */}
            <EliteJoin />

            {/* 13. Education Spotlight (Blog) */}
            <EducationSpotlight />

            {/* 14. Testimonials */}
            <TestimonialsGrid />

            {/* 15. Download App Section */}
            <div className="w-full py-8 md:py-12">
                <Container>
                    <DownloadAppSection />
                </Container>
            </div>
        </div>
    );
}
