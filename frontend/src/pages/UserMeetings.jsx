import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import API_BASE_URL from '../config/api';
import { Video, Clock, Users, Search } from 'lucide-react';

const UserMeetings = () => {
    const { user } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [memberSearch, setMemberSearch] = useState('');

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/api/meetings`, config);
            setMeetings(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenMembers = (meeting) => {
        setSelectedMeeting(meeting);
        setShowModal(true);
        setMemberSearch('');
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return {
            month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
            day: d.getDate(),
            time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const filteredMembers = selectedMeeting?.members?.filter(m =>
        m.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.email?.toLowerCase().includes(memberSearch.toLowerCase())
    ) || [];

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-white text-gray-800 relative">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 overflow-auto pt-20 lg:pt-8 bg-[#FAFAFA]">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Scheduled Meetings</h1>
                    <p className="text-gray-500 text-sm mt-1">You will see only the meetings you are invited to for the last 30 days.</p>
                </div>

                <div className="space-y-4 max-w-5xl">
                    {meetings.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium italic">No meetings scheduled for you.</p>
                        </div>
                    ) : meetings.map((m) => {
                        const { month, day, time } = formatDate(m.date);
                        return (
                            <div key={m.id || m._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 relative group hover:shadow-md transition">
                                <div className="w-16 h-16 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-gray-100 shrink-0">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{month}</span>
                                    <span className="text-2xl font-bold text-gray-900">{day}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#633418] transition">{m.title}</h3>
                                    <p className="text-[10px] font-bold text-[#633418] uppercase tracking-widest mt-0.5">Council Session</p>
                                    <div className="flex items-center gap-6 mt-4 text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="opacity-60" />
                                            <span className="text-[11px] font-bold uppercase tracking-tight">{time}</span>
                                        </div>
                                        <button
                                            onClick={() => handleOpenMembers(m)}
                                            className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded transition"
                                        >
                                            <Users size={16} className="text-gray-400" />
                                            <span className="text-[11px] font-bold text-[#633418] uppercase">{m.members?.length || 0} Members</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="shrink-0 w-full md:w-auto">
                                    {(() => {
                                        const now = new Date();
                                        const meetDate = new Date(m.date);
                                        const twoHoursLater = new Date(meetDate.getTime() + 2 * 60 * 60 * 1000);

                                        if (now >= meetDate && now <= twoHoursLater) {
                                            return (
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full animate-pulse border border-red-100 uppercase tracking-tighter">
                                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span> Live Now
                                                    </span>
                                                    <a href={`/live/${m.link}`} className="bg-[#633418] text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-[#4a2612] shadow-md transition w-full md:w-auto text-center">
                                                        Join Meeting
                                                    </a>
                                                </div>
                                            );
                                        } else if (now < meetDate) {
                                            return (
                                                <a href={`/live/${m.link}`} className="bg-[#633418] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#4a2612] shadow-md transition w-full md:w-auto text-center">
                                                    Join Meeting
                                                </a>
                                            );
                                        } else {
                                            return <span className="px-4 py-1.5 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">Finished</span>;
                                        }
                                    })()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-center gap-8 mt-12">
                    <button className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-400 cursor-not-allowed bg-white">Previous</button>
                    <span className="text-sm font-bold text-gray-900 tracking-wide">Page 1 of 1</span>
                    <button className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-400 cursor-not-allowed bg-white">Next</button>
                </div>
            </div>

            {/* Members Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 pb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                Members of {selectedMeeting?.title} <span className="text-gray-400 font-medium text-sm ml-1">({selectedMeeting?.members?.length || 0} total)</span>
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="px-6 mb-6">
                            <div className="relative flex items-center">
                                <Search size={18} className="absolute left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Members List */}
                        <div className="px-6 pb-6 max-h-[300px] overflow-y-auto">
                            <div className="space-y-1 border border-gray-100 rounded-xl overflow-hidden">
                                {filteredMembers.length > 0 ? filteredMembers.map((member, i) => (
                                    <div key={member.id} className={`flex items-center gap-4 p-4 ${i !== filteredMembers.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition`}>
                                        <div className="w-10 h-10 rounded-full bg-[#8a6d4b] flex items-center justify-center text-white font-bold text-sm">
                                            {member.name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{member.email}</span>
                                    </div>
                                )) : (
                                    <div className="p-10 text-center text-gray-400 italic text-sm">
                                        No matching members found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-100 transition shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMeetings;
