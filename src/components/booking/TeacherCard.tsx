import { Star, Clock, MapPin, ShieldCheck, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
// User type not actually used in component props, removing import

interface TeacherCardProps {
    teacher: any; // Using any for now, ideally should be a Teacher type
    onBook: (teacherId: string) => void;
}

export default function TeacherCard({ teacher, onBook }: TeacherCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 flex flex-col md:flex-row gap-6">
            {/* Left: Avatar */}
            <div className="flex-shrink-0">
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${teacher.avatarColor || 'bg-indigo-100'} flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-white shadow-lg shadow-slate-100`}>
                    {teacher.photoURL ? (
                        <img src={teacher.photoURL} alt={teacher.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        teacher.name.charAt(0)
                    )}
                </div>
            </div>

            {/* Middle: Info */}
            <div className="flex-grow space-y-3">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {teacher.name}
                            {teacher.kycStatus === 'verified' && (
                                <ShieldCheck size={18} className="text-emerald-500" fill="currentColor" stroke="white" />
                            )}
                        </h3>
                        <p className="text-indigo-600 font-medium text-sm flex items-center gap-1">
                            <Award size={14} />
                            {teacher.subject} Teacher
                            {teacher.experience && <span className="text-slate-400">• {teacher.experience} Exp.</span>}
                        </p>
                    </div>
                    <div className="md:hidden text-right">
                        <div className="text-2xl font-bold text-slate-900">₹{teacher.hourlyRate}</div>
                        <div className="text-xs text-slate-500">/hour</div>
                    </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {teacher.bio || `Experienced ${teacher.subject} tutor passionate about helping students achieve their academic goals.`}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100">
                        {teacher.subject}
                    </span>
                    {teacher.college && (
                        <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100 flex items-center gap-1">
                            <MapPin size={10} /> {teacher.college}
                        </span>
                    )}
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100 flex items-center gap-1">
                        <Clock size={10} /> Available
                    </span>
                </div>
            </div>

            {/* Right: Action */}
            <div className="flex-shrink-0 flex flex-col items-end justify-between min-w-[140px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
                <div className="hidden md:block text-right mb-4">
                    <div className="text-2xl font-bold text-slate-900">₹{teacher.hourlyRate}</div>
                    <div className="text-xs text-slate-500">per hour</div>
                </div>

                <div className="flex items-center gap-1 mb-4 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                    <Star size={14} className="text-amber-500" fill="currentColor" />
                    <span className="font-bold text-slate-900 text-sm">{teacher.rating || 'New'}</span>
                    <span className="text-slate-400 text-xs">({teacher.reviewCount || 0})</span>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <button
                        onClick={() => onBook(teacher.uid)}
                        className="w-full px-4 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        Book Class
                    </button>
                    <Link
                        to={`/student/teacher/${teacher.id}`}
                        className="w-full px-4 py-2.5 bg-white text-indigo-600 font-medium text-sm rounded-xl border border-indigo-100 hover:bg-indigo-50 transition-all text-center"
                    >
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}
