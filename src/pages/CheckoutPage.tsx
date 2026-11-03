import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, MapPin, CheckCircle2, AlertCircle, 
  Wallet, CreditCard, Building2, Clock, Package, ChevronRight, Lock, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { FundWalletModal } from '../components/FundWalletModal';
import { Listing, Order } from '../types';

export const CheckoutPage = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { user, authFetch, refreshUser } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [quantity, setQuantity] = useState(1);
  const [fulfilmentType, setFulfilmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [pickupSpot, setPickupSpot] = useState('SUB Complex / Quad Ground Floor');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.campus_area || 'Gidan Kwano - Hostel Block B');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'bank_transfer' | 'card'>('wallet');

  // Submission & Post-Order States
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [showFundModal, setShowFundModal] = useState(false);

  useEffect(() => {
    fetch(`/api/listings/${listingId}`)
      .then(async res => {
        if (!res.ok) throw new Error('Listing not found');
        return res.json();
      })
      .then(data => {
        setListing(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [listingId]);

  if (!user) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-6 text-center my-auto max-w-sm mx-auto">
          <Lock size={36} className="text-amber-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-gray-900">Sign In to Complete Checkout</h2>
          <p className="text-xs text-gray-500 mt-1">You must have a verified student account to purchase on SkulBuy.</p>
          <Link
            to={`/profile?redirect=/checkout/${listingId}`}
            className="mt-4 inline-block bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm"
          >
            Sign In / Register
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-4 space-y-3">
          <div className="h-28 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-40 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-6 text-center my-auto">
          <AlertCircle size={36} className="text-amber-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-gray-900">Listing Unavailable</h2>
          <p className="text-xs text-gray-500 mt-1">{error || 'This item is no longer active for checkout.'}</p>
          <Link to="/categories" className="mt-4 inline-block bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const unitPrice = listing.price;
  const deliveryFee = fulfilmentType === 'delivery' ? 500 : 0;
  const totalAmount = (unitPrice * quantity) + deliveryFee;
  const hasSufficientBalance = (user.wallet_balance || 0) >= totalAmount;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'wallet' && !hasSufficientBalance) {
      setShowFundModal(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await authFetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          quantity,
          fulfilment_type: fulfilmentType,
          fulfilment_address: fulfilmentType === 'pickup' ? pickupSpot : deliveryAddress,
          buyer_phone: buyerPhone,
          buyer_notes: buyerNotes,
          payment_method: paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      setPlacedOrder(data.order || {
        id: data.order_id,
        order_number: data.order_number,
        pickup_code: data.pickup_code,
        total_amount: totalAmount,
        fulfilment_type: fulfilmentType,
        fulfilment_address: fulfilmentType === 'pickup' ? pickupSpot : deliveryAddress
      });
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Error processing checkout');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (placedOrder) {
    return (
      <div className="pb-28 min-h-screen bg-gray-50/50">
        <Header />

        <div className="p-4 max-w-sm mx-auto space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center space-y-3 animate-in fade-in">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Payment Verified & Paid
              </span>
              <h2 className="text-xl font-black text-gray-900 mt-1">Order Confirmed!</h2>
              <p className="text-xs text-gray-500 font-mono font-bold mt-0.5">#{placedOrder.order_number}</p>
            </div>

            {/* Handover PIN Card */}
            <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 text-center space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Your 4-Digit Handover PIN</p>
              <div className="text-3xl font-black tracking-widest font-mono text-amber-900">
                {placedOrder.pickup_code}
              </div>
              <p className="text-[10px] text-amber-700">
                🔒 Safe Handover Rule: Share this code with the seller <strong>only after</strong> you physically inspect and receive your item!
              </p>
            </div>

            {/* Order Details summary */}
            <div className="bg-gray-50 rounded-2xl p-3 text-left text-xs space-y-1.5 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Item:</span>
                <strong className="text-gray-900 truncate max-w-[180px]">{listing.title}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fulfilment:</span>
                <strong className="text-gray-900 capitalize">{placedOrder.fulfilment_type} ({placedOrder.fulfilment_address})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Paid:</span>
                <strong className="text-emerald-600 font-black">₦{Number(placedOrder.total_amount).toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status:</span>
                <span className="text-emerald-700 font-bold uppercase text-[10px]">Settled & Verified</span>
              </div>
            </div>

            {/* Next steps */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-xs py-3 rounded-xl shadow-sm transition"
              >
                Track in My Orders
              </button>

              <button
                onClick={() => navigate('/categories')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition"
              >
                Continue Marketplace Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />

      {/* Top back bar */}
      <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-gray-100 sticky top-[95px] z-30">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          <span>Back to Item</span>
        </button>
        <span className="text-xs font-black text-gray-900">Secure Checkout</span>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Single Seller Order Banner */}
        <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-amber-950">
          <ShieldCheck size={18} className="text-amber-600 shrink-0" />
          <p className="text-[11px] leading-tight">
            <strong>Single-Seller Order:</strong> Your order belongs directly to verified student <strong>{listing.seller_name}</strong> for direct campus handover and buyer protection.
          </p>
        </div>

        {/* Item Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3">
          <div className="flex gap-3">
            <img src={listing.image_url} alt={listing.title} className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                {listing.condition}
              </span>
              <h3 className="font-bold text-xs text-gray-900 truncate mt-1">{listing.title}</h3>
              <p className="text-sm font-black text-amber-600 mt-0.5">₦{Number(listing.price).toLocaleString()}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-gray-700 flex items-center justify-center"
              >
                -
              </button>
              <span className="font-black text-gray-900 w-6 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-gray-700 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Fulfilment Options Card */}
        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3 text-xs">
            <h4 className="font-black text-gray-900">1. Campus Fulfilment Mode</h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFulfilmentType('pickup')}
                className={`p-3 rounded-2xl border text-left transition ${
                  fulfilmentType === 'pickup'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <p className="font-black">Campus Pickup</p>
                <p className="text-[10px] opacity-75">Free (Public Spot)</p>
              </button>

              <button
                type="button"
                onClick={() => setFulfilmentType('delivery')}
                className={`p-3 rounded-2xl border text-left transition ${
                  fulfilmentType === 'delivery'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <p className="font-black">Hostel Delivery</p>
                <p className="text-[10px] opacity-75">+₦500 Flat Fee</p>
              </button>
            </div>

            {fulfilmentType === 'pickup' ? (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Public Pickup Landmark
                </label>
                <select
                  value={pickupSpot}
                  onChange={(e) => setPickupSpot(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none font-bold text-gray-800"
                >
                  <option>SUB Complex / Quad Ground Floor</option>
                  <option>Campus Main Library Steps</option>
                  <option>Gidan Kwano - Hostel Block B Common Room</option>
                  <option>Gidan Kwano - Hall 3 Gate</option>
                  <option>Bosso Campus - Science Quad / Gate</option>
                  <option>School Park Commercial Bus Stop</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Hostel / Lodge Room Address
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Hostel Block B, Room 214"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none font-bold text-gray-800"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Your Contact Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="08012345678"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-gray-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Note for Seller (Optional)
              </label>
              <input
                type="text"
                value={buyerNotes}
                onChange={(e) => setBuyerNotes(e.target.value)}
                placeholder="e.g. Free after 3pm chemistry class"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3 text-xs">
            <h4 className="font-black text-gray-900">2. Payment Method</h4>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                  paymentMethod === 'wallet'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet size={16} className="text-amber-600" />
                  <div>
                    <p className="text-xs">SkulBuy Campus Wallet</p>
                    <p className="text-[10px] opacity-75">
                      Available Balance: ₦{Number(user.wallet_balance || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                {paymentMethod === 'wallet' && <CheckCircle2 size={16} className="text-amber-600" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 size={16} className="text-amber-600" />
                  <div>
                    <p className="text-xs">Direct Bank Transfer</p>
                    <p className="text-[10px] opacity-75">Moniepoint Virtual Account (Instant)</p>
                  </div>
                </div>
                {paymentMethod === 'bank_transfer' && <CheckCircle2 size={16} className="text-amber-600" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard size={16} className="text-amber-600" />
                  <div>
                    <p className="text-xs">Instant Debit Card / USSD</p>
                    <p className="text-[10px] opacity-75">Simulated Gateway Checkout</p>
                  </div>
                </div>
                {paymentMethod === 'card' && <CheckCircle2 size={16} className="text-amber-600" />}
              </button>
            </div>

            {paymentMethod === 'wallet' && !hasSufficientBalance && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
                <span>Insufficient balance for this order.</span>
                <button
                  type="button"
                  onClick={() => setShowFundModal(true)}
                  className="font-black text-amber-700 underline text-[11px]"
                >
                  + Fund Wallet
                </button>
              </div>
            )}
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-2 text-xs">
            <h4 className="font-black text-gray-900">3. Order Total</h4>
            <div className="flex justify-between text-gray-600">
              <span>Item Subtotal ({quantity}x):</span>
              <span className="font-bold">₦{(unitPrice * quantity).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Fulfilment Fee:</span>
              <span className="font-bold">{deliveryFee === 0 ? 'Free (Pickup)' : `₦${deliveryFee.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Payable:</span>
              <span className="text-amber-600">₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 rounded-2xl text-xs shadow-md shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {submitting ? 'Verifying & Processing Payment...' : `Pay & Place Order (₦${totalAmount.toLocaleString()})`}
          </button>
        </form>
      </div>

      <FundWalletModal
        isOpen={showFundModal}
        defaultAmount={totalAmount - (user.wallet_balance || 0)}
        onClose={() => {
          setShowFundModal(false);
          refreshUser();
        }}
      />
    </div>
  );
};
