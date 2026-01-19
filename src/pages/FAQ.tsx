import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

export default function FAQ() {
    const faqs = [
        {
            question: "How do I book a class?",
            answer: "You can book a class by searching for a teacher, visiting their profile, and clicking on the 'Book Class' button. Select your preferred time slot and plan to proceed."
        },
        {
            question: "Is the demo class really free?",
            answer: "Yes! Most teachers on TeacherDekho offer a free 30-minute demo class so you can experience their teaching style before committing."
        },
        {
            question: "How does the payment work?",
            answer: "We support secure payments via UPI, Credit/Debit Cards, and Net Banking. You can pay per class or buy a monthly subscription for better rates."
        },
        {
            question: "Can I cancel a booked class?",
            answer: "Yes, you can cancel a class up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may incur a small fee."
        },
        {
            question: "How do I become a teacher?",
            answer: "Click on 'Become a Teacher' in the navigation menu, sign up, and complete your profile. Once verified, you can start accepting bookings."
        },
        {
            question: "What if I'm not satisfied with a teacher?",
            answer: "We have a satisfaction guarantee. If you're not happy with your first paid class, let us know within 24 hours and we'll refund your money or help you find a new teacher."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHero
                title="Frequently Asked Questions"
                description="Find answers to common questions about TeacherDekho."
            />

            <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-10">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HelpCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Still have questions?</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <button className="px-8 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-700/20">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 dark:border-slate-800 last:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
                <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">{question}</span>
                {isOpen ? (
                    <ChevronUp className="text-cyan-700 dark:text-cyan-400" size={20} />
                ) : (
                    <ChevronDown className="text-slate-400" size={20} />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}
