import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Users, Search, ShoppingBag, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await adminAPI.getCustomers({ search, limit: 50 });
      if (res.success) {
        setCustomers(res.customers || []);
      }
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await adminAPI.toggleUserStatus(userId);
      if (res.success) {
        toast.success(res.message);
        fetchCustomers();
      }
    } catch (error) {
      toast.error('Could not toggle user status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#174D32]">Registered Consumers</h2>
          <p className="text-xs text-[#4A5B50] mt-0.5">
            Directory of consumer accounts ordering farm-fresh produce.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-8 pr-3 py-2 rounded-xl bg-white border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
            <Search className="w-3.5 h-3.5 text-[#78897E] absolute left-2.5 top-2.5" />
          </div>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchCustomers}>
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loader message="Loading consumers list..." />
      ) : customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Customers Found"
          description="No customer accounts match your search filter."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#BAD5C1]/30 bg-[#F7F8EF]/60 text-[11px] font-bold uppercase tracking-wider text-[#78897E]">
                  <th className="py-3.5 px-5">Customer</th>
                  <th className="py-3.5 px-4">Contact Email</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Orders Count</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAD5C1]/20">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-[#F0F6F2]/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#BAD5C1]/40 shrink-0"
                        />
                        <span className="font-bold text-[#174D32]">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4A5B50] font-medium">{c.email}</td>
                    <td className="py-3.5 px-4 text-[#78897E]">{c.phone || 'Not provided'}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-[#174D32] bg-[#F0F6F2] px-2.5 py-0.5 rounded-lg">
                        <ShoppingBag className="w-3 h-3 text-[#63A66B]" />
                        {c.orderCount || 0} orders
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#78897E]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(c._id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                          c.isActive
                            ? 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {c.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;

