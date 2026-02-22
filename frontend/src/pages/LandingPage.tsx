import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Feather, Users, Sparkles, BookOpen, Info } from 'lucide-react';
import api from '@/lib/api';
import type { Article } from '@/types';
import { useAuth } from '@/context/AuthContext';
import BlogCard from '@/components/BlogCard';
import MotionReveal from '@/components/MotionReveal';
import SectionDivider from '@/components/SectionDivider';
import { FALLBACK_ARTICLES } from '@/lib/fallbackData';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: Feather,
        title: 'Effortless Writing',
        description: 'A distraction-free experience that lets your ideas flow naturally.',
    },
    {
        icon: Users,
        title: 'Vibrant Community',
        description: 'Connect with thinkers and writers who share your passions.',
    },
    {
        icon: Sparkles,
        title: 'Premium Experience',
        description: 'Beautiful typography, immersive reading, and thoughtful design.',
    },
    {
        icon: BookOpen,
        title: 'Samvaad',
        description: 'Meaningful conversation that sparks deeper understanding.',
    },
];

export default function LandingPage() {
    const { isAuthenticated } = useAuth();
    const [blogs, setBlogs] = useState<Article[]>([]);
    const [usingFallback, setUsingFallback] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        api.get('/blogs?limit=5')
            .then((res) => {
                setBlogs(res.data.data || res.data || []);
                setUsingFallback(false);
            })
            .catch(() => {
                setBlogs(FALLBACK_ARTICLES);
                setUsingFallback(true);
            });
    }, []);

    // GSAP hero parallax
    useEffect(() => {
        if (!titleRef.current || !heroRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to(titleRef.current, {
                y: -120,
                opacity: 0.3,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div>
            {/* ===== HERO ===== */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex items-center overflow-hidden"
            >
                {/* Subtle color washes */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo/[0.04] to-transparent" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-rust/[0.03] to-transparent" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        {/* Devanagari whisper */}
                        <p className="font-devanagari text-text-muted text-xs tracking-[0.3em] mb-8">
                            अक्षर · लेखन · संवाद
                        </p>

                        {/* Brutalist headline — left-aligned, huge */}
                        <h1
                            ref={titleRef}
                            className="font-serif font-bold tracking-tight leading-[0.9]"
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                                className="block text-[clamp(3.5rem,10vw,8rem)] text-text-primary"
                            >
                                Akshar.
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                                className="block text-[clamp(1.25rem,3vw,1.75rem)] text-text-secondary font-sans font-light mt-4 max-w-lg"
                            >
                                Write with depth.
                            </motion.span>
                        </h1>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
                            className="mt-12 flex items-center gap-6"
                        >
                            <Link
                                to={isAuthenticated ? '/create' : '/blogs'}
                                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-primary border-b border-text-muted pb-1 hover:border-indigo-light hover:text-indigo-light transition-all duration-500"
                            >
                                {isAuthenticated ? 'Begin Writing' : 'Start Reading'}
                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                            {isAuthenticated ? (
                                <Link
                                    to="/feed"
                                    className="text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text-primary transition-colors duration-300"
                                >
                                    Your Feed
                                </Link>
                            ) : (
                                <Link
                                    to="/register"
                                    className="text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text-primary transition-colors duration-300"
                                >
                                    Join
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1 }}
                    className="absolute bottom-10 left-6 lg:left-12"
                >
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-[9px] uppercase tracking-[0.3em] text-text-muted">Scroll</span>
                        <div className="w-px h-8 bg-gradient-to-b from-text-muted to-transparent" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ===== FEATURED STORIES — BROKEN GRID ===== */}
            {blogs.length > 0 && (
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <MotionReveal className="flex items-end justify-between mb-12">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted mb-2">Featured</p>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
                                    Stories worth reading
                                </h2>
                            </div>
                            <Link
                                to="/blogs"
                                className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-text-primary transition-colors duration-300"
                            >
                                View all <ArrowRight size={11} />
                            </Link>
                        </MotionReveal>

                        {/* Broken 12-col grid */}
                        <div className="grid grid-cols-12 gap-1">
                            {/* Large feature */}
                            {blogs[0] && (
                                <div className="col-span-12 lg:col-span-8">
                                    <BlogCard blog={blogs[0]} variant="large" index={0} />
                                </div>
                            )}

                            {/* Stacked small */}
                            <div className="col-span-12 lg:col-span-4 flex flex-col gap-1">
                                {blogs[1] && <BlogCard blog={blogs[1]} index={1} />}
                                {blogs[2] && <BlogCard blog={blogs[2]} index={2} />}
                            </div>

                            {/* Wide horizontal */}
                            {blogs[3] && (
                                <div className="col-span-12">
                                    <BlogCard blog={blogs[3]} variant="wide" index={3} />
                                </div>
                            )}

                            {/* Two columns */}
                            {blogs[4] && (
                                <div className="col-span-12 lg:col-span-6">
                                    <BlogCard blog={blogs[4]} index={4} />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <SectionDivider accent="·" className="max-w-7xl mx-auto px-6 lg:px-12" />

            {/* ===== WHY SECTION ===== */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <MotionReveal className="mb-16">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted mb-2">Philosophy</p>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
                            Why Akshar?
                        </h2>
                    </MotionReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
                        {features.map((feature, i) => (
                            <MotionReveal key={feature.title} delay={i * 0.08} className="bg-bg-primary p-8">
                                <feature.icon size={18} className="text-text-muted mb-6" />
                                <h3 className="text-sm font-semibold text-text-primary mb-2 tracking-wide">
                                    {feature.title}
                                </h3>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    {feature.description}
                                </p>
                            </MotionReveal>
                        ))}
                    </div>
                </div>
            </section>

            <SectionDivider className="max-w-7xl mx-auto px-6 lg:px-12" />

            {/* ===== CTA ===== */}
            <section className="py-32">
                <MotionReveal className="max-w-7xl mx-auto px-6 lg:px-12">
                    <p className="font-devanagari text-text-muted text-xs mb-6">संवाद शुरू करें</p>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-text-primary leading-tight max-w-2xl">
                        Ready to share your{' '}
                        <span className="gradient-text">thoughts</span>?
                    </h2>
                    <p className="mt-5 text-sm text-text-secondary max-w-md">
                        Join a community of thinkers. Start your journey today.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 mt-10 text-xs uppercase tracking-[0.15em] text-text-primary border-b border-indigo pb-1 hover:border-saffron hover:text-saffron transition-all duration-500"
                    >
                        Begin Writing
                        <Feather size={12} />
                    </Link>
                </MotionReveal>
            </section>
        </div>
    );
}
