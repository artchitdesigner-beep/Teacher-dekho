import { Link } from 'react-router-dom';

// 3D Icons
import InstantConsultIcon from '@/assets/3d-icons/instant-consult.png';
import FindTeachersIcon from '@/assets/3d-icons/find-teachers.png';
import BatchesIcon from '@/assets/3d-icons/batches.png';
import UpcomingTestsIcon from '@/assets/3d-icons/upcoming-tests.png';

export default function ServiceCards() {
    const services = [
        {
            title: 'Instant Consult',
            subtitle: 'Connect within 60 secs',
            image: InstantConsultIcon,
            bgImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            bg: 'bg-[#eff6ff] dark:bg-blue-900/20',
            border: 'border-blue-100 dark:border-blue-800',
            link: '/search?type=consult'
        },
        {
            title: 'Find Teachers',
            subtitle: 'Confirmed appointments',
            image: FindTeachersIcon,
            bgImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            bg: 'bg-[#ecfeff] dark:bg-cyan-900/20',
            border: 'border-cyan-100 dark:border-cyan-800',
            link: '/search'
        },
        {
            title: 'Batches',
            subtitle: 'Join a Batch',
            image: BatchesIcon,
            bgImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            bg: 'bg-[#f5f3ff] dark:bg-purple-900/20',
            border: 'border-purple-100 dark:border-purple-800',
            link: '/student/batches'
        },
        {
            title: 'Upcoming Tests',
            subtitle: 'Safe and trusted',
            image: UpcomingTestsIcon,
            bgImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            bg: 'bg-[#ecfdf5] dark:bg-emerald-900/20',
            border: 'border-emerald-100 dark:border-emerald-800',
            link: '/student/tests'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
                <Link
                    key={index}
                    to={service.link}
                    className={`flex flex-col ${service.bg} rounded-[2.5rem] border ${service.border} shadow-sm hover:shadow-xl hover:scale-[1.03] transition-all duration-700 group relative overflow-hidden h-[280px] md:h-[340px]`}
                >
                    {/* Top Section: Integrated Icon Background */}
                    <div className="relative h-[60%] flex items-center justify-center p-6 overflow-hidden">
                        {/* Unsplash Background Overlay (Very Subtle) */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={service.bgImage}
                                alt=""
                                className="w-full h-full object-cover opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className={`absolute inset-0 ${service.bg} opacity-50`} />
                        </div>

                        {/* The 3D Icon as the Hero */}
                        <div className="relative z-10 w-full h-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-700">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-[85%] h-[85%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)]"
                            />
                        </div>

                        {/* Decoration */}
                        <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* Bottom Section: Airy Glassmorphism */}
                    <div className="p-6 pt-2 relative z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-t border-white/40 dark:border-white/10 flex-grow flex flex-col justify-center text-center">
                        <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg md:text-xl mb-1 leading-tight tracking-tight">{service.title}</h3>
                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.12em] opacity-80">{service.subtitle}</p>
                    </div>

                    {/* Corner Glow */}
                    <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/30 dark:bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-all duration-700" />
                </Link>
            ))}
        </div>
    );
}
