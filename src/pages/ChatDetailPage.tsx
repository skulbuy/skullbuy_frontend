import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, ShieldCheck, AlertTriangle, 
  Tag, CheckCircle2, DollarSign, Clock, MapPin, X, 
  Wallet, CreditCard, Sparkles, AlertCircle 
} from 'lucide-react';
import { Chat, Message, Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { FundWalletModal } from '../components/FundWalletModal';

export const ChatDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, authFetch, refreshUser } = useAuth();

  const [chat, setChat] = useState<Chat | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Offer modal
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerInput, setOfferInput] = useState('');

  // Wallet pay modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmountInput, setPayAmountInput] = useState('');
  const [paying, setPaying] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChat = () => {
    authFetch(`/api/chats/${id}/messages`)
      .then(res => res.json())
      .then(data => {
        setChat(data.chat);
        setListing(data.listing);
        setMessages(data.messages || []);
        if (data.listing) {
          setPayAmountInput(String(data.listing.price));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchChat();
    }
  }, [id, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent, customContent?: string, offerAmount?: number) => {
    if (e) e.preventDefault();
    const text = customContent !== undefined ? customContent : inputContent;
    if (!text.trim() && !offerAmount) return;

    try {
      const res = await authFetch(`/api/chats/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text,
          offer_amount: offerAmount || null
        })
      });
      if (res.ok) {
        setInputContent('');
        setShowOfferModal(false);
        fetchChat();
      }
    } catch {
      alert('Failed to send message');
    }
  };

  const handleMarkSold = async () => {
    if (!listing) return;
    try {
      await authFetch(`/api/listings/${listing.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sold' })
      });
      alert('Listing marked as Sold! You earned +50 SkulBox points.');
      fetchChat();
    } catch {
      alert('Error updating status');
    }
  };

  const handlePayFromWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    const amount = parseFloat(payAmountInput);
    if (!amount || amount <= 0) {
      alert('Please specify a valid payment amount.');
      return;
    }

    if ((user?.wallet_balance || 0) < amount) {
      setShowPayModal(false);
      setShowFundModal(true);
      return;
    }

    setPaying(true);
    try {
      const res = await authFetch('/api/wallet/pay-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          amount: amount,
          chat_id: Number(id)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');

      alert(`Payment of ₦${amount.toLocaleString()} transferred to ${listing.seller_name}! Ref: ${data.reference}`);
      setShowPayModal(false);
      await refreshUser();
      fetchChat();
    } catch (err: any) {
      alert(err.message || 'Payment processing error');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-4 text-center my-auto">
          <p className="text-xs text-gray-500">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!chat || !listing) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-8 text-center my-auto">
          <AlertTriangle size={32} className="text-amber-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-900">Conversation Not Found</h3>
          <button onClick={() => navigate('/messages')} className="mt-4 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl">
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  const isSeller = user?.id === listing.seller_id;
  const isBuyer = user?.id === chat.buyer_id;
  const otherPartyName = isSeller ? chat.buyer_name : listing.seller_name;
  const sellerArea = listing.seller_area || chat.seller_area || listing.campus_location || 'Gidan Kwano Campus';
  const buyerArea = chat.buyer_area || 'Bosso Campus';

  return (
    <div className="pb-24 min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Header />

        {/* Chat top info header */}
        <div className="bg-white px-4 py-2.5 border-b border-gray-100 sticky top-[95px] z-30 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/messages')} className="text-gray-500 hover:text-gray-900 p-1">
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                {otherPartyName}
                {listing.seller_verified === 'verified' && (
                  <ShieldCheck size={12} className="text-emerald-600" />
                )}
              </p>
              <p className="text-[10px] text-gray-500 truncate max-w-[140px]">
                {isSeller ? `Buyer at ${buyerArea}` : `Seller at ${sellerArea}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isBuyer && listing.status === 'active' && (
              <button
                onClick={() => setShowPayModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1 active:scale-95 transition"
              >
                <Wallet size={11} />
                <span>Pay Seller</span>
              </button>
            )}

            <button
              onClick={() => setShowOfferModal(true)}
              className="bg-amber-50 text-amber-800 hover:bg-amber-100 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-amber-200 transition flex items-center gap-1"
            >
              <Tag size={11} />
              <span>Offer</span>
            </button>

            {isSeller && listing.status === 'active' && (
              <button
                onClick={handleMarkSold}
                className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-emerald-200"
              >
                Mark Sold
              </button>
            )}
          </div>
        </div>

        {/* Attached Listing Bar */}
        <Link
          to={`/listing/${listing.id}`}
          className="bg-gray-100/90 px-4 py-2 border-b border-gray-200 flex items-center justify-between hover:bg-gray-200/70 transition"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={listing.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-200 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-gray-900 truncate">{listing.title}</p>
                {listing.status === 'sold' && (
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 rounded uppercase">
                    PAID / SOLD
                  </span>
                )}
              </div>
              <p className="text-[10px] font-black text-amber-600">₦{Number(listing.price).toLocaleString()}</p>
            </div>
          </div>
          <span className="text-[10px] text-gray-500 font-semibold shrink-0">Details →</span>
        </Link>

        {/* Proximity & Campus Area Banner */}
        <div className="px-4 pt-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-2.5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin size={11} className="text-amber-500" />
                <span>Seller: <strong className="text-gray-900">{sellerArea}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <span>Buyer: <strong className="text-gray-900">{buyerArea}</strong></span>
              </div>
            </div>
            <div className="pt-1 border-t border-gray-100 flex items-center justify-between text-[10px] text-emerald-700 font-medium">
              <span>Recommended Meetup: <strong>SUB Building or University Library</strong></span>
              <span className="text-[9px] bg-emerald-50 px-1.5 py-0.2 rounded font-bold">Safe Zone</span>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="px-4 py-3 space-y-2.5">
          {messages.map((m) => {
            const isMe = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-amber-500 text-white rounded-br-xs'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-xs'
                  }`}
                >
                  {m.offer_amount && (
                    <div className={`mb-1.5 p-2 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                      isMe ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}>
                      <Tag size={13} />
                      <span>Formal Offer: ₦{Number(m.offer_amount).toLocaleString()}</span>
                    </div>
                  )}
                  <p>{m.content}</p>
                </div>
                <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0 z-40">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Type message, negotiate, or propose time..."
            className="flex-1 bg-gray-100 focus:bg-white text-xs border border-transparent focus:border-amber-400 rounded-xl py-2.5 px-3.5 outline-none transition"
          />
          <button
            type="submit"
            disabled={!inputContent.trim()}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white p-2.5 rounded-xl transition"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-extrabold text-sm text-gray-900">Propose a Price Offer</h3>
              <button onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">
              Listing price: <strong className="text-gray-900">₦{Number(listing.price).toLocaleString()}</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Your Proposed Price (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 18000"
                  value={offerInput}
                  onChange={(e) => setOfferInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-black text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage(undefined, `I would like to offer ₦${Number(offerInput).toLocaleString()} for this item. Can we meet at SUB?`, Number(offerInput))}
                  disabled={!offerInput}
                  className="py-2.5 rounded-xl bg-amber-500 text-white text-xs font-black shadow-sm"
                >
                  Submit Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay Seller with Campus Wallet Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <Wallet size={16} className="text-amber-600" />
                <h3 className="font-black text-sm text-gray-900">Pay Seller from Wallet</h3>
              </div>
              <button onClick={() => setShowPayModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-[11px] text-gray-500 mb-3">
              Safely transfer funds to <strong>{listing.seller_name}</strong> for <em>"{listing.title}"</em>.
            </p>

            <form onSubmit={handlePayFromWallet} className="space-y-3.5 text-xs">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[11px]">Your Wallet Balance:</span>
                  <strong className="text-amber-900 font-black">₦{Number(user?.wallet_balance || 0).toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[11px]">Item Price:</span>
                  <strong className="text-gray-900 font-black">₦{Number(listing.price).toLocaleString()}</strong>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Payment Amount (₦)</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={payAmountInput}
                  onChange={(e) => setPayAmountInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-black text-gray-900 text-sm outline-none focus:border-amber-400"
                />
              </div>

              {(user?.wallet_balance || 0) < Number(payAmountInput || 0) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-[11px] text-red-700 flex items-start gap-1.5">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Insufficient Balance</p>
                    <p>Need ₦{(Number(payAmountInput) - (user?.wallet_balance || 0)).toLocaleString()} more.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                {(user?.wallet_balance || 0) < Number(payAmountInput || 0) ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPayModal(false)}
                      className="py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowPayModal(false); setShowFundModal(true); }}
                      className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-sm transition"
                    >
                      + Fund Wallet
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPayModal(false)}
                      className="py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={paying}
                      className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition"
                    >
                      {paying ? 'Transferring...' : `Confirm & Pay ₦${Number(payAmountInput || 0).toLocaleString()}`}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fund Wallet Modal */}
      <FundWalletModal
        isOpen={showFundModal}
        onClose={() => setShowFundModal(false)}
      />
    </div>
  );
};
