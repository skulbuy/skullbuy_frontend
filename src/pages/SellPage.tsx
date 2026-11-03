import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Camera, Tag, MapPin, Info, ArrowLeft, CheckCircle2, 
  Sparkles, Image as ImageIcon, AlertTriangle, ShieldCheck, 
  Eye, Upload, Trash2, RefreshCw, Plus, Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

const DEFAULT_PRESET_IMAGES = [
  { label: 'Gadget / Tech', url: 'https://images.unsplash.com/photo-1609592424364-56b9c9f2b8f4?auto=format&fit=crop&w=600&q=80' },
  { label: 'Hostel Fan', url: 'https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?auto=format&fit=crop&w=600&q=80' },
  { label: 'Textbook / Notes', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Desk / Chair', url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=600&q=80' },
  { label: 'Food / Provision', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80' },
  { label: 'Lab Coat / Gown', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80' }
];

export const SellPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const { user, authFetch } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState('Fairly Used');
  const [campusLocation, setCampusLocation] = useState('Gidan Kwano Campus');
  const [description, setDescription] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [images, setImages] = useState<string[]>([DEFAULT_PRESET_IMAGES[0].url]);
  
  // Rental Fields
  const [isRental, setIsRental] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<'per day' | 'per week' | 'per semester' | 'per event'>('per day');

  // Load categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // If in edit mode, fetch existing listing details
  useEffect(() => {
    if (editId) {
      fetch(`/api/listings/${editId}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.id) {
            setTitle(data.title || '');
            setPrice(String(data.price || ''));
            setCategoryId(String(data.category_id || ''));
            setCondition(data.condition || 'Fairly Used');
            setCampusLocation(data.campus_location || 'Gidan Kwano Campus');
            setDescription(data.description || '');
            setIsNegotiable(!!data.is_negotiable);
            setIsRental(!!data.is_rental);
            setRentalPeriod(data.rental_period || 'per day');
            if (Array.isArray(data.images) && data.images.length > 0) {
              setImages(data.images);
            } else if (data.image_url) {
              setImages([data.image_url]);
            }
          }
        })
        .catch(console.error);
    }
  }, [editId]);

  // Handle Photo File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, replaceIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await authFetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, folder: 'listings' })
        });
        const data = await res.json();
        if (data.url) {
          if (typeof replaceIndex === 'number') {
            const updated = [...images];
            updated[replaceIndex] = data.url;
            setImages(updated);
          } else {
            setImages(prev => [...prev, data.url]);
          }
        } else {
          setErrorMsg(data.error || 'Failed to upload photo');
        }
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorMsg('Error processing photo file');
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    if (images.length <= 1) {
      setErrorMsg('At least one product photo is required.');
      return;
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const setAsPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const filtered = images.filter((_, i) => i !== index);
    setImages([item, ...filtered]);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !price || !categoryId || !description.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (images.length === 0) {
      setErrorMsg('Please upload or select at least one item photo.');
      return;
    }

    setSubmitting(true);

    const payload = {
      title,
      price: Number(price),
      category_id: Number(categoryId),
      condition,
      campus_location: campusLocation,
      description,
      is_negotiable: isNegotiable,
      image_url: images[0],
      images,
      is_rental: isRental ? 1 : 0,
      rental_period: isRental ? rentalPeriod : null
    };

    try {
      const url = editId ? `/api/listings/${editId}` : '/api/listings';
      const method = editId ? 'PATCH' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save listing');
      }

      navigate(`/listing/${editId || data.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving listing');
      setSubmitting(false);
    }
  };

  // Auth gate
  if (!user) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="p-6 text-center my-auto">
          <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-3 text-amber-600">
            <Camera size={28} />
          </div>
          <h2 className="text-base font-extrabold text-gray-900">Sign in to Post on Campus</h2>
          <p className="text-xs text-gray-600 mt-1.5 max-w-xs mx-auto leading-relaxed">
            To protect students from fraud, posting listings requires an active student account.
          </p>
          <div className="flex flex-col gap-2.5 mt-5 max-w-xs mx-auto">
            <Link
              to="/onboarding"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-3 px-4 rounded-xl shadow-sm transition"
            >
              Sign In or Register (+₦500 Bonus)
            </Link>
            <Link
              to="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl transition"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedCategoryName = categories.find(c => String(c.id) === categoryId)?.name;

  return (
    <div className="pb-28 min-h-screen bg-gray-50/50 font-sans">
      <Header />

      {/* Navigation Sub-header */}
      <div className="bg-white border-b border-gray-100 sticky top-[72px] z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </button>
          <span className="text-xs font-black text-gray-900">
            {editId ? 'Edit Listing & Photos' : 'List Item for Sale or Rent'}
          </span>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
          >
            <Eye size={13} />
            <span>{showPreview ? 'Edit Form' : 'Preview'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Reward Prompt */}
        {!editId && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600 shrink-0" />
              <p className="text-[11px] text-amber-900 font-medium">
                Earn <strong className="font-bold">+25 SkulBox Points</strong> when you publish this campus listing.
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl mb-4 flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {showPreview ? (
          /* Preview Mode */
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {isRental ? 'Campus Rental Preview' : 'Sale Preview'}
              </span>
              <span className="text-xs text-gray-500">{user.campus || 'FUTMX'}</span>
            </div>

            <div className="h-56 bg-gray-100 rounded-2xl overflow-hidden relative">
              <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                {condition}
              </div>
              {isRental && (
                <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  For Rent ({rentalPeriod})
                </div>
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900">₦{Number(price || 0).toLocaleString()}</span>
                {isRental && <span className="text-xs text-gray-500 font-bold">/ {rentalPeriod}</span>}
              </div>
              <h2 className="text-sm font-bold text-gray-900 mt-1">{title || 'Untitled Item'}</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">Category: {selectedCategoryName || 'Unassigned'}</p>
              <p className="text-[11px] text-gray-500">Location: {campusLocation}</p>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-1">Description</h3>
              <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                {description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-sm"
              >
                {submitting ? 'Saving...' : editId ? 'Update Listing' : 'Publish Now'}
              </button>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Multi-Image Gallery & Uploader */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">
                    Product Photos ({images.length}/4)
                  </label>
                  <p className="text-[11px] text-gray-500">First image is the primary cover.</p>
                </div>
                {uploadingImage && (
                  <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                    <RefreshCw size={11} className="animate-spin" /> Uploading photo...
                  </span>
                )}
              </div>

              {/* Primary Image Preview */}
              <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                <img src={images[0]} alt="Primary product cover" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                  Primary Cover
                </div>

                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                  <label className="bg-white/95 hover:bg-white text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md cursor-pointer flex items-center gap-1 transition">
                    <RefreshCw size={11} className="text-amber-600" />
                    <span>Replace Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 0)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Additional Thumbnails Grid */}
              <div className="grid grid-cols-4 gap-2">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 aspect-square bg-gray-50">
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-slate-950 text-[8px] font-black text-center py-0.5">
                        COVER
                      </span>
                    )}
                    {idx > 0 && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition">
                        <button
                          type="button"
                          onClick={() => setAsPrimary(idx)}
                          className="bg-amber-500 text-slate-950 p-1 rounded-md text-[9px] font-bold"
                          title="Set as Cover"
                        >
                          Cover
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="bg-red-500 text-white p-1 rounded-md"
                          title="Delete photo"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Photo Button */}
                {images.length < 4 && (
                  <label className="border-2 border-dashed border-gray-300 hover:border-amber-400 rounded-lg aspect-square flex flex-col items-center justify-center text-gray-400 hover:text-amber-600 cursor-pointer transition">
                    <Plus size={18} />
                    <span className="text-[9px] font-bold mt-0.5">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Quick Presets */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[10px] font-semibold text-gray-500 mb-1.5">Or choose a campus sample photo:</p>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_PRESET_IMAGES.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setImages([p.url])}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                        images[0] === p.url ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs' : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RENTAL TOGGLE (Directive 5 & Directive 9) */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-purple-600" />
                  <div>
                    <p className="text-xs font-black text-gray-900">List this item for Rent</p>
                    <p className="text-[10px] text-gray-500">Rent calculators, lab coats, cameras, projectors</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isRental}
                  onChange={(e) => setIsRental(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              {isRental && (
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Rental Billing Duration</label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {(['per day', 'per week', 'per semester', 'per event'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setRentalPeriod(period)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border capitalize transition ${
                          rentalPeriod === period
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Core Details */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Listing Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRental ? "e.g. Casio fx-991EX Scientific Calculator for Exam Week" : "e.g. Century Rechargeable Fan 16 inch with Remote"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs text-gray-900 outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    {isRental ? `Rental Fee (₦ ${rentalPeriod})` : 'Price (₦)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="15000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs text-gray-900 outline-none focus:border-amber-400 font-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white rounded-xl py-2.5 px-2.5 text-xs text-gray-900 outline-none focus:border-amber-400 font-medium cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Fairly Used', 'New'].map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setCondition(cond)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                        condition === cond ? 'bg-amber-500 text-slate-950 border-amber-500 font-black' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Campus Location / Spot</label>
                <select
                  value={campusLocation}
                  onChange={(e) => setCampusLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white rounded-xl py-2.5 px-3 text-xs text-gray-900 outline-none focus:border-amber-400 font-medium cursor-pointer"
                >
                  <option>Gidan Kwano Campus (Main)</option>
                  <option>Gidan Kwano - Hostel Block A / B</option>
                  <option>Gidan Kwano - Hall 3 Common Area</option>
                  <option>Bosso Campus - Science Quad</option>
                  <option>Bosso Campus Gate</option>
                  <option>Off-Campus Lodge (Gidan Kwano Village)</option>
                  <option>Off-Campus Lodge (Bosso Road)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Mention battery condition, reason for selling/renting, included accessories, and preferred campus meetup time..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs text-gray-900 outline-none focus:border-amber-400 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Allow Price Negotiation</p>
                  <p className="text-[10px] text-gray-500">Students can make counter offers</p>
                </div>
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Moderation note */}
            <div className="bg-gray-100/80 rounded-2xl p-3.5 text-[10px] text-gray-500 space-y-1">
              <p className="font-bold text-gray-700">SkulBuy Campus Trading Guidelines:</p>
              <p>• Only student-legal goods may be listed. No exam malpractice or banned items.</p>
              <p>• For rentals, verify student ID and collect refundable deposit if necessary.</p>
            </div>

            {/* Submit Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="py-3.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Preview First
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-sm transition active:scale-95"
              >
                {submitting ? 'Saving...' : editId ? 'Update Listing' : 'Publish Listing'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
