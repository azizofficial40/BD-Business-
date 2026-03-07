import React, { useState } from "react";
import { useStore } from "../store";
import {
  Search,
  Phone,
  MapPin,
  User,
  ChevronRight,
  AlertTriangle,
  Coins,
  CheckCircle,
  X,
  Receipt,
  Wallet,
  ArrowDownCircle,
} from "lucide-react";

const CUSTOMERS_T = {
  en: {
    title: "Customer Ledger",
    dueAlert: "Due",
    clearAlert: "Clear",
    receive: "Settle Payment",
    totalSpent: "Total Bought",
    totalPaid: "Total Paid",
    currentDue: "Current Due",
    history: "History",
    noHistory: "No transactions found.",
    close: "Close",
    paySuccess: "Payment recorded!",
    invalidAmount: "Invalid amount entered",
    overpayment: "Payment exceeds current due!",
    payConfirm: "Settle Debt",
  },
  bn: {
    title: "কাস্টমার লেজার",
    dueAlert: "বকেয়া",
    clearAlert: "ক্লিয়ার",
    receive: "বকেয়া পরিশোধ করুন",
    totalSpent: "মোট কেনা",
    totalPaid: "মোট পরিশোধ",
    currentDue: "বর্তমান বকেয়া",
    history: "পূর্বের লেনদেন",
    noHistory: "কোন লেনদেন পাওয়া যায়নি।",
    close: "বন্ধ করুন",
    paySuccess: "পেমেন্ট সফলভাবে জমা হয়েছে!",
    invalidAmount: "সঠিক অংক লিখুন",
    overpayment: "বকেয়ার বেশি পরিশোধ করা সম্ভব নয়!",
    payConfirm: "পরিশোধ নিশ্চিত করুন",
  },
};

const Customers: React.FC = () => {
  const {
    customers = [],
    sales = [],
    receivePayment,
    language,
    users = [],
  } = useStore();
  const t = CUSTOMERS_T[language];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"ledger" | "registered">("ledger");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm),
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const customerDetails = customers.find((c) => c.id === selectedCustomer);
  const customerSales = sales.filter((s) => s.customerId === selectedCustomer);

  const handleReceivePayment = () => {
    if (!customerDetails) return;

    if (payAmount <= 0) {
      setErrorMsg(t.invalidAmount);
      return;
    }

    if (payAmount > customerDetails.totalDue) {
      setErrorMsg(t.overpayment);
      return;
    }

    receivePayment(customerDetails.id, payAmount);
    setShowPaymentModal(false);
    setPayAmount(0);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
          {t.title}
        </h2>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setViewType("ledger")}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewType === "ledger" ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm" : "text-slate-400"}`}
          >
            Ledger
          </button>
          <button
            onClick={() => setViewType("registered")}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewType === "registered" ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm" : "text-slate-400"}`}
          >
            Registered
          </button>
        </div>
      </div>

      <div className="relative mx-2 group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-indigo-500 transition-colors"
          size={20}
        />
        <input
          type="text"
          placeholder={
            language === "en"
              ? "Search by name or phone..."
              : "নাম বা ফোন দিয়ে খুঁজুন..."
          }
          className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-white dark:border-slate-800 rounded-[2rem] outline-none shadow-sm focus:shadow-md transition-all text-sm font-bold placeholder:text-slate-200 dark:placeholder:text-slate-800 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {viewType === "ledger"
          ? filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer.id)}
                className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all hover:shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${customer.totalDue > 0 ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500" : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500"}`}
                  >
                    <User size={28} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-slate-900 dark:text-white">
                      {customer.name}
                    </h4>
                    <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase mt-1 tracking-widest">
                      {customer.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    {customer.totalDue > 0 ? (
                      <div className="flex items-center gap-1.5 text-rose-600 font-black text-xs mb-1.5 bg-rose-50 dark:bg-rose-950/30 px-3 py-1 rounded-full animate-pulse">
                        <AlertTriangle size={12} /> {t.dueAlert}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] mb-1.5 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full uppercase tracking-tighter">
                        <CheckCircle size={10} /> {t.clearAlert}
                      </div>
                    )}
                    <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none">
                      ৳{customer.totalDue.toLocaleString()}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-200 dark:text-slate-800 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </button>
            ))
          : filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-sm flex items-center justify-between group transition-all hover:shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <User size={28} />
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-slate-900 dark:text-white">
                      {user.name || "Anonymous"}
                    </h4>
                    <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase mt-1 tracking-widest">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                    ID: {user.id.slice(0, 8)}...
                  </span>
                  <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-2">
                    Role: {user.role || "Customer"}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Detail Panel */}
      {selectedCustomer && customerDetails && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[60] flex items-end justify-center p-0 md:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl h-[94vh] rounded-t-[3rem] md:rounded-[3rem] flex flex-col animate-in slide-in-from-bottom-20 shadow-2xl relative overflow-hidden">
            {/* Gradient Accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-40 ${customerDetails.totalDue > 0 ? "bg-gradient-to-b from-rose-50 dark:from-rose-950/20 to-transparent" : "bg-gradient-to-b from-emerald-50 dark:from-emerald-950/20 to-transparent"}`}
            ></div>

            <div className="relative z-10 p-8 border-b border-white/20 dark:border-slate-800/20 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Client Ledger
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Status:{" "}
                  {customerDetails.totalDue > 0 ? t.dueAlert : t.clearAlert}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-12 h-12 flex items-center justify-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-400 dark:text-slate-500 rounded-2xl active:scale-90 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar pb-32 relative z-10">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-28 h-28 rounded-[3rem] flex items-center justify-center mb-6 shadow-2xl ${customerDetails.totalDue > 0 ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-rose-100 dark:shadow-none" : "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-emerald-100 dark:shadow-none"} border-4 border-white dark:border-slate-700`}
                >
                  <User size={56} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {customerDetails.name}
                </h2>
                <div className="flex flex-col gap-2 mt-4 text-slate-400 text-sm font-bold">
                  <p className="flex items-center gap-2 justify-center">
                    <Phone size={16} className="text-indigo-400" />{" "}
                    {customerDetails.phone}
                  </p>
                  <p className="flex items-center gap-2 justify-center">
                    <MapPin size={16} className="text-indigo-400" />{" "}
                    {customerDetails.address ||
                      (language === "en" ? "No address saved" : "ঠিকানা নেই")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-white dark:border-slate-700 flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.totalSpent}
                  </p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">
                    ৳{customerDetails.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-white dark:border-slate-700 flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.totalPaid}
                  </p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    ৳
                    {(
                      customerDetails.totalSpent - customerDetails.totalDue
                    ).toLocaleString()}
                  </p>
                </div>
                <div
                  className={`${customerDetails.totalDue > 0 ? "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50" : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50"} p-8 rounded-[2.5rem] border shadow-sm flex justify-between items-center`}
                >
                  <p className="text-[12px] font-black uppercase tracking-widest dark:text-white/70">
                    {t.currentDue}
                  </p>
                  <p
                    className={`text-3xl font-black ${customerDetails.totalDue > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}
                  >
                    ৳{customerDetails.totalDue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 dark:text-white mb-6 flex items-center justify-between px-2">
                  {t.history}
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full uppercase font-black">
                    {customerSales.length} Transactions
                  </span>
                </h4>
                <div className="space-y-4">
                  {customerSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="p-6 bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2rem] flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500">
                          <Receipt size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-sm">
                            {sale.productName}
                          </p>
                          <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 mt-0.5 uppercase tracking-tighter">
                            {new Date(sale.date).toLocaleDateString()} •{" "}
                            {sale.quantity} Unit
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 dark:text-white">
                          ৳{sale.totalAmount.toLocaleString()}
                        </p>
                        <div
                          className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-2 inline-block ${sale.dueAmount > 0 ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500" : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500"}`}
                        >
                          {sale.dueAmount > 0
                            ? `৳${sale.dueAmount} Pending`
                            : t.clearAlert}
                        </div>
                      </div>
                    </div>
                  ))}
                  {customerSales.length === 0 && (
                    <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                      <p className="text-slate-300 dark:text-slate-700 font-bold text-sm italic">
                        {t.noHistory}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {customerDetails.totalDue > 0 && (
              <div className="absolute bottom-10 left-8 right-8 z-20">
                <button
                  onClick={() => {
                    setShowPaymentModal(true);
                    setErrorMsg(null);
                  }}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-100 dark:shadow-indigo-950/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <ArrowDownCircle size={24} />
                  {t.receive}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settle Debt Modal */}
      {showPaymentModal && customerDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl z-[70] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              {t.payConfirm}
            </h3>
            <div className="mb-8">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Client: {customerDetails.name}
              </p>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">
                {t.currentDue}: ৳{customerDetails.totalDue.toLocaleString()}
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 font-black text-xl">
                  ৳
                </span>
                <input
                  type="number"
                  className={`w-full pl-12 pr-6 py-6 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none text-4xl font-black transition-colors ${errorMsg ? "text-rose-500 bg-rose-50 dark:bg-rose-950/30" : "text-emerald-600 dark:text-emerald-400"}`}
                  autoFocus
                  placeholder="0.00"
                  value={payAmount || ""}
                  onChange={(e) => {
                    setPayAmount(Number(e.target.value));
                    setErrorMsg(null);
                  }}
                />
              </div>

              {errorMsg && (
                <p className="text-center text-xs font-black text-rose-500 uppercase tracking-widest animate-bounce">
                  {errorMsg}
                </p>
              )}

              <button
                onClick={handleReceivePayment}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-indigo-950/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <CheckCircle size={20} /> {t.payConfirm}
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 text-slate-300 dark:text-slate-700 font-black text-sm uppercase tracking-widest"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
