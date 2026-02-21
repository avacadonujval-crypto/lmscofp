import { useState, useContext } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AuthContext from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import { Shield, Info, Key, Lock, X, Eye, EyeOff } from 'lucide-react';

const AdminSettings = () => {
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ text: 'New passwords do not match', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.put(`${API_BASE_URL}/api/users/profile/password`, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }, config);

            setMessage({ text: data.message || 'Password updated successfully', type: 'success' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setIsModalOpen(false);
                setMessage({ text: '', type: '' });
            }, 2000);
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Failed to update password',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-white text-gray-800">
            <Sidebar />

            <div className="flex-1 p-4 md:p-8 overflow-auto pt-20 lg:pt-8 bg-[#FAFAFA]">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Security Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your account security and password settings.</p>
                </div>

                {/* Main Card */}
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-12">
                    {/* Top Banner Area */}
                    <div className="bg-[#344054] h-32 relative">
                        {/* Profile Icon Circle */}
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-20 h-20 bg-[#f79009] rounded-full border-4 border-white flex items-center justify-center text-white shadow-sm">
                                <Shield size={36} fill="white" />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-14 px-8 pb-8">
                        <h2 className="text-xl font-bold text-gray-900">Administrator</h2>
                        <p className="text-[#f79009] text-xs font-bold uppercase tracking-wider mt-1">ADMIN ACCESS</p>

                        {/* Info Box */}
                        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                            <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-1">Security Best Practices</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Regularly update your password to maintain account security. Use a strong, unique password that you don't use for other accounts.
                                </p>
                            </div>
                        </div>

                        {/* Password Row */}
                        <div className="mt-8 flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#fef4e6] rounded-full flex items-center justify-center text-[#f79009]">
                                    <Key size={18} />
                                </div>
                                <span className="font-semibold text-gray-900 text-sm">Password</span>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                            >
                                <Lock size={14} className="text-gray-500" />
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-[#fef4e6] rounded-lg flex items-center justify-center text-[#f79009] shrink-0">
                                    <Lock size={18} />
                                </div>
                                <h2 className="text-lg font-bold uppercase tracking-tight">Change Password</h2>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="p-6 space-y-5">
                            {message.text && (
                                <div className={`p-3 rounded-lg text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {message.text}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#f79009] focus:outline-none transition-all pr-10"
                                        placeholder="Enter current password"
                                        value={formData.currentPassword}
                                        onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#f79009] focus:outline-none transition-all pr-10"
                                        placeholder="Enter new password"
                                        value={formData.newPassword}
                                        onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#f79009] focus:outline-none transition-all pr-10"
                                        placeholder="Confirm new password"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold text-sm text-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 bg-[#f79009] text-white rounded-xl hover:bg-[#e68608] font-bold text-sm shadow-sm transition disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
