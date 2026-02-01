export interface Plan {
    id: string;
    name: string;
    classesPerWeek: number;
    priceMonthly: number;
    priceFull: number;
    features?: string[];
    popular?: boolean;
    type?: 'selection' | 'fixed';
    options?: { label: string; days: string[] }[];
    days?: string[];
}

export const PLANS: Plan[] = [
    {
        id: 'silver',
        name: 'Silver',
        classesPerWeek: 3,
        priceMonthly: 2000,
        priceFull: 10000,
        type: 'selection',
        options: [
            { label: 'MWF', days: ['Mon', 'Wed', 'Fri'] },
            { label: 'TTS', days: ['Tue', 'Thu', 'Sat'] }
        ],
        features: ['3 classes/week', 'Basic doubts support', 'Standard notes']
    },
    {
        id: 'gold',
        name: 'Gold',
        classesPerWeek: 6,
        priceMonthly: 3500,
        priceFull: 18000,
        type: 'fixed',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        popular: true,
        features: ['6 classes/week', 'Priority doubts support', 'Premium notes', 'Weekly tests']
    },
    {
        id: 'platinum',
        name: 'Platinum',
        classesPerWeek: 7,
        priceMonthly: 5000,
        priceFull: 25000,
        type: 'fixed',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        features: ['7 classes/week', '24/7 doubts support', 'All study material', '1-on-1 mentorship']
    }
];

export const getMinMonthlyRate = () => {
    return PLANS.find(p => p.id === 'silver')?.priceMonthly || 2000;
};
