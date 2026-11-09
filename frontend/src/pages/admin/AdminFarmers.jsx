import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { VerificationBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Users, Search, MapPin, Power, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchFarmers = async () => {
    try {
      setIsLoading(true);
      const res = await adminAPI.getFarmers({ search, limit: 50 });
      if (res.success) {
        setFarmers(res.farmers || []);
      }
    } catch (error) {
      toast.error('Failed to load farmers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, [search]);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await adminAPI.toggleUserStatus(userId);
      if (res.success) {
        toast.success(res.message);
        fetchFarmers();
      }
    } catch (error) {
      toast.error('Could not toggle user status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#174D32]">All Registered Farmers</h2>
          <p className="text-xs text-[#4A5B50] mt-0.5">
            Directory of agricultural producers and account active states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farm or owner..."
              className="pl-8 pr-3 py-2 rounded-xl bg-white border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
            <Search className="w-3.5 h-3.5 text-[#78897E] absolute left-2.5 top-2.5" />
          </div>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchFarmers}>
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loader message="Loading farmers roster..." />
      ) : farmers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Farmers Found"
          description="No farmer records matching your criteria."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#BAD5C1]/30 bg-[#F7F8EF]/60 text-[11px] font-bold uppercase tracking-wider text-[#78897E]">
                  <th className="py-3.5 px-5">Farm Name</th>
                  <th className="py-3.5 px-4">Owner Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAD5C1]/20">
                {farmers.map((f) => (
                  <tr key={f._id} className="hover:bg-[#F0F6F2]/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={f.profileImage || f.user?.avatar}
                          alt={f.farmName}
                          className="w-9 h-9 rounded-xl object-cover border border-[#BAD5C1]/40 shrink-0"
                        />
                        <span className="font-bold text-[#174D32]">{f.farmName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#202B24]">{f.user?.name}</td>
                    <td className="py-3.5 px-4 text-[#78897E]">
                      <p>{f.user?.email}</p>
                      <p>{f.user?.phone || 'No phone'}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#4A5B50]">
                      {f.district}, {f.state}
                    </td>
                    <td className="py-3.5 px-4">
                      <VerificationBadge status={f.verificationStatus} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          f.user?.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {f.user?.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {f.user && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(f.user._id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                            f.user?.isActive
                              ? 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {f.user?.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
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

export default AdminFarmers;

