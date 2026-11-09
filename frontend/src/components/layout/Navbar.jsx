import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../common/Button';
import {
  Sprout,
  ShoppingBasket,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  ShieldAlert,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isFarmer, isAdmin, isCustomer } = useAuth();
  const { summary } = useCart();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Shop Harvest', href: '/shop' },
    { label: 'Farmers', href: '/farmers' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About Us', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isFarmer) return '/farmer';
    return '/customer/orders';
  };

  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Panel';
    if (isFarmer) return 'Farmer Hub';
    return 'My Orders';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F8EF]/90 backdrop-blur-md border-b border-[#BAD5C1]/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#174D32] to-[#27683E] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6 text-[#E5B64B]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#174D32] block leading-none">
                Agri<span className="text-[#63A66B]">Direct</span>
              </span>
              <span className="text-[10px] font-semibold text-[#4A5B50] uppercase tracking-wider block mt-0.5">
                Farm to Consumer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-semibold transition-colors duration-150 relative py-1 ${
                    isActive
                      ? 'text-[#174D32] font-bold'
                      : 'text-[#4A5B50] hover:text-[#174D32]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#63A66B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Basket Link for Customers & Guests */}
            {(!isAuthenticated || isCustomer) && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl bg-white text-[#174D32] border border-[#BAD5C1]/50 hover:bg-[#F0F6F2] hover:border-[#174D32] transition-colors shadow-sm"
                title="Shopping Basket"
              >
                <ShoppingBasket className="w-5 h-5" />
                {summary.itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#174D32] text-white text-[11px] font-bold flex items-center justify-center shadow">
                    {summary.itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Notifications Dropdown (If authenticated) */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2.5 rounded-xl bg-white text-[#174D32] border border-[#BAD5C1]/50 hover:bg-[#F0F6F2] transition-colors shadow-sm cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Panel */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#BAD5C1]/60 p-4 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-[#BAD5C1]/30">
                      <span className="font-bold text-[#174D32] text-sm">
                        Notifications ({unreadCount} new)
                      </span>
                      <button
                        onClick={() => setNotificationOpen(false)}
                        className="text-xs text-[#78897E] hover:text-[#174D32]"
                      >
                        Close
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-center text-[#78897E] py-6">
                          No notifications at the moment.
                        </p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => markAsRead(n._id)}
                            className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                              n.isRead ? 'opacity-70 bg-transparent' : 'bg-[#F0F6F2]'
                            }`}
                          >
                            <p className="text-xs font-bold text-[#174D32]">{n.title}</p>
                            <p className="text-xs text-[#4A5B50] mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authenticated User Menu or Guest Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-white border border-[#BAD5C1]/60 hover:border-[#174D32] transition-colors shadow-sm cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="text-xs font-bold text-[#174D32] max-w-[100px] truncate hidden sm:inline-block">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#78897E]" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-[#BAD5C1]/60 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-[#BAD5C1]/30 mb-1">
                      <p className="text-xs font-bold text-[#174D32] truncate">{user.name}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#DCEADF] text-[#174D32]">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#202B24] hover:bg-[#F0F6F2] hover:text-[#174D32] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#63A66B]" />
                      <span>{getDashboardLabel()}</span>
                    </Link>

                    {isCustomer && (
                      <Link
                        to="/customer/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#202B24] hover:bg-[#F0F6F2] hover:text-[#174D32] transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#63A66B]" />
                        <span>Order History</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer mt-1 border-t border-[#BAD5C1]/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#174D32] hover:bg-[#F0F6F2] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#BAD5C1]/60 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-[#202B24] hover:bg-[#F0F6F2] hover:text-[#174D32]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-[#BAD5C1]/40 flex gap-2">
              <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

