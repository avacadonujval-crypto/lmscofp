import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import API_BASE_URL from '../config/api';
import {
    Search,
    Filter,
    PlayCircle,
    Clock,
    Calendar,
    Download,
    Trash2,
    Video as VideoIcon,
    ChevronDown,
    Loader2,
    X
} from 'lucide-react';

const RecordedVideos = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'admin';

    const [videos, setVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Fetch videos from the new dedicated endpoint
            const { data } = await axios.get(`${API_BASE_URL}/api/admin/videos`, config);
            setVideos(data);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };


    // Video Player State
    const [activePlayerVideo, setActivePlayerVideo] = useState(null);

    const filteredVideos = videos.filter(v =>
        (v.title || v?.Course?.title)?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-[#FAFAFA] text-gray-800">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto pt-20">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Recorded Videos</h1>
                        <p className="text-gray-500 mt-1 font-medium italic">Browse and manage past meeting recordings and webinars.</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold" />
                        <input
                            className="w-full pl-11 pr-4 py-3 bg-[#fcfcfc] border border-gray-100 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#cca466] focus:bg-white transition"
                            placeholder="Search by video title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-48">
                            <select className="w-full appearance-none pl-4 pr-10 py-3 bg-[#fcfcfc] border border-gray-100 rounded-xl text-xs font-bold text-gray-600 outline-none">
                                <option>All Categories</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative w-full md:w-48">
                            <select className="w-full appearance-none pl-4 pr-10 py-3 bg-[#fcfcfc] border border-gray-100 rounded-xl text-xs font-bold text-gray-600 outline-none">
                                <option>Sort by: Newest</option>
                                <option>Sort by: Oldest</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold" />
                        </div>
                    </div>
                </div>

                {/* Video Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64 text-gray-400 gap-3 font-bold">
                        <Loader2 className="animate-spin" /> Loading Library...
                    </div>
                ) : filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredVideos.map((video, i) => (
                            <div
                                key={i}
                                className="group cursor-pointer"
                                onClick={() => setActivePlayerVideo(video)}
                            >
                                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300">
                                    <div className="aspect-video bg-gray-900 relative flex items-center justify-center group-hover:bg-black transition-colors overflow-hidden">
                                        {video.status === 'Pending' || !video.url ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#2d3748] text-white">
                                                <VideoIcon size={48} className="text-[#cca466] mb-2 animate-pulse" />
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-[#cca466]">Processing Session...</span>
                                            </div>
                                        ) : video.url.startsWith('http') ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#2d3748] text-white">
                                                <VideoIcon size={48} className="opacity-20 mb-2" />
                                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">External Link</span>
                                            </div>
                                        ) : (
                                            <video
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                muted
                                                playsInline
                                                onMouseOver={e => e.target.play()}
                                                onMouseOut={e => {
                                                    e.target.pause();
                                                    e.target.currentTime = 0;
                                                }}
                                            >
                                                <source src={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}${video.url}`} />
                                            </video>
                                        )}

                                        {/* Overlay with Play Button */}
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 flex items-center justify-center transition duration-300 opacity-0 group-hover:opacity-100">
                                            <div className="w-14 h-14 bg-[#cca466] rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition duration-300 border-4 border-white/20">
                                                <PlayCircle size={32} className="text-white ml-1" />
                                            </div>
                                        </div>

                                        <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded">
                                            {video.status === 'Pending' || !video.url ? 'SAVE' : (video.duration || 'Session')}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-relaxed mb-4 group-hover:text-[#cca466] transition">
                                            {video.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="opacity-60" />
                                                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="px-2 py-0.5 bg-gray-50 rounded italic text-[9px]">
                                                {video?.Course?.title || 'Recorded'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] border-2 border-dashed border-gray-100 p-24 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <VideoIcon size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No recordings available</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto">Your live session recordings will appear here automatically after they are saved.</p>
                    </div>
                )}
            </div>

            {/* Premium Video Player Modal */}
            {activePlayerVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/80 animate-in fade-in duration-300">
                    <div className="absolute inset-0 cursor-pointer" onClick={() => setActivePlayerVideo(null)}></div>

                    <div className="w-full max-w-5xl bg-[#111] rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 relative z-10 flex flex-col animate-in zoom-in-95 duration-500">
                        {/* Player Header */}
                        <div className="p-8 flex justify-between items-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-[#cca466]/10 rounded-2xl border border-[#cca466]/20">
                                    <VideoIcon className="text-[#cca466]" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-1 text-white">{activePlayerVideo.title}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] uppercase tracking-widest font-black text-[#cca466] bg-[#cca466]/10 px-2.5 py-1 rounded-full border border-[#cca466]/20">
                                            {activePlayerVideo?.Course?.title || 'General Session'}
                                        </span>
                                        <span className="text-gray-500 text-xs font-medium">Recorded on {new Date(activePlayerVideo.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setActivePlayerVideo(null)}
                                className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:rotate-90 transition-all duration-300 text-white"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Video Container */}
                        <div className="relative aspect-video bg-black flex items-center justify-center">
                            {activePlayerVideo.status === 'Pending' || !activePlayerVideo.url ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white p-20 text-center">
                                    <div className="w-24 h-24 mb-8 bg-[#cca466]/10 rounded-full flex items-center justify-center animate-pulse border-2 border-[#cca466]/20">
                                        <VideoIcon size={48} className="text-[#cca466]" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">Processing Session</h3>
                                    <p className="text-gray-400 max-w-md text-lg leading-relaxed">This recording was just captured and is being finalized. It will be available for HD playback in a few moments.</p>
                                </div>
                            ) : activePlayerVideo.url.startsWith('http') ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white p-20 text-center">
                                    <PlayCircle size={80} className="text-[#cca466] mb-8 animate-pulse" />
                                    <h3 className="text-3xl font-bold mb-6">Open External Session</h3>
                                    <p className="text-gray-400 max-w-md mb-10 text-lg leading-relaxed">This recording is stored on an external secure platform. Click below to launch the dedicated player.</p>
                                    <a
                                        href={activePlayerVideo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#cca466] text-white px-10 py-5 rounded-[24px] font-black hover:bg-[#b8955c] hover:scale-105 transition-all duration-300 shadow-[0_20px_40px_rgba(204,164,102,0.3)] flex items-center gap-4 text-lg"
                                    >
                                        <PlayCircle size={24} /> Start Playback Now
                                    </a>
                                </div>
                            ) : (
                                <video
                                    autoPlay
                                    controls
                                    className="w-full h-full shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                    key={activePlayerVideo.url}
                                    playsInline
                                    poster={activePlayerVideo.thumbnail || ""}
                                >
                                    <source src={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}${activePlayerVideo.url}`} />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecordedVideos;
