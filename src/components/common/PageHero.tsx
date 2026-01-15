import type { ReactNode } from 'react';
import GridBackground from '@/components/landing/GridBackground';

interface PageHeroProps {
    title: string;
    description?: string;
    children?: ReactNode;
    className?: string;
}

export default function PageHero({ title, description, children, className = '' }: PageHeroProps) {
    return (
        <div className={`bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-cyan-200 dark:shadow-none relative text-center ${className}`}>
            {/* Grid Background */}
            <div className="absolute inset-0">
                <GridBackground
                    lineColor={[255, 255, 255]}
                    dotColor={[255, 255, 255]}
                    blockColor={[255, 255, 255]}
                    maxOpacity={0.15}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight drop-shadow-md mb-4">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-cyan-100 text-lg md:text-xl max-w-2xl mx-auto">
                            {description}
                        </p>
                    )}
                </div>

                {children && (
                    <div className="mt-8">
                        {children}
                    </div>
                )}
            </div>

            {/* Decorative Elements (Subtle Glows) */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        </div>
    );
}
