import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { FilterBox } from './FilterBox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    return (
        <div className={`relative ${className}`}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div>
                        <FilterBox
                            label={label}
                            value={value}
                            icon={icon}
                            active={selectedValue !== '' && selectedValue !== 'All' && selectedValue !== '0' && selectedValue !== 'all' && selectedValue !== 'any'}
                        />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                    <div className="max-h-64 overflow-y-auto">
                        {options.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => onChange(option.value)}
                                className={option.value === selectedValue ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 font-medium" : ""}
                            >
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
