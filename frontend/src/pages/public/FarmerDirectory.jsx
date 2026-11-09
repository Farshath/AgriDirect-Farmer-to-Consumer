import React, { useState, useEffect } from 'react';
import { farmerAPI } from '../../api';
import FarmerCard from '../../components/cards/FarmerCard';
import { CardSkeleton } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Search, MapPin, ShieldCheck, Sprout } from 'lucide-react';

const FarmerDirectory = () => {
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setIsLoading(true);
        const params = {};
        if (search) params.search = search;
        if (selectedState) params.state = selectedState;

        const res = await farmerAPI.getFarmers(params);
        if (res.success) {
          setFarmers(res.farmers);
        }
      } catch (error) {
        console.error('Farmer directory fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmers();
  }, [search, selectedState]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#174D32] to-[#27683E] rounded-3xl p-8 sm:p-12 text-white shadow-lg space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E5B64B] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          Verified Agricultural Producers
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Verified Farmer Directory
        </h1>
        <p className="text-sm text-[#BAD5C1] max-w-xl leading-relaxed">
          Meet the dedicated families who cultivate pure food with sustainable soil practices, zero synthetic pesticides, and generational passion.
        </p>
      </div>

      {/* Search & Location Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#BAD5C1]/50 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farm name, location, or crop specialty..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs text-[#202B24] placeholder-[#78897E] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
          />
          <Search className="w-4 h-4 text-[#78897E] absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#78897E] font-medium hidden sm:inline-block">
            State:
          </span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/60 text-xs font-semibold text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
          >
            <option value="">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>
      </div>

      {/* Farmers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : farmers.length === 0 ? (
        <EmptyState
          title="No verified farmers found"
          description="Try broadening your search term or selecting 'All States'."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedState('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer) => (
            <FarmerCard key={farmer._id} farmer={farmer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerDirectory;

