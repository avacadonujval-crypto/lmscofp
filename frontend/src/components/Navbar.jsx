import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, Asterisk, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 font-['Poppins']">
            <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                    <div className="bg-[#0f172a] p-1.5 rounded-lg group-hover:bg-[#633418] transition-colors duration-300">
                        <Asterisk className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-widest text-[#0f172a]">COFP</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-700 hover:text-[#633418] transition-colors"
                    onClick={toggleMenu}
                    aria-label="Toggle Navigation"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <span className="text-gray-500 font-medium">Hello, <span className="text-[#0f172a] font-bold">{user.name}</span></span>

                            {user.role === 'admin' && (
                                <Link to="/admin-dashboard" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0f172a] hover:bg-[#633418] transition-all">
                                    Admin Dashboard
                                </Link>
                            )}
                            {user.role === 'student' && (
                                <Link to="/user-dashboard" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0f172a] hover:bg-[#633418] transition-all">
                                    My Dashboard
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-[#633418] font-medium transition-colors">Login</Link>
                            <Link
                                to="/signup"
                                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-[#0f172a] hover:bg-[#633418] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {user ? (
                        <>
                            <div className="px-2 py-2 border-b border-gray-100">
                                <span className="text-gray-500 font-medium block text-sm">Signed in as</span>
                                <span className="text-[#0f172a] font-bold text-lg">{user.name}</span>
                            </div>

                            {user.role === 'admin' && (
                                <Link
                                    to="/admin-dashboard"
                                    onClick={closeMenu}
                                    className="px-4 py-3 rounded-lg text-sm font-semibold text-white bg-[#0f172a] hover:bg-[#633418] text-center"
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                            {user.role === 'student' && (
                                <Link
                                    to="/user-dashboard"
                                    onClick={closeMenu}
                                    className="px-4 py-3 rounded-lg text-sm font-semibold text-white bg-[#0f172a] hover:bg-[#633418] text-center"
                                >
                                    My Dashboard
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="text-gray-600 hover:text-[#633418] font-medium text-center py-2 hover:bg-gray-50 rounded-lg"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={closeMenu}
                                className="px-6 py-3 rounded-lg text-sm font-bold text-center text-white bg-[#0f172a] hover:bg-[#633418] shadow-md"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
