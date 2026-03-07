import React, { useState } from "react";
import { useStore } from "../store";
import { Product, Customer, Size, PaymentStatus, Sale } from "../types";
import {
  Plus,
  Search,
  UserPlus,
  CheckCircle2,
  ChevronRight,
  X,
  ArrowLeft,
  Layers,
  Target,
  History,
  Trash2,
  Calendar,
  CreditCard,
  Clock,
  Wallet,
  Package,
} from "lucide-react";

const SALES_T = {
  en: {
    newSale: "New Sale",
    history: "History",
    clientSel: "Client Selection",
    step1: "Step 01: Who is buying?",
    catalog: "Catalog",
    step2: "Step 02: Pick an item",
    config: "Configuration",
    adjust: "Adjust Values",
    payment: "Final Settlement",
    finalize: "Finalize Order",
    success: "Boom! Sold.",
    newAccount: "Create Account",
    fullPaid: "Full Paid",
    partial: "Partial",
    due: "Due (Unpaid)",
  },
  bn: {
    newSale: "নতুন বিক্রি",
    history: "পূর্বের তালিকা",
    clientSel: "কাস্টমার নির্বাচন",
    step1: "ধাপ ১: কে কিনছে?",
    catalog: "ক্যাটালগ",
    step2: "ধাপ ২: পণ্য পছন্দ করুন",
    config: "বিস্তারিত",
    adjust: "দাম ও পরিমাণ",
    payment: "পেমেন্ট স্ট্যাটাস",
    finalize: "বিক্রি নিশ্চিত করুন",
    success: "বিক্রি সম্পন্ন হয়েছে",
    newAccount: "অ্যাকাউন্ট খুলুন",
    fullPaid: "পুরো টাকা পেইড",
    partial: "আংশিক পেমেন্ট",
    due: "বাকি (বকেয়া)",
  },
};

const SalesHistory: React.FC = () => {
  const { sales = [], deleteSale, language } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = sales.filter(
    (s) =>
      s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by product or customer..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl outline-none shadow-sm font-bold text-sm dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filtered.map((sale) => (
        <div
          key={sale.id}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-white dark:border-slate-800 shadow-sm flex items-center justify-between group active:scale-[0.99] transition-all"
        >
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 font-black">
              {sale.productName.charAt(0)}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight">
                {sale.productName}
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                {sale.customerName} • {sale.size} • {sale.color}
              </p>
              <p className="flex items-center gap-1 text-[9px] text-slate-300 dark:text-slate-600 font-bold mt-0.5 uppercase tracking-tighter">
                <Calendar size={10} />{" "}
                {new Date(sale.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-black text-slate-900 dark:text-white">
                ৳{sale.totalAmount}
              </p>
              <span
                className={`text-[8px] font-black uppercase tracking-widest ${sale.paymentStatus === "Full Paid" ? "text-emerald-500" : "text-rose-500"}`}
              >
                {sale.paymentStatus}
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm("Delete sale? Stock will be restored."))
                  deleteSale(sale.id);
              }}
              className="p-2 text-slate-300 dark:text-slate-700 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const StepHeader = ({
  title,
  subtitle,
  step,
  setStep,
}: {
  title: string;
  subtitle: string;
  step: number;
  setStep: (step: number) => void;
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      {step > 1 && step < 6 && (
        <button
          onClick={() => setStep(step - 1)}
          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl active:scale-90 transition-transform"
        >
          <ArrowLeft size={18} className="dark:text-slate-400" />
        </button>
      )}
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
        {title}
      </h2>
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
      {subtitle}
    </p>
  </div>
);

const Sales: React.FC = () => {
  const {
    products = [],
    customers = [],
    addSale,
    addCustomer,
    language,
  } = useStore();
  const t = SALES_T[language];

  const [view, setView] = useState<"form" | "history">("form");
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [selectedSize, setSelectedSize] = useState<Size | "">("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentType, setPaymentType] = useState<PaymentStatus>("Full Paid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const resetForm = () => {
    setStep(1);
    setSelectedProduct(null);
    setSelectedCustomer(null);
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
    setSalePrice(0);
    setPaidAmount(0);
    setPaymentType("Full Paid");
    setSearchTerm("");
  };

  const handleAddCustomer = () => {
    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      totalSpent: 0,
      totalDue: 0,
    };
    addCustomer(customer);
    setSelectedCustomer(customer);
    setShowNewCustomer(false);
    setStep(2);
  };

  const handleCompleteSale = () => {
    if (
      !selectedProduct ||
      !selectedCustomer ||
      !selectedSize ||
      !selectedColor
    )
      return;
    const totalAmount = salePrice * quantity;
    let actualPaid = paidAmount;
    if (paymentType === "Full Paid") actualPaid = totalAmount;
    if (paymentType === "Due") actualPaid = 0;

    const dueAmount = totalAmount - actualPaid;
    const profit = (salePrice - selectedProduct.purchasePrice) * quantity;
    const paymentStatus: PaymentStatus = paymentType;

    addSale({
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      size: selectedSize as Size,
      color: selectedColor,
      quantity,
      salePrice,
      totalAmount,
      paidAmount: actualPaid,
      dueAmount,
      profit,
      date: new Date().toISOString(),
      paymentStatus,
    });
    setStep(6);
  };

  const currentVariant = selectedProduct?.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );
  const maxQty = currentVariant?.quantity || 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] mb-4">
        <button
          onClick={() => setView("form")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-wider transition-all ${view === "form" ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" : "text-slate-400"}`}
        >
          <Plus size={18} /> {t.newSale}
        </button>
        <button
          onClick={() => setView("history")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-wider transition-all ${view === "history" ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" : "text-slate-400"}`}
        >
          <History size={18} /> {t.history}
        </button>
      </div>

      {view === "history" ? (
        <SalesHistory />
      ) : (
        <>
          {step < 6 && (
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-indigo-600 shadow-sm" : "bg-slate-200 dark:bg-slate-800"}`}
                ></div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="animate-in slide-in-from-bottom-6">
              <StepHeader title={t.clientSel} subtitle={t.step1} step={step} setStep={setStep} />
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Phone or name..."
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl outline-none shadow-sm dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setShowNewCustomer(true)}
                  className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-lg shadow-indigo-200"
                >
                  <UserPlus size={24} />
                </button>
              </div>
              <div className="space-y-3">
                {customers
                  .filter(
                    (c) =>
                      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      c.phone.includes(searchTerm),
                  )
                  .map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setStep(2);
                      }}
                      className="w-full bg-white dark:bg-slate-900 p-5 rounded-[1.5rem] border border-white dark:border-slate-800 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                          <Layers size={22} />
                        </div>
                        <div className="text-left">
                          <p className="font-extrabold text-slate-900 dark:text-white">
                            {customer.name}
                          </p>
                          <p className="text-xs font-bold text-slate-400">
                            {customer.phone}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-slate-300 dark:text-slate-700"
                      />
                    </button>
                  ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-bottom-6">
              <StepHeader title={t.catalog} subtitle={t.step2} step={step} setStep={setStep} />
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => {
                  const totalStock = product.variants.reduce(
                    (acc, v) => acc + v.quantity,
                    0,
                  );
                  return (
                    <button
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setStep(3);
                      }}
                      className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-white dark:border-slate-800 shadow-sm text-left group"
                    >
                      <div className="relative overflow-hidden rounded-[1.5rem] mb-4 aspect-square">
                        {product.image ? (
                          <img
                            src={product.image}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Package size={24} className="text-slate-300" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-xl text-[9px] font-black uppercase dark:text-white">
                          {totalStock} in Stock
                        </div>
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                        {product.name}
                      </h4>
                      <p className="text-indigo-600 dark:text-indigo-400 font-black mt-1 uppercase text-[10px]">
                        Cost: ৳{product.purchasePrice}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && selectedProduct && (
            <div className="animate-in slide-in-from-bottom-6">
              <StepHeader
                title={t.config}
                subtitle={`${selectedProduct.name}`}
                step={step}
                setStep={setStep}
              />
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl">
                <div className="mb-8">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                    Sizes
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_SIZES.map((sz) => {
                      const available = selectedProduct.variants.some(
                        (v) => v.size === sz && v.quantity > 0,
                      );
                      return (
                        <button
                          key={sz}
                          disabled={!available}
                          onClick={() => setSelectedSize(sz as Size)}
                          className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-sm transition-all ${selectedSize === sz ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : available ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200" : "bg-slate-50 dark:bg-slate-900 text-slate-200 dark:text-slate-800"}`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedSize && (
                  <div className="animate-in fade-in slide-in-from-top-4">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                      Shade
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {selectedProduct.variants
                        .filter(
                          (v) => v.size === selectedSize && v.quantity > 0,
                        )
                        .map((v) => (
                          <button
                            key={v.color}
                            onClick={() => setSelectedColor(v.color)}
                            className={`px-6 py-3 rounded-2xl border-2 text-sm font-black transition-all ${selectedColor === v.color ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 dark:text-white"}`}
                          >
                            {v.color}{" "}
                            <span className="opacity-50 ml-2">
                              ({v.quantity})
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
                <button
                  disabled={!selectedSize || !selectedColor}
                  onClick={() => setStep(4)}
                  className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-100 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                >
                  {SALES_T[language].adjust}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in slide-in-from-bottom-6">
              <StepHeader title={t.adjust} subtitle="Adjusting totals" step={step} setStep={setStep} />
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl">
                <div className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl mb-8">
                  {selectedProduct?.image ? (
                    <img
                      src={selectedProduct.image}
                      className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm">
                      <Package size={24} className="text-slate-300" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-lg leading-tight">
                      {selectedProduct?.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                      {selectedSize} • {selectedColor} • {maxQty} left
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={maxQty}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl outline-none font-black text-xl text-center dark:text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Sell Price
                    </label>
                    <input
                      type="number"
                      value={salePrice || ""}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl outline-none font-black text-xl text-indigo-600 dark:text-indigo-400 text-center"
                    />
                  </div>
                </div>
                <div className="p-8 bg-indigo-600 rounded-[2rem] text-center shadow-2xl mb-8 text-white font-black text-3xl">
                  ৳{(salePrice * quantity).toLocaleString()}
                </div>
                <button
                  disabled={quantity > maxQty || quantity < 1 || salePrice <= 0}
                  onClick={() => {
                    setPaidAmount(salePrice * quantity);
                    setStep(5);
                  }}
                  className="w-full py-5 bg-indigo-800 text-white rounded-3xl font-black shadow-xl active:scale-95 transition-all"
                >
                  Next to Payment
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in slide-in-from-bottom-6">
              <StepHeader title={t.payment} subtitle="Collecting funds" step={step} setStep={setStep} />
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl text-center space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Total Receivable
                  </p>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white">
                    ৳{(salePrice * quantity).toLocaleString()}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setPaymentType("Full Paid")}
                    className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${paymentType === "Full Paid" ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 shadow-inner" : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl ${paymentType === "Full Paid" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"}`}
                      >
                        <CheckCircle2 size={24} />
                      </div>
                      <span className="font-black text-slate-800 dark:text-slate-200">
                        {t.fullPaid}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentType("Partial Paid")}
                    className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${paymentType === "Partial Paid" ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-inner" : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl ${paymentType === "Partial Paid" ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"}`}
                      >
                        <Wallet size={24} />
                      </div>
                      <span className="font-black text-slate-800 dark:text-slate-200">
                        {t.partial}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentType("Due")}
                    className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${paymentType === "Due" ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 shadow-inner" : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl ${paymentType === "Due" ? "bg-rose-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"}`}
                      >
                        <Clock size={24} />
                      </div>
                      <span className="font-black text-slate-800 dark:text-slate-200">
                        {t.due}
                      </span>
                    </div>
                  </button>
                </div>

                {paymentType === "Partial Paid" && (
                  <div className="animate-in zoom-in-95 duration-300">
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">
                      Enter Received Amount
                    </label>
                    <input
                      type="number"
                      value={paidAmount || ""}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      className="w-full p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] outline-none text-3xl font-black text-center text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                )}

                <button
                  onClick={handleCompleteSale}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100 active:scale-95 transition-all"
                >
                  <CheckCircle2 size={24} /> {t.finalize}
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
                <Target size={64} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                {t.success}
              </h2>
              <button
                onClick={resetForm}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl"
              >
                Start Next Sale
              </button>
            </div>
          )}
        </>
      )}

      {showNewCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
              New Client
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl outline-none dark:text-white"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl outline-none dark:text-white"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl outline-none dark:text-white"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
              />
              <button
                onClick={handleAddCustomer}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl mt-6"
              >
                {t.newAccount}
              </button>
              <button
                onClick={() => setShowNewCustomer(false)}
                className="w-full py-3 text-slate-400 font-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AVAILABLE_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

export default Sales;
