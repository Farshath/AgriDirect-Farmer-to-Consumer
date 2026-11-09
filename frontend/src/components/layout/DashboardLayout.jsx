import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { VerificationBadge } from '../common/Badge';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Boxes,
  ShoppingBag,
  IndianRupee,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Users,
  BarChart3,
  Menu,
  X,
  Sprout,
  Home,
  CheckCircle,
} from 'lucide-react';

const DashboardLayout = ({ children, title, subtitle, actions }) => {
  const { user, farmerProfile, logout, isFarmer, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const farmerNavItems = [
    { label: 'Overview', href: '/farmer', icon: LayoutDashboard },
    { label: 'My Products', href: '/farmer/products', icon: Package },
    { label: 'Add Product', href: '/farmer/products/new', icon: PlusCircle },
    { label: 'Manage Inventory', href: '/farmer/inventory', icon: Boxes },
    { label: 'Orders', href: '/farmer/orders', icon: ShoppingBag },
    { label: 'Earnings', href: '/farmer/earnings', icon: IndianRupee },
    { label: 'Farm Profile', href: '/farmer/profile', icon: User },
    { label: 'Settings', href: '/farmer/settings', icon: Settings },
  ];

  const adminNavItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Farmer Verification', href: '/admin/verification', icon: ShieldCheck },
    { label: 'Farmers', href: '/admin/farmers', icon: Users },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const navItems = isFarmer ? farmerNavItems : adminNavItems;

  return (
    <div className="min-h-screen bg-[#F7F8EF] flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-[#BAD5C1]/50 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Link to="/" className="w-9 h-9 rounded-xl bg-[#174D32] flex items-center justify-center text-[#E5B64B]">
            <Sprout className="w-5 h-5" />
          </Link>
          <span className="font-extrabold text-[#174D32] text-sm">
            {isFarmer ? 'Farmer Portal' : 'Admin Panel'}
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-[#174D32] hover:bg-[#F0F6F2]"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#BAD5C1]/50 flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex flex-col flex-grow overflow-y-auto">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 pb-6 border-b border-[#BAD5C1]/30">
            <div className="w-10 h-10 rounded-2xl bg-[#174D32] flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-6 h-6 text-[#E5B64B]" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-[#174D32] block">
                Agri<span className="text-[#63A66B]">Direct</span>
              </span>
              <span className="text-[10px] font-bold text-[#78897E] uppercase tracking-wider block">
                {isFarmer ? 'Farmer Hub' : 'System Admin'}
              </span>
            </div>
          </Link>

          {/* Farmer Verification Alert (if Farmer) */}
          {isFarmer && farmerProfile && (
            <div className="mt-4 p-3 rounded-2xl bg-[#F0F6F2] border border-[#BAD5C1]/40">
              <p className="text-[11px] font-bold text-[#174D32] truncate">
                {farmerProfile.farmName}
              </p>
              <div className="mt-1">
                <VerificationBadge status={farmerProfile.verificationStatus} />
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#174D32] to-[#27683E] text-white shadow-[0_4px_12px_rgba(23,77,50,0.25)]'
                      : 'text-[#4A5B50] hover:bg-[#F0F6F2] hover:text-[#174D32]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E5B64B]' : 'text-[#63A66B]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Account Footer in Sidebar */}
        <div className="p-4 border-t border-[#BAD5C1]/40 bg-[#F7F8EF]/60 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#4A5B50] hover:bg-white hover:text-[#174D32] transition-colors"
          >
            <Home className="w-4 h-4 text-[#63A66B]" />
            <span>Public Marketplace</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-[#BAD5C1]/30">
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#174D32] truncate">{user?.name}</p>
                <p className="text-[10px] text-[#78897E] truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Topbar */}
        <header className="bg-white border-b border-[#BAD5C1]/40 px-6 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#174D32] tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-[#4A5B50] mt-0.5">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        </header>

        {/* Page View Body */}
        <main className="p-6 sm:p-8 flex-grow">{children}</main>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[#092115]/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}
    </div>
  );
};

export default DashboardLayout;

