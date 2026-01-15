import { Star, Clock, MapPin, ShieldCheck, Award, Play, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

interface TeacherCardProps {
    teacher: any;
    onBook: (teacherId: string) => void;
    onPlayVideo?: (videoUrl: string) => void;
    layout?: 'horizontal' | 'vertical';
    isFocused?: boolean;
    onFocus?: () => void;
    onSave?: () => void;
}

export default function TeacherCard({
    teacher,
    onBook,
    onPlayVideo,
    layout = 'horizontal',
    isFocused = false,
    onFocus,
    onSave
}: TeacherCardProps) {
    const { userRole } = useAuth();
    const profilePath = userRole === 'student' ? `/student/teacher/${teacher.id}` : `/teacher/${teacher.id}`;
    const isVertical = layout === 'vertical';

    const videoUrl = teacher.introVideo || 'https://www.w3schools.com/html/mov_bbb.mp4';
    // Use dummy image for profile if not present, or even if present as per request to "put dummy images"
    // Using Unsplash for realistic portraits
    const dummyImage = `https://images.unsplash.com/photo-${teacher.id.charCodeAt(0) % 2 === 0 ? '1535713875002-d1d0cf377fde' : '1580489944761-15a19d654956'}?auto=format&fit=crop&q=80&w=200&h=200`;
    const thumbnailUrl = teacher.photoURL || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop';

    return (
        <div
            className="relative group w-full"
            onMouseEnter={onFocus}
        >
            {/* Main Card Surface */}
            <div className={`
                relative z-20
                bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 
                hover:shadow-xl hover:shadow-cyan-100/50 dark:hover:shadow-none transition-all duration-300 
                flex flex-col ${isVertical ? '' : 'md:flex-row'} gap-6
                ${!isVertical ? 'md:w-[calc(100%-17rem)]' : 'w-full'}
            `}>


                {/* Left: Avatar */}
                <div className={`flex-shrink-0 flex justify-center ${isVertical ? '' : 'md:block'}`}>
                    <div className={`w-20 h-20 md:w-32 md:h-32 rounded-full ${teacher.avatarColor || 'bg-cyan-100'} flex items-center justify-center text-2xl md:text-3xl font-bold text-cyan-700 border-4 border-white dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none overflow-hidden`}>
                        <img src={dummyImage} alt={teacher.name} className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Middle: Info */}
                <div className="flex-grow space-y-3 relative">
                    <div className="flex items-start justify-between pr-12">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                {teacher.name}
                                {teacher.kycStatus === 'verified' && (
                                    <ShieldCheck size={18} className="text-emerald-500" fill="currentColor" stroke="white" />
                                )}
                            </h3>
                            <p className="text-cyan-700 font-medium text-sm flex items-center gap-1">
                                <Award size={14} />
                                {teacher.subject} Teacher
                                {teacher.experience && <span className="text-slate-400">• {teacher.experience} Exp.</span>}
                            </p>
                        </div>

                        {/* Like Button (Moved here) */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSave && onSave();
                            }}
                            className="absolute top-0 right-0 p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            title="Save Teacher"
                        >
                            <Heart size={20} />
                        </button>

                        <div className={`${isVertical ? '' : 'md:hidden'} text-right`}>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">₹{teacher.hourlyRate}</div>
                            <div className="text-xs text-slate-500">/hour</div>
                        </div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {teacher.bio || `Experienced ${teacher.subject} tutor passionate about helping students achieve their academic goals.`}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-100 dark:border-slate-700">
                            {teacher.subject}
                        </span>
                        {teacher.college && (
                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-100 dark:border-slate-700 flex items-center gap-1">
                                <MapPin size={10} /> {teacher.college}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full border border-green-100 dark:border-green-900/30 flex items-center gap-1">
                            <Clock size={10} /> Available
                        </span>
                        {teacher.class && (
                            <span className="px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 text-xs font-medium rounded-full border border-cyan-100 dark:border-cyan-900/30">
                                {Array.isArray(teacher.class) ? teacher.class.join(', ') : teacher.class}
                            </span>
                        )}
                        {teacher.language && (
                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-100 dark:border-slate-700">
                                {Array.isArray(teacher.language) ? teacher.language.join(', ') : teacher.language}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: Action */}
                <div className={`flex-shrink-0 flex flex-col items-end justify-between min-w-[140px] border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 ${isVertical ? '' : 'md:border-t-0 md:border-l md:pt-0 md:pl-6 md:mt-0'}`}>
                    <div className={`${isVertical ? 'hidden' : 'hidden md:block'} text-right mb-4`}>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">₹{teacher.hourlyRate}</div>
                        <div className="text-xs text-slate-500">per hour</div>
                    </div>

                    <div className="flex items-center gap-1 mb-4 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">
                        <Star size={14} className="text-amber-500" fill="currentColor" />
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{teacher.rating || 'New'}</span>
                        <span className="text-slate-400 text-xs">({teacher.reviewCount || 0})</span>
                    </div>

                    <div className={`flex gap-2 w-full ${isVertical ? 'flex-row' : 'flex-row md:flex-col'}`}>
                        <button
                            onClick={() => onBook(teacher.uid)}
                            className="flex-1 md:w-full px-4 py-2.5 bg-cyan-700 text-white font-medium text-xs md:text-sm rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-700/20 active:scale-95"
                        >
                            Book Class
                        </button>
                        <Link
                            to={profilePath}
                            className="flex-1 md:w-full px-4 py-2.5 bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 font-medium text-xs md:text-sm rounded-xl border border-cyan-100 dark:border-cyan-900 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-all text-center"
                        >
                            Profile
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hover Side Box (Video Thumbnail) */}
            {!isVertical && (
                <div className={`hidden md:block absolute top-0 right-0 bottom-0 w-64 rounded-2xl overflow-hidden z-10
                    transition-all duration-500 ease-out
                    ${isFocused ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'}
                `}>
                    <div className="relative w-full h-full group/video cursor-pointer" onClick={() => onPlayVideo && onPlayVideo(videoUrl)}>
                        <img
                            src={thumbnailUrl}
                            alt="Intro Video"
                            className="w-full h-full object-cover opacity-90 group-hover/video:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover/video:bg-black/10 transition-colors" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2">
                            <div className="w-14 h-14 rounded-full bg-cyan-600/90 flex items-center justify-center group-hover/video:scale-110 transition-transform shadow-xl">
                                <Play size={28} fill="currentColor" className="ml-1" />
                            </div>
                            <span className="text-sm font-bold tracking-wide drop-shadow-md">Watch Intro</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
