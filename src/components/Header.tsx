import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  ChevronDown,
  Wallet,
  Plus,
  MessageCircle,
  School,
  User as UserIcon,
  LogOut,
  Package,
  Users,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SkulBuyLogo } from './SkulBuyLogo';
import { UniversityModal } from './UniversityModal';

export const Header: React.FC<{ onSearchSubmit?: (query: string) => void }> = ({ onSearchSubmit }) => {
  const { user, logout } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showUniModal, setShowUniModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const currentUniversity = user?.university || user?.campus || 'FUTMINNA';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    } else {
      navigate(`/categories?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 md:gap-6">
        {/* Left: Brand Logo & Compact Campus Selector */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/" className="shrink-0 flex items-center">
            <SkulBuyLogo size="md" showBadge={false} />
          </Link>

          <button
            onClick={() => setShowUniModal(true)}
            className="flex items-center gap-1 text-[11px] font-extrabold text-gray-700 hover:text-amber-700 bg-gray-100/80 hover:bg-amber-50 px-2.5 py-1 rounded-full transition shrink-0 cursor-pointer"
            title="Switch campus"
          >
            <School size={12} className="text-amber-600 shrink-0" />
            <span className="truncate max-w-[80px] sm:max-w-[120px]">{currentUniversity}</span>
            <ChevronDown size={11} className="text-gray-400" />
          </button>
        </div>

        {/* Center: Clean Search Input (Desktop & Tablet) */}
        <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laptops, fans, textbooks, hostel gear..."
              className="w-full bg-gray-100/80 hover:bg-gray-100 focus:bg-white text-gray-900 border border-transparent focus:border-amber-500 rounded-full py-2 pl-9 pr-4 text-xs font-medium focus:ring-2 focus:ring-amber-400/20 outline-none transition"
            />
          </form>
        </div>

        {/* Right: Minimal Navigation & Single Account Control */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-gray-600 mr-1">
            <Link
              to="/categories"
              className={`px-3 py-1.5 rounded-lg transition ${
                isActive('/categories') ? 'text-amber-600 bg-amber-50/80' : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/communities"
              className={`px-3 py-1.5 rounded-lg transition ${
                isActive('/communities') ? 'text-amber-600 bg-amber-50/80' : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Communities
            </Link>
            <Link
              to="/skulbox"
              className={`px-3 py-1.5 rounded-lg transition ${
                isActive('/skulbox') ? 'text-amber-600 bg-amber-50/80' : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              SkulBox
            </Link>
            <Link
              to="/meetups"
              className={`px-3 py-1.5 rounded-lg transition ${
                isActive('/meetups') ? 'text-amber-600 bg-amber-50/80' : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Meetups
            </Link>
          </nav>

          {/* Desktop Sell CTA (Mobile uses BottomNav + Sell) */}
          <Link
            to="/sell"
            className="hidden sm:inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-full shadow-2xs transition active:scale-95 shrink-0"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Sell</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              {/* Inbox Shortcut */}
              <Link
                to="/messages"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative transition"
                title="Messages & Chats"
              >
                <MessageCircle size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </Link>

              {/* Single Unified User Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-2 bg-gray-100/90 hover:bg-gray-200/70 text-gray-900 pl-1.5 pr-2.5 py-1 rounded-full transition cursor-pointer"
                  title="Account & Wallet"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white font-black text-[11px] flex items-center justify-center shrink-0 overflow-hidden">
                    {user.profile_picture ? (
                      <img src={user.profile_picture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.full_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[75px] hidden sm:inline">
                    {user.full_name.split(' ')[0]}
                  </span>
                  {user.student_id_verified === 'verified' && (
                    <CheckCircle size={12} className="text-emerald-600 shrink-0 hidden sm:inline" />
                  )}
                  <ChevronDown size={12} className="text-gray-500" />
                </button>

                {showAccountMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAccountMenu(false)} />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 text-left text-xs">
                      <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                        <p className="font-extrabold text-gray-900 truncate">{user.full_name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        <div className="mt-2 flex items-center justify-between bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-xl font-black text-[11px]">
                          <span className="flex items-center gap-1">
                            <Wallet size={12} className="text-emerald-600" /> Wallet
                          </span>
                          <span>₦{(user.wallet_balance || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          to="/profile"
                          onClick={() => setShowAccountMenu(false)}
                          className="w-full px-3 py-2 rounded-xl hover:bg-gray-50 transition flex items-center gap-2.5 font-semibold text-gray-700"
                        >
                          <UserIcon size={14} className="text-gray-400" />
                          <span>My Profile & Listings</span>
                        </Link>
                        <Link
                          to="/messages"
                          onClick={() => setShowAccountMenu(false)}
                          className="w-full px-3 py-2 rounded-xl hover:bg-gray-50 transition flex items-center gap-2.5 font-semibold text-gray-700"
                        >
                          <MessageCircle size={14} className="text-gray-400" />
                          <span>Chats & Messages</span>
                        </Link>
                        <Link
                          to="/communities"
                          onClick={() => setShowAccountMenu(false)}
                          className="w-full px-3 py-2 rounded-xl hover:bg-gray-50 transition flex items-center gap-2.5 font-semibold text-gray-700"
                        >
                          <Users size={14} className="text-gray-400" />
                          <span>Campus Communities</span>
                        </Link>
                        <Link
                          to="/skulbox"
                          onClick={() => setShowAccountMenu(false)}
                          className="w-full px-3 py-2 rounded-xl hover:bg-gray-50 transition flex items-center gap-2.5 font-semibold text-gray-700"
                        >
                          <Package size={14} className="text-gray-400" />
                          <span>SkulBox Savings</span>
                        </Link>
                        <Link
                          to="/meetups"
                          onClick={() => setShowAccountMenu(false)}
                          className="w-full px-3 py-2 rounded-xl hover:bg-gray-50 transition flex items-center gap-2.5 font-semibold text-gray-700"
                        >
                          <Calendar size={14} className="text-gray-400" />
                          <span>Campus Meetups</span>
                        </Link>
                      </div>

                      <div className="pt-1.5 mt-1 border-t border-gray-100">
                        <button
                          onClick={() => {
                            logout();
                            setShowAccountMenu(false);
                          }}
                          className="w-full px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-bold flex items-center gap-2 transition cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="text-xs font-bold text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-full hover:bg-gray-100 transition"
              >
                Sign In
              </Link>
              <Link
                to="/onboarding"
                className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold transition shadow-2xs"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar (Only shown on Home & Categories pages on mobile to avoid clutter) */}
      {(location.pathname === '/' || location.pathname === '/categories') && (
        <div className="px-4 pb-2.5 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laptops, fans, textbooks..."
              className="w-full bg-gray-100 focus:bg-white text-gray-900 border border-transparent focus:border-amber-400 rounded-full py-1.5 pl-9 pr-4 text-xs font-medium outline-none transition"
            />
          </form>
        </div>
      )}

      <UniversityModal isOpen={showUniModal} onClose={() => setShowUniModal(false)} />
    </header>
  );
};
