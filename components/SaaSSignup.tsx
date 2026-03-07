import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { Store, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

const SaaSSignup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, createShop, language } = useStore();
  const isBn = language === "bn";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    shopSlug: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "shopName" && step === 2
        ? {
            shopSlug: value
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, ""),
          }
        : {}),
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Please fill all fields");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!formData.shopName || !formData.shopSlug) {
      setError("Shop name and URL are required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // 1. Sign up user
      const uid = await signUp(formData.email, formData.password, formData.name);
      
      if (uid) {
        // 2. Create shop
        const shopId = await createShop({
          name: formData.shopName,
          slug: formData.shopSlug,
          logo: "",
          phone: "",
          address: "",
        });

        if (shopId) {
          navigate("/admin");
        } else {
          setError("Failed to create shop. Please try again.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20 border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Store size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {step === 1 ? (isBn ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account") : (isBn ? "আপনার স্টোর সেটআপ করুন" : "Setup Your Store")}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-widest uppercase">
            Step {step} of 2
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-6">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-4 text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full py-4 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-4 text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full py-4 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-4 text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full py-4 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-4 text-slate-400">
                  Store Name
                </label>
                <div className="relative">
                  <Store className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    name="shopName"
                    required
                    className="w-full py-4 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="My Awesome Store"
                    value={formData.shopName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-4 text-slate-400">
                  Store URL Slug
                </label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    sylsas.com/s/
                  </div>
                  <input
                    type="text"
                    name="shopSlug"
                    required
                    className="w-full py-4 pl-[110px] pr-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="my-store"
                    value={formData.shopSlug}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 ml-4">
                  This will be your store's public web address.
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex gap-4 pt-4">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : step === 1 ? "Next Step" : "Launch Store"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/admin")}
            className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Already have a store? Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SaaSSignup;
