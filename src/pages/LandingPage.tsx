import { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Container from '@/components/ui/Container';

// Existing Components
import HeroSection from '@/components/landing/HeroSection';
import SearchBar from '@/components/landing/SearchBar';
import ServiceCards from '@/components/landing/ServiceCards';
import CampusGallery from '@/components/landing/CampusGallery';
import FeaturedBatches from '@/components/landing/FeaturedBatches';
import DownloadAppSection from '@/components/landing/DownloadAppSection';

// New Components
import VideosSection from '@/components/landing/VideosSection';
import ExploreSubjects from '@/components/landing/ExploreSubjects';
import TopRatedTeachers from '@/components/landing/TopRatedTeachers';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import LearningCycle from '@/components/landing/LearningCycle';
import RightPath from '@/components/landing/RightPath';
import EliteJoin from '@/components/landing/EliteJoin';
import EducationSpotlight from '@/components/landing/EducationSpotlight';
import TestimonialsGrid from '@/components/landing/TestimonialsGrid';

export default function LandingPage() {
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
                // Sort by rating internally if needed
                const sortedTeachers = teachers.sort((a: any, b: any) => {
                    const ratingA = a.rating || 0;
                    const ratingB = b.rating || 0;
                    return ratingB - ratingA;
                }).slice(0, 4);
                setTopTeachers(sortedTeachers);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            } finally {
                setLoadingTeachers(false);
            }
        };
        fetchTopTeachers();
    }, []);

    return (
        <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 selection:bg-cyan-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative bg-grid-pattern">
            {/* 1. Hero Section (Banner) */}
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

            {/* WhatsApp Support Button */}
            <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
                aria-label="Chat on WhatsApp"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="absolute right-full mr-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-1 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Chat with us
                </span>
            </a>
        </div>
    );
}
