import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { full_name?: string; first_name?: string; last_name?: string; email: string; password?: string; phone?: string; role?: string; matric_no?: string; department?: string; campus?: string; campus_area?: string; university?: string }) => Promise<{ success: boolean; error?: string; token?: string; user?: User }>;
  sendOtp: (email: string) => Promise<{ success: boolean; error?: string; cooldownSeconds?: number }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: number) => Promise<void>;
  refreshUser: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  completeOnboarding: (data: any) => Promise<{ success: boolean; bonusAwarded?: number; user?: User; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('skulbuy_token') || '2'); // Default to Amina (Verified Seller)
  const [loading, setLoading] = useState(true);

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    const activeToken = token || localStorage.getItem('skulbuy_token');
    if (activeToken) {
      headers.set('Authorization', `Bearer ${activeToken}`);
      headers.set('x-user-id', activeToken);
    }
    return fetch(url, { ...options, headers });
  };

  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await authFetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem('skulbuy_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error occurred during login' };
    }
  };

  const register = async (formData: { full_name?: string; first_name?: string; last_name?: string; email: string; password?: string; phone?: string; role?: string; matric_no?: string; department?: string; campus?: string; campus_area?: string; university?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      localStorage.setItem('skulbuy_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, token: data.token, user: data.user };
    } catch {
      return { success: false, error: 'Network error occurred during registration' };
    }
  };

  const sendOtp = async (email: string) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to send OTP code', cooldownSeconds: data.cooldownSeconds };
      }
      return { success: true, cooldownSeconds: data.cooldownSeconds || 60 };
    } catch {
      return { success: false, error: 'Network error requesting verification code' };
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid verification code' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Network error verifying code' };
    }
  };

  const completeOnboarding = async (formData: any) => {
    try {
      const res = await authFetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to complete onboarding' };
      }
      if (data.token) {
        localStorage.setItem('skulbuy_token', data.token);
        setToken(data.token);
      }
      if (data.user) {
        setUser(data.user);
      } else {
        await refreshUser();
      }
      return { success: true, bonusAwarded: data.bonusAwarded, user: data.user };
    } catch {
      return { success: false, error: 'Network error completing onboarding' };
    }
  };

  const logout = () => {
    localStorage.removeItem('skulbuy_token');
    setToken(null);
    setUser(null);
  };

  const switchUser = async (userId: number) => {
    localStorage.setItem('skulbuy_token', String(userId));
    setToken(String(userId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        sendOtp,
        verifyOtp,
        logout,
        switchUser,
        refreshUser,
        authFetch,
        completeOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
