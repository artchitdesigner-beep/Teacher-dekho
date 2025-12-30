import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { X, Loader2, Calendar } from 'lucide-react';

interface Teacher {
    uid: string;
    name: string;
    subject: string;
    hourlyRate: number;
}

interface BookingModalProps {
    teacher: Teacher;
    studentId: string;
    studentName: string;
    onClose: () => void;
    onSuccess: () => void;
    initialDate?: string;
    initialTime?: string;
}

export default function BookingModal({
    teacher,
    studentId,
    studentName,
    onClose,
    onSuccess,
    initialDate = '',
    initialTime = ''
}: BookingModalProps) {
    const [loading, setLoading] = useState(false);
    // Removed unused step state

    const [formData, setFormData] = useState({
        topic: '',
        date: initialDate,
        time: initialTime,
        description: '',
    });
    const [members, setMembers] = useState([{ name: '', phone: '' }]);

    const addMember = () => {
        setMembers([...members, { name: '', phone: '' }]);
    };

    const removeMember = (index: number) => {
        if (members.length > 1) {
            const newMembers = members.filter((_, i) => i !== index);
            setMembers(newMembers);
        } else {
            // If it's the last one, just clear it
            setMembers([{ name: '', phone: '' }]);
        }
    };

    const updateMember = (index: number, field: 'name' | 'phone', value: string) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine date and time
            const scheduledAt = new Date(`${formData.date}T${formData.time}`);

            const bookingData = {
                teacherId: teacher.uid || (teacher as any).id,
                studentId: studentId,
                studentName: studentName,
                topic: formData.topic,
                description: formData.description,
                scheduledAt: Timestamp.fromDate(scheduledAt),
                status: 'pending',
                isDemo: true, // First class is demo
                members: members.filter(m => m.name || m.phone),
                teacherRemarks: '',
                paymentStatus: 'pending',
                createdAt: Timestamp.now()
            };

            console.log('Creating booking with data:', bookingData);
            const docRef = await addDoc(collection(db, 'bookings'), bookingData);
            console.log('Booking created successfully with ID:', docRef.id);

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to book class. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">Book Demo Class</h3>
                        <p className="text-sm text-slate-500">with {teacher.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Topic to Study</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Thermodynamics, Calculus..."
                                value={formData.topic}
                                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} className="text-indigo-600" />
                                    Select Date & Available Slot
                                </label>
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                    <input
                                        required
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition mb-4"
                                    />

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'].map(slot => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, time: slot })}
                                                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${formData.time === slot
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                            <textarea
                                placeholder="Any specific requirements or topics you want to focus on?"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700">Add Members (Optional)</label>
                            {members.map((member, index) => (
                                <div key={index} className="relative group p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={member.name}
                                            onChange={e => updateMember(index, 'name', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            value={member.phone}
                                            onChange={e => updateMember(index, 'phone', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeMember(index)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                        title="Remove member"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addMember}
                                className="text-sm text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1"
                            >
                                + Add another member
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-xl flex items-start gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <div className="font-bold text-indigo-900 text-sm">Pay after the 1st class</div>
                            <div className="text-indigo-700 text-xs mt-0.5">
                                The first session is a trial. You only pay if you're satisfied.
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
