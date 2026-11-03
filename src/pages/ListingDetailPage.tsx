import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Heart, ShieldCheck, MapPin, 
  MessageCircle, AlertTriangle, Check, Info, Clock, 
  ExternalLink, UserCheck, CheckCircle2, Flag, ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';
import { Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

export const ListingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  
  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Prohibited / Unsafe Item');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to load listing');
        }
        return res.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleStartChat = async () => {
    if (!user) {
      navigate(`/profile?redirect=/listing/${id}`);
      return;
    }
    if (!listing) return;

    if (listing.seller_id === user.id) {
      alert("This is your own listing! You can manage it from your Profile.");
      return;
    }

    try {
      const res = await authFetch('/api/chats/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          initial_message: `Hi ${(listing.seller_name || 'there').split(' ')[0]}, I'm interested in your "${listing.title}" on SkulBuy!`
        })
      });
      const chat = await res.json();
      if (res.ok && chat.id) {
        navigate(`/messages/${chat.id}`);
      } else {
        alert(chat.detail || chat.error || 'Could not start chat');
      }
    } catch {
      alert('Network error starting conversation');
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      navigate(`/profile?redirect=/listing/${id}`);
      return;
    }
    try {
      const res = await authFetch(`/api/saved/${id}`, { method: 'POST' });
      const data = await res.json();
      setIsSaved(data.saved);
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this ${listing?.title} for ₦${listing?.price?.toLocaleString()} on SkulBuy FUTMX: ${shareUrl}`;
    
    // Attempt WhatsApp link or clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/profile');
      return;
    }
    setReportSubmitting(true);
    try {
      const res = await authFetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: Number(id),
          reason: reportReason,
          details: reportDetails
        })
      });
      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setShowReportModal(false);
          setReportSuccess(false);
        }, 2000);
      }
    } catch {
      alert('Error submitting report');
    } finally {
      setReportSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-4 space-y-4">
          <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />
          <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-8 text-center my-auto">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-gray-900">Listing Unavailable</h2>
          <p className="text-xs text-gray-500 mt-1">{error || 'This listing may have been sold or removed by the seller.'}</p>
          <button
            onClick={() => navigate('/categories')}
            className="mt-4 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const isUnavailable = listing.status !== 'active';

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [inAppToast, setInAppToast] = useState('');

  const displayImages = (listing?.images && listing.images.length > 0) 
    ? listing.images 
    : [listing?.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'];

  const isOwner = user && listing && user.id === listing.seller_id;

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />

      {/* Top back bar */}
      <div className="bg-white border-b border-gray-100 sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            {isOwner && (
              <Link
                to={`/sell?edit=${listing.id}`}
                className="text-xs font-black text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition"
              >
                Edit Listing / Photos
              </Link>
            )}

            <button
              onClick={handleShare}
              className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 relative transition"
              title="Share via WhatsApp or copy link"
            >
              <Share2 size={16} />
              {copiedShare && (
                <span className="absolute -bottom-7 right-0 bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>

            <button
              onClick={handleToggleSave}
              className={`p-2 rounded-full transition ${isSaved ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600'}`}
              title="Save to favorites"
            >
              <Heart size={16} className={isSaved ? 'fill-red-500' : ''} />
            </button>
          </div>
        </div>
      </div>

      {inAppToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <div className="bg-amber-500 text-slate-950 font-bold text-xs p-3 rounded-2xl shadow-sm text-center">
            {inAppToast}
          </div>
        </div>
      )}

      {/* Responsive Main Layout (2-Column on Desktop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Photos & Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Image Gallery with Multi-Photo Switcher */}
            <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-sm">
              <div className="h-72 sm:h-96 w-full relative">
                <img
                  src={displayImages[activeImgIndex] || displayImages[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'; }}
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {listing.category_name}
                  </span>
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {listing.condition}
                  </span>
                  {listing.is_rental ? (
                    <span className="bg-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      FOR RENT
                    </span>
                  ) : null}
                </div>

                {isUnavailable && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg">
                      {listing.status === 'sold' ? 'Sold Out' : 'Listing Withdrawn'}
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Selector if multi-image */}
              {displayImages.length > 1 && (
                <div className="bg-slate-950/90 p-3 flex gap-2 overflow-x-auto justify-center">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImgIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                        activeImgIndex === idx ? 'border-amber-400 scale-105 shadow' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Item Description</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Safe Meetup Protocol Card (POL-01, Section 7.3) */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950">
                  <p className="font-bold text-sm">Campus Safe Meetup Rules:</p>
                  <ul className="list-disc list-inside space-y-1 mt-1.5 text-amber-900 text-xs">
                    <li>Always meet during daylight hours at public spots (e.g. SUB, Library, Gate).</li>
                    <li>Inspect item thoroughly before exchanging cash or making transfer.</li>
                    <li>Never send an advance "booking fee" or transport deposit.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Report Listing Trigger */}
            <div className="text-center pt-1">
              <button
                onClick={() => setShowReportModal(true)}
                className="text-xs font-semibold text-gray-400 hover:text-red-500 inline-flex items-center gap-1.5 transition"
              >
                <Flag size={13} />
                <span>Report this listing for safety or guideline violations</span>
              </button>
            </div>
          </div>

          {/* Right Column: Title, Price, Seller, & Actions */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
            {/* Title & Price Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">
                      ₦{Number(listing.price).toLocaleString()}
                    </span>
                    {listing.is_rental && (
                      <span className="text-sm font-bold text-purple-600">
                        / {listing.rental_period || 'per day'}
                      </span>
                    )}
                  </div>
                  {listing.is_rental ? (
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md inline-block mt-1">
                      Campus Rental • Refundable ID Deposit
                    </span>
                  ) : listing.is_negotiable ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block mt-1">
                      Price Negotiable
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md inline-block mt-1">
                      Fixed Price
                    </span>
                  )}
                </div>

                <div className="text-right text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={13} />
                  <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <h1 className="text-lg font-bold text-gray-900 leading-snug">
                {listing.title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-gray-600 pt-3 border-t border-gray-50">
                <MapPin size={15} className="text-amber-500 shrink-0" />
                <span className="font-medium">{listing.campus_location} (FUTMX)</span>
              </div>

              {/* Desktop CTA Buttons */}
              <div className="hidden md:flex flex-col gap-2.5 pt-3">
                <button
                  onClick={() => navigate(`/checkout/${listing.id}`)}
                  disabled={isUnavailable}
                  className={`w-full py-3.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition ${
                    isUnavailable
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <ShoppingBag size={16} />
                  <span>Instant Campus Checkout</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleStartChat}
                    disabled={isUnavailable}
                    className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 border transition ${
                      isUnavailable
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                    }`}
                  >
                    <MessageCircle size={16} />
                    <span>Chat / Make Offer</span>
                  </button>

                  <button
                    onClick={handleToggleSave}
                    className={`p-3 rounded-2xl border transition ${isSaved ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    title="Save to favorites"
                  >
                    <Heart size={18} className={isSaved ? 'fill-red-500' : ''} />
                  </button>
                </div>
              </div>
            </div>

            {/* Seller Info Card with Campus Proximity */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs space-y-3.5">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seller & Campus Location</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-base">
                    {listing.seller_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-gray-900">{listing.seller_name}</p>
                      {listing.seller_verified === 'verified' && (
                        <span title="Verified FUTMX Student">
                          <ShieldCheck size={16} className="text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {listing.seller_department || 'FUT Minna Student'}
                    </p>
                    {listing.seller_verified === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                        <CheckCircle2 size={11} /> Verified Student ID
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">ID Verification Pending</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Area & Proximity Badge */}
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                  <MapPin size={14} className="text-amber-500 shrink-0" />
                  <span>Seller Area: {listing.seller_area || listing.campus_location || 'Gidan Kwano Campus'}</span>
                </div>
                {user?.campus_area && (
                  <p className="text-[11px] text-gray-500">
                    {listing.seller_area && user.campus_area && (listing.seller_area.split('-')[0] === user.campus_area.split('-')[0]) ? (
                      <span className="text-emerald-700 font-bold">🟢 High Proximity: You are both located around {user.campus_area.split('-')[0].trim()}!</span>
                    ) : (
                      <span>Your Area: {user.campus_area}</span>
                    )}
                  </p>
                )}
                <p className="text-[11px] text-gray-400">
                  Suggested Meetup: SUB Building Quad, Campus Library, or School Park Gate.
                </p>
              </div>
            </div>

            {/* Safe Campus Wallet Payment Reassurance */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/80 rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-600 shrink-0" />
                <h4 className="text-xs font-black text-amber-950">In-Chat Campus Wallet Protection</h4>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Message the seller first to inspect the item. Once satisfied in person, pay directly from your <strong>Campus Wallet</strong> inside the chat for instant, safe receipt!
              </p>
              {user && (
                <div className="pt-2 flex items-center justify-between text-xs border-t border-amber-200/60 text-amber-950 font-bold">
                  <span>Your Wallet Balance: ₦{Number(user.wallet_balance || 0).toLocaleString()}</span>
                  <Link to="/profile" className="text-amber-700 underline text-xs">
                    Manage Wallet
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (Hidden on desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 z-40 flex items-center gap-3">
        <button
          onClick={handleToggleSave}
          className={`p-3 rounded-xl border transition ${isSaved ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-600'}`}
        >
          <Heart size={18} className={isSaved ? 'fill-red-500' : ''} />
        </button>

        <button
          onClick={handleStartChat}
          disabled={isUnavailable}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition ${
            isUnavailable
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95'
          }`}
        >
          <MessageCircle size={16} />
          <span>{isUnavailable ? 'Listing Unavailable' : 'Message Seller / Make Offer'}</span>
        </button>

        <button
          onClick={() => navigate(`/checkout/${listing.id}`)}
          disabled={isUnavailable}
          className="p-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center"
          title="Campus Checkout"
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100">
            {reportSuccess ? (
              <div className="text-center py-4">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-gray-900">Report Submitted</h3>
                <p className="text-xs text-gray-500 mt-1">Campus safety moderators have been notified.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Report Listing</h3>
                <p className="text-[11px] text-gray-500 mb-3">Help keep the FUTMX student marketplace safe.</p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Reason</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none font-medium"
                    >
                      <option>Prohibited / Unsafe Item</option>
                      <option>Suspected Fraud or Scam</option>
                      <option>Wrong Category or Fake Specs</option>
                      <option>Already Sold or Inactive</option>
                      <option>Harassment / Inappropriate Content</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Details (Optional)</label>
                    <textarea
                      rows={3}
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Explain what seems suspicious..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition"
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
