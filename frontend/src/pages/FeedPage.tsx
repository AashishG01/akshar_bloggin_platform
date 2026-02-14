import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Heart } from 'lucide-react';
import api from '@/lib/api';
import type { Article } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { formatDate, readingTime, truncateText, getInitials } from '@/lib/utils';
import MotionReveal from '@/components/MotionReveal';
import SectionDivider from '@/components/SectionDivider';

export default function FeedPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        api.get('/feed')
            .then((res) => setArticles(res.data.data || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="pt-16 pb-12">
                <div className="max-w-3xl mx-auto px-6 lg:px-12">
                    <MotionReveal>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted mb-2">Your Feed</p>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
                            Latest from people you follow
                        </h1>
                    </MotionReveal>
                </div>
            </section>

            <SectionDivider className="max-w-3xl mx-auto px-6 lg:px-12 mb-8" />

            {/* Timeline */}
            <section className="pb-24">
                <div className="max-w-3xl mx-auto px-6 lg:px-12">
                    {loading ? (
                        <div className="space-y-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-4 bg-bg-elevated w-1/3 mb-3" />
                                    <div className="h-3 bg-bg-elevated w-2/3 mb-2" />
                                    <div className="h-3 bg-bg-elevated w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-text-muted text-sm mb-4">Your feed is empty.</p>
                            <Link
                                to="/blogs"
                                className="text-xs uppercase tracking-[0.15em] text-indigo-light border-b border-indigo pb-0.5 hover:text-saffron hover:border-saffron transition-all duration-300"
                            >
                                Discover writers
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {articles.map((article, i) => (
                                <motion.div
                                    key={article._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={`/blogs/${article.slug}`}
                                        className="group block py-8 border-b border-border hover:border-border-hover transition-colors duration-300"
                                    >
                                        {/* Author */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-[10px] font-bold text-text-muted">
                                                {getInitials(article.author?.name || 'A')}
                                            </div>
                                            <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                                                {article.author?.name}
                                            </span>
                                            <span className="text-[10px] text-text-muted">{formatDate(article.createdAt)}</span>
                                        </div>

                                        {/* Title + excerpt */}
                                        <h3 className="text-lg font-serif font-bold text-text-primary group-hover:text-indigo-light transition-colors duration-300 leading-snug mb-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-text-secondary leading-relaxed mb-3 max-w-xl">
                                            {truncateText(article.content.replace(/<[^>]*>/g, ''), 140)}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-[11px] text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <Clock size={9} />
                                                {readingTime(article.content)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Heart size={9} />
                                                {article.likesCount}
                                            </span>
                                            {article.tags.slice(0, 2).map((tag) => (
                                                <span key={tag} className="tag-stamp text-[9px]">{tag}</span>
                                            ))}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
