import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import API_BASE_URL from '../config/api';
import { Search, Plus, Trash2, Edit, Network, X, Users, ChevronDown } from 'lucide-react';

const AdminGroups = () => {
    const { user } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]); // For selecting members
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]); // Array of IDs

    useEffect(() => {
        if (user) {
            fetchGroups();
            fetchUsers();
        }
    }, [user]);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/api/groups`, config);
            setGroups(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/api/users`, config);
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                name: groupName,
                description,
                members: selectedMembers
            };

            if (isEditing) {
                await axios.put(`${API_BASE_URL}/api/groups/${editingGroupId}`, payload, config);
            } else {
                await axios.post(`${API_BASE_URL}/api/groups`, payload, config);
            }

            fetchGroups();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error(error);
            alert(`Failed to ${isEditing ? 'update' : 'create'} group`);
        }
    };

    const resetForm = () => {
        setGroupName('');
        setDescription('');
        setSelectedMembers([]);
        setIsEditing(false);
        setEditingGroupId(null);
    };

    const handleEditClick = (group) => {
        setGroupName(group.name);
        setDescription(group.description || '');
        setSelectedMembers(group.members ? group.members.map(m => m.id) : []);
        setEditingGroupId(group.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDeleteGroup = async (id) => {
        if (!window.confirm('Delete this group?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API_BASE_URL}/api/groups/${id}`, config);
            fetchGroups();
        } catch (error) {
            console.error(error);
        }
    };

    // Toggle member selection
    const toggleMember = (id) => {
        if (selectedMembers.includes(id)) {
            setSelectedMembers(selectedMembers.filter(mId => mId !== id));
        } else {
            setSelectedMembers([...selectedMembers, id]);
        }
    };

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-white text-gray-800">
            <Sidebar />

            <div className="flex-1 p-4 md:p-8 overflow-auto pt-20 lg:pt-8 bg-[#FAFAFA]">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Group Management</h1>
                        <p className="text-gray-500 text-sm mt-1">Create and manage user groups for targeted communication.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#8a6d4b] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#725a3d] transition shadow-sm"
                    >
                        <Plus size={16} />
                        Add Group
                    </button>
                </div>

                {/* Groups List Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="bg-white border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-1/2">Group Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Members</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-4 border-[#8a6d4b] border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Groups...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : groups.length > 0 ? groups.map((group) => (
                                    <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm">{group.name}</h3>
                                                <p className="text-xs text-gray-400 mt-1">{group.description || 'No description'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                <Users size={14} className="text-gray-400" />
                                                <span className="text-xs font-bold text-gray-600">{group.members ? group.members.length : 0} Members</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3 text-gray-400">
                                                <button onClick={() => handleEditClick(group)} className="hover:text-blue-500 transition"><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteGroup(group.id)} className="hover:text-red-500 transition"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-10 text-center text-gray-400">
                                            No groups created yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Group' : 'New Group'}</h2>
                            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Group Name</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8a6d4b] focus:border-[#8a6d4b]"
                                    placeholder="e.g. Board Members"
                                    value={groupName}
                                    onChange={e => setGroupName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Description <span className="text-gray-400 font-normal">(max 100 chars)</span></label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8a6d4b] focus:border-[#8a6d4b]"
                                    placeholder="Brief description..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Add Members</label>
                                <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                                    {users.map(u => (
                                        <div
                                            key={u.id || u._id}
                                            onClick={() => toggleMember(u.id || u._id)}
                                            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0 ${selectedMembers.includes(u.id || u._id) ? 'bg-amber-50' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-gray-200 text-gray-600`}>
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{u.name}</span>
                                            </div>
                                            {selectedMembers.includes(u.id || u._id) && (
                                                <div className="w-2 h-2 rounded-full bg-[#8a6d4b]"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{selectedMembers.length} selected</p>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-[#8a6d4b] text-white rounded-lg text-sm font-bold hover:bg-[#725a3d] transition shadow-sm"
                                >
                                    Save Group
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGroups;
