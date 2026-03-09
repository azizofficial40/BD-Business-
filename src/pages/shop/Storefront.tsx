import React, { useState, useEffect } from 'react';
import { useParams, Link, Routes, Route, useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { handleFirestoreError, OperationType } from '../../services/firestoreErrorHandler';
import { ShoppingBag, Search, Menu, X, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../../store';
import Shop from '../../../components/shop';

const Storefront: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { setCurrentShop, currentShop } = useStore();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!slug) return;
      
      // If currentShop is already set and matches slug, don't fetch again
      if (currentShop?.slug === slug) {
        setBusiness(currentShop);
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'shops'), where('slug', '==', slug.toLowerCase()), limit(1));
      try {
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const shopData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
          setBusiness(shopData);
          setCurrentShop(shopData as any);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'shops');
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [slug, setCurrentShop, currentShop]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Shop Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-md">
          The shop you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  // If we are on a sub-route like /shop or /product, we might want to render the Shop component
  const isHome = location.pathname === `/shop/${slug}` || location.pathname === `/shop/${slug}/`;

  if (!isHome) {
    return <Shop />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3">
            <img src={business.logo} alt={business.name} className="w-10 h-10 rounded-lg object-contain" />
            <span className="text-xl font-bold tracking-tight text-slate-900">{business.name}</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to={`/shop/${slug}`} className="text-sm font-semibold text-slate-900">Home</Link>
            <Link to={`/shop/${slug}/shop`} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Shop</Link>
            <Link to={`/shop/${slug}/about`} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
              <Search size={22} />
            </button>
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
              <ShoppingBag size={22} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[70] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-xl font-bold">{business.name}</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                <Link to={`/shop/${slug}`} className="text-2xl font-bold">Home</Link>
                <Link to={`/shop/${slug}/shop`} className="text-2xl font-bold text-slate-400">Shop</Link>
                <Link to={`/shop/${slug}/about`} className="text-2xl font-bold text-slate-400">About</Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-50">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Welcome to <br /> {business.name}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          >
            Discover our premium collection curated just for you.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl"
          >
            Shop Collection
          </motion.button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-3xl font-bold text-slate-900">Featured Products</h3>
          <Link to={`/shop/${slug}/shop`} className="text-indigo-600 font-bold hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden mb-4 relative">
                <img 
                  src={`https://picsum.photos/seed/shop-${i}/600/800`} 
                  alt="Product" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute bottom-4 left-4 right-4 py-3 bg-white/90 backdrop-blur-sm text-slate-900 rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Add to Cart
                </button>
              </div>
              <h4 className="font-bold text-slate-900">Premium Item {i}</h4>
              <p className="text-slate-500 font-medium">৳1,250.00</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={business.logo} alt={business.name} className="w-10 h-10 rounded-lg object-contain" />
              <span className="text-xl font-bold tracking-tight">{business.name}</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-8">
              We provide the best quality products for our customers. 
              Shop with confidence and style.
            </p>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all">
                <Instagram size={20} />
              </button>
              <button className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all">
                <Facebook size={20} />
              </button>
              <button className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all">
                <Twitter size={20} />
              </button>
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-6">Quick Links</h5>
            <nav className="flex flex-col gap-4 text-slate-500">
              <Link to={`/shop/${slug}`} className="hover:text-indigo-600 transition-colors">Home</Link>
              <Link to={`/shop/${slug}/shop`} className="hover:text-indigo-600 transition-colors">Shop</Link>
              <Link to={`/shop/${slug}/about`} className="hover:text-indigo-600 transition-colors">About Us</Link>
              <Link to={`/shop/${slug}/contact`} className="hover:text-indigo-600 transition-colors">Contact</Link>
            </nav>
          </div>
          <div>
            <h5 className="font-bold mb-6">Customer Service</h5>
            <nav className="flex flex-col gap-4 text-slate-500">
              <button className="text-left hover:text-indigo-600 transition-colors">Shipping Policy</button>
              <button className="text-left hover:text-indigo-600 transition-colors">Returns & Refunds</button>
              <button className="text-left hover:text-indigo-600 transition-colors">Privacy Policy</button>
              <button className="text-left hover:text-indigo-600 transition-colors">Terms of Service</button>
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          &copy; 2024 {business.name}. Powered by BD Business.
        </div>
      </footer>
    </div>
  );
};

export default Storefront;
