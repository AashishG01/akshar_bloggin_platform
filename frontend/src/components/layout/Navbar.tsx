import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Search, LogOut, User, Feather, Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/blogs', label: 'Explore' },
        ...(isAuthenticated ? [{ to: '/feed', label: 'Feed' }] : []),
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link to="/" className="font-serif text-lg font-bold text-text-primary tracking-tight">
                        Akshar<span className="text-indigo">.</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-text-primary transition-colors duration-300"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                        >
                            <Search size={15} />
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-1.5 text-text-muted hover:text-saffron transition-colors duration-300"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/create"
                                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-indigo-light transition-colors"
                                >
                                    <Feather size={13} />
                                    Write
                                </Link>
                                <Link
                                    to="/notifications"
                                    className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                                >
                                    <Bell size={15} />
                                </Link>
                                <Link
                                    to={`/profile/${user?.username}`}
                                    className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                                >
                                    <User size={15} />
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                                >
                                    <LogOut size={15} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-xs uppercase tracking-[0.15em] px-4 py-1.5 border border-indigo/40 text-indigo-light hover:bg-indigo/10 transition-all duration-300"
                                >
                                    Join
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-1.5 text-text-secondary"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Search overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border overflow-hidden"
                    >
                        <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-6 lg:px-12 py-3">
                            <div className="flex items-center gap-3">
                                <Search size={14} className="text-text-muted" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search articles..."
                                    className="w-full bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="text-text-muted hover:text-text-primary text-[10px] uppercase tracking-wider"
                                >
                                    Esc
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-border overflow-hidden bg-bg-primary"
                    >
                        <div className="px-6 py-5 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-border" />
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/create"
                                        onClick={() => setMobileOpen(false)}
                                        className="text-xs uppercase tracking-[0.15em] text-indigo-light hover:text-text-primary"
                                    >
                                        ✍ Write
                                    </Link>
                                    <Link
                                        to="/notifications"
                                        onClick={() => setMobileOpen(false)}
                                        className="text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-text-primary"
                                    >
                                        Notifications
                                    </Link>
                                    <Link
                                        to={`/profile/${user?.username}`}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-text-primary"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="text-left text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-text-primary"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-xs uppercase tracking-[0.15em] text-text-secondary">Sign In</Link>
                                    <Link to="/register" onClick={() => setMobileOpen(false)} className="text-xs uppercase tracking-[0.15em] text-indigo-light">Join</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
