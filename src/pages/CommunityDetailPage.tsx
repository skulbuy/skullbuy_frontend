import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, Users, ShieldCheck, Pin, 
  Flag, MoreVertical, Sparkles, Tag, ChevronRight, CheckCircle2, X, AlertCircle
} from 'lucide-react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { Community, CommunityMessage, CommunityPromotion } from '../types';

export const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();

  const [community, setCommunity] = useState<Community | null>(null);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [pinnedMessages, setPinnedMessages] = useState<CommunityMessage[]>([]);
  const [promotions, setPromotions] = useState<CommunityPromotion[]>([]);
  const [dismissedPromos, setDismissedPromos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Language');
  const [reportSuccess, setReportSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchCommunityDetails = async () => {
    try {
      const res = await authFetch(`/api/communities/${id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setCommunity(data.community);
      setPinnedMessages(data.pinnedMessages || []);
      setPromotions(data.promotions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await authFetch(`/api/communities/${id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCommunityDetails(), fetchMessages()]);
  }, [id, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || sending) return;

    if (!user) {
      navigate('/profile');
      return;
    }

    const content = textInput.trim();
    setTextInput('');
    setSending(true);

    try {
      const res = await authFetch(`/api/communities/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [...prev, newMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user || !community) return;
    try {
      await authFetch(`/api/communities/${community.id}/leave`, { method: 'POST' });
      navigate('/communities');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !community) return;
    try {
      await authFetch(`/api/communities/${community.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason }),
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !community) {
    return (
      <div className="pb-20 min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <div className="p-4 space-y-3">
          <div className="h-16 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-8 text-center my-auto">
          <AlertCircle size={36} className="text-amber-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-gray-900">Community Not Found</h2>
          <p className="text-xs text-gray-500 mt-1">This group may have been removed or relocated.</p>
          <button
            onClick={() => navigate('/communities')}
            className="mt-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Back to Communities
          </button>
        </div>
      </div>
    );
  }

  const activePromotions = promotions.filter(p => !dismissedPromos.includes(p.id));

  return (
    <div className="min-h-screen bg-[#efeae2] flex flex-col relative pb-20">
      {/* WhatsApp-Style Community Header */}
      <div className="bg-[#005c4b] text-white px-3 py-2.5 sticky top-0 z-40 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-white/10 rounded-full transition text-white/90"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <img
            src={community.image_url}
            alt={community.name}
            className="w-10 h-10 rounded-full object-cover bg-white/20 shrink-0 border border-white/30"
          />

          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-1">
              <h2 className="font-bold text-sm text-white truncate max-w-[190px]">
                {community.name}
              </h2>
              {community.is_official && (
                <ShieldCheck size={13} className="text-emerald-300 shrink-0" />
              )}
            </div>
            <p className="text-[10px] text-emerald-200 truncate font-medium">
              {(community.live_member_count || community.member_count || 1).toLocaleString()} members • {community.university}
            </p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-white/10 rounded-full transition text-white/90"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 p-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2">
              <button
                onClick={() => { setShowReportModal(true); setShowMenu(false); }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-bold flex items-center gap-2"
              >
                <Flag size={13} />
                <span>Report Community</span>
              </button>
              <button
                onClick={handleLeaveCommunity}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 font-bold text-gray-700 flex items-center gap-2"
              >
                <span>Leave Group</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pinned Announcement Banner */}
      {pinnedMessages.length > 0 && (
        <div className="bg-amber-100/90 border-b border-amber-300/80 px-4 py-2 flex items-start gap-2 shadow-2xs">
          <Pin size={14} className="text-amber-700 mt-0.5 shrink-0 fill-amber-700" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">Pinned Campus Notice:</span>
            <p className="text-[11px] text-amber-950 font-medium line-clamp-2 mt-0.5 leading-snug">
              {pinnedMessages[0].content}
            </p>
          </div>
        </div>
      )}

      {/* Featured Community Marketplace Products (Section 5) */}
      {activePromotions.length > 0 && (
        <div className="bg-white/90 backdrop-blur-xs border-b border-amber-200/80 p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
              <Sparkles size={14} className="text-amber-500 fill-amber-500" />
              <span>Campus Verified Deals & Featured Products</span>
            </div>
            <span className="text-[9px] uppercase font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              Sponsored
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {activePromotions.map((promo) => (
              <div
                key={promo.id}
                onClick={() => navigate(`/listing/${promo.listing_id}`)}
                className="w-48 bg-white rounded-2xl p-2.5 border border-amber-200 shadow-2xs shrink-0 cursor-pointer hover:border-amber-400 transition relative"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDismissedPromos(prev => [...prev, promo.id]);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/40 hover:bg-black/70 text-white rounded-full z-10"
                  title="Dismiss promotion"
                >
                  <X size={10} />
                </button>

                <img
                  src={promo.listing_image}
                  alt={promo.listing_title}
                  className="w-full h-24 rounded-xl object-cover bg-gray-100"
                />

                <div className="mt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {promo.badge}
                    </span>
                    <span className="text-[10px] font-black text-amber-600">
                      ₦{Number(promo.listing_price).toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-[11px] font-bold text-gray-900 truncate mt-1">
                    {promo.listing_title}
                  </h4>

                  <p className="text-[10px] text-gray-400 truncate">
                    Seller: {promo.seller_name} ({promo.seller_university || 'FUTMINNA'})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        <div className="text-center my-2">
          <span className="bg-amber-100/90 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-2xs border border-amber-200/60 inline-block">
            🔒 Messages in this campus group are moderated for student safety.
          </span>
        </div>

        {messages.map((msg, idx) => {
          const isMe = user && msg.user_id === user.id;

          // Check if we should insert a sponsored card after every 4th message
          const showMidFeedPromo = idx > 0 && idx % 3 === 0 && activePromotions.length > 0;
          const promoToDisplay = activePromotions[idx % activePromotions.length];

          return (
            <React.Fragment key={msg.id}>
              {showMidFeedPromo && (
                <div
                  onClick={() => navigate(`/listing/${promoToDisplay.listing_id}`)}
                  className="max-w-xs mx-auto my-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:border-amber-300"
                >
                  <img
                    src={promoToDisplay.listing_image}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[8px] font-black uppercase text-amber-800 bg-amber-200/60 px-1.5 py-0.2 rounded">
                      Featured Marketplace Offer
                    </span>
                    <p className="text-[11px] font-bold text-gray-900 truncate">{promoToDisplay.listing_title}</p>
                    <p className="text-xs font-black text-amber-600">₦{Number(promoToDisplay.listing_price).toLocaleString()}</p>
                  </div>
                  <ChevronRight size={16} className="text-amber-500 shrink-0" />
                </div>
              )}

              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-sm rounded-2xl px-3.5 py-2 text-xs shadow-2xs relative ${
                    isMe
                      ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none'
                      : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                  }`}
                >
                  {!isMe && (
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="font-black text-[11px] text-teal-800 truncate">
                        {msg.sender_name}
                      </span>
                      {msg.sender_verified === 'verified' && (
                        <span title="Verified Student">
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                        </span>
                      )}
                      {msg.sender_role === 'admin' && (
                        <span className="text-[8px] font-black uppercase bg-red-100 text-red-700 px-1 rounded">
                          Staff Admin
                        </span>
                      )}
                    </div>
                  )}

                  <p className="whitespace-pre-line leading-relaxed text-[12px]">{msg.content}</p>

                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-gray-400">
                    <span>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <span className="text-emerald-700 font-bold">✓✓</span>}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar (Fixed Bottom) */}
      <form
        onSubmit={handleSendMessage}
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gray-100 border-t border-gray-300/80 p-2.5 flex items-center gap-2 z-40"
      >
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={user ? "Type a community message..." : "Sign in to post a message"}
          disabled={!user || sending}
          className="flex-1 bg-white border border-gray-200 focus:border-emerald-500 rounded-full py-2.5 px-4 text-xs outline-none font-medium placeholder-gray-400 shadow-2xs"
        />

        <button
          type="submit"
          disabled={!textInput.trim() || sending || !user}
          className="w-10 h-10 rounded-full bg-[#005c4b] hover:bg-[#004739] active:scale-95 disabled:opacity-40 text-white flex items-center justify-center shadow-sm shrink-0 transition"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100">
            {reportSuccess ? (
              <div className="text-center py-4">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-gray-900">Report Submitted</h3>
                <p className="text-xs text-gray-500 mt-1">Campus safety moderators have been notified.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <h3 className="font-bold text-sm text-gray-900">Report Inappropriate Message</h3>
                <p className="text-xs text-gray-500">
                  Help maintain a clean, trustworthy campus community for all students.
                </p>

                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs outline-none"
                >
                  <option>Inappropriate Language</option>
                  <option>Suspected Fraud or Scam</option>
                  <option>Spam or Unrelated Promotion</option>
                  <option>Harassment or Defamation</option>
                </select>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 rounded-xl bg-red-500 text-white text-xs font-bold"
                  >
                    Submit Report
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
