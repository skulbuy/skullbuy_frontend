import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Shield, UserCircle, CheckCircle, 
  ChevronDown, LogIn, Sparkles, Wallet, Plus, MapPin, UserPlus, MessageCircle, School
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SkulBuyLogo } from './SkulBuyLogo';
import { UniversityModal } from './UniversityModal';

export const Header: React.FC<{ onSearchSubmit?: (query: string) => void }> = ({ onSearchSubmit }) => {
  const { user, logout } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showUniModal, setShowUniModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const currentUniversity = user?.university || user?.campus || 'FUTMINNA';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    } else {
      navigate(`/categories?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* Main Desktop & Mobile Bar */}
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Brand & Campus Pill */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <Link to="/" className="shrink-0 flex items-center">
              <SkulBuyLogo size="md" showBadge={false} />
            </Link>

            {/* Clickable University Badge */}
            <button
              onClick={() => setShowUniModal(true)}
              className="flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 sm:px-2.5 py-1 rounded-full border border-amber-200 transition shrink-0"
              title="Switch your campus location"
            >
              <School size={12} className="text-amber-600" />
              <span className="truncate max-w-[90px] sm:max-w-none">{currentUniversity}</span>
              <ChevronDown size={11} className="text-amber-600" />
            </button>
          </div>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fans, laptops, textbooks, hostel gear..."
                className="w-full bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-gray-900 border border-gray-200 focus:border-amber-500 rounded-xl py-2 pl-10 pr-20 text-xs font-medium focus:ring-2 focus:ring-amber-400/20 outline-none transition shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition shadow-xs"
              >
                Search
              </button>
            </form>
          </div>

          {/* Desktop Nav Links (Hidden on Mobile) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-gray-600">
            <Link to="/categories" className="hover:text-amber-600 transition">
              Marketplace
            </Link>
            <Link to="/skulbox" className="hover:text-amber-600 transition flex items-center gap-1">
              <span>SkulBox</span>
              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-black">SAVE</span>
            </Link>
            <Link to="/communities" className="hover:text-amber-600 transition">
              Communities
            </Link>
            <Link to="/meetups" className="hover:text-amber-600 transition flex items-center gap-1">
              <span>Meetups</span>
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Sell CTA Button */}
            <Link
              to="/sell"
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95 shrink-0"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Sell Item</span>
            </Link>

            {user ? (
              <>
                {/* Desktop Wallet Balance Pill */}
                <Link
                  to="/profile"
                  className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1.5 rounded-xl text-xs font-black transition"
                  title="Your SkulBuy Wallet Balance"
                >
                  <Wallet size={13} className="text-emerald-600" />
                  <span>₦{(user.wallet_balance || 0).toLocaleString()}</span>
                </Link>

                {/* Messages & Communities Shortcut */}
                <Link
                  to="/messages"
                  className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 relative transition"
                  title="Chats & Communities"
                >
                  <MessageCircle size={16} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                </Link>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  to="/profile"
                  className="text-xs font-bold text-gray-700 hover:text-gray-900 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/onboarding"
                  className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition"
                >
                  <UserPlus size={13} />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Sign Up button if not logged in */}
            {!user && (
              <Link
                to="/onboarding"
                className="sm:hidden flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-xl text-[11px] font-black shadow-xs transition"
              >
                <UserPlus size={12} />
                <span>Sign Up</span>
              </Link>
            )}

            {/* User State / Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2 py-1.5 rounded-xl transition"
                title="Account menu"
              >
                {user ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-gray-800 truncate max-w-[75px] sm:max-w-[110px]">
                      {user.full_name.split(' ')[0]}
                    </span>
                    {user.student_id_verified === 'verified' && (
                      <CheckCircle size={12} className="text-emerald-600" />
                    )}
                  </>
                ) : (
                  <>
                    <LogIn size={13} className="text-gray-500" />
                    <span className="font-semibold text-gray-600 text-[11px]">Guest</span>
                  </>
                )}
                <ChevronDown size={12} className="text-gray-400" />
              </button>

              {/* Account menu dropdown */}
              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 text-left text-xs animate-in fade-in slide-in-from-top-2">
                  {user ? (
                    <>
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className="font-bold text-gray-900 truncate">{user.full_name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowPersonaMenu(false)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 transition flex items-center justify-between font-bold text-gray-800"
                        >
                          <span>Profile & Campus Wallet</span>
                          <span className="text-[10px] text-emerald-700 font-black">₦{(user.wallet_balance || 0).toLocaleString()}</span>
                        </Link>
                        <Link
                          to="/messages"
                          onClick={() => setShowPersonaMenu(false)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition flex items-center justify-between font-semibold text-gray-700"
                        >
                          <span>Chats & Messages</span>
                        </Link>
                        <Link
                          to="/communities"
                          onClick={() => setShowPersonaMenu(false)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition flex items-center justify-between font-semibold text-gray-700"
                        >
                          <span>Campus Communities</span>
                        </Link>
                        <Link
                          to="/skulbox"
                          onClick={() => setShowPersonaMenu(false)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition flex items-center justify-between font-semibold text-gray-700"
                        >
                          <span>SkulBox Group Savings</span>
                        </Link>
                      </div>
                      <div className="pt-2 mt-1 border-t border-gray-100 px-2 flex justify-between items-center">
                        <Link
                          to="/profile"
                          onClick={() => setShowPersonaMenu(false)}
                          className="text-[11px] font-bold text-amber-600 hover:underline"
                        >
                          Account Settings
                        </Link>
                        <button
                          onClick={() => { logout(); setShowPersonaMenu(false); }}
                          className="text-[11px] font-semibold text-red-500 hover:text-red-600 cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowPersonaMenu(false)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition flex items-center justify-between font-bold text-gray-800"
                      >
                        <span>Sign In to Account</span>
                      </Link>
                      <Link
                        to="/onboarding"
                        onClick={() => setShowPersonaMenu(false)}
                        className="w-full text-left px-3 py-2 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 transition flex items-center justify-between font-bold"
                      >
                        <span>Create Student Account</span>
                        <span className="text-[9px] bg-amber-200 px-1.5 py-0.5 rounded font-black">+₦1k</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row (Shown only on Mobile) */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fans, laptops, past questions, gear..."
              className="w-full bg-gray-100 hover:bg-gray-100/80 focus:bg-white text-gray-900 border border-transparent focus:border-amber-400 rounded-xl py-2 pl-9 pr-18 text-xs font-medium focus:ring-2 focus:ring-amber-400/20 outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* University Switcher Modal */}
      <UniversityModal
        isOpen={showUniModal}
        onClose={() => setShowUniModal(false)}
      />
    </header>
  );
};
