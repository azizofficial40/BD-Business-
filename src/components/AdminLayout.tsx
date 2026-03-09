import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../../store";
import { motion } from "framer-motion";
import {
  AlertCircle,
  LogOut,
  Languages,
  Moon,
  Sun,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import Navigation from "./Navigation";
import Toast from "../../components/Toast";
import LoginScreen from "./LoginScreen";

const AdminLayout: React.FC = () => {
  const {
    error,
    language,
    setLanguage,
    theme,
    toggleTheme,
    logout,
    isLoggedIn,
    notification,
    setNotification,
    currentShop,
    setCurrentShop,
    user,
    fetchShopById,
  } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentShop && user?.shopId) {
      fetchShopById(user.shopId).then((shop) => {
        if (shop) {
          setCurrentShop(shop);
        }
      });
    }
  }, [currentShop, user, fetchShopById, setCurrentShop]);

  if (!isLoggedIn) return <LoginScreen />;

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
          onClick={() => navigate("/admin/settings")}
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
            onClick={() => navigate(`/store/${currentShop?.slug}`)}
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
            onClick={() => navigate("/admin/ai")}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border transition-all ${location.pathname === "/admin/ai" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900 text-indigo-600 border-white dark:border-slate-800"}`}
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
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6"
      >
        <Outlet />
      </motion.main>

      <Navigation />
    </div>
  );
};

export default AdminLayout;
