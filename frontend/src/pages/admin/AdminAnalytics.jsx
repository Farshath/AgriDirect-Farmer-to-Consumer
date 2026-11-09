import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { Loader } from '../../components/common/Loader';
import { BarChart3, TrendingUp, PieChart as PieIcon, RefreshCw } from 'lucide-react';
import Button from '../../components/common/Button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await adminAPI.getAnalytics();
      if (res.success) {
        setAnalytics(res);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <Loader message="Computing aggregate marketplace metrics..." />;
  }

  const categoryStats = analytics?.categoryStats || [];
  const topProducts = analytics?.topProducts || [];

  const COLORS = ['#174D32', '#63A66B', '#E5B64B', '#27683E', '#92BDA0', '#BAD5C1'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#174D32]">Platform Market Analytics</h2>
          <p className="text-xs text-[#4A5B50] mt-0.5">
            Real-time aggregate data on category volume and top performing crop harvests.
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchAnalytics}>
          Refresh Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Selling Crops */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#BAD5C1]/30">
            <div>
              <h3 className="font-extrabold text-base text-[#174D32]">Top Selling Produce</h3>
              <p className="text-xs text-[#78897E]">Total units ordered by customers</p>
            </div>
            <span className="text-xs font-bold text-[#63A66B] bg-[#F0F6F2] px-3 py-1 rounded-xl">
              Leaderboard
            </span>
          </div>

          <div className="h-72 w-full">
            {topProducts.length === 0 ? (
              <p className="text-xs text-[#78897E] text-center pt-24">No order items recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EBEED7" />
                  <XAxis type="number" stroke="#78897E" fontSize={11} />
                  <YAxis dataKey="name" type="category" width={120} stroke="#78897E" fontSize={11} />
                  <Tooltip
                    formatter={(val) => [`${val} units sold`, 'Volume']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #BAD5C1',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="totalSold" fill="#63A66B" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#BAD5C1]/30">
              <h3 className="font-extrabold text-base text-[#174D32]">Category Distribution</h3>
              <p className="text-xs text-[#78897E]">Listing counts</p>
            </div>

            <div className="h-56 w-full mt-2">
              {categoryStats.length === 0 ? (
                <p className="text-xs text-[#78897E] text-center pt-20">No categories mapped yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#BAD5C1]/30 space-y-1.5 text-xs">
            {categoryStats.map((cat, i) => (
              <div key={i} className="flex justify-between items-center text-[#4A5B50]">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="font-semibold text-[#174D32]">{cat.name}</span>
                </span>
                <span className="font-bold">{cat.count} products (avg ₹{cat.avgPrice})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

