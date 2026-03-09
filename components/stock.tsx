import React, { useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { useStore } from "../store";
import { Product, Size, StockVariant } from "../types";
import {
  Plus,
  Search,
  AlertCircle,
  Edit3,
  Trash2,
  X,
  Boxes,
  Tag,
  LayoutGrid,
  List,
  ChevronDown,
  Camera,
  Image as ImageIcon,
  Upload,
  Clock,
} from "lucide-react";
import { compressImage } from "../utils/image";
import { uploadImage } from "../services/storage";

const STOCK_T = {
  en: {
    title: "Inventory",
    sub: "Total Lines",
    new: "Add Product",
    edit: "Refine Item",
    save: "Confirm Stock",
    update: "Update Registry",
    search: "Lookup product...",
    low: "Critically Low",
    cost: "Cost Price",
    sale: "Sale Price",
    imgLabel: "Product Visual",
  },
  bn: {
    title: "স্টক তালিকা",
    sub: "মোট আইটেম",
    new: "পণ্য যোগ করুন",
    edit: "এডিট করুন",
    save: "স্টকে জমা দিন",
    update: "আপডেট করুন",
    search: "পণ্য খুঁজুন...",
    low: "স্টক কম আছে",
    cost: "ক্রয় মূল্য",
    sale: "বিক্রয় মূল্য",
    imgLabel: "পণ্যের ছবি",
  },
};

const AVAILABLE_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const COMMON_COLORS = [
  "Black",
  "White",
  "Navy",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Grey",
  "Maroon",
];

const Stock: React.FC = () => {
  const {
    products = [],
    addProduct,
    updateProduct,
    deleteProduct,
    language,
    currentShop,
  } = useStore();
  const t = STOCK_T[language];
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialProductState: Partial<Product> = {
    name: "",
    title: "",
    category: "Shirt",
    subcategory: "",
    brandName: "",
    sku: "",
    purchasePrice: 0,
    regularPrice: 0,
    salePrice: 0,
    discountPercentage: 0,
    shortDescription: "",
    description: "",
    features: [],
    image: "",
    gallery: [],
    videoUrl: "",
    variants: [{ size: "M", color: "Black", material: "Cotton", quantity: 0 }],
    tags: [],
    weight: "",
    deliveryCharge: 60,
    estimatedDelivery: "2-3 Days",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: false,
    isTrending: false,
    isVisible: true,
    status: "Published",
  };

  const [newProduct, setNewProduct] =
    useState<Partial<Product>>(initialProductState);

  const resetForm = () => {
    setNewProduct(initialProductState);
    setEditingId(null);
  };

  const generateSKU = (name: string, category: string) => {
    const prefix = category.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${name.substring(0, 3).toUpperCase()}-${random}`;
  };

  const calculateDiscount = (regular: number, sale: number) => {
    if (!regular || regular <= sale) return 0;
    return Math.round(((regular - sale) / regular) * 100);
  };

  const generateAIContent = async () => {
    if (!newProduct.name && !newProduct.title) {
      alert("Please enter a product name or title first.");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate a compelling product description, short description, tags (comma separated), SEO title, SEO description, and SEO keywords (comma separated) for a product named "${newProduct.title || newProduct.name}" in the category "${newProduct.category}". 
      Return the result as a JSON object with the following keys: 
      - shortDescription
      - description
      - tags
      - seoTitle
      - seoDescription
      - seoKeywords`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const result = JSON.parse(response.text || "{}");
      
      setNewProduct(prev => ({
        ...prev,
        shortDescription: result.shortDescription || prev.shortDescription,
        description: result.description || prev.description,
        tags: result.tags ? result.tags.split(",").map((t: string) => t.trim()) : prev.tags,
        seoTitle: result.seoTitle || prev.seoTitle,
        seoDescription: result.seoDescription || prev.seoDescription,
        seoKeywords: result.seoKeywords || prev.seoKeywords,
      }));
    } catch (error) {
      console.error("Error generating AI content:", error);
      alert("Failed to generate content. Please check your API key.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSave = () => {
    if (!currentShop) {
      alert("Please select a shop first.");
      return;
    }
    if (newProduct.name) {
      const productData = {
        ...newProduct,
        shopId: currentShop.id,
        sku:
          newProduct.sku ||
          generateSKU(newProduct.name, newProduct.category || "GEN"),
        discountPercentage: calculateDiscount(
          newProduct.regularPrice || 0,
          newProduct.salePrice || 0,
        ),
      };
      if (editingId) {
        updateProduct({ id: editingId, ...productData } as Product);
      } else {
        addProduct({ id: Date.now().toString(), ...productData } as Product);
      }
      setIsAdding(false);
      resetForm();
    } else {
      alert("Please enter a product name.");
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isGallery: boolean = false,
  ) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    if (isGallery) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const compressed = await compressImage(files[i]);
          const url = await uploadImage(compressed, "products");
          newImages.push(url);
        } catch (error) {
          console.error("Error compressing/uploading gallery image:", error);
        }
      }
      setNewProduct((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...newImages],
      }));
    } else {
      const file = files[0];
      try {
        const compressed = await compressImage(file);
        const url = await uploadImage(compressed, "products");
        setNewProduct((prev) => ({ ...prev, image: url }));
      } catch (error) {
        console.error("Error compressing/uploading image:", error);
      }
    }
    setIsUploading(false);
  };

  const startEdit = (p: Product) => {
    setNewProduct(p);
    setEditingId(p.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeletingId(null);
  };

  const addVariantField = () =>
    setNewProduct({
      ...newProduct,
      variants: [
        ...(newProduct.variants || []),
        { size: "M", color: "Black", material: "Cotton", quantity: 0 },
      ],
    });

  const [previewMode, setPreviewMode] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {t.title}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            {products.length} {t.sub}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 dark:shadow-indigo-950/30 active:scale-90 transition-all"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="relative group mx-2">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-indigo-500 transition-colors"
          size={20}
        />
        <input
          type="text"
          placeholder={t.search}
          className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-white dark:border-slate-800 rounded-[2rem] outline-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] focus:shadow-md transition-all text-sm font-bold placeholder:text-slate-200 dark:placeholder:text-slate-800 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.map((product) => {
          const totalQty = product.variants.reduce(
            (acc, v) => acc + v.quantity,
            0,
          );
          const isLowStock = product.variants.some((v) => v.quantity < 2);
          const hasDiscount = product.regularPrice > product.salePrice;

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center gap-6 group hover:shadow-xl transition-all relative overflow-hidden"
            >
              {product.isVisible === false && (
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase">
                    Hidden
                  </span>
                </div>
              )}

              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-slate-800 overflow-hidden shadow-sm group-hover:scale-105 transition-transform border border-slate-100 dark:border-slate-700">
                  {product.image ? (
                    <img
                      src={product.image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-700">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                {isLowStock && (
                  <div className="absolute -top-2 -right-2 bg-rose-500 text-white px-2 py-1 rounded-xl shadow-lg flex items-center gap-1 z-20">
                    <AlertCircle size={10} strokeWidth={3} />
                    <span className="text-[7px] font-black uppercase">
                      {t.low}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-2 -left-2 flex flex-col gap-1 z-20">
                  {product.isNewArrival && (
                    <span className="bg-emerald-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded-md uppercase">
                      New
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-amber-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded-md uppercase">
                      Best
                    </span>
                  )}
                  {product.isTrending && (
                    <span className="bg-indigo-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded-md uppercase">
                      Hot
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="bg-purple-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded-md uppercase">
                      Star
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 dark:text-white truncate tracking-tight">
                        {product.name}
                      </h4>
                      <span className="text-[8px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        {product.sku}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        {product.category}
                      </span>
                      {product.brandName && (
                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                          • {product.brandName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900 dark:text-white leading-none">
                      ৳{product.salePrice}
                    </div>
                    {hasDiscount && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-slate-300 line-through font-bold">
                          ৳{product.regularPrice}
                        </span>
                        <span className="text-[10px] text-rose-500 font-black">
                          -{product.discountPercentage}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Boxes
                      size={12}
                      className="text-slate-400 dark:text-slate-500"
                    />
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">
                      Stock: {totalQty}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Tag
                      size={12}
                      className="text-slate-400 dark:text-slate-500"
                    />
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">
                      CP: ৳{product.purchasePrice}
                    </span>
                  </div>
                  {product.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] font-bold text-slate-400 border border-slate-100 dark:border-slate-800 px-2 py-1 rounded-lg uppercase tracking-tighter"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto mt-4 md:mt-0">
                <button
                  onClick={() => startEdit(product)}
                  className="flex-1 md:flex-none w-full md:w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <Edit3 size={18} />
                </button>
                {deletingId === product.id ? (
                  <div className="flex gap-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-1 rounded-xl">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingId(product.id)}
                    className="flex-1 md:flex-none w-full md:w-10 h-10 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-t-[3rem] sm:rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-bottom-20">
            <div className="flex justify-between items-center mb-10 sticky top-0 bg-white dark:bg-slate-900 z-10 py-2">
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {editingId ? t.edit : t.new}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Advanced Product Management
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${previewMode ? "bg-indigo-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-400"}`}
                >
                  {previewMode ? "Edit Mode" : "Preview"}
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
                >
                  <X size={24} className="text-slate-400 dark:text-slate-500" />
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="aspect-square rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-800">
                      {newProduct.image ? (
                        <img
                          src={newProduct.image}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                          <ImageIcon size={64} />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {newProduct.gallery?.map((img, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden"
                        >
                          <img
                            src={img}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                        {newProduct.category}{" "}
                        {newProduct.subcategory &&
                          `> ${newProduct.subcategory}`}
                      </span>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
                        {newProduct.title || newProduct.name || "Product Title"}
                      </h2>
                      <p className="text-slate-400 font-bold mt-2">
                        {newProduct.brandName}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">
                        ৳{newProduct.salePrice}
                      </span>
                      {newProduct.regularPrice! > newProduct.salePrice! && (
                        <span className="text-xl text-slate-300 line-through font-bold">
                          ৳{newProduct.regularPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {newProduct.shortDescription}
                    </p>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Available Variants
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {newProduct.variants?.map((v, i) => (
                          <div
                            key={i}
                            className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black border border-slate-100 dark:border-slate-700"
                          >
                            {v.size} / {v.color}{" "}
                            {v.material && `/ ${v.material}`} ({v.quantity})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-10">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                    Description
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap">
                    {newProduct.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Section 1: Basic Info */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center text-indigo-600">
                        <List size={16} />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                        Basic Information
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={generateAIContent}
                      disabled={isGeneratingAI || (!newProduct.name && !newProduct.title)}
                      className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingAI ? (
                        <span className="animate-pulse">Generating...</span>
                      ) : (
                        <>
                          <span className="text-lg leading-none">✨</span>
                          Generate AI Content
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Internal Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Polo-Black-01"
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 dark:text-white"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Display Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Premium Silk Polo Shirt"
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 dark:text-white"
                        value={newProduct.title}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief summary for product cards..."
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-medium text-sm focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 dark:text-white resize-none"
                      value={newProduct.shortDescription}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          shortDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      Full Description
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Detailed product description..."
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-medium text-sm focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 dark:text-white resize-none"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Section 2: Pricing */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-emerald-600">
                      <Tag size={16} />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      Pricing & Profit
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Cost Price (Admin)
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-black text-lg focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 dark:text-white"
                        value={newProduct.purchasePrice || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            purchasePrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Regular Price
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-black text-lg focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 dark:text-white"
                        value={newProduct.regularPrice || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            regularPrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Sale Price
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-black text-lg focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 dark:text-white"
                        value={newProduct.salePrice || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            salePrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Media */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-amber-50 dark:bg-amber-950/30 rounded-xl flex items-center justify-center text-amber-600">
                      <ImageIcon size={16} />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      Media Assets
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Main Image
                      </label>
                      <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`relative aspect-video bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-200 transition-colors overflow-hidden group ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isUploading && (
                          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center z-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          </div>
                        )}
                        {newProduct.image ? (
                          <img
                            src={newProduct.image}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Camera
                              size={32}
                              className="mx-auto text-slate-300 mb-2"
                            />
                            <p className="text-[10px] font-black text-slate-400 uppercase">
                              Upload Main
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, false)}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Gallery Images
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {newProduct.gallery?.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 dark:border-slate-800"
                          >
                            <img
                              src={img}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() =>
                                setNewProduct((prev) => ({
                                  ...prev,
                                  gallery: prev.gallery?.filter(
                                    (_, i) => i !== idx,
                                  ),
                                }))
                              }
                              className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <label className={`aspect-square rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-100 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-indigo-200 transition-colors relative ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                          {isUploading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                          ) : (
                            <Plus size={20} className="text-slate-400" />
                          )}
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            accept="image/*"
                            disabled={isUploading}
                            onChange={(e) => handleImageChange(e, true)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="YouTube or Vimeo link"
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm dark:text-white"
                      value={newProduct.videoUrl}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          videoUrl: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Section 4: Organization */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center text-blue-600">
                      <LayoutGrid size={16} />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      Organization
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Category
                      </label>
                      <select
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm dark:text-white appearance-none"
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value,
                          })
                        }
                      >
                        {[
                          "Shirt",
                          "Pant",
                          "Panjabi",
                          "T-Shirt",
                          "Polo",
                          "Accessories",
                          "Premium",
                        ].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Formal"
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm dark:text-white"
                        value={newProduct.subcategory}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            subcategory: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Brand / Collection
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sylsas Elite"
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm dark:text-white"
                        value={newProduct.brandName}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            brandName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Variants */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600">
                        <Boxes size={16} />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                        Product Variants
                      </h4>
                    </div>
                    <button
                      onClick={addVariantField}
                      className="text-indigo-600 text-[10px] font-black uppercase tracking-widest"
                    >
                      + Add Variant
                    </button>
                  </div>
                  <div className="space-y-4">
                    {newProduct.variants?.map((v, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl grid grid-cols-2 md:grid-cols-5 gap-4 items-end border border-slate-100 dark:border-slate-700"
                      >
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase ml-2">
                            Size
                          </label>
                          <select
                            className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl text-[10px] font-black outline-none appearance-none dark:text-white"
                            value={v.size}
                            onChange={(e) => {
                              const u = [...(newProduct.variants || [])];
                              u[idx].size = e.target.value as Size;
                              setNewProduct({ ...newProduct, variants: u });
                            }}
                          >
                            {AVAILABLE_SIZES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase ml-2">
                            Color
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl text-[10px] font-black outline-none dark:text-white"
                            value={v.color}
                            onChange={(e) => {
                              const u = [...(newProduct.variants || [])];
                              u[idx].color = e.target.value;
                              setNewProduct({ ...newProduct, variants: u });
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase ml-2">
                            Material
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl text-[10px] font-black outline-none dark:text-white"
                            value={v.material}
                            onChange={(e) => {
                              const u = [...(newProduct.variants || [])];
                              u[idx].material = e.target.value;
                              setNewProduct({ ...newProduct, variants: u });
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase ml-2">
                            Stock Qty
                          </label>
                          <input
                            type="number"
                            className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl text-[10px] font-black outline-none dark:text-white"
                            value={v.quantity}
                            onChange={(e) => {
                              const u = [...(newProduct.variants || [])];
                              u[idx].quantity = Number(e.target.value);
                              setNewProduct({ ...newProduct, variants: u });
                            }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            const u = [...(newProduct.variants || [])];
                            u.splice(idx, 1);
                            setNewProduct({ ...newProduct, variants: u });
                          }}
                          className="p-3 text-rose-400 hover:text-rose-600 justify-self-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 6: Inventory & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600">
                        <Boxes size={16} />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                        Inventory
                      </h4>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        SKU / Product Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Auto-generated if empty"
                          className="flex-1 p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm dark:text-white"
                          value={newProduct.sku}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              sku: e.target.value,
                            })
                          }
                        />
                        <button
                          onClick={() =>
                            setNewProduct({
                              ...newProduct,
                              sku: generateSKU(
                                newProduct.name || "PROD",
                                newProduct.category || "GEN",
                              ),
                            })
                          }
                          className="px-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[8px] font-black uppercase"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center text-indigo-600">
                        <Clock size={16} />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                        Status
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        className="p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest dark:text-white"
                        value={newProduct.status}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            status: e.target.value as "Published" | "Draft",
                          })
                        }
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                      <button
                        onClick={() =>
                          setNewProduct({
                            ...newProduct,
                            isVisible: !newProduct.isVisible,
                          })
                        }
                        className={`p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${newProduct.isVisible ? "bg-emerald-600 border-emerald-600 text-white" : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400"}`}
                      >
                        {newProduct.isVisible ? "Visible" : "Hidden"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 7: Tags & SEO */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-rose-50 dark:bg-rose-950/30 rounded-xl flex items-center justify-center text-rose-600">
                      <Tag size={16} />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      Tags & SEO
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "New Arrival", key: "isNewArrival" },
                      { label: "Best Seller", key: "isBestSeller" },
                      { label: "Featured", key: "isFeatured" },
                      { label: "Trending", key: "isTrending" },
                    ].map((toggle) => (
                      <button
                        key={toggle.key}
                        onClick={() =>
                          setNewProduct({
                            ...newProduct,
                            [toggle.key]:
                              !newProduct[toggle.key as keyof Product],
                          })
                        }
                        className={`p-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all border-2 ${newProduct[toggle.key as keyof Product] ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400"}`}
                      >
                        {toggle.label}
                      </button>
                    ))}
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2.5rem] space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          className="w-full p-4 bg-white dark:bg-slate-900 border-0 rounded-2xl outline-none font-bold text-sm dark:text-white"
                          value={newProduct.seoTitle}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              seoTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                          Search Tags
                        </label>
                        <input
                          type="text"
                          placeholder="Comma separated"
                          className="w-full p-4 bg-white dark:bg-slate-900 border-0 rounded-2xl outline-none font-bold text-sm dark:text-white"
                          value={newProduct.tags?.join(", ")}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              tags: e.target.value
                                .split(",")
                                .map((t) => t.trim()),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Meta Description
                      </label>
                      <textarea
                        rows={2}
                        className="w-full p-4 bg-white dark:bg-slate-900 border-0 rounded-2xl outline-none font-medium text-sm dark:text-white resize-none"
                        value={newProduct.seoDescription}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            seoDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        placeholder="Comma separated keywords"
                        className="w-full p-4 bg-white dark:bg-slate-900 border-0 rounded-2xl outline-none font-medium text-sm dark:text-white"
                        value={newProduct.seoKeywords}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            seoKeywords: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Section 8: Shipping */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-amber-50 dark:bg-amber-950/30 rounded-xl flex items-center justify-center text-amber-600">
                      <Upload size={16} />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      Shipping Information
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Weight (kg)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0.5"
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm dark:text-white"
                        value={newProduct.weight}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            weight: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Delivery Charge
                      </label>
                      <input
                        type="number"
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm dark:text-white"
                        value={newProduct.deliveryCharge}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            deliveryCharge: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Delivery Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2-3 Days"
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl outline-none font-bold text-sm dark:text-white"
                        value={newProduct.estimatedDelivery}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            estimatedDelivery: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-8 pb-2 border-t border-slate-100 dark:border-slate-800 mt-12 flex gap-4">
              <button
                onClick={() => {
                  setNewProduct({ ...newProduct, status: "Draft" });
                  handleSave();
                }}
                disabled={isUploading}
                className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-[2rem] font-black text-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save as Draft
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="flex-[2] py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-100 dark:shadow-indigo-950/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading Images..." : editingId ? "Update Product" : "Publish Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
