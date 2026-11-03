import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
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
  );
}
