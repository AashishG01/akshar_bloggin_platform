import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Layout from '@/components/layout/Layout';
import LandingPage from '@/pages/LandingPage';
import BlogListPage from '@/pages/BlogListPage';
import BlogReadingPage from '@/pages/BlogReadingPage';
import CreateBlogPage from '@/pages/CreateBlogPage';
import EditBlogPage from '@/pages/EditBlogPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ProfilePage from '@/pages/ProfilePage';
import FeedPage from '@/pages/FeedPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <LandingPage />
              </PageTransition>
            }
          />
          <Route
            path="/blogs"
            element={
              <PageTransition>
                <BlogListPage />
              </PageTransition>
            }
          />
          <Route
            path="/blogs/:slug"
            element={
              <PageTransition>
                <BlogReadingPage />
              </PageTransition>
            }
          />
          <Route
            path="/create"
            element={
              <PageTransition>
                <CreateBlogPage />
              </PageTransition>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PageTransition>
                <EditBlogPage />
              </PageTransition>
            }
          />
          <Route
            path="/notifications"
            element={
              <PageTransition>
                <NotificationsPage />
              </PageTransition>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <PageTransition>
                <ProfilePage />
              </PageTransition>
            }
          />
          <Route
            path="/feed"
            element={
              <PageTransition>
                <FeedPage />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransition>
                <RegisterPage />
              </PageTransition>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
