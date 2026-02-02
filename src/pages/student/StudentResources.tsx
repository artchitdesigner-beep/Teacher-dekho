import { FileText, Video, Download, BookOpen, Clock, FileImage, File } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StudentResources() {
    const resources = [
        {
            id: 1,
            title: 'Physics - Thermodynamics Class Recording',
            type: 'recording',
            date: '2023-10-25',
            size: '1.2 GB',
            icon: Video,
            color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
        },
        {
            id: 2,
            title: 'Mathematics - Calculus Notes (Chapter 1-5)',
            type: 'pdf',
            date: '2023-10-22',
            size: '4.5 MB',
            icon: FileText,
            color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
        },
        {
            id: 3,
            title: 'Chemistry - Periodic Table Cheat Sheet',
            type: 'image',
            date: '2023-10-20',
            size: '2.1 MB',
            icon: FileImage,
            color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
        },
        {
            id: 4,
            title: 'Biology - Cell Structure Diagram',
            type: 'image',
            date: '2023-10-18',
            size: '1.8 MB',
            icon: FileImage,
            color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
        },
        {
            id: 5,
            title: 'English - Grammar Workbook Solutions',
            type: 'pdf',
            date: '2023-10-15',
            size: '3.2 MB',
            icon: FileText,
            color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
        }
    ];

    return (
        <div className="w-full space-y-8 p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Your Resources</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Access your class recordings, notes, and study materials.</p>
                </div>
                <Button className="bg-cyan-700 hover:bg-cyan-800 text-white">
                    <BookOpen className="mr-2" size={18} /> Browse All
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <Card key={resource.id} className="hover:shadow-lg transition-all border-slate-200 dark:border-slate-800">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className={`p-3 rounded-xl ${resource.color}`}>
                                <resource.icon size={24} />
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20">
                                <Download size={20} />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="min-h-[3.5rem] mt-2">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                                    {resource.title}
                                </h3>
                            </div>
                            <div className="flex bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mt-4 items-center justify-between text-xs text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-cyan-700 dark:text-cyan-400" />
                                    {resource.date}
                                </div>
                                <div className="flex items-center gap-1.5 font-mono font-medium">
                                    <File size={14} />
                                    {resource.size}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Badge variant="secondary" className="w-full justify-center py-1.5 text-slate-600 dark:text-slate-300 font-medium">
                                {resource.type.toUpperCase()}
                            </Badge>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {resources.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                            No resources found
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md">
                            Your teachers haven't uploaded any resources yet. Check back later!
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
