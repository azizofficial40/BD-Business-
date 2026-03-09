import React from "react";
import { useStore } from "../store";
import { Mail, Phone, MapPin, ShieldCheck, Heart, Star } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";

const AboutUs: React.FC = () => {
  const { currentShop, language } = useStore();
  const isBn = language === "bn";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
            {isBn ? "আমাদের গল্প" : "Our Story"}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.9]">
            {isBn
              ? "সিলসাস ফ্যাশন: যেখানে স্টাইল ও গুণমানের মিলন"
              : "Sylsas Fashion: Where Style Meets Quality"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-3xl mx-auto leading-relaxed">
            {isBn
              ? "আমরা বিশ্বাস করি ফ্যাশন কেবল পোশাক নয়, এটি আপনার ব্যক্তিত্বের বহিঃপ্রকাশ। সিলসাস ফ্যাশন আপনার জন্য নিয়ে এসেছে আধুনিক এবং আরামদায়ক পোশাকের এক অনন্য সংগ্রহ।"
              : "We believe fashion is more than just clothes; it's an expression of your personality. Sylsas Fashion brings you a unique collection of modern and comfortable apparel."}
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
              <Star size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {isBn ? "আমাদের লক্ষ্য" : "Our Mission"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {isBn
                ? "আমাদের লক্ষ্য হলো সাশ্রয়ী মূল্যে উচ্চমানের ফ্যাশন পণ্য সরবরাহ করা এবং গ্রাহকদের একটি চমৎকার শপিং অভিজ্ঞতা প্রদান করা।"
                : "Our mission is to provide high-quality fashion products at affordable prices and to offer customers an exceptional shopping experience."}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-900 dark:bg-slate-800 p-12 rounded-[3rem] text-white space-y-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-white/10">
              <Heart size={32} />
            </div>
            <h2 className="text-3xl font-black">
              {isBn ? "আমাদের ভিশন" : "Our Vision"}
            </h2>
            <p className="text-slate-300 font-medium leading-relaxed">
              {isBn
                ? "বাংলাদেশের ফ্যাশন জগতে একটি নির্ভরযোগ্য এবং জনপ্রিয় ব্র্যান্ড হিসেবে নিজেদের প্রতিষ্ঠিত করা।"
                : "To establish ourselves as a reliable and popular brand in the fashion industry of Bangladesh."}
            </p>
          </motion.div>
        </div>

        {/* Quality & Service */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">
              {isBn ? "কেন আমাদের পছন্দ করবেন?" : "Why Choose Us?"}
            </h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: isBn ? "সেরা গুণমান" : "Premium Quality",
                desc: isBn
                  ? "আমরা প্রতিটি পণ্যের গুণমান নিশ্চিত করি।"
                  : "We ensure the quality of every single product.",
              },
              {
                icon: Phone,
                title: isBn ? "২৪/৭ সাপোর্ট" : "24/7 Support",
                desc: isBn
                  ? "আমাদের টিম সবসময় আপনার সহায়তায় প্রস্তুত।"
                  : "Our team is always ready to assist you.",
              },
              {
                icon: Mail,
                title: isBn ? "দ্রুত ডেলিভারি" : "Fast Delivery",
                desc: isBn
                  ? "সারা বাংলাদেশে দ্রুততম সময়ে পণ্য পৌঁছে দেই।"
                  : "We deliver products across Bangladesh in the shortest time.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-center space-y-4"
              >
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto">
                  <item.icon size={24} />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-white text-center space-y-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[100px] -ml-32 -mb-32 rounded-full" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black">
              {isBn ? "আমাদের সাথে যোগাযোগ করুন" : "Get in Touch"}
            </h2>
            <p className="text-indigo-100 font-medium text-lg max-w-2xl mx-auto">
              {isBn
                ? "আপনার যেকোনো প্রশ্ন বা মতামতের জন্য আমাদের সাথে যোগাযোগ করতে পারেন।"
                : "For any questions or feedback, feel free to contact us."}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone size={24} />
              </div>
              <p className="font-black text-xl">
                {currentShop?.phone || "+8801618539338"}
              </p>
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">
                Phone
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail size={24} />
              </div>
              <p className="font-black text-xl">
                {currentShop?.ownerEmail || "sylsasfashion@gmail.com"}
              </p>
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">
                Email
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} />
              </div>
              <p className="font-black text-xl">
                {currentShop?.address || "Sylhet, Bangladesh"}
              </p>
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">
                Location
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
