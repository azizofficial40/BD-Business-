import React from "react";
import { useStore } from "../store";
import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const FloatingWhatsApp: React.FC = () => {
  const { currentShop } = useStore();
  const location = useLocation();

  // Don't show on admin dashboard or SaaS landing
  if (location.pathname.startsWith("/admin") || location.pathname === "/" || location.pathname === "/signup") return null;

  return (
    <a
      href={`https://wa.me/88${currentShop?.whatsapp || "01618539338"}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[200] w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-bounce"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} fill="white" />
    </a>
  );
};

export default FloatingWhatsApp;
