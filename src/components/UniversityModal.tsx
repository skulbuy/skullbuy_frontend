import React, { useState, useEffect } from 'react';
import { X, School, MapPin, Users, CheckCircle2, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { University } from '../types';

interface UniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (uni: University) => void;
}

export const UniversityModal: React.FC<UniversityModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { user, authFetch, refreshUser } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/universities')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setUniversities(data);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUni = user?.university || user?.campus || 'FUTMINNA';

  const filteredUnis = universities.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.short_name.toLowerCase().includes(search.toLowerCase()) ||
    u.city.toLowerCase().includes(search.toLowerCase()) ||
    u.state.toLowerCase().includes(search.toLowerCase())
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <School size={16} />
            </div>
            <div>
              <h3 className="font-black text-sm text-gray-900">Select Your University</h3>
              <p className="text-[10px] text-gray-400">Personalise your campus feed & marketplace</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={18} />
          </button>
        </div>

        {/* Search input */}
        <div className="my-3 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FUTMINNA, UNILAG, UniAbuja..."
            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 rounded-xl py-2 pl-8 pr-3 text-xs outline-none font-medium"
          />
        </div>

        {/* List of Universities */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-50">
          {filteredUnis.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-6">No matching universities found.</p>
          ) : (
            filteredUnis.map((uni) => {
              const isSelected = currentUni === uni.short_name;
              return (
                <div
                  key={uni.id}
                  onClick={() => !saving && handleSelectUniversity(uni)}
                  className={`pt-2 pb-2 px-2 rounded-2xl flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-amber-50/80 border border-amber-300'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={uni.logo_url}
                      alt={uni.short_name}
                      className="w-10 h-10 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs text-gray-900 truncate">
                          {uni.short_name}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 truncate">{uni.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <MapPin size={10} /> {uni.city}, {uni.state}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Users size={10} /> {uni.student_count.toLocaleString()} students
                        </span>
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
            Changing your university personalises your default feed without affecting your existing chat or order history.
          </p>
        </div>
      </div>
    </div>
  );
};
