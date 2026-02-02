import { useState } from 'react';
import { Upload, FileText, Youtube, MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function TeacherIntegrations() {
    const [activeTab, setActiveTab] = useState<'resources' | 'doubts'>('resources');
    const [resources] = useState([
        { id: 1, type: 'pdf', title: 'Physics Formula Sheet.pdf', date: '2 days ago', size: '2.4 MB' },
        { id: 2, type: 'youtube', title: 'Introduction to Thermodynamics - Lecture 1', date: '1 week ago', url: 'https://youtu.be/...' }
    ]);
    const [doubts, setDoubts] = useState([
        { id: 1, student: 'Aarav Patel', question: 'Sir, I am confused about the second law of thermodynamics. Can you explain entropy again?', date: '1 day ago', status: 'pending' },
        { id: 2, student: 'Meera Singh', question: 'In question 4 of the assignment, do we need to consider friction?', date: '2 days ago', status: 'solved', solution: 'Yes, Meera. Friction coefficient is 0.2 as mentioned.' }
    ]);
    const [solutionInput, setSolutionInput] = useState<{ [key: number]: string }>({});

    const handleAddLink = () => {
        // Logic to add link would go here
        alert('Add Link functionality would open a modal here.');
    };

    const handleUpload = () => {
        // Logic to upload file would go here
        alert('File Upload functionality would open file picker here.');
    };

    const handleSolveDoubt = (id: number) => {
        const solution = solutionInput[id];
        if (!solution) return;

        setDoubts(doubts.map(d => d.id === id ? { ...d, status: 'solved', solution } : d));
        setSolutionInput(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    return (
        <div className="w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Learning Resources</h1>
                <p className="text-slate-500 dark:text-slate-400">Share resources and resolve student doubts.</p>
            </div>

            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
                <TabsList className="mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <TabsTrigger value="resources" className="rounded-lg px-8 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">
                        Study Resources
                    </TabsTrigger>
                    <TabsTrigger value="doubts" className="rounded-lg px-8 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">
                        Student Doubts
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="resources" className="space-y-8 mt-0">
                    {/* Add Resource Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-dashed border-2 hover:border-cyan-500 dark:hover:border-cyan-700 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 transition-all cursor-pointer group" onClick={handleUpload}>
                            <CardContent className="flex flex-col items-center justify-center p-8">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 rounded-full flex items-center justify-center mb-4 transition-colors">
                                    <Upload size={24} />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Upload PDF / File</h3>
                                <p className="text-sm text-slate-500 mt-1">Drag & drop or Click to browse</p>
                            </CardContent>
                        </Card>

                        <Card className="border-dashed border-2 hover:border-red-500 dark:hover:border-red-700 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all cursor-pointer group" onClick={handleAddLink}>
                            <CardContent className="flex flex-col items-center justify-center p-8">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 rounded-full flex items-center justify-center mb-4 transition-colors">
                                    <Youtube size={24} />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Add YouTube Link</h3>
                                <p className="text-sm text-slate-500 mt-1">Share lecture videos or playlists</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resources List */}
                    <div>
                        <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">Shared Materials</h2>
                        <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {resources.map((resource) => (
                                    <div key={resource.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${resource.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-red-100 text-red-600'}`}>
                                                {resource.type === 'pdf' ? <FileText size={20} /> : <Youtube size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-slate-100">{resource.title}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                                    <span>{resource.date}</span>
                                                    {resource.size && <span>• {resource.size}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 transition-colors">
                                            <X size={18} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="doubts" className="space-y-6 mt-0">
                    {doubts.map((doubt) => (
                        <Card key={doubt.id} className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold">
                                            {doubt.student[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-slate-100">{doubt.student}</div>
                                            <div className="text-xs text-slate-500">{doubt.date}</div>
                                        </div>
                                    </div>
                                    <Badge variant={doubt.status === 'solved' ? 'default' : 'secondary'} className={doubt.status === 'solved' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 border-0' : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 border-0'}>
                                        {doubt.status === 'solved' ? 'Solved' : 'Pending'}
                                    </Badge>
                                </div>

                                <div className="pl-13 ml-12 mb-6">
                                    <p className="text-slate-800 dark:text-slate-200 font-medium text-lg leading-relaxed">
                                        "{doubt.question}"
                                    </p>
                                </div>

                                {doubt.status === 'solved' ? (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl ml-12 border border-slate-100 dark:border-slate-700 flex items-start gap-3">
                                        <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full flex items-center justify-center shrink-0">
                                            <MessageCircle size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Your Solution</div>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm">{doubt.solution}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="ml-12 relative group">
                                        <textarea
                                            value={solutionInput[doubt.id] || ''}
                                            onChange={(e) => setSolutionInput({ ...solutionInput, [doubt.id]: e.target.value })}
                                            placeholder="Type your solution here..."
                                            className="min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 resize-none pr-12"
                                            rows={3}
                                        />
                                        <Button
                                            size="icon"
                                            onClick={() => handleSolveDoubt(doubt.id)}
                                            disabled={!solutionInput[doubt.id]}
                                            className="absolute bottom-3 right-3 h-8 w-8 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all shadow-md disabled:opacity-0 group-hover:opacity-100 opacity-100 md:opacity-0"
                                        >
                                            <Send size={14} />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
