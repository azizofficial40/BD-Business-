export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type Language = "en" | "bn";
export type Theme = "light" | "dark";

export interface StockVariant {
  size: Size;
  color: string;
  material?: string;
  quantity: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  ownerEmail: string;
  ownerUid: string;
  phone: string;
  address: string;
  whatsapp?: string;
  bkash?: string;
  nagad?: string;
  rocket?: string;
  slug: string; // For custom URL like /shop/my-shop
  createdAt: string;
  themeColor?: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  title: string;
  category: string;
  subcategory?: string;
  brandName?: string;
  sku: string;
  image: string;
  gallery: string[];
  videoUrl?: string;
  purchasePrice: number;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  shortDescription: string;
  description: string;
  features: string[]; // Bullet points
  variants: StockVariant[];
  reviews?: Review[];
  rating?: number;
  tags: string[];
  weight?: string;
  deliveryCharge: number;
  estimatedDelivery: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isVisible: boolean;
  status: "Published" | "Draft";
}

export interface Customer {
  id: string;
  shopId: string;
  name: string;
  phone: string;
  address: string;
  totalSpent: number;
  totalDue: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  wishlist: string[]; // Product IDs
  orders: string[]; // Order IDs
  createdAt: string;
  role?: "admin" | "customer";
  shopId?: string; // If admin, which shop they manage
}

export interface Coupon {
  id: string;
  shopId: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  isActive: boolean;
}

export type PaymentStatus = "Full Paid" | "Partial Paid" | "Due";

export interface Sale {
  id: string;
  shopId: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  size: Size;
  color: string;
  quantity: number;
  salePrice: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  profit: number;
  date: string;
  paymentStatus: PaymentStatus;
}

export interface Expense {
  id: string;
  shopId: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
}

export interface CartItem {
  product: Product;
  variant: StockVariant;
  quantity: number;
}

export interface Order {
  id: string;
  shopId: string;
  userId?: string | null;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  orderNotes?: string;
  deliveryLocation: "Sylhet" | "Outside";
  items: CartItem[];
  totalAmount: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string | null;
  status:
    | "Pending"
    | "Confirmed"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
  date: string;
  paymentMethod: "COD" | "Bkash" | "Nagad" | "Rocket";
  transactionId?: string | null;
  timeline?: { status: string; date: string; note?: string }[];
}

export interface Banner {
  id: string;
  shopId: string;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  isActive: boolean;
  type: "hero" | "promo" | "category";
}

export interface Collection {
  id: string;
  shopId: string;
  name: string;
  image: string;
  description?: string;
  productIds: string[];
}

export interface FlashSale {
  id: string;
  shopId: string;
  title: string;
  image?: string;
  endTime: string;
  discountPercentage: number;
  productIds: string[];
  isActive: boolean;
}

export type TabType =
  | "dashboard"
  | "sales"
  | "stock"
  | "expense"
  | "customers"
  | "report"
  | "ai"
  | "orders"
  | "settings"
  | "coupons"
  | "analytics"
  | "websiteManagement";

export interface BusinessState {
  shops: Shop[];
  currentShop: Shop | null;
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  orders: Order[];
  expenses: Expense[];
  coupons: Coupon[];
  users: UserProfile[];
  language: Language;
  theme: Theme;
  isLoggedIn: boolean;
  user: UserProfile | null;
  admin: {
    name: string;
    phone: string;
    role: string;
    image: string;
    email: string;
    password: string;
    pin?: string;
    bkash?: string;
    nagad?: string;
    rocket?: string;
    whatsapp?: string;
  };
  apiKey?: string;
}
