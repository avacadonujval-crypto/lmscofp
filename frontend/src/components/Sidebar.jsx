import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    Video,
    Users,
    User,
    UserCircle,
    LogOut,
    Asterisk,
    Settings,
    Network,
    Home,
    Menu,
    X
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    const adminLinks = [
        { path: '/admin-dashboard', label: 'Dashboard', icon: <Home size={20} /> },
        { path: '/admin-meetings', label: 'Scheduled Meetings', icon: <Calendar size={20} /> },
        { path: '/admin-knowledge', label: 'Knowledge Materials', icon: <BookOpen size={20} /> },
        { path: '/admin-videos', label: 'Recorded Videos', icon: <Video size={20} /> },
        { path: '/admin-groups', label: 'Groups', icon: <Network size={20} /> },
        { path: '/admin-members', label: 'Membership', icon: <Users size={20} /> },
        { path: '/admin-system-users', label: 'User Accounts', icon: <UserCircle size={20} /> },
        { path: '/admin-settings', label: 'Settings', icon: <Settings size={20} /> },
        { path: '/profile', label: 'Profile', icon: <User size={20} /> },
    ];

    const studentLinks = [
        { path: '/user-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/user-meetings', label: 'Scheduled Meetings', icon: <Video size={20} /> },
        { path: '/courses', label: 'Knowledge Materials', icon: <BookOpen size={20} /> },
        { path: '/progress', label: 'Recorded Videos', icon: <Calendar size={20} /> },
        { path: '/profile', label: 'Profile', icon: <UserCircle size={20} /> },
    ];

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white z-40 px-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                    <div className="bg-[#0f172a] p-1.5 rounded-lg">
                        <Asterisk className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-widest text-gray-900">COFP</span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-700 hover:text-[#633418] transition-colors"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-gray-100 
                flex flex-col transition-transform duration-300 ease-in-out z-50
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                font-['Poppins'] shrink-0 shadow-xl lg:shadow-none
            `}>
                {/* Logo Area */}
                <div className="p-6 mb-4 flex items-center justify-between lg:justify-start gap-2">
                    <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                        <div className="bg-[#0f172a] p-1.5 rounded-lg">
                            <Asterisk className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-widest text-gray-900 cursor-pointer">COFP</span>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                    {links.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.path}
                            onClick={() => setIsOpen(false)} // Close on mobile navigation
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-[#633418] text-white shadow-md'
                                    : 'text-gray-600 hover:bg-[#fff5f0] hover:text-[#633418]'
                                }`
                            }
                        >
                            <span className={({ isActive }) => isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#633418]'}>
                                {link.icon}
                            </span>
                            <span className="font-medium text-sm">{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
