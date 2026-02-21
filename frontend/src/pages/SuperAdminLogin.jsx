import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const SuperAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.post('http://127.0.0.1:5000/api/superadmin/login', {
                email,
                password
            });

            // Store super admin data in localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));

            // Navigate to super admin dashboard
            navigate('/superadmin-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {/* Left Side - Dark Branding Area */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1e1e1e] to-[#0f172a] text-white p-16 flex-col relative justify-center">
                {/* Logo Area */}
                <div className="flex items-center gap-2 absolute top-16 left-16">
                    <Shield className="text-yellow-400 w-10 h-10" />
                    <span className="text-xl font-bold tracking-widest">SUPER ADMIN</span>
                </div>

                {/* Hero Text */}
                <div className="z-10 mt-10">
                    <h1 className="text-6xl font-bold leading-tight mb-6">
                        Super Admin<br />
                        Control<br />
                        Center.
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                        Manage administrators, oversee system operations, and maintain complete control over the platform.
                    </p>
                </div>

                {/* Decorative background circle effect */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-yellow-50 rounded-xl">
                                <Shield className="w-8 h-8 text-yellow-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Super Admin</h2>
                                <p className="text-sm text-yellow-600 font-semibold">Elevated Access Portal</p>
                            </div>
                        </div>
                        <p className="text-gray-500">Please enter your super admin credentials.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                    placeholder="superadmin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all font-mono"
                                    placeholder="........"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Access Super Admin Portal'}
                        </button>

                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                            <p className="text-xs text-gray-600 text-center">
                                <Shield className="inline w-4 h-4 mr-1 text-yellow-600" />
                                This portal is restricted to authorized super administrators only.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
