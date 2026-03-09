import React, { useState, useMemo } from "react";
import { useStore } from "../store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Calendar,
  Filter,
  Download,
  Search,
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Archive,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
} from "lucide-react";
import { Order } from "../types";

const ANALYTICS_T = {
  en: {
    title: "Sales Analytics",
    sub: "Order History & Performance Summary",
    summary: {
      today: "Today's Sales",
      yesterday: "Yesterday's Sales",
      week: "This Week",
      month: "This Month",
      lifetime: "Lifetime Sales",
    },
    filters: {
      date: "Date",
      week: "Week",
      month: "Month",
      custom: "Custom Range",
      status: "Order Status",
      search: "Search Name or Phone...",
      clear: "Clear Filters",
    },
    stats: {
      totalOrders: "Total Orders",
      revenue: "Total Revenue",
      productsSold: "Products Sold",
    },
    table: {
      id: "Order ID",
      customer: "Customer",
      phone: "Phone",
      product: "Products",
      qty: "Qty",
      total: "Total",
      date: "Date",
      status: "Status",
    },
    export: "Export CSV",
    chart: "Sales Trend",
  },
  bn: {
    title: "সেলস অ্যানালিটিক্স",
    sub: "অর্ডার ইতিহাস এবং পারফরম্যান্স সারাংশ",
    summary: {
      today: "আজকের বিক্রি",
      yesterday: "গতকালের বিক্রি",
      week: "এই সপ্তাহ",
      month: "এই মাস",
      lifetime: "মোট বিক্রি",
    },
    filters: {
      date: "তারিখ",
      week: "সপ্তাহ",
      month: "মাস",
      custom: "কাস্টম রেঞ্জ",
      status: "অর্ডার স্ট্যাটাস",
      search: "নাম বা ফোন খুঁজুন...",
      clear: "ফিল্টার মুছুন",
    },
    stats: {
      totalOrders: "মোট অর্ডার",
      revenue: "মোট রেভিনিউ",
      productsSold: "বিক্রিত পণ্য",
    },
    table: {
      id: "অর্ডার আইডি",
      customer: "কাস্টমার",
      phone: "ফোন",
      product: "পণ্য",
      qty: "পরিমাণ",
      total: "মোট",
      date: "তারিখ",
      status: "স্ট্যাটাস",
    },
    export: "CSV এক্সপোর্ট",
    chart: "বিক্রির ট্রেন্ড",
  },
};

const now = new Date();

const getStartOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const getStartOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const SalesAnalytics: React.FC = () => {
  const { orders = [], language } = useStore();
  const t = ANALYTICS_T[language];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [filterType, setFilterType] = useState<
    "all" | "day" | "week" | "month" | "custom"
  >("all");

  // Summary Calculations
  const summary = useMemo(() => {
    const todayStart = getStartOfDay(now);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekStart = getStartOfWeek(now);
    const monthStart = getStartOfMonth(now);

    const calculateTotal = (filtered: Order[]) =>
      filtered.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    return {
      today: calculateTotal(
        orders.filter((o) => new Date(o.date) >= todayStart),
      ),
      yesterday: calculateTotal(
        orders.filter((o) => {
          const d = new Date(o.date);
          return d >= yesterdayStart && d < todayStart;
        }),
      ),
      week: calculateTotal(orders.filter((o) => new Date(o.date) >= weekStart)),
      month: calculateTotal(
        orders.filter((o) => new Date(o.date) >= monthStart),
      ),
      lifetime: calculateTotal(orders),
    };
  }, [orders]);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery);
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      let matchesDate = true;
      if (filterType === "day") {
        matchesDate = orderDate.toDateString() === now.toDateString();
      } else if (filterType === "week") {
        matchesDate = orderDate >= getStartOfWeek(now);
      } else if (filterType === "month") {
        matchesDate = orderDate >= getStartOfMonth(now);
      } else if (filterType === "custom" && dateRange.start && dateRange.end) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999);
        matchesDate = orderDate >= start && orderDate <= end;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, filterType, dateRange]);

  // Stats Calculations
  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const revenue = filteredOrders.reduce(
      (acc, o) => acc + (o.totalAmount || 0),
      0,
    );
    const productsSold = filteredOrders.reduce((acc, o) => {
      return (
        acc + o.items.reduce((iAcc, item) => iAcc + (item.quantity || 0), 0)
      );
    }, 0);

    return { totalOrders, revenue, productsSold };
  }, [filteredOrders]);

  // Chart Data (Last 15 days)
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 14; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
      const dayOrders = orders.filter(
        (o) => new Date(o.date).toDateString() === d.toDateString(),
      );
      data.push({
        name: dateStr,
        sales: dayOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0),
        orders: dayOrders.length,
      });
    }
    return data;
  }, [orders]);

  const exportToCSV = () => {
    const headers = [
      t.table.id,
      t.table.customer,
      t.table.phone,
      t.table.product,
      t.table.qty,
      t.table.total,
      t.table.date,
      t.table.status,
    ];

    const rows = filteredOrders.map((o) => [
      o.id,
      o.customerName,
      o.phone,
      o.items.map((i) => i.product.name).join("; "),
      o.items.reduce((acc, i) => acc + i.quantity, 0),
      o.totalAmount,
      new Date(o.date).toLocaleString(),
      o.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sales_report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {t.title}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
            {t.sub}
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Download size={16} />
          {t.export}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 px-2">
        {[
          {
            label: t.summary.today,
            value: summary.today,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
          },
          {
            label: t.summary.yesterday,
            value: summary.yesterday,
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-950/30",
          },
          {
            label: t.summary.week,
            value: summary.week,
            icon: TrendingUp,
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-950/30",
          },
          {
            label: t.summary.month,
            value: summary.month,
            icon: ShoppingBag,
            color: "text-violet-600",
            bg: "bg-violet-50 dark:bg-violet-950/30",
          },
          {
            label: t.summary.lifetime,
            value: summary.lifetime,
            icon: DollarSign,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-950/30",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div
              className={`w-10 h-10 ${card.bg} ${card.color} rounded-xl flex items-center justify-center`}
            >
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {card.label}
              </p>
              <p className={`text-xl font-black ${card.color}`}>
                ৳{card.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Stats & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
              {t.chart}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Sales
                </span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    backgroundColor: "#1e293b",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#4f46e5",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              label: t.stats.totalOrders,
              value: stats.totalOrders,
              icon: ShoppingBag,
              color: "text-indigo-600",
              bg: "bg-indigo-50 dark:bg-indigo-950/30",
            },
            {
              label: t.stats.revenue,
              value: `৳${stats.revenue.toLocaleString()}`,
              icon: DollarSign,
              color: "text-emerald-600",
              bg: "bg-emerald-50 dark:bg-emerald-950/30",
            },
            {
              label: t.stats.productsSold,
              value: stats.productsSold,
              icon: Archive,
              color: "text-amber-600",
              bg: "bg-amber-50 dark:bg-amber-950/30",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5"
            >
              <div
                className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}
              >
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t.filters.search}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950/30 transition-all text-slate-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950/30 transition-all text-slate-900 dark:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">{t.filters.status}: All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl">
            {[
              { id: "all", label: "All" },
              { id: "day", label: t.filters.date },
              { id: "week", label: t.filters.week },
              { id: "month", label: t.filters.month },
              { id: "custom", label: t.filters.custom },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilterType(btn.id as any)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === btn.id ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {(filterType !== "all" || statusFilter !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setFilterType("all");
                setStatusFilter("All");
                setSearchQuery("");
                setDateRange({ start: "", end: "" });
              }}
              className="p-3.5 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all"
              title={t.filters.clear}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {filterType === "custom" && (
          <div className="flex items-center gap-4 animate-in slide-in-from-top-2">
            <input
              type="date"
              className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl outline-none font-bold text-sm text-slate-900 dark:text-white"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
            <span className="text-slate-400 font-black">TO</span>
            <input
              type="date"
              className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl outline-none font-bold text-sm text-slate-900 dark:text-white"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Table View */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.table.id}
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.table.customer}
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.table.product}
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  {t.table.qty}
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.table.total}
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.table.date}
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.table.status}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {order.customerName}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {order.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold text-slate-600 dark:text-slate-400 line-clamp-1"
                          >
                            {item.product.name} ({item.variant.size})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        ৳{order.totalAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30"
                            : order.status === "Cancelled"
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30"
                              : order.status === "Pending"
                                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30"
                                : "bg-blue-50 text-blue-600 dark:bg-blue-950/30"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                      <FileText size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-black uppercase tracking-widest">
                        No orders found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
