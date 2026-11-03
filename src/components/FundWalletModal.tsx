import React, { useState } from 'react';
import { 
  X, Wallet, ArrowRight, ShieldCheck, CreditCard, 
  CheckCircle2, Copy, AlertCircle, Sparkles, Building2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
}

export const FundWalletModal: React.FC<FundWalletModalProps> = ({ isOpen, onClose, defaultAmount }) => {
  const { user, authFetch, refreshUser } = useAuth();

  const [amount, setAmount] = useState<string>(defaultAmount ? String(defaultAmount) : '2500');
  const [method, setMethod] = useState<'bank_transfer' | 'card_simulation'>('bank_transfer');
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ amount: number; reference: string; new_balance: number } | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!isOpen) return null;

  const presetAmounts = [1000, 2500, 5000, 10000, 20000];

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    const fundAmt = parseFloat(amount);
    if (!fundAmt || fundAmt < 100) {
      alert('Please enter an amount of at least ₦100.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authFetch('/api/wallet/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: fundAmt,
          payment_method: method
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Funding failed');

      setSuccessData({
        amount: fundAmt,
        reference: data.reference,
        new_balance: data.wallet_balance
      });
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Error processing funding');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText('8293019842');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        {successData ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Funding Successful
              </span>
              <h3 className="font-black text-lg text-gray-900 mt-1">Wallet Credited!</h3>
              <p className="text-xs text-gray-500">
                ₦{successData.amount.toLocaleString()} has been added to your balance.
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">New Wallet Balance:</span>
                <strong className="text-gray-900 font-black text-sm">₦{successData.new_balance.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction Ref:</span>
                <span className="font-mono text-gray-700 text-[10px] font-bold">{successData.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-emerald-700 font-bold">Settled Immediately</span>
              </div>
            </div>

            <button
              onClick={() => { setSuccessData(null); onClose(); }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-xs py-3 rounded-xl shadow-sm transition"
            >
              Continue Trading
            </button>
          </div>
        ) : (
          <form onSubmit={handleFund} className="space-y-4 text-xs">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Wallet size={16} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-900">Fund Campus Wallet</h3>
                  <p className="text-[10px] text-gray-400">Current Balance: ₦{Number(user?.wallet_balance || 0).toLocaleString()}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Amount to Deposit (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-gray-400 text-sm">₦</span>
                <input
                  type="number"
                  required
                  min="100"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 rounded-xl py-2.5 pl-8 pr-3 text-base font-black text-gray-900 outline-none transition"
                />
              </div>

              {/* Preset buttons */}
              <div className="flex gap-1.5 mt-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(String(amt))}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] border transition ${
                      amount === String(amt)
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    ₦{amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                Funding Channel
              </label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setMethod('bank_transfer')}
                  className={`w-full p-3 rounded-2xl text-left border flex items-center justify-between transition ${
                    method === 'bank_transfer'
                      ? 'bg-amber-50/80 border-amber-400 text-amber-950 font-bold'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 size={16} className={method === 'bank_transfer' ? 'text-amber-600' : 'text-gray-400'} />
                    <div>
                      <p className="text-xs">Campus Bank Transfer (Free)</p>
                      <p className="text-[10px] opacity-75 font-normal">Dedicated Student Virtual Account</p>
                    </div>
                  </div>
                  {method === 'bank_transfer' && <CheckCircle2 size={16} className="text-amber-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card_simulation')}
                  className={`w-full p-3 rounded-2xl text-left border flex items-center justify-between transition ${
                    method === 'card_simulation'
                      ? 'bg-amber-50/80 border-amber-400 text-amber-950 font-bold'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard size={16} className={method === 'card_simulation' ? 'text-amber-600' : 'text-gray-400'} />
                    <div>
                      <p className="text-xs">Instant Debit Card / USSD</p>
                      <p className="text-[10px] opacity-75 font-normal">Immediate simulated confirmation</p>
                    </div>
                  </div>
                  {method === 'card_simulation' && <CheckCircle2 size={16} className="text-amber-600" />}
                </button>
              </div>
            </div>

            {/* Bank details instruction if bank transfer */}
            {method === 'bank_transfer' && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Bank Name:</span>
                  <strong className="text-gray-900 font-bold">Moniepoint MFB / Sterling</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Account Name:</span>
                  <strong className="text-gray-900 font-bold">SkulBuy Operations (FUTMX)</strong>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                  <span className="text-gray-500">Virtual Account:</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="font-mono text-amber-600 text-sm font-black">8293019842</strong>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="text-gray-400 hover:text-amber-600 transition"
                      title="Copy account number"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
                {copiedAccount && (
                  <p className="text-[10px] text-emerald-600 font-bold text-right">Account number copied!</p>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 rounded-xl text-xs shadow-md shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2"
              >
                {submitting ? 'Confirming Deposit...' : `Deposit ₦${Number(amount || 0).toLocaleString()} to Wallet`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
