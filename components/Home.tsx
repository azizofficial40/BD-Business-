import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import {
  ShoppingBag,
  ArrowRight,
  Star,
  CheckCircle2,
  Mail,
  Zap,
  TrendingUp,
  Sparkles,
  ShoppingCart,
  Eye,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import { Product } from "../types";

const Home: React.FC = () => {
  const {
    products = [],
    banners = [],
    collections = [],
    flashSales = [],
    addToCart,
    handleWhatsAppOrder,
    language,
    currentShop,
  } = useStore();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const featuredProducts = products
    .filter((p) => p.isFeatured && p.isVisible && p.status === "Published")
    .slice(0, 8);
  const newArrivals = products
    .filter((p) => p.isNewArrival && p.isVisible && p.status === "Published")
    .slice(0, 8);
  const trendingProducts = products
    .filter((p) => p.isTrending && p.isVisible && p.status === "Published")
    .slice(0, 8);

  const activeHeroBanners = banners.filter(
    (b) => b.isActive && b.type === "hero",
  );
  const activeFlashSale = flashSales.find((fs) => fs.isActive);

  // Mock reviews if none exist
  const reviews = [
    {
      name: "Ariful Islam",
      rating: 5,
      comment: "Excellent quality and fast delivery. Highly recommended!",
      role: "Verified Buyer",
    },
    {
      name: "Sumaiya Akter",
      rating: 5,
      comment: "The fabric is amazing. Fits perfectly. Will buy again.",
      role: "Verified Buyer",
    },
    {
      name: "Rahat Ahmed",
      rating: 4,
      comment:
        "Good service. The color was slightly different but still looks great.",
      role: "Verified Buyer",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-slate-950 selection:bg-indigo-100 dark:selection:bg-indigo-900/30"
    >
      <Navbar onCartClick={() => navigate(`/s/${currentShop?.slug}/shop`)} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 py-20 lg:py-0">
        <div className="absolute inset-0 z-0">
          {activeHeroBanners.length > 0 ? (
            <motion.img
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 2, ease: "easeOut" }}
              src={activeHeroBanners[0].image}
              className="w-full h-full object-cover"
              alt="Hero"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="w-full h-full bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 md:space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles size={14} className="animate-pulse" />{" "}
                {language === "bn" ? "নতুন কালেকশন ২০২৬" : "New Collection 2026"}
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-[120px] font-black text-white tracking-tighter leading-[0.9] md:leading-[0.8] uppercase">
                {language === "bn" ? "আপনার" : "Elevate"} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  {language === "bn" ? "স্টাইল" : "Style"}
                </span>
              </h1>
              <p className="text-slate-400 text-base md:text-xl font-medium leading-relaxed max-w-lg">
                {language === "bn"
                  ? "আরাম এবং বিলাসিতার এক অনন্য সংমিশ্রণ। আমাদের নতুন কালেকশনটি তাদের জন্য যারা স্টাইলে আপোষ করেন না।"
                  : "Experience the perfect blend of comfort and luxury. Our new collection is designed for those who don't compromise on style."}
              </p>
              <div className="flex flex-wrap gap-4 md:gap-6 pt-4">
                <button
                  onClick={() => navigate(`/s/${currentShop?.slug}/shop`)}
                  className="group relative px-6 py-4 md:px-10 md:py-5 bg-white text-slate-950 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:pr-14"
                >
                  <span className="relative z-10">
                    {language === "bn" ? "এখনই কিনুন" : "Shop Collection"}
                  </span>
                  <ArrowRight
                    className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all"
                    size={20}
                  />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("trending")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-6 py-4 md:px-10 md:py-5 bg-white/5 border border-white/10 text-white rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                >
                  {language === "bn" ? "ট্রেন্ডিং দেখুন" : "View Trending"}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block relative"
            >
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={
                    activeHeroBanners[0]?.image ||
                    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
                  }
                  className="w-full h-full object-cover"
                  alt="Feature"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">
                    Editor's Choice
                  </p>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Premium Silk Collection
                  </h3>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                icon: <Truck size={24} className="md:w-8 md:h-8" />,
                title: language === "bn" ? "ফ্রি শিপিং" : "Free Shipping",
                desc: language === "bn" ? "৫০০০ টাকার উপরে" : "On orders over ৳5000",
                color: "text-indigo-500",
                bg: "bg-indigo-500/10",
              },
              {
                icon: <ShieldCheck size={24} className="md:w-8 md:h-8" />,
                title: language === "bn" ? "নিরাপদ পেমেন্ট" : "Secure Payment",
                desc: language === "bn" ? "১০০% নিরাপদ লেনদেন" : "100% secure transactions",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                icon: <RotateCcw size={24} className="md:w-8 md:h-8" />,
                title: language === "bn" ? "সহজ রিটার্ন" : "Easy Returns",
                desc: language === "bn" ? "৭ দিনের মধ্যে" : "Within 7 days",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                icon: <Headphones size={24} className="md:w-8 md:h-8" />,
                title: language === "bn" ? "২৪/৭ সাপোর্ট" : "24/7 Support",
                desc: language === "bn" ? "যেকোনো সময় কল করুন" : "Call us anytime",
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-indigo-500/20 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-500"
              >
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500`}
                >
                  {feature.icon}
                </div>
                <h4 className="text-sm md:text-lg font-black text-slate-900 dark:text-white mb-1 md:mb-2">
                  {feature.title}
                </h4>
                <p className="text-[10px] md:text-sm text-slate-500 font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-slate-950 py-8 md:py-12 border-y border-white/5 overflow-hidden">
        <div className="flex whitespace-nowrap">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 md:gap-20 items-center pr-12 md:pr-20"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <React.Fragment key={i}>
                <span className="text-4xl md:text-8xl font-black text-white/5 uppercase tracking-tighter">
                  Sylsas Club
                </span>
                <Sparkles className="text-indigo-500/20 w-6 h-6 md:w-10 md:h-10" />
                <span className="text-4xl md:text-8xl font-black text-transparent uppercase tracking-tighter" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                  Premium Quality
                </span>
                <Sparkles className="text-indigo-500/20 w-6 h-6 md:w-10 md:h-10" />
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Flash Sale Banner */}
      {activeFlashSale && (
        <div className="bg-rose-600 text-white py-4 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tighter text-lg">
                  {activeFlashSale.title}
                </h4>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
                  Ending Soon • Up to {activeFlashSale.discountPercentage}% OFF
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/s/${currentShop?.slug}/shop`)}
              className="px-6 py-2 bg-white text-rose-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Grab Now
            </button>
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-white/10 to-transparent skew-x-12 translate-x-1/2"></div>
        </div>
      )}

      {/* Category Showcase */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8 md:mb-12"
        >
          <div className="space-y-1 md:space-y-2">
            <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">
              {language === "bn" ? "কালেকশন" : "Collections"}
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {language === "bn" ? "ক্যাটাগরি অনুযায়ী কিনুন" : "Shop by Category"}
            </h2>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 flex items-center gap-2 group"
          >
            {language === "bn" ? "সব দেখুন" : "View All"}{" "}
            <ArrowRight
              size={14}
              className="md:w-4 md:h-4 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {collections.length > 0
            ? collections.map((col, i) => (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative aspect-[4/5] rounded-3xl md:rounded-[3rem] overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800"
                  onClick={() => navigate(`/s/${currentShop?.slug}/shop?collection=${col.id}`)}
                >
                  <img
                    src={col.image || `https://picsum.photos/seed/${col.name}/600/800`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt={col.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">
                        {col.productIds.length} {language === "bn" ? "পণ্য" : "Products"}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-4">
                        {col.name}
                      </h3>
                      <div className="h-1 w-0 group-hover:w-12 bg-indigo-500 transition-all duration-500 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            : ["Men", "Women", "Kids", "Accessories"].map((cat, i) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative aspect-[4/5] rounded-3xl md:rounded-[3rem] overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800"
                  onClick={() => navigate(`/s/${currentShop?.slug}/shop?category=${cat}`)}
                >
                  <img
                    src={`https://picsum.photos/seed/${cat}/600/800`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt={cat}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">
                        {language === "bn" ? "কালেকশন দেখুন" : "Explore Collection"}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-4">
                        {cat}
                      </h3>
                      <div className="h-1 w-0 group-hover:w-12 bg-indigo-500 transition-all duration-500 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
              <Star size={12} fill="currentColor" /> {language === "bn" ? "সেরা পছন্দ" : "Handpicked for you"}
            </div>
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter">
              {language === "bn" ? "নির্বাচিত পণ্যসমূহ" : "Featured Products"}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8 md:mb-12"
        >
          <div className="space-y-1 md:space-y-2">
            <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">
              {language === "bn" ? "নতুন কালেকশন" : "Fresh Drops"}
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {language === "bn" ? "নতুন পণ্যসমূহ" : "New Arrivals"}
            </h2>
          </div>
          <button
            onClick={() => navigate(`/s/${currentShop?.slug}/shop`)}
            className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 flex items-center gap-2 group"
          >
            {language === "bn" ? "আরও দেখুন" : "See More"}{" "}
            <ArrowRight
              size={14}
              className="md:w-4 md:h-4 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {newArrivals.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">
              Testimonials
            </p>
            <h2 className="text-5xl font-black tracking-tighter">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] space-y-6 hover:bg-white/10 transition-all group"
              >
                <div className="flex gap-1 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-lg font-medium leading-relaxed text-slate-300 italic">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black tracking-tight">{review.name}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {review.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const { handleWhatsAppOrder, language, currentShop } = useStore();

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer"
      onClick={() => navigate(`/s/${currentShop?.slug}/shop?product=${product.id}`)}
    >
      <div className="aspect-[3/4] overflow-hidden relative bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={product.name}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2">
          {product.isNewArrival && (
            <div className="bg-white/90 backdrop-blur-md text-slate-900 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-sm">
              {language === "bn" ? "নতুন" : "New"}
            </div>
          )}
          {product.isTrending && (
            <div className="bg-indigo-600 text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">
              {language === "bn" ? "ট্রেন্ডিং" : "Trending"}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute inset-x-4 md:inset-x-6 bottom-4 md:bottom-6 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 flex gap-2 md:gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/s/${currentShop?.slug}/shop?product=${product.id}`);
            }}
            className="flex-1 py-3 md:py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <Eye size={12} className="md:w-[14px] md:h-[14px]" /> {language === "bn" ? "দেখুন" : "View"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const firstVariant =
                product.variants.find((v) => v.quantity > 0) ||
                product.variants[0];
              handleWhatsAppOrder([
                { product, variant: firstVariant, quantity: 1 },
              ]);
            }}
            className="w-11 h-11 md:w-14 md:h-14 bg-emerald-500 text-white rounded-xl md:rounded-2xl font-black shadow-xl flex items-center justify-center hover:bg-emerald-600 transition-colors"
            title="Order via WhatsApp"
          >
            <MessageCircle size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <div className="p-5 md:p-8 space-y-3 md:space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
              {product.category}
            </p>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={10} fill="currentColor" />
              <span className="text-[9px] md:text-[10px] font-black">4.9</span>
            </div>
          </div>
          <h3 className="font-black text-lg md:text-xl leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.title || product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1 md:pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              ৳{product.salePrice}
            </span>
            {product.regularPrice > product.salePrice && (
              <span className="text-xs md:text-sm text-slate-300 line-through font-bold">
                ৳{product.regularPrice}
              </span>
            )}
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 dark:bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <ShoppingCart size={18} className="md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
