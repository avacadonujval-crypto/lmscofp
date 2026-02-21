import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import API_BASE_URL from '../config/api';
import { Search, BookOpen, Clock, Video, FileText, ChevronRight } from 'lucide-react';

const CourseCatalog = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Videos');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`${API_BASE_URL}/api/courses`, config);
            setCourses(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error("Fetch Error:", error);
            setLoading(false);
        }
    };

    const [activePlayerVideo, setActivePlayerVideo] = useState(null);

    // Extract all videos from all courses (Supporting both old JSON and new Relational)
    const allVideos = [];
    courses.forEach(course => {
        const courseVideos = course.videos || [];
        courseVideos.forEach(v => {
            allVideos.push({
                ...v,
                courseTitle: course.title,
                createdAt: v.createdAt || course.createdAt,
                thumbnail: course.thumbnail,
                id: v.id,
                type: 'video'
            });
        });
    });

    // Extract all documents from all courses
    const allDocuments = [];
    courses.forEach(course => {
        const courseMaterials = course.materials || [];
        courseMaterials.forEach(m => {
            allDocuments.push({
                ...m,
                courseTitle: course.title,
                createdAt: m.createdAt || course.createdAt,
                id: m.id,
                type: 'document'
            });
        });
    });

    const activeItems = activeTab === 'Videos' ? allVideos : allDocuments;

    const filteredItems = activeItems.filter(item =>
        (item.title || item.name || item.courseTitle)?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-white text-gray-800">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 overflow-auto pt-20 lg:pt-8 bg-[#FAFAFA]">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
                        <p className="text-gray-500 mt-1">Access recorded sessions and council documents.</p>
                    </div>
                    <div className="relative w-full lg:max-w-md">
                        <input
                            className="w-full h-12 pl-4 pr-14 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#9c7b4f] bg-white text-sm shadow-sm transition-all"
                            placeholder="Search by file name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-[#8a6d4b] text-white flex items-center justify-center rounded-lg hover:bg-[#725a3d] transition shadow-sm">
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-12 border-b border-gray-100 mb-8 px-2 overflow-x-auto">
                    {['Videos', 'Documents & Files'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-[#8a6d4b]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8a6d4b] rounded-full"></div>}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex justify-center mt-20 text-gray-400 font-medium italic">Loading content...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredItems.length > 0 ? filteredItems.map((item, i) => (
                            <div key={i} className="group cursor-pointer" onClick={() => item.type === 'video' && setActivePlayerVideo(item)}>
                                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition flex flex-col h-full">
                                    {/* Thumbnail / Icon Area */}
                                    <div className="relative aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {activeTab === 'Videos' ? (
                                            <>
                                                <img
                                                    src={item.thumbnail ? (item.thumbnail.startsWith('http') ? item.thumbnail : `${API_BASE_URL}${item.thumbnail}`) : `https://images.unsplash.com/photo-1591115765373-520b7a217207?w=800&q=80&auto=format&fit=crop`}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition">
                                                        <PlayCircle size={32} className="text-gray-900 fill-gray-900" />
                                                    </div>
                                                </div>
                                                {/* Play Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-gray-900 border-b-[8px] border-b-transparent ml-1"></div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-[#8a6d4b]/20">
                                                <FileText size={48} strokeWidth={1.5} />
                                                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#8a6d4b]/40">Document</div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Content Area */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-[13px] mb-4 line-clamp-2 leading-relaxed min-h-[40px] group-hover:text-[#8a6d4b] transition">
                                                {item.title || item.name || item.courseTitle}
                                            </h3>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 border-t border-gray-50 pt-4">
                                            <div className="flex items-center gap-1.5 uppercase tracking-tighter">
                                                <Calendar size={12} className="opacity-60" />
                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {activeTab === 'Videos' ? (
                                                    <>
                                                        <Eye size={12} className="opacity-60" />
                                                        <span>{Math.floor(Math.random() * 50) + 5} views</span>
                                                    </>
                                                ) : (
                                                    <a
                                                        href={`${API_BASE_URL}${item.url}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-1 text-[#8a6d4b] hover:text-[#725a3d] transition"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Download size={12} />
                                                        <span>Open File</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400 italic">No {activeTab.toLowerCase()} found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Video Player Modal */}
                {activePlayerVideo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setActivePlayerVideo(null)}></div>
                        <div className="w-full max-w-5xl relative z-10 flex flex-col gap-6 animate-in zoom-in-95 duration-300">
                            {/* Player Header */}
                            <div className="flex justify-between items-center text-white">
                                <div>
                                    <h2 className="text-xl font-bold">{activePlayerVideo.title}</h2>
                                    <p className="text-xs text-gray-400 font-medium">Knowledge Resource • {activePlayerVideo.courseTitle}</p>
                                </div>
                                <button
                                    onClick={() => setActivePlayerVideo(null)}
                                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Video Container */}
                            <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
                                <video
                                    autoPlay
                                    controls
                                    className="w-full h-full"
                                    key={activePlayerVideo.url}
                                >
                                    <source src={`${API_BASE_URL}${activePlayerVideo.url}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {!loading && (
                    <div className="flex items-center justify-center gap-8 mt-16">
                        <button className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-400 cursor-not-allowed bg-white">Previous</button>
                        <span className="text-sm font-bold text-gray-900 tracking-wide">Page 1 of 1</span>
                        <button className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-400 cursor-not-allowed bg-white">Next</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCatalog;
