import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './Navbar';
import Footer from './Footer';
import GrainOverlay from '@/components/GrainOverlay';

export default function Layout() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-bg-primary">
            <GrainOverlay />
            <Navbar />
            <main className="flex-1 pt-14">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
