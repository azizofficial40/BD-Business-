import React from "react";
import { useStore } from "../store";
import {
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer: React.FC = () => {
  const { language, currentShop } = useStore();
  const isBn = language === "bn";

  const socialLinks = {
    facebook: "https://www.facebook.com/sylsasfashion",
    tiktok: "https://www.tiktok.com/@sylsas_fashion?_r=1&_t=ZS-94RcNgfVQR7",
    whatsapp: `https://wa.me/88${currentShop?.whatsapp || "01618539338"}`,
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-32 px-6 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
              <ShoppingBag size={24} />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentShop?.name || "Shop"}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {isBn
              ? "সিলসাস ফ্যাশন আপনার স্টাইল স্টেটমেন্টকে নতুনভাবে সংজ্ঞায়িত করতে প্রতিশ্রুতিবদ্ধ। আমরা সেরা মানের পোশাক এবং অসাধারণ সেবা প্রদান করি।"
              : "Sylsas Fashion is committed to redefining your style statement. We provide premium quality clothing and exceptional service."}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <Facebook size={20} />
            </a>
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-black hover:text-white transition-all shadow-sm"
            >
              <TikTokIcon size={20} />
            </a>
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            {isBn ? "দ্রুত লিঙ্ক" : "Quick Links"}
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                to={`/s/${currentShop?.slug}/shop`}
                className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {isBn ? "শপ" : "Shop"}
              </Link>
            </li>
            <li>
              <Link
                to={`/s/${currentShop?.slug}/about`}
                className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {isBn ? "আমাদের সম্পর্কে" : "About Us"}
              </Link>
            </li>
            <li>
              <Link
                to={`/s/${currentShop?.slug}/profile`}
                className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {isBn ? "আমার প্রোফাইল" : "My Profile"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            {isBn ? "যোগাযোগ" : "Contact"}
          </h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
              <Phone size={16} className="text-indigo-600" />
              {currentShop?.phone || "+880 1618-539338"}
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
              <Mail size={16} className="text-indigo-600" />
              {currentShop?.ownerEmail || "info@sylsas.com"}
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
              <MapPin size={16} className="text-indigo-600" />
              {currentShop?.address || "Sylhet, Bangladesh"}
            </li>
          </ul>
        </div>

        {/* Newsletter/Trust */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            {isBn ? "নিরাপদ শপিং" : "Secure Shopping"}
          </h4>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              {isBn
                ? "আপনার তথ্য আমাদের কাছে নিরাপদ। আমরা ক্যাশ অন ডেলিভারি এবং নিরাপদ পেমেন্ট গেটওয়ে সাপোর্ট করি।"
                : "Your data is safe with us. We support Cash on Delivery and secure payment gateways."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          © {new Date().getFullYear()} {currentShop?.name || "Shop"}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
            Privacy Policy
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
            Terms of Service
          </span>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
