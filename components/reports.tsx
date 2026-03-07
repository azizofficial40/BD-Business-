import React from "react";
import { useStore } from "../store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  LabelList,
  PieChart as PieChartIcon,
} from "recharts";
import { PieChart } from "lucide-react";

const REPORTS_T = {
  en: {
    title: "Analytics & Reports",
    sub: "Business Performance summary",
    snapshot: "Financial Snapshot",
    weekly: "Profit vs Expense (7 Days)",
    view: "Weekly View",
    noData: "No transaction data available for chart.",
    labels: {
      due: "Sales Due",
      stock: "Stock Value",
      income: "Realtime Income",
      expense: "Total Expenses",
      profit: "Total Sales Profit",
    },
  },
  bn: {
    title: "অ্যানালিটিক্স ও রিপোর্ট",
    sub: "ব্যবসায়িক পারফরম্যান্সের সারাংশ",
    snapshot: "আর্থিক পরিস্থিতি (গ্রাফ)",
    weekly: "লাভ বনাম খরচ (৭ দিন)",
    view: "সাপ্তাহিক ভিউ",
    noData: "গ্রাফ দেখানোর জন্য পর্যাপ্ত তথ্য নেই।",
    labels: {
      due: "বাকি টাকা",
      stock: "স্টক ভ্যালু",
      income: "আসল আয়",
      expense: "মোট খরচ",
      profit: "মোট লাভ",
    },
  },
};

const Reports: React.FC = () => {
  const { sales = [], expenses = [], products = [], language } = useStore();
  const t = REPORTS_T[language];

  // Prepare data for Daily Sales Profit vs Expense
  const last7Days = [...Array(7)]
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
      const daySales = sales.filter(
        (s) => new Date(s.date).toLocaleDateString() === d.toLocaleDateString(),
      );
      const dayExpenses = expenses.filter(
        (e) => new Date(e.date).toLocaleDateString() === d.toLocaleDateString(),
      );

      return {
        name: dateStr,
        profit: daySales.reduce((acc, s) => acc + (s.profit || 0), 0),
        expense: dayExpenses.reduce((acc, e) => acc + (e.amount || 0), 0),
      };
    })
    .reverse();

  const totalProfit = sales.reduce((acc, s) => acc + (s.profit || 0), 0);
  const totalExpense = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalDue = sales.reduce((acc, s) => acc + (s.dueAmount || 0), 0);
  const totalIncome = totalProfit - totalDue - totalExpense;

  const stockValue = products.reduce((acc, p) => {
    const qty =
      p.variants?.reduce((vAcc, v) => vAcc + (v.quantity || 0), 0) || 0;
    return acc + (p.purchasePrice || 0) * qty;
  }, 0);

  // Snapshot Data for the requested chart
  const snapshotData = [
    { name: t.labels.due, value: totalDue, color: "#FF0000" },
    { name: t.labels.stock, value: stockValue, color: "#4285F4" },
    { name: t.labels.income, value: totalIncome, color: "#00FF00" },
    { name: t.labels.expense, value: totalExpense, color: "#800000" },
    { name: t.labels.profit, value: totalProfit, color: "#2E7D32" },
  ];

  const hasData = snapshotData.some((d) => d.value > 0);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1 px-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
          {t.title}
        </h2>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
          {t.sub}
        </p>
      </div>

      {/* Requested Financial Snapshot Chart */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.03)] overflow-hidden relative">
        <h3 className="text-sm font-black text-slate-900 dark:text-white mb-8 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 pb-4">
          {t.snapshot}
        </h3>

        <div className="h-[320px] w-full relative">
          {hasData ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
              key={`bar-${language}`}
            >
              <BarChart
                data={snapshotData}
                margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                  className="dark:stroke-slate-800"
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fontWeight: 700 }}
                />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: "#1e293b",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value: number) => [
                    `৳${value.toLocaleString()}`,
                    "",
                  ]}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {snapshotData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(val: number) => `৳${val.toLocaleString()}`}
                    style={{
                      fontSize: "10px",
                      fontWeight: "900",
                      fill: "#475569",
                    }}
                    className="dark:fill-slate-400"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <PieChart size={24} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest">
                {t.noData}
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3 px-2">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm text-center">
          <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            Profit
          </p>
          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            ৳{totalProfit.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm text-center">
          <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            Expense
          </p>
          <p className="text-sm font-black text-rose-500">
            ৳{totalExpense.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm text-center">
          <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            Income
          </p>
          <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
            ৳{totalIncome.toLocaleString()}
          </p>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.03)] overflow-hidden">
        <h3 className="font-black text-slate-900 dark:text-white text-sm mb-6 flex items-center justify-between">
          {t.weekly}
          <span className="text-[9px] bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
            {t.view}
          </span>
        </h3>
        <div className="h-64 w-full relative">
          <ResponsiveContainer
            width="100%"
            height="100%"
            key={`area-${language}`}
          >
            <AreaChart data={last7Days}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
                className="dark:stroke-slate-800"
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  backgroundColor: "#1e293b",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorProfit)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#f43f5e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">
              Profit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">
              Expenses
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
