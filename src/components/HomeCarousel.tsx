import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Tag, Package, ArrowRight, ShieldCheck } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  tagBg: string;
  headline: string;
  subhead: string;
  ctaText: string;
  ctaPath: string;
  image: string;
  productBadge?: string;
  priceNote?: string;
}

export const HomeCarousel: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Exactly four compelling slides featuring realistic student environment & genuine products
  const slides: Slide[] = [
    {
      id: 1,
      tag: "New on SkulBuy",
      tagBg: "bg-emerald-600",
      headline: "Fresh Campus Arrivals Listed Today",
      subhead: "Rechargeable fans, engineering textbooks, and verified gadgets from fellow students.",
      ctaText: "Browse New Arrivals",
      ctaPath: "/categories?sort=newest",
      image: "https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?auto=format&fit=crop&w=800&q=80",
      productBadge: "Century 16\" Rechargeable Fan",
      priceNote: "₦24,000 • Verified Seller"
    },
    {
      id: 2,
      tag: "Campus Essentials",
      tagBg: "bg-amber-600",
      headline: "Find Your Hostel Essentials",
      subhead: "Hotplates, Vitafoam student mattresses, and study desks ready for daylight hostel pickup.",
      ctaText: "Shop Essentials",
      ctaPath: "/categories?category=hostel-essentials",
      image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80",
      productBadge: "Student Mattress 3x6 + Table",
      priceNote: "₦32,000 • Hostel Block B"
    },
    {
      id: 3,
      tag: "Great Finds, Better Prices",
      tagBg: "bg-blue-600",
      headline: "Thrift & Pre-Owned Campus Deals",
      subhead: "Save up to 40% on neat laboratory coats, power banks, and clean student footwear.",
      ctaText: "Explore Fairly Used",
      ctaPath: "/categories?category=fairly-used",
      image: "https://images.unsplash.com/photo-1609592424364-56b9c9f2b8f4?auto=format&fit=crop&w=800&q=80",
      productBadge: "Oraimo 20000mAh PowerBox Pro",
      priceNote: "₦18,500 • Price Negotiable"
    },
    {
      id: 4,
      tag: "Buy, Sell & Discover",
      tagBg: "bg-orange-600",
      headline: "Turn Unused Gear into Cash",
      subhead: "Post your unused electronics, textbooks, or student services and reach campus buyers instantly.",
      ctaText: "Start Selling (+25 pts)",
      ctaPath: "/sell",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      productBadge: "Campus Student Marketplace",
      priceNote: "Zero Listing Fee • Safe Trading"
    }
  ];

  // Automatic slide rotation ~5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (diff > minSwipeDistance) {
      // Swiped left -> next slide
      setCurrent((prev) => (prev + 1) % slides.length);
    } else if (diff < -minSwipeDistance) {
      // Swiped right -> prev slide
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const goToSlide = (idx: number) => {
    setCurrent(idx);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[current];

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-900 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background slide image with smooth transition */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.headline}
          className="w-full h-full object-cover object-center transition-all duration-700 transform scale-105"
        />

        {/* Cinematic gradient overlays for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent" />

        {/* Content Container */}
        <div className="absolute inset-0 p-5 sm:p-8 md:p-10 flex flex-col justify-between text-white z-10">
          {/* Top row: Badge & Product tag */}
          <div className="flex items-center justify-between gap-2">
            <span className={`${slide.tagBg} text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm`}>
              {slide.tag}
            </span>

            {slide.productBadge && (
              <span className="bg-black/60 backdrop-blur-md text-amber-200 text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-white/10 hidden sm:inline-block">
                {slide.productBadge}
              </span>
            )}
          </div>

          {/* Bottom section: Headline, description, CTA */}
          <div className="space-y-2 max-w-xl md:max-w-2xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-white drop-shadow-xs">
              {slide.headline}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 md:line-clamp-3 font-medium drop-shadow-xs">
              {slide.subhead}
            </p>

            {slide.priceNote && (
              <p className="text-xs sm:text-sm font-bold text-amber-300">
                {slide.priceNote}
              </p>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => navigate(slide.ctaPath)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/25 transition"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Desktop / Hover) */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition z-20 opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition z-20 opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <ChevronRight size={18} />
      </button>

      {/* Four Slide Indicators */}
      <div className="absolute bottom-2.5 right-4 flex items-center gap-1.5 z-20">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              idx === current ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
