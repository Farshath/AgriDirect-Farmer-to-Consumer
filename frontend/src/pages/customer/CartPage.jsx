import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import {
  ShoppingBasket,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';

const CartPage = () => {
  const { cart, summary, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBasket}
          title="Your Harvest Basket is Empty"
          description="You haven't added any farm fresh produce to your basket yet. Discover seasonal crops harvested directly by local farmers."
          actionLabel="Explore Farm Products"
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  const freeDeliveryThreshold = 500;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - summary.subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((summary.subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
          Direct from Growers
        </span>
        <h1 className="text-3xl font-extrabold text-[#174D32] tracking-tight">
          Your Fresh Harvest Basket
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free delivery announcement bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#BAD5C1]/50 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#174D32] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#63A66B]" />
                {amountNeededForFree > 0
                  ? `Add ₹${amountNeededForFree} more for FREE Delivery!`
                  : '🎉 You have unlocked FREE Harvest Delivery!'}
              </span>
              <span className="text-[#78897E]">{freeDeliveryProgress}%</span>
            </div>
            <div className="w-full bg-[#DCEADF]/50 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#63A66B] h-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 overflow-hidden shadow-xs divide-y divide-[#BAD5C1]/30">
            {cart.items.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={item._id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Image & Title */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        product.images?.[0] ||
                        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={product.name}
                      className="w-18 h-18 rounded-2xl object-cover shrink-0 border border-[#BAD5C1]/40"
                    />
                    <div>
                      <Link to={`/products/${product._id}`}>
                        <h3 className="font-bold text-sm sm:text-base text-[#174D32] hover:text-[#27683E] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#78897E] mt-0.5">
                        Sold by: <span className="font-semibold text-[#4A5B50]">{product.farmer?.name || 'Local Farm'}</span>
                      </p>
                      <div className="text-xs font-extrabold text-[#174D32] mt-1 sm:hidden">
                        ₹{product.price} / {product.unit}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Stepper */}
                    <div className="inline-flex items-center border border-[#BAD5C1] rounded-xl bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1.5 text-[#174D32] hover:bg-[#F0F6F2] rounded-l-xl"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-[#174D32]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1.5 text-[#174D32] hover:bg-[#F0F6F2] rounded-r-xl"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total for item */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-extrabold text-[#174D32]">
                        ₹{product.price * item.quantity}
                      </span>
                      <span className="text-[10px] text-[#78897E] block">
                        (₹{product.price}/{product.unit})
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-[#78897E] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs font-bold text-[#174D32] hover:text-[#63A66B] flex items-center gap-1"
            >
              ← Continue Shopping Fresh Produce
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Empty Basket
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#BAD5C1]/60 shadow-xs space-y-5">
          <h3 className="font-extrabold text-base text-[#174D32] pb-3 border-b border-[#BAD5C1]/30">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-[#4A5B50]">
              <span>Items Total ({summary.itemCount} items)</span>
              <span className="font-semibold text-[#202B24]">₹{summary.subtotal}</span>
            </div>

            <div className="flex justify-between text-[#4A5B50]">
              <span className="flex items-center gap-1">
                <span>Doorstep Delivery Charge</span>
              </span>
              <span className="font-semibold">
                {summary.deliveryCharge === 0 ? (
                  <span className="text-[#63A66B] font-bold">FREE</span>
                ) : (
                  `₹${summary.deliveryCharge}`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#BAD5C1]/30 flex justify-between text-sm font-extrabold text-[#174D32]">
              <span>Final Total</span>
              <span className="text-lg">₹{summary.total}</span>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="p-3 rounded-2xl bg-[#F0F6F2] border border-[#BAD5C1]/40 text-xs text-[#174D32] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#63A66B] shrink-0" />
            <span>Pay on delivery (COD) after inspecting harvest freshness.</span>
          </div>

          {/* Proceed to Checkout CTA */}
          <Link to="/checkout" className="block">
            <Button variant="primary" size="lg" className="w-full" icon={ArrowRight}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

