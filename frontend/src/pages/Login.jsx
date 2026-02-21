import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Asterisk, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            if (result.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {/* Left Side - Dark Branding Area */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-white p-16 flex-col relative justify-center">
                {/* Logo Area */}
                <div className="flex items-center gap-2 absolute top-16 left-16">
                    <Asterisk className="text-white w-8 h-8" />
                    <span className="text-xl font-bold tracking-widest">COFP</span>
                </div>

                {/* Hero Text */}
                <div className="z-10 mt-10"> {/* Added mt-10 to offset visual center slightly if needed, or keeping plain */}
                    <h1 className="text-6xl font-bold leading-tight mb-6">
                        Empowering Your<br />
                        Council<br />
                        Workspace.
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                        Access exclusive resources, manage duties, and connect with members in one unified secure platform.
                    </p>
                </div>

                {/* Decorative background circle effect */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl pointer-events-none"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
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
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cca466] focus:border-transparent outline-none transition-all"
                                    placeholder="name@example.com"
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
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cca466] focus:border-transparent outline-none transition-all font-mono"
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-[#cca466] focus:ring-[#cca466] border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            {/* Forgot password link could go here */}
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#cca466] hover:bg-[#b8935c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cca466] transition-colors"
                        >
                            Sign In
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Don't have an account? <span className="text-gray-900 font-bold cursor-pointer">Contact Admin</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
