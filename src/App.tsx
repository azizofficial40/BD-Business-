import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { StoreProvider, useStore } from '../store';

// Components
import AdminLayout from './components/AdminLayout';
import Dashboard from '../components/dashboard';
import Orders from '../components/orders';
import Sales from '../components/sales';
import Stock from '../components/stock';
import Expenses from '../components/expenses';
import Customers from '../components/customers';
import Reports from '../components/reports';
import SalesAnalytics from '../components/SalesAnalytics';
import AIAssistant from '../components/ai-assistant';
import Settings from '../components/settings';
import WebsiteManagement from '../components/WebsiteManagement';

// SaaS Pages
import SaaSLanding from '../components/SaaSLanding';
import SaaSSignup from '../components/SaaSSignup';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import Marketplace from './pages/Marketplace';

// Shop Pages
import Shop from '../components/shop';
import Home from '../components/Home';
import Auth from '../components/auth';
import Profile from '../components/profile';
import AboutUs from '../components/AboutUs';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { AlertCircle } from 'lucide-react';

const ShopRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const { currentShop, setCurrentShop, fetchShopBySlug } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadShop = async () => {
      if (shopSlug) {
        // Always use lowercase for slug matching as we enforce lowercase on creation
        const normalizedSlug = shopSlug.toLowerCase();
        
        if (currentShop?.slug !== normalizedSlug) {
          setLoading(true);
          const shop = await fetchShopBySlug(normalizedSlug);
          if (isMounted) {
            if (shop) {
              setCurrentShop(shop);
              setError(false);
            } else {
              setError(true);
            }
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    };
    loadShop();
    return () => { isMounted = false; };
  }, [shopSlug, currentShop, fetchShopBySlug, setCurrentShop]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center p-6">
        <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Shop Not Found</h1>
        <p className="text-slate-500 max-w-md mb-8">The shop you are looking for does not exist or has been removed.</p>
        <div className="flex gap-4">
          <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Go Home
          </a>
          <a href="/auth" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            Create Your Shop
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

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
      <FloatingWhatsApp />
      <Routes>
        {/* SaaS Platform Routes */}
          <Route path="/" element={<SaaSLanding />} />
          <Route path="/signup" element={<SaaSSignup />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/onboarding" />} />
          <Route path="/onboarding" element={user ? <OnboardingPage /> : <Navigate to="/auth" />} />
          
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Admin Dashboard (Scoped to Business) */}
          <Route path="/admin" element={user ? <AdminLayout /> : <Navigate to="/auth" />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="sales" element={<Sales />} />
            <Route path="stock" element={<Stock />} />
            <Route path="expense" element={<Expenses />} />
            <Route path="customers" element={<Customers />} />
            <Route path="report" element={<Reports />} />
            <Route path="websiteManagement" element={<WebsiteManagement />} />
            <Route path="analytics" element={<SalesAnalytics />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Public Storefronts */}
          <Route path="/store/:shopSlug" element={<ShopRouteWrapper><Home /></ShopRouteWrapper>} />
          <Route path="/store/:shopSlug/shop" element={<ShopRouteWrapper><Shop /></ShopRouteWrapper>} />
          <Route path="/store/:shopSlug/login" element={<ShopRouteWrapper><Auth /></ShopRouteWrapper>} />
          <Route path="/store/:shopSlug/profile" element={<ShopRouteWrapper><Profile /></ShopRouteWrapper>} />
          <Route path="/store/:shopSlug/about" element={<ShopRouteWrapper><AboutUs /></ShopRouteWrapper>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
