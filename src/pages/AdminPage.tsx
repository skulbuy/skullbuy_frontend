import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, Users, CheckCircle2, XCircle, AlertTriangle, 
  Package, FileText, ArrowLeft, RefreshCw, Eye, ShieldCheck, Clock,
  School, Plus, Trash2, MapPin, Check
} from 'lucide-react';
import { AdminMetrics, University } from '../types';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

export const AdminPage = () => {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'metrics' | 'verifications' | 'reports' | 'universities' | 'cycles' | 'audit'>('metrics');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  // New University Form State
  const [showAddUniModal, setShowAddUniModal] = useState(false);
  const [newUniName, setNewUniName] = useState('');
  const [newUniShort, setNewUniShort] = useState('');
  const [newUniCity, setNewUniCity] = useState('');
  const [newUniState, setNewUniState] = useState('');
  const [newUniType, setNewUniType] = useState('Federal');
  const [newUniStudents, setNewUniStudents] = useState('30000');
  const [newUniCampuses, setNewUniCampuses] = useState('Main Campus, Mini Campus');
  const [addingUni, setAddingUni] = useState(false);
  const [addUniError, setAddUniError] = useState('');

  const fetchAdminData = () => {
    if (!user || user.role !== 'admin') return;

    setLoading(true);
    Promise.all([
      authFetch('/api/admin/metrics').then(r => r.json()).catch(() => null),
      authFetch('/api/admin/verifications').then(r => r.json()).catch(() => []),
      authFetch('/api/admin/reports').then(r => r.json()).catch(() => []),
      authFetch('/api/skulbox/cycles').then(r => r.json()).catch(() => []),
      authFetch('/api/admin/audit-logs').then(r => r.json()).catch(() => []),
      fetch('/api/universities').then(r => r.json()).catch(() => [])
    ]).then(([m, v, r, c, a, u]) => {
      if (m) setMetrics(m);
      setVerifications(Array.isArray(v) ? v : []);
      setReports(Array.isArray(r) ? r : []);
      setCycles(Array.isArray(c) ? c : []);
      setAuditLogs(Array.isArray(a) ? a : []);
      setUniversities(Array.isArray(u) ? u : []);
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
            Administrative operations are restricted to verified campus staff and platform moderators.
          </p>
          <div className="mt-5 space-y-2">
            <Link
              to="/profile"
              className="block w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition"
            >
              Sign in with Master Admin (skuladmin)
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

  const handleVerificationAction = async (userId: string | number, action: 'approve' | 'reject') => {
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

  const handleReportAction = async (reportId: string | number, listingId: string | number, action: 'suspend_listing' | 'dismiss') => {
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

  const handleCreateUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUniError('');
    setAddingUni(true);

    try {
      const campusesList = newUniCampuses
        .split(',')
        .map(c => c.trim())
        .filter(Boolean)
        .map(c => ({
          name: c,
          campus_type: 'Campus Branch',
          city: newUniCity,
          state: newUniState
        }));

      const res = await authFetch('/api/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUniName,
          short_name: newUniShort,
          city: newUniCity,
          state: newUniState,
          type: newUniType,
          student_count: parseInt(newUniStudents) || 20000,
          campuses: campusesList
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAddUniError(data.detail || data.error || 'Failed to create university.');
      } else {
        setShowAddUniModal(false);
        setNewUniName('');
        setNewUniShort('');
        setNewUniCity('');
        setNewUniState('');
        fetchAdminData();
      }
    } catch {
      setAddUniError('Network error registering university.');
    } finally {
      setAddingUni(false);
    }
  };

  const handleDeleteUniversity = async (uniId: string | number) => {
    if (!window.confirm('Are you sure you want to delete this campus ecosystem?')) return;
    try {
      const res = await authFetch(`/api/universities/${uniId}`, { method: 'DELETE' });
      if (res.ok) fetchAdminData();
    } catch {
      alert('Failed to delete university.');
    }
  };

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50">
      <Header />

      {/* Top Admin Bar */}
      <div className="bg-red-950 text-white px-4 py-3 sticky top-14 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-red-400" />
          <div>
            <h1 className="text-xs font-black uppercase tracking-wider">SkulBuy Staff & Master Admin Portal</h1>
            <p className="text-[10px] text-red-200">Logged in as {user.username || user.email} (Role: {user.role})</p>
          </div>
        </div>
        <button onClick={fetchAdminData} className="p-1.5 hover:bg-red-900 rounded-lg text-red-200 transition cursor-pointer">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 flex gap-1 text-xs font-bold overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition cursor-pointer ${
            activeTab === 'metrics' ? 'bg-red-50 text-red-700 font-black' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Platform Metrics
        </button>
        <button
          onClick={() => setActiveTab('universities')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
            activeTab === 'universities' ? 'bg-red-50 text-red-700 font-black' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <School size={13} />
          <span>Universities & Campuses ({universities.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('verifications')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
            activeTab === 'verifications' ? 'bg-red-50 text-red-700 font-black' : 'text-gray-500 hover:text-gray-900'
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
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
            activeTab === 'reports' ? 'bg-red-50 text-red-700 font-black' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>Moderation Reports</span>
          {reports.filter(r => r.status === 'pending').length > 0 && (
            <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
              {reports.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('cycles')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition cursor-pointer ${
            activeTab === 'cycles' ? 'bg-red-50 text-red-700 font-black' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          SkulBox Cycles
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition cursor-pointer ${
            activeTab === 'audit' ? 'bg-red-50 text-red-700 font-black' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Audit Log
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-4">
        {/* TAB 1: METRICS */}
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-xs uppercase text-gray-400">Platform KPIs & Live Statistics</h3>
                <span className="text-[10px] text-gray-400">Auto-calculated</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Total Users</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{metrics?.totalUsers ?? metrics?.total_users ?? 0}</p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">
                    {metrics?.verifiedUsers ?? metrics?.verified_users ?? 0} Verified Students
                  </p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Active Listings</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{metrics?.activeListings ?? metrics?.total_listings ?? 0}</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">Live in marketplace</p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Pending Reports</p>
                  <p className="text-2xl font-black text-amber-600 mt-0.5">{metrics?.pending_reports ?? reports.filter(r => r.status === 'pending').length}</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">Awaiting review</p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Total Escrow GMV</p>
                  <p className="text-2xl font-black text-emerald-700 mt-0.5">
                    ₦{(metrics?.total_gmv ?? metrics?.totalSkulboxContributions ?? 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">Protected trades</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Active Campus Networks</p>
                <h3 className="text-2xl font-black mt-0.5">{universities.length} Nigerian Universities Registered</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Students can switch between universities from the top app bar to filter deals, join local communities, and trade safely.
                </p>
              </div>
              <button
                onClick={() => { setActiveTab('universities'); setShowAddUniModal(true); }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition shadow-sm shrink-0 cursor-pointer"
              >
                + Add University
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: UNIVERSITIES & CAMPUSES MANAGEMENT */}
        {activeTab === 'universities' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">Configured Nigerian Universities & Campus Hubs</h3>
                <p className="text-xs text-gray-500">Manage institution codes, campuses, and official student hubs.</p>
              </div>
              <button
                onClick={() => setShowAddUniModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Plus size={15} />
                <span>Register New University</span>
              </button>
            </div>

            <div className="grid gap-3">
              {universities.map((uni) => (
                <div key={uni.id || uni.short_name} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 font-black text-sm text-amber-700 overflow-hidden">
                      {uni.logo_url ? (
                        <img src={uni.logo_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        uni.short_name.slice(0, 3)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-gray-900">{uni.short_name}</span>
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                          {uni.type || 'Federal'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {uni.id || uni.short_name}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{uni.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                        <MapPin size={11} className="text-gray-400" />
                        <span>{uni.city}, {uni.state}</span>
                        <span>•</span>
                        <span>{(uni.student_count || 25000).toLocaleString()} student capacity</span>
                      </p>

                      {/* Campuses Sub-list */}
                      {uni.campuses && uni.campuses.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {uni.campuses.map((c: any, i) => (
                            <span key={i} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-md font-medium">
                              📍 {typeof c === 'string' ? c : (c.name || JSON.stringify(c))}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {uni.id && (
                      <button
                        onClick={() => handleDeleteUniversity(uni.id!)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete University"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VERIFICATION QUEUE */}
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
                      <p className="font-bold text-sm text-gray-900">{v.full_name || v.name}</p>
                      <p className="text-gray-500 text-[11px]">{v.email}</p>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded uppercase">
                      Pending
                    </span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-1">
                    <p>Matric No: <strong className="font-mono text-gray-900">{v.matric_no || v.matric_number}</strong></p>
                    <p>Department: <strong className="text-gray-900">{v.department || 'Not specified'}</strong></p>
                    <p>Campus: <strong className="text-gray-900">{v.university || v.school_name || 'FUT Minna'}</strong></p>
                    {v.id_card_image && (
                      <div className="mt-2">
                        <p className="text-[10px] text-gray-500 font-bold mb-1">ID Card Preview:</p>
                        <img src={v.id_card_image} alt="ID Document" className="max-h-40 rounded-lg border border-gray-200 object-contain bg-white" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleVerificationAction(v.id, 'reject')}
                      className="py-2 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerificationAction(v.id, 'approve')}
                      className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer"
                    >
                      Approve (+50 pts)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: REPORTS */}
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
                    <p className="font-bold text-gray-900">Listing: {r.listing_title || r.product_id}</p>
                    <p className="text-gray-500 text-[11px]">Reported by: {r.reporter_name || 'Student'}</p>
                    {r.details && <p className="text-gray-700 mt-1 italic bg-gray-50 p-2 rounded-lg">"{r.details}"</p>}
                  </div>

                  {r.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleReportAction(r.id, r.listing_id || r.product_id, 'dismiss')}
                        className="py-2 rounded-xl border border-gray-200 text-gray-700 font-bold cursor-pointer hover:bg-gray-50"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleReportAction(r.id, r.listing_id || r.product_id, 'suspend_listing')}
                        className="py-2 rounded-xl bg-red-600 text-white font-bold cursor-pointer hover:bg-red-700"
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

        {/* TAB 5: SKULBOX CYCLES */}
        {activeTab === 'cycles' && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-gray-900">Managed SkulBox Savings Cycles</h3>
            {cycles.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <p className="font-extrabold text-gray-900 text-sm">{c.name || c.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    c.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <div className="space-y-0.5 text-gray-600 text-[11px]">
                  <p>Deadline: <strong>{c.close_date || c.lock_date} (WAT)</strong></p>
                  <p>Delivery: <strong>{c.delivery_window || c.delivery_date}</strong></p>
                  <p>Pickup Hub: <strong>{c.pickup_location || 'Campus Hub'}</strong></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-2">
            <h3 className="font-extrabold text-xs text-gray-900">Security & Operational Audit Trail</h3>
            <div className="bg-white rounded-2xl p-3 border border-gray-100 divide-y divide-gray-50 text-[11px]">
              {auditLogs.length === 0 ? (
                <p className="text-gray-400 py-4 text-center">No audit logs recorded yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="py-2.5">
                    <div className="flex items-center justify-between text-gray-400 text-[10px]">
                      <span className="font-mono font-bold text-gray-700">{log.action}</span>
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-800 mt-0.5">{log.details || log.reason || JSON.stringify(log.new_value)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Register New University Modal */}
      {showAddUniModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <h3 className="font-black text-base text-gray-900 mb-1">Register New University Ecosystem</h3>
            <p className="text-xs text-gray-500 mb-4">Adds a new campus to the switchable university directory and creates an official student community hub.</p>

            {addUniError && (
              <div className="bg-red-50 text-red-600 p-2.5 rounded-xl text-xs mb-3 border border-red-200">
                {addUniError}
              </div>
            )}

            <form onSubmit={handleCreateUniversity} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full University Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Port Harcourt"
                  value={newUniName}
                  onChange={(e) => setNewUniName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Short Code / Acronym *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UNIPORT"
                    value={newUniShort}
                    onChange={(e) => setNewUniShort(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Institution Type</label>
                  <select
                    value={newUniType}
                    onChange={(e) => setNewUniType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none font-medium"
                  >
                    <option value="Federal">Federal</option>
                    <option value="State">State</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Port Harcourt"
                    value={newUniCity}
                    onChange={(e) => setNewUniCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rivers State"
                    value={newUniState}
                    onChange={(e) => setNewUniState(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Campus Branches (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Abuja Park, Choba Park, Delta Park"
                  value={newUniCampuses}
                  onChange={(e) => setNewUniCampuses(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUniModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingUni}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black transition cursor-pointer"
                >
                  {addingUni ? 'Registering...' : 'Save University'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
