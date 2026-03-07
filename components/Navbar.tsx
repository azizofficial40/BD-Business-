import React from "react";
import { useStore } from "../store";
import { ShoppingCart, Search, User, Lock, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NavbarProps {
  onCartClick?: () => void;
  showSearch?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onCartClick,
  showSearch = false,
  searchQuery = "",
  setSearchQuery,
}) => {
  const { cart, user, language, currentShop } = useStore();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div
            className="flex items-center gap-2 md:gap-3 group cursor-pointer"
            onClick={() => navigate(`/s/${currentShop?.slug}`)}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              {currentShop?.logo ? (
                <img
                  src={currentShop.logo}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl object-cover relative z-10 shadow-sm border border-white/10"
                  alt="Logo"
                />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-600 flex items-center justify-center relative z-10 shadow-sm border border-white/10 text-white font-bold text-sm md:text-base">
                  {currentShop?.name?.charAt(0) || "S"}
                </div>
              )}
            </div>
            <span className="font-black text-lg md:text-xl tracking-tight group-hover:text-indigo-600 transition-colors">
              {currentShop?.name || "Shop"}
            </span>
          </div>

          {showSearch && setSearchQuery && (
            <div className="hidden md:flex items-center gap-6 bg-slate-100 dark:bg-slate-800 px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-700">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent border-none outline-none text-sm font-bold w-64 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to={`/s/${currentShop?.slug}/shop`}
              className="hidden lg:block text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {language === "bn" ? "দোকান" : "Shop"}
            </Link>
            <Link
              to={`/s/${currentShop?.slug}/about`}
              className="hidden lg:block text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {language === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
              title="Admin Panel"
            >
              <Lock size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            <button
              onClick={() => navigate(user ? `/s/${currentShop?.slug}/profile` : `/s/${currentShop?.slug}/login`)}
              className="w-10 h-10 md:w-11 md:h-11 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-100 active:scale-90 transition-all"
            >
              <User size={18} className="md:w-5 md:h-5" />
            </button>

            {onCartClick && (
              <button
                onClick={onCartClick}
                className="relative w-10 h-10 md:w-11 md:h-11 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl md:rounded-2xl shadow-lg shadow-slate-200 dark:shadow-slate-900/40 active:scale-95 transition-all hover:rotate-3 flex items-center justify-center"
              >
                <ShoppingCart size={18} className="md:w-5 md:h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 md:w-6 md:h-6 bg-indigo-600 text-white text-[9px] md:text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-in zoom-in">
                    {cart.reduce((acc, i) => acc + i.quantity, 0)}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
