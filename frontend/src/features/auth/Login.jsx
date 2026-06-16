import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect to dashboard if already logged in (prevents race condition)
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Navigation handled by useEffect when user state updates
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background font-inter">
            {/* Left Panel: Dynamic Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-[#111111] relative overflow-hidden flex-col items-center justify-center p-12 border-r border-[#222]">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                
                {/* Floating Abstract Shapes */}
                <div className="relative z-10 w-full max-w-md h-[400px]">
                    {/* Top Left Floating Box */}
                    <div className="absolute top-8 left-8 w-20 h-20 bg-[#E9E9E7] dark:bg-white rounded-lg shadow-2xl flex items-center justify-center animate-[bounce_4s_infinite]">
                        <div className="w-8 h-8 border-4 border-black rounded-full" />
                    </div>
                    
                    {/* Right Side Pulse Bar */}
                    <div className="absolute top-24 right-4 w-40 h-14 bg-[#2F2F2F] rounded-md shadow-2xl border border-[#444] animate-pulse flex items-center px-4 gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#E03E3E]" />
                        <div className="h-2 w-16 bg-[#555] rounded-full" />
                    </div>

                    {/* Bottom Center Mock Card */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-40 bg-[#191919] border border-[#333] rounded-xl shadow-2xl flex flex-col p-5 gap-3 animate-[bounce_5s_infinite]">
                        <div className="flex items-center gap-3 border-b border-[#333] pb-3">
                            <div className="w-8 h-8 rounded bg-[#2F2F2F] flex items-center justify-center">
                                <span className="text-white text-xs font-bold">T</span>
                            </div>
                            <div className="h-3 w-20 bg-[#2F2F2F] rounded-full" />
                        </div>
                        <div className="flex-1 flex flex-col gap-2 mt-1">
                            <div className="w-full h-2 bg-[#2F2F2F] rounded-full" />
                            <div className="w-5/6 h-2 bg-[#2F2F2F] rounded-full" />
                            <div className="w-4/6 h-2 bg-[#2F2F2F] rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-center mt-12">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">TeamSync Pro</h1>
                    <p className="text-[#9B9B9B] text-lg max-w-sm mx-auto leading-relaxed">
                        Seamless collaboration. Hyper-minimalist execution. Elevate your team's workflow today.
                    </p>
                </div>
            </div>

            {/* Right Panel: Minimalist Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
                {/* Mobile Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50 lg:hidden" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="w-12 h-12 bg-primary dark:bg-primary-dark text-white dark:text-black rounded-lg flex items-center justify-center text-2xl font-bold mx-auto lg:mx-0 mb-6 shadow-sm">
                            T
                        </div>
                        <h2 className="text-3xl font-extrabold text-text-main dark:text-text-mainDark tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-text-muted dark:text-text-mutedDark">Enter your details to access your workspace.</p>
                    </div>

                    {error && <div className="bg-[#E03E3E]/10 border border-[#E03E3E]/20 text-[#E03E3E] p-4 rounded-md mb-6 text-sm font-medium">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-text-main dark:text-text-mainDark mb-2 uppercase tracking-wide">Email Address</label>
                            <input 
                                type="email" 
                                required
                                className="w-full px-4 py-3 bg-surface dark:bg-[#191919] border border-border dark:border-[#333] rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark placeholder:text-text-muted/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-main dark:text-text-mainDark mb-2 uppercase tracking-wide">Password</label>
                            <input 
                                type="password" 
                                required
                                className="w-full px-4 py-3 bg-surface dark:bg-[#191919] border border-border dark:border-[#333] rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark placeholder:text-text-muted/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-3 px-4 mt-2 bg-primary dark:bg-primary-dark text-white dark:text-black font-bold rounded-md shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-transform active:scale-[0.98] hover:bg-[#2F2F2F] dark:hover:bg-[#E9E9E7] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>
                    
                    <p className="mt-8 text-center lg:text-left text-sm text-text-muted dark:text-text-mutedDark">
                        Don't have an account? <Link to="/signup" className="text-primary hover:underline font-bold transition-colors ml-1">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
