import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface LikeButtonProps {
    blogId: string;
    initialLiked?: boolean;
    initialCount: number;
}

export default function LikeButton({ blogId, initialLiked = false, initialCount }: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [animating, setAnimating] = useState(false);
    const { isAuthenticated } = useAuth();

    const handleLike = async () => {
        if (!isAuthenticated) return;
        try {
            if (liked) {
                await api.post(`/blogs/${blogId}/unlike`);
                setCount((c) => c - 1);
            } else {
                await api.post(`/blogs/${blogId}/like`);
                setCount((c) => c + 1);
                setAnimating(true);
                setTimeout(() => setAnimating(false), 600);
            }
            setLiked(!liked);
        } catch (err) {
            console.error('Like failed:', err);
        }
    };

    return (
        <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.92 }}
            className={
                'flex items-center gap-2 text-sm transition-colors duration-300 ' +
                (liked ? 'text-saffron' : 'text-text-muted hover:text-text-primary')
            }
            disabled={!isAuthenticated}
        >
            <Heart
                size={16}
                className={
                    'transition-all duration-300 ' +
                    (liked ? 'fill-saffron text-saffron' : '') +
                    (animating ? ' like-sweep' : '')
                }
            />
            <span className="text-xs tabular-nums">{count}</span>
        </motion.button>
    );
}
