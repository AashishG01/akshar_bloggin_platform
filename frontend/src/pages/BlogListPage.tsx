import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import type { Article } from '@/types';
import BlogCard from '@/components/BlogCard';
import MotionReveal from '@/components/MotionReveal';
import { FALLBACK_ARTICLES } from '@/lib/fallbackData';

export default function BlogListPage() {
    const [blogs, setBlogs] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [activeTag, setActiveTag] = useState('');

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const q = searchParams.get('search');
                const endpoint = q ? `/blogs/search?q=${encodeURIComponent(q)}` : '/blogs';
                const res = await api.get(endpoint);
                setBlogs(res.data.data || res.data || []);
                setUsingFallback(false);
            } catch {
                setBlogs(FALLBACK_ARTICLES);
                setUsingFallback(true);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            setSearchParams({ search: search.trim() });
        } else {
            setSearchParams({});
        }
    };

    const allTags = [...new Set(blogs.flatMap((b) => b.tags))].slice(0, 8);
    const filtered = activeTag ? blogs.filter((b) => b.tags.includes(activeTag)) : blogs;

    // Breaking the grid pattern
    const getVariant = (i: number): 'large' | 'wide' | 'default' => {
        if (i === 0) return 'large';
        if (i === 3 || i === 7) return 'wide';
        return 'default';
    };

    const getColSpan = (i: number) => {
        if (i === 0) return 'col-span-12 lg:col-span-8';
        if (i === 1 || i === 2) return 'col-span-12 sm:col-span-6 lg:col-span-4';
        if (i === 3 || i === 7) return 'col-span-12';
        if (i % 5 === 4) return 'col-span-12 sm:col-span-6 lg:col-span-5';
        if (i % 5 === 0) return 'col-span-12 sm:col-span-6 lg:col-span-7';
        return 'col-span-12 sm:col-span-6';
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <MotionReveal>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted mb-2">Explore</p>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary">
                            All Stories
                        </h1>
                    </MotionReveal>

                    {/* Search */}
                    <MotionReveal delay={0.1} className="mt-8">
                        <form onSubmit={handleSearch} className="flex items-center gap-3 border-b border-border pb-3 max-w-lg">
                            <Search size={14} className="text-text-muted" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
                            />
                        </form>
                    </MotionReveal>

                    {/* Tags */}
                    {allTags.length > 0 && (
                        <MotionReveal delay={0.15} className="mt-6 flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveTag('')}
                                className={'tag-stamp ' + (!activeTag ? 'text-saffron border-saffron' : '')}
                            >
                                All
                            </button>
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                                    className={'tag-stamp ' + (activeTag === tag ? 'text-saffron border-saffron' : '')}
                                >
                                    {tag}
                                </button>
                            ))}
                        </MotionReveal>
                    )}
                </div>
            </section>

            {/* Grid */}
            <section className="pb-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {loading ? (
                        <div className="grid grid-cols-12 gap-1">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className={
                                        'bg-bg-elevated animate-pulse ' +
                                        (i === 0 ? 'col-span-12 lg:col-span-8 h-64' :
                                            i < 3 ? 'col-span-6 lg:col-span-4 h-48' :
                                                'col-span-12 sm:col-span-6 h-44')
                                    }
                                />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-text-muted text-sm">No stories found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-12 gap-1">
                            {filtered.map((blog, i) => (
                                <div key={blog._id} className={getColSpan(i)}>
                                    <BlogCard blog={blog} variant={getVariant(i)} index={i} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
