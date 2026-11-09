import React, { useState, useEffect } from 'react';
import { farmerAPI, orderAPI } from '../../api';
import StatCard from '../../components/cards/StatCard';
import { Loader } from '../../components/common/Loader';
import { IndianRupee, CheckCircle2, TrendingUp, ShieldCheck, Download, Banknote } from 'lucide-react';

const FarmerEarnings = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setIsLoading(true);
        const [dashRes, ordRes] = await Promise.all([
          farmerAPI.getDashboard().catch(() => ({ stats: {} })),
          orderAPI.getFarmerOrders().catch(() => ({ orders: [] })),
        ]);

        if (dashRes.stats) setDashboardData(dashRes);
        if (ordRes.orders) setOrders(ordRes.orders);
      } catch (error) {
        console.error('Failed to load earnings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (isLoading) {
    return <Loader message="Auditing farm disbursements and sales..." />;
  }

  const stats = dashboardData?.stats || {};
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered');
  const avgOrderVal =
    deliveredOrders.length > 0
      ? Math.round((stats.totalEarnings || 0) / deliveredOrders.length)
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold text-[#174D32]">Earnings & Settlement Hub</h2>
        <p className="text-xs text-[#4A5B50] mt-0.5">
          100% direct revenue tracking. Zero commission deductions on your farm harvest.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Gross Revenue"
          value={`₹${stats.totalEarnings || 0}`}
          subtitle="Cumulative farmer sales"
          icon={IndianRupee}
          color="forest"
        />
        <StatCard
          title="Delivered Orders"
          value={stats.completedOrders || 0}
          subtitle="Fulfilled and settled"
          icon={CheckCircle2}
          color="leaf"
        />
        <StatCard
          title="Average Order Value"
          value={`₹${avgOrderVal}`}
          subtitle="Revenue per customer basket"
          icon={TrendingUp}
          color="gold"
        />
      </div>

      {/* Direct Payout Guarantee Notice */}
      <div className="bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#DCEADF] text-[#174D32] flex items-center justify-center shrink-0">
          <Banknote className="w-6 h-6 text-[#63A66B]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#174D32]">Weekly Direct Bank Settlement</h4>
          <p className="text-xs text-[#4A5B50] leading-relaxed">
            All Delivered orders are audited on Sunday midnight and disbursed via direct NEFT/RTGS to your registered bank account every Tuesday morning. There are zero platform listing fees or broker deductions.
          </p>
        </div>
      </div>

      {/* Orders Revenue Breakdown Table */}
      <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#BAD5C1]/30 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#174D32]">Sales Breakdown by Order</h3>
          <span className="text-xs text-[#78897E]">{orders.length} total orders recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#BAD5C1]/30 bg-[#F7F8EF]/60 text-[11px] font-bold uppercase tracking-wider text-[#78897E]">
                <th className="py-3 px-5">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-5 text-right">Farmer Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BAD5C1]/20">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#78897E]">
                    No sales recorded yet.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#F0F6F2]/30">
                    <td className="py-3 px-5 font-bold text-[#174D32]">{ord.orderNumber}</td>
                    <td className="py-3 px-4 text-[#78897E]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-[#4A5B50] font-medium">{ord.customer?.name}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#174D32]">{ord.orderStatus}</span>
                    </td>
                    <td className="py-3 px-4 text-[#78897E]">
                      {ord.paymentMethod} ({ord.paymentStatus})
                    </td>
                    <td className="py-3 px-5 text-right font-extrabold text-[#174D32]">
                      ₹{ord.myEarnings || ord.totalAmount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerEarnings;

