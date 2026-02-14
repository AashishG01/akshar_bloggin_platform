import { useEffect, useState } from 'react';

export default function CursorGlow() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setVisible(true);
        };

        const handleMouseLeave = () => setVisible(false);

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

    return (
        <div
            className="cursor-glow hidden md:block"
            style={{
                left: position.x,
                top: position.y,
                opacity: visible ? 1 : 0,
            }}
        />
    );
}
