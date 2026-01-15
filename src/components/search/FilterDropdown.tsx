import React, { useState, useRef, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { FilterBox } from './FilterBox';

interface Option {
    label: string;
    value: string;
}

interface FilterDropdownProps {
    label: string;
    value: string; // The display value (e.g., "All Subjects")
    selectedValue: string; // The actual selected value (e.g., "All")
    icon: LucideIcon;
    options: Option[];
    onChange: (value: string) => void;
    className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label,
    value,
    selectedValue,
    icon,
    options,
    onChange,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <FilterBox
                label={label}
                value={value}
                icon={icon}
                active={isOpen || (selectedValue !== '' && selectedValue !== 'All' && selectedValue !== '0')}
                onClick={() => setIsOpen(!isOpen)}
            />

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-64 overflow-y-auto py-2">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                  w-full text-left px-4 py-3 text-sm transition-colors
                  ${option.value === selectedValue
                                        ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 font-medium'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }
                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
