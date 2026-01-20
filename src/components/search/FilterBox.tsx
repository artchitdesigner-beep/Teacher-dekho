import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FilterBoxProps {
    label: string;
    value: string;
    icon?: LucideIcon;
    onClick?: () => void;
    active?: boolean;
    className?: string;
}

export const FilterBox: React.FC<FilterBoxProps> = ({
    label,
    value,
    icon: Icon,
    onClick,
    active = false,
    className = '',
}) => {
    return (
        <button
            onClick={onClick}
            className={`
        w-full flex items-center justify-between gap-3 
        px-4 py-3 bg-white dark:bg-slate-800 
        border rounded-xl transition-all duration-200
        text-left min-w-[135px]
        ${active
                    ? 'border-cyan-500 ring-1 ring-cyan-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 hover:border-cyan-300 hover:shadow-sm'
                }
        ${className}
      `}
        >
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className={`
            p-2 rounded-lg 
            ${active ? 'bg-cyan-50 text-cyan-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
          `}>
                        <Icon size={18} />
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {label}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                        {value}
                    </span>
                </div>
            </div>
            <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${active ? 'rotate-180' : ''}`}
            />
        </button>
    );
};
