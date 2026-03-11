import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BatchCardSmall from '@/components/batches/BatchCardSmall';
import { useState, useEffect } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export default function FeaturedBatches() {
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const q = query(collection(db, 'batches'), limit(4));
                const snap = await getDocs(q);
                const batchesData = snap.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        // Convert Timestamp to string if needed
                        startDate: data.startDate?.toDate ? data.startDate.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : data.startDate
                    };
                });
                setBatches(batchesData);
            } catch (error) {
                console.error('Error fetching featured batches:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
    }, []);

    return (
        <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-2xl md:text-[28px] font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">
                        Recently Added <span className="text-cyan-600">Batches</span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Join top-rated batches for structured learning.</p>
                </div>
                <Button variant="link" asChild className="text-cyan-700 font-bold text-sm p-0 h-auto">
                    <Link to="/student/search?tab=batches" className="flex items-center gap-1 group">
                        View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    [1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-[320px] bg-slate-100 dark:bg-slate-900 rounded-[24px] animate-pulse border border-slate-200 dark:border-slate-800" />
                    ))
                ) : batches.length > 0 ? (
                    batches.map((batch) => (
                        <div key={batch.id} className="h-full">
                            <BatchCardSmall batch={batch} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border border-dashed border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No featured batches available at the moment.</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Check back later for new courses.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
