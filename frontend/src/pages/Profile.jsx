import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AuthContext from '../context/AuthContext';
import {
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Lock,
    CheckCircle,
    Shield,
    ChevronDown,
    Globe,
    UserCircle
} from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || 'Male',
        dob: user?.dob || '',
        address: user?.address || '',
        country: user?.country || '',
        state: user?.state || '',
        city: user?.city || '',
        zip: user?.zip || '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Sync local form state if user object updates
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                gender: user.gender || 'Male',
                dob: user.dob || '',
                address: user.address || '',
                country: user.country || '',
                state: user.state || '',
                city: user.city || '',
                zip: user.zip || '',
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        // Disabled
    };

    const handleUpdate = async (e) => {
        // Disabled
    };

    return (
        <div className="flex min-h-screen font-['Poppins'] bg-[#FAFAFA] text-gray-800">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto pt-20 lg:pt-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-gray-900">Profile Details</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your personal profile and security settings.</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.includes('success') ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                        {message.includes('success') ? <CheckCircle size={18} /> : <Shield size={18} />}
                        <span className="text-sm font-bold">{message}</span>
                    </div>
                )}

                <div className="flex flex-col xl:flex-row gap-8 items-start">
                    {/* Left Card: Summary */}
                    <div className="w-full xl:w-80 space-y-6 shrink-0">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Profile Header Header */}
                            <div className="h-28 bg-[#3d4852]"></div>
                            {/* Avatar */}
                            <div className="px-6 -mt-12 text-center pb-8 border-b border-gray-50">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 rounded-full bg-[#8a6d4b] border-4 border-white flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        {(formData.name || 'User').charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <h2 className="mt-4 text-xl font-bold text-gray-900">{formData.name}</h2>
                                <p className="text-[10px] font-bold text-[#8a6d4b] uppercase tracking-widest mt-0.5">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>

                                <div className="mt-6 space-y-3 text-left">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <MapPin size={16} className="shrink-0" />
                                        <span className="text-xs font-medium">{formData.address || 'Address not set'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Mail size={16} className="shrink-0" />
                                        <span className="text-xs font-medium truncate">{formData.email}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Membership */}
                            <div className="p-6">
                                <div className="bg-[#fff9e6] rounded-xl p-4 border border-[#fff2cc]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                            <Shield size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-900">Premium Membership</h4>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                <span className="text-[10px] text-green-600 font-bold uppercase">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] mb-2">
                                        <span className="text-gray-400 font-medium">Started</span>
                                        <span className="text-gray-700 font-bold">{user?.startDate || 'Aug 8, 2026'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-gray-400 font-medium">Expires</span>
                                        <span className="text-gray-700 font-bold">{user?.endDate || 'Oct 10, 2026'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Card: Form */}
                    <div className="flex-1 w-full">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-10">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-[#fff9f2] flex items-center justify-center text-[#8a6d4b]">
                                    <UserCircle size={22} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                        <p className="font-medium text-gray-900">{formData.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                        <p className="font-medium text-gray-900">{formData.email || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                                        <p className="font-medium text-gray-900">{formData.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                                        <p className="font-medium text-gray-900">{formData.gender || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
                                        <p className="font-medium text-gray-900">{formData.dob || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Zip / Postal Code</p>
                                        <p className="font-medium text-gray-900">{formData.zip || '-'}</p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-50 pt-6">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Address (Street / PO Box)</p>
                                    <p className="font-medium text-gray-900">{formData.address || '-'}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">City</p>
                                        <p className="font-medium text-gray-900">{formData.city || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">State</p>
                                        <p className="font-medium text-gray-900">{formData.state || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Country</p>
                                        <p className="font-medium text-gray-900">{formData.country || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
