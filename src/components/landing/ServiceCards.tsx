import Container from '@/components/ui/Container';
import { Card } from '@/components/ui/card';

// Import local assets
import BatchesIcon from '@/assets/3d-icons/batches.png';
import InstantConsultIcon from '@/assets/3d-icons/instant-consult.png';
import FindTeachersIcon from '@/assets/3d-icons/find-teachers.png';

interface ServiceCardData {
    title: string;
    subtitle: string;
    iconUrl: string;
    bgColor: string;
}

const serviceCardsData: ServiceCardData[] = [
    {
        title: "Manage Courses",
        subtitle: "Connect within 60 secs",
        iconUrl: InstantConsultIcon,
        bgColor: "bg-gradient-to-br from-blue-100 to-blue-50"
    },
    {
        title: "Find Teachers",
        subtitle: "Confirmed appointments",
        iconUrl: FindTeachersIcon,
        bgColor: "bg-gradient-to-br from-teal-100 to-emerald-50"
    },
    {
        title: "Batches",
        subtitle: "Join a Batch",
        iconUrl: BatchesIcon,
        bgColor: "bg-gradient-to-br from-emerald-50/50 to-blue-50/50"
    }
];

export default function ServiceCards() {
    return (
        <section className="relative w-full pt-0 pb-8 md:pb-12 z-20">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] lg:gap-[40px] max-w-[1100px] mx-auto px-4 md:px-0">
                    {serviceCardsData.map((card, idx) => (
                        <Card
                            key={idx}
                            className="group flex flex-col items-center rounded-3xl shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer border border-slate-100 overflow-hidden bg-white"
                        >
                            {/* Top Color Half */}
                            <div className={`w-full h-[180px] flex items-center justify-center relative overflow-hidden ${card.bgColor}`}>
                                {/* Subtle white gradient overlay at bottom of color section */}
                                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />

                                {/* 3D Icon */}
                                <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2">
                                    <img
                                        src={card.iconUrl}
                                        alt={card.title}
                                        className="w-full h-full object-contain filter drop-shadow-lg"
                                    />
                                </div>
                            </div>

                            {/* Text Content - White Bottom Half */}
                            <div className="text-center w-full bg-white p-6 md:p-8">
                                <h3 className="text-slate-900 font-bold text-[18px] md:text-[20px] mb-1">{card.title}</h3>
                                <p className="text-slate-500 text-[13px] md:text-[14px] leading-relaxed font-medium">{card.subtitle}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
}
