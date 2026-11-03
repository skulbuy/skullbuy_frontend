import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, MapPin, X, RotateCcw, 
  ChevronDown, ShieldCheck, Tag, ArrowUpDown, AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Category, Listing } from '../types';
import { Header } from '../components/Header';

export const CategoriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Active filter state from query or local state
  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const condition = searchParams.get('condition') || '';
  const location = searchParams.get('location') || '';
  const sort = searchParams.get('sort') || 'newest';
  const filter = searchParams.get('filter') || '';

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const fetchListings = () => {
    setLoading(true);
    setError(false);
    const query = new URLSearchParams();
    if (activeCategory) query.set('category', activeCategory);
    if (searchQuery) query.set('search', searchQuery);
    if (condition) query.set('condition', condition);
    if (location) query.set('location', location);
    if (sort) query.set('sort', sort);
    if (filter === 'rentals') query.set('is_rental', '1');

    fetch(`/api/listings?${query.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListings();
  }, [activeCategory, searchQuery, condition, location, sort, filter]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(activeCategory || searchQuery || condition || location || filter || sort !== 'newest');

  return (
    <div className="pb-24 min-h-screen bg-gray-50/50">
      <Header onSearchSubmit={(q) => updateParam('search', q)} />

      {/* Sticky Filter & Sort bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 sticky top-[72px] z-30 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setShowFilterDrawer(true)}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition shrink-0 ${
              hasActiveFilters ? 'bg-amber-500 text-white border-amber-500' : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            <Filter size={13} />
            <span>Filters</span>
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" />}
          </button>

          {/* Quick Category filter buttons */}
          <button
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete('category');
              next.delete('filter');
              setSearchParams(next);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border shrink-0 ${
              !activeCategory && !filter ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            All Items
          </button>

          <button
            onClick={() => {
              if (filter === 'rentals') {
                updateParam('filter', '');
              } else {
                updateParam('filter', 'rentals');
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border shrink-0 ${
              filter === 'rentals' ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}
          >
            ⚡ Campus Rentals
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => updateParam('category', c.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border shrink-0 ${
                activeCategory === c.slug ? 'bg-amber-500 text-white border-amber-500' : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="px-4 pt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-amber-200">
              "{searchQuery}"
              <X size={11} className="cursor-pointer" onClick={() => updateParam('search', '')} />
            </span>
          )}

          {activeCategory && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-amber-200">
              {categories.find(c => c.slug === activeCategory)?.name || activeCategory}
              <X size={11} className="cursor-pointer" onClick={() => updateParam('category', '')} />
            </span>
          )}

          {condition && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-amber-200">
              {condition}
              <X size={11} className="cursor-pointer" onClick={() => updateParam('condition', '')} />
            </span>
          )}

          {location && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-amber-200">
              {location}
              <X size={11} className="cursor-pointer" onClick={() => updateParam('location', '')} />
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-[11px] text-gray-500 hover:text-red-500 font-bold ml-1 inline-flex items-center gap-0.5"
          >
            <RotateCcw size={10} />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Results Header */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing <strong className="text-gray-900 font-bold">{listings.length}</strong> items on campus
        </span>
        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="bg-transparent text-gray-700 font-bold text-xs outline-none cursor-pointer"
        >
          <option value="newest">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Listings List (MKT-01) */}
      <div className="px-4 mt-2">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl h-36 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-red-100 shadow-2xs my-6">
            <AlertCircle size={32} className="text-red-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-900">Failed to load marketplace items</h3>
            <p className="text-xs text-gray-500 mt-1">Please check your connection and retry.</p>
            <button
              onClick={fetchListings}
              className="mt-3 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Retry
            </button>
          </div>
        ) : listings.length === 0 ? (
          // Honest empty state with root cause clarity (OBS-03, MKT-01)
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-2xs my-6">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-500">
              <Search size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">No Listings Found</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-xs mx-auto">
              {hasActiveFilters 
                ? 'No items matched your specific filter combination. Try clearing some filters.'
                : 'There are currently no active listings published in this category yet.'}
            </p>

            <div className="flex justify-center gap-2 mt-4">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => navigate('/sell')}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Post New Item
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(`/listing/${item.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-2xs hover:border-amber-300 transition cursor-pointer flex h-36"
              >
                <div className="w-32 bg-gray-100 relative shrink-0 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'; }}
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {item.condition}
                  </div>
                  {item.is_rental ? (
                    <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                      Rent
                    </div>
                  ) : null}
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold mb-0.5">
                      <span className="uppercase text-amber-600 font-bold">{item.category_name}</span>
                      <span className="truncate max-w-[100px]">{item.campus_location.split(',')[0]}</span>
                    </div>

                    <h3 className="font-bold text-xs text-gray-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-gray-50 flex items-end justify-between">
                    <div>
                      <p className="text-base font-black text-gray-900 leading-none">
                        ₦{Number(item.price).toLocaleString()}
                      </p>
                      {item.is_negotiable ? (
                        <span className="text-[9px] text-emerald-600 font-bold">Negotiable</span>
                      ) : (
                        <span className="text-[9px] text-gray-400 font-medium">Fixed</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <span>{item.seller_name.split(' ')[0]}</span>
                      {item.seller_verified === 'verified' && (
                        <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Drawer / Modal */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end justify-center animate-in fade-in">
          <div className="bg-white rounded-t-3xl max-w-md w-full p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-sm text-gray-900">Marketplace Filters</h3>
              <button onClick={() => setShowFilterDrawer(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Category */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Category</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateParam('category', activeCategory === c.slug ? '' : c.slug)}
                      className={`py-2 px-2.5 rounded-xl text-left font-medium border transition ${
                        activeCategory === c.slug ? 'bg-amber-500 text-white border-amber-500 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Item Condition</label>
                <div className="grid grid-cols-3 gap-2">
                  {['', 'Fairly Used', 'New'].map((cond) => (
                    <button
                      key={cond || 'all'}
                      type="button"
                      onClick={() => updateParam('condition', cond)}
                      className={`py-2 rounded-xl text-center font-medium border transition ${
                        condition === cond ? 'bg-amber-500 text-white border-amber-500 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      {cond || 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campus Location */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Campus Location (FUTMX)</label>
                <div className="space-y-1.5">
                  {['', 'Gidan Kwano Campus', 'Bosso Campus', 'Off-Campus'].map((loc) => (
                    <button
                      key={loc || 'all'}
                      type="button"
                      onClick={() => updateParam('location', loc)}
                      className={`w-full py-2 px-3 rounded-xl text-left font-medium border transition ${
                        location === loc ? 'bg-amber-500 text-white border-amber-500 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      {loc || 'Any Campus Location'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={clearAllFilters}
                className="py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="py-3 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-sm"
              >
                Apply Filters ({listings.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
