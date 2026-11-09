import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { farmerAPI } from '../../api';
import ProductCard from '../../components/cards/ProductCard';
import { VerificationBadge } from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import { Loader } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  MapPin,
  Calendar,
  Award,
  Sprout,
  ShieldCheck,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  ArrowLeft,
} from 'lucide-react';

const FarmerDetail = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        setIsLoading(true);
        const res = await farmerAPI.getFarmerById(id);
        if (res.success) {
          setFarmer(res.farmer);
          setProducts(res.products || []);
        }
      } catch (error) {
        console.error('Failed to load farmer:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmer();
  }, [id]);

  if (isLoading) {
    return <Loader message="Loading farm profile & harvest listings..." />;
  }

  if (!farmer) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#174D32]">Farmer Profile Not Found</h2>
        <p className="text-sm text-[#4A5B50]">
          The farmer details you requested are unavailable or pending review.
        </p>
        <Link to="/farmers">
          <Button variant="primary">Return to Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/farmers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174D32] hover:text-[#63A66B]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Farmers</span>
        </Link>
      </div>

      {/* Hero Farm Banner */}
      <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 overflow-hidden shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-64 sm:h-80 w-full bg-cream-200">
          <img
            src={
              farmer.coverImage ||
              'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80'
            }
            alt={farmer.farmName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <VerificationBadge status={farmer.verificationStatus} />
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="flex items-end gap-4">
              <img
                src={farmer.profileImage || farmer.user?.avatar}
                alt={farmer.farmName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
              />
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174D32]">
                  {farmer.farmName}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-[#4A5B50] flex items-center gap-1.5 mt-0.5">
                  <span>Operated by {farmer.user?.name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#174D32]">
                    <MapPin className="w-3.5 h-3.5 text-[#63A66B]" />
                    {farmer.farmLocation}, {farmer.district}, {farmer.state}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-[#F0F6F2] px-4 py-2 rounded-2xl flex items-center gap-2 border border-[#BAD5C1]/40">
              <StarRating rating={farmer.rating || 5} size="sm" />
              <span className="text-sm font-bold text-[#174D32]">
                {farmer.rating?.toFixed(1) || '5.0'}
              </span>
              <span className="text-xs text-[#78897E]">({farmer.numReviews || 0} reviews)</span>
            </div>
          </div>

          {/* Details & Farming Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#BAD5C1]/30">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-[#174D32] uppercase tracking-wider">
                Farm Story & Agricultural Philosophy
              </h3>
              <p className="text-sm text-[#4A5B50] leading-relaxed whitespace-pre-line">
                {farmer.farmDescription}
              </p>

              {/* Crop Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-[#78897E]">Crops Grown:</span>
                {farmer.cropTypes?.map((crop, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-[#DCEADF] text-[#174D32] px-3 py-1 rounded-xl"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            {/* Farm Highlights Card */}
            <div className="bg-[#F7F8EF] p-5 rounded-2xl border border-[#BAD5C1]/50 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#174D32]">
                Farm Specifications
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#BAD5C1]/30">
                  <span className="text-[#78897E]">Farming Method</span>
                  <span className="font-bold text-[#174D32]">{farmer.farmingMethod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#BAD5C1]/30">
                  <span className="text-[#78897E]">Farm Acreage</span>
                  <span className="font-bold text-[#174D32]">{farmer.totalAreaAcres || 5} Acres</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#BAD5C1]/30">
                  <span className="text-[#78897E]">Farming Experience</span>
                  <span className="font-bold text-[#174D32]">{farmer.experienceYears || 5} Years</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#78897E]">Active Listings</span>
                  <span className="font-bold text-[#174D32]">{products.length} Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Farm Harvests */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#63A66B] block">
              Available Fresh
            </span>
            <h2 className="text-2xl font-extrabold text-[#174D32]">
              Harvests from {farmer.farmName}
            </h2>
          </div>
          <span className="text-xs font-bold text-[#4A5B50] bg-white px-3 py-1.5 rounded-xl border border-[#BAD5C1]/40">
            {products.length} Active Listings
          </span>
        </div>

        {products.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#BAD5C1]/40">
            <p className="text-sm text-[#78897E]">
              This farm currently has no active products listed. Check back tomorrow morning after the sunrise harvest!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDetail;

