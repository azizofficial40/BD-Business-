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
  const { updateAdmin, language, apiKey, setApiKey, currentShop } = useStore();
  const t = SETTINGS_T[language];
  const [formData, setFormData] = useState({
    name: currentShop?.name || "",
    role: "Admin",
    image: currentShop?.logo || "",
    email: currentShop?.ownerEmail || "",
    phone: currentShop?.phone || "",
    whatsapp: currentShop?.whatsapp || "",
    bkash: currentShop?.bkash || "",
    nagad: currentShop?.nagad || "",
    rocket: currentShop?.rocket || "",
  });
  const [apiKeyValue, setApiKeyValue] = useState(apiKey || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setFormData({ ...formData, image: compressedImage });
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAdmin(formData);
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

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="flex flex-col items-center mb-10">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden mb-4 group relative"
            >
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
                ? "Click to upload from gallery"
                : "গ্যালারি থেকে আপলোড করতে ক্লিক করুন"}
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

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
                {t.logoUrl}
              </label>
              <div className="relative">
                <ImageIcon
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700"
                  size={18}
                />
                <input
                  type="text"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
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
            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-100 dark:shadow-indigo-950/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Save size={24} />
            {t.save}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
