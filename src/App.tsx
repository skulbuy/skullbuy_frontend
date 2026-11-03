import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { SellPage } from './pages/SellPage';
import { SkulBoxPage } from './pages/SkulBoxPage';
import { ProfilePage } from './pages/ProfilePage';
import { MessagesPage } from './pages/MessagesPage';
import { ChatDetailPage } from './pages/ChatDetailPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { CommunityDetailPage } from './pages/CommunityDetailPage';
import { AdminPage } from './pages/AdminPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { MeetupsPage } from './pages/MeetupsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SkullyChatbot } from './components/SkullyChatbot';
import { SafetyPage, PrivacyPage, TermsPage, FAQPage, DisputesPage } from './pages/LegalPages';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error in React tree:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-black">
              !
            </div>
            <h3 className="font-black text-sm text-gray-900">Something went wrong</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
              An unexpected render issue occurred. Your data and session are safe.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('skulbuy_token');
                  window.location.href = '/profile';
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2 rounded-xl transition cursor-pointer"
              >
                Clear Session & Re-login
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50/60 flex flex-col selection:bg-amber-500 selection:text-white">
            <div className="w-full min-h-screen flex flex-col">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/listing/:id" element={<ListingDetailPage />} />
                <Route path="/checkout/:listingId" element={<CheckoutPage />} />
                <Route path="/sell" element={<SellPage />} />
                <Route path="/skulbox" element={<SkulBoxPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/messages/:id" element={<ChatDetailPage />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/communities/:id" element={<CommunityDetailPage />} />
                <Route path="/meetups" element={<MeetupsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/safety" element={<SafetyPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/disputes" element={<DisputesPage />} />
              </Routes>
              <SkullyChatbot />
              <BottomNav />
            </div>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
