import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import type { User, Article } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getInitials, formatDate, readingTime } from '@/lib/utils';
import MotionReveal from '@/components/MotionReveal';
import SectionDivider from '@/components/SectionDivider';

export default function ProfilePage() {
    const { username } = useParams();
    const { user: currentUser, isAuthenticated } = useAuth();
    const [profile, setProfile] = useState<User | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/${username}`);
                const data = res.data.data || res.data;
                const profileData = data.user || data;
                // Convert ObjectId arrays to string arrays for comparison
                if (profileData.followers) {
                    profileData.followers = profileData.followers.map((f: unknown) => typeof f === 'object' && f !== null && '_id' in f ? (f as { _id: string })._id.toString() : String(f));
                }
                if (profileData.following) {
                    profileData.following = profileData.following.map((f: unknown) => typeof f === 'object' && f !== null && '_id' in f ? (f as { _id: string })._id.toString() : String(f));
                }
                setProfile(profileData);
                setArticles(data.articles || []);
                if (currentUser && profileData.followers?.includes(currentUser._id)) {
                    setFollowing(true);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username, currentUser]);

    const handleFollow = async () => {
        if (!profile || !isAuthenticated) return;
        try {
            const action = following ? 'unfollow' : 'follow';
            await api.post(`/users/${profile._id}/${action}`);
            setFollowing(!following);
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

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-muted text-sm">Author not found.</p>
            </div>
        );
    }

    const isOwn = currentUser?._id === profile._id;
    const stats = [
        { label: 'Articles', value: articles.length },
        { label: 'Followers', value: profile.followers?.length || 0 },
        { label: 'Following', value: profile.following?.length || 0 },
    ];

    return (
        <div className="min-h-screen">
            {/* Author Dossier Header */}
            <section className="pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <MotionReveal>
                        {/* Huge name */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text-primary leading-[0.95] tracking-tight">
                            {profile.name}
                        </h1>

                        {/* Username + bio */}
                        <p className="mt-4 text-text-muted text-sm">@{profile.username}</p>
                        {profile.bio && (
                            <p className="mt-4 text-text-secondary text-sm leading-relaxed max-w-lg">
                                {profile.bio}
                            </p>
                        )}

                        {/* Block-print accent line */}
                        <div className="mt-6 w-16 h-px bg-gradient-to-r from-indigo to-saffron" />

                        {/* Stats — horizontal minimal */}
                        <div className="mt-8 flex items-center gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex items-baseline gap-2">
                                    <span className="text-lg font-serif font-bold text-text-primary">{stat.value}</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Follow button */}
                        {isAuthenticated && !isOwn && (
                            <motion.button
                                onClick={handleFollow}
                                whileTap={{ scale: 0.97 }}
                                className={
                                    'mt-8 text-xs uppercase tracking-[0.15em] pb-0.5 border-b transition-all duration-500 ' +
                                    (following
                                        ? 'text-text-muted border-text-muted hover:text-rust hover:border-rust'
                                        : 'text-indigo-light border-indigo hover:text-saffron hover:border-saffron')
                                }
                            >
                                {following ? 'Unfollow' : 'Follow'}
                            </motion.button>
                        )}
                    </MotionReveal>
                </div>
            </section>

            <SectionDivider className="max-w-4xl mx-auto px-6 lg:px-12" />

            {/* Published articles */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <MotionReveal>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted mb-8">
                            Published · {articles.length}
                        </p>
                    </MotionReveal>

                    {articles.length === 0 ? (
                        <p className="text-text-muted text-sm py-8">No articles published yet.</p>
                    ) : (
                        <div className="space-y-0">
                            {articles.map((article, i) => (
                                <motion.div
                                    key={article._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.06 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={`/blogs/${article.slug}`}
                                        className="group block py-6 border-b border-border hover:border-border-hover transition-colors duration-300"
                                    >
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {article.tags.slice(0, 2).map((tag) => (
                                                        <span key={tag} className="tag-stamp text-[9px]">{tag}</span>
                                                    ))}
                                                </div>
                                                <h3 className="text-base font-serif font-bold text-text-primary group-hover:text-indigo-light transition-colors duration-300 leading-snug">
                                                    {article.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-2 text-[11px] text-text-muted">
                                                    <span>{formatDate(article.createdAt)}</span>
                                                    <span>·</span>
                                                    <span>{readingTime(article.content)}</span>
                                                    <span>·</span>
                                                    <span>{article.likesCount} likes</span>
                                                </div>
                                            </div>
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
