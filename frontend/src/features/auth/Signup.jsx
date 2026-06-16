import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register, user } = useContext(AuthContext);
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
        
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await register(name, email, password);
            // Navigation handled by useEffect when user state updates
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background font-inter flex-row-reverse">
            {/* Right Panel: Dynamic Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-[#111111] relative overflow-hidden flex-col items-center justify-center p-12 border-l border-[#222]">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_left,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                
                {/* Floating Abstract Shapes */}
                <div className="relative z-10 w-full max-w-md h-[400px]">
                    {/* Top Right Floating Box */}
                    <div className="absolute top-8 right-8 w-24 h-24 bg-[#E9E9E7] dark:bg-white rounded-xl shadow-2xl flex items-center justify-center animate-[bounce_4s_infinite]">
                        <div className="w-10 h-10 border-4 border-black rounded" />
                    </div>
                    
                    {/* Left Side Pulse Bar */}
                    <div className="absolute top-32 left-4 w-48 h-14 bg-[#2F2F2F] rounded-md shadow-2xl border border-[#444] animate-pulse flex items-center px-4 gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#0F7B6C]" />
                        <div className="flex-1 h-2 bg-[#555] rounded-full" />
                    </div>

                    {/* Bottom Center Mock User Card */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#191919] border border-[#333] rounded-xl shadow-2xl flex flex-col p-4 gap-4 animate-[bounce_5s_infinite]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#2F2F2F]" />
                            <div className="flex flex-col gap-1.5">
                                <div className="h-2 w-24 bg-[#555] rounded-full" />
                                <div className="h-2 w-16 bg-[#333] rounded-full" />
                            </div>
                        </div>
                        <div className="w-full h-8 bg-primary dark:bg-primary-dark text-white dark:text-black flex items-center justify-center text-[10px] font-bold rounded-md">
                            SYNCED
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-center mt-12">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Join the Network</h1>
                    <p className="text-[#9B9B9B] text-lg max-w-sm mx-auto leading-relaxed">
                        Create an account today to organize, execute, and deliver your projects seamlessly.
                    </p>
                </div>
            </div>

            {/* Left Panel: Minimalist Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
                {/* Mobile Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_left,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_left,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50 lg:hidden" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="w-12 h-12 bg-primary dark:bg-primary-dark text-white dark:text-black rounded-lg flex items-center justify-center text-2xl font-bold mx-auto lg:mx-0 mb-6 shadow-sm">
                            T
                        </div>
                        <h2 className="text-3xl font-extrabold text-text-main dark:text-text-mainDark tracking-tight mb-2">Create Account</h2>
                        <p className="text-text-muted dark:text-text-mutedDark">Set up your profile to get started.</p>
                    </div>

                    {error && <div className="bg-[#E03E3E]/10 border border-[#E03E3E]/20 text-[#E03E3E] p-4 rounded-md mb-6 text-sm font-medium">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-text-main dark:text-text-mainDark mb-2 uppercase tracking-wide">Full Name</label>
                            <input 
                                type="text" 
                                required
                                className="w-full px-4 py-3 bg-surface dark:bg-[#191919] border border-border dark:border-[#333] rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark placeholder:text-text-muted/50"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-text-mainDark mb-2 uppercase tracking-wide">Password</label>
                                <input 
                                    type="password" 
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-surface dark:bg-[#191919] border border-border dark:border-[#333] rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark placeholder:text-text-muted/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-text-mainDark mb-2 uppercase tracking-wide">Confirm</label>
                                <input 
                                    type="password" 
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-surface dark:bg-[#191919] border border-border dark:border-[#333] rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark placeholder:text-text-muted/50"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-3 px-4 mt-4 bg-primary dark:bg-primary-dark text-white dark:text-black font-bold rounded-md shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-transform active:scale-[0.98] hover:bg-[#2F2F2F] dark:hover:bg-[#E9E9E7] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating Account...' : 'Join TeamSync Pro'}
                        </button>
                    </form>
                    
                    <p className="mt-8 text-center lg:text-left text-sm text-text-muted dark:text-text-mutedDark">
                        Already have an account? <Link to="/login" className="text-primary hover:underline font-bold transition-colors ml-1">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
