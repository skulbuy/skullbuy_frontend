import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, ShieldCheck, MapPin, 
  ArrowRight, CheckCircle2, Award, Wallet, ArrowLeft, 
  Eye, EyeOff, Lock, Phone, Mail, GraduationCap, 
  Search, Compass, Check, AlertCircle, Camera, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { SkulBuyLogo } from '../components/SkulBuyLogo';
import { University } from '../types';
import { NIGERIAN_UNIVERSITIES } from '../data/nigerianUniversities';

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, register, completeOnboarding, sendOtp, verifyOtp } = useAuth();

  // Screen: 1 (Welcome), 2 (Auth/Credentials), 25 (Email OTP Verification), 3 (Where do you study?), 4 (Profile setup)
  const [screen, setScreen] = useState<number>(1);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showBonusCelebration, setShowBonusCelebration] = useState(false);
  const [bonusDetails, setBonusDetails] = useState<{ amount: number; balance: number } | null>(null);

  // Screen 2 State (Auth)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // OTP Verification State (Priority 2)
  const [otpCode, setOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpExpiresIn, setOtpExpiresIn] = useState(300); // 5 minutes
  const [emailVerified, setEmailVerified] = useState(false);
  const [testOtpHint, setTestOtpHint] = useState<string | null>(null);

  // Screen 3 State (University & Campus Selection)
  const [universities, setUniversities] = useState<University[]>(NIGERIAN_UNIVERSITIES);
  const [searchUni, setSearchUni] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [selectedUni, setSelectedUni] = useState<University>(() => {
    return NIGERIAN_UNIVERSITIES.find(u => u.short_name === 'FUTMX') || NIGERIAN_UNIVERSITIES[0];
  });
  const [selectedCampus, setSelectedCampus] = useState<string>('Gidan Kwano Campus (Main)');
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  // Screen 4 State (Student Profile & Preferences)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(DEFAULT_AVATARS[0]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [levelOfStudy, setLevelOfStudy] = useState('200L');
  const [department, setDepartment] = useState('Computer Engineering');
  const [role, setRole] = useState<'buyer' | 'seller'>('seller');

  // Load universities from API
  useEffect(() => {
    fetch('/api/universities')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setUniversities(data);
          const defaultUni = data.find((u: University) => u.short_name === 'FUTMX') || data[0];
          setSelectedUni(defaultUni);
          if (defaultUni.campuses && defaultUni.campuses.length > 0) {
            setSelectedCampus(defaultUni.campuses[0].name);
          }
        }
      })
      .catch(() => {
        // Fallback to static seed
      });
  }, []);

  // Sync first and last name when fullName changes
  useEffect(() => {
    if (fullName) {
      const parts = fullName.trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      if (!username && parts[0]) {
        setUsername(`${parts[0].toLowerCase()}_${Math.floor(100 + Math.random() * 900)}`);
      }
    }
  }, [fullName]);

  // Handle University Selection
  const handleSelectUni = (uni: University) => {
    setSelectedUni(uni);
    if (uni.campuses && uni.campuses.length > 0) {
      setSelectedCampus(uni.campuses[0].name);
    } else {
      setSelectedCampus(`${uni.name} Main Campus`);
    }
  };

  // Geolocation detector
  const handleDetectLocation = () => {
    setGeoLoading(true);
    setGeoNotice(null);

    if (!navigator.geolocation) {
      // Fallback to server IP heuristic
      fetch('/api/geolocation/suggest')
        .then(r => r.json())
        .then(data => {
          if (data.university) {
            const found = universities.find(u => u.short_name === data.university.short_name);
            if (found) {
              handleSelectUni(found);
              setGeoNotice(`Detected nearest campus: ${found.name} (${data.distanceKm} km away)`);
            }
          }
        })
        .finally(() => setGeoLoading(false));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch(`/api/geolocation/suggest?lat=${latitude}&lng=${longitude}`)
          .then(r => r.json())
          .then(data => {
            if (data.university) {
              const matched = universities.find(u => u.short_name === data.university.short_name) || data.university;
              handleSelectUni(matched);
              setGeoNotice(`Found closest institution: ${matched.name} (~${data.distanceKm} km)`);
            }
          })
          .catch(() => {
            setGeoNotice('Could not detect nearest university. Please choose from list below.');
          })
          .finally(() => setGeoLoading(false));
      },
      () => {
        // Fallback
        fetch('/api/geolocation/suggest')
          .then(r => r.json())
          .then(data => {
            if (data.university) {
              const found = universities.find(u => u.short_name === data.university.short_name);
              if (found) {
                handleSelectUni(found);
                setGeoNotice(`Suggested campus: ${found.name}`);
              }
            }
          })
          .finally(() => setGeoLoading(false));
      },
      { timeout: 7000 }
    );
  };

  // Avatar file upload (Priority 3)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Avatar photo must be under 5MB.');
      return;
    }

    setUploadingAvatar(true);
    setErrorMsg('');
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, type: 'avatar' })
        });
        const data = await res.json();
        if (data.url) {
          setProfilePicture(data.url);
        } else {
          setErrorMsg(data.error || 'Failed to upload custom avatar');
        }
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorMsg('Error processing avatar image');
      setUploadingAvatar(false);
    }
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const res = await login(email);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.error || 'Invalid credentials. Please verify your email.');
    }
  };

  // OTP Countdown Timers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpCooldown > 0) {
      interval = setInterval(() => {
        setOtpCooldown(c => Math.max(0, c - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpCooldown]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (screen === 25 && otpExpiresIn > 0) {
      interval = setInterval(() => {
        setOtpExpiresIn(t => Math.max(0, t - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, otpExpiresIn]);

  // Request or Resend OTP
  const handleRequestOtp = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid student email address.');
      return;
    }
    setOtpSending(true);
    setErrorMsg('');
    const res = await sendOtp(email);
    setOtpSending(false);

    if (res.success) {
      setOtpCooldown(res.cooldownSeconds || 60);
      setOtpExpiresIn(300); // 5 minutes
      // Fetch preview code if in local evaluation
      fetch(`/api/auth/otp-preview?email=${encodeURIComponent(email)}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.latestOtp && data.latestOtp !== '[Hashed in database]') {
            setTestOtpHint(data.latestOtp);
          }
        })
        .catch(() => {});
    } else {
      setErrorMsg(res.error || 'Failed to dispatch verification code.');
    }
  };

  // Proceed from Screen 2 (Credentials) to Screen 25 (OTP Verification)
  const handleProceedToOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg('');

    if (emailVerified) {
      setScreen(3);
      return;
    }

    setOtpSending(true);
    const res = await sendOtp(email);
    setOtpSending(false);

    if (res.success) {
      setOtpCooldown(res.cooldownSeconds || 60);
      setOtpExpiresIn(300);
      setScreen(25);
      fetch(`/api/auth/otp-preview?email=${encodeURIComponent(email)}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.latestOtp && data.latestOtp !== '[Hashed in database]') {
            setTestOtpHint(data.latestOtp);
          }
        })
        .catch(() => {});
    } else {
      setErrorMsg(res.error || 'Could not send verification email. Please check your email address.');
    }
  };

  // Verify entered OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }
    setOtpVerifying(true);
    setErrorMsg('');

    const res = await verifyOtp(email, otpCode.trim());
    setOtpVerifying(false);

    if (res.success) {
      setEmailVerified(true);
      setErrorMsg('');
      setScreen(3); // Proceed to University & Campus Selection
    } else {
      setErrorMsg(res.error || 'Verification code is invalid or has expired.');
    }
  };

  // Complete Onboarding & Claim ₦500 Bonus
  const handleCompleteSetup = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. If not authenticated yet, register first
      let currentToken = localStorage.getItem('skulbuy_token');
      if (!currentToken || currentToken === 'guest') {
        const regRes = await register({
          full_name: `${firstName} ${lastName}`.trim() || fullName,
          email,
          phone,
          password,
          role,
          campus: selectedUni.short_name,
          campus_area: selectedCampus,
          department
        });
        if (!regRes.success) {
          setErrorMsg(regRes.error || 'Registration failed');
          setLoading(false);
          return;
        }
      }

      // 2. Call complete-onboarding
      const onboardRes = await completeOnboarding({
        first_name: firstName,
        last_name: lastName,
        username: username.replace(/^@/, ''),
        profile_picture: profilePicture,
        phone,
        department,
        level_of_study: levelOfStudy,
        university_id: selectedUni.id,
        campus_name: selectedUni.short_name,
        campus_area: selectedCampus,
        role
      });

      setLoading(false);

      if (onboardRes.success) {
        setBonusDetails({
          amount: onboardRes.bonusAwarded || 500,
          balance: onboardRes.user?.wallet_balance || 500
        });
        setShowBonusCelebration(true);
      } else {
        setErrorMsg(onboardRes.error || 'Failed to finish onboarding. Please try again.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('A connection error occurred while completing setup.');
    }
  };

  // Filtered universities
  const filteredUnis = universities.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchUni.toLowerCase()) || 
                          u.short_name.toLowerCase().includes(searchUni.toLowerCase()) ||
                          u.city.toLowerCase().includes(searchUni.toLowerCase()) ||
                          u.state.toLowerCase().includes(searchUni.toLowerCase());
    const matchesType = typeFilter === 'All' || u.type === typeFilter;
    const matchesState = stateFilter === 'All' || u.state === stateFilter;
    return matchesSearch && matchesType && matchesState;
  });

  const uniqueStates = ['All', ...Array.from(new Set(universities.map(u => u.state))).sort()];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between max-w-md mx-auto relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between z-20">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl px-2.5 py-1 shadow-md">
          <SkulBuyLogo size="sm" showBadge={true} badge="Campus" />
        </div>

        {screen > 1 && (
          <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-300 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span>
              {screen === 2 ? 'Step 2 of 4: Credentials' : screen === 25 ? 'Step 2B: Email OTP' : screen === 3 ? 'Step 3 of 4: Campus' : 'Step 4 of 4: Profile'}
            </span>
          </div>
        )}

        <button 
          onClick={() => navigate('/')} 
          className="text-xs font-semibold text-gray-400 hover:text-white transition px-2 py-1"
        >
          Skip
        </button>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col justify-center px-5 py-3 z-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* SCREEN 1: WELCOME & VALUE PROPOSITION                                    */}
          {/* ========================================================================= */}
          {screen === 1 && (
            <motion.div
              key="screen1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4 my-auto text-center"
            >
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black shadow-sm">
                <Sparkles size={13} className="text-amber-400" />
                <span>NIGERIA'S #1 STUDENT MARKETPLACE</span>
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none text-white uppercase">
                  Buy. Sell. <span className="text-amber-400">Rent.</span> Anything.
                </h1>
                <p className="text-xs text-gray-300 max-w-xs mx-auto mt-2 leading-relaxed">
                  Join verified students across Nigerian universities trading secondhand essentials, textbooks, gadgets, campus rentals, and foodstuff savings.
                </p>
              </div>

              {/* Realistic Hero Visual */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/15 shadow-2xl h-52 mx-auto w-full group">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                  alt="Nigerian university campus students"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Zero Commission
                    </span>
                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] text-gray-200 border border-white/10">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>Verified Students Only</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-black text-white">Campus-First Trade & Rental Network</p>
                    <p className="text-[10px] text-gray-300">FUTMX • UNILAG • OAU • UNIBEN • ABU & 20+ Campuses</p>
                  </div>
                </div>
              </div>

              {/* 3 Core Value Pillars */}
              <div className="grid grid-cols-3 gap-2 text-left pt-1">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
                  <Wallet size={16} className="text-amber-400 mb-1" />
                  <p className="text-[11px] font-black text-white">₦500 Bonus</p>
                  <p className="text-[9px] text-gray-400 leading-tight">Instant wallet gift upon onboarding</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
                  <ShieldCheck size={16} className="text-emerald-400 mb-1" />
                  <p className="text-[11px] font-black text-white">Daylight Safety</p>
                  <p className="text-[9px] text-gray-400 leading-tight">Hostel & Library verified meetup spots</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
                  <Award size={16} className="text-amber-400 mb-1" />
                  <p className="text-[11px] font-black text-white">Student Rentals</p>
                  <p className="text-[9px] text-gray-400 leading-tight">Rent cameras, gowns & calculators</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setScreen(2);
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 py-3.5 px-5 rounded-2xl font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span>Get Started — Claim ₦500 Bonus</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setScreen(2);
                  }}
                  className="w-full bg-white/10 hover:bg-white/15 text-gray-200 py-3 rounded-2xl font-bold text-xs border border-white/10 transition"
                >
                  I already have an account — Sign In
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 2: AUTHENTICATION (SIGN UP / SIGN IN)                               */}
          {/* ========================================================================= */}
          {screen === 2 && (
            <motion.div
              key="screen2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 my-auto"
            >
              <div>
                <button 
                  onClick={() => setScreen(1)} 
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-2"
                >
                  <ArrowLeft size={13} /> Back to Welcome
                </button>

                {/* Tab Switcher */}
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-4">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                    className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
                      authMode === 'signup' 
                        ? 'bg-amber-500 text-slate-950 shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                    className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
                      authMode === 'signin' 
                        ? 'bg-amber-500 text-slate-950 shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                </div>

                <h2 className="text-xl font-black text-white">
                  {authMode === 'signup' ? 'Create Your Student Account' : 'Welcome Back to SkulBuy'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {authMode === 'signup' 
                    ? 'Enter your student details to claim your ₦500 welcome credit.' 
                    : 'Log in with your registered student email and password.'}
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              {authMode === 'signup' ? (
                <form onSubmit={handleProceedToOtp} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Danjuma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2.5 px-3.5 text-white outline-none font-medium placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Student / Personal Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. samuel.d@futminna.edu.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2.5 px-3.5 text-white outline-none font-medium placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">WhatsApp / Phone Number *</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="0801 234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2.5 pl-9 pr-3.5 text-white outline-none font-medium placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Create Password *</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2.5 pl-9 pr-10 text-white outline-none font-medium placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={otpSending}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2 mt-4"
                  >
                    <span>{otpSending ? 'Sending Verification Code...' : 'Verify Email & Continue'}</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Student Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. amina@futminna.edu.ng"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2.5 pl-9 pr-3.5 text-white outline-none font-medium placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Password</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2.5 pl-9 pr-10 text-white outline-none font-medium placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Campus Account'}
                  </button>

                  {/* Fast Demo Persona Switcher */}
                  <div className="pt-2 border-t border-white/10 text-center">
                    <p className="text-[10px] text-gray-400 mb-2">Or quick sign in as demo student:</p>
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setEmail('amina@futminna.edu.ng'); setPassword('password123'); }}
                        className="text-[10px] bg-white/10 hover:bg-white/20 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-white/10"
                      >
                        Amina (Seller)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEmail('emeka@futminna.edu.ng'); setPassword('password123'); }}
                        className="text-[10px] bg-white/10 hover:bg-white/20 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-white/10"
                      >
                        Emeka (Buyer)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEmail('zainab@futminna.edu.ng'); setPassword('password123'); }}
                        className="text-[10px] bg-white/10 hover:bg-white/20 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-white/10"
                      >
                        Zainab (Vendor)
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 25: EMAIL OTP VERIFICATION (PRIORITY 2)                            */}
          {/* ========================================================================= */}
          {screen === 25 && (
            <motion.div
              key="screen25"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 my-auto"
            >
              <div>
                <button
                  type="button"
                  onClick={() => setScreen(2)}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-2"
                >
                  <ArrowLeft size={13} /> Edit Email or Details
                </button>
                <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mb-3 border border-amber-500/30">
                  <Mail size={22} />
                </div>
                <h2 className="text-xl font-black text-white">Verify Your Student Email</h2>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  We sent a 6-digit verification code to <span className="font-bold text-amber-400">{email}</span>.
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[12px] font-mono text-2xl font-black bg-white/10 border-2 border-amber-400/50 focus:border-amber-400 rounded-2xl py-3 text-white outline-none placeholder:text-gray-600"
                  />
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
                    <span>
                      ⏳ Code expires in:{' '}
                      <strong className={otpExpiresIn < 60 ? 'text-red-400' : 'text-amber-400'}>
                        {Math.floor(otpExpiresIn / 60)}:{(otpExpiresIn % 60).toString().padStart(2, '0')}
                      </strong>
                    </span>
                    <button
                      type="button"
                      disabled={otpCooldown > 0 || otpSending}
                      onClick={handleRequestOtp}
                      className="text-amber-400 disabled:text-gray-500 hover:underline font-bold"
                    >
                      {otpCooldown > 0 ? `Resend code in ${otpCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>

                {testOtpHint && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-center">
                    <p className="text-[10px] text-amber-300 font-semibold mb-1">
                      🧪 Test Evaluation Code: <span className="font-mono font-bold tracking-widest">{testOtpHint}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setOtpCode(testOtpHint)}
                      className="text-[10px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg"
                    >
                      Click to Auto-fill Code
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otpVerifying || otpCode.length !== 6}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2"
                >
                  {otpVerifying ? 'Verifying Code...' : 'Verify Email & Continue'}
                  <ArrowRight size={15} />
                </button>
              </form>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 3: "WHERE DO YOU STUDY?" (NUC UNIVERSITIES & CAMPUS PICKER)         */}
          {/* ========================================================================= */}
          {screen === 3 && (
            <motion.div
              key="screen3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3.5 my-auto"
            >
              <div>
                <button 
                  onClick={() => setScreen(2)} 
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-1"
                >
                  <ArrowLeft size={13} /> Back to Credentials
                </button>
                <h2 className="text-xl font-black text-white">Where Do You Study?</h2>
                <p className="text-xs text-gray-400">
                  Select your Nigerian university and campus to see deals, meetups and rentals within walking distance.
                </p>
              </div>

              {/* Geolocation Button */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={geoLoading}
                className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-300 py-2.5 px-3.5 rounded-2xl text-xs font-bold flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Compass size={16} className={`text-amber-400 ${geoLoading ? 'animate-spin' : ''}`} />
                  <span>{geoLoading ? 'Detecting nearest campus...' : 'Use My Current Location'}</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">GPS Suggest</span>
              </button>

              {geoNotice && (
                <div className="text-[11px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl flex items-center gap-1.5">
                  <Check size={14} className="shrink-0 text-emerald-400" />
                  <span>{geoNotice}</span>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search university name, acronym, city, or state..."
                  value={searchUni}
                  onChange={(e) => setSearchUni(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-gray-500"
                />
              </div>

              {/* Filters: Type & State */}
              <div className="flex items-center gap-2 text-xs">
                {/* Type pills */}
                <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/10 shrink-0">
                  {['All', 'Federal', 'State', 'Private'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeFilter(type)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg transition ${
                        typeFilter === type ? 'bg-amber-500 text-slate-950' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* State selector */}
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="bg-slate-900 border border-white/15 text-gray-300 text-[11px] rounded-xl px-2 py-1.5 outline-none flex-1 truncate"
                >
                  {uniqueStates.map((st) => (
                    <option key={st} value={st}>State: {st}</option>
                  ))}
                </select>
              </div>

              {/* University List */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 no-scrollbar border border-white/10 rounded-2xl p-1 bg-black/20">
                {filteredUnis.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400">
                    No universities found matching your search.
                  </div>
                ) : (
                  filteredUnis.map((uni) => {
                    const isSelected = selectedUni?.id === uni.id;
                    return (
                      <button
                        key={uni.id}
                        type="button"
                        onClick={() => handleSelectUni(uni)}
                        className={`w-full py-2 px-3 rounded-xl text-left border flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black">{uni.short_name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                              isSelected ? 'bg-slate-950 text-amber-300' : 'bg-white/10 text-gray-400'
                            }`}>
                              {uni.type || 'Federal'}
                            </span>
                          </div>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-slate-900 font-medium' : 'text-gray-400'}`}>
                            {uni.name} — {uni.city}, {uni.state}
                          </p>
                        </div>
                        {isSelected && <CheckCircle2 size={16} className="shrink-0 text-slate-950" />}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Multi-Campus Selection for selected University */}
              {selectedUni && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Select Specific Campus / Hub
                    </label>
                    <span className="text-[10px] text-amber-400 font-bold">{selectedUni.short_name}</span>
                  </div>

                  {selectedUni.campuses && selectedUni.campuses.length > 0 ? (
                    <div className="space-y-1">
                      {selectedUni.campuses.map((camp) => (
                        <button
                          key={camp.name}
                          type="button"
                          onClick={() => setSelectedCampus(camp.name)}
                          className={`w-full text-left py-2 px-3 rounded-xl text-xs flex items-center justify-between border transition ${
                            selectedCampus === camp.name
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin size={13} className={selectedCampus === camp.name ? 'text-amber-400' : 'text-gray-500'} />
                            <span>{camp.name} ({camp.city})</span>
                          </div>
                          {selectedCampus === camp.name && <Check size={14} className="text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={selectedCampus}
                      onChange={(e) => setSelectedCampus(e.target.value)}
                      placeholder="e.g. Main Campus / Hostel Zone"
                      className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2 px-3 text-xs text-white outline-none"
                    />
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => setScreen(4)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2 mt-2"
              >
                <span>Continue to Profile Setup</span>
                <ArrowRight size={15} />
              </button>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 4: PROFILE SETUP & PERSONALIZATION                                 */}
          {/* ========================================================================= */}
          {screen === 4 && (
            <motion.div
              key="screen4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3.5 my-auto"
            >
              <div>
                <button 
                  onClick={() => setScreen(3)} 
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-1"
                >
                  <ArrowLeft size={13} /> Back to University
                </button>
                <h2 className="text-xl font-black text-white">Complete Student Profile</h2>
                <p className="text-xs text-gray-400">
                  Customise your profile at <strong>{selectedUni.short_name}</strong> to claim your <strong>₦500 welcome credit</strong>.
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Avatar Picker & Upload (Priority 3) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
                <div className="relative inline-block mx-auto mb-2">
                  <img
                    src={profilePicture}
                    alt="Profile Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 shadow-md"
                  />
                  <label className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-full cursor-pointer shadow-md transition">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-center gap-2 mb-3">
                  <label className="text-[11px] font-bold bg-white/10 hover:bg-white/15 text-amber-300 px-3 py-1.5 rounded-xl cursor-pointer border border-white/10 inline-flex items-center gap-1.5 transition">
                    <Upload size={12} />
                    <span>{uploadingAvatar ? 'Uploading...' : 'Upload Student Photo'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>

                  {profilePicture.startsWith('/uploads/') && (
                    <button
                      type="button"
                      onClick={() => setProfilePicture(DEFAULT_AVATARS[0])}
                      className="text-[11px] font-bold bg-red-500/10 hover:bg-red-500/20 text-red-300 px-2.5 py-1.5 rounded-xl border border-red-500/20 inline-flex items-center gap-1 transition"
                    >
                      <Trash2 size={12} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-gray-400 mb-2">Or choose from campus presets:</p>
                <div className="flex justify-center gap-2">
                  {DEFAULT_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfilePicture(av)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition ${
                        profilePicture === av ? 'border-amber-400 scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar choice" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Samuel"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Danjuma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
                  />
                </div>
              </div>

              {/* Username & Department */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Username *</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-gray-500">@</span>
                    <input
                      type="text"
                      required
                      placeholder="samuel_d"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2 pl-6 pr-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="Comp Engineering"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
                  />
                </div>
              </div>

              {/* Level of Study */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Level of Study</label>
                <div className="grid grid-cols-5 gap-1.5 text-xs">
                  {['100L', '200L', '300L', '400L', '500L'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevelOfStudy(lvl)}
                      className={`py-1.5 rounded-xl font-bold border transition text-[11px] ${
                        levelOfStudy === lvl
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Role */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">How will you participate?</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      role === 'seller' ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    <p className="font-bold text-xs">Buy, Sell & Rent</p>
                    <p className="text-[10px] opacity-80 leading-tight">Post listings, earn cash & discover campus items</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      role === 'buyer' ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    <p className="font-bold text-xs">Buyer & Explorer</p>
                    <p className="text-[10px] opacity-80 leading-tight">Find affordable deals, attend meetups & save</p>
                  </button>
                </div>
              </div>

              {/* Finish Setup Button */}
              <button
                type="button"
                disabled={loading || uploadingAvatar || !firstName.trim() || !lastName.trim()}
                onClick={handleCompleteSetup}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Finalising Profile & Bonus...' : 'Finish Setup & Claim ₦500 Bonus 🎉'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ========================================================================= */}
      {/* ₦500 BONUS CELEBRATION MODAL                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showBonusCelebration && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-5">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-slate-900 border border-amber-400/40 rounded-3xl p-6 text-center max-w-sm w-full space-y-4 shadow-2xl relative overflow-hidden"
            >
              {/* Confetti sparkle background */}
              <div className="w-16 h-16 bg-amber-500/20 border border-amber-400/50 rounded-full flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/30">
                <Sparkles size={32} />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                  Account Verified
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Welcome Bonus Credited!</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Congratulations <strong>{firstName || 'Student'}</strong>! Your initial <strong>₦500 SkulCredits</strong> welcome gift has been added to your campus wallet.
                </p>
              </div>

              {/* Wallet Card */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-slate-950 text-left shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-amber-950">SkulBuy Campus Wallet</span>
                  <Wallet size={20} className="text-amber-950" />
                </div>
                <p className="text-3xl font-black">₦{bonusDetails?.balance.toLocaleString() || '500'}.00</p>
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-950/80 mt-2 pt-2 border-t border-amber-950/20">
                  <span>Campus: {selectedUni.short_name}</span>
                  <span>Ledger: #SIGNUP-500</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-[11px] text-gray-300 text-left flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>You can use this bonus toward purchases, delivery fees, or SkulBox daily savings plans!</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowBonusCelebration(false);
                  navigate('/');
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3.5 rounded-2xl shadow-md transition"
              >
                Start Exploring Campus Deals 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="px-5 py-3 text-center z-10 border-t border-white/5">
        <p className="text-[10px] text-gray-500">
          SkulBuy &copy; 2026. Empowering university students across Nigeria. Safe campus escrow trading protocol.
        </p>
      </footer>
    </div>
  );
};
