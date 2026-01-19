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
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            link: '/search?type=consult'
        },
        {
            title: 'Find Teachers',
            subtitle: 'Confirmed appointments',
            image: FindTeachersIcon,
            bg: 'bg-cyan-50 dark:bg-cyan-900/20',
            link: '/search'
        },
        {
            title: 'Batches',
            subtitle: 'Join a Batch',
            image: BatchesIcon,
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            link: '/student/batches'
        },
        {
            title: 'Upcoming Tests',
            subtitle: 'Safe and trusted',
            image: UpcomingTestsIcon,
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            link: '/student/tests'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {services.map((service, index) => (
                <Link
                    key={index}
                    to={service.link}
                    className="flex flex-col items-start p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-cyan-200 dark:hover:border-cyan-800 transition-all group"
                >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${service.bg} group-hover:scale-110 transition-transform p-2`}>
                        <img src={service.image} alt={service.title} className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1">{service.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{service.subtitle}</p>
                </Link>
            ))}
        </div>
    );
}
