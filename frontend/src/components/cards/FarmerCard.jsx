import React from 'react';
import { Link } from 'react-router-dom';
import { VerificationBadge } from '../common/Badge';
import StarRating from '../common/StarRating';
import { MapPin, ArrowRight, Award, Sprout } from 'lucide-react';

const FarmerCard = ({ farmer }) => {
  if (!farmer) return null;

  const coverUrl =
    farmer.coverImage ||
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
  const avatarUrl =
    farmer.profileImage ||
    farmer.user?.avatar ||
    'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 shadow-sm hover:shadow-[0_16px_32px_-8px_rgba(23,77,50,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Cover Image & Verification Badge */}
        <div className="relative h-32 w-full bg-cream-200 overflow-hidden">
          <img
            src={coverUrl}
            alt={farmer.farmName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <VerificationBadge status={farmer.verificationStatus} />
          </div>
        </div>

        {/* Farmer Info */}
        <div className="px-5 pt-0 pb-4 relative">
          {/* Avatar */}
          <div className="-mt-10 mb-3 flex items-end justify-between">
            <img
              src={avatarUrl}
              alt={farmer.farmName}
              className="w-18 h-18 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
            />
            <div className="flex items-center gap-1 bg-[#F0F6F2] px-2.5 py-1 rounded-xl text-xs font-bold text-[#174D32]">
              <StarRating rating={farmer.rating || 5} size="sm" />
              <span>{farmer.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-[#78897E]">({farmer.numReviews || 0})</span>
            </div>
          </div>

          <h3 className="font-bold text-lg text-[#174D32] hover:text-[#27683E] transition-colors leading-snug">
            {farmer.farmName}
          </h3>

          <p className="text-xs font-medium text-[#4A5B50] flex items-center gap-1 mt-1">
            <span>By {farmer.user?.name || 'Sustainable Producer'}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-[#174D32] font-semibold">
              <MapPin className="w-3 h-3 text-[#63A66B]" />
              {farmer.district}, {farmer.state}
            </span>
          </p>

          <p className="text-xs text-[#4A5B50] mt-2.5 line-clamp-2 leading-relaxed">
            {farmer.farmDescription}
          </p>

          {/* Highlights & Crop Types */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#DCEADF]/60 text-[#174D32] px-2.5 py-0.5 rounded-lg">
              <Sprout className="w-3 h-3 text-[#63A66B]" />
              {farmer.farmingMethod || 'Organic'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#F7F8EF] border border-[#BAD5C1]/40 text-[#4A5B50] px-2.5 py-0.5 rounded-lg">
              <Award className="w-3 h-3 text-[#E5B64B]" />
              {farmer.experienceYears || 5}+ yrs exp
            </span>
            {farmer.cropTypes?.slice(0, 2).map((crop, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-[#F0F6F2] text-[#202B24] px-2 py-0.5 rounded-lg"
              >
                {crop}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Link */}
      <div className="px-5 py-3.5 bg-[#F0F6F2]/50 border-t border-[#BAD5C1]/30 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#174D32]">
          {farmer.totalAreaAcres ? `${farmer.totalAreaAcres} Acres Farm` : 'Certified Organic'}
        </span>
        <Link
          to={`/farmers/${farmer._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#174D32] hover:text-[#63A66B] transition-colors"
        >
          <span>View Farm</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;

