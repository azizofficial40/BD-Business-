import React, { useState, useRef } from "react";
import { useStore } from "../store";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Zap,
  LayoutGrid,
  Archive,
} from "lucide-react";
import { Banner, Collection, FlashSale } from "../types";
import { compressImage } from "../utils/image";
import { uploadImage } from "../services/storage";

const WebsiteManagement: React.FC = () => {
  const {
    banners = [],
    collections = [],
    flashSales = [],
    products = [],
    language,
    currentShop,
    addBanner,
    updateBanner,
    deleteBanner,
    addCollection,
    updateCollection,
    deleteCollection,
    addFlashSale,
    updateFlashSale,
    deleteFlashSale,
  } = useStore();

  const [activeSection, setActiveSection] = useState<
    "banners" | "collections" | "flashSales"
  >("banners");

  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // States for new items
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    title: "",
    image: "",
    link: "",
    isActive: true,
    type: "hero",
  });
  const [newCollection, setNewCollection] = useState<Partial<Collection>>({
    name: "",
    description: "",
    image: "",
    productIds: [],
  });
  const [newFlashSale, setNewFlashSale] = useState<Partial<FlashSale>>({
    title: "",
    image: "",
    endTime: "",
    discountPercentage: 0,
    productIds: [],
    isActive: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const compressedImage = await compressImage(file);
        const url = await uploadImage(compressedImage, "website-assets");
        if (activeSection === "banners")
          setNewBanner({ ...newBanner, image: url });
        else if (activeSection === "collections")
          setNewCollection({ ...newCollection, image: url });
        else if (activeSection === "flashSales")
          setNewFlashSale({ ...newFlashSale, image: url });
      } catch (error) {
        console.error("Error compressing/uploading image:", error);
      }
      setIsUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!currentShop) {
      alert("Please select a shop first.");
      return;
    }
    try {
      if (activeSection === "banners") {
        if (!newBanner.title || !newBanner.image) return;
        await addBanner({ ...newBanner, shopId: currentShop.id } as Omit<Banner, "id">);
        setNewBanner({
          title: "",
          image: "",
          link: "",
          isActive: true,
          type: "hero",
        });
      } else if (activeSection === "collections") {
        if (!newCollection.name || !newCollection.image) return;
        await addCollection({ ...newCollection, shopId: currentShop.id } as Omit<Collection, "id">);
        setNewCollection({
          name: "",
          description: "",
          image: "",
          productIds: [],
        });
      } else if (activeSection === "flashSales") {
        if (!newFlashSale.title || !newFlashSale.image) return;
        await addFlashSale({ ...newFlashSale, shopId: currentShop.id } as Omit<FlashSale, "id">);
        setNewFlashSale({
          title: "",
          image: "",
          endTime: "",
          discountPercentage: 0,
          productIds: [],
          isActive: true,
        });
      }
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (activeSection === "banners") await deleteBanner(id);
      else if (activeSection === "collections") await deleteCollection(id);
      else if (activeSection === "flashSales") await deleteFlashSale(id);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (item: any) => {
    try {
      if (activeSection === "banners")
        await updateBanner({ ...item, isActive: !item.isActive });
      else if (activeSection === "flashSales")
        await updateFlashSale({ ...item, isActive: !item.isActive });
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            {language === "bn" ? "ওয়েবসাইট ম্যানেজমেন্ট" : "Website Management"}
          </h2>
          <p className="text-slate-500 font-medium">
            {language === "bn"
              ? "ব্যানার, কালেকশন এবং ফ্ল্যাশ সেল ম্যানেজ করুন।"
              : "Manage banners, collections, and flash sales."}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-200 active:scale-95 transition-all"
        >
          <Plus size={18} /> {language === "bn" ? "নতুন যোগ করুন" : "Add New"}
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => {
            setActiveSection("banners");
            setIsAdding(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeSection === "banners" ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
        >
          <LayoutGrid size={18} /> {language === "bn" ? "ব্যানার" : "Banners"}
        </button>
        <button
          onClick={() => {
            setActiveSection("collections");
            setIsAdding(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeSection === "collections" ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
        >
          <Archive size={18} /> {language === "bn" ? "কালেকশন" : "Collections"}
        </button>
        <button
          onClick={() => {
            setActiveSection("flashSales");
            setIsAdding(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeSection === "flashSales" ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
        >
          <Zap size={18} /> {language === "bn" ? "ফ্ল্যাশ সেল" : "Flash Sales"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-indigo-100 dark:border-indigo-900/30 space-y-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Image Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`w-full h-40 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors overflow-hidden group relative ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                )}
                {(activeSection === "banners" && newBanner.image) ||
                (activeSection === "collections" && newCollection.image) ||
                (activeSection === "flashSales" && newFlashSale.image) ? (
                  <img
                    src={
                      activeSection === "banners"
                        ? newBanner.image
                        : activeSection === "collections"
                          ? newCollection.image
                          : newFlashSale.image
                    }
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageIcon size={32} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Click to Upload
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Banner Specific Fields */}
            {activeSection === "banners" && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
                    value={newBanner.title}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Link URL (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
                    value={newBanner.link}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, link: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Type
                  </label>
                  <select
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
                    value={newBanner.type}
                    onChange={(e) =>
                      setNewBanner({
                        ...newBanner,
                        type: e.target.value as any,
                      })
                    }
                  >
                    <option value="hero">Hero Section</option>
                    <option value="promo">Promotional</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
              </>
            )}

            {/* Collection Specific Fields */}
            {activeSection === "collections" && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
                    value={newCollection.name}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Description
                  </label>
                  <textarea
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
                    value={newCollection.description}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Select Products
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {products.map((product) => (
                      <label
                        key={product.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={newCollection.productIds?.includes(
                            product.id,
                          )}
                          onChange={(e) => {
                            const ids = newCollection.productIds || [];
                            if (e.target.checked)
                              setNewCollection({
                                ...newCollection,
                                productIds: [...ids, product.id],
                              });
                            else
                              setNewCollection({
                                ...newCollection,
                                productIds: ids.filter(
                                  (id) => id !== product.id,
                                ),
                              });
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img
                            src={product.image}
                            className="w-8 h-8 rounded-md object-cover"
                            alt={product.name}
                          />
                          <span className="text-xs font-bold truncate">
                            {product.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Flash Sale Specific Fields */}
            {activeSection === "flashSales" && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Flash Sale Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
                    value={newFlashSale.title}
                    onChange={(e) =>
                      setNewFlashSale({
                        ...newFlashSale,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
                    value={newFlashSale.endTime}
                    onChange={(e) =>
                      setNewFlashSale({
                        ...newFlashSale,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
                    value={newFlashSale.discountPercentage}
                    onChange={(e) =>
                      setNewFlashSale({
                        ...newFlashSale,
                        discountPercentage: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Select Products
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {products.map((product) => (
                      <label
                        key={product.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={newFlashSale.productIds?.includes(
                            product.id,
                          )}
                          onChange={(e) => {
                            const ids = newFlashSale.productIds || [];
                            if (e.target.checked)
                              setNewFlashSale({
                                ...newFlashSale,
                                productIds: [...ids, product.id],
                              });
                            else
                              setNewFlashSale({
                                ...newFlashSale,
                                productIds: ids.filter(
                                  (id) => id !== product.id,
                                ),
                              });
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img
                            src={product.image}
                            className="w-8 h-8 rounded-md object-cover"
                            alt={product.name}
                          />
                          <span className="text-xs font-bold truncate">
                            {product.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsAdding(false)}
              className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={isUploading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* List Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeSection === "banners" &&
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                <img
                  src={banner.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={banner.title}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => toggleStatus(banner)}
                    className={`p-2 rounded-xl backdrop-blur-md border ${banner.isActive ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500" : "bg-rose-500/20 border-rose-500/30 text-rose-500"}`}
                  >
                    {banner.isActive ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                  </button>
                  {deletingId === banner.id ? (
                    <div className="flex gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl">
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="px-3 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(banner.id)}
                      className="p-2 bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-xl backdrop-blur-md"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      {banner.type}
                    </p>
                    <h3 className="text-xl font-black tracking-tight">
                      {banner.title}
                    </h3>
                  </div>
                  {banner.link && (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

        {activeSection === "collections" &&
          collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                <img
                  src={collection.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={collection.name}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {deletingId === collection.id ? (
                    <div className="flex gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl">
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="px-3 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(collection.id)}
                      className="p-2 bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-xl backdrop-blur-md"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div>
                  <h3 className="text-xl font-black tracking-tight">
                    {collection.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2">
                    {collection.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                  <ShoppingBag size={14} /> {collection.productIds.length}{" "}
                  Products
                </div>
              </div>
            </div>
          ))}

        {activeSection === "flashSales" &&
          flashSales.map((flashSale) => (
            <div
              key={flashSale.id}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                {flashSale.image ? (
                  <img
                    src={flashSale.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={flashSale.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                    <Zap size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => toggleStatus(flashSale)}
                    className={`p-2 rounded-xl backdrop-blur-md border ${flashSale.isActive ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500" : "bg-rose-500/20 border-rose-500/30 text-rose-500"}`}
                  >
                    {flashSale.isActive ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                  </button>
                  {deletingId === flashSale.id ? (
                    <div className="flex gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl">
                      <button
                        onClick={() => handleDelete(flashSale.id)}
                        className="px-3 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(flashSale.id)}
                      className="p-2 bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-xl backdrop-blur-md"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div>
                  <h3 className="text-xl font-black tracking-tight">
                    {flashSale.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    Ends: {new Date(flashSale.endTime).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    <ShoppingBag size={14} /> {flashSale.productIds.length}{" "}
                    Products
                  </div>
                  <div className="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-xs font-black">
                    -{flashSale.discountPercentage}%
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default WebsiteManagement;
