import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Sparkles, ShoppingBag, 
  Calendar, ChevronRight, MessageSquare, ArrowUpRight,
  Maximize2, Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'skully';
  text: string;
  timestamp: string;
  listings?: any[];
  meetups?: any[];
  chips?: string[];
}

const DEFAULT_CHIPS = [
  '💻 Cheap laptops & gadgets',
  '📦 Items available for rent',
  '📅 Upcoming campus meetups',
  '🎁 How does SkulBox work?',
  '🛡️ Safe meetup spots'
];

export const SkullyChatbot: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'skully',
      text: `Hello ${user?.first_name || 'Scholar'}! 👋 I'm Skully, your official AI campus assistant.\n\nAsk me for live campus deals on laptops, textbooks, hostel appliances, or how our 4-digit Handover PIN Escrow keeps your trades safe!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chips: DEFAULT_CHIPS
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/skully/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          campus: user?.campus || user?.campus_name || 'FUTMX'
        })
      });

      const data = await res.json();
      const skullyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'skully',
        text: data.reply || 'Here is what I found on campus for you!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        listings: data.recommendations?.listings || [],
        meetups: data.recommendations?.meetups || [],
        chips: data.suggestedChips || DEFAULT_CHIPS.slice(0, 3)
      };

      setMessages(prev => [...prev, skullyMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'skully',
          text: 'Oops, network hiccup on campus WiFi! Feel free to explore our homepage categories or search bar directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: DEFAULT_CHIPS
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Mascot Launcher */}
      <div className="fixed bottom-20 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 p-3 rounded-full shadow-2xl border-2 border-amber-300 flex items-center justify-center group"
          title="Chat with Skully AI"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-inner">
            <img
              src="/skulbuy-logo.png"
              alt="Skully"
              className="w-7 h-7 object-contain"
              onError={(e) => {
                // fallback icon
                e.currentTarget.style.display = 'none';
              }}
            />
            <Sparkles size={18} className="text-orange-500 group-hover:rotate-12 transition-transform" />
          </div>

          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-slate-900"></span>
          </span>

          {/* Tooltip hint on hover / first view */}
          {!isOpen && (
            <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 bg-slate-900/95 text-amber-300 text-[11px] font-bold py-1 px-2.5 rounded-xl border border-amber-500/30 whitespace-nowrap shadow-xl pointer-events-none hidden sm:block">
              Ask Skully AI 🎓
            </div>
          )}
        </motion.button>
      </div>

      {/* Skully Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            className="fixed bottom-20 right-3 sm:right-6 w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3.5 text-slate-950 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white p-1 shadow flex items-center justify-center">
                  <img
                    src="/skulbuy-logo.png"
                    alt="Skully Mascot"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.src = '/assets/aistudio/1sk_7de89084.png'; }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-sm tracking-tight text-slate-950">Skully AI</h3>
                    <span className="bg-slate-900 text-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-900 font-semibold">
                    Campus Deals & Meetup Guide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-black/15 text-slate-950 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs no-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-md'
                        : 'bg-white/10 text-gray-100 border border-white/10 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-slate-900/70' : 'text-gray-400'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Recommended Listings Cards */}
                  {msg.listings && msg.listings.length > 0 && (
                    <div className="w-full mt-2 space-y-1.5">
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <ShoppingBag size={12} />
                        <span>Recommended Items on Campus:</span>
                      </p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {msg.listings.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              navigate(`/listing/${item.id}`);
                              setIsOpen(false);
                            }}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2 flex items-center justify-between cursor-pointer transition"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <img
                                src={item.images?.[0] || item.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                                alt={item.title}
                                className="w-10 h-10 rounded-lg object-cover shrink-0"
                              />
                              <div className="truncate">
                                <p className="font-bold text-white text-[11px] truncate">{item.title}</p>
                                <p className="text-[10px] text-amber-400 font-black">
                                  ₦{item.price?.toLocaleString()}
                                  {item.is_rental && <span className="text-gray-400 font-normal"> / {item.rental_period || 'day'}</span>}
                                </p>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-gray-400 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Meetups Cards */}
                  {msg.meetups && msg.meetups.length > 0 && (
                    <div className="w-full mt-2 space-y-1.5">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Student Meetups You Might Like:</span>
                      </p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {msg.meetups.map((mt) => (
                          <div
                            key={mt.id}
                            onClick={() => {
                              navigate(`/meetups`);
                              setIsOpen(false);
                            }}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2 flex items-center justify-between cursor-pointer transition"
                          >
                            <div className="overflow-hidden">
                              <p className="font-bold text-white text-[11px] truncate">{mt.title}</p>
                              <p className="text-[10px] text-gray-400 truncate">
                                📍 {mt.venue_name || mt.university_code} • {mt.meetup_date}
                              </p>
                            </div>
                            <span className="text-[10px] text-amber-400 font-bold shrink-0">RSVP</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prompt Chips */}
                  {msg.chips && msg.chips.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {msg.chips.map((chip, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(chip)}
                          className="bg-amber-500/10 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-[10px] py-1 px-2.5 rounded-full transition"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-gray-400 bg-white/5 p-2.5 rounded-2xl w-fit">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-gray-300 ml-1">Skully is checking campus listings...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-black/40 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Skully about items, prices, meetups..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/15 focus:border-amber-400 rounded-2xl py-2 px-3 text-xs text-white outline-none placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 p-2 rounded-xl transition font-bold"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
