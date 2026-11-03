import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, Lock, AlertTriangle, HelpCircle, PhoneCall, Mail } from 'lucide-react';
import { Header } from '../components/Header';

export const SafetyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-2 sticky top-[95px] z-30">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 p-1">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-extrabold text-gray-900">FUTMX Safe Trade Guide</h1>
      </div>

      <div className="px-4 pt-4 space-y-4 text-xs">
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-emerald-950 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-emerald-600 shrink-0" />
            <h2 className="text-sm font-bold">Approved Campus Safe Meetup Zones</h2>
          </div>
          <p className="leading-relaxed">
            For maximum personal safety and anti-fraud protection, always arrange exchanges at these recommended public locations during daylight hours (8:00 AM – 5:30 PM):
          </p>
          <ul className="list-disc list-inside space-y-1 font-medium text-emerald-900 pl-1">
            <li><strong>Student Union Building (SUB):</strong> Outside the commercial concourse, Gidan Kwano.</li>
            <li><strong>University Main Library:</strong> Veranda / reception forecourt, Gidan Kwano.</li>
            <li><strong>Bosso Campus Main Gate:</strong> Near the campus security post.</li>
            <li><strong>Love Garden:</strong> Well-lit seating areas near central faculties.</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-3">
          <h3 className="font-extrabold text-sm text-gray-900">Golden Trading Rules for Students</h3>
          
          <div className="space-y-2.5 text-gray-700">
            <div>
              <p className="font-bold text-gray-900">1. Inspect Before Payment</p>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Always test electronic gadgets, laptops, and fans on the spot. Verify battery health, charging ports, and screen condition before transferring funds.
              </p>
            </div>

            <div>
              <p className="font-bold text-gray-900">2. Beware of "Advance Booking" Demands</p>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Never send "commitment fees" or "transport fare" to hold an item. Legitimate student sellers do not demand payment prior to physical handover.
              </p>
            </div>

            <div>
              <p className="font-bold text-gray-900">3. Check Student ID Badges</p>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Prioritize sellers carrying the <strong>Verified Student</strong> badge, which indicates their institutional registration has been confirmed.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[11px] text-amber-950 flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Need Immediate Campus Assistance?</p>
            <p className="mt-0.5">Contact Campus Safety Team at: <strong>security@skulbuy.futminna.ng</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-2 sticky top-[95px] z-30">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 p-1">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-extrabold text-gray-900">Privacy Notice (NDPA 2023)</h1>
      </div>

      <div className="px-4 pt-4 space-y-4 text-xs text-gray-700 leading-relaxed">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-3">
          <p className="text-[10px] uppercase font-bold text-gray-400">Compliance Notice</p>
          <h2 className="text-base font-extrabold text-gray-900">Nigeria Data Protection Act 2023 Compliance</h2>
          <p>
            SkulBuy respects the privacy of students and users across Federal University of Technology, Minna. This privacy notice outlines our lawful basis for data collection, storage, and processing.
          </p>

          <h3 className="font-bold text-xs text-gray-900 pt-2 border-t border-gray-100">1. Information We Collect</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-[11px]">
            <li>Full Name, Institutional Email, and Phone Number.</li>
            <li>Matriculation Number and Department (exclusively for optional student verification).</li>
            <li>Images of Student ID cards (stored in protected staff-only storage and purged after audit cycles).</li>
            <li>Marketplace listing content and in-app communications.</li>
          </ul>

          <h3 className="font-bold text-xs text-gray-900 pt-2 border-t border-gray-100">2. Purpose of Processing</h3>
          <p className="text-gray-600 text-[11px]">
            Your data is used solely to authenticate campus identity, prevent bad actors from entering student markets, and coordinate monthly SkulBox grocery fulfillments. We do not sell or lease student data to third-party ad networks.
          </p>

          <h3 className="font-bold text-xs text-gray-900 pt-2 border-t border-gray-100">3. Your Data Subject Rights</h3>
          <p className="text-gray-600 text-[11px]">
            Under the NDPA 2023, you have the right to request access, rectification, or deletion of your account and uploaded verification credentials at any time by contacting our Data Protection Officer at privacy@skulbuy.futminna.ng.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-2 sticky top-[95px] z-30">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 p-1">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-extrabold text-gray-900">Terms of Service & Rules</h1>
      </div>

      <div className="px-4 pt-4 space-y-4 text-xs text-gray-700 leading-relaxed">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-3">
          <h2 className="text-base font-extrabold text-gray-900">Campus Marketplace & SkulBox Terms</h2>
          
          <h3 className="font-bold text-xs text-gray-900 pt-1">1. Marketplace Obligations</h3>
          <p className="text-gray-600 text-[11px]">
            Sellers are strictly responsible for the accuracy and ownership of items listed on SkulBuy. Listing prohibited items (stolen goods, counterfeit electronics, weapons, narcotics) will result in immediate permanent expulsion and report to FUTMX Student Affairs.
          </p>

          <h3 className="font-bold text-xs text-gray-900 pt-2 border-t border-gray-100">2. SkulBox Cooperative Structure (Section 3.1 & 7.1)</h3>
          <p className="text-gray-600 text-[11px]">
            SkulBox is a student forward-procurement grocery cooperative. Contributions are dedicated specifically to bulk wholesale food purchases delivered per the published monthly cycle. SkulBox does not operate as a licensed banking deposit institution, and savings cannot be withdrawn for unrelated purposes after the 25th of the active cycle.
          </p>

          <h3 className="font-bold text-xs text-gray-900 pt-2 border-t border-gray-100">3. Points & Rewards Policy</h3>
          <p className="text-gray-600 text-[11px]">
            SkulBox Points are promotional loyalty credits. They do not represent cash or legal tender and may only be redeemed for discounts on eligible SkulBox packages or ad boosts within the platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export const FAQPage = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      q: 'How does the SkulBox 25th deadline work?',
      a: 'The order cycle closes strictly at 23:59 WAT on the 25th of every month. This allows our operations team to procure wholesale supplies directly from millers and farmers so boxes are ready for hostel delivery during the first week of the new month.'
    },
    {
      q: 'What if I miss a daily contribution on my SkulBox plan?',
      a: 'There are no punitive penalties. You have a 3-day grace period to catch up on missed daily amounts before the 25th deadline.'
    },
    {
      q: 'How do I get the Verified Student badge?',
      a: 'Go to your Profile tab, tap "Verify ID", enter your matriculation number, faculty, and submit your FUTMX ID card. Campus moderators review and approve submissions within 24 hours.'
    },
    {
      q: 'Can non-FUTMX students use the platform?',
      a: 'The pilot launch is exclusively optimized for FUT Minna (Gidan Kwano and Bosso campuses). Expansion to neighboring institutions will roll out in subsequent phases.'
    }
  ];

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-2 sticky top-[95px] z-30">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 p-1">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-extrabold text-gray-900">Frequently Asked Questions</h1>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-1.5">
            <h3 className="font-bold text-xs text-gray-900">{f.q}</h3>
            <p className="text-[11px] text-gray-600 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DisputesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-2 sticky top-[95px] z-30">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 p-1">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-extrabold text-gray-900">Dispute & Refund Policy</h1>
      </div>

      <div className="px-4 pt-4 space-y-4 text-xs text-gray-700 leading-relaxed">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-3">
          <h2 className="text-base font-extrabold text-gray-900">Resolving Trades & Cancellations</h2>

          <h3 className="font-bold text-xs text-gray-900 pt-1">1. Marketplace Inspection Disagreements</h3>
          <p className="text-gray-600 text-[11px]">
            Because marketplace exchanges require in-person physical inspection at FUTMX safe zones, buyers should decline any item that does not match the listing condition prior to payment. If an issue arises after trade, use the "Report" button on the listing.
          </p>

          <h3 className="font-bold text-xs text-gray-900 pt-2 border-t border-gray-100">2. SkulBox Cancellation & Refunds</h3>
          <p className="text-gray-600 text-[11px]">
            Contributions toward an active cycle can be cancelled and refunded with 24 hours notice prior to the 25th of that cycle month. Once the cycle closes on the 25th, wholesale supply orders are locked and cannot be cancelled.
          </p>

          <h3 className="font-bold text-xs text-gray-900 pt-2 border-t border-gray-100">3. Support Contact</h3>
          <p className="text-gray-600 text-[11px]">
            For escalation, contact the student mediation coordinator at disputes@skulbuy.futminna.ng.
          </p>
        </div>
      </div>
    </div>
  );
};
