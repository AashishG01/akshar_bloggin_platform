import { motion } from 'framer-motion';

interface MotionRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    y?: number;
}

export default function MotionReveal({ children, className = '', delay = 0, y = 30 }: MotionRevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: '-50px' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
