import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, MessageCircle, Plus, Search, ShieldCheck, 
  Sparkles, CheckCircle2, ChevronRight, School, ArrowRight, Lock, Bell
} from 'lucide-react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { Community } from '../types';

export const CommunitiesPage: React.FC = () => {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [joiningId, setJoiningId] = useState<number | null>(null);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const url = user 
        ? `/api/communities?category=${selectedCategory}`
        : `/api/communities?category=${selectedCategory}`;
      const res = await authFetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCommunities(data);
      }
    } catch (err) {
      console.error('Error loading communities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [selectedCategory, user]);

  const handleToggleJoin = async (e: React.MouseEvent, comm: Community) => {
    e.stopPropagation();
    if (!user) {
      navigate('/profile');
      return;
    }

    setJoiningId(comm.id);
    try {
      const endpoint = comm.is_member 
        ? `/api/communities/${comm.id}/leave` 
        : `/api/communities/${comm.id}/join`;
      await authFetch(endpoint, { method: 'POST' });
      await fetchCommunities();
    } catch (err) {
      console.error(err);
    } finally {
      setJoiningId(null);
    }
  };

  const categories = [
    { id: 'all', label: 'All Groups' },
    { id: 'university', label: 'Universities' },
    { id: 'gadgets', label: 'Tech & Gadgets' },
    { id: 'hostel', label: 'Hostels & Roommates' },
    { id: 'business', label: 'Student Businesses' },
    { id: 'deals', label: 'Thrift & Fashion' },
  ];

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase()) ||
    c.university?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 text-emerald-100 px-2 py-0.5 rounded-full border border-white/10">
                WhatsApp-Style Groups
              </span>
            </div>
            <h1 className="text-lg font-black tracking-tight mt-1">SkulBuy Communities</h1>
            <p className="text-xs text-emerald-100 font-medium mt-0.5">
              Connect with students across Nigerian universities, share hostel alerts, and discover campus deals.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
            <MessageCircle size={26} className="text-emerald-200" />
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-3 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-200" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities by campus, hostel, or interest..."
            className="w-full bg-black/20 backdrop-blur-md border border-white/20 rounded-xl py-2 pl-8 pr-3 text-xs text-white placeholder-emerald-200 outline-none focus:border-white/50"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex bg-white border-b border-gray-100 px-3 py-2 gap-1.5 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`py-1.5 px-3 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Community List */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-2xs">
            <Users size={36} className="text-gray-300 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-gray-900">No Communities Found</h3>
            <p className="text-xs text-gray-500 mt-1">Try another category or search query.</p>
          </div>
        ) : (
          filteredCommunities.map((comm) => (
            <div
              key={comm.id}
              onClick={() => navigate(`/communities/${comm.id}`)}
              className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs hover:border-emerald-300 transition cursor-pointer flex flex-col justify-between gap-2.5"
            >
              <div className="flex items-start gap-3">
                <img
                  src={comm.image_url}
                  alt={comm.name}
                  className="w-13 h-13 rounded-2xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <h3 className="font-extrabold text-xs text-gray-900 truncate">
                        {comm.name}
                      </h3>
                      {comm.is_official && (
                        <span title="Verified Official Campus Community">
                          <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold shrink-0 flex items-center gap-1">
                      <Users size={11} />
                      {(comm.live_member_count || comm.member_count || 1).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 font-medium">
                    {comm.description}
                  </p>

                  {comm.latest_message && (
                    <div className="bg-gray-50 rounded-lg p-1.5 mt-1.5 text-[10px] text-gray-600 truncate border border-gray-100">
                      <span className="font-bold text-emerald-700">Latest: </span>
                      {comm.latest_message}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {comm.university === 'All' ? 'Nationwide Students' : `${comm.university} Campus`}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleToggleJoin(e, comm)}
                    disabled={joiningId === comm.id}
                    className={`px-3 py-1 rounded-xl font-black text-[11px] transition active:scale-95 ${
                      comm.is_member
                        ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {joiningId === comm.id
                      ? 'Updating...'
                      : comm.is_member
                      ? 'Member ✓'
                      : '+ Join Group'}
                  </button>

                  <button
                    onClick={() => navigate(`/communities/${comm.id}`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] px-3 py-1 rounded-xl shadow-2xs flex items-center gap-1"
                  >
                    <span>Open Chat</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
