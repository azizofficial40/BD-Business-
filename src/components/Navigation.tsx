import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../../store";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  ShoppingBag,
  Archive,
  Wallet,
  Users,
  PieChart,
  TrendingUp,
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
  },
};

const Navigation: React.FC = () => {
  const { language, orders = [] } = useStore();
  const location = useLocation();
  const t = TRANSLATIONS[language];
  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  const tabs = [
    { id: "dashboard", label: t.dashboard, icon: LayoutGrid, path: "/admin" },
    { id: "orders", label: t.orders, icon: ShoppingBag, badge: pendingCount, path: "/admin/orders" },
    { id: "sales", label: t.sales, icon: ShoppingBag, path: "/admin/sales" },
    { id: "stock", label: t.stock, icon: Archive, path: "/admin/stock" },
    { id: "customers", label: t.customers, icon: Users, path: "/admin/customers" },
    { id: "expense", label: t.expense, icon: Wallet, path: "/admin/expense" },
    { id: "report", label: t.report, icon: PieChart, path: "/admin/report" },
    {
      id: "websiteManagement",
      label: language === "bn" ? "ওয়েবসাইট" : "Website",
      icon: Layers,
      path: "/admin/websiteManagement",
    },
    { id: "analytics", label: t.analytics, icon: TrendingUp, path: "/admin/analytics" },
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
        const isActive = location.pathname === tab.path || (tab.id === 'dashboard' && location.pathname === '/admin/');
        return (
          <Link
            key={tab.id}
            to={tab.path}
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
          </Link>
        );
      })}
    </motion.nav>
  );
};

export default Navigation;
