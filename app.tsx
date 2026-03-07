import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { StoreProvider, useStore } from "./store";
import { TabType, Language } from "./types";
import Dashboard from "./components/dashboard.tsx";
import Home from "./components/Home.tsx";
import Sales from "./components/sales.tsx";
import Stock from "./components/stock.tsx";
import Expenses from "./components/expenses.tsx";
import Customers from "./components/customers.tsx";
import Reports from "./components/reports.tsx";
import SalesAnalytics from "./components/SalesAnalytics.tsx";
import AIAssistant from "./components/ai-assistant.tsx";
import Settings from "./components/settings.tsx";
import WebsiteManagement from "./components/WebsiteManagement.tsx";
import Shop from "./components/shop.tsx";
import Orders from "./components/orders.tsx";
import SaaSLanding from "./components/SaaSLanding.tsx";
import SaaSSignup from "./components/SaaSSignup.tsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  ShoppingBag,
  Archive,
  Wallet,
  Contact2,
  PieChart,
  Sparkles,
  TrendingUp,
  AlertCircle,
  LogIn,
  LogOut,
  Languages,
  UserCircle,
  Users,
  Moon,
  Sun,
  Zap,
  Image,
  Layers,
} from "lucide-react";

const TRANSLATIONS = {
  en: {
    dashboard: "Home",
    sales: "Sales",
    orders: "Orders",
    stock: "Stock",
    expense: "Bills",
    customers: "Clients",
    report: "Stats",
    analytics: "Analytics",
    ai: "Sylsas AI",
    loginTitle: "Sylsas Fashion",
    loginSub: "Secure Terminal Access",
    loginBtn: "Enter System",
    logout: "Logout",
    langToggle: "বাংলা",
    emailPlaceholder: "Email Address",
    passPlaceholder: "Password",
    invalidCreds: "Invalid Credentials!",
  },
  bn: {
    dashboard: "হোম",
    sales: "বিক্রি",
    orders: "অর্ডার",
    stock: "স্টক",
    expense: "খরচ",
    customers: "কাস্টমার",
    report: "রিপোর্ট",
    analytics: "অ্যানালিটিক্স",
    ai: "সিলেস এআই",
    loginTitle: "সিলেস ফ্যাশন",
    loginSub: "সিকিউর এক্সেস",
    loginBtn: "প্রবেশ করুন",
    logout: "লগআউট",
    langToggle: "English",
    emailPlaceholder: "ইমেইল অ্যাড্রেস",
    passPlaceholder: "পাসওয়ার্ড",
    invalidCreds: "ভুল ইমেইল বা পাসওয়ার্ড!",
  },
};

const LoginScreen: React.FC = () => {
  const { login, language } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const t = TRANSLATIONS[language];

  const handleLogin = () => {
    if (!login(email, password)) setErr(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white dark:bg-slate-950 z-[200] flex items-center justify-center p-6 transition-colors duration-500"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-sm space-y-12 text-center"
      >
        <div className="space-y-4">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/40 rotate-6 hover:rotate-0 transition-transform duration-500">
            <LogIn size={44} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.loginTitle}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-widest uppercase">
            {t.loginSub}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            className={`w-full p-5 bg-slate-50 dark:bg-slate-900 border-0 rounded-2xl outline-none font-bold transition-all focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 ${err ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500" : "text-slate-900 dark:text-white"}`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr(false);
            }}
          />
          <input
            type="password"
            placeholder={t.passPlaceholder}
            className={`w-full p-5 bg-slate-50 dark:bg-slate-900 border-0 rounded-2xl outline-none font-bold transition-all focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 ${err ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500" : "text-slate-900 dark:text-white"}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErr(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {err && (
            <p className="text-rose-500 font-black text-xs uppercase tracking-widest animate-bounce">
              {t.invalidCreds}
            </p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-indigo-900/30 active:scale-95 transition-all mt-4"
          >
            {t.loginBtn}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Navigation: React.FC<{
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}> = ({ activeTab, setActiveTab }) => {
  const { language, orders = [] } = useStore();
  const t = TRANSLATIONS[language];
  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  const tabs = [
    { id: "dashboard", label: t.dashboard, icon: LayoutGrid },
    { id: "orders", label: t.orders, icon: ShoppingBag, badge: pendingCount },
    { id: "sales", label: t.sales, icon: ShoppingBag },
    { id: "stock", label: t.stock, icon: Archive },
    { id: "customers", label: t.customers, icon: Users },
    { id: "expense", label: t.expense, icon: Wallet },
    { id: "report", label: t.report, icon: PieChart },
    {
      id: "websiteManagement",
      label: language === "bn" ? "ওয়েবসাইট" : "Website",
      icon: Layers,
    },
    { id: "analytics", label: t.analytics, icon: TrendingUp },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-6 left-4 right-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] flex justify-around items-center px-4 py-3 z-50 shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-white/40 dark:border-slate-800/40"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex flex-col items-center justify-center py-1 transition-all duration-300 active:scale-75 relative ${
              isActive
                ? "text-indigo-600"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <div
              className={`p-2 rounded-xl transition-all ${isActive ? "bg-indigo-50 dark:bg-indigo-950/50 active-tab-glow" : ""}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {tab.badge ? (
              <span className="absolute top-0 right-0 -translate-y-1 translate-x-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-pulse">
                {tab.badge}
              </span>
            ) : null}
            <span
              className={`text-[8px] font-black mt-1 uppercase tracking-tighter ${isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
};

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({
  onGetStarted,
}) => {
  const { language, setLanguage } = useStore();
  const isBn = language === "bn";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-50 dark:bg-slate-950 z-[300] overflow-y-auto selection:bg-indigo-100 transition-colors duration-500"
    >
      <nav className="px-6 py-8 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
            <ShoppingBag size={24} />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Sylsas
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(isBn ? "en" : "bn")}
            className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {isBn ? "English" : "বাংলা"}
          </button>
          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-all active:scale-95"
          >
            {isBn ? "লগইন" : "Login"}
          </button>
        </div>
      </nav>

      <main className="px-6 pt-16 pb-32 max-w-5xl mx-auto text-center space-y-20">
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-bounce">
            {isBn
              ? "নতুন জেনারেশন ফ্যাশন ম্যানেজমেন্ট"
              : "Next-Gen Fashion Management"}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
            {isBn ? "আপনার ফ্যাশন হাউসের" : "Scale Your Fashion"}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {isBn ? "স্মার্ট সমাধান" : "Business Smarter"}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? "স্টক, সেলস এবং কাস্টমার ম্যানেজমেন্ট এখন হাতের মুঠোয়। সাথে আছে এআই অ্যাসিস্ট্যান্ট আপনার ব্যবসার উন্নতির জন্য।"
              : "The all-in-one terminal for modern fashion retailers. Manage inventory, track sales, and grow with AI-powered insights."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-700 transition-all active:scale-95"
            >
              {isBn ? "এখনই শুরু করুন" : "Get Started Now"}
            </button>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 overflow-hidden"
                >
                  <img
                    src={`https://picsum.photos/seed/user${i}/40/40`}
                    alt="User"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                +50
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: LayoutGrid,
              title: isBn ? "রিয়েল-টাইম ড্যাশবোর্ড" : "Real-time Stats",
              desc: isBn
                ? "আপনার ব্যবসার প্রতিটি মুভমেন্ট ট্র্যাক করুন।"
                : "Track every movement of your business instantly.",
            },
            {
              icon: Sparkles,
              title: isBn ? "এআই অ্যাসিস্ট্যান্ট" : "AI Assistant",
              desc: isBn
                ? "আপনার ব্যবসার ডেটা বিশ্লেষণ করে সঠিক পরামর্শ নিন।"
                : "Get smart advice by analyzing your business data.",
            },
            {
              icon: Users,
              title: isBn ? "কাস্টমার রিলেশন" : "Customer CRM",
              desc: isBn
                ? "বাকি টাকা এবং কাস্টমার লয়াল্টি ম্যানেজ করুন সহজে।"
                : "Manage dues and customer loyalty with ease.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-left space-y-4 hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </motion.div>
  );
};

import Toast from "./components/Toast.tsx";

const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const {
    error,
    language,
    setLanguage,
    theme,
    toggleTheme,
    logout,
    isLoggedIn,
    admin,
    notification,
    setNotification,
    currentShop,
  } = useStore();
  const t = TRANSLATIONS[language];
  const navigate = useNavigate();

  if (!isLoggedIn) return <LoginScreen />;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveTab} />;
      case "orders":
        return <Orders />;
      case "sales":
        return <Sales />;
      case "stock":
        return <Stock />;
      case "expense":
        return <Expenses />;
      case "customers":
        return <Customers />;
      case "report":
        return <Reports />;
      case "websiteManagement":
        return <WebsiteManagement />;
      case "analytics":
        return <SalesAnalytics />;
      case "ai":
        return <AIAssistant />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen pb-40 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {error && (
        <div className="bg-rose-600 text-white px-6 py-4 text-xs font-bold flex items-center justify-center gap-3 sticky top-0 z-[100] shadow-xl animate-in slide-in-from-top-4">
          <AlertCircle size={18} />
          <span>{error.message}</span>
        </div>
      )}

      <header className="px-6 pt-10 pb-6 flex items-center justify-between">
        <button
          onClick={() => setActiveTab("settings")}
          className="flex items-center gap-4 group text-left transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-[1.2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-sm overflow-hidden group-hover:border-indigo-200 group-hover:shadow-md transition-all">
            {currentShop?.logo ? (
              <img
                src={currentShop.logo}
                className="w-full h-full object-cover"
                alt="Logo"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-xl">
                {currentShop?.name?.charAt(0) || "A"}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
              {currentShop?.name || "Admin"}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
              Admin
            </p>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/s/${currentShop?.slug}`)}
            className="w-10 h-10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl flex items-center justify-center shadow-sm border border-white dark:border-slate-800 hover:border-indigo-100 active:scale-90 transition-all"
            title="Go to Shop"
          >
            <ShoppingBag size={18} />
          </button>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl flex items-center justify-center shadow-sm border border-white dark:border-slate-800 hover:border-indigo-100 active:scale-90 transition-all"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="w-10 h-10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl flex items-center justify-center shadow-sm border border-white dark:border-slate-800 hover:border-indigo-100 active:scale-90 transition-all"
          >
            <Languages size={18} />
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border transition-all ${activeTab === "ai" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900 text-indigo-600 border-white dark:border-slate-800"}`}
          >
            <Sparkles size={18} />
          </button>
          <button
            onClick={logout}
            className="w-10 h-10 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-2xl flex items-center justify-center shadow-sm border border-rose-100 dark:border-rose-900/50 active:scale-90 transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6"
      >
        {renderContent()}
      </motion.main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

import Auth from "./components/auth.tsx";
import Profile from "./components/profile.tsx";
import AboutUs from "./components/AboutUs.tsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.tsx";

const ShopRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const { currentShop, setCurrentShop, fetchShopBySlug } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadShop = async () => {
      if (shopSlug) {
        if (currentShop?.slug !== shopSlug) {
          setLoading(true);
          const shop = await fetchShopBySlug(shopSlug);
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
        <p className="text-slate-500 max-w-md">The shop you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <FloatingWhatsApp />
        <Routes>
          {/* SaaS Platform Routes */}
          <Route path="/" element={<SaaSLanding />} />
          <Route path="/signup" element={<SaaSSignup />} />
          <Route path="/admin" element={<AdminLayout />} />
          
          {/* Tenant Shop Routes */}
          <Route path="/s/:shopSlug" element={<ShopRouteWrapper><Home /></ShopRouteWrapper>} />
          <Route path="/s/:shopSlug/shop" element={<ShopRouteWrapper><Shop /></ShopRouteWrapper>} />
          <Route path="/s/:shopSlug/login" element={<ShopRouteWrapper><Auth /></ShopRouteWrapper>} />
          <Route path="/s/:shopSlug/profile" element={<ShopRouteWrapper><Profile /></ShopRouteWrapper>} />
          <Route path="/s/:shopSlug/about" element={<ShopRouteWrapper><AboutUs /></ShopRouteWrapper>} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;
