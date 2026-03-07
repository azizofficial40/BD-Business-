import React from "react";
import { useStore } from "../store";
import { TabType } from "../types";
import {
  TrendingUp,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  ChevronRight,
  Target,
  ShoppingBag,
} from "lucide-react";

const DASHBOARD_T = {
  en: {
    capital: "Realtime Income",
    revenue: "Today's Revenue",
    assets: "Asset Value",
    profit: "Net Profit",
    expense: "Burn Rate",
    recent: "Live Activity",
    ledger: "Full Log",
    waiting: "No transactions yet",
    paid: "Paid",
    due: "Due",
  },
  bn: {
    capital: "বর্তমান আয়",
    revenue: "আজকের বিক্রি",
    assets: "স্টকের মূল্য",
    profit: "মোট লাভ",
    expense: "মোট খরচ",
    recent: "সাম্প্রতিক লেনদেন",
    ledger: "সব দেখুন",
    waiting: "কোন লেনদেন নেই",
    paid: "পেইড",
    due: "বাকি",
  },
};

const DashboardCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  bgColorClass: string;
  trend?: string;
}> = ({ title, value, icon, colorClass, bgColorClass, trend }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between group hover:shadow-xl transition-all duration-500">
    <div className="flex justify-between items-start mb-6">
      <div
        className={`${bgColorClass} ${colorClass} w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      {trend && (
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg">
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
        {value}
      </h3>
      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
        {title}
      </p>
    </div>
  </div>
);

const Dashboard: React.FC<{ onNavigate?: (tab: TabType) => void }> = ({
  onNavigate,
}) => {
  const { sales = [], expenses = [], products = [], language } = useStore();
  const t = DASHBOARD_T[language];

  const today = new Date().toLocaleDateString();
  const todaySales = sales
    .filter((s) => new Date(s.date).toLocaleDateString() === today)
    .reduce((acc, s) => acc + s.totalAmount, 0);

  const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);
  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalDue = sales.reduce((acc, s) => acc + (s.dueAmount || 0), 0);
  const realtimeIncome = totalProfit - totalDue - totalExpense;

  const stockValue = products.reduce((acc, p) => {
    const qty = p.variants.reduce((vAcc, v) => vAcc + v.quantity, 0);
    return acc + p.purchasePrice * qty;
  }, 0);

  return (
    <div className="space-y-10">
      {/* Hero Income Panel */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.05)] text-center relative overflow-hidden group">
        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-indigo-50 dark:bg-indigo-950/20 rounded-full blur-[80px] opacity-60 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <p className="text-indigo-600 dark:text-indigo-400 font-black text-[11px] uppercase tracking-[0.3em] mb-3">
            {t.capital}
          </p>
          <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-8">
            ৳{realtimeIncome.toLocaleString()}
          </h2>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 pt-8">
            <div className="text-left px-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {t.revenue}
              </p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-200">
                ৳{todaySales.toLocaleString()}
              </p>
            </div>
            <div className="text-right px-4 border-l border-slate-50 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {t.assets}
              </p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-200">
                ৳{stockValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 gap-6">
        <DashboardCard
          title={t.profit}
          value={`৳${totalProfit.toLocaleString()}`}
          icon={<TrendingUp size={24} />}
          colorClass="text-indigo-600"
          bgColorClass="bg-indigo-50"
          trend="+12%"
        />
        <DashboardCard
          title={t.expense}
          value={`৳${totalExpense.toLocaleString()}`}
          icon={<ArrowDownRight size={24} />}
          colorClass="text-rose-500"
          bgColorClass="bg-rose-50"
          trend="-2%"
        />
      </div>

      {/* Quick Actions */}
      <section className="grid grid-cols-4 gap-4">
        {[
          {
            icon: Package,
            label: language === "bn" ? "নতুন প্রোডাক্ট" : "New Product",
            color: "bg-indigo-600",
            tab: "stock",
          },
          {
            icon: ShoppingBag,
            label: language === "bn" ? "অর্ডার দেখুন" : "View Orders",
            color: "bg-emerald-600",
            tab: "orders",
          },
          {
            icon: Target,
            label: language === "bn" ? "রিপোর্ট" : "Reports",
            color: "bg-amber-600",
            tab: "report",
          },
          {
            icon: Coins,
            label: language === "bn" ? "খরচ যোগ" : "Add Expense",
            color: "bg-rose-600",
            tab: "expense",
          },
        ].map((action, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 group cursor-pointer"
            onClick={() => onNavigate?.(action.tab as TabType)}
          >
            <div
              className={`${action.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform active:scale-90`}
            >
              <action.icon size={24} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">
              {action.label}
            </span>
          </div>
        ))}
      </section>

      {/* Activity Section */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            <h3 className="font-black text-slate-900 dark:text-white text-lg">
              {t.recent}
            </h3>
          </div>
          <button className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest flex items-center gap-2 group">
            {t.ledger}{" "}
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {sales.length === 0 ? (
          <div className="bg-white/40 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] py-16 text-center">
            <Package
              size={40}
              className="text-slate-200 dark:text-slate-800 mx-auto mb-4"
            />
            <p className="text-slate-400 font-bold text-sm tracking-wide">
              {t.waiting}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.slice(0, 4).map((sale) => (
              <div
                key={sale.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-white dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 font-black text-2xl border border-white dark:border-slate-700">
                    {sale.productName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white">
                      {sale.productName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {sale.customerName}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></span>
                      <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 tracking-tighter">
                        <Clock size={10} className="inline mr-1" />{" "}
                        {new Date(sale.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 dark:text-white">
                    ৳{sale.totalAmount}
                  </p>
                  <div
                    className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest mt-2 inline-block ${
                      sale.paymentStatus === "Full Paid"
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600"
                        : "bg-rose-50 dark:bg-rose-950/30 text-rose-500"
                    }`}
                  >
                    {sale.paymentStatus === "Full Paid" ? t.paid : t.due}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
