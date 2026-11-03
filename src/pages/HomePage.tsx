import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, ArrowRight, Sparkles, TrendingUp, Package, 
  MapPin, Clock, Award, AlertTriangle, ExternalLink, HelpCircle, 
  ShoppingBag, CheckCircle2, ChevronRight, Lock, Wallet, Users, School, MessageCircle, Flame, Tag, Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { Listing, Category, SkulBoxCycle, Community } from '../types';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { HomeCarousel } from '../components/HomeCarousel';
import { DailyStreakCard } from '../components/DailyStreakCard';
import { FundWalletModal } from '../components/FundWalletModal';
import { UniversityModal } from '../components/UniversityModal';
import { SkulBuyLogo } from '../components/SkulBuyLogo';

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [campusListings, setCampusListings] = useState<Listing[]>([]);
  const [trendingListings, setTrendingListings] = useState<Listing[]>([]);
  const [rentalListings, setRentalListings] = useState<Listing[]>([]);
  const [meetupsList, setMeetupsList] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [activeCycle, setActiveCycle] = useState<SkulBoxCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showUniModal, setShowUniModal] = useState(false);

  const currentUniversity = user?.university || user?.campus || 'FUTMINNA';

  const loadHomepageData = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/listings?university=${currentUniversity}&scope=campus`).then(res => res.json()).catch(() => []),
      fetch(`/api/listings?scope=trending`).then(res => res.json()).catch(() => []),
      fetch(`/api/listings?is_rental=1`).then(res => res.json()).catch(() => []),
      fetch(`/api/meetups`).then(res => res.json()).catch(() => []),
      fetch(`/api/listings`).then(res => res.json()).catch(() => []),
      fetch('/api/categories').then(res => res.json()).catch(() => []),
      fetch('/api/communities').then(res => res.json()).catch(() => []),
      fetch('/api/skulbox/active-cycle').then(res => res.json()).catch(() => null)
    ]).then(([campusData, trendingData, rentalData, meetupsData, allListingsData, catsData, commsData, cycleData]) => {
      setCampusListings(Array.isArray(campusData) ? campusData : []);
      setTrendingListings(Array.isArray(trendingData) ? trendingData.slice(0, 6) : []);
      setRentalListings(Array.isArray(rentalData) ? rentalData : []);
      setMeetupsList(Array.isArray(meetupsData) ? meetupsData.slice(0, 4) : []);
      
      const all = Array.isArray(allListingsData) ? allListingsData : [];
      setRecentListings(all.slice(0, 6));
      setFeaturedListings(all.filter(l => l.is_boosted));
      setCategories(Array.isArray(catsData) ? catsData : []);
      setCommunities(Array.isArray(commsData) ? commsData.slice(0, 3) : []);
      setActiveCycle(cycleData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadHomepageData();
  }, [currentUniversity]);

  return (
    <div className="pb-28 min-h-screen bg-gray-50/60">
      <Header />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-20 space-y-7">
        {/* Personalised Student Greeting Banner */}
        <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 sm:p-5 text-slate-950 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-white p-0.5 shrink-0 overflow-hidden shadow-xs">
              <img
                src={user?.profile_picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt=""
                className="w-full h-full object-cover rounded-full"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-slate-900/80 uppercase tracking-wider">
                {user?.campus_name || user?.campus || currentUniversity} Student
              </p>
              <h2 className="text-base sm:text-lg font-black text-white truncate">
                {user?.first_name ? `Welcome back, ${user.first_name}!` : `Welcome to SkulBuy, Scholar! 🎓`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <Link
              to="/meetups"
              className="bg-black/20 hover:bg-black/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
            >
              <span>Meetups</span>
            </Link>
            <Link
              to="/sell"
              className="bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition"
            >
              + Sell / Rent
            </Link>
          </div>
        </section>

        {/* 1. Four-Slide New Products and Promotional Carousel */}
        <section>
          <HomeCarousel />
        </section>

        {/* 2. Daily Streak & ₦10 SkulCredits Reward Section */}
        <section>
          <DailyStreakCard onClaimSuccess={loadHomepageData} />
        </section>

        {/* Quick Campus Switcher Callout Banner */}
        <section className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <School size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Browsing Campus</p>
              <h4 className="text-xs font-black text-gray-900 truncate">
                {currentUniversity} Marketplace
              </h4>
            </div>
          </div>

          <button
            onClick={() => setShowUniModal(true)}
            className="text-[11px] font-black text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1.5 rounded-xl transition shrink-0 active:scale-95"
          >
            Change Campus
          </button>
        </section>

        {/* 3. Category Discovery Bar */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">
              Browse Categories
            </h2>
            <Link to="/categories" className="text-[11px] font-bold text-amber-600 hover:underline">
              All ({categories.length})
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/categories?category=${cat.slug}`)}
                className="px-3.5 py-2 rounded-xl bg-white border border-gray-200/80 hover:border-amber-400 text-xs font-bold text-gray-700 whitespace-nowrap shadow-2xs hover:bg-amber-50/40 transition flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Products Around Your Campus (Section 3: University Personalisation) */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-amber-500" />
                <h2 className="font-extrabold text-sm text-gray-900">
                  Products Around Your Campus
                </h2>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                Available right now from students at {currentUniversity}
              </p>
            </div>

            <Link
              to={`/categories?university=${currentUniversity}`}
              className="text-xs font-bold text-amber-600 hover:underline shrink-0"
            >
              See All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="bg-white rounded-2xl h-52 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : campusListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">No items currently listed around {currentUniversity}.</p>
              <Link to="/sell" className="inline-block mt-2 text-xs font-bold text-amber-600">
                Be the first to post an item (+25 pts) →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
              {campusListings.slice(0, 10).map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/listing/${item.id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-2xs hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 sm:h-44 md:h-48 bg-gray-100 relative overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        {item.university || currentUniversity}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                        {item.condition}
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h3 className="font-bold text-xs text-gray-900 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs font-black text-amber-600 mt-1">
                        ₦{Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 pt-0 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-500">
                    <span className="truncate max-w-[85px]">{item.campus_location.split(',')[0]}</span>
                    {item.seller_verified === 'verified' && (
                      <span className="inline-flex items-center text-emerald-600 gap-0.5 font-bold">
                        <ShieldCheck size={11} /> Verified
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Featured Products & Special Discounts (Horizontal Scroll) */}
        {featuredListings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={15} className="text-amber-500 fill-amber-500" />
                <h2 className="font-extrabold text-sm text-gray-900">
                  Featured Products & Deals
                </h2>
              </div>
              <Link to="/categories?sort=featured" className="text-xs font-bold text-amber-600 hover:underline">
                View Deals
              </Link>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
              {featuredListings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/listing/${item.id}`)}
                  className="min-w-[185px] max-w-[185px] bg-white rounded-2xl overflow-hidden border border-amber-200/70 shadow-2xs hover:border-amber-400 transition cursor-pointer flex flex-col justify-between shrink-0"
                >
                  <div>
                    <div className="h-32 bg-gray-100 relative overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        Featured Deal
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                        {item.condition}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">{item.category_name}</p>
                      <h3 className="font-bold text-xs text-gray-900 line-clamp-2 mt-0.5 leading-snug">{item.title}</h3>
                    </div>
                  </div>

                  <div className="p-3 pt-0">
                    <p className="text-sm font-black text-gray-900">₦{Number(item.price).toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1 truncate">
                      <MapPin size={10} className="shrink-0 text-gray-400" />
                      <span className="truncate">{item.campus_location.split(',')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5B. Available for Rent on Campus (Rentals Section) */}
        {rentalListings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Clock size={15} className="text-purple-600" />
                <h2 className="font-extrabold text-sm text-gray-900">
                  Available for Rent on Campus
                </h2>
              </div>
              <Link to="/categories?filter=rentals" className="text-xs font-bold text-purple-600 hover:underline">
                View All ({rentalListings.length})
              </Link>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
              {rentalListings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/listing/${item.id}`)}
                  className="min-w-[190px] max-w-[190px] bg-white rounded-2xl overflow-hidden border border-purple-200/80 shadow-2xs hover:border-purple-400 transition cursor-pointer flex flex-col justify-between shrink-0"
                >
                  <div>
                    <div className="h-32 bg-gray-100 relative overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'; }}
                      />
                      <div className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        FOR RENT
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-purple-200 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {item.rental_period || 'per day'}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">{item.category_name || 'Campus Gear'}</p>
                      <h3 className="font-bold text-xs text-gray-900 line-clamp-2 mt-0.5 leading-snug">{item.title}</h3>
                    </div>
                  </div>

                  <div className="p-3 pt-0">
                    <p className="text-sm font-black text-gray-900">
                      ₦{Number(item.price).toLocaleString()}
                      <span className="text-[10px] text-gray-500 font-medium"> / {item.rental_period || 'day'}</span>
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                      <span className="truncate max-w-[100px]">{item.campus_location.split(',')[0]}</span>
                      <span className="text-purple-600 font-bold">Rent Now</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Trending Across Nigerian Campuses (Section 3: Nationwide Discovery) */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={15} className="text-amber-500" />
                <h2 className="font-extrabold text-sm text-gray-900">
                  Trending Across Nigerian Campuses
                </h2>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                Most viewed textbooks, electronics & fashion across universities
              </p>
            </div>

            <Link to="/categories?sort=views" className="text-xs font-bold text-amber-600 hover:underline shrink-0">
              Explore All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
            {trendingListings.slice(0, 10).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/listing/${item.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-2xs hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 sm:h-44 md:h-48 bg-gray-100 relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      🔥 {item.views || 40}+ Views
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {item.university || 'Nationwide'}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-bold text-xs text-gray-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs font-black text-amber-600 mt-1">
                      ₦{Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 pt-0 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-500">
                  <span className="truncate max-w-[85px]">{item.seller_name.split(' ')[0]}</span>
                  <span className="text-[9px] font-bold text-gray-400">{item.university || 'Campus'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. SkulBuy Community Preview (Section 4: WhatsApp-Style Groups) */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-4 text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <MessageCircle size={16} className="text-emerald-200" />
              <h2 className="font-black text-sm text-white">Campus Communities</h2>
            </div>
            <Link
              to="/communities"
              className="text-[11px] font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-xl transition"
            >
              Discover ({communities.length})
            </Link>
          </div>

          <p className="text-xs text-emerald-100 font-medium mb-3">
            Join verified WhatsApp-style groups for {currentUniversity}, accommodation, and student deals.
          </p>

          <div className="space-y-2">
            {communities.map((comm) => (
              <div
                key={comm.id}
                onClick={() => navigate(`/communities/${comm.id}`)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/15 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={comm.image_url}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover bg-white/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-white truncate">{comm.name}</p>
                    <p className="text-[10px] text-emerald-200 truncate">
                      {(comm.live_member_count || comm.member_count || 1).toLocaleString()} members • {comm.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-black text-emerald-200 shrink-0">
                  <span>Open</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7B. Campus Meetups & Student Gatherings */}
        {meetupsList.length > 0 && (
          <section className="bg-white rounded-3xl p-4 border border-gray-150 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-amber-500" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-extrabold text-sm text-gray-900">Campus Meetups & Gatherings</h2>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">Live</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Hostel & faculty student events</p>
                </div>
              </div>
              <Link to="/meetups" className="text-xs font-bold text-amber-600 hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-2">
              {meetupsList.map((meetup) => (
                <div
                  key={meetup.id}
                  onClick={() => navigate('/meetups')}
                  className="bg-gray-50/80 hover:bg-amber-50/50 border border-gray-150 hover:border-amber-300 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded">
                        {meetup.category}
                      </span>
                      <span className="text-[10px] text-gray-500 font-semibold">{meetup.university_code}</span>
                    </div>
                    <h4 className="font-bold text-xs text-gray-900 truncate">{meetup.title}</h4>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">
                      📍 {meetup.venue_name} • {meetup.meetup_date}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {meetup.attendees_count} Going
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. SkulBox Programme Grocery Savings Section */}
        <section>
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-5 text-white relative overflow-hidden shadow-md shadow-amber-500/20">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span>SkulBox Savings</span>
                  <span className="bg-emerald-400 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase">Open</span>
                </span>
                <span className="text-[11px] font-semibold flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full">
                  <Clock size={11} />
                  {activeCycle ? activeCycle.cycle_month : 'Active Cycle'}
                </span>
              </div>

              <h3 className="text-lg font-black tracking-tight leading-snug">
                Hostel Grocery Package with Daily Savings
              </h3>
              <p className="text-xs text-amber-50 mt-1.5 leading-relaxed">
                Order cycle closes on the <strong>25th of the month</strong>. Bulk deliveries arrive at hostel blocks first week of the new month.
              </p>

              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-amber-100 uppercase font-semibold">Packages from</p>
                  <p className="text-lg font-black">₦25,000 <span className="text-xs font-normal text-amber-200">or ₦833/day</span></p>
                </div>
                <Link
                  to="/skulbox"
                  className="bg-white hover:bg-amber-50 text-amber-600 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md active:scale-95 transition flex items-center gap-1"
                >
                  <span>View Packages</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <Package className="absolute -right-6 -bottom-6 text-white/10 w-40 h-40 rotate-12 pointer-events-none" />
          </div>
        </section>

        {/* 9. Recently Added Marketplace Items */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-sm text-gray-900">Recently Added on Campus</h2>
            <Link to="/categories" className="text-xs font-bold text-amber-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
            {recentListings.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/listing/${item.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/70 shadow-2xs hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 sm:h-44 md:h-48 bg-gray-100 relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                      {item.condition}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-bold text-xs text-gray-900 line-clamp-2 leading-snug">{item.title}</h3>
                    <p className="text-xs font-black text-amber-600 mt-1">₦{Number(item.price).toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-2.5 pt-0 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-500">
                  <span className="truncate max-w-[85px]">{item.seller_name.split(' ')[0]}</span>
                  {item.seller_verified === 'verified' && (
                    <span className="inline-flex items-center text-emerald-600 gap-0.5 font-bold">
                      <ShieldCheck size={11} /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Guide Callout */}
        <section>
          <Link 
            to="/safety"
            className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">Campus Safe Trade Protocol</p>
                <p className="text-[10px] text-emerald-800">Meet in daylight hours at SUB building, library, or gate.</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-emerald-600 group-hover:translate-x-0.5 transition" />
          </Link>
        </section>

        {/* Footer with Official Logo & Legal Links */}
        <footer className="pt-6 pb-4 border-t border-gray-200 text-center space-y-3">
          <div className="flex justify-center">
            <SkulBuyLogo size="md" showBadge={false} />
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-gray-500 font-medium">
            <Link to="/safety" className="hover:text-amber-600">Safety Guide</Link>
            <Link to="/communities" className="hover:text-amber-600">Communities</Link>
            <Link to="/terms" className="hover:text-amber-600">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-amber-600">Privacy Notice (NDPA)</Link>
            <Link to="/disputes" className="hover:text-amber-600">Refunds & Disputes</Link>
            <Link to="/faq" className="hover:text-amber-600">FAQs</Link>
          </div>

          <p className="text-[11px] text-gray-400">
            SkulBuy &copy; 2026. Student marketplace for Nigerian Universities (FUTMINNA, UniAbuja, UNILAG & nationwide).
          </p>
        </footer>
      </main>

      {/* Wallet Funding Modal */}
      <FundWalletModal
        isOpen={showFundModal}
        onClose={() => setShowFundModal(false)}
      />

      {/* Campus Selector Modal */}
      <UniversityModal
        isOpen={showUniModal}
        onClose={() => setShowUniModal(false)}
        onSelect={() => loadHomepageData()}
      />
    </div>
  );
};
