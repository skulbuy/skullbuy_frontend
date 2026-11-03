import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Users, Filter, Plus, ArrowLeft, 
  Search, Check, Sparkles, ExternalLink, Share2, Tag, 
  ChevronRight, Compass, Clock, Award
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Meetup } from '../types';

const CATEGORIES = [
  'All',
  'Tech & Coding',
  'Entrepreneurship',
  'Study Groups',
  'Thrift Fairs',
  'Creative & Media',
  'Sports & Gaming',
  'Campus Socials'
];

const RADIUS_OPTIONS = [
  { label: 'On my campus', value: 'campus' },
  { label: 'Within 5 km', value: '5' },
  { label: 'Within 10 km', value: '10' },
  { label: 'Within 25 km', value: '25' },
  { label: 'Across Nigeria', value: 'all' }
];

export const MeetupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();

  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [radius, setRadius] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccessMsg, setRsvpSuccessMsg] = useState('');

  // Fetch Meetups
  const fetchMeetups = async () => {
    setLoading(true);
    try {
      let url = '/api/meetups?';
      if (category !== 'All') url += `category=${encodeURIComponent(category)}&`;
      if (user?.campus) url += `university=${encodeURIComponent(user.campus)}&`;

      const res = await authFetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMeetups(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetups();
  }, [category, user?.campus]);

  // RSVP toggle
  const handleToggleRsvp = async (meetup: Meetup) => {
    if (!user) {
      navigate('/onboarding');
      return;
    }

    setRsvpLoading(true);
    setRsvpSuccessMsg('');

    try {
      const endpoint = meetup.has_rsvped 
        ? `/api/meetups/${meetup.id}/unrsvp` 
        : `/api/meetups/${meetup.id}/rsvp`;
      
      const res = await authFetch(endpoint, { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setRsvpSuccessMsg(meetup.has_rsvped ? 'RSVP removed.' : 'You are RSVPed! See you on campus 🎉');
        // Update local list
        setMeetups(prev => prev.map(m => {
          if (m.id === meetup.id) {
            return {
              ...m,
              has_rsvped: !m.has_rsvped,
              attendees_count: meetup.has_rsvped ? Math.max(0, m.attendees_count - 1) : m.attendees_count + 1
            };
          }
          return m;
        }));
        if (selectedMeetup?.id === meetup.id) {
          setSelectedMeetup(prev => prev ? {
            ...prev,
            has_rsvped: !prev.has_rsvped,
            attendees_count: meetup.has_rsvped ? Math.max(0, prev.attendees_count - 1) : prev.attendees_count + 1
          } : null);
        }
      }
    } catch {
      // Error
    } finally {
      setRsvpLoading(false);
    }
  };

  // Filtered lists
  const filteredMeetups = meetups.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                          m.description.toLowerCase().includes(search.toLowerCase()) ||
                          m.venue_name.toLowerCase().includes(search.toLowerCase()) ||
                          m.university_code.toLowerCase().includes(search.toLowerCase());
    
    if (radius === 'campus') {
      const userCamp = user?.campus || 'FUTMX';
      return matchesSearch && m.university_code.toLowerCase() === userCamp.toLowerCase();
    }
    return matchesSearch;
  });

  const popularMeetups = filteredMeetups.filter(m => m.attendees_count >= 15);
  const suggestedMeetups = filteredMeetups.filter(m => m.attendees_count < 15);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)} 
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-black text-base text-gray-900 flex items-center gap-1.5">
                <span>Campus Meetups</span>
                <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Coming Soon
                </span>
              </h1>
              <p className="text-[11px] text-gray-500">
                Network, trade, learn, and collaborate in safe student spaces
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search meetups, workshops, hackathons, fairs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:bg-white focus:border-amber-500 outline-none transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition ${
                category === cat 
                  ? 'bg-amber-500 text-gray-950 shadow-xs' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Distance Radius Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Compass size={11} /> Distance:
          </span>
          {RADIUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setRadius(opt.value)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap transition ${
                radius === opt.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 text-slate-950 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-black/80 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              Hostel & Campus Spaces
            </span>
            <h2 className="text-lg font-black mt-1 leading-tight text-white">
              Official Safe Meetup & Trade Hubs
            </h2>
            <p className="text-xs text-amber-100 mt-1 max-w-xs leading-relaxed">
              Always meetup in designated high-traffic daylight areas: School Library Foyer, Student Union (SUB), or Science Complex.
            </p>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">Preview Mode</span>
          </div>
          <h3 className="font-extrabold text-sm mt-1.5">Campus Meetups & Event Discovery Coming Soon</h3>
          <p className="text-xs text-amber-100 mt-0.5 leading-relaxed">
            Trade fairs, physical swap meets, and campus student events are launching soon. Meetup RSVPs and ambassador organizer tools will be enabled in an upcoming release!
          </p>
        </div>

        {/* Section 1: Popular Across Nigerian Campuses */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" />
              <h2 className="font-black text-sm text-gray-900">Popular Across Nigerian Campuses</h2>
            </div>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              High Attendance
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(n => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse h-32" />
              ))}
            </div>
          ) : popularMeetups.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No popular meetups matching current filters.</p>
          ) : (
            <div className="space-y-3">
              {popularMeetups.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 hover:border-amber-400 rounded-2xl p-4 shadow-xs transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                          {item.university_code}
                        </span>
                      </div>
                      <h3 className="font-black text-sm text-gray-900 leading-snug">{item.title}</h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <Users size={12} />
                        <span>{item.attendees_count} Going</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-gray-700 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-amber-600 shrink-0" />
                      <span className="font-semibold">{item.meetup_date} • {item.meetup_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-amber-600 shrink-0" />
                      <span className="truncate">{item.venue_name} ({item.state})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-gray-400">Organised by verified campus group</span>
                    <button
                      type="button"
                      disabled={rsvpLoading}
                      onClick={() => handleToggleRsvp(item)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        item.has_rsvped
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-amber-500 hover:bg-amber-600 text-gray-950 font-black shadow-xs'
                      }`}
                    >
                      {item.has_rsvped ? <Check size={14} /> : null}
                      <span>{item.has_rsvped ? 'RSVP Confirmed' : 'RSVP Free'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Suggested Meetups for You */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Compass size={16} className="text-orange-500" />
              <h2 className="font-black text-sm text-gray-900">Suggested Meetups for You</h2>
            </div>
            <span className="text-[10px] text-gray-500">Based on your campus</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {suggestedMeetups.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {item.category} • {item.university_code}
                    </span>
                    <h4 className="font-bold text-xs text-gray-900 mt-1">{item.title}</h4>
                  </div>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Users size={11} />
                    {item.attendees_count}
                  </span>
                </div>

                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <p>📍 {item.venue_name}</p>
                  <p>🕒 {item.meetup_date} at {item.meetup_time}</p>
                </div>

                <button
                  type="button"
                  disabled={rsvpLoading}
                  onClick={() => handleToggleRsvp(item)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                    item.has_rsvped
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {item.has_rsvped ? <Check size={13} /> : null}
                  <span>{item.has_rsvped ? 'Going' : 'RSVP to Attend'}</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
