import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, Gift, Sparkles, Trophy, Calendar, ArrowRight, X, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DailyStreakStatus } from '../types';

interface DailyStreakCardProps {
  onClaimSuccess?: () => void;
  compact?: boolean;
}

export const DailyStreakCard: React.FC<DailyStreakCardProps> = ({ onClaimSuccess, compact = false }) => {
  const { user, authFetch, refreshUser } = useAuth();
  const [status, setStatus] = useState<DailyStreakStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ amount: number; streak: number; balance: number } | null>(null);

  const fetchStatus = async () => {
    if (!user) return;
    try {
      const res = await authFetch('/api/daily-rewards/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Error fetching streak status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user]);

  const handleClaim = async () => {
    if (!user) return;
    setClaiming(true);
    try {
      const res = await authFetch('/api/daily-rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        if (!data.alreadyClaimed) {
          setCelebrationData({
            amount: data.reward_amount || 10,
            streak: data.streak || 1,
            balance: data.wallet_balance || (user.wallet_balance + 10),
          });
          setShowCelebration(true);
        }
        await refreshUser();
        await fetchStatus();
        if (onClaimSuccess) onClaimSuccess();
      }
    } catch (err) {
      console.error('Error claiming daily reward:', err);
    } finally {
      setClaiming(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/70 rounded-3xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm shrink-0">
            <Flame size={20} className="fill-amber-200" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-gray-900">Daily ₦10 SkulCredits Streak</h4>
            <p className="text-[11px] text-gray-600">Sign in every day to claim ₦10 SkulCredits reward.</p>
          </div>
        </div>
        <a
          href="/onboarding"
          className="bg-amber-500 text-white font-black text-xs px-3 py-2 rounded-xl shadow-xs shrink-0 active:scale-95 transition"
        >
          Join
        </a>
      </div>
    );
  }

  const currentStreak = status?.streak || user.daily_streak || 0;
  const longestStreak = Math.max(status?.longest_streak || 0, user.longest_streak || 0, currentStreak);
  const isClaimedToday = status?.todayClaimed || false;

  // Day names for the visual 7-day calendar track
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon
  const adjustedTodayIndex = todayDayIndex === 0 ? 6 : todayDayIndex - 1; // 0-6 where Mon=0, Sun=6

  return (
    <>
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-4 shadow-sm border border-amber-400/40 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black/20 backdrop-blur-xs flex items-center justify-center text-amber-200 border border-white/20 shadow-xs shrink-0">
              <Flame size={22} className="fill-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-full text-amber-200 border border-white/10">
                  Daily Check-in
                </span>
                <span className="text-[10px] text-amber-100 font-bold">
                  +₦10 / Day
                </span>
              </div>
              <h3 className="text-base font-black tracking-tight mt-0.5">
                {currentStreak > 0 ? `${currentStreak}-Day Active Streak` : 'Start Your Daily Streak'}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-amber-100 block font-medium">Best Record</span>
            <span className="text-xs font-black text-white bg-black/20 px-2 py-0.5 rounded-lg border border-white/10 inline-block mt-0.5">
              🏆 {longestStreak} days
            </span>
          </div>
        </div>

        {/* 7-Day Calendar Streak Tracker */}
        <div className="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10 mb-3">
          <div className="flex justify-between items-center text-center">
            {daysOfWeek.map((day, idx) => {
              const isPastDay = idx < adjustedTodayIndex;
              const isToday = idx === adjustedTodayIndex;
              const isChecked = isPastDay || (isToday && isClaimedToday);

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-amber-200">{day}</span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-amber-300 text-amber-950 font-black shadow-xs ring-2 ring-white/40'
                        : isToday
                        ? 'bg-white/20 text-white font-black border border-white/60 animate-pulse'
                        : 'bg-white/10 text-white/50 font-semibold'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 size={15} className="stroke-[3]" />
                    ) : (
                      <span className="text-[10px]">₦10</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button & Status Message */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-amber-100 font-medium">
            {isClaimedToday
              ? '✅ ₦10 claimed today! Return tomorrow to keep your streak.'
              : 'Claim your ₦10 SkulCredits daily allowance now!'}
          </p>

          <button
            onClick={handleClaim}
            disabled={isClaimedToday || claiming}
            className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 shrink-0 transition active:scale-95 ${
              isClaimedToday
                ? 'bg-white/20 text-white cursor-default border border-white/20'
                : 'bg-white hover:bg-amber-50 text-amber-700 shadow-md shadow-black/10'
            }`}
          >
            {claiming ? (
              <span>Claiming...</span>
            ) : isClaimedToday ? (
              <>
                <CheckCircle2 size={13} />
                <span>Claimed</span>
              </>
            ) : (
              <>
                <Gift size={13} className="text-amber-600" />
                <span>Claim ₦10</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Celebratory Claim Popup Modal */}
      {showCelebration && celebrationData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              <Sparkles size={32} className="animate-spin-slow" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Streak Reward Credited
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-2">
                +₦{celebrationData.amount} SkulCredits!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                You’ve kept your daily campus streak alive for <strong>{celebrationData.streak} consecutive days</strong>.
              </p>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Reward Credited:</span>
                <span className="font-black text-emerald-600">+₦10 SkulCredits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">New Wallet Balance:</span>
                <span className="font-black text-gray-900">₦{Number(celebrationData.balance).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Daily Streak:</span>
                <span className="font-black text-amber-600">🔥 {celebrationData.streak} Days</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400">
              Check your transaction history in Account to see this credit. Return tomorrow to earn another ₦10!
            </p>

            <button
              onClick={() => setShowCelebration(false)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-black text-xs py-3 rounded-xl shadow-sm active:scale-95 transition"
            >
              Awesome, Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};
