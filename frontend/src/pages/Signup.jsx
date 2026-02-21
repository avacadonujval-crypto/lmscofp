import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Asterisk, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password);
        if (result.success) {
            navigate('/user-dashboard'); // Or Login if verification needed
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
                    <div className="bg-transparent p-1.5 rounded-lg">
                        <Asterisk className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-widest">COFP</span>
                </div>

                {/* Hero Text */}
                <div className="z-10 mt-10">
                    <h1 className="text-6xl font-bold leading-tight mb-6">
                        Join the<br />
                        Council
                        <span className='ml-4'>Revolution.</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                        Create your account to access exclusive materials, participate in secure video meetings, and collaborate with your peers.
                    </p>
                </div>

                {/* Decorative background circle effect */}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#633418] rounded-full opacity-10 blur-3xl pointer-events-none"></div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h2>
                        <p className="text-gray-500">Create your account to join the council.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cca466] focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                            <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters long.</p>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0f172a] hover:bg-[#633418] transition-all transform hover:-translate-y-0.5"
                        >
                            Create Account
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Already have an account? <Link to="/login" className="text-[#633418] font-bold cursor-pointer hover:underline">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
