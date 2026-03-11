import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import TeacherCard from '@/components/booking/TeacherCard';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';

interface TopRatedTeachersProps {
    topTeachers: any[];
    loadingTeachers: boolean;
}

export default function TopRatedTeachers({ topTeachers, loadingTeachers }: TopRatedTeachersProps) {
    return (
        <section className="w-full py-16 bg-white">
            <Container>
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-end justify-between w-full">
                        <div className="flex flex-col">
                            <h2 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight flex items-center gap-2 leading-none mb-1">
                                <span className="bg-amber-100 p-1.5 rounded-lg text-amber-500 hidden sm:block">
                                    <Star className="w-5 h-5" fill="currentColor" />
                                </span>
                                Top Rated <span className="text-cyan-600">Teachers</span>
                            </h2>
                            <p className="text-sm font-medium text-slate-500">
                                Highly recommended mentors in your subjects.
                            </p>
                        </div>
                        <Button variant="link" asChild className="text-cyan-700 font-bold text-sm p-0 h-auto">
                            <Link to="/search">View All Teachers</Link>
                        </Button>
                    </div>

                    {/* Teacher Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loadingTeachers ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="h-[380px] bg-slate-100 rounded-[24px] animate-pulse border border-slate-200" />
                            ))
                        ) : (
                            topTeachers.map(teacher => (
                                <TeacherCard
                                    key={teacher.id}
                                    teacher={teacher}
                                    layout="vertical"
                                    onBook={() => { }}
                                />
                            ))
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}
