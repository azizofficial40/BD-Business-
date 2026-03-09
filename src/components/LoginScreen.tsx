import React, { useState } from "react";
import { useStore } from "../../store";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

const TRANSLATIONS = {
  en: {
    loginTitle: "Sylsas Fashion",
    loginSub: "Secure Terminal Access",
    loginBtn: "Enter System",
    emailPlaceholder: "Email Address",
    passPlaceholder: "Password",
    invalidCreds: "Invalid Credentials!",
  },
  bn: {
    loginTitle: "সিলেস ফ্যাশন",
    loginSub: "সিকিউর এক্সেস",
    loginBtn: "প্রবেশ করুন",
    emailPlaceholder: "ইমেইল অ্যাড্রেস",
    passPlaceholder: "পাসওয়ার্ড",
    invalidCreds: "ভুল ইমেইল বা পাসওয়ার্ড!",
  },
};

const LoginScreen: React.FC = () => {
  const { login, language } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const t = TRANSLATIONS[language];

  const handleLogin = async () => {
    const success = await login(email, password);
    if (!success) setErr(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white dark:bg-slate-950 z-[200] flex items-center justify-center p-6 transition-colors duration-500"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-sm space-y-12 text-center"
      >
        <div className="space-y-4">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/40 rotate-6 hover:rotate-0 transition-transform duration-500">
            <LogIn size={44} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.loginTitle}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-widest uppercase">
            {t.loginSub}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            className={`w-full p-5 bg-slate-50 dark:bg-slate-900 border-0 rounded-2xl outline-none font-bold transition-all focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 ${err ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500" : "text-slate-900 dark:text-white"}`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr(false);
            }}
          />
          <input
            type="password"
            placeholder={t.passPlaceholder}
            className={`w-full p-5 bg-slate-50 dark:bg-slate-900 border-0 rounded-2xl outline-none font-bold transition-all focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 ${err ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500" : "text-slate-900 dark:text-white"}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErr(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {err && (
            <p className="text-rose-500 font-black text-xs uppercase tracking-widest animate-bounce">
              {t.invalidCreds}
            </p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-indigo-900/30 active:scale-95 transition-all mt-4"
          >
            {t.loginBtn}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginScreen;
