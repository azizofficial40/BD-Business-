import React, { useState } from "react";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";
import Footer from "./Footer";
import { motion } from "framer-motion";

const Profile: React.FC = () => {
  const { user, orders = [], products = [], logoutUser, currentShop } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist">("orders");

  if (!user) {
    navigate(`/store/${currentShop?.slug}/login`);
    return null;
  }

  const userOrders = orders
    .filter((o) => o.userId === user.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const wishlistProducts = products.filter((p) => user.wishlist.includes(p.id));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
      case "Confirmed":
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case "Processing":
        return "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20";
      case "Shipped":
        return "text-purple-500 bg-purple-50 dark:bg-purple-900/20";
      case "Delivered":
        return "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
      case "Cancelled":
        return "text-rose-500 bg-rose-50 dark:bg-rose-900/20";
      default:
        return "text-slate-500 bg-slate-50 dark:bg-slate-900/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return Clock;
      case "Confirmed":
        return CheckCircle2;
      case "Processing":
        return Package;
      case "Shipped":
        return Truck;
      case "Delivered":
        return CheckCircle2;
      case "Cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20"
    >
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            My Profile
          </h1>
          <button
            onClick={() => {
              logoutUser();
              navigate("/");
            }}
            className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6"
        >
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-slate-500 font-medium">{user.email}</p>
            <p className="text-slate-400 text-sm font-bold mt-1">
              {user.phone}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors relative ${activeTab === "orders" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
          >
            My Orders
            {activeTab === "orders" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors relative ${activeTab === "wishlist" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
          >
            Wishlist ({user.wishlist.length})
            {activeTab === "wishlist" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "orders" ? (
            userOrders.length > 0 ? (
              userOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                          Order #{order.id.slice(-6)}
                        </p>
                        <p className="text-sm font-bold text-slate-500">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 ${getStatusColor(order.status)}`}
                      >
                        <StatusIcon size={14} />
                        {order.status}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                            {item.product.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                <Package size={20} className="text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-xs font-medium text-slate-500">
                              {item.variant.size} • {item.variant.color} • x
                              {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            ৳{item.product.salePrice * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <p className="text-sm font-bold text-slate-500">
                        Total Amount
                      </p>
                      <p className="text-xl font-black text-indigo-600">
                        ৳{order.totalAmount}
                      </p>
                    </div>

                    {/* Timeline Preview */}
                    {order.timeline && order.timeline.length > 0 && (
                      <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                          Latest Update
                        </p>
                        <div className="flex gap-3">
                          <div className="mt-1">
                            <div className="w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-900/30" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {order.timeline[order.timeline.length - 1].status}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {order.timeline[order.timeline.length - 1].note}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-2">
                              {new Date(
                                order.timeline[order.timeline.length - 1].date,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No orders yet</p>
                <button
                  onClick={() => navigate(`/store/${currentShop?.slug}/shop`)}
                  className="mt-4 text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline"
                >
                  Start Shopping
                </button>
              </div>
            )
          ) : wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-4"
                >
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                        <Package size={24} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-indigo-600 font-black mt-1">
                      ৳{product.salePrice}
                    </p>
                    <button
                      onClick={() => navigate(`/store/${currentShop?.slug}/shop?product=${product.id}`)}
                      className="mt-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                    >
                      View Details <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">Your wishlist is empty</p>
              <button
                onClick={() => navigate(`/store/${currentShop?.slug}/shop`)}
                className="mt-4 text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline"
              >
                Explore Products
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Profile;
