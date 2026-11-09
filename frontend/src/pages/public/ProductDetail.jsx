import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, reviewAPI } from '../../api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { OrganicBadge, VerificationBadge } from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import {
  ShoppingBasket,
  MapPin,
  Calendar,
  CheckCircle,
  Truck,
  Leaf,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, isAuthenticated, isCustomer } = useAuth();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review submission state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await productAPI.getProductById(id);
        if (res.success && res.product) {
          setProduct(res.product);
          if (res.product.images && res.product.images.length > 0) {
            setSelectedImage(res.product.images[0]);
          }
        }
      } catch (error) {
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product._id, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.error('Please write a brief comment');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await reviewAPI.createReview({
        productId: product._id,
        rating: ratingInput,
        comment: commentInput.trim(),
      });

      if (res.success) {
        toast.success(res.message);
        setReviewModalOpen(false);
        setCommentInput('');
        // Refresh product details to show updated reviews and rating
        const refreshed = await productAPI.getProductById(id);
        if (refreshed.product) setProduct(refreshed.product);
      }
    } catch (error) {
      toast.error(error.message || 'Could not submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return <Loader message="Fetching harvest details..." />;
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#174D32]">Product Not Found</h2>
        <p className="text-sm text-[#4A5B50]">
          The produce you are searching for is unavailable or has ended its harvest cycle.
        </p>
        <Link to="/shop">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.availableQuantity <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#78897E]">
        <Link to="/" className="hover:text-[#174D32]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-[#174D32]">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#174D32] truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full h-96 sm:h-[450px] rounded-3xl overflow-hidden bg-white border border-[#BAD5C1]/50 shadow-sm relative">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {product.isOrganic && <OrganicBadge size="md" />}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#174D32] shadow-md scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#63A66B] bg-[#DCEADF]/60 px-2.5 py-0.5 rounded-lg">
                {product.category?.name || 'Fresh Produce'}
              </span>
              <span className="text-xs text-[#78897E] flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#E5B64B]" />
                Harvested: {new Date(product.harvestDate).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174D32] tracking-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews Counter */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <StarRating rating={product.rating || 5} size="sm" />
                <span className="text-sm font-extrabold text-[#174D32]">
                  {product.rating ? product.rating.toFixed(1) : '5.0'}
                </span>
              </div>
              <span className="text-xs text-[#78897E]">•</span>
              <span className="text-xs font-medium text-[#4A5B50]">
                {product.numReviews || 0} customer reviews
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-white border border-[#BAD5C1]/60 shadow-xs flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#174D32]">₹{product.price}</span>
                <span className="text-sm text-[#4A5B50] font-bold">/{product.unit}</span>
              </div>
              <p className="text-xs text-[#63A66B] font-semibold mt-0.5">
                {isOutOfStock ? (
                  <span className="text-rose-600 font-bold">Currently Out of Stock</span>
                ) : (
                  `${product.availableQuantity} ${product.unit} fresh stock remaining`
                )}
              </p>
            </div>

            <span className="text-[11px] font-bold text-[#174D32] bg-[#F0F6F2] px-3 py-1.5 rounded-xl border border-[#BAD5C1]/40">
              Cash on Delivery (COD)
            </span>
          </div>

          {/* Quantity and Add to Cart Stepper */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#4A5B50]">Quantity ({product.unit}):</span>
              <div className="inline-flex items-center border border-[#BAD5C1] rounded-xl bg-white">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-[#174D32] hover:bg-[#F0F6F2] rounded-l-xl disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-[#174D32]">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.availableQuantity || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(product.availableQuantity, q + 1))}
                  className="p-2 text-[#174D32] hover:bg-[#F0F6F2] rounded-r-xl disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              size="lg"
              variant={isOutOfStock ? 'secondary' : 'primary'}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              icon={ShoppingBasket}
              className="w-full sm:w-auto"
            >
              {isOutOfStock ? 'Harvest Sold Out' : `Add ${quantity} ${product.unit} to Basket • ₹${product.price * quantity}`}
            </Button>
          </div>

          {/* Farmer Card Summary */}
          {product.farmerProfile && (
            <div className="p-5 rounded-3xl bg-[#F0F6F2] border border-[#BAD5C1]/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={product.farmerProfile.profileImage || product.farmer?.avatar}
                    alt={product.farmerProfile.farmName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#174D32]">
                      {product.farmerProfile.farmName}
                    </h4>
                    <p className="text-xs text-[#4A5B50] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#63A66B]" />
                      {product.farmerProfile.district}, {product.farmerProfile.state}
                    </p>
                  </div>
                </div>
                <VerificationBadge status={product.farmerProfile.verificationStatus} />
              </div>

              <p className="text-xs text-[#4A5B50] line-clamp-2 leading-relaxed">
                {product.farmerProfile.farmDescription}
              </p>

              <Link
                to={`/farmers/${product.farmerProfile._id}`}
                className="text-xs font-bold text-[#174D32] hover:text-[#63A66B] flex items-center gap-1 pt-1"
              >
                <span>View Complete Farm Profile & Other Harvests</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold text-[#174D32] uppercase tracking-wider">
              About This Crop
            </h3>
            <p className="text-sm text-[#4A5B50] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#BAD5C1]/50 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#BAD5C1]/30">
          <div>
            <h2 className="text-2xl font-extrabold text-[#174D32]">
              Customer Reviews & Ratings
            </h2>
            <p className="text-xs text-[#4A5B50] mt-1">
              Verified feedback from families who enjoyed this harvest.
            </p>
          </div>

          {isAuthenticated && isCustomer ? (
            <Button
              variant="secondary"
              size="sm"
              icon={MessageSquare}
              onClick={() => setReviewModalOpen(true)}
            >
              Write a Review
            </Button>
          ) : !isAuthenticated ? (
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign in to review
              </Button>
            </Link>
          ) : null}
        </div>

        {/* Reviews List */}
        {!product.reviewsList || product.reviewsList.length === 0 ? (
          <div className="text-center py-8 text-[#78897E] text-sm">
            No customer reviews yet. Be the first to order and review this farm's harvest!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviewsList.map((rev) => (
              <div
                key={rev._id}
                className="p-5 rounded-2xl bg-[#F7F8EF]/60 border border-[#BAD5C1]/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        rev.user?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={rev.user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#174D32]">{rev.user?.name}</h4>
                      <p className="text-[10px] text-[#78897E]">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-[#4A5B50] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Share Your Farm Harvest Experience"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1.5">
              Select Your Rating:
            </label>
            <StarRating
              rating={ratingInput}
              interactive={true}
              size="md"
              onChange={(newRate) => setRatingInput(newRate)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1.5">
              Your Review / Comments:
            </label>
            <textarea
              rows={4}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Tell others about freshness, taste, and packaging..."
              required
              className="w-full p-3 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmittingReview}
            >
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductDetail;

