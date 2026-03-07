import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { handleFirestoreError, OperationType } from '../services/firestoreErrorHandler';
import { Store, Globe, Image as ImageIcon, ArrowRight, CheckCircle2, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingBusiness = async () => {
      if (!auth.currentUser) return;
      const q = query(collection(db, 'tenants'), where('ownerId', '==', auth.currentUser.uid));
      try {
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          navigate('/admin');
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'tenants');
      } finally {
        setChecking(false);
      }
    };
    checkExistingBusiness();
  }, [navigate]);

  const handleCreateBusiness = async () => {
    if (!auth.currentUser || !businessName || !slug) return;
    setLoading(true);
    try {
      // Check if slug is taken
      const q = query(collection(db, 'tenants'), where('slug', '==', slug.toLowerCase()));
      let snapshot;
      try {
        snapshot = await getDocs(q);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'tenants');
        return;
      }
      
      if (!snapshot.empty) {
        alert('This shop URL is already taken. Please try another one.');
        setLoading(false);
        return;
      }

      try {
        await addDoc(collection(db, 'tenants'), {
          name: businessName,
          slug: slug.toLowerCase(),
          logo: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=random`,
          ownerId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          settings: {
            theme: 'default',
            currency: 'BDT',
            contactEmail: auth.currentUser.email
          }
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'tenants');
      }
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              <div className={`h-1 w-16 md:w-32 rounded-full ${
                step > s ? 'bg-indigo-600' : 'bg-slate-200'
              } ${s === 3 ? 'hidden' : ''}`}></div>
            </div>
          ))}
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100"
        >
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Name Your Business</h2>
              <p className="text-slate-500 mb-8 text-lg">What should we call your shop?</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Business Name</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => {
                        setBusinessName(e.target.value);
                        setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg"
                      placeholder="e.g. Sylsas Fashion"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Shop URL</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <div className="flex items-center w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <span className="text-slate-400 mr-1">bdbusiness.com/s/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        className="bg-transparent outline-none flex-1 text-indigo-600 font-semibold"
                        placeholder="your-shop-name"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!businessName || !slug}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  Next Step <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Add Your Logo</h2>
              <p className="text-slate-500 mb-8 text-lg">Make your brand stand out.</p>
              
              <div className="space-y-8">
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                  {logo ? (
                    <img src={logo} alt="Logo Preview" className="w-32 h-32 object-contain mb-4" />
                  ) : (
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm mb-4">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <p className="text-sm font-semibold text-slate-600">Click to upload logo</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateBusiness}
                    disabled={loading}
                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Creating...' : 'Launch My Business'} <Rocket size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">You're All Set!</h2>
              <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                Your business <strong>{businessName}</strong> is ready. <br />
                Your shop is live at: <br />
                <span className="text-indigo-600 font-bold">bdbusiness.com/s/{slug}</span>
              </p>
              
              <button
                onClick={() => navigate('/admin')}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
              >
                Go to Admin Dashboard <ArrowRight size={20} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingPage;
