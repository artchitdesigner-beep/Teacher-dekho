import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, Clock, BookOpen, MoreVertical, ArrowRight, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

export default function TeacherBatches() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 italic tracking-tight">Batches</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your group classes and schedules.</p>
                </div>
            </div>

            <Tabs defaultValue="running" className="space-y-6">
                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl h-auto">
                    <TabsTrigger value="running" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 font-bold px-6 py-2">
                        Running Batches
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 font-bold px-6 py-2">
                        Upcoming
                    </TabsTrigger>
                    <TabsTrigger value="create" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 font-bold px-6 py-2 flex items-center gap-2">
                        <Plus size={16} /> Create New
                    </TabsTrigger>
                </TabsList>

                {/* Content Area */}
                <TabsContent value="running" className="outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {runningClasses.map(batch => (
                            <Card key={batch.id} className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 group">
                                <CardHeader className="p-6 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center">
                                                <BookOpen size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-cyan-600 transition-colors uppercase tracking-tight">{batch.name}</h3>
                                                <Badge variant="outline" className="text-[10px] mt-1 border-cyan-100 dark:border-cyan-900 text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest">{batch.type}</Badge>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:text-cyan-600"><MoreVertical size={18} /></Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 pt-4 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Students</p>
                                            <p className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                <Users size={14} className="text-cyan-500" /> {batch.students}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Schedule</p>
                                            <p className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                <Clock size={14} className="text-cyan-500" /> {batch.time}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Course Progress</p>
                                            <p className="text-xs font-black text-cyan-600 italic">{batch.progress}%</p>
                                        </div>
                                        <Progress value={batch.progress} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-0">
                                    <Button asChild className="w-full h-12 rounded-2xl bg-cyan-700 hover:bg-slate-900 text-white font-bold group/btn shadow-lg shadow-cyan-900/10">
                                        <Link to={`/teacher/batches/${batch.id}`}>
                                            Manage Class
                                            <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="upcoming" className="outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {upcomingClasses.map(batch => (
                            <Card key={batch.id} className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 p-2 overflow-hidden hover:shadow-xl transition-all">
                                <CardContent className="p-4 flex items-center gap-6">
                                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                                        <Calendar size={32} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-lg uppercase tracking-tight">{batch.name}</h3>
                                            <Badge className="bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border-none font-black text-[9px] uppercase">{batch.type}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <Clock size={14} className="text-cyan-500" /> {new Date(batch.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <Users size={14} className="text-cyan-500" /> {batch.registered}/{batch.maxStudents}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" className="rounded-2xl border-slate-200 dark:border-slate-700 text-slate-400 hover:text-cyan-600"><MoreVertical size={18} /></Button>
                                        <Button className="rounded-2xl bg-slate-900 text-white text-xs font-bold px-6 h-12 uppercase tracking-widest">Share</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="create" className="outline-none">
                    <Card className="max-w-3xl mx-auto rounded-[3rem] border-slate-200 dark:border-slate-800 shadow-2xl shadow-cyan-900/5 animate-in zoom-in-95 duration-500">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 italic">
                                <Sparkles className="text-cyan-600" /> Create New Batch
                            </CardTitle>
                            <CardDescription>Setup a new group class and reach more students.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Batch Name</label>
                                    <Input placeholder="e.g. Physics Mechanics Masterclass" className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                    <select className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500">
                                        <option>Mathematics</option>
                                        <option>Physics</option>
                                        <option>Chemistry</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Max Students</label>
                                    <Input type="number" placeholder="20" className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fees (₹)</label>
                                    <Input type="number" placeholder="5000" className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 space-y-4">
                                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                                    <Clock size={18} className="text-cyan-600" /> Schedule Configuration
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input type="time" className="rounded-xl border-slate-200 dark:border-slate-800" />
                                    <Input type="time" className="rounded-xl border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                        <button key={day} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase text-slate-400 hover:text-cyan-600 hover:border-cyan-600 transition-all">
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-8 pt-0">
                            <Button className="w-full h-14 rounded-[1.5rem] bg-cyan-700 hover:bg-slate-900 text-white font-black uppercase tracking-widest shadow-2xl shadow-cyan-900/20">
                                Initialize Batch
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

const runningClasses = [
    { id: '1', name: 'Physics Mechanics', type: 'batch', students: 12, time: '10:00 AM', days: 'Mon, Wed, Fri', progress: 45 },
    { id: '2', name: 'Organic Chemistry', type: 'batch', students: 8, time: '04:00 PM', days: 'Tue, Thu', progress: 20 },
    { id: '3', name: 'Math - Calculus (Aarav)', type: 'personal', students: 1, time: '02:00 PM', days: 'Mon, Thu', progress: 60 },
];

const upcomingClasses = [
    { id: '4', name: 'JEE Mains Prep', type: 'batch', startDate: '2025-02-01', registered: 5, maxStudents: 20, time: '06:00 PM' },
    { id: '5', name: 'Physics - Mechanics (Vivaan)', type: 'personal', startDate: '2025-02-05', registered: 1, maxStudents: 1, time: '05:00 PM' },
];
