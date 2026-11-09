import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { farmerAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/cards/StatCard';
import { OrderStatusBadge, VerificationBadge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  IndianRupee,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const FarmerOverview = () => {
  const { farmerProfile } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await farmerAPI.getDashboard();
        if (res.success) {
          setDashboardData(res);
        }
      } catch (error) {
        console.error('Failed to load farmer dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return <Loader message="Compiling farm analytics..." />;
  }

  const stats = dashboardData?.stats || {};
  const monthlySales = dashboardData?.monthlySales || [];
  const recentOrders = dashboardData?.recentOrders || [];

  return (
    <div className="space-y-8">
      {/* Verification Notice Banner */}
      {stats.verificationStatus !== 'APPROVED' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Farm Verification Status: {stats.verificationStatus}</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                {stats.verificationStatus === 'PENDING'
                  ? 'Your land records and documents are being reviewed by administration. Once approved, your products will appear live to shoppers.'
                  : 'Your verification was not approved. Please review your rejection note and resubmit documents.'}
              </p>
            </div>
          </div>
          <Link to="/farmer/profile">
            <Button variant="secondary" size="sm" className="shrink-0 border-amber-300 text-amber-900 bg-white">
              Update Profile
            </Button>
          </Link>
        </div>
      )}

      {/* 6 Top Metric StatCards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts || 0}
          subtitle={`${stats.activeProducts || 0} active in shop`}
          icon={Package}
          color="forest"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          subtitle="All-time received"
          icon={ShoppingBag}
          color="leaf"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders || 0}
          subtitle="Awaiting harvest"
          icon={Clock}
          color="gold"
        />
        <StatCard
          title="Completed"
          value={stats.completedOrders || 0}
          subtitle="Delivered to homes"
          icon={CheckCircle2}
          color="leaf"
        />
        <StatCard
          title="Total Earnings"
          value={`₹${stats.totalEarnings || 0}`}
          subtitle="Direct farmer revenue"
          icon={IndianRupee}
          color="forest"
        />
        <StatCard
          title="Farm Rating"
          value={`${stats.rating ? stats.rating.toFixed(1) : '5.0'} ★`}
          subtitle="Customer satisfaction"
          icon={TrendingUp}
          color="gold"
        />
      </div>

      {/* Analytics Chart & Quick Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#BAD5C1]/30">
            <div>
              <h3 className="font-extrabold text-base text-[#174D32]">Revenue Trends</h3>
              <p className="text-xs text-[#78897E]">Monthly earnings (Past 6 Months)</p>
            </div>
            <span className="text-xs font-bold text-[#63A66B] bg-[#F0F6F2] px-3 py-1 rounded-xl">
              Real MongoDB Data
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEED7" />
                <XAxis dataKey="month" stroke="#78897E" fontSize={11} />
                <YAxis stroke="#78897E" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #BAD5C1',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="sales" fill="#174D32" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Received Orders */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#BAD5C1]/30">
              <h3 className="font-extrabold text-base text-[#174D32]">Recent Orders</h3>
              <Link to="/farmer/orders" className="text-xs font-bold text-[#63A66B] hover:text-[#174D32]">
                View All
              </Link>
            </div>

            <div className="divide-y divide-[#BAD5C1]/30 pt-2">
              {recentOrders.length === 0 ? (
                <p className="text-xs text-center text-[#78897E] py-8">
                  No orders received yet. Active products will appear in the shop!
                </p>
              ) : (
                recentOrders.map((ord) => (
                  <div key={ord._id} className="py-3 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#174D32]">{ord.orderNumber}</p>
                      <p className="text-[11px] text-[#78897E]">
                        Customer: {ord.customer?.name} • {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <OrderStatusBadge status={ord.orderStatus} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link to="/farmer/products/new" className="pt-2">
            <Button variant="primary" size="sm" icon={PlusCircle} className="w-full">
              List New Crop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerOverview;

