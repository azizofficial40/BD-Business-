import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../store";
import { getBusinessInsights } from "../services/gemini";
import { Send, Sparkles, User, Bot, Command, Terminal } from "lucide-react";

const AI_T = {
  en: {
    title: "Assistant",
    status: "Ready to advise",
    online: "Online",
    welcome:
      "Welcome to the intelligence hub. I am Sylsas Advisor. How can I optimize your growth today?",
    placeholder: "Query the advisor...",
    loading: "Processing metrics...",
    suggestions: [
      "Revenue vs Growth",
      "Refill Alerts",
      "Profitability",
      "Today's summary",
    ],
  },
  bn: {
    title: "সিলেস এআই",
    status: "উপদেশ দিতে প্রস্তুত",
    online: "অনলাইন",
    welcome:
      "ইন্টেলিজেন্স হাবে আপনাকে স্বাগতম। আপনার ব্যবসার উন্নতিতে আমি কিভাবে সাহায্য করতে পারি?",
    placeholder: "আমাকে প্রশ্ন করুন...",
    loading: "হিসাব নিকেশ চলছে...",
    suggestions: ["বিক্রির হিসাব", "স্টক এলার্ট", "লাভের হার", "আজকের সারাংশ"],
  },
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const state = useStore();
  const t = AI_T[state.language];
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: t.welcome, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await getBusinessInsights(state, input);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] max-w-2xl mx-auto">
      {/* AI Header Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] mb-8 flex items-center justify-between shadow-[0_15px_30px_rgba(0,0,0,0.03)] border border-white dark:border-slate-800">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-900/40">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">
              {t.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {t.status}
              </p>
            </div>
          </div>
        </div>
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-700 rounded-xl flex items-center justify-center">
          <Terminal size={20} />
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto px-1 space-y-8 no-scrollbar pb-10">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-6 duration-500`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div
              className={`max-w-[85%] flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-white dark:border-slate-800"}`}
              >
                {msg.role === "user" ? (
                  <User size={18} />
                ) : (
                  <Sparkles size={18} />
                )}
              </div>
              <div
                className={`p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-[0_8px_30px_rgba(0,0,0,0.02)] ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-white dark:border-slate-800 rounded-tl-none whitespace-pre-wrap"}`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-4 border border-white dark:border-slate-800">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[9px] text-slate-300 dark:text-slate-700 font-black uppercase tracking-widest">
                {t.loading}
              </span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Command Center */}
      <div className="mt-6 space-y-4">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-2">
          {t.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="whitespace-nowrap px-6 py-3 bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-white dark:border-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-800 active:scale-95 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-2xl focus-within:shadow-indigo-100 dark:focus-within:shadow-indigo-900/20 transition-all">
          <input
            type="text"
            placeholder={t.placeholder}
            className="flex-1 bg-transparent px-6 py-2 text-sm font-bold outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-14 h-14 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-100 dark:shadow-indigo-900/40 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-200 dark:disabled:text-slate-700 active:scale-90 transition-all"
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
