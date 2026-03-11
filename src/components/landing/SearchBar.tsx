import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Container from '@/components/ui/Container';

export default function SearchBar() {
    const popularTags = [
        { label: 'Physics', color: 'bg-[#22c55e] border-[#22c55e] text-white' },
        { label: 'Mathematics', color: 'bg-[#eab308] border-[#eab308] text-white' },
        { label: 'Thermodynamics', color: 'bg-[#0ea5e9] border-[#0ea5e9] text-white' },
        { label: 'Alok Sir', color: 'bg-white border-slate-200 text-slate-700' },
    ];

    return (
        <section className="relative w-full py-2 md:py-4 mb-4 md:mb-6 bg-transparent z-20">
            <Container>
                <div className="w-full max-w-[850px] mx-auto flex flex-col gap-[16px] md:gap-[20px] items-center relative z-20">
                    <div className="w-full bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-1.5 h-auto md:h-12 flex flex-col items-stretch md:flex-row md:items-center gap-2 border border-slate-100">
                        <div className="flex-1 flex items-center pl-3 pb-2 md:pb-0">
                            <Search className="text-slate-400 w-4 h-4 mr-2 shrink-0" />
                            <input
                                type="text"
                                placeholder="search for teacher or subject..."
                                className="w-full bg-transparent border-none outline-none text-sm text-slate-600 placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <Button className="bg-[#0088cc] hover:bg-[#0077b3] text-white px-8 h-9 rounded-lg font-bold text-sm shadow-sm transition-all active:scale-95 border-none w-full md:w-auto shrink-0">
                            Search
                        </Button>
                    </div>

                    {/* Popular Tags matching Figma SS */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-[12px] md:gap-[16px] w-full px-4">
                        <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold text-[13px] shrink-0">
                            <span className="text-slate-400 text-sm">✨</span>
                            <span>Popular:</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            {popularTags.map((tag) => (
                                <Badge
                                    key={tag.label}
                                    variant="outline"
                                    className={cn(
                                        "rounded-full px-3.5 py-1 text-[12px] font-bold cursor-pointer transition-all hover:scale-105 shadow-sm border-2",
                                        tag.color
                                    )}
                                >
                                    {tag.label}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
