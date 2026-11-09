import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../api';
import { OrderStatusBadge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { ShoppingBag, ChevronRight, Calendar, Package } from 'lucide-react';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await orderAPI.getMyOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <Loader message="Fetching your harvest history..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={Package}
          title="No Orders Yet"
          description="You haven't placed any orders yet. Experience direct farm harvest delivery today!"
          actionLabel="Explore Farm Products"
          onAction={() => (window.location.href = '/shop')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
          Purchase History
        </span>
        <h1 className="text-3xl font-extrabold text-[#174D32] tracking-tight">
          My Farm Harvest Orders
        </h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl p-6 border border-[#BAD5C1]/50 shadow-xs hover:shadow-md transition-shadow space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#BAD5C1]/30 gap-2">
              <div>
                <span className="text-xs font-bold text-[#174D32]">{order.orderNumber}</span>
                <span className="text-xs text-[#78897E] block sm:inline-block sm:ml-3">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.orderStatus} />
                <span className="text-sm font-extrabold text-[#174D32]">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Items preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#F7F8EF] p-2.5 rounded-2xl border border-[#BAD5C1]/30">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#BAD5C1]/40 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#174D32] truncate">{item.name}</p>
                    <p className="text-[11px] text-[#4A5B50]">
                      {item.quantity} {item.unit} • ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-[#4A5B50] font-medium">
                Destination: {order.deliveryAddress?.city}, {order.deliveryAddress?.district}
              </span>
              <Link to={`/customer/orders/${order._id}`}>
                <Button variant="secondary" size="sm" icon={ChevronRight}>
                  Track Order
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrders;

