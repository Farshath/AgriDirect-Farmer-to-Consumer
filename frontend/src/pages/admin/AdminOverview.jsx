import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import StatCard from '../../components/cards/StatCard';
import { OrderStatusBadge, VerificationBadge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  Users,
  ShieldCheck,
  Clock,
  Package,
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setIsLoading(true);
        const res = await adminAPI.getDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (error) {
        console.error('Failed to load admin dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (isLoading) {
    return <Loader message="Aggregating marketplace platform intelligence..." />;
  }

  const stats = data?.stats || {};
  const monthlyAnalytics = data?.monthlyAnalytics || [];
  const pendingApplications = data?.pendingApplications || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-8">
      {/* 8 Platform StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Farmers"
          value={stats.totalFarmers || 0}
          subtitle={`${stats.verifiedFarmers || 0} verified`}
          icon={Users}
          color="forest"
        />
        <StatCard
          title="Pending Verifications"
          value={stats.pendingFarmers || 0}
          subtitle="Requires admin review"
          icon={Clock}
          color="gold"
        />
        <StatCard
          title="Total Consumers"
          value={stats.totalCustomers || 0}
          subtitle="Registered households"
          icon={Users}
          color="leaf"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts || 0}
          subtitle={`${stats.activeProducts || 0} active listings`}
          icon={Package}
          color="forest"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          subtitle="All platform orders"
          icon={ShoppingBag}
          color="leaf"
        />
        <StatCard
          title="Fulfilled Orders"
          value={stats.completedOrders || 0}
          subtitle={`${stats.fulfilmentRate || 100}% fulfilment rate`}
          icon={CheckCircle2}
          color="forest"
        />
        <StatCard
          title="Cancelled Orders"
          value={stats.cancelledOrders || 0}
          subtitle="Refunded / returned"
          icon={Clock}
          color="rose"
        />
        <StatCard
          title="Gross Sales (GMV)"
          value={`₹${stats.totalSales || 0}`}
          subtitle="Total marketplace volume"
          icon={IndianRupee}
          color="gold"
        />
      </div>

      {/* Analytics Chart & Pending Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#BAD5C1]/30">
            <div>
              <h3 className="font-extrabold text-base text-[#174D32]">Platform Gross Volume</h3>
              <p className="text-xs text-[#78897E]">Monthly transaction volume (Past 6 Months)</p>
            </div>
            <span className="text-xs font-bold text-[#63A66B] bg-[#F0F6F2] px-3 py-1 rounded-xl">
              Live MongoDB Data
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAnalytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEED7" />
                <XAxis dataKey="month" stroke="#78897E" fontSize={11} />
                <YAxis stroke="#78897E" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(val) => [`₹${val}`, 'Gross Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #BAD5C1',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#174D32"
                  strokeWidth={3}
                  dot={{ fill: '#E5B64B', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Farmer Verifications */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#BAD5C1]/30">
              <h3 className="font-extrabold text-base text-[#174D32]">Verification Queue</h3>
              <Link to="/admin/verification" className="text-xs font-bold text-[#63A66B] hover:text-[#174D32]">
                Inspect All ({stats.pendingFarmers || 0})
              </Link>
            </div>

            <div className="divide-y divide-[#BAD5C1]/30 pt-1">
              {pendingApplications.length === 0 ? (
                <p className="text-xs text-center text-[#78897E] py-8">
                  All farmer applications are currently verified!
                </p>
              ) : (
                pendingApplications.map((app) => (
                  <div key={app._id} className="py-3 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#174D32]">{app.farmName}</p>
                      <p className="text-[11px] text-[#78897E]">
                        Farmer: {app.user?.name} • {app.district}, {app.state}
                      </p>
                    </div>
                    <Link to="/admin/verification">
                      <Button variant="secondary" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link to="/admin/verification" className="pt-2">
            <Button variant="primary" size="sm" icon={ShieldCheck} className="w-full">
              Manage Farmer Approvals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

