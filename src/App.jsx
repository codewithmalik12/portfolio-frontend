import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './components/Main';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import VisitorTracker from './components/VisitorTracker';

// Auth Components
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/admin/AdminDashboard';

import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
      mirror: false,
      easing: 'ease-out-cubic',
    });

    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Routes>
      {/* Public Portfolio Route */}
      <Route
        path="/"
        element={
          <div className="min-h-screen relative bg-[var(--color-bg-base)]">
            <VisitorTracker />
            <Navbar />
            <main>
              <Main />
              <About />
              <Projects />
              <Skills />
              <Contact />
            </main>
            <Footer />

            {/* Floating Back to Top Button */}
            <button
              onClick={goToTop}
              className={`fixed bottom-8 right-8 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-600 transition-all duration-300 z-50 ${showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
              aria-label="Back to top"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        }
      />

      {/* Auth Panel Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<UserProfile />} />

      {/* Admin Panel Routes */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />
      <Route path="/admin/signup" element={<Navigate to="/signup" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Catch-all Redirect to Home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;