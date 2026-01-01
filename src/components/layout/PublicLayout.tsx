import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import logoIndigo from '@/assets/Logo Indigo.svg';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-[#FDFCF8]">
            <Navbar />
            <main>
                <Outlet />
            </main>
            {/* Footer */}
            <footer className="bg-[#FDFCF8] border-t border-slate-200 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <img src={logoIndigo} alt="TeacherDekho" className="h-8 w-auto" />
                                <span className="font-bold text-xl font-serif text-slate-900">TeacherDekho</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Empowering the next generation of learners with expert guidance.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-indigo-600">Browse Teachers</a></li>
                                <li><a href="#" className="hover:text-indigo-600">How it Works</a></li>
                                <li><a href="#" className="hover:text-indigo-600">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
                                <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
                                <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-indigo-600">Privacy</a></li>
                                <li><a href="#" className="hover:text-indigo-600">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-slate-400 text-sm">
                        © 2024 TeacherDekho Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
