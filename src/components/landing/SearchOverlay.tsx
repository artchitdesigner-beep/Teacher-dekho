import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    const suggestions = [
        { text: 'Physics for Class 12', type: 'Batch' },
        { text: 'Alok Sir', type: 'Teacher' },
        { text: 'Mathematics Crash Course', type: 'Batch' },
        { text: 'Organic Chemistry', type: 'Subject' },
        { text: 'Biology NEET Prep', type: 'Batch' },
        { text: 'Computer Science', type: 'Subject' },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 animate-in fade-in duration-200">
            <div className="max-w-3xl mx-auto px-4 pt-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={24} className="text-slate-500" />
                    </button>
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for teachers, batches, or subjects..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl border-none outline-none text-lg font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20"
                        />
                    </form>
                </div>

                {/* Content */}
                <div className="space-y-8 px-2">
                    {/* Recent/Popular */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Popular Searches</h3>
                        <div className="space-y-2">
                            {suggestions.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        navigate(`/search?q=${encodeURIComponent(item.text)}`);
                                        onClose();
                                    }}
                                    className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl group transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-600 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20 transition-colors">
                                            <TrendingUp size={16} />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-cyan-700 dark:group-hover:text-cyan-400">
                                            {item.text}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                                        {item.type}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
