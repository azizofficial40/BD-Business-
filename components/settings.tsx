import React, { useState } from "react";
import { useStore } from "../store";
import {
  Save,
  User,
  Phone,
  Image as ImageIcon,
  Briefcase,
  CheckCircle,
  Lock,
} from "lucide-react";
import { compressImage } from "../utils/image";
import { uploadImage } from "../services/storage";

const SETTINGS_T = {
  en: {
    title: "Shop Settings",
    sub: "Manage your business identity",
    shopName: "Shop Name",
    phone: "Phone Number",
    role: "Designation",
    logoUrl: "Logo URL",
    email: "Admin Email",
    password: "Admin Password",
    apiKey: "Gemini API Key",
    payment: "Payment Numbers (Personal/Agent)",
    save: "Save Settings",
    success: "Settings updated successfully!",
  },
  bn: {
    title: "শপ সেটিংস",
    sub: "আপনার ব্যবসার তথ্য পরিবর্তন করুন",
    shopName: "দোকানের নাম",
    phone: "ফোন নম্বর",
    role: "পদবী",
    logoUrl: "লোগো লিঙ্ক",
    email: "অ্যাডমিন ইমেইল",
    password: "অ্যাডমিন পাসওয়ার্ড",
    apiKey: "জেমিনি এপিআই কি",
    payment: "পেমেন্ট নাম্বার (পার্সোনাল/এজেন্ট)",
    save: "সেভ করুন",
    success: "তথ্য সফলভাবে আপডেট হয়েছে!",
  },
};

const Settings: React.FC = () => {
  const { updateAdmin, updateShopSettings, language, setLanguage, apiKey, setApiKey, toggleTheme, currentShop } = useStore();
  const t = SETTINGS_T[language];
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    image: string;
    bannerImage: string;
    description: string;
    customDomain: string;
    email: string;
    phone: string;
    whatsapp: string;
    bkash: string;
    nagad: string;
    rocket: string;
    password: string;
    paymentMethods: {
      cod: boolean;
      bkash: boolean;
      nagad: boolean;
      rocket: boolean;
    };
    themeOptions: {
      primaryColor: string;
      secondaryColor: string;
      fontStyle: string;
      layoutStyle: string;
    };
    seo: {
      metaTitle: string;
      metaDescription: string;
      metaKeywords: string;
      socialPreviewImage: string;
    };
  }>({
    name: currentShop?.name || "",
    role: "Admin",
    image: currentShop?.logo || "",
    bannerImage: currentShop?.bannerImage || "",
    description: currentShop?.description || "",
    customDomain: currentShop?.customDomain || "",
    email: currentShop?.ownerEmail || "",
    phone: currentShop?.phone || "",
    whatsapp: currentShop?.whatsapp || "",
    bkash: currentShop?.bkash || "",
    nagad: currentShop?.nagad || "",
    rocket: currentShop?.rocket || "",
    password: "",
    paymentMethods: currentShop?.settings?.paymentMethods || {
      cod: true,
      bkash: true,
      nagad: true,
      rocket: true,
    },
    themeOptions: currentShop?.themeOptions || {
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      fontStyle: "Inter",
      layoutStyle: "modern",
    },
    seo: currentShop?.seo || {
      metaTitle: currentShop?.name || "",
      metaDescription: "",
      metaKeywords: "",
      socialPreviewImage: currentShop?.logo || "",
    },
  });
  const [apiKeyValue, setApiKeyValue] = useState(apiKey || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'bannerImage') => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const compressedImage = await compressImage(file);
        const url = await uploadImage(compressedImage, "shop-assets");
        setFormData({ ...formData, [field]: url });
      } catch (error) {
        console.error("Error compressing/uploading image:", error);
      }
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAdmin(formData);
    await updateShopSettings({
      bannerImage: formData.bannerImage,
      description: formData.description,
      customDomain: formData.customDomain,
      themeOptions: formData.themeOptions,
      seo: formData.seo,
    });
    setApiKey(apiKeyValue);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
          {t.title}
        </h2>
        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-50 dark:border-slate-800">
          <Briefcase size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/30 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-full font-bold text-slate-900 dark:text-white"
          >
            {language === "en" ? "বাংলা" : "English"}
          </button>
          <button
            onClick={toggleTheme}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-full font-bold text-slate-900 dark:text-white"
          >
            {language === "en" ? "Toggle Theme" : "থিম পরিবর্তন"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="flex flex-col items-center mb-10">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'image')}
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className={`w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden mb-4 group relative ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isUploading && (
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              )}
              {formData.image ? (
                <img
                  src={formData.image}
                  className="w-full h-full object-cover"
                  alt="Shop Logo"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon size={40} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon size={24} className="text-white" />
              </div>
            </button>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {language === "en"
                ? "Click to upload Logo"
                : "লোগো আপলোড করতে ক্লিক করুন"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {t.shopName}
              </label>
              <div className="relative">
                <User
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700"
                  size={18}
                />
                <input
                  type="text"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {language === "en" ? "Store Description" : "দোকানের বিবরণ"}
              </label>
              <textarea
                className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all min-h-[120px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {language === "en" ? "Banner Image" : "ব্যানার ছবি"}
              </label>
              <input
                type="file"
                ref={bannerInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'bannerImage')}
              />
              <div 
                onClick={() => !isUploading && bannerInputRef.current?.click()}
                className={`relative w-full aspect-[3/1] bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-200 transition-colors overflow-hidden group ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                )}
                {formData.bannerImage ? (
                  <img
                    src={formData.bannerImage}
                    className="w-full h-full object-cover"
                    alt="Banner"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon size={32} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                      {language === "en" ? "Upload Banner" : "ব্যানার আপলোড করুন"}
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon size={24} className="text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {language === "en" ? "Custom Domain" : "কাস্টম ডোমেইন"}
              </label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700">
                  <span className="font-bold">https://</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. www.mystore.com"
                  className="w-full pl-20 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  value={formData.customDomain}
                  onChange={(e) =>
                    setFormData({ ...formData, customDomain: e.target.value })
                  }
                />
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 ml-4">
                {language === "en" ? "Leave empty to use default store URL." : "ডিফল্ট স্টোর ইউআরএল ব্যবহার করতে খালি রাখুন।"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {t.phone}
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700"
                  size={18}
                />
                <input
                  type="text"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {t.role}
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700"
                  size={18}
                />
                <input
                  type="text"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                />
              </div>
            </div>



            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {t.payment}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    Wa
                  </div>
                  <input
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 transition-all"
                    value={formData.whatsapp || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    placeholder="WhatsApp Number"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    Bk
                  </div>
                  <input
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                    value={formData.bkash || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, bkash: e.target.value })
                    }
                    placeholder="Bkash Number"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    Ng
                  </div>
                  <input
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 transition-all"
                    value={formData.nagad || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nagad: e.target.value })
                    }
                    placeholder="Nagad Number"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    Rk
                  </div>
                  <input
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all"
                    value={formData.rocket || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, rocket: e.target.value })
                    }
                    placeholder="Rocket Number"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                {[
                  { id: 'cod', label: 'Cash on Delivery', color: 'bg-slate-500' },
                  { id: 'bkash', label: 'Bkash', color: 'bg-pink-500' },
                  { id: 'nagad', label: 'Nagad', color: 'bg-orange-500' },
                  { id: 'rocket', label: 'Rocket', color: 'bg-purple-500' }
                ].map((method) => (
                  <label key={method.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.paymentMethods[method.id as keyof typeof formData.paymentMethods]}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentMethods: {
                            ...formData.paymentMethods,
                            [method.id]: e.target.checked
                          }
                        })}
                      />
                      <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {language === "en" ? "Theme Options" : "থিম অপশন"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                    {language === "en" ? "Primary Color" : "প্রধান রং"}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      className="w-14 h-14 rounded-2xl cursor-pointer border-0 p-1 bg-slate-50 dark:bg-slate-800"
                      value={formData.themeOptions.primaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          themeOptions: { ...formData.themeOptions, primaryColor: e.target.value }
                        })
                      }
                    />
                    <input
                      type="text"
                      className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all font-mono uppercase"
                      value={formData.themeOptions.primaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          themeOptions: { ...formData.themeOptions, primaryColor: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                    {language === "en" ? "Secondary Color" : "দ্বিতীয় রং"}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      className="w-14 h-14 rounded-2xl cursor-pointer border-0 p-1 bg-slate-50 dark:bg-slate-800"
                      value={formData.themeOptions.secondaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          themeOptions: { ...formData.themeOptions, secondaryColor: e.target.value }
                        })
                      }
                    />
                    <input
                      type="text"
                      className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all font-mono uppercase"
                      value={formData.themeOptions.secondaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          themeOptions: { ...formData.themeOptions, secondaryColor: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                    {language === "en" ? "Font Style" : "ফন্ট স্টাইল"}
                  </label>
                  <select
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all appearance-none"
                    value={formData.themeOptions.fontStyle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        themeOptions: { ...formData.themeOptions, fontStyle: e.target.value }
                      })
                    }
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Space Grotesk">Space Grotesk</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                    {language === "en" ? "Layout Style" : "লেআউট স্টাইল"}
                  </label>
                  <select
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all appearance-none"
                    value={formData.themeOptions.layoutStyle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        themeOptions: { ...formData.themeOptions, layoutStyle: e.target.value }
                      })
                    }
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {language === "en" ? "SEO Settings" : "এসইও সেটিংস"}
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                    {language === "en" ? "Meta Title" : "মেটা টাইটেল"}
                  </label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                    value={formData.seo.metaTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, metaTitle: e.target.value }
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                    {language === "en" ? "Meta Description" : "মেটা বিবরণ"}
                  </label>
                  <textarea
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all min-h-[100px]"
                    value={formData.seo.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, metaDescription: e.target.value }
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                    {language === "en" ? "Meta Keywords (comma separated)" : "মেটা কীওয়ার্ড (কমা দিয়ে আলাদা করুন)"}
                  </label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                    value={formData.seo.metaKeywords}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, metaKeywords: e.target.value }
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {t.apiKey}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700"
                  size={18}
                />
                <input
                  type="password"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  value={apiKeyValue}
                  onChange={(e) => setApiKeyValue(e.target.value)}
                  placeholder="AI-..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {t.email}
              </label>
              <div className="relative">
                <User
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700"
                  size={18}
                />
                <input
                  type="email"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {t.password}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700"
                  size={18}
                />
                <input
                  type="text"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {showSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-center justify-center gap-2 animate-in zoom-in-95">
              <CheckCircle size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                {t.success}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-100 dark:shadow-indigo-950/30 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <Save size={24} />
            )}
            {isUploading ? "Uploading..." : t.save}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
