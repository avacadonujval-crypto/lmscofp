import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import API_BASE_URL from '../config/api';
import { Search, Upload, Calendar, Eye, Trash2, ChevronLeft, ChevronRight, FileText, X, Video, PlayCircle } from 'lucide-react';

const KnowledgeHub = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('Videos');
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Upload Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadData, setUploadData] = useState({
        title: '',
        description: '',
        category: 'Development',
        file: null,
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchItems();
        }
    }, [user]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/api/courses`, config);

            // Flatten all videos and documents from courses into a single list
            const allItems = [];

            data.forEach(course => {
                // Process relational Videos
                if (course.videos && Array.isArray(course.videos)) {
                    course.videos.forEach((v) => {
                        allItems.push({
                            ...v,
                            id: v.id,
                            courseTitle: course.title,
                            date: new Date(v.createdAt).toLocaleDateString(),
                            type: 'Videos',
                            courseDescription: course.description
                        });
                    });
                }

                // Process relational Documents (KnowledgeMaterials)
                if (course.materials && Array.isArray(course.materials)) {
                    course.materials.forEach((m) => {
                        allItems.push({
                            ...m,
                            id: m.id,
                            courseTitle: course.title,
                            date: new Date(m.createdAt).toLocaleDateString(),
                            type: 'Documents',
                            courseDescription: course.description
                        });
                    });
                }
            });

            setItems(allItems);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching items:", error);
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setUploadData({ ...uploadData, file: e.target.files[0] });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadData.file) return alert("Please select a file");

        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` } };

            const formData = new FormData();
            formData.append('video', uploadData.file);

            // 1. Upload file and get RELATIVE path
            const { data: relativePath } = await axios.post(`${API_BASE_URL}/api/courses/upload`, formData, config);

            // 2. Standardize: Ensure path starts with /uploads and DOES NOT include domain
            const cleanPath = relativePath.startsWith('http') ? new URL(relativePath).pathname : relativePath;

            // 3. Create Course Entry with nested Vid/Doc
            const courseData = {
                title: uploadData.title,
                description: uploadData.description,
                category: uploadData.category,
                videos: activeTab === 'Videos' ? [{ title: uploadData.title, url: cleanPath }] : [],
                materials: activeTab === 'Documents' ? [{ title: uploadData.title, url: cleanPath }] : []
            };

            const jsonConfig = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_BASE_URL}/api/courses`, courseData, jsonConfig);

            setUploading(false);
            setIsUploadModalOpen(false);
            setUploadData({ title: '', description: '', category: 'Development', file: null });
            fetchItems();
            alert('Uploaded Successfully');

        } catch (error) {
            console.error(error);
            setUploading(false);
            const errorMsg = error.response?.data?.message || error.message || 'Upload failed';
            alert(`Upload failed: ${errorMsg}`);
        }
    };

    const filteredItems = items.filter(item =>
        item.type === activeTab &&
        ((item.title || item.courseTitle || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-white text-gray-800">
            <Sidebar />

            <div className="flex-1 p-4 md:p-8 overflow-auto pt-20 lg:pt-8 bg-[#FAFAFA]">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Knowledge Hub</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage recorded sessions and council documents.</p>
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 bg-[#9c7b4f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#8a6a43] transition shadow-sm w-full md:w-auto justify-center"
                    >
                        <Upload size={18} />
                        Upload {activeTab === 'Videos' ? 'Video' : 'Document'}
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-xl border border-gray-200 mb-8 flex items-center shadow-sm">
                    <Search className="ml-4 text-gray-400 shrink-0" size={20} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab.toLowerCase()}...`}
                        className="flex-1 p-3 text-sm outline-none text-gray-700 placeholder-gray-400 min-w-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="bg-[#9c7b4f] p-3 rounded-lg text-white hover:bg-[#8a6a43] transition shrink-0">
                        <Search size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-8 flex gap-8">
                    {['Videos', 'Documents'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab
                                ? 'text-[#9c7b4f]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#9c7b4f]"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-4 text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                            Loading Hub...
                        </div>
                    ) : filteredItems.length > 0 ? filteredItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            {/* Visual Area */}
                            <div className="relative h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                                {item.type === 'Videos' ? (
                                    <video src={`http://127.0.0.1:5000${item.url}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-300">
                                        <FileText size={48} />
                                    </div>
                                )}

                                {/* Overlay for play/view */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <a
                                        href={`http://127.0.0.1:5000${item.url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white text-gray-900 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-100 transition transform scale-90 group-hover:scale-100 duration-300 flex items-center gap-2"
                                    >
                                        {item.type === 'Videos' ? <Video size={16} /> : <FileText size={16} />}
                                        {item.type === 'Videos' ? 'Play Now' : 'Open PDF'}
                                    </a>
                                </div>

                                {item.type === 'Videos' && (
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm text-[#9c7b4f]">
                                            <PlayCircle size={18} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Area */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 text-[13px] mb-4 line-clamp-2 leading-relaxed min-h-[40px] group-hover:text-[#9c7b4f] transition">
                                    {item.title || item.courseTitle}
                                </h3>

                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 border-t border-gray-50 pt-4">
                                    <div className="flex items-center gap-1.5 uppercase tracking-tighter">
                                        <Calendar size={12} className="opacity-60" />
                                        <span>{item.date}</span>
                                    </div>
                                    <div className="px-2 py-0.5 bg-gray-50 rounded italic text-[9px]">
                                        {item.courseTitle || 'Archive'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-4 text-center py-20 text-gray-500">
                            No {activeTab.toLowerCase()} found.
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Upload {activeTab === 'Videos' ? 'Video' : 'Document'}</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input className="w-full border p-2 rounded" value={uploadData.title} onChange={e => setUploadData({ ...uploadData, title: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea className="w-full border p-2 rounded" value={uploadData.description} onChange={e => setUploadData({ ...uploadData, description: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">File ({activeTab === 'Videos' ? 'Video' : 'PDF/Doc'})</label>
                                <input type="file" className="w-full border p-2 rounded" onChange={handleFileChange} required />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={uploading} className="flex-1 py-2 bg-[#9c7b4f] text-white rounded hover:bg-[#8a6a43] font-bold disabled:opacity-50">
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KnowledgeHub;
