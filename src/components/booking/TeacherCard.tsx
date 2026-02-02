import { Star, Clock, MapPin, ShieldCheck, Award, Play, Heart, GraduationCap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { getMinMonthlyRate } from '@/lib/plans';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface TeacherCardProps {
    teacher: any;
    onBook: (teacherId: string) => void;
    onPlayVideo?: (videoUrl: string) => void;
    layout?: 'horizontal' | 'vertical';
    isFocused?: boolean;
    onFocus?: () => void;
    onSave?: () => void;
    isSaved?: boolean;
}

export default function TeacherCard({
    teacher,
    onBook,
    onPlayVideo,
    layout = 'horizontal',
    isFocused = false,
    onFocus,
    onSave,
    isSaved = false
}: TeacherCardProps) {
    const { userRole } = useAuth();
    const profilePath = userRole === 'student' ? `/student/teacher/${teacher.id}` : `/teacher/${teacher.id}`;
    const isVertical = layout === 'vertical';

    const videoUrl = teacher.introVideo || 'https://www.w3schools.com/html/mov_bbb.mp4';
    // Use dummy image for profile if not present
    const dummyImage = `https://images.unsplash.com/photo-${teacher.id.charCodeAt(0) % 2 === 0 ? '1535713875002-d1d0cf377fde' : '1580489944761-15a19d654956'}?auto=format&fit=crop&q=80&w=200&h=200`;
    const thumbnailUrl = teacher.photoURL || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop';

    const monthlyRate = getMinMonthlyRate();
    const experience = teacher.experience || '5+ Years';
    const students = teacher.students || '100+';

    // --- Vertical Card (Dashboard / Home) ---
    if (isVertical) {
        return (
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 group h-full flex flex-col">
                {/* Header Image Background */}
                <div className="h-24 bg-gradient-to-r from-cyan-500 to-blue-600 relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSave && onSave();
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
                    >
                        <Heart size={16} className={cn("transition-colors", isSaved ? "fill-red-500 text-red-500" : "")} />
                    </button>
                </div>

                <div className="px-5 -mt-12 flex-grow">
                    {/* Avatar & Verification using CSS relative positioning */}
                    <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-950 overflow-hidden bg-white shadow-md">
                            <img src={dummyImage} alt={teacher.name} className="w-full h-full object-cover" />
                        </div>
                        {teacher.kycStatus === 'verified' && (
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-950 shadow-sm" title="Verified Teacher">
                                <ShieldCheck size={14} fill="currentColor" />
                            </div>
                        )}
                    </div>

                    <div className="mt-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-cyan-700 transition-colors">
                                    {teacher.name}
                                </h3>
                                <div className="text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-1 flex items-center gap-1">
                                    <Award size={12} />
                                    {teacher.subject} Expert
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-xs font-bold border border-amber-100 dark:border-amber-900/30">
                                    <Star size={10} fill="currentColor" /> {teacher.rating || '4.9'}
                                </div>
                            </div>
                        </div>

                        {/* Bio / Tagline */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 min-h-[2.5em]">
                            {teacher.bio || `Passionate ${teacher.subject} educator dedicated to simplifying complex concepts for students.`}
                        </p>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4 mt-4 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-1.5" title="Experience">
                                <GraduationCap size={14} className="text-slate-400" />
                                <span className="font-medium">{experience}</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Students Taught">
                                <Users size={14} className="text-slate-400" />
                                <span className="font-medium">{students} Students</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto p-5 pt-2">
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Starts From</span>
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">₹{monthlyRate}</span>
                                <span className="text-xs text-slate-500 font-medium">/mo</span>
                            </div>
                        </div>
                        {/* Next Available Slot (Mock) */}
                        <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50 border-emerald-100 px-2 py-0.5 h-fit">
                            <Clock size={10} className="mr-1" /> Next: 5 PM
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link to={profilePath} className="w-full">
                            <Button variant="outline" className="w-full text-xs h-9 hover:bg-slate-50 border-slate-200">
                                View Profile
                            </Button>
                        </Link>
                        <Button
                            onClick={() => onBook(teacher.uid)}
                            className="w-full bg-cyan-700 hover:bg-cyan-800 text-white text-xs h-9 shadow-md shadow-cyan-900/5 transition-all"
                        >
                            Book Demo
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    // --- Horizontal Card (Search Page) ---
    return (
        <div
            className="group relative w-full lg:w-[calc(100%-18rem)]"
            onMouseEnter={onFocus}
        >
            <Card className="p-0 overflow-hidden hover:shadow-lg transition-all border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row">
                    {/* Left: Avatar & Basic Info */}
                    <div className="p-6 md:w-64 flex-shrink-0 flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative">
                        <div className="w-24 h-24 md:w-20 md:h-20 rounded-2xl overflow-hidden mb-3 md:mb-4 bg-white shadow-sm border border-slate-200 dark:border-slate-700">
                            <img src={dummyImage} alt={teacher.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="text-center md:text-left w-full">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center justify-center md:justify-start gap-1">
                                {teacher.name}
                                {teacher.kycStatus === 'verified' && <ShieldCheck size={16} className="text-emerald-500" fill="currentColor" stroke="white" />}
                            </h3>
                            <p className="text-sm font-medium text-cyan-700 mt-0.5">{teacher.subject}</p>

                            <div className="flex items-center justify-center md:justify-start gap-1 mt-2 text-xs text-slate-500">
                                <MapPin size={12} />
                                {teacher.location || teacher.city || 'Online'}
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSave && onSave();
                            }}
                            className="absolute top-4 right-4 md:hidden p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <Heart size={20} className={isSaved ? "fill-red-500 text-red-500" : ""} />
                        </button>
                    </div>

                    {/* Middle: Detailed Bio & Stats */}
                    <div className="flex-grow p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-2 hidden md:flex">
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                                    {teacher.experience || '5+ Years'} Exp.
                                </Badge>
                                {teacher.college && (
                                    <Badge variant="outline" className="text-slate-500 border-slate-200">
                                        <GraduationCap size={12} className="mr-1" /> {teacher.college}
                                    </Badge>
                                )}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSave && onSave();
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            >
                                <Heart size={18} className={isSaved ? "fill-red-500 text-red-500" : ""} />
                            </button>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
                            {teacher.bio || `Experienced ${teacher.subject} teacher with a proven track record of helping students excel. Specialized in interactive learning and personalized guidance.`}
                        </p>

                        <div className="mt-auto flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Star size={16} className="text-amber-500 fill-amber-500" />
                                <span className="font-bold text-slate-900 dark:text-slate-100">{teacher.rating || '4.9'}</span>
                                <span className="text-xs">({teacher.reviewCount || 12} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                <Clock size={16} />
                                Available Today
                            </div>
                        </div>
                    </div>

                    {/* Right: Pricing & CTA */}
                    <div className="p-6 md:w-56 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-center bg-slate-50/30 dark:bg-slate-900/10">
                        <div className="text-center md:text-right mb-4">
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Plan Starts At</div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">₹{monthlyRate}</div>
                            <div className="text-xs text-slate-400">per month</div>
                        </div>

                        <div className="space-y-2">
                            <Button onClick={() => onBook(teacher.uid)} className="w-full bg-cyan-700 hover:bg-cyan-800 text-white shadow-lg shadow-cyan-900/10">
                                Book Class
                            </Button>
                            <Link to={profilePath} className="block">
                                <Button variant="outline" className="w-full border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800 dark:border-cyan-800 dark:text-cyan-400 dark:hover:bg-cyan-950">
                                    View Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Hover Video Preview (Desktop Only) */}
            {!isVertical && (
                <div className={`hidden lg:block absolute top-0 -right-64 bottom-0 w-60 rounded-xl overflow-hidden z-10 shadow-xl border-4 border-white dark:border-slate-800
                    transition-all duration-300 ease-out origin-left
                    ${isFocused ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-10 scale-95 pointer-events-none'}
                `}>
                    <div className="relative w-full h-full group/video cursor-pointer bg-black" onClick={() => onPlayVideo && onPlayVideo(videoUrl)}>
                        <img
                            src={thumbnailUrl}
                            alt="Intro"
                            className="w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover/video:scale-110 transition-transform">
                                <Play size={24} fill="white" className="text-white ml-1" />
                            </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                            <p className="text-xs font-bold line-clamp-1">{teacher.introTitle || 'Watch Intro Video'}</p>
                            <p className="text-[10px] opacity-80">{teacher.duration || '1:45'} • English</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
