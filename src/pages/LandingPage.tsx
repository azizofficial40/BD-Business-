import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            B
          </div>
          <span className="text-xl font-bold tracking-tight">BD Business</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/auth" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Login
          </Link>
          <Link to="/auth" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-24 pb-32 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8">
            Build Your Business <br />
            <span className="text-indigo-600">In Minutes.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            The all-in-one platform to launch your online shop, manage inventory, 
            and track sales with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
              Get Started Now <ArrowRight size={20} />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all">
              View Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Zap className="text-amber-500" />,
                title: "Instant Setup",
                desc: "Sign up and have your professional storefront ready in less than 5 minutes."
              },
              {
                icon: <Globe className="text-blue-500" />,
                title: "Custom Domain",
                desc: "Get a unique URL for your shop that you can share with your customers everywhere."
              },
              {
                icon: <Shield className="text-emerald-500" />,
                title: "Secure & Reliable",
                desc: "Your business data is protected with enterprise-grade security and real-time backups."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-slate-100 text-center text-slate-500 text-sm">
        &copy; 2024 BD Business SaaS. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
