import React, { useState, useEffect } from 'react';
import { adminAPI, orderAPI } from '../../api';
import { OrderStatusBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { ShoppingBag, Search, Eye, RefreshCw, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const res = await adminAPI.getOrders(params);
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (error) {
      toast.error('Failed to load master orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleOpenModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !newStatus) return;

    try {
      setIsUpdating(true);
      const res = await orderAPI.updateOrderStatus(selectedOrder._id, newStatus, 'Status modified by platform administrator');
      if (res.success) {
        toast.success(`Order #${selectedOrder.orderNumber} updated to ${newStatus}`);
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.message || 'Could not update status');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#174D32]">Master Platform Orders</h2>
          <p className="text-xs text-[#4A5B50] mt-0.5">
            Audit customer orders, delivery tracking, and resolve fulfillment bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order # or city..."
              className="pl-8 pr-3 py-2 rounded-xl bg-white border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
            <Search className="w-3.5 h-3.5 text-[#78897E] absolute left-2.5 top-2.5" />
          </div>

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
        <Loader message="Loading platform orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Found"
          description="No orders currently match the selected criteria."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#BAD5C1]/30 bg-[#F7F8EF]/60 text-[11px] font-bold uppercase tracking-wider text-[#78897E]">
                  <th className="py-3.5 px-5">Order #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total (COD)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAD5C1]/20">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#F0F6F2]/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#174D32]">{ord.orderNumber}</td>
                    <td className="py-3.5 px-4 text-[#78897E]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#202B24]">{ord.customer?.name}</p>
                      <p className="text-[10px] text-[#78897E]">{ord.deliveryAddress?.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#4A5B50]">
                      {ord.deliveryAddress?.city}, {ord.deliveryAddress?.district}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#174D32]">
                      {ord.items?.length || 0} items
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#174D32]">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={ord.orderStatus} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Eye}
                        onClick={() => handleOpenModal(ord)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect & Override Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details: ${selectedOrder?.orderNumber}`}
        maxWidth="max-w-xl"
      >
        {selectedOrder && (
          <form onSubmit={handleStatusChange} className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#BAD5C1]/30">
              <div>
                <p className="font-bold text-[#174D32]">
                  Customer: {selectedOrder.customer?.name} ({selectedOrder.deliveryAddress?.phone})
                </p>
                <p className="text-[#4A5B50] mt-0.5">
                  Address: {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}
                </p>
              </div>
              <OrderStatusBadge status={selectedOrder.orderStatus} />
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="font-bold text-[#174D32] uppercase tracking-wider block">
                Ordered Produce:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedOrder.items?.map((it, i) => (
                  <div key={i} className="flex justify-between p-2 rounded-xl bg-[#F7F8EF]">
                    <span>
                      {it.name} ({it.quantity} {it.unit})
                    </span>
                    <span className="font-bold text-[#174D32]">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Override */}
            <div className="pt-2 border-t border-[#BAD5C1]/30">
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Admin Status Override:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#BAD5C1] text-xs font-bold text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              >
                {allowedStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isUpdating}
              >
                Update Status
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;

