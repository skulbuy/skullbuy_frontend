import React, { useState, useEffect } from 'react';
import { X, School, MapPin, Users, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { University } from '../types';
import { NIGERIAN_UNIVERSITIES } from '../data/nigerianUniversities';

interface UniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (uni: University) => void;
}

export const UniversityModal: React.FC<UniversityModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { user, authFetch, refreshUser } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/universities')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setUniversities(data);
          } else {
            // Fallback to client-side database
            setUniversities(NIGERIAN_UNIVERSITIES as any);
          }
        })
        .catch(() => {
          setUniversities(NIGERIAN_UNIVERSITIES as any);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUni = user?.university || user?.campus || 'FUTMINNA';

  const filteredUnis = universities.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.short_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.city || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.state || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectUniversity = async (uni: University) => {
    if (user) {
      setSaving(true);
      try {
        await authFetch('/api/users/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ university: uni.short_name, campus: uni.short_name })
        });
        await refreshUser();
      } catch (err) {
        console.error('Error updating campus:', err);
      } finally {
        setSaving(false);
      }
    }
    if (onSelect) onSelect(uni);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col z-10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <School size={16} />
            </div>
            <div>
              <h3 className="font-black text-sm text-gray-900">Switch Campus Hub</h3>
              <p className="text-[10px] text-gray-500">Personalise your feed to your university</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search input */}
        <div className="my-3 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FUTMINNA, UNILAG, ABU, UI..."
            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 rounded-xl py-2 pl-9 pr-3 text-xs outline-none font-medium"
          />
        </div>

        {/* List of Universities */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-gray-50 no-scrollbar">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 text-xs gap-2">
              <Loader2 size={20} className="animate-spin text-amber-500" />
              <span>Loading campus list...</span>
            </div>
          ) : filteredUnis.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              <p>No universities found for "{search}".</p>
            </div>
          ) : (
            filteredUnis.map((uni) => {
              const isSelected = (currentUni || '').toUpperCase() === (uni.short_name || '').toUpperCase();
              return (
                <div
                  key={uni.id || uni.short_name}
                  onClick={() => !saving && handleSelectUniversity(uni)}
                  className={`pt-2.5 pb-2.5 px-3 rounded-2xl flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-amber-50 border border-amber-300 shadow-2xs'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex items-center justify-center font-black text-xs text-amber-700">
                      {uni.logo_url ? (
                        <img
                          src={uni.logo_url}
                          alt={uni.short_name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        uni.short_name.slice(0, 3)
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-gray-900 truncate">
                          {uni.short_name}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                        <span className="text-[9px] text-gray-400 font-medium">
                          {uni.type || 'Federal'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 truncate">{uni.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                        <MapPin size={10} className="shrink-0" />
                        <span className="truncate">{uni.city}, {uni.state}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected ? (
                    <CheckCircle2 size={18} className="text-amber-600 shrink-0 ml-2" />
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 mt-2 text-center">
          <p className="text-[10px] text-gray-400">
            Switching campus filters deals and joins you to your verified campus community.
          </p>
        </div>
      </div>
    </div>
  );
};
