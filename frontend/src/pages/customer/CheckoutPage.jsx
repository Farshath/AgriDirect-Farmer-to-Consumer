import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../api';
import Button from '../../components/common/Button';
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, summary, refreshCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setDeliveryAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // If basket is empty, redirect back to cart
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#174D32]">Your Basket is Empty</h2>
        <p className="text-xs text-[#4A5B50]">Add products to your basket before proceeding to checkout.</p>
        <Link to="/shop">
          <Button variant="primary">Shop Products</Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (
      !deliveryAddress.fullName ||
      !deliveryAddress.phone ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode
    ) {
      toast.error('Please complete all required address fields');
      return;
    }

    if (paymentMethod === 'ONLINE') {
      toast.error('Online Payment Gateway integration requires merchant credentials. Please select Cash on Delivery.');
      return;
    }

    try {
      setIsSubmitting(true);

      const itemsPayload = cart.items.map((it) => ({
        productId: it.product._id,
        quantity: it.quantity,
      }));

      const res = await orderAPI.createOrder({
        items: itemsPayload,
        deliveryAddress,
        paymentMethod: 'COD',
        orderNotes,
      });

      if (res.success && res.order) {
        await refreshCart();
        toast.success('Harvest order confirmed! 🌾');
        navigate(`/order-success/${res.order._id}`, { state: { order: res.order } });
      }
    } catch (error) {
      toast.error(error.message || 'Could not place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174D32] hover:text-[#63A66B]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Basket</span>
        </Link>
      </div>

      <div className="border-b border-[#BAD5C1]/40 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
          Direct Delivery
        </span>
        <h1 className="text-3xl font-extrabold text-[#174D32] tracking-tight">
          Checkout & Harvest Confirmation
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Delivery Address Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#BAD5C1]/60 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#BAD5C1]/30">
              <div className="w-8 h-8 rounded-xl bg-[#DCEADF] text-[#174D32] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#174D32]">1. Doorstep Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress.fullName}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, fullName: e.target.value })}
                  placeholder="e.g. Priya Deshmukh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                  placeholder="+91 99887 76655"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Street Address / Flat / Society *
              </label>
              <input
                type="text"
                required
                value={deliveryAddress.street}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                placeholder="e.g. Flat 402, Green Meadows, Baner Road"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">City / Town *</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">District *</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress.district}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress.pincode}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                  placeholder="411045"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Order Delivery Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Special delivery instructions, gate code, or doorstep preferences..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>
          </div>

          {/* 2. Payment Method Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#BAD5C1]/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#BAD5C1]/30">
              <div className="w-8 h-8 rounded-xl bg-[#DCEADF] text-[#174D32] flex items-center justify-center">
                <Banknote className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#174D32]">2. Payment Method</h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery (Active) */}
              <label className="flex items-start gap-4 p-4 rounded-2xl border-2 border-[#174D32] bg-[#F0F6F2] cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-[#174D32] focus:ring-[#63A66B]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#174D32]">
                    <Banknote className="w-4 h-4 text-[#63A66B]" />
                    <span>Cash on Delivery (COD)</span>
                    <span className="text-[10px] font-extrabold bg-[#63A66B] text-white px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-[#4A5B50] leading-relaxed">
                    Pay securely in cash or UPI QR upon receiving and inspecting your fresh produce at your doorstep.
                  </p>
                </div>
              </label>

              {/* Online Gateway (Future expandable) */}
              <label className="flex items-start gap-4 p-4 rounded-2xl border border-[#BAD5C1]/50 bg-slate-50 opacity-60 cursor-not-allowed">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  disabled
                  className="mt-1"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#78897E]">
                    <CreditCard className="w-4 h-4" />
                    <span>Online UPI / Card Payment (Coming Soon)</span>
                  </div>
                  <p className="text-[11px] text-[#78897E]">
                    Gateway module structured for Razorpay/Stripe; requires active API credentials.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Review & Confirmation Action */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#BAD5C1]/60 shadow-xs space-y-6">
          <h3 className="font-extrabold text-base text-[#174D32] pb-3 border-b border-[#BAD5C1]/30">
            Review Your Harvest Order
          </h3>

          {/* Items breakdown */}
          <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-[#BAD5C1]/20 pr-1">
            {cart.items.map((it) => (
              <div key={it._id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={it.product?.images?.[0]}
                    alt={it.product?.name}
                    className="w-10 h-10 rounded-lg object-cover border border-[#BAD5C1]/40 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-[#174D32] truncate">{it.product?.name}</p>
                    <p className="text-[#78897E]">
                      {it.quantity} {it.product?.unit} × ₹{it.product?.price}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#174D32] shrink-0">
                  ₹{it.product?.price * it.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Financial summary */}
          <div className="space-y-2 pt-3 border-t border-[#BAD5C1]/30 text-xs">
            <div className="flex justify-between text-[#4A5B50]">
              <span>Produce Subtotal</span>
              <span className="font-semibold text-[#202B24]">₹{summary.subtotal}</span>
            </div>
            <div className="flex justify-between text-[#4A5B50]">
              <span>Delivery Charge</span>
              <span className="font-semibold text-[#202B24]">
                {summary.deliveryCharge === 0 ? (
                  <span className="text-[#63A66B] font-bold">FREE</span>
                ) : (
                  `₹${summary.deliveryCharge}`
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-[#BAD5C1]/30 flex justify-between text-base font-extrabold text-[#174D32]">
              <span>Total Payable</span>
              <span className="text-xl">₹{summary.total}</span>
            </div>
          </div>

          {/* Quality badge */}
          <div className="p-3.5 rounded-2xl bg-[#DCEADF]/50 border border-[#BAD5C1]/40 text-xs text-[#174D32] flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#63A66B] shrink-0" />
            <span className="leading-snug">
              Protected by AgriDirect Quality Promise. 100% fresh replacement if damaged.
            </span>
          </div>

          {/* Confirm Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full text-sm"
          >
            Confirm & Place Order (₹{summary.total})
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

