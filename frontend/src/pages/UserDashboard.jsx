import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import Sidebar from '../components/Sidebar';
import { Video, Clock, Calendar, ChevronRight, PlayCircle } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [recentFiles, setRecentFiles] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin-dashboard');
        }
        fetchData();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [user, navigate]);

    const fetchData = async () => {
        if (!user) return;
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [meetingsRes, coursesRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/meetings`, config),
                axios.get(`${API_BASE_URL}/api/courses`, config)
            ]);

            setMeetings(meetingsRes.data);

            // Extract recent videos from courses
            const allVideos = [];
            coursesRes.data.forEach(course => {
                if (course.videos && Array.isArray(course.videos)) {
                    course.videos.forEach(v => {
                        allVideos.push({
                            ...v,
                            courseTitle: course.title,
                            updatedAt: course.updatedAt
                        });
                    });
                }
            });
            // Sort by date and take top 3
            const sortedVideos = allVideos.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3);
            setRecentFiles(sortedVideos);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    // Format time for the clock card
    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).toLowerCase();

    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });

    const upcomingCount = meetings.filter(m => new Date(m.date) > new Date()).length;

    return (
        <div className="flex min-h-screen bg-[#FAFAFA] font-['Poppins'] text-gray-800">
            <Sidebar />

            <div className="flex-1 p-4 md:p-10 overflow-auto pt-20 lg:pt-10">
                {/* Greeting */}
                <div className="mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                        Hello, {user?.name?.split(' ')[0] || 'User'} 👋
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">Welcome to your member portal.</p>
                </div>

                {/* Top Row Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {/* Membership Card */}
                    <div className="bg-gradient-to-br from-[#7B42BC] to-[#6332a8] rounded-[24px] p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-purple-200">
                        {/* Abstract circle decoration */}
                        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                        <span className="text-xs font-bold uppercase tracking-widest opacity-70">Current Membership</span>
                        <div className="flex items-center gap-3 mt-4 mb-6">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 fill-yellow-400">
                                    <path d="M6 9l6 1 6-1-4 11H10L6 9z"></path>
                                    <path d="M2 4l3 3 7-1 7 1 3-3"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold">{user?.plan || 'Premium'}</h2>
                        </div>
                        <p className="text-sm opacity-90 leading-relaxed max-w-[280px]">
                            Your membership is active and valid until {user?.endDate ? new Date(user.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Oct 2026'}. You have access to all council resources.
                        </p>
                    </div>

                    {/* Clock Card */}
                    <div className="bg-white rounded-[24px] p-6 md:p-8 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                            <Clock size={24} className="text-orange-500" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{formattedTime}</h2>
                        <p className="text-gray-400 font-medium">{formattedDate}</p>
                    </div>

                    {/* Events Card */}
                    <div className="bg-white rounded-[24px] p-8 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <Calendar size={24} className="text-blue-500" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-1">{upcomingCount}</h2>
                        <p className="text-gray-400 font-medium">Upcoming Events</p>
                    </div>
                </div>

                {/* Bottom Row Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Timeline section */}
                    <div className="lg:col-span-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Your Immediate Timeline</h3>
                        <div className="bg-white rounded-[24px] border border-gray-100 min-h-[160px] flex items-center justify-center p-8 text-gray-400">
                            {meetings.length === 0 ? (
                                <p className="font-medium">No upcoming meetings</p>
                            ) : (
                                <div className="w-full space-y-4">
                                    {meetings.map((m, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                    <Video size={18} className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{m.title}</p>
                                                    <p className="text-xs text-gray-500">{new Date(m.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                                </div>
                                            </div>
                                            <a href={m.link} target="_blank" rel="noreferrer" className="text-purple-600 font-bold text-sm hover:underline">Join Now</a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Files section */}
                    <div className="lg:col-span-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Files</h3>
                        <div className="space-y-4">
                            {recentFiles.length > 0 ? recentFiles.map((file, i) => (
                                <div key={i} className="bg-white rounded-[20px] p-5 flex items-center gap-4 border border-gray-50 group hover:shadow-md transition cursor-pointer">
                                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition">
                                        <PlayCircle size={22} className="text-purple-500" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1 leading-snug">{file.title || file.courseTitle}</h4>
                                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-medium">
                                            <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            Not watched
                                        </p>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition shrink-0" />
                                </div>
                            )) : (
                                <div className="bg-white rounded-[20px] p-8 border border-dashed border-gray-200 text-center text-gray-400 text-sm italic">
                                    No recent files available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
