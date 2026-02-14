import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import type { Article, Comment } from '@/types';
import { formatDate, readingTime, getInitials } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import LikeButton from '@/components/LikeButton';
import MotionReveal from '@/components/MotionReveal';
import SectionDivider from '@/components/SectionDivider';

export default function BlogReadingPage() {
    const { slug } = useParams();
    const { isAuthenticated, user } = useAuth();
    const [blog, setBlog] = useState<Article | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [focusMode, setFocusMode] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await api.get(`/blogs/slug/${slug}`);
                setBlog(res.data.data || res.data);
                const commentsRes = await api.get(`/blogs/${(res.data.data || res.data)._id}/comments`);
                setComments(commentsRes.data.data || commentsRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    // Scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(total > 0 ? window.scrollY / total : 0);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !blog) return;
        try {
            const res = await api.post(`/blogs/${blog._id}/comments`, { content: newComment });
            setComments((prev) => [res.data.data || res.data, ...prev]);
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border border-text-muted border-t-indigo rounded-full animate-spin" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-muted text-sm">Article not found.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Scroll progress */}
            <div
                className="scroll-progress"
                style={{ transform: `scaleX(${scrollProgress})` }}
            />

            {/* Focus mode toggle */}
            <button
                onClick={() => setFocusMode(!focusMode)}
                className="fixed top-20 right-6 z-40 p-2 text-text-muted hover:text-text-primary transition-colors duration-300"
                title={focusMode ? 'Exit Focus' : 'Focus Mode'}
            >
                {focusMode ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            {/* Article header */}
            <section className={
                'pt-16 pb-12 transition-all duration-500 ' +
                (focusMode ? 'focus-blur' : '')
            }>
                <div className="max-w-3xl mx-auto px-6">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-text-muted hover:text-text-primary transition-colors mb-10"
                    >
                        <ArrowLeft size={11} /> Back
                    </Link>

                    <MotionReveal>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {blog.tags.map((tag) => (
                                <span key={tag} className="tag-stamp">{tag}</span>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-text-primary leading-tight">
                            {blog.title}
                        </h1>

                        <div className="flex items-center gap-4 mt-8 text-text-secondary text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-[10px] font-bold text-text-muted">
                                    {getInitials(blog.author?.name || 'A')}
                                </div>
                                <Link
                                    to={`/profile/${blog.author?.username}`}
                                    className="hover:text-text-primary transition-colors"
                                >
                                    {blog.author?.name}
                                </Link>
                            </div>
                            <span className="text-text-muted">·</span>
                            <span>{formatDate(blog.createdAt)}</span>
                            <span className="text-text-muted">·</span>
                            <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {readingTime(blog.content)}
                            </span>
                        </div>
                    </MotionReveal>
                </div>
            </section>

            {/* Article body */}
            <section className="pb-16">
                <MotionReveal className="max-w-3xl mx-auto px-6">
                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </MotionReveal>
            </section>

            {/* Like + Share strip */}
            <div className={
                'max-w-3xl mx-auto px-6 py-6 border-t border-b border-border flex items-center justify-between transition-all duration-500 ' +
                (focusMode ? 'focus-blur' : '')
            }>
                <LikeButton
                    blogId={blog._id}
                    initialLiked={blog.likes?.includes(user?._id || '')}
                    initialCount={blog.likesCount}
                />
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
                    {comments.length} comment{comments.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Comments / Samvaad */}
            <section className={
                'py-16 transition-all duration-500 ' +
                (focusMode ? 'focus-blur' : '')
            }>
                <div className="max-w-3xl mx-auto px-6">
                    <SectionDivider accent="संवाद" className="mb-12" />

                    <h2 className="text-lg font-serif font-bold text-text-primary mb-8">
                        Samvaad
                    </h2>

                    {/* Comment form */}
                    {isAuthenticated && (
                        <form onSubmit={handleComment} className="mb-12">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                rows={3}
                                className="w-full bg-bg-elevated border border-border p-4 text-sm text-text-primary placeholder:text-text-muted outline-none resize-none focus:border-indigo/30 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="mt-3 text-xs uppercase tracking-[0.15em] text-indigo-light border-b border-indigo pb-0.5 hover:text-saffron hover:border-saffron transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Post comment
                            </button>
                        </form>
                    )}

                    {/* Comments list */}
                    <div className="space-y-8">
                        {comments.map((comment, i) => (
                            <motion.div
                                key={comment._id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className="accent-border-left"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-medium text-text-primary">
                                        {comment.author?.name}
                                    </span>
                                    <span className="text-[10px] text-text-muted">
                                        {formatDate(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {comment.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {comments.length === 0 && (
                        <p className="text-text-muted text-sm text-center py-8">
                            No comments yet. Start the samvaad.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
