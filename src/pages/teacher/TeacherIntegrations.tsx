import { useState } from 'react';
import { Upload, FileText, Youtube, MessageCircle, Send, X } from 'lucide-react';

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
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Learning Resources</h1>
                <p className="text-slate-500 dark:text-slate-400">Share resources and resolve student doubts.</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === 'resources' ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Study Resources
                    {activeTab === 'resources' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-700 dark:bg-cyan-400 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('doubts')}
                    className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === 'doubts' ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Student Doubts
                    {activeTab === 'doubts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-700 dark:bg-cyan-400 rounded-t-full"></div>}
                </button>
            </div>

            {activeTab === 'resources' ? (
                <div className="space-y-8">
                    {/* Add Resource Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={handleUpload}
                            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 rounded-full flex items-center justify-center mb-4 transition-colors">
                                <Upload size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Upload PDF / File</h3>
                            <p className="text-sm text-slate-500 mt-1">Drag & drop or Click to browse</p>
                        </button>

                        <button
                            onClick={handleAddLink}
                            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 rounded-full flex items-center justify-center mb-4 transition-colors">
                                <Youtube size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Add YouTube Link</h3>
                            <p className="text-sm text-slate-500 mt-1">Share lecture videos or playlists</p>
                        </button>
                    </div>

                    {/* Resources List */}
                    <div>
                        <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">Shared Materials</h2>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
                            {resources.map((resource) => (
                                <div key={resource.id} className="p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
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
                                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {doubts.map((doubt) => (
                        <div key={doubt.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">
                                        {doubt.student[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-slate-100">{doubt.student}</div>
                                        <div className="text-xs text-slate-500">{doubt.date}</div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${doubt.status === 'solved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                    {doubt.status === 'solved' ? 'Solved' : 'Pending'}
                                </span>
                            </div>

                            <div className="pl-13 ml-13 mb-6">
                                <p className="text-slate-800 dark:text-slate-200 font-medium text-lg leading-relaxed">
                                    "{doubt.question}"
                                </p>
                            </div>

                            {doubt.status === 'solved' ? (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl ml-13 border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full flex items-center justify-center">
                                            <MessageCircle size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Your Solution</div>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm">{doubt.solution}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="ml-13 relative">
                                    <textarea
                                        value={solutionInput[doubt.id] || ''}
                                        onChange={(e) => setSolutionInput({ ...solutionInput, [doubt.id]: e.target.value })}
                                        placeholder="Type your solution here..."
                                        className="w-full p-4 pr-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm resize-none"
                                        rows={3}
                                    />
                                    <button
                                        onClick={() => handleSolveDoubt(doubt.id)}
                                        disabled={!solutionInput[doubt.id]}
                                        className="absolute bottom-3 right-3 p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
