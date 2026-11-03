import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MessageCircle, Clock, ChevronRight, ShieldCheck, 
  Users, Search, Plus, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { Chat, Community } from '../types';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

export const MessagesPage = () => {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'private' | 'communities'>('private');
  const [chats, setChats] = useState<Chat[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        authFetch('/api/chats').then(res => res.json()).catch(() => []),
        authFetch('/api/communities').then(res => res.json()).catch(() => [])
      ]).then(([chatData, commData]) => {
        setChats(Array.isArray(chatData) ? chatData : []);
        setCommunities(Array.isArray(commData) ? commData : []);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-6 text-center my-auto max-w-sm mx-auto">
          <MessageCircle size={36} className="text-gray-300 mx-auto mb-2" />
          <h2 className="text-base font-extrabold text-gray-900">Sign in to View Messages</h2>
          <p className="text-xs text-gray-500 mt-1">Keep track of buyer enquiries and campus communities.</p>
          <Link
            to="/profile"
            className="mt-4 inline-block bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm"
          >
            Sign In / Switch Persona
          </Link>
        </div>
      </div>
    );
  }

  const filteredChats = chats.filter(c =>
    (c.buyer_id === user.id ? c.seller_name : c.buyer_name).toLowerCase().includes(search.toLowerCase()) ||
    c.listing_title?.toLowerCase().includes(search.toLowerCase()) ||
    c.last_message?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />

      {/* Top Header & Search */}
      <div className="px-4 pt-3 pb-2 bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-base font-extrabold text-gray-900">Chats & Messages</h1>
            <p className="text-[11px] text-gray-400">Direct trade negotiations and student communities.</p>
          </div>
          <Link
            to="/communities"
            className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1 transition"
          >
            <Plus size={12} />
            <span>Discover</span>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations or groups..."
            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 rounded-xl py-2 pl-8 pr-3 text-xs outline-none font-medium"
          />
        </div>

        {/* Two Tabs: Private Chats vs Communities */}
        <div className="flex border-b border-gray-100 text-xs font-bold -mx-4 px-4">
          <button
            onClick={() => setActiveTab('private')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'private'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <MessageCircle size={14} />
            <span>Private Chats ({chats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('communities')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'communities'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Users size={14} />
            <span>Campus Communities ({communities.filter(c => c.is_member).length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pt-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : activeTab === 'private' ? (
          /* Tab 1: Private Chats */
          <div className="space-y-3">
            {filteredChats.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-2xs">
              <MessageCircle size={36} className="text-amber-500/40 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-gray-900">No Active Private Chats</h3>
              <p className="text-xs text-gray-500 mt-1">
                When you message a seller on any listing or receive a student enquiry, it will show up here.
              </p>
              <Link to="/categories" className="mt-4 inline-block bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl">
                Explore Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredChats.map((c) => {
                const otherPartyName = c.buyer_id === user.id ? c.seller_name : c.buyer_name;
                return (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/messages/${c.id}`)}
                    className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs flex items-center justify-between cursor-pointer hover:border-amber-300 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={c.listing_image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-xs text-gray-900 truncate">{otherPartyName}</p>
                          <span className="text-[9px] text-gray-400 shrink-0">
                            {new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-amber-600 truncate">{c.listing_title}</p>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{c.last_message || 'No messages yet'}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>
          )}
          </div>
        ) : (
          /* Tab 2: Communities */
          <div className="space-y-2.5">
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-emerald-950">Campus Student Communities</p>
                <p className="text-[10px] text-emerald-800">WhatsApp-style verified groups for your university.</p>
              </div>
              <Link
                to="/communities"
                className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg"
              >
                Browse All
              </Link>
            </div>

            {filteredCommunities.map((comm) => (
              <div
                key={comm.id}
                onClick={() => navigate(`/communities/${comm.id}`)}
                className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={comm.image_url}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 min-w-0">
                        <p className="font-bold text-xs text-gray-900 truncate">{comm.name}</p>
                        {comm.is_official && (
                          <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400 shrink-0">
                        {(comm.live_member_count || comm.member_count || 1).toLocaleString()} members
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {comm.latest_message || comm.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {comm.category}
                      </span>
                      {comm.is_member && (
                        <span className="text-[9px] text-gray-400 font-semibold">Joined ✓</span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
