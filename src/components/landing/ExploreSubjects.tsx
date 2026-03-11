import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import { Card } from '@/components/ui/card';

// Specific Icons imported from assets for the layout grid
import PhysicsIcon from '@/assets/icons for landing page/physics.webp';
import MathIcon from '@/assets/icons for landing page/mathematics.webp';
import ChemistryIcon from '@/assets/icons for landing page/Chemistry.webp';
import BiologyIcon from '@/assets/icons for landing page/Biology.webp';
import EnglishIcon from '@/assets/icons for landing page/English.webp';
import CSIcon from '@/assets/icons for landing page/Computer Science.webp';

const subjects = [
    { name: 'Physics', icon: PhysicsIcon, color: 'bg-[#daf1ff]' },
    { name: 'Mathematics', icon: MathIcon, color: 'bg-[#fff0eb]' },
    { name: 'Chemistry', icon: ChemistryIcon, color: 'bg-[#e5f8f0]' },
    { name: 'Biology', icon: BiologyIcon, color: 'bg-[#fbedff]' },
    { name: 'English', icon: EnglishIcon, color: 'bg-[#ffeddb]' },
    { name: 'Computer Sc.', icon: CSIcon, color: 'bg-[#edf0ff]' },
];

export default function ExploreSubjects() {
    return (
        <section className="w-full py-16 bg-white">
            <Container>
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-end justify-between w-full">
                        <div className="flex flex-col">
                            <h2 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight leading-none mb-1">
                                Explore Subjects
                            </h2>
                            <p className="text-sm font-medium text-slate-500">
                                Dive into our specialized learning paths.
                            </p>
                        </div>
                        <Link to="/search" className="text-cyan-700 font-bold text-sm hover:underline whitespace-nowrap">
                            View All Subjects
                        </Link>
                    </div>

                    {/* Subjects Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {subjects.map((subject) => (
                            <Link
                                key={subject.name}
                                to={`/search?subject=${subject.name}`}
                                className="group relative"
                            >
                                <Card className="p-6 border-slate-100 hover:border-cyan-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,180,216,0.15)] transition-all duration-300 rounded-[24px] flex flex-col items-center justify-center overflow-hidden">
                                    {/* Blur Blob behind icon */}
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 ${subject.color} rounded-full blur-[20px] opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all`} />

                                    <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white rounded-2xl shadow-sm mb-4 group-hover:-translate-y-1 transition-transform border border-slate-50">
                                        <img
                                            src={subject.icon}
                                            alt={subject.name}
                                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-110 transition-transform"
                                        />
                                    </div>
                                    <span className="relative z-10 font-bold text-slate-900 text-[14px] text-center w-full truncate px-1">
                                        {subject.name}
                                    </span>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
