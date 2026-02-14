import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="relative textile-border-top">
            {/* Mandala line-art at 3% */}
            <div className="absolute inset-0 mandala-bg opacity-[0.03]" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-5">
                        <p className="font-serif text-lg font-bold text-text-primary tracking-tight">
                            Akshar<span className="text-indigo">.</span>
                        </p>
                        <p className="mt-4 text-text-secondary text-sm leading-relaxed max-w-sm">
                            A platform for modern Indian thinkers. Write with depth, read with intention.
                        </p>
                        <p className="mt-4 font-devanagari text-text-muted text-xs">
                            अक्षर · लेखन · संवाद
                        </p>
                    </div>

                    {/* Navigate */}
                    <div className="md:col-span-3 md:col-start-7">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-4">Navigate</p>
                        <ul className="space-y-2.5">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/blogs', label: 'Explore' },
                                { to: '/feed', label: 'Feed' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="md:col-span-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-4">Account</p>
                        <ul className="space-y-2.5">
                            {[
                                { to: '/login', label: 'Sign In' },
                                { to: '/register', label: 'Create Account' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-text-muted text-[11px] tracking-wider">
                        © {new Date().getFullYear()} Akshar
                    </p>
                    <p className="text-text-muted text-[11px] tracking-wider">
                        Built with <span className="text-saffron">♥</span> by Aashish
                    </p>
                </div>
            </div>
        </footer>
    );
}
