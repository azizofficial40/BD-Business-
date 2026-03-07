import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import {
  ShoppingBag,
  Sparkles,
  LayoutGrid,
  Users,
  TrendingUp,
  ArrowRight,
  Store,
  CheckCircle2,
} from "lucide-react";

const SaaSLanding: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useStore();
  const isBn = language === "bn";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-y-auto selection:bg-indigo-100 transition-colors duration-500"
    >
      <nav className="px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
            <Store size={24} />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Sylsas Platform
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(isBn ? "en" : "bn")}
            className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {isBn ? "English" : "বাংলা"}
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-all active:scale-95"
          >
            {isBn ? "লগইন" : "Login"}
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-700 transition-all active:scale-95 hidden sm:block"
          >
            {isBn ? "শুরু করুন" : "Get Started"}
          </button>
        </div>
      </nav>

      <main className="px-6 pt-16 pb-32 max-w-7xl mx-auto text-center space-y-20">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-bounce">
            {isBn
              ? "আপনার নিজস্ব ই-কমার্স প্ল্যাটফর্ম"
              : "Your Own E-Commerce Platform"}
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
            {isBn ? "আপনার ব্যবসাকে দিন" : "Launch Your Store"}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {isBn ? "ডিজিটাল রূপ" : "In Minutes"}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? "স্টক, সেলস, কাস্টমার ম্যানেজমেন্ট এবং একটি সুন্দর ওয়েবসাইট - সবকিছু এক জায়গায়। আজই আপনার অনলাইন স্টোর তৈরি করুন।"
              : "Inventory, sales, customer CRM, and a beautiful storefront - all in one place. Create your online store today."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isBn ? "ফ্রি স্টোর তৈরি করুন" : "Create Free Store"}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: LayoutGrid,
              title: isBn ? "পাওয়ারফুল ড্যাশবোর্ড" : "Powerful Dashboard",
              desc: isBn
                ? "আপনার ব্যবসার প্রতিটি মুভমেন্ট ট্র্যাক করুন।"
                : "Track every movement of your business instantly.",
            },
            {
              icon: ShoppingBag,
              title: isBn ? "সুন্দর স্টোরফ্রন্ট" : "Beautiful Storefront",
              desc: isBn
                ? "কাস্টমারদের জন্য একটি প্রিমিয়াম শপিং অভিজ্ঞতা।"
                : "A premium shopping experience for your customers.",
            },
            {
              icon: Users,
              title: isBn ? "কাস্টমার রিলেশন" : "Customer CRM",
              desc: isBn
                ? "বাকি টাকা এবং কাস্টমার লয়াল্টি ম্যানেজ করুন সহজে।"
                : "Manage dues and customer loyalty with ease.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-left space-y-4 hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </motion.div>
  );
};

export default SaaSLanding;
