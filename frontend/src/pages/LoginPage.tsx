import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
            {/* Subtle washes */}
            <div className="absolute top-1/3 right-0 w-1/3 h-1/2 bg-gradient-to-l from-indigo/[0.03] to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative w-full max-w-sm px-6"
            >
                {/* Header */}
                <div className="mb-10">
                    <Link to="/" className="font-serif text-lg font-bold text-text-primary tracking-tight">
                        Akshar<span className="text-indigo">.</span>
                    </Link>
                    <h1 className="mt-8 text-2xl font-serif font-bold text-text-primary">Welcome back</h1>
                    <p className="mt-2 text-text-muted text-sm">Continue your journey</p>
                </div>

                {/* Form — no card, no borders, just fields */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-rust text-xs"
                        >
                            {error}
                        </motion.p>
                    )}

                    <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted block mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-border pb-2 text-sm text-text-primary outline-none focus:border-indigo/50 transition-colors placeholder:text-text-muted"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted block mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-border pb-2 text-sm text-text-primary outline-none focus:border-indigo/50 transition-colors placeholder:text-text-muted pr-8"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-0 text-text-muted hover:text-text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-primary border-b border-indigo pb-0.5 hover:text-indigo-light transition-all duration-300 disabled:opacity-40"
                    >
                        {loading ? 'Signing in...' : (
                            <>
                                Sign In <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-10 text-text-muted text-xs">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-light hover:text-saffron transition-colors duration-300">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
