import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import API_BASE_URL from '../config/api';
import { Users, Clock, Coffee, Bell, UserCircle, ArrowUpRight, Calendar, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalMeetings: 0,
        newMembers: 0,
        upcomingMeetings: []
    });
    const [loading, setLoading] = useState(true);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (user) {
            fetchStats();
        }
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [user]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/api/admin/stats`, config);
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    // Format time for the clock card
    const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-white text-gray-800">
            <Sidebar />

            <div className="flex-1 p-4 md:p-8 overflow-auto pt-20 lg:pt-8 bg-[#FAFAFA]">
                {/* Top Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                            <Bell size={20} />
                        </button>
                        <button onClick={() => navigate('/profile')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                            <UserCircle size={24} />
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Card 1: Total Members */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm text-gray-500 font-medium">Total Members</p>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Users size={18} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers || '0'}</h3>
                        <div className="flex items-center text-xs font-medium text-green-500">
                            <ArrowUpRight size={14} className="mr-1" />
                            <span>5.2%</span>
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </div>
                    </div>

                    {/* Card 2: Avg Time Spent (Mock) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm text-gray-500 font-medium">Avg. Time Spent</p>
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Clock size={18} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">45m 20s</h3>
                        <div className="flex items-center text-xs font-medium text-green-500">
                            <ArrowUpRight size={14} className="mr-1" />
                            <span>12%</span>
                            <span className="text-gray-400 ml-1">vs last week</span>
                        </div>
                    </div>

                    {/* Card 3: New Members (Real Data) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm text-gray-500 font-medium">New Members</p>
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <Users size={18} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.newMembers || '0'}</h3>
                        <div className="flex items-center text-xs font-medium text-gray-500">
                            <span>Last 30 days</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Schedule Meeting Card */}
                    <div className="min-h-[200px] relative bg-[#633418] rounded-2xl p-8 overflow-hidden flex flex-col justify-between text-white shadow-lg group hover:shadow-xl transition-all">
                        <div className="z-10">
                            <h3 className="text-2xl font-bold mb-2">Schedule Meeting</h3>
                            <p className="text-white/80 text-sm">Plan your upcoming council sessions.</p>
                        </div>

                        <button
                            onClick={() => navigate('/admin-meetings')}
                            className="w-fit bg-white text-[#633418] px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition z-10"
                        >
                            Create New +
                        </button>

                        {/* Background Decor */}
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                            <Clock size={200} />
                        </div>
                    </div>

                    {/* Upcoming Meetings Widget */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 overflow-auto min-h-[250px] max-h-[350px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Calendar size={20} className="text-blue-600" />
                                Upcoming Meetings
                            </h3>
                        </div>

                        {stats.upcomingMeetings && stats.upcomingMeetings.length > 0 ? (
                            <div className="space-y-3">
                                {stats.upcomingMeetings.map((meeting) => (
                                    <div
                                        key={meeting.id}
                                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                        onClick={() => navigate(`/live/${meeting.link}`)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm text-gray-900 mb-1">{meeting.title}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(meeting.date).toLocaleDateString([], {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                {meeting.memberCount > 0 && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {meeting.memberCount} participant{meeting.memberCount !== 1 ? 's' : ''}
                                                    </p>
                                                )}
                                            </div>
                                            <Video size={16} className="text-blue-600 mt-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                                <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-400">
                                    <Coffee size={24} />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1 text-sm">No upcoming meetings</h4>
                                <p className="text-gray-400 text-xs">You're all caught up!</p>
                            </div>
                        )}
                    </div>

                    {/* Clock Widget */}
                    <div className="bg-[#1e1e1e] rounded-2xl p-8 flex flex-col justify-center text-white relative overflow-hidden shadow-lg min-h-[200px]">
                        <div className="z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">{timeString}</h2>
                            <p className="text-gray-400">{dateString}</p>
                        </div>
                        {/* Background Decor */}
                        <div className="absolute right-4 bottom-4 opacity-20">
                            <Clock size={64} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
