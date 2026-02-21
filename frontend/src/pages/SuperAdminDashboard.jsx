import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Plus, X, Search, Key, Trash2, Edit2, UserCircle, LogOut } from 'lucide-react';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        status: 'Active'
    });

    useEffect(() => {
        // Check if user is logged in and is super admin
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/superadmin-login');
            return;
        }

        const parsedUser = JSON.parse(userInfo);
        if (parsedUser.role !== 'superadmin') {
            navigate('/superadmin-login');
            return;
        }

        setUser(parsedUser);
        fetchAdmins(parsedUser.token);
    }, [navigate]);

    const fetchAdmins = async (token) => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://127.0.0.1:5000/api/superadmin/admins', config);

            const refinedData = data.map((admin, i) => ({
                ...admin,
                initial: (admin.name || admin.email || '?').charAt(0).toUpperCase(),
                avatarColor: ['bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-pink-100 text-pink-600'][i % 4]
            }));
            setAdmins(refinedData);
        } catch (error) {
            console.error("Error fetching admins:", error);
            setMessage({ text: 'Failed to fetch admins', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://127.0.0.1:5000/api/superadmin/admins', formData, config);

            setMessage({ text: 'Admin created successfully', type: 'success' });
            setIsCreateModalOpen(false);
            setFormData({ name: '', email: '', password: '', status: 'Active' });
            fetchAdmins(user.token);
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to create admin', type: 'error' });
        }
    };

    const handleUpdateAdmin = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://127.0.0.1:5000/api/superadmin/admins/${selectedAdmin.id}`, {
                name: formData.name,
                email: formData.email,
                status: formData.status
            }, config);

            setMessage({ text: 'Admin updated successfully', type: 'success' });
            setIsEditModalOpen(false);
            setSelectedAdmin(null);
            setFormData({ name: '', email: '', password: '', status: 'Active' });
            fetchAdmins(user.token);
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to update admin', type: 'error' });
        }
    };

    const handleResetPassword = async (id, email) => {
        if (!window.confirm(`Reset password for ${email}?`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://127.0.0.1:5000/api/superadmin/admins/${id}/reset-password`, {}, config);

            setMessage({ text: data.message, type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 8000);
        } catch (error) {
            setMessage({ text: 'Failed to reset password', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const handleDeleteAdmin = async (id, name) => {
        if (!window.confirm(`Delete admin "${name}"? This action cannot be undone.`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://127.0.0.1:5000/api/superadmin/admins/${id}`, config);

            setMessage({ text: 'Admin deleted successfully', type: 'success' });
            fetchAdmins(user.token);
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to delete admin', type: 'error' });
        }
    };

    const openEditModal = (admin) => {
        setSelectedAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            password: '',
            status: admin.status
        });
        setIsEditModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/superadmin-login');
    };

    const filteredAdmins = admins.filter(admin =>
        (admin.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (admin.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-['Poppins']">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Super Admin Portal</h1>
                                <p className="text-yellow-100 text-sm">Administrator Management</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs text-yellow-100">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-white/20 rounded-lg transition"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Actions Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Admin Accounts</h2>
                        <p className="text-gray-500 text-sm mt-1">Manage administrator access and permissions</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-yellow-600 hover:to-yellow-700 transition shadow-md"
                    >
                        <Plus size={16} />
                        Create Admin
                    </button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center mb-6 max-w-md">
                    <input
                        type="text"
                        placeholder="Search admins..."
                        className="flex-1 w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 bg-white h-11 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="bg-yellow-500 w-12 h-11 rounded-r-lg text-white hover:bg-yellow-600 transition flex items-center justify-center -ml-12 z-10 pointer-events-none">
                        <Search size={20} />
                    </div>
                </div>

                {/* Message Toast */}
                {message.text && (
                    <div className={`mb-4 p-3 rounded-lg text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                {/* Admins Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Profile</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Admins...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAdmins.length > 0 ? filteredAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${admin.avatarColor}`}>
                                                {admin.initial}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{admin.name}</p>
                                                <p className="text-xs text-gray-500">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${admin.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-4 text-sm">
                                            <button
                                                onClick={() => openEditModal(admin)}
                                                className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 font-medium transition"
                                            >
                                                <Edit2 size={14} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleResetPassword(admin.id, admin.email)}
                                                className="flex items-center gap-1.5 text-yellow-600 hover:text-yellow-700 font-medium transition"
                                            >
                                                <Key size={14} />
                                                Reset
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                                className="flex items-center gap-1.5 text-red-500 hover:text-red-700 font-medium transition"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                        No admins found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Admin Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Create New Admin</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 font-medium transition">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 font-bold transition">Create Admin</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Admin Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Edit Admin</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 font-medium transition">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 font-bold transition">Update Admin</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
