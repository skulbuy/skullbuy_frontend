import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, Users, CheckCircle2, XCircle, AlertTriangle, 
  Package, FileText, ArrowLeft, RefreshCw, Eye, ShieldCheck, Clock 
} from 'lucide-react';
import { AdminMetrics } from '../types';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

export const AdminPage = () => {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'metrics' | 'verifications' | 'reports' | 'cycles' | 'audit'>('metrics');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = () => {
    if (!user || user.role !== 'admin') return;

    setLoading(true);
    Promise.all([
      authFetch('/api/admin/metrics').then(r => r.json()),
      authFetch('/api/admin/verifications').then(r => r.json()),
      authFetch('/api/admin/reports').then(r => r.json()),
      authFetch('/api/skulbox/cycles').then(r => r.json()),
      authFetch('/api/admin/audit-logs').then(r => r.json())
    ]).then(([m, v, r, c, a]) => {
      setMetrics(m);
      setVerifications(Array.isArray(v) ? v : []);
      setReports(Array.isArray(r) ? r : []);
      setCycles(Array.isArray(c) ? c : []);
      setAuditLogs(Array.isArray(a) ? a : []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  // Handle access gate (SEC-01, PUB-01)
  if (!user || user.role !== 'admin') {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-6 text-center my-auto max-w-sm mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-3 text-red-600">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-base font-extrabold text-gray-900">Access Denied (403)</h2>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Administrative operations are restricted to verified FUTMX campus personnel and moderators.
          </p>
          <div className="mt-5 space-y-2">
            <Link
              to="/profile"
              className="block w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition"
            >
              Sign in as Campus Admin
            </Link>
            <Link
              to="/"
              className="block bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl transition"
            >
              Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleVerificationAction = async (userId: number, action: 'approve' | 'reject') => {
    try {
      const res = await authFetch(`/api/admin/verifications/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch {
      alert('Action failed');
    }
  };

  const handleReportAction = async (reportId: number, listingId: number, action: 'suspend_listing' | 'dismiss') => {
    try {
      const res = await authFetch(`/api/admin/reports/${reportId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, listing_id: listingId })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch {
      alert('Action failed');
    }
  };

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />

      {/* Top Admin Bar */}
      <div className="bg-red-900 text-white px-4 py-3 sticky top-[95px] z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-red-300" />
          <div>
            <h1 className="text-xs font-black uppercase tracking-wider">FUTMX Staff & Admin Portal</h1>
            <p className="text-[10px] text-red-200">Moderation, Student Verifications & SkulBox Cycles</p>
          </div>
        </div>
        <button onClick={fetchAdminData} className="p-1.5 hover:bg-red-800 rounded-lg text-red-200 transition">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 flex gap-1 text-xs font-bold overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition ${
            activeTab === 'metrics' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Metrics
        </button>
        <button
          onClick={() => setActiveTab('verifications')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition flex items-center gap-1 ${
            activeTab === 'verifications' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>ID Verifications</span>
          {verifications.length > 0 && (
            <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
              {verifications.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition flex items-center gap-1 ${
            activeTab === 'reports' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>Reports</span>
          {reports.filter(r => r.status === 'pending').length > 0 && (
            <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
              {reports.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('cycles')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition ${
            activeTab === 'cycles' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          SkulBox Cycles
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition ${
            activeTab === 'audit' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Audit Log
        </button>
      </div>

      <div className="px-4 pt-4">
        {/* TAB 1: METRICS (Section 7.2, Phase 7) */}
        {activeTab === 'metrics' && metrics && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-extrabold text-xs uppercase text-gray-400">Campus Marketplace Health</h3>
                <span className="text-[10px] text-gray-400">Time: {metrics.reportingDateWAT}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Total Students</p>
                  <p className="text-xl font-black text-gray-900 mt-0.5">{metrics.totalUsers}</p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">
                    {metrics.verifiedUsers} Verified ID Badges
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Active Listings</p>
                  <p className="text-xl font-black text-gray-900 mt-0.5">{metrics.activeListings}</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">
                    {metrics.soldListings} Completed Trades
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-100">SkulBox Financials</p>
              <h3 className="text-2xl font-black mt-1">₦{Number(metrics.totalSkulboxContributions).toLocaleString()}</h3>
              <p className="text-xs text-amber-50 mt-1">
                Total savings collected across {metrics.totalSkulboxSubscribers} student subscriptions.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFICATION QUEUE (Section 7.2, AUTH-02) */}
        {activeTab === 'verifications' && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-gray-900">Pending Student ID Submissions ({verifications.length})</h3>
            {verifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-800">Verification Queue Clear</p>
                <p className="text-[11px] text-gray-400 mt-0.5">No student ID cards currently waiting for approval.</p>
              </div>
            ) : (
              verifications.map((v) => (
                <div key={v.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{v.full_name}</p>
                      <p className="text-gray-500 text-[11px]">{v.email}</p>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded uppercase">
                      Pending
                    </span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-1">
                    <p>Matric No: <strong className="font-mono text-gray-900">{v.matric_no}</strong></p>
                    <p>Department: <strong className="text-gray-900">{v.department}</strong></p>
                    <p>Document: <span className="text-amber-600 font-semibold">{v.id_card_image}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleVerificationAction(v.id, 'reject')}
                      className="py-2 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerificationAction(v.id, 'approve')}
                      className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition"
                    >
                      Approve (+50 pts)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: REPORTS (Section 7.2) */}
        {activeTab === 'reports' && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-gray-900">Listing Moderation Reports ({reports.length})</h3>
            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-800">No Reports</p>
              </div>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-2.5 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {r.reason}
                    </span>
                    <span className="text-[10px] text-gray-400">Status: {r.status}</span>
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">Listing: {r.listing_title}</p>
                    <p className="text-gray-500 text-[11px]">Reported by: {r.reporter_name}</p>
                    {r.details && <p className="text-gray-700 mt-1 italic bg-gray-50 p-2 rounded-lg">"{r.details}"</p>}
                  </div>

                  {r.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleReportAction(r.id, r.listing_id, 'dismiss')}
                        className="py-2 rounded-xl border border-gray-200 text-gray-700 font-bold"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleReportAction(r.id, r.listing_id, 'suspend_listing')}
                        className="py-2 rounded-xl bg-red-600 text-white font-bold"
                      >
                        Suspend Listing
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: SKULBOX CYCLES (Section 7.1) */}
        {activeTab === 'cycles' && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-gray-900">Managed SkulBox Cycles</h3>
            {cycles.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <p className="font-extrabold text-gray-900 text-sm">{c.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    c.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <div className="space-y-0.5 text-gray-600 text-[11px]">
                  <p>Deadline: <strong>{c.close_date} (WAT)</strong></p>
                  <p>Delivery: <strong>{c.delivery_window}</strong></p>
                  <p className="text-gray-400 mt-1">{c.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: AUDIT LOGS (Section 7.2, Appendix A) */}
        {activeTab === 'audit' && (
          <div className="space-y-2">
            <h3 className="font-extrabold text-xs text-gray-900">Security & Operational Audit Trail</h3>
            <div className="bg-white rounded-2xl p-3 border border-gray-100 divide-y divide-gray-50 text-[11px]">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5">
                  <div className="flex items-center justify-between text-gray-400 text-[10px]">
                    <span className="font-mono font-bold text-gray-700">{log.action}</span>
                    <span>{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-800 mt-0.5">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
