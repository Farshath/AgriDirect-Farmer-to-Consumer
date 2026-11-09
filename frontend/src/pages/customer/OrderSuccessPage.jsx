import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { orderAPI } from '../../api';
import Button from '../../components/common/Button';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, ShoppingBasket, Calendar } from 'lucide-react';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!order && id) {
      orderAPI.getOrderById(id).then((res) => {
        if (res.order) setOrder(res.order);
      });
    }
  }, [id, order]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-[#DCEADF] flex items-center justify-center text-[#174D32] shadow-lg animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-12 h-12 text-[#63A66B]" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
          Direct Farmer Order Dispatched to Field
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#174D32]">
          Harvest Order Confirmed!
        </h1>
        <p className="text-sm text-[#4A5B50] max-w-md mx-auto leading-relaxed">
          Thank you for supporting ethical, sustainable farmers. Your produce is scheduled for daybreak harvest.
        </p>
      </div>

      {/* Details Box */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#BAD5C1]/60 shadow-xs text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#BAD5C1]/30 gap-2">
            <div>
              <span className="text-[11px] text-[#78897E] uppercase font-bold">Order Identifier</span>
              <p className="text-base font-extrabold text-[#174D32]">{order.orderNumber}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] text-[#78897E] uppercase font-bold">Total Amount</span>
              <p className="text-base font-extrabold text-[#174D32]">₹{order.totalAmount} (COD)</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-[#4A5B50]">
              <span className="font-bold text-[#174D32]">Delivery Recipient:</span> {order.deliveryAddress?.fullName} ({order.deliveryAddress?.phone})
            </p>
            <p className="text-[#4A5B50]">
              <span className="font-bold text-[#174D32]">Delivery Location:</span> {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.district} - {order.deliveryAddress?.pincode}
            </p>
            <p className="text-[#4A5B50] flex items-center gap-1.5 pt-1">
              <Calendar className="w-3.5 h-3.5 text-[#E5B64B]" />
              <span className="font-bold text-[#174D32]">Estimated Delivery:</span> Tomorrow morning before 11:00 AM
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link to={`/customer/orders/${id || order?._id}`}>
          <Button variant="primary" size="md" icon={Truck}>
            Track Order Live
          </Button>
        </Link>
        <Link to="/shop">
          <Button variant="secondary" size="md" icon={ShoppingBasket}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

