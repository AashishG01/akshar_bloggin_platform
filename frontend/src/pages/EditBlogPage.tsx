import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Send, Archive, Trash2, Plus, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import MotionReveal from '@/components/MotionReveal';

export default function EditBlogPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [status, setStatus] = useState('draft');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        const fetchBlog = async () => {
            try {
                const res = await api.get(`/blogs/${id}`);
                const blog = res.data.data || res.data;
                setTitle(blog.title);
                setContent(blog.content);
                setTags(blog.tags || []);
                setStatus(blog.status);
            } catch {
                setError('Blog not found or you don\'t have access');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id, isAuthenticated, navigate]);

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !tags.includes(tag) && tags.length < 5) {
            setTags([...tags, tag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const saveChanges = async () => {
        if (!title.trim()) { setError('Title is required'); return; }
        setSaving(true);
        setError('');
        try {
            await api.put(`/blogs/${id}`, { title, content, tags });
            navigate(-1);
        } catch {
            setError('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const publishBlog = async () => {
        if (!title.trim() || !content.trim()) { setError('Title and content are required to publish'); return; }
        setSaving(true);
        setError('');
        try {
            await api.put(`/blogs/${id}`, { title, content, tags });
            await api.patch(`/blogs/${id}/publish`);
            navigate('/blogs');
        } catch {
            setError('Failed to publish');
        } finally {
            setSaving(false);
        }
    };

    const archiveBlog = async () => {
        setSaving(true);
        try {
            await api.patch(`/blogs/${id}/archive`);
            navigate('/blogs');
        } catch {
            setError('Failed to archive');
        } finally {
            setSaving(false);
        }
    };

    const deleteBlog = async () => {
        if (!confirm('Are you sure? This cannot be undone.')) return;
        setSaving(true);
        try {
            await api.delete(`/blogs/${id}`);
            navigate('/blogs');
        } catch {
            setError('Failed to delete');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border border-text-muted border-t-indigo rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="pt-12 pb-8">
                <div className="max-w-3xl mx-auto px-6 lg:px-12">
                    <MotionReveal>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text-primary transition-colors duration-300"
                            >
                                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-300" />
                                Back
                            </button>

                            <div className="flex items-center gap-3">
                                {status !== 'archived' && (
                                    <button
                                        onClick={archiveBlog}
                                        disabled={saving}
                                        className="p-1.5 text-text-muted hover:text-saffron transition-colors disabled:opacity-40"
                                        title="Archive"
                                    >
                                        <Archive size={14} />
                                    </button>
                                )}
                                <button
                                    onClick={deleteBlog}
                                    disabled={saving}
                                    className="p-1.5 text-text-muted hover:text-rust transition-colors disabled:opacity-40"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <button
                                    onClick={saveChanges}
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text-primary transition-colors disabled:opacity-40"
                                >
                                    <Save size={11} />
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                                {status !== 'published' && (
                                    <motion.button
                                        onClick={publishBlog}
                                        disabled={saving}
                                        whileTap={{ scale: 0.97 }}
                                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-bg-primary bg-text-primary px-4 py-2 hover:bg-indigo-light transition-colors duration-300 disabled:opacity-40"
                                    >
                                        <Send size={11} />
                                        Publish
                                    </motion.button>
                                )}
                            </div>
                        </div>

                        {/* Status badge */}
                        <div className="mb-8">
                            <span className={'tag-stamp text-[9px] ' + (
                                status === 'published' ? 'text-green-400 border-green-400/40' :
                                    status === 'archived' ? 'text-text-muted border-text-muted/40' :
                                        'text-saffron border-saffron/40'
                            )}>
                                {status}
                            </span>
                        </div>
                    </MotionReveal>
                </div>
            </section>

            {/* Editor */}
            <section className="pb-24">
                <div className="max-w-3xl mx-auto px-6 lg:px-12">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 text-xs text-rust border border-rust/20 px-4 py-3"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Title */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full bg-transparent text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-text-primary placeholder:text-text-muted/30 border-none outline-none leading-tight tracking-tight"
                    />

                    <div className="mt-6 mb-8 w-12 h-px bg-gradient-to-r from-indigo to-transparent" />

                    {/* Tags */}
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="tag-stamp text-[9px] inline-flex items-center gap-1.5 cursor-pointer group"
                                    onClick={() => removeTag(tag)}
                                >
                                    {tag}
                                    <X size={8} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder={tags.length < 5 ? 'Add tags (press Enter)' : 'Max 5 tags'}
                                disabled={tags.length >= 5}
                                className="bg-transparent text-xs text-text-secondary placeholder:text-text-muted/40 border-b border-border focus:border-indigo outline-none pb-1 w-48 transition-colors duration-300 disabled:opacity-40"
                            />
                            {tagInput.trim() && tags.length < 5 && (
                                <button onClick={addTag} className="text-text-muted hover:text-indigo-light transition-colors">
                                    <Plus size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell your story..."
                        rows={24}
                        className="w-full bg-transparent text-text-secondary text-base leading-[1.9] placeholder:text-text-muted/30 border-none outline-none resize-none font-sans"
                    />

                    {/* Word count */}
                    <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
                            {content.split(/\s+/).filter(Boolean).length} words
                            <span className="mx-2">·</span>
                            {Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min read
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
