import { FileText, Video, Download, BookOpen, Clock } from 'lucide-react';

export default function StudentResources() {
    const resources = [
        {
            id: 1,
            title: 'Physics - Thermodynamics Class Recording',
            type: 'recording',
            date: '2023-10-25',
            size: '1.2 GB',
            icon: Video,
            color: 'text-blue-500 bg-blue-50'
        },
        {
            id: 2,
            title: 'Mathematics - Calculus Notes (Chapter 1-5)',
            type: 'pdf',
            date: '2023-10-22',
            size: '4.5 MB',
            icon: FileText,
            color: 'text-red-500 bg-red-50'
        },
        {
            id: 3,
            title: 'Chemistry - Periodic Table Cheat Sheet',
            type: 'image',
            date: '2023-10-20',
            size: '2.1 MB',
            icon: BookOpen,
            color: 'text-emerald-500 bg-emerald-50'
        },
        {
            id: 4,
            title: 'Biology - Cell Structure Diagram',
            type: 'image',
            date: '2023-10-18',
            size: '1.8 MB',
            icon: BookOpen,
            color: 'text-emerald-500 bg-emerald-50'
        },
        {
            id: 5,
            title: 'English - Grammar Workbook Solutions',
            type: 'pdf',
            date: '2023-10-15',
            size: '3.2 MB',
            icon: FileText,
            color: 'text-red-500 bg-red-50'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Your Resources</h1>
                <p className="text-slate-500 dark:text-slate-400">Access your class recordings, notes, and study materials.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <div key={resource.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${resource.color}`}>
                                <resource.icon size={24} />
                            </div>
                            <button className="p-2 text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors">
                                <Download size={20} />
                            </button>
                        </div>

                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 min-h-[3rem]">
                            {resource.title}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {resource.date}
                            </div>
                            <div className="flex items-center gap-1">
                                <FileText size={14} />
                                {resource.size}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {resources.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">No resources found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Your teachers haven't uploaded any resources yet.</p>
                </div>
            )}
        </div>
    );
}
