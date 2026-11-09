import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../api';
import ProductCard from '../../components/cards/ProductCard';
import { CardSkeleton } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Leaf,
  Filter,
  MapPin,
  IndianRupee,
  CheckCircle2,
  Users,
  ShoppingBag,
  ArrowDown,
  Sparkles,
  PackageCheck,
  RefreshCw,
} from 'lucide-react';

// Pan-India state and district data for seamless filtering
const INDIAN_STATES = [
  'Maharashtra',
  'Punjab',
  'Himachal Pradesh',
  'Kerala',
  'Karnataka',
  'Gujarat',
  'Uttar Pradesh',
  'Tamil Nadu',
  'Rajasthan',
  'Madhya Pradesh',
  'Andhra Pradesh',
  'West Bengal',
];

const DISTRICTS_BY_STATE = {
  Maharashtra: ['Nashik', 'Pune', 'Satara', 'Nagpur', 'Kolhapur', 'Ahmednagar', 'Solapur', 'Sangli', 'Ratnagiri'],
  Punjab: ['Faridkot', 'Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar', 'Bathinda', 'Hoshiarpur'],
  'Himachal Pradesh': ['Shimla', 'Kullu', 'Mandi', 'Kangra', 'Solan', 'Chamba', 'Kinnaur'],
  Kerala: ['Wayanad', 'Idukki', 'Ernakulam', 'Palakkad', 'Kozhikode', 'Thrissur', 'Kottayam'],
  Karnataka: ['Bengaluru Rural', 'Mysuru', 'Belagavi', 'Shivamogga', 'Hassan', 'Mandya'],
  Gujarat: ['Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Junagadh', 'Kutch'],
  'Uttar Pradesh': ['Varanasi', 'Lucknow', 'Agra', 'Prayagraj', 'Meerut', 'Kanpur'],
  'Tamil Nadu': ['Coimbatore', 'Madurai', 'Salem', 'Thanjavur', 'Tiruchirappalli', 'Erode'],
};

const PRICE_PRESETS = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under ₹50', min: '0', max: '50' },
  { label: '₹50 - ₹150', min: '50', max: '150' },
  { label: '₹150 - ₹400', min: '150', max: '400' },
  { label: 'Above ₹400', min: '400', max: '' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states initialized from URL query params or defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [isOrganicOnly, setIsOrganicOnly] = useState(searchParams.get('isOrganic') === 'true');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [availability, setAvailability] = useState(searchParams.get('availability') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch product categories once
  useEffect(() => {
    categoryAPI.getCategories().then((res) => {
      if (res && res.categories) setCategories(res.categories);
    }).catch((err) => {
      console.error('Failed to load categories:', err);
    });
  }, []);

  // Compute available districts based on selected state
  const availableDistricts = useMemo(() => {
    if (!selectedState || !DISTRICTS_BY_STATE[selectedState]) {
      return [];
    }
    return DISTRICTS_BY_STATE[selectedState];
  }, [selectedState]);

  // Main data fetcher linked to current filter states
  useEffect(() => {
    let isMounted = true;

    const fetchFilteredProducts = async () => {
      try {
        setIsLoading(true);
        const params = {
          page: currentPage,
          limit: 12,
        };

        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedCategory) params.category = selectedCategory;
        if (isOrganicOnly) params.isOrganic = 'true';
        if (selectedState) params.state = selectedState;
        if (selectedDistrict) params.district = selectedDistrict;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (availability && availability !== 'all') params.availability = availability;
        if (sortBy) params.sort = sortBy;

        const res = await productAPI.getProducts(params);
        if (isMounted && res && res.success) {
          setProducts(res.products || []);
          setTotal(res.total || 0);
          setPages(res.pages || 1);
        }
      } catch (error) {
        console.error('Failed to fetch shop products:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFilteredProducts();

    // Synchronize query params with window history
    const urlParams = new URLSearchParams();
    if (searchTerm.trim()) urlParams.set('search', searchTerm.trim());
    if (selectedCategory) urlParams.set('category', selectedCategory);
    if (isOrganicOnly) urlParams.set('isOrganic', 'true');
    if (selectedState) urlParams.set('state', selectedState);
    if (selectedDistrict) urlParams.set('district', selectedDistrict);
    if (minPrice) urlParams.set('minPrice', minPrice);
    if (maxPrice) urlParams.set('maxPrice', maxPrice);
    if (availability && availability !== 'all') urlParams.set('availability', availability);
    if (sortBy !== 'newest') urlParams.set('sort', sortBy);
    if (currentPage > 1) urlParams.set('page', currentPage.toString());

    setSearchParams(urlParams, { replace: true });

    return () => {
      isMounted = false;
    };
  }, [
    searchTerm,
    selectedCategory,
    isOrganicOnly,
    selectedState,
    selectedDistrict,
    minPrice,
    maxPrice,
    availability,
    sortBy,
    currentPage,
    setSearchParams,
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory((prev) => (prev === slug ? '' : slug));
    setCurrentPage(1);
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedDistrict(''); // Reset district when state changes
    setCurrentPage(1);
  };

  const handlePricePreset = (preset) => {
    setMinPrice(preset.min);
    setMaxPrice(preset.max);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setIsOrganicOnly(false);
    setSelectedState('');
    setSelectedDistrict('');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    Boolean(selectedCategory) ||
    isOrganicOnly ||
    Boolean(selectedState) ||
    Boolean(selectedDistrict) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    availability !== 'all';

  const scrollToCatalog = () => {
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8EF]/40 pb-16 space-y-8">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#174D32] text-white">
        {/* Background Image with Depth Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
            alt="Lush Indian Farm Fields"
            className="w-full h-full object-cover object-center brightness-90 transform scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#174D32]/95 via-[#174D32]/85 to-[#174D32]/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-[#E5B64B] tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Farm-to-Kitchen Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Fresh From Indian Farms to Your Home
            </h1>

            <p className="text-base sm:text-xl text-[#BAD5C1] font-normal leading-relaxed max-w-2xl">
              Buy directly from verified farmers. Fresh produce, fair prices, zero middlemen.
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                variant="gold"
                onClick={scrollToCatalog}
                icon={ShoppingBag}
                className="shadow-lg hover:shadow-xl"
              >
                Shop Fresh Produce
              </Button>

              <Link to="/farmers">
                <Button
                  size="lg"
                  variant="secondary"
                  icon={Users}
                  className="bg-white/95 text-[#174D32] border-white hover:bg-white"
                >
                  Explore Farmers
                </Button>
              </Link>
            </div>

            {/* Quality Pillars */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/15 text-xs text-[#BAD5C1]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#63A66B] shrink-0" />
                <span>100% Certified Direct Origin</span>
              </div>
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-[#E5B64B] shrink-0" />
                <span>Harvested at Morning Dawn</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <IndianRupee className="w-4 h-4 text-[#BAD5C1] shrink-0" />
                <span>Fair Remuneration to Farmers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATALOG CONTAINER & QUICK CATEGORY STRIP */}
      <div id="products-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Category Carousel / Pill Strip */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#BAD5C1]/50 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategorySelect('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === ''
                ? 'bg-[#174D32] text-white shadow-sm'
                : 'bg-[#F0F6F2] text-[#4A5B50] hover:bg-[#DCEADF]/60'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id || cat.slug}
              type="button"
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? 'bg-[#174D32] text-white shadow-sm'
                  : 'bg-[#F0F6F2] text-[#4A5B50] hover:bg-[#DCEADF]/60'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* 3. MAIN SHOP LAYOUT: FILTERS & PRODUCTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#BAD5C1]/60 shadow-[0_4px_24px_-4px_rgba(23,77,50,0.05)] space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-[#BAD5C1]/30">
                <h3 className="font-bold text-[#174D32] text-sm flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#63A66B]" />
                  <span>Filter Produce</span>
                </h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* State Filter (Pan-India) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#202B24] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#63A66B]" />
                  <span>State (India)</span>
                </label>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs font-medium text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32] transition-colors"
                >
                  <option value="">All Indian States</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Filter (Conditional or General) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#202B24] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#63A66B]" />
                  <span>District / Region</span>
                </label>
                {availableDistricts.length > 0 ? (
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs font-medium text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32] transition-colors"
                  >
                    <option value="">All Districts in {selectedState}</option>
                    {availableDistricts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Enter district (e.g. Nashik, Shimla)"
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs text-[#202B24] placeholder-[#78897E] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                  />
                )}
              </div>

              {/* Availability Filter */}
              <div className="space-y-2 pt-2 border-t border-[#BAD5C1]/30">
                <label className="text-xs font-bold text-[#202B24] uppercase tracking-wider block">
                  Availability
                </label>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#4A5B50] hover:text-[#174D32]">
                    <input
                      type="radio"
                      name="availability"
                      value="all"
                      checked={availability === 'all'}
                      onChange={() => {
                        setAvailability('all');
                        setCurrentPage(1);
                      }}
                      className="text-[#174D32] focus:ring-[#63A66B]"
                    />
                    <span>All Produce</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#4A5B50] hover:text-[#174D32]">
                    <input
                      type="radio"
                      name="availability"
                      value="in-stock"
                      checked={availability === 'in-stock'}
                      onChange={() => {
                        setAvailability('in-stock');
                        setCurrentPage(1);
                      }}
                      className="text-[#174D32] focus:ring-[#63A66B]"
                    />
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      In Stock Only
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#4A5B50] hover:text-[#174D32]">
                    <input
                      type="radio"
                      name="availability"
                      value="out-of-stock"
                      checked={availability === 'out-of-stock'}
                      onChange={() => {
                        setAvailability('out-of-stock');
                        setCurrentPage(1);
                      }}
                      className="text-[#174D32] focus:ring-[#63A66B]"
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </div>

              {/* Price Range Filter (₹ INR) */}
              <div className="space-y-3 pt-2 border-t border-[#BAD5C1]/30">
                <label className="text-xs font-bold text-[#202B24] uppercase tracking-wider flex items-center justify-between">
                  <span>Price Range (₹ INR)</span>
                  {(minPrice || maxPrice) && (
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                        setCurrentPage(1);
                      }}
                      className="text-[11px] text-[#78897E] hover:text-rose-600 font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </label>

                {/* Preset Price Pills */}
                <div className="grid grid-cols-2 gap-1.5">
                  {PRICE_PRESETS.map((preset) => {
                    const isActive = minPrice === preset.min && maxPrice === preset.max;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handlePricePreset(preset)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold text-center transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#174D32] text-white'
                            : 'bg-[#F0F6F2] text-[#4A5B50] hover:bg-[#DCEADF]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Min / Max Inputs */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 text-xs text-[#78897E] font-bold">₹</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Min"
                      min="0"
                      className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs text-[#202B24] placeholder-[#78897E] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                    />
                  </div>
                  <span className="text-xs text-[#78897E] font-bold">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 text-xs text-[#78897E] font-bold">₹</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Max"
                      min="0"
                      className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs text-[#202B24] placeholder-[#78897E] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                    />
                  </div>
                </div>
              </div>

              {/* Organic Certified Toggle */}
              <div className="pt-3 border-t border-[#BAD5C1]/30">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isOrganicOnly}
                    onChange={(e) => {
                      setIsOrganicOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded text-[#174D32] focus:ring-[#63A66B] border-[#BAD5C1]"
                  />
                  <span className="text-xs font-bold text-[#174D32] flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#63A66B]" />
                    100% Organic Certified
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCT GRID AREA */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Toolbar: Search Bar, Mobile Filters, Sort Dropdown */}
            <div className="bg-white p-4 rounded-2xl border border-[#BAD5C1]/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Product Name Search */}
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search tomatoes, basmati rice, A2 ghee, apples..."
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs text-[#202B24] placeholder-[#78897E] focus:outline-none focus:ring-2 focus:ring-[#174D32] transition-all"
                />
                <Search className="w-4 h-4 text-[#78897E] absolute left-3 top-3 pointer-events-none" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-2.5 text-[#78897E] hover:text-[#202B24]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Mobile Filter Button & Sorting */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F0F6F2] text-xs font-bold text-[#174D32] border border-[#BAD5C1]/60 hover:bg-[#DCEADF]"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters {hasActiveFilters && '•'}</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#78897E] font-semibold hidden sm:inline-block">
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs font-bold text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                  >
                    <option value="newest">Recently Harvested</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Customer Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-white/70 rounded-xl border border-[#BAD5C1]/40">
                <span className="text-xs text-[#78897E] font-bold">Active filters:</span>

                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DCEADF] text-[#174D32] text-xs font-bold">
                    Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedCategory('')} />
                  </span>
                )}

                {selectedState && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DCEADF] text-[#174D32] text-xs font-bold">
                    State: {selectedState}
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => { setSelectedState(''); setSelectedDistrict(''); }} />
                  </span>
                )}

                {selectedDistrict && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DCEADF] text-[#174D32] text-xs font-bold">
                    District: {selectedDistrict}
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedDistrict('')} />
                  </span>
                )}

                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DCEADF] text-[#174D32] text-xs font-bold">
                    Price: ₹{minPrice || 0} - ₹{maxPrice || '∞'}
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => { setMinPrice(''); setMaxPrice(''); }} />
                  </span>
                )}

                {availability !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DCEADF] text-[#174D32] text-xs font-bold">
                    {availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setAvailability('all')} />
                  </span>
                )}

                {isOrganicOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DCEADF] text-[#174D32] text-xs font-bold">
                    Organic Only
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setIsOrganicOnly(false)} />
                  </span>
                )}

                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DCEADF] text-[#174D32] text-xs font-bold">
                    "{searchTerm}"
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSearchTerm('')} />
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-auto cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Count Banner */}
            <div className="flex items-center justify-between text-xs text-[#4A5B50]">
              <span>
                Found <strong className="text-[#174D32]">{total}</strong> fresh produce items across India
              </span>
              {isLoading && (
                <span className="flex items-center gap-1.5 text-[#63A66B] font-semibold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Updating crops...
                </span>
              )}
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No farm produce found matching your criteria"
                description="Try clearing your location or price filters, or search for other fresh vegetables, grains, or organic products."
                actionLabel="Reset All Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#BAD5C1]/40">
                <span className="text-xs text-[#78897E]">
                  Showing page <strong className="text-[#174D32]">{currentPage}</strong> of{' '}
                  <strong className="text-[#174D32]">{pages}</strong> ({total} total crops)
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentPage <= 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      scrollToCatalog();
                    }}
                    icon={ChevronLeft}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentPage >= pages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(pages, p + 1));
                      scrollToCatalog();
                    }}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#BAD5C1]/30">
              <h3 className="font-bold text-[#174D32] text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#63A66B]" />
                <span>Filters</span>
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile State Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#202B24] uppercase tracking-wider block">
                State (India)
              </label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs font-medium text-[#202B24]"
              >
                <option value="">All Indian States</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile District Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#202B24] uppercase tracking-wider block">
                District / Region
              </label>
              {availableDistricts.length > 0 ? (
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs font-medium text-[#202B24]"
                >
                  <option value="">All Districts</option>
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Enter district"
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs"
                />
              )}
            </div>

            {/* Mobile Availability */}
            <div className="space-y-2 pt-2 border-t border-[#BAD5C1]/30">
              <label className="text-xs font-bold text-[#202B24] uppercase tracking-wider block">
                Availability
              </label>
              <div className="space-y-1 text-xs">
                {['all', 'in-stock', 'out-of-stock'].map((val) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer capitalize">
                    <input
                      type="radio"
                      name="mobile-availability"
                      value={val}
                      checked={availability === val}
                      onChange={() => {
                        setAvailability(val);
                        setCurrentPage(1);
                      }}
                      className="text-[#174D32]"
                    />
                    <span>{val.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Price Presets */}
            <div className="space-y-2 pt-2 border-t border-[#BAD5C1]/30">
              <label className="text-xs font-bold text-[#202B24] uppercase tracking-wider block">
                Price Range (₹)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRICE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePricePreset(preset)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold ${
                      minPrice === preset.min && maxPrice === preset.max
                        ? 'bg-[#174D32] text-white'
                        : 'bg-[#F0F6F2] text-[#4A5B50]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Organic Toggle */}
            <div className="pt-2 border-t border-[#BAD5C1]/30">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#174D32]">
                <input
                  type="checkbox"
                  checked={isOrganicOnly}
                  onChange={(e) => {
                    setIsOrganicOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-[#174D32]"
                />
                <span>100% Organic Certified Only</span>
              </label>
            </div>

            <div className="pt-4 border-t border-[#BAD5C1]/30 flex flex-col gap-2 mt-auto">
              <Button
                variant="primary"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full"
              >
                Apply Filters
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full text-rose-600 hover:text-rose-700"
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
