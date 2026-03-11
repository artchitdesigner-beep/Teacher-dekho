const fs = require('fs');
const content = `import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function Container({ children, className }: ContainerProps) {
    return (
        <div className={cn("w-full max-w-[1440px] mx-auto px-6 lg:px-[140px]", className)}>
            {children}
        </div>
    );
}`;
fs.writeFileSync('src/components/ui/Container.tsx', content, 'utf8');
