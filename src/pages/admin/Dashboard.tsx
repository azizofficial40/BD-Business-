import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { handleFirestoreError, OperationType } from '../../services/firestoreErrorHandler';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Store,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import AIAssistant from '../../components/AIAssistant';

const Dashboard: React.FC = () => {
  const [business, setBusiness] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!auth.currentUser) return;

      try {
        const shopsQuery = query(collection(db, 'shops'), where('ownerId', '==', auth.currentUser.uid), limit(1));
        const shopsSnapshot = await getDocs(shopsQuery);

        if (!shopsSnapshot.empty) {
          const shop = shopsSnapshot.docs[0];
          const data = shop.data() as any;
          setBusiness({
            id: shop.id,
            name: data.shopName,
            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.shopName || 'Shop')}&background=random`,
            slug: (data.shopName || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            ...data
          });
          return;
        }

        const legacyQuery = query(collection(db, 'tenants'), where('ownerId', '==', auth.currentUser.uid), limit(1));
        const legacySnapshot = await getDocs(legacyQuery);

        if (legacySnapshot.empty) {
          navigate('/onboarding');
        } else {
          setBusiness({ id: legacySnapshot.docs[0].id, ...legacySnapshot.docs[0].data() });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'shops/tenants');
      }
    };
    fetchBusiness();
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (!business) return null;

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/admin' },
    { icon: <Package size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <ShoppingCart size={20} />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users size={20} />, label: 'Customers', path: '/admin/customers' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-sm flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={business.logo} alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-slate-50" />
                <span className="font-bold text-slate-900 truncate max-w-[140px]">{business.name}</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-100 space-y-2">
              <a 
                href={`/s/${business.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all"
              >
                <span className="flex items-center gap-2"><Store size={18} /> View Shop</span>
                <ExternalLink size={16} className="opacity-50" />
              </a>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 font-medium hover:bg-rose-50 rounded-xl transition-all"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
                <Menu size={24} />
              </button>
            )}
            <h1 className="text-xl font-bold text-slate-900">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-slate-900">{auth.currentUser?.email}</p>
              <p className="text-xs text-slate-500">Business Owner</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
              {auth.currentUser?.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<DashboardOverview business={business} />} />
            <Route path="/products" element={<div className="p-12 text-center text-slate-400">Products Management Coming Soon</div>} />
            <Route path="/orders" element={<div className="p-12 text-center text-slate-400">Orders Management Coming Soon</div>} />
            <Route path="/customers" element={<div className="p-12 text-center text-slate-400">Customers Management Coming Soon</div>} />
            <Route path="/settings" element={<div className="p-12 text-center text-slate-400">Settings Coming Soon</div>} />
          </Routes>
        </div>
      </main>

      <AIAssistant businessData={business} />
    </div>
  );
};


const DashboardOverview: React.FC<{ business: any }> = () => {
  const stats = [
    { label: 'Total Sales', value: '৳0.00', change: '+0%', icon: <ShoppingCart className="text-indigo-600" /> },
    { label: 'Total Orders', value: '0', change: '+0%', icon: <Package className="text-emerald-600" /> },
    { label: 'Customers', value: '0', change: '+0%', icon: <Users className="text-amber-600" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
        <div className="text-center py-12 text-slate-400">
          No activity yet. Start by adding your first product!
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
