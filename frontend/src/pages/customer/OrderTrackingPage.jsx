import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../api';
import { OrderStatusBadge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  Star,
} from 'lucide-react';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await orderAPI.getOrderById(id);
        if (res.success) {
          setOrder(res.order);
        }
      } catch (error) {
        console.error('Failed to load tracking data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return <Loader message="Tracking live harvest transit..." />;
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#174D32]">Order Not Found</h2>
        <Link to="/customer/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const steps = [
    { status: 'Pending', label: 'Order Received' },
    { status: 'Confirmed', label: 'Farmer Confirmed' },
    { status: 'Processing', label: 'Dawn Harvest & Sorting' },
    { status: 'Ready for Delivery', label: 'Eco Packaging Packed' },
    { status: 'Shipped', label: 'Out for Doorstep Delivery' },
    { status: 'Delivered', label: 'Safely Delivered' },
  ];

  const getStepIndex = (currentStatus) => {
    const idx = steps.findIndex((s) => s.status === currentStatus);
    return idx === -1 ? 0 : idx;
  };

  const currentStepIdx = getStepIndex(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/customer/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174D32] hover:text-[#63A66B]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#BAD5C1]/50 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#78897E] uppercase">Order Tracking</span>
          <h1 className="text-2xl font-extrabold text-[#174D32]">{order.orderNumber}</h1>
          <p className="text-xs text-[#4A5B50] mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.orderStatus} />
          <span className="text-xl font-black text-[#174D32]">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Visual Tracking Progress Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-[#174D32]">Harvest & Logistics Progress</h2>

        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
            This order has been cancelled. Any deducted stock has been safely returned to the farmer's inventory.
          </div>
        ) : (
          <div className="relative">
            <div className="hidden sm:grid grid-cols-6 gap-2 text-center relative z-10">
              {steps.map((st, i) => {
                const isPassed = i <= currentStepIdx;
                const isCurrent = i === currentStepIdx;

                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                        isPassed
                          ? 'bg-[#174D32] text-white'
                          : 'bg-[#F0F6F2] text-[#78897E] border border-[#BAD5C1]'
                      } ${isCurrent ? 'ring-4 ring-[#63A66B]/30' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5 text-[#E5B64B]" /> : i + 1}
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        isCurrent ? 'text-[#174D32]' : isPassed ? 'text-[#4A5B50]' : 'text-[#78897E]'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Connecting line */}
            <div className="hidden sm:block absolute top-4 left-6 right-6 h-1 bg-[#BAD5C1]/40 -z-0">
              <div
                className="h-full bg-[#174D32] transition-all duration-500"
                style={{
                  width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="sm:hidden space-y-4">
              {steps.map((st, i) => {
                const isPassed = i <= currentStepIdx;
                return (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isPassed ? 'bg-[#174D32] text-white' : 'bg-[#DCEADF] text-[#4A5B50]'
                      }`}
                    >
                      {isPassed ? '✓' : i + 1}
                    </div>
                    <span className={isPassed ? 'font-bold text-[#174D32]' : 'text-[#78897E]'}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Status Activity Log */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="pt-4 border-t border-[#BAD5C1]/30 space-y-2">
            <h3 className="text-xs font-bold text-[#78897E] uppercase tracking-wider">
              Transit Activity Log
            </h3>
            <div className="space-y-1.5 text-xs text-[#4A5B50]">
              {order.statusHistory.map((sh, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#63A66B] font-bold">•</span>
                  <span>
                    <span className="font-bold text-[#174D32]">{sh.status}</span> —{' '}
                    {new Date(sh.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                    ({new Date(sh.timestamp).toLocaleDateString()}): {sh.note || 'Status updated'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Items & Delivery Address Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#174D32] uppercase tracking-wider">
            Harvest Items ({order.items?.length})
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#BAD5C1]/40"
                  />
                  <div>
                    <p className="font-bold text-[#174D32]">{item.name}</p>
                    <p className="text-[11px] text-[#78897E]">
                      {item.quantity} {item.unit} × ₹{item.price}
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-[#174D32]">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#BAD5C1]/30 flex justify-between text-sm font-extrabold text-[#174D32]">
            <span>Total Payable:</span>
            <span>₹{order.totalAmount} (COD)</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#174D32] uppercase tracking-wider">
            Destination Address
          </h3>
          <div className="space-y-1.5 text-xs text-[#4A5B50]">
            <p className="font-bold text-[#174D32] text-sm">{order.deliveryAddress?.fullName}</p>
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#63A66B] shrink-0" />
              {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
            </p>
            <p>
              {order.deliveryAddress?.district}, {order.deliveryAddress?.state} -{' '}
              {order.deliveryAddress?.pincode}
            </p>
            <p className="pt-1">
              <span className="font-bold text-[#174D32]">Phone:</span> {order.deliveryAddress?.phone}
            </p>
            {order.orderNotes && (
              <p className="pt-2 italic text-[#78897E]">Note: "{order.orderNotes}"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;

