import React, { useState, useMemo } from "react";
import { useStore } from "../store";
import { Order } from "../types";
import {
  Package,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Calendar,
  Filter,
  Search,
} from "lucide-react";

const ORDERS_T = {
  en: {
    title: "Online Orders",
    sub: "Manage customer orders",
    status: {
      Pending: "Pending",
      Confirmed: "Accepted",
      Processing: "Processing",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    },
    empty: "No orders found",
    items: "Items",
    total: "Total",
    customer: "Customer Details",
    actions: "Update Status",
    accept: "Accept Order",
    reject: "Reject & Delete",
    filters: {
      all: "All Time",
      today: "Today",
      yesterday: "Yesterday",
      thisWeek: "This Week",
      thisMonth: "This Month",
      custom: "Custom Range",
      date: "Date",
      start: "Start Date",
      end: "End Date",
    },
  },
  bn: {
    title: "অনলাইন অর্ডার",
    sub: "কাস্টমার অর্ডার ম্যানেজমেন্ট",
    status: {
      Pending: "পেন্ডিং",
      Confirmed: "গৃহীত",
      Processing: "প্রসেসিং",
      Shipped: "শিপড",
      Delivered: "ডেলিভারড",
      Cancelled: "বাতিল",
    },
    empty: "কোনো অর্ডার পাওয়া যায়নি",
    items: "আইটেম",
    total: "মোট",
    customer: "কাস্টমার তথ্য",
    actions: "স্ট্যাটাস পরিবর্তন",
    accept: "অর্ডার গ্রহণ করুন",
    reject: "অর্ডার বাতিল ও ডিলেট",
    filters: {
      all: "সব সময়",
      today: "আজ",
      yesterday: "গতকাল",
      thisWeek: "এই সপ্তাহ",
      thisMonth: "এই মাস",
      custom: "কাস্টম রেঞ্জ",
      date: "তারিখ",
      start: "শুরুর তারিখ",
      end: "শেষের তারিখ",
    },
  },
};

const Orders: React.FC = () => {
  const { orders = [], updateOrderStatus, deleteOrder, language } = useStore();
  const t = ORDERS_T[language];
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Order["status"] | "All">(
    "All",
  );
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Date Filters
  const [dateFilterType, setDateFilterType] = useState<
    "All" | "Today" | "Yesterday" | "Week" | "Month" | "Custom"
  >("All");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status Filter
    if (filterStatus !== "All") {
      result = result.filter((o) => o.status === filterStatus);
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.id.toLowerCase().includes(q),
      );
    }

    // Date Filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dateFilterType === "Today") {
      result = result.filter((o) => {
        const d = new Date(o.date);
        return d >= today;
      });
    } else if (dateFilterType === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      result = result.filter((o) => {
        const d = new Date(o.date);
        return d >= yesterday && d < today;
      });
    } else if (dateFilterType === "Week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      result = result.filter((o) => new Date(o.date) >= weekAgo);
    } else if (dateFilterType === "Month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      result = result.filter((o) => new Date(o.date) >= monthAgo);
    } else if (
      dateFilterType === "Custom" &&
      customStartDate &&
      customEndDate
    ) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((o) => {
        const d = new Date(o.date);
        return d >= start && d <= end;
      });
    }

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [
    orders,
    filterStatus,
    searchQuery,
    dateFilterType,
    customStartDate,
    customEndDate,
  ]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      case "Confirmed":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "Shipped":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      case "Delivered":
        return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Cancelled":
        return "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} />;
      case "Confirmed":
        return <CheckCircle size={16} />;
      case "Shipped":
        return <Truck size={16} />;
      case "Delivered":
        return <Package size={16} />;
      case "Cancelled":
        return <XCircle size={16} />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {t.title}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">
            {t.sub}
          </p>
        </div>
        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-50 dark:border-slate-800">
          <ShoppingBag size={24} />
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={
              language === "bn"
                ? "অর্ডার আইডি, নাম বা ফোন দিয়ে খুঁজুন..."
                : "Search by ID, name or phone..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        {/* Date Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: "All", label: t.filters.all },
            { id: "Today", label: t.filters.today },
            { id: "Yesterday", label: t.filters.yesterday },
            { id: "Week", label: t.filters.thisWeek },
            { id: "Month", label: t.filters.thisMonth },
            { id: "Custom", label: t.filters.custom },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setDateFilterType(filter.id as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                dateFilterType === filter.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Calendar size={12} />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range Inputs */}
        {dateFilterType === "Custom" && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {t.filters.start}
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {t.filters.end}
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            "All",
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filterStatus === status
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {status === "All"
                ? language === "bn"
                  ? "সব স্ট্যাটাস"
                  : "All Status"
                : t.status[status as Order["status"]]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">{t.empty}</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white">
                      #{order.id.slice(-6)}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-lg">
                    ৳{order.totalAmount}
                  </span>
                  {expandedOrder === order.id ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="px-6 pb-6 pt-0 space-y-6 animate-in slide-in-from-top-2">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                      {t.customer}
                    </h4>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500">
                        <ShoppingBag size={14} />
                      </div>
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500">
                        <Phone size={14} />
                      </div>
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500">
                        <MapPin size={14} />
                      </div>
                      <span className="leading-tight">{order.address}</span>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                        Payment Info
                      </h4>
                      <div className="flex items-start gap-3 text-sm font-bold">
                        <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 mt-1">
                          <CreditCard size={14} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2">
                            {order.paymentMethod === "COD"
                              ? "Cash on Delivery"
                              : order.paymentMethod}
                            {order.paymentMethod === "COD" && (
                              <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest">
                                Advance Paid
                              </span>
                            )}
                          </span>
                          {order.transactionId && (
                            <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 dark:text-slate-300 w-fit">
                              TRX: {order.transactionId}
                            </span>
                          )}
                          <div className="text-xs text-slate-500 mt-1">
                            {order.paymentMethod === "COD" ? (
                              <>
                                <p>
                                  Paid: ৳{order.deliveryCharge} (Delivery
                                  Charge)
                                </p>
                                <p className="text-rose-500">
                                  Due: ৳
                                  {order.totalAmount - order.deliveryCharge}
                                </p>
                              </>
                            ) : (
                              <p className="text-emerald-500">
                                Paid: ৳{order.totalAmount} (Full Payment)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                      {t.items}
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              className="w-12 h-12 rounded-xl object-cover"
                              alt={item.product.name}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Package size={20} className="text-slate-300" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-sm">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-slate-500 font-bold">
                              {item.variant.size} • {item.variant.color} • x
                              {item.quantity}
                            </p>
                          </div>
                          <span className="font-black text-sm">
                            ৳{item.product.salePrice * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                      {t.actions}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {order.status === "Pending" ? (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "Confirmed")
                            }
                            className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={18} />
                            {t.accept}
                          </button>
                          {confirmDelete === order.id ? (
                            <div className="flex-1 flex gap-2 animate-in fade-in zoom-in duration-300">
                              <button
                                onClick={() => {
                                  deleteOrder(order.id);
                                  setConfirmDelete(null);
                                }}
                                className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg"
                              >
                                {language === "bn"
                                  ? "হ্যাঁ, ডিলেট করুন"
                                  : "Yes, Delete"}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest"
                              >
                                {language === "bn" ? "না" : "No"}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(order.id)}
                              className="px-6 py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-100 dark:border-rose-800 hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                            >
                              <XCircle size={18} />
                              {t.reject}
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-wrap gap-2 w-full">
                          {[
                            "Confirmed",
                            "Shipped",
                            "Delivered",
                            "Cancelled",
                          ].map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  status as Order["status"],
                                )
                              }
                              disabled={order.status === status}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                order.status === status
                                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                                  : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-500"
                              }`}
                            >
                              {t.status[status as Order["status"]]}
                            </button>
                          ))}
                          {order.status === "Cancelled" &&
                            (confirmDelete === order.id ? (
                              <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                                <button
                                  onClick={() => {
                                    deleteOrder(order.id);
                                    setConfirmDelete(null);
                                  }}
                                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                                >
                                  {language === "bn" ? "হ্যাঁ" : "Yes"}
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                >
                                  {language === "bn" ? "না" : "No"}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(order.id)}
                                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-200 text-rose-500 hover:bg-rose-50 transition-all"
                              >
                                {language === "bn"
                                  ? "ডিলেট করুন"
                                  : "Delete Order"}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
