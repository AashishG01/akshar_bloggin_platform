import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Plus, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import MotionReveal from '@/components/MotionReveal';

export default function CreateBlogPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [publishing, setPublishing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const saveDraft = async () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await api.post('/blogs', { title, content, tags });
            navigate('/blogs');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save draft';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const publishArticle = async () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        if (!content.trim()) {
            setError('Content is required to publish');
            return;
        }
        setPublishing(true);
        setError('');
        try {
            // Create as draft first, then publish
            const res = await api.post('/blogs', { title, content, tags });
            const blogId = res.data.data._id;
            await api.patch(`/blogs/${blogId}/publish`);
            navigate(`/blogs/${res.data.data.slug}`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to publish';
            setError(message);
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="pt-12 pb-8">
                <div className="max-w-3xl mx-auto px-6 lg:px-12">
                    <MotionReveal>
                        <div className="flex items-center justify-between mb-12">
                            <button
                                onClick={() => navigate(-1)}
                                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text-primary transition-colors duration-300"
                            >
                                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-300" />
                                Back
                            </button>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={saveDraft}
                                    disabled={saving || publishing}
                                    className="text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text-primary transition-colors duration-300 disabled:opacity-40"
                                >
                                    {saving ? 'Saving...' : 'Save Draft'}
                                </button>
                                <motion.button
                                    onClick={publishArticle}
                                    disabled={saving || publishing}
                                    whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-bg-primary bg-text-primary px-4 py-2 hover:bg-indigo-light transition-colors duration-300 disabled:opacity-40"
                                >
                                    <Send size={11} />
                                    {publishing ? 'Publishing...' : 'Publish'}
                                </motion.button>
                            </div>
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
                    <MotionReveal>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full bg-transparent text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-text-primary placeholder:text-text-muted/30 border-none outline-none leading-tight tracking-tight"
                        />
                    </MotionReveal>

                    {/* Thin accent line */}
                    <div className="mt-6 mb-8 w-12 h-px bg-gradient-to-r from-indigo to-transparent" />

                    {/* Tags */}
                    <MotionReveal>
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
                                    onKeyDown={handleKeyDown}
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
                    </MotionReveal>

                    {/* Content */}
                    <MotionReveal>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tell your story..."
                            rows={24}
                            className="w-full bg-transparent text-text-secondary text-base leading-[1.9] placeholder:text-text-muted/30 border-none outline-none resize-none font-sans"
                        />
                    </MotionReveal>

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
