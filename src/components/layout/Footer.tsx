import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import logoWithBackground from '@/assets/logo.svg';

export default function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logoWithBackground} alt="TeacherDekho" className="h-8 w-auto rounded-md" />
                            <span className="font-bold text-xl font-serif text-slate-900 dark:text-slate-100">TeacherDekho</span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Connecting ambitious students with expert teachers for personalized 1-on-1 learning. Your journey to excellence starts here.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-200 transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-200 transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-200 transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-200 transition-all">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm transition-colors">Home</Link></li>
                            <li><Link to="/about-us" className="text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm transition-colors">About Us</Link></li>
                            <li><Link to="/how-it-works" className="text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm transition-colors">How It Works</Link></li>
                            <li><Link to="/become-tutor" className="text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm transition-colors">Become a Teacher</Link></li>
                            <li><Link to="/faqs" className="text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Services</h3>
                        <ul className="space-y-4">
                            <li><Link to="/search" className="text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm transition-colors">Find Tutors</Link></li>
                            <li><Link to="/search?tab=batches" className="text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm transition-colors">Batches</Link></li>
                            <li><Link to="/corporate" className="text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm transition-colors">Corporate Training</Link></li>
                            <li><Link to="/student/resources" className="text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm transition-colors">Resources</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400 text-sm">
                                <MapPin size={18} className="text-cyan-700 shrink-0 mt-0.5" />
                                <span>123 Education Lane, Tech Park,<br />New Delhi, India 110001</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                                <Phone size={18} className="text-cyan-700 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                                <Mail size={18} className="text-cyan-700 shrink-0" />
                                <span>support@teacherdekho.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-400 text-xs">© 2024 TeacherDekho. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-slate-400 hover:text-cyan-700 text-xs transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-slate-400 hover:text-cyan-700 text-xs transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
