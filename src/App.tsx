import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';

// Pages (to be created)
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/admin/Dashboard';
import Storefront from './pages/shop/Storefront';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public SaaS Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Flow */}
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/onboarding" />} />
        
        {/* Onboarding / Business Setup */}
        <Route path="/onboarding" element={user ? <OnboardingPage /> : <Navigate to="/auth" />} />
        
        {/* Admin Dashboard (Scoped to Business) */}
        <Route path="/admin/*" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
        
        {/* Public Storefronts */}
        <Route path="/s/:slug/*" element={<Storefront />} />
        <Route path="/shop/:slug/*" element={<Storefront />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
