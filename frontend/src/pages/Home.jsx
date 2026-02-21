import { Link } from 'react-router-dom';
import { ArrowRight, Video, Users, BookOpen, ShieldCheck } from 'lucide-react';

const Home = () => {
    return (
        <div className="font-['Poppins']">
            {/* Hero Section */}
            <header className="relative bg-[#0f172a] text-white overflow-hidden pt-20 pb-32">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur text-sm font-medium text-blue-400">
                        🚀 The Future of Council Learning
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Empowering Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#bfa15f]">Council Workspace.</span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Access exclusive resources, schedule high-priority meetings, and connect with fellow members in one unified, secure platform designed for excellence.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="px-8 py-4 rounded-full bg-[#633418] text-white font-bold text-lg hover:bg-[#4a2612] transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
                        >
                            Get Started Now <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 rounded-full bg-white/10 text-white border border-white/20 font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm"
                        >
                            Member Login
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#633418]/10 rounded-full blur-[120px]"></div>
                </div>
            </header>

            {/* Features Staggered Grid */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Why Choose COFP?</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">We provide the tools you need to succeed in your council duties with efficiency and style.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Knowledge Hub</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Curated materials, documents, and archives available 24/7 for all council members.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-[#fff5f0] rounded-xl flex items-center justify-center mb-6 text-[#633418] group-hover:bg-[#633418] group-hover:text-white transition-colors">
                                <Video size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Live Sessions</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Join secure, high-quality video meetings and webinars directly from your dashboard.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Secure Access</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Role-based permissions ensure that sensitive council data remains protected.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                        <div>
                            <div className="text-4xl font-bold text-[#0f172a] mb-2">2.5k+</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Active Members</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-[#633418] mb-2">150+</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Courses</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Live Sessions</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Uptime</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0f172a] text-gray-400 py-12 border-t border-gray-800">
                <div className="container mx-auto px-6 text-center">
                    <p className="mb-4 text-white font-semibold">© 2026 COFP Council Portal. All rights reserved.</p>
                    <div className="flex justify-center gap-6 text-sm">
                        <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition">Terms of Service</Link>
                        <Link to="#" className="hover:text-white transition">Contact Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
