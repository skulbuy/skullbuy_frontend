import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    password?: string;
    phone?: string;
    role?: string;
    matric_no?: string;
    department?: string;
    campus?: string;
    campus_area?: string;
    university?: string;
  }) => Promise<{ success: boolean; error?: string; token?: string; user?: User }>;
  sendOtp: (email: string) => Promise<{ success: boolean; error?: string; cooldownSeconds?: number }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  completeOnboarding: (data: any) => Promise<{ success: boolean; bonusAwarded?: number; user?: User; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeUser(data: any, fallbackEmail = ''): User {
  const isVerified = Boolean(data.is_verified || data.student_id_verified === 1 || data.student_id_verified === 'verified');
  return {
    id: data.id || data.user_id,
    email: data.email || fallbackEmail,
    full_name: data.full_name || data.name || 'Campus Student',
    username: data.username || undefined,
    role: data.role || 'buyer',
    campus: data.campus || data.school_name || 'FUT Minna',
    campus_name: data.campus || data.school_name || 'FUT Minna',
    campus_area: data.campus_area || undefined,
    university: data.university || data.school_name || 'FUT Minna',
    department: data.department || undefined,
    level_of_study: data.level_of_study || undefined,
    points: data.points ?? 100,
    wallet_balance: data.wallet_balance ?? 0,
    matric_no: data.matric_no || data.matric_number,
    phone: data.phone,
    is_verified: isVerified,
    student_id_verified: isVerified ? 'verified' : 'not_verified',
    profile_picture: data.avatar_url || data.profile_picture || undefined,
    has_onboarded: data.has_onboarded ?? true,
    created_at: data.created_at || new Date().toISOString(),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('skulbuy_token') || null);
  const [loading, setLoading] = useState(true);

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    const activeToken = token || localStorage.getItem('skulbuy_token');
    if (activeToken) {
      headers.set('Authorization', `Bearer ${activeToken}`);
    }
    return fetch(url, { ...options, headers });
  };

  const refreshUser = async () => {
    const activeToken = token || localStorage.getItem('skulbuy_token');
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      let res = await authFetch('/api/users/me');
      if (!res.ok) {
        res = await authFetch('/api/auth/me');
      }
      if (res.ok) {
        const data = await res.json();
        setUser(normalizeUser(data));
      } else {
        localStorage.removeItem('skulbuy_token');
        setToken(null);
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

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          username: email.trim(),
          password: password || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.detail || data.error || 'Invalid email or password' };
      }
      const tokenVal = data.access_token || data.token;
      localStorage.setItem('skulbuy_token', tokenVal);
      setToken(tokenVal);

      const u = data.user || data;
      setUser(normalizeUser(u, email));
      return { success: true };
    } catch {
      return { success: false, error: 'Network error occurred during login' };
    }
  };

  const register = async (formData: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    password?: string;
    phone?: string;
    role?: string;
    matric_no?: string;
    department?: string;
    campus?: string;
    campus_area?: string;
    university?: string;
  }) => {
    try {
      const payload = {
        email: formData.email.trim(),
        full_name:
          formData.full_name ||
          `${formData.first_name || ''} ${formData.last_name || ''}`.trim() ||
          'FUT Minna Student',
        password: formData.password || '',
        phone: formData.phone || undefined,
        matric_no: formData.matric_no || undefined,
        department: formData.department || undefined,
        campus_area: formData.campus_area || undefined,
        school_name: formData.university || formData.campus || 'FUT Minna',
        role:
          formData.role?.toLowerCase() === 'seller' || formData.role?.toLowerCase() === 'vendor'
            ? 'vendor'
            : 'buyer',
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.detail || data.error || 'Registration failed' };
      }

      const tokenVal = data.access_token || data.token;
      if (tokenVal) {
        localStorage.setItem('skulbuy_token', tokenVal);
        setToken(tokenVal);
      }

      const u = data.user || data;
      const userData = normalizeUser(u, payload.email);
      setUser(userData);
      return { success: true, token: tokenVal, user: userData };
    } catch {
      return { success: false, error: 'Network error occurred during registration' };
    }
  };

  const sendOtp = async (email: string) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.detail || data.error || 'Failed to send OTP code',
          cooldownSeconds: data.cooldownSeconds,
        };
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
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.detail || data.error || 'Invalid verification code' };
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
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.detail || data.error || 'Failed to complete onboarding' };
      }
      if (data.token) {
        localStorage.setItem('skulbuy_token', data.token);
        setToken(data.token);
      }
      if (data.user) {
        setUser(normalizeUser(data.user));
      } else {
        await refreshUser();
      }
      return { success: true, bonusAwarded: data.bonusAwarded, user: data.user ? normalizeUser(data.user) : undefined };
    } catch {
      return { success: false, error: 'Network error completing onboarding' };
    }
  };

  const logout = () => {
    localStorage.removeItem('skulbuy_token');
    setToken(null);
    setUser(null);
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
        refreshUser,
        authFetch,
        completeOnboarding,
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
