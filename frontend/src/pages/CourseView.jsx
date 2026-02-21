import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import API_BASE_URL from '../config/api';
import { ChevronLeft, PlayCircle, FileText, CheckCircle, Lock, Clock, Calendar } from 'lucide-react';

const CourseView = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [course, setCourse] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`${API_BASE_URL}/api/courses/${id}`, config);
            setCourse(data);
            if (data.videos && data.videos.length > 0) {
                setActiveVideo(data.videos[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!course) return <div className="p-8">Loading...</div>;

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-[#FAFAFA] text-gray-800">
            <Sidebar />

            <div className="flex-1 p-4 md:p-8 overflow-auto pt-20 lg:pt-8 bg-[#FAFAFA]">
                <div className="mb-6">
                    <Link to="/user-dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#8a6d4b] hover:text-[#725a3d] transition">
                        <ChevronLeft size={16} /> Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[calc(100vh-160px)]">
                    <div className="p-8 lg:p-10 border-b border-gray-100 bg-white">
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">{course.title}</h1>
                        <p className="text-gray-500 mt-2 max-w-3xl text-sm leading-relaxed">{course.description}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                        {/* Main Content Area (Video Player) */}
                        <div className="lg:col-span-8 p-6 lg:p-8 bg-[#0f172a] min-h-[400px] flex items-center justify-center relative">
                            {activeVideo ? (
                                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                                    <video
                                        key={activeVideo.id || activeVideo.url}
                                        controls
                                        className="w-full h-full"
                                        src={`${API_BASE_URL}${activeVideo.url}`}
                                        poster={course.thumbnail ? `${API_BASE_URL}${course.thumbnail}` : ''}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <div className="text-white/40 text-center">
                                    <PlayCircle size={64} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-medium italic">No video selected</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar (Playlist & Materials) */}
                        <div className="lg:col-span-4 bg-white border-l border-gray-100 flex flex-col h-full">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                                    <PlayCircle size={18} className="text-[#8a6d4b]" /> Course Content
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {course.videos && course.videos.length > 0 ? course.videos.map((video, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setActiveVideo(video)}
                                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${activeVideo === video
                                            ? 'bg-[#fff9f2] border-[#8a6d4b]/20 shadow-sm ring-1 ring-[#8a6d4b]/10'
                                            : 'bg-white border-gray-50 hover:bg-gray-50'}`}
                                    >
                                        <p className={`font-bold text-sm ${activeVideo === video ? 'text-[#8a6d4b]' : 'text-gray-700'}`}>{video.title}</p>
                                        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-gray-400">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {video.duration || 10} mins</span>
                                            {activeVideo === video && <span className="text-[#8a6d4b] uppercase tracking-tighter">● Playing NOW</span>}
                                        </div>
                                    </div>
                                )) : (
                                    <p className="p-8 text-center text-gray-400 text-xs italic">No videos available.</p>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100">
                                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
                                    <FileText size={18} className="text-[#8a6d4b]" /> Study Materials
                                </h3>
                                <div className="space-y-3">
                                    {course.materials && course.materials.length > 0 ? course.materials.map((material, index) => (
                                        <a
                                            key={index}
                                            href={`http://127.0.0.1:5000${material.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-[#fcfcfc] border border-gray-100 rounded-xl hover:bg-gray-50 transition group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#8a6d4b] transition">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-600 truncate flex-1">{material.title}</span>
                                        </a>
                                    )) : (
                                        <p className="text-center text-gray-400 text-xs italic">No materials available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseView;
