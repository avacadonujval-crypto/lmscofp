import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import API_BASE_URL from '../config/api';
import { Search, Filter, Plus, Edit, Trash2, Shield, RefreshCw, Key, Info } from 'lucide-react';

const AdminSystemUsers = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/api/users`, config);

            // Access user.id correctly whether it's _id or id
            const usersList = Array.isArray(data) ? data : [];
            const refinedData = usersList.map((u, i) => ({
                ...u,
                displayId: u.id || u._id,
                initial: (u.name || u.email || '?').charAt(0).toUpperCase(),
                avatarColor: ['bg-purple-100 text-purple-600', 'bg-yellow-100 text-yellow-600', 'bg-pink-100 text-pink-600', 'bg-blue-100 text-blue-600'][i % 4]
            }));
            setUsers(refinedData);
        } catch (error) {
            console.error("Error fetching users:", error);
            setMessage({ text: 'Failed to fetch users', type: 'error' });
        } finally {
            setLoading(false);
        }
    };



    const handleResetPassword = async (id, email) => {
        if (!window.confirm(`Are you sure you want to reset the password for ${email}? A new password will be sent to them.`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`${API_BASE_URL}/api/users/reset-password`, { userId: id, newPassword: 'password123' }, config);

            setMessage({ text: data.message, type: 'success' }); // Message says "New password sent to..."
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        } catch (error) {
            setMessage({ text: 'Failed to reset password', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API_BASE_URL}/api/users/${id}`, config);
            fetchUsers();
            setMessage({ text: 'User deleted successfully', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to delete user', type: 'error' });
        }
    };

    const filteredUsers = users.filter(u =>
        (u.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-white text-gray-800">
            <Sidebar />

            <div className="flex-1 p-4 md:p-8 overflow-auto pt-20 lg:pt-8 bg-[#FAFAFA]">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage system access, roles, and user credentials.</p>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-gray-700 mb-8 items-start">
                    <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                    <div>
                        <span className="font-bold text-gray-900">Admin Management</span>
                        <p className="mt-1 text-gray-600 leading-relaxed">
                            Admin accounts are managed by the Super Admin. User accounts are automatically created when new members register. Each member receives login credentials to access their member portal.
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6 max-w-md">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full h-11 pl-4 pr-12 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#9c7b4f] bg-white shadow-sm min-w-0 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center bg-[#8a6d4b] rounded-r-lg text-white pointer-events-none">
                        <Search size={20} />
                    </div>
                </div>

                {/* Message Toast (Inline) */}
                {message.text && (
                    <div className={`mb-4 p-3 rounded-lg text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="bg-white border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-1/2">User Profile</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">System Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-4 border-[#8a6d4b] border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Accounts...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                    <tr key={u.id || u._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${u.avatarColor}`}>
                                                    {u.initial}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{u.email}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">ID: US{u.displayId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-6 text-sm">
                                                <button
                                                    onClick={() => handleResetPassword(u.displayId, u.email)}
                                                    className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 font-medium transition"
                                                >
                                                    <Key size={14} />
                                                    Reset password
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u.displayId)}
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
                                            No users found. {users.length === 0 && !loading && "Database might be empty."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default AdminSystemUsers;
