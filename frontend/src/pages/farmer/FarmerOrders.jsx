import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../api';
import { OrderStatusBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { ShoppingBag, Phone, MapPin, Eye, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Status update modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await orderAPI.getFarmerOrders(params);
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (error) {
      toast.error('Failed to load farmer orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setStatusNote('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !newStatus) return;

    try {
      setIsUpdating(true);
      const res = await orderAPI.updateOrderStatus(selectedOrder._id, newStatus, statusNote);
      if (res.success) {
        toast.success(`Order ${selectedOrder.orderNumber} updated to ${newStatus}`);
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.message || 'Could not update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const allowedStatuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Ready for Delivery',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="space-y-6">
      {/* Header & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#174D32]">Received Harvest Orders</h2>
          <p className="text-xs text-[#4A5B50] mt-0.5">
            Confirm new orders, update harvest packing status, and coordinate deliveries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-[#BAD5C1] text-xs font-semibold text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
          >
            <option value="">All Statuses</option>
            {allowedStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchOrders}>
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loader message="Loading received harvest orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Found"
          description={
            statusFilter
              ? `No orders matching status "${statusFilter}".`
              : 'You have not received any orders yet. As soon as a customer orders your crop, it will appear here.'
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-[#BAD5C1]/50 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#BAD5C1]/30 gap-2">
                <div>
                  <span className="font-extrabold text-sm text-[#174D32]">{order.orderNumber}</span>
                  <span className="text-xs text-[#78897E] block sm:inline-block sm:ml-3">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.orderStatus} />
                  <span className="text-base font-extrabold text-[#174D32]">
                    My Earnings: ₹{order.myEarnings}
                  </span>
                </div>
              </div>

              {/* Items & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Crops in this order */}
                <div className="md:col-span-7 space-y-2">
                  <span className="text-[11px] font-bold text-[#78897E] uppercase block">
                    Crops to Harvest & Pack:
                  </span>
                  <div className="space-y-2">
                    {order.myItems?.map((it, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-[#F7F8EF] p-2.5 rounded-xl border border-[#BAD5C1]/30 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={it.image}
                            alt={it.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#BAD5C1]/40"
                          />
                          <div>
                            <p className="font-bold text-[#174D32]">{it.name}</p>
                            <p className="text-[#4A5B50] text-[11px]">
                              Quantity: <span className="font-extrabold">{it.quantity} {it.unit}</span>
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#174D32]">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="md:col-span-5 bg-[#F0F6F2]/60 p-4 rounded-2xl border border-[#BAD5C1]/40 text-xs space-y-2">
                  <span className="text-[11px] font-bold text-[#78897E] uppercase block">
                    Customer Information:
                  </span>
                  <p className="font-bold text-[#174D32]">{order.deliveryAddress?.fullName}</p>
                  <p className="text-[#4A5B50] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#63A66B]" />
                    {order.deliveryAddress?.phone}
                  </p>
                  <p className="text-[#4A5B50] flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#63A66B] shrink-0 mt-0.5" />
                    <span>
                      {order.deliveryAddress?.street}, {order.deliveryAddress?.city},{' '}
                      {order.deliveryAddress?.district} ({order.deliveryAddress?.pincode})
                    </span>
                  </p>
                  {order.orderNotes && (
                    <p className="text-[11px] text-[#78897E] italic pt-1 border-t border-[#BAD5C1]/20">
                      Note: "{order.orderNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex justify-between items-center border-t border-[#BAD5C1]/30">
                <span className="text-xs text-[#78897E]">
                  Payment: <span className="font-bold text-[#174D32]">{order.paymentMethod}</span> ({order.paymentStatus})
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleOpenStatusModal(order)}
                >
                  Update Order Status
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Order Status Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Update Order Status: ${selectedOrder?.orderNumber}`}
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1.5">
              Select Current Harvest Stage *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs font-bold text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            >
              {allowedStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1.5">
              Status Note / Dispatch Details (Sent to Customer)
            </label>
            <textarea
              rows={3}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Harvested at sunrise, packaged in perforated eco-crates for afternoon courier..."
              className="w-full p-3 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setSelectedOrder(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isUpdating}
            >
              Save New Status
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FarmerOrders;

