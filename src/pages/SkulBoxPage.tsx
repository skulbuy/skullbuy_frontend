import React, { useState, useEffect } from 'react';
import { 
  Package, Calendar, TrendingUp, CheckCircle2, AlertCircle, 
  ArrowRight, ShieldCheck, Clock, CreditCard, Sparkles, 
  ChevronRight, RefreshCw, Layers, Check, MapPin, AlertTriangle, X
} from 'lucide-react';
import { motion } from 'motion/react';
import { SkulBoxCycle, SkulBoxSubscription } from '../types';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

export const SkulBoxPage = () => {
  const { user, authFetch } = useAuth();

  const [activeCycle, setActiveCycle] = useState<SkulBoxCycle | null>(null);
  const [allCycles, setAllCycles] = useState<SkulBoxCycle[]>([]);
  const [mySubscriptions, setMySubscriptions] = useState<SkulBoxSubscription[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<'25k' | '50k'>('25k');
  const [paymentPlan, setPaymentPlan] = useState<'daily' | 'one_time'>('daily');
  const [deliveryLocation, setDeliveryLocation] = useState('Gidan Kwano - Hostel Block A');

  // Checkout modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'card_simulation'>('bank_transfer');
  const [initialPaymentAmount, setInitialPaymentAmount] = useState('833');
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  // Daily contribution modal for existing active subscription
  const [contributeSubId, setContributeSubId] = useState<number | null>(null);
  const [customContribution, setCustomContribution] = useState('833');
  const [contributeSubmitting, setContributeSubmitting] = useState(false);

  const packages = [
    {
      id: '25k' as const,
      name: 'Standard Student Box',
      price: 25000,
      dailyRate: 833,
      profit: 5000,
      badge: 'Popular',
      items: [
        'Rice (5kg royal stall)',
        'Oloyin Beans (2kg clean)',
        'Vegetable Oil (1 Litre)',
        'Golden Penny Pasta (2 packs)',
        'Knorr Seasoning Cubes (1 pack)',
        'Iodized Table Salt (1 pack)'
      ]
    },
    {
      id: '50k' as const,
      name: 'Premium Student Box',
      price: 50000,
      dailyRate: 1667,
      profit: 8000,
      badge: 'Full Semester',
      items: [
        'Rice (10kg high grade)',
        'Oloyin Beans (5kg clean)',
        'Vegetable Cooking Oil (3 Litres)',
        'Golden Penny Pasta (5 packs)',
        'Golden Penny Semovita (2kg)',
        'Medium Tubers of Yam (3 tubers)',
        'Tomato Paste Sachets (1 roll)'
      ]
    }
  ];

  const loadData = () => {
    fetch('/api/skulbox/active-cycle').then(res => res.json()).then(setActiveCycle).catch(console.error);
    fetch('/api/skulbox/cycles').then(res => res.json()).then(setAllCycles).catch(console.error);

    if (user) {
      authFetch('/api/skulbox/my-subscriptions')
        .then(res => res.json())
        .then(data => setMySubscriptions(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in or select a student persona from the top header to subscribe.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authFetch('/api/skulbox/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_type: selectedPackage,
          payment_plan: paymentPlan,
          delivery_location: deliveryLocation,
          initial_payment: paymentPlan === 'one_time' ? (selectedPackage === '50k' ? 50000 : 25000) : initialPaymentAmount,
          payment_method: paymentMethod
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');

      setSuccessData({
        ...data,
        ref: `SKB-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
        packageName: packages.find(p => p.id === selectedPackage)?.name,
        amount: paymentPlan === 'one_time' ? (selectedPackage === '50k' ? 50000 : 25000) : initialPaymentAmount
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Subscription failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMakeContribution = async (subId: number) => {
    setContributeSubmitting(true);
    try {
      const res = await authFetch('/api/skulbox/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription_id: subId,
          amount: parseFloat(customContribution),
          payment_method: 'card_simulation'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');
      alert(`Contribution of ₦${Number(customContribution).toLocaleString()} confirmed! Reference: ${data.ref}`);
      setContributeSubId(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Contribution failed');
    } finally {
      setContributeSubmitting(false);
    }
  };

  const currentPkg = packages.find(p => p.id === selectedPackage)!;

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />

      {/* Program Header (BOX-02) */}
      <section className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white px-4 pt-6 pb-8 rounded-b-3xl relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles size={11} className="text-amber-200" />
            <span>FUTMX Student Grocery Sub-Platform</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight leading-tight">
            SkulBox Savings Programme
          </h1>
          <p className="text-xs text-amber-50 mt-1 leading-relaxed">
            Eliminate end-of-month hunger. Join our cooperative foodstuff procurement model with flexible daily micro-savings.
          </p>
        </div>
        <Package className="absolute -right-8 -bottom-8 w-44 h-40 text-white/10 rotate-12 pointer-events-none" />
      </section>

      <div className="px-4 -mt-4 relative z-20 space-y-4">
        {/* Managed Cycle Information Box (BOX-01, BOX-03) */}
        <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Managed Cycle (WAT)</p>
              <h2 className="text-sm font-extrabold text-gray-900 mt-0.5">
                {activeCycle ? activeCycle.name : 'November 2026 Cycle'}
              </h2>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Cycle Open
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
            <div className="bg-amber-50/60 rounded-xl p-2.5 border border-amber-100">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase">
                <Clock size={11} />
                <span>Orders Close</span>
              </div>
              <p className="text-xs font-black text-gray-900 mt-0.5">25th of the Month</p>
              <p className="text-[9px] text-gray-500">23:59 WAT strict deadline</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-200">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-600 uppercase">
                <Calendar size={11} />
                <span>Hostel Fulfilment</span>
              </div>
              <p className="text-xs font-black text-gray-900 mt-0.5">1st Week of Month</p>
              <p className="text-[9px] text-gray-500">Direct campus pickup</p>
            </div>
          </div>
        </div>

        {/* Existing Active Subscriptions Tracker (BOX-05) */}
        {user && mySubscriptions.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-2xs">
            <h3 className="font-extrabold text-xs uppercase text-gray-400 tracking-wider mb-3">
              Your Active Subscriptions
            </h3>
            <div className="space-y-3">
              {mySubscriptions.map((sub) => {
                const percent = Math.min(100, Math.round((sub.paid_amount / sub.total_amount) * 100));
                const remaining = Math.max(0, sub.total_amount - sub.paid_amount);

                return (
                  <div key={sub.id} className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-black text-gray-900">{sub.package_name}</p>
                        <p className="text-[10px] text-gray-500">Target Cycle: {sub.cycle_name || 'Active Cycle'}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        sub.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status === 'completed' ? 'Fully Funded' : `${percent}% Saved`}
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] font-medium text-gray-600">
                      <span>Saved: <strong className="text-gray-900 font-bold">₦{sub.paid_amount.toLocaleString()}</strong></span>
                      <span>Target: <strong className="text-gray-900 font-bold">₦{sub.total_amount.toLocaleString()}</strong></span>
                    </div>

                    {sub.status !== 'completed' && (
                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-[10px] text-amber-800 font-semibold">
                          ₦{remaining.toLocaleString()} remaining to secure box
                        </span>
                        <button
                          onClick={() => { setContributeSubId(sub.id); setCustomContribution('833'); }}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          + Add Contribution
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Package Selector Cards (BOX-04) */}
        <div>
          <h2 className="font-extrabold text-sm text-gray-900 mb-2">Select a SkulBox Package</h2>
          <div className="grid gap-3">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer relative overflow-hidden shadow-2xs ${
                  selectedPackage === pkg.id ? 'border-amber-500 bg-amber-50/10' : 'border-gray-200/80 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {pkg.badge}
                    </span>
                    <h3 className="font-extrabold text-sm text-gray-900 mt-1">{pkg.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-amber-600">₦{pkg.price.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 font-medium">or ~₦{pkg.dailyRate}/day</p>
                  </div>
                </div>

                <div className="space-y-1.5 my-3">
                  {pkg.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-700">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Est. Market Savings: ~₦{pkg.profit.toLocaleString()}
                  </span>
                  <span className="font-bold text-amber-600 flex items-center gap-0.5">
                    Select <ChevronRight size={13} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cooperative Daily Savings Breakdown (BOX-04, BOX-07) */}
        <div className="bg-gray-900 text-white rounded-2xl p-4.5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400">
              Cooperative Daily Micro-Savings
            </h3>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-medium">30-Day Cycle</span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Avoid bulk financial strain. Students contribute daily micro-amounts automatically tracked in their personal SkulBox ledger.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-white/10 rounded-xl p-2.5">
              <p className="text-[9px] uppercase text-gray-400 font-bold">Standard Daily Target</p>
              <p className="text-sm font-black text-white mt-0.5">₦833 / day</p>
              <p className="text-[9px] text-gray-400">30 days = ₦25,000</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5">
              <p className="text-[9px] uppercase text-gray-400 font-bold">Grace Period</p>
              <p className="text-sm font-black text-amber-400 mt-0.5">3 Days</p>
              <p className="text-[9px] text-gray-400">No penalties for missed days</p>
            </div>
          </div>
        </div>

        {/* Subscribe CTA Button */}
        <div className="pt-2">
          <button
            onClick={() => setShowCheckoutModal(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3.5 px-4 rounded-xl font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Subscribe to {currentPkg.name} (₦{currentPkg.price.toLocaleString()})</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Trust & Legal Disclaimer (POL-01, BOX-07) */}
        <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-200/80 text-[10px] text-amber-950 space-y-1">
          <p className="font-bold flex items-center gap-1">
            <ShieldCheck size={12} className="text-amber-700" />
            <span>SkulBox Programme Governance & Transparency:</span>
          </p>
          <p>
            SkulBox is a student cooperative food procurement program managed by SkulBuy Operations at FUT Minna. Contributions are directly allocated to forward wholesale agricultural procurement and delivered on scheduled monthly dates.
          </p>
        </div>
      </div>

      {/* Subscription Checkout Modal (BOX-04, BOX-05) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            {successData ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="font-black text-base text-gray-900">Subscription Confirmed!</h3>
                <p className="text-xs text-gray-600">
                  You are now registered for <strong>{successData.packageName}</strong>.
                </p>

                <div className="bg-gray-50 p-3 rounded-xl text-left text-xs space-y-1 border border-gray-200">
                  <p className="text-gray-500">Payment Reference: <strong className="text-gray-900 font-mono">{successData.ref}</strong></p>
                  <p className="text-gray-500">Amount Recorded: <strong className="text-gray-900">₦{Number(successData.amount).toLocaleString()}</strong></p>
                  <p className="text-gray-500">Delivery Cycle: <strong className="text-gray-900">{activeCycle?.cycle_month || 'Active Cycle'}</strong></p>
                </div>

                <button
                  onClick={() => { setShowCheckoutModal(false); setSuccessData(null); }}
                  className="w-full bg-amber-500 text-white font-bold text-xs py-2.5 rounded-xl mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h3 className="font-extrabold text-sm text-gray-900">Confirm SkulBox Order</h3>
                  <button type="button" onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Selected Box</p>
                  <p className="font-extrabold text-sm text-gray-900">{currentPkg.name} (₦{currentPkg.price.toLocaleString()})</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Choose Payment Schedule</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('daily')}
                      className={`py-2 px-3 rounded-xl text-center border font-bold transition ${
                        paymentPlan === 'daily' ? 'bg-amber-500 text-white border-amber-500' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      Daily Savings
                      <span className="block text-[9px] font-normal opacity-90">₦{currentPkg.dailyRate}/day</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('one_time')}
                      className={`py-2 px-3 rounded-xl text-center border font-bold transition ${
                        paymentPlan === 'one_time' ? 'bg-amber-500 text-white border-amber-500' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      One-Time Pay
                      <span className="block text-[9px] font-normal opacity-90">₦{currentPkg.price.toLocaleString()}</span>
                    </button>
                  </div>
                </div>

                {paymentPlan === 'daily' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Initial Deposit (₦)
                    </label>
                    <input
                      type="number"
                      required
                      min="500"
                      value={initialPaymentAmount}
                      onChange={(e) => setInitialPaymentAmount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-black text-gray-900"
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">Pay today's contribution to start the plan.</p>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Campus Hostel Delivery Point</label>
                  <select
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  >
                    <option>Gidan Kwano - Hostel Block A</option>
                    <option>Gidan Kwano - Hostel Block B</option>
                    <option>Gidan Kwano - Hall 3 Common Room</option>
                    <option>Bosso Campus - Shuttle Terminal Point</option>
                    <option>Off-Campus - Gate Lodge Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Payment Method</label>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`w-full py-2 px-3 rounded-xl text-left border flex items-center justify-between font-medium transition ${
                        paymentMethod === 'bank_transfer' ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <span>Campus Bank Transfer (Recommended)</span>
                      <ShieldCheck size={14} className="text-amber-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card_simulation')}
                      className={`w-full py-2 px-3 rounded-xl text-left border flex items-center justify-between font-medium transition ${
                        paymentMethod === 'card_simulation' ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <span>Instant Card / Online Checkout (Test Mode)</span>
                      <CreditCard size={14} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-[10px] text-amber-950 space-y-0.5">
                    <p className="font-bold">Official SkulBox Operations Account:</p>
                    <p>Bank: <strong className="font-semibold">Moniepoint MFB / Sterling</strong></p>
                    <p>Account Name: <strong className="font-semibold">SkulBuy Student Services</strong></p>
                    <p>Use your matric number or name as the transfer remark.</p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3 rounded-xl shadow-sm transition"
                  >
                    {submitting ? 'Processing...' : 'Confirm Subscription'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Daily Contribution Modal */}
      {contributeSubId !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100">
            <h3 className="font-extrabold text-sm text-gray-900 mb-1">Make Daily Contribution</h3>
            <p className="text-[11px] text-gray-500 mb-3">Add funds toward your active SkulBox cycle.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contribution Amount (₦)</label>
                <input
                  type="number"
                  min="200"
                  step="50"
                  value={customContribution}
                  onChange={(e) => setCustomContribution(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-black text-gray-900"
                />
              </div>

              <div className="flex gap-2">
                {['833', '1000', '2500', '5000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomContribution(amt)}
                    className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-bold text-gray-700"
                  >
                    ₦{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setContributeSubId(null)}
                className="py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleMakeContribution(contributeSubId)}
                disabled={contributeSubmitting}
                className="py-2.5 rounded-xl bg-amber-500 text-white text-xs font-black"
              >
                {contributeSubmitting ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
