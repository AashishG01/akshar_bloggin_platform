import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Heart } from 'lucide-react';
import type { Article } from '@/types';
import { formatDate, readingTime, truncateText, getInitials } from '@/lib/utils';

interface BlogCardProps {
    blog: Article;
    variant?: 'large' | 'default' | 'wide';
    index?: number;
}

export default function BlogCard({ blog, variant = 'default', index = 0 }: BlogCardProps) {
    const isLarge = variant === 'large';
    const isWide = variant === 'wide';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: '-30px' }}
            className="h-full"
        >
            <Link to={`/blogs/${blog.slug}`} className="group block h-full">
                <article
                    className={
                        'h-full flex flex-col bg-bg-elevated border-l-2 border-transparent ' +
                        'hover:border-l-indigo transition-all duration-500 ' +
                        (isLarge ? 'p-8 lg:p-10' : isWide ? 'p-6 lg:p-8' : 'p-6')
                    }
                >
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag-stamp">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h3
                        className={
                            'font-serif font-bold text-text-primary group-hover:text-indigo-light transition-colors duration-300 ' +
                            (isLarge ? 'text-2xl lg:text-3xl leading-tight mb-4' : 'text-lg leading-snug mb-3')
                        }
                    >
                        {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p
                        className={
                            'text-text-secondary leading-relaxed flex-1 ' +
                            (isLarge ? 'text-sm mb-6 max-w-lg' : 'text-sm mb-4')
                        }
                    >
                        {truncateText(blog.content.replace(/<[^>]*>/g, ''), isLarge ? 180 : 100)}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-text-muted text-[10px] font-bold shrink-0">
                                {getInitials(blog.author?.name || 'A')}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-text-primary truncate">{blog.author?.name}</p>
                                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                                    <span>{formatDate(blog.createdAt)}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={9} />
                                        {readingTime(blog.content)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-text-muted text-[11px] shrink-0 ml-3">
                            <Heart size={12} />
                            <span>{blog.likesCount}</span>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
