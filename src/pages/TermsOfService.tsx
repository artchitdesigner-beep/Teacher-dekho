import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-8">Terms of Service</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>Please read these Terms of Service carefully before using the TeacherDekho platform operated by us.</p>
                    {/* Add more content as needed */}
                </div>
            </div>
            <Footer />
        </div>
    );
}
