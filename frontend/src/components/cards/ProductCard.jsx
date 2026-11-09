import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { OrganicBadge } from '../common/Badge';
import Button from '../common/Button';
import StarRating from '../common/StarRating';
import { MapPin, ShoppingBasket, Calendar, UserCheck, Check, Sparkles } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';

  const isOutOfStock = product.availableQuantity <= 0;

  const formatHarvestDate = (date) => {
    if (!date) return 'Recently Harvested';
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Harvested Today';
    if (diffDays === 1) return 'Harvested Yesterday';
    if (diffDays < 30) return `Harvested ${diffDays}d ago`;

    return `Harvested ${d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    })}`;
  };

  const farmerName =
    product.farmer?.name ||
    product.farmerProfile?.user?.name ||
    'Verified Farmer';

  const locationDisplay =
    [product.village, product.district].filter(Boolean).join(', ') ||
    product.farmLocation ||
    product.district ||
    'India';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAdding) return;

    try {
      setIsAdding(true);
      await addToCart(product._id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#BAD5C1]/60 shadow-[0_4px_20px_-4px_rgba(23,77,50,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(23,77,50,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image & Badges */}
      <div className="relative w-full h-52 overflow-hidden bg-[#F7F8EF]">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start pointer-events-none">
          {product.isOrganic && (
            <div className="shadow-xs backdrop-blur-xs">
              <OrganicBadge size="sm" />
            </div>
          )}
          {product.category?.name && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-[#174D32] shadow-xs backdrop-blur-xs border border-[#BAD5C1]/40">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Harvest Date Tag */}
        <div className="absolute bottom-2.5 right-2.5 bg-[#202B24]/85 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
          <Calendar className="w-3 h-3 text-[#E5B64B]" />
          <span>{formatHarvestDate(product.harvestDate)}</span>
        </div>

        {/* Stock Status Pill if Low or Out of Stock */}
        {isOutOfStock ? (
          <div className="absolute top-2.5 right-2.5 bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
            Sold Out
          </div>
        ) : product.availableQuantity <= 10 ? (
          <div className="absolute top-2.5 right-2.5 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            Only {product.availableQuantity} left
          </div>
        ) : null}
      </div>

      {/* Product Card Body */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div className="space-y-2">
          {/* Farmer & Location */}
          <div className="flex flex-col gap-1 border-b border-[#BAD5C1]/30 pb-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#174D32] flex items-center gap-1.5 truncate max-w-[160px]" title={farmerName}>
                <UserCheck className="w-3.5 h-3.5 text-[#63A66B] shrink-0" />
                <span className="truncate">{farmerName}</span>
              </span>
              <span className="text-[11px] text-[#4A5B50] font-semibold flex items-center gap-1 truncate max-w-[130px]" title={locationDisplay}>
                <MapPin className="w-3 h-3 text-[#63A66B] shrink-0" />
                <span className="truncate">{locationDisplay}</span>
              </span>
            </div>
            {product.farmerProfile?.farmName && (
              <span className="text-[11px] text-[#78897E] italic truncate">
                {product.farmerProfile.farmName}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/products/${product._id}`}>
            <h3
              className="font-bold text-[#202B24] group-hover:text-[#174D32] transition-colors line-clamp-1 text-base leading-snug"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating || 5} size="sm" />
            <span className="text-xs font-bold text-[#202B24]">
              {product.rating ? product.rating.toFixed(1) : '5.0'}
            </span>
            <span className="text-xs text-[#78897E]">
              ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {/* Pricing, Available Stock & Add to Cart */}
        <div className="pt-2.5 border-t border-[#BAD5C1]/40 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-[#174D32]">
                ₹{product.price}
              </span>
              <span className="text-xs text-[#4A5B50] font-semibold">
                /{product.unit || 'kg'}
              </span>
            </div>
            <div className="text-[11px] font-semibold">
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold">Out of stock</span>
              ) : (
                <span className="text-[#63A66B] font-medium">
                  {product.availableQuantity} {product.unit} available
                </span>
              )}
            </div>
          </div>

          <Button
            size="sm"
            variant={isOutOfStock ? 'secondary' : justAdded ? 'secondary' : 'primary'}
            disabled={isOutOfStock || isAdding}
            onClick={handleAddToCart}
            icon={justAdded ? Check : ShoppingBasket}
            className={`shrink-0 transition-all ${
              justAdded
                ? 'bg-emerald-50 text-emerald-700 border-emerald-400'
                : ''
            }`}
          >
            {isOutOfStock
              ? 'Sold Out'
              : justAdded
              ? 'Added'
              : isAdding
              ? 'Adding...'
              : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
