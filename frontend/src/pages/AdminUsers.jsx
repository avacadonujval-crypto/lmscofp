import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import API_BASE_URL from '../config/api';
import { Search, Filter, Plus, Edit, ChevronDown, X } from 'lucide-react';

const AdminUsers = () => {
    const { user, setUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        plan: 'All Types',
        state: 'All States',
        city: 'All Cities',
        status: 'All Statuses'
    });

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student',
        phone: '', plan: 'Basic', status: 'Active',
        startDate: '', endDate: '',
        gender: 'Male', dob: '', address: '', city: '', state: '', zip: '', country: 'India'
    });

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '', email: '', role: '', phone: '', plan: '', status: '',
        startDate: '', endDate: '',
        gender: '', dob: '', address: '', city: '', state: '', zip: '', country: ''
    });

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            if (!user || !user.token) {
                console.error("No user token found");
                setLoading(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/api/users`, config);

            if (Array.isArray(data)) {
                const refinedData = data.map((u, i) => ({
                    ...u,
                    initial: (u.name || u.email || '?').charAt(0).toUpperCase(),
                    avatarColor: ['bg-green-100 text-green-600', 'bg-blue-100 text-blue-600', 'bg-yellow-100 text-yellow-600'][i % 3]
                }));
                setUsers(refinedData);
            } else {
                console.error("Data received is not an array:", data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setMessage({ text: 'Failed to fetch users. Please check connection.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Status is defaulted to Active in backend/logic, removed from form as requested
            const createData = { ...formData, status: 'Active' };
            await axios.post(`${API_BASE_URL}/api/users`, createData, config);

            setMessage({ text: 'User created successfully', type: 'success' });
            setIsCreateModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'student', phone: '', plan: 'Basic', status: 'Active', startDate: '', endDate: '' });
            fetchUsers();
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to create user', type: 'error' });
        }
    };

    const handleEditClick = (u) => {
        setEditingUser(u);
        setEditFormData({
            name: u.name || '',
            email: u.email || '',
            role: u.role || 'student',
            phone: u.phone || '',
            plan: u.plan || 'Basic',
            status: u.status || 'Active',
            startDate: u.startDate || '',
            endDate: u.endDate || '',
            gender: u.gender || 'Male',
            dob: u.dob || '',
            address: u.address || '',
            city: u.city || '',
            state: u.state || '',
            zip: u.zip || '',
            country: u.country || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const userId = editingUser.id || editingUser._id;

            await axios.put(`${API_BASE_URL}/api/users/${userId}`, editFormData, config);

            setMessage({ text: 'User updated successfully', type: 'success' });
            setIsEditModalOpen(false);
            fetchUsers();

            // If the updated user is the logged-in user, update AuthContext
            if (userId === (user.id || user._id)) {
                const updatedUser = { ...user, ...editFormData };
                setUser(updatedUser);
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            }

            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            console.error("Update error:", error);
            setMessage({ text: error.response?.data?.message || 'Failed to update user', type: 'error' });
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const resetFilters = () => {
        setFilters({
            plan: 'All Types',
            state: 'All States',
            city: 'All Cities',
            status: 'All Statuses'
        });
        setSearchQuery('');
    };

    // Helper for table visuals
    const PlanBadge = ({ plan }) => {
        const colors = {
            Premium: 'bg-blue-100 text-blue-700',
            Gold: 'bg-yellow-100 text-yellow-700',
            Basic: 'bg-gray-100 text-gray-700'
        };
        return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[plan] || colors.Basic}`}>{plan || 'Basic'}</span>;
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (u.id?.toString() || '').includes(searchQuery);

        const matchesPlan = filters.plan === 'All Types' || u.plan === filters.plan;
        const matchesState = filters.state === 'All States' || u.state === filters.state;
        const matchesCity = filters.city === 'All Cities' || u.city === filters.city;
        const matchesStatus = filters.status === 'All Statuses' || u.status === filters.status;

        return matchesSearch && matchesPlan && matchesState && matchesCity && matchesStatus;
    });

    const uniqueStates = [...new Set(users.map(u => u.state).filter(Boolean))].sort();
    const uniqueCities = [...new Set(users.map(u => u.city).filter(Boolean))].sort();

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-white text-gray-800">
            <Sidebar />

            <div className="flex-1 p-4 md:p-8 overflow-auto pt-20 lg:pt-8 bg-[#FAFAFA]">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Membership Details</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage member accounts, plans, and activity.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-[#8a6d4b] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#725a3d] transition shadow-sm"
                    >
                        <Plus size={16} />
                        Add Member
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 mb-8 flex flex-wrap gap-4 items-end shadow-sm">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Member Type</label>
                        <div className="relative">
                            <select
                                name="plan"
                                value={filters.plan}
                                onChange={handleFilterChange}
                                className="w-full appearance-none border border-gray-200 rounded-lg p-3 text-sm text-gray-700 font-medium pr-8 focus:ring-1 focus:ring-[#9c7b4f] focus:outline-none bg-white"
                            >
                                <option>All Types</option>
                                <option>Basic</option>
                                <option>Gold</option>
                                <option>Premium</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">State / Province</label>
                        <div className="relative">
                            <select
                                name="state"
                                value={filters.state}
                                onChange={handleFilterChange}
                                className="w-full appearance-none border border-gray-200 rounded-lg p-3 text-sm text-gray-700 font-medium pr-8 focus:ring-1 focus:ring-[#9c7b4f] focus:outline-none bg-white"
                            >
                                <option>All States</option>
                                {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">City</label>
                        <div className="relative">
                            <select
                                name="city"
                                value={filters.city}
                                onChange={handleFilterChange}
                                className="w-full appearance-none border border-gray-200 rounded-lg p-3 text-sm text-gray-700 font-medium pr-8 focus:ring-1 focus:ring-[#9c7b4f] focus:outline-none bg-white"
                            >
                                <option>All Cities</option>
                                {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Status</label>
                        <div className="relative">
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full appearance-none border border-gray-200 rounded-lg p-3 text-sm text-gray-700 font-medium pr-8 focus:ring-1 focus:ring-[#9c7b4f] focus:outline-none bg-white"
                            >
                                <option>All Statuses</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pb-1 ml-auto">
                        <button
                            onClick={resetFilters}
                            className="text-gray-500 text-sm font-medium hover:text-gray-700"
                        >
                            Reset Filters
                        </button>
                        <button className="bg-[#8a6d4b] text-white px-5 py-3 rounded-lg font-bold text-sm hover:bg-[#725a3d] flex items-center gap-2 shadow-sm transition">
                            <Filter size={16} className="fill-current" />
                            Apply Results
                        </button>
                    </div>
                </div>

                {/* Search & Content */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 pt-8">
                    <div className="relative mb-8 max-w-md">
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            className="w-full h-12 pl-4 pr-14 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#9c7b4f] bg-white shadow-sm transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-[#8a6d4b] text-white flex items-center justify-center rounded-lg hover:bg-[#725a3d] transition shadow-sm">
                            <Search size={18} />
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto -mx-6 px-6 pb-4">
                        <table className="w-full text-left min-w-[900px]">
                            <thead>
                                <tr className="bg-white border-b border-gray-100">
                                    <th className="py-4 pr-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Member Profile</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID & Plan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Start Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">End Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Location</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-4 border-[#8a6d4b] border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Members...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pr-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${u.avatarColor}`}>
                                                    {u.initial}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-sm font-bold text-gray-700">EP{u.id}</span>
                                                <PlanBadge plan={u.plan} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{u.phone || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{u.startDate || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{u.endDate || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{u.address || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-sm font-bold ${u.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {u.status || 'Active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEditClick(u)}
                                                className="text-gray-400 hover:text-gray-600 transition"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Minimal Pagination */}
                <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-500">
                    <span>Showing {filteredUsers.length} results</span>
                </div>
            </div>

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add New Member</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Name</label><input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                                <div><label className="block text-sm font-medium mb-1">Email</label><input className="w-full border p-2 rounded" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Password</label><input className="w-full border p-2 rounded" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Phone</label><input className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">Plan</label><select className="w-full border p-2 rounded" value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value })}><option>Basic</option><option>Premium</option><option>Gold</option></select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Start Date</label><input type="date" className="w-full border p-2 rounded" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">End Date</label><input type="date" className="w-full border p-2 rounded" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Gender</label><select className="w-full border p-2 rounded" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></div>
                                <div><label className="block text-sm font-medium mb-1">DOB</label><input type="date" className="w-full border p-2 rounded" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Address</label><input className="w-full border p-2 rounded" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">City</label><input className="w-full border p-2 rounded" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">State</label><input className="w-full border p-2 rounded" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Zip</label><input className="w-full border p-2 rounded" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">Country</label><input className="w-full border p-2 rounded" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role</label>
                                    <select className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-[#8a6d4b] text-white rounded hover:bg-[#725a3d] font-bold">Create Member</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Edit Member</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Name</label><input className="w-full border p-2 rounded" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} required /></div>
                                <div><label className="block text-sm font-medium mb-1">Email</label><input className="w-full border p-2 rounded" type="email" value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} required /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Phone</label><input className="w-full border p-2 rounded" value={editFormData.phone} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">Plan</label><select className="w-full border p-2 rounded" value={editFormData.plan} onChange={e => setEditFormData({ ...editFormData, plan: e.target.value })}><option>Basic</option><option>Premium</option><option>Gold</option></select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Start Date</label><input type="date" className="w-full border p-2 rounded" value={editFormData.startDate} onChange={e => setEditFormData({ ...editFormData, startDate: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">End Date</label><input type="date" className="w-full border p-2 rounded" value={editFormData.endDate} onChange={e => setEditFormData({ ...editFormData, endDate: e.target.value })} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Gender</label><select className="w-full border p-2 rounded" value={editFormData.gender} onChange={e => setEditFormData({ ...editFormData, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></div>
                                <div><label className="block text-sm font-medium mb-1">DOB</label><input type="date" className="w-full border p-2 rounded" value={editFormData.dob} onChange={e => setEditFormData({ ...editFormData, dob: e.target.value })} /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Address</label><input className="w-full border p-2 rounded" value={editFormData.address} onChange={e => setEditFormData({ ...editFormData, address: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">City</label><input className="w-full border p-2 rounded" value={editFormData.city} onChange={e => setEditFormData({ ...editFormData, city: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">State</label><input className="w-full border p-2 rounded" value={editFormData.state} onChange={e => setEditFormData({ ...editFormData, state: e.target.value })} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Zip</label><input className="w-full border p-2 rounded" value={editFormData.zip} onChange={e => setEditFormData({ ...editFormData, zip: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">Country</label><input className="w-full border p-2 rounded" value={editFormData.country} onChange={e => setEditFormData({ ...editFormData, country: e.target.value })} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select className="w-full border p-2 rounded" value={editFormData.status} onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role</label>
                                    <select className="w-full border p-2 rounded" value={editFormData.role} onChange={e => setEditFormData({ ...editFormData, role: e.target.value })}>
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-[#8a6d4b] text-white rounded hover:bg-[#725a3d] font-bold">Update Member</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
