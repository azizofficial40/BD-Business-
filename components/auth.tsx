import React, { useState } from "react";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Phone, ArrowRight } from "lucide-react";

const Auth: React.FC = () => {
  const { loginUser, currentShop } = useStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, phone);
      navigate(`/s/${currentShop?.slug}/profile`);
    } catch (error) {
      console.error(error);
      alert("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20 border border-slate-100 dark:border-slate-800">
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 rotate-3 hover:rotate-0 transition-transform duration-500">
            {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isLogin ? "Welcome Back" : "Join Sylsas"}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-widest uppercase">
            {isLogin ? "Access your account" : "Start your journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest ml-4 text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="email"
                required
                className="w-full py-4 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest ml-4 text-slate-400">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="tel"
                required
                className="w-full py-4 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="+880 17..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
