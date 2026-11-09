import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Loader2, Sprout } from 'lucide-react';

// Layouts (Static for seamless framing)
import MainLayout from '../components/layout/MainLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Brand Page Loading Fallback
const PageFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 py-16">
    <div className="relative flex items-center justify-center">
      <div className="w-14 h-14 rounded-full border-4 border-[#BAD5C1]/40 border-t-[#174D32] animate-spin" />
      <Sprout className="w-6 h-6 text-[#63A66B] absolute animate-pulse" />
    </div>
    <span className="text-xs font-bold text-[#174D32] tracking-wide uppercase">
      Loading Fresh Produce...
    </span>
  </div>
);

// Lazy Loaded Public Pages
const Home = lazy(() => import('../pages/public/Home'));
const Shop = lazy(() => import('../pages/public/Shop'));
const ProductDetail = lazy(() => import('../pages/public/ProductDetail'));
const FarmerDirectory = lazy(() => import('../pages/public/FarmerDirectory'));
const FarmerDetail = lazy(() => import('../pages/public/FarmerDetail'));
const About = lazy(() => import('../pages/public/About'));
const HowItWorks = lazy(() => import('../pages/public/HowItWorks'));
const FAQ = lazy(() => import('../pages/public/FAQ'));
const Contact = lazy(() => import('../pages/public/Contact'));
const Login = lazy(() => import('../pages/public/Login'));
const Register = lazy(() => import('../pages/public/Register'));

// Lazy Loaded Customer Pages
const CartPage = lazy(() => import('../pages/customer/CartPage'));
const CheckoutPage = lazy(() => import('../pages/customer/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('../pages/customer/OrderSuccessPage'));
const CustomerOrders = lazy(() => import('../pages/customer/CustomerOrders'));
const OrderTrackingPage = lazy(() => import('../pages/customer/OrderTrackingPage'));

// Lazy Loaded Farmer Dashboard Pages
const FarmerOverview = lazy(() => import('../pages/farmer/FarmerOverview'));
const FarmerProducts = lazy(() => import('../pages/farmer/FarmerProducts'));
const AddEditProduct = lazy(() => import('../pages/farmer/AddEditProduct'));
const FarmerInventory = lazy(() => import('../pages/farmer/FarmerInventory'));
const FarmerOrders = lazy(() => import('../pages/farmer/FarmerOrders'));
const FarmerEarnings = lazy(() => import('../pages/farmer/FarmerEarnings'));
const FarmerProfile = lazy(() => import('../pages/farmer/FarmerProfile'));
const FarmerSettings = lazy(() => import('../pages/farmer/FarmerSettings'));

// Lazy Loaded Admin Dashboard Pages
const AdminOverview = lazy(() => import('../pages/admin/AdminOverview'));
const AdminFarmerVerification = lazy(() => import('../pages/admin/AdminFarmerVerification'));
const AdminFarmers = lazy(() => import('../pages/admin/AdminFarmers'));
const AdminCustomers = lazy(() => import('../pages/admin/AdminCustomers'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public Pages wrapped in MainLayout */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
        <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
        <Route path="/farmers" element={<MainLayout><FarmerDirectory /></MainLayout>} />
        <Route path="/farmers/:id" element={<MainLayout><FarmerDetail /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/how-it-works" element={<MainLayout><HowItWorks /></MainLayout>} />
        <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

        {/* Customer Basket & Checkout Flow */}
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <MainLayout><CheckoutPage /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success/:id"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <MainLayout><OrderSuccessPage /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <MainLayout><CustomerOrders /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders/:id"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'FARMER', 'ADMIN']}>
              <MainLayout><OrderTrackingPage /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Farmer Dashboard Routes */}
        <Route
          path="/farmer"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <DashboardLayout title="Farmer Dashboard" subtitle="Welcome back! Here is your daily harvest and order pulse.">
                <FarmerOverview />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/products"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <DashboardLayout title="My Farm Products" subtitle="Manage your active agricultural listings, pricing, and stock.">
                <FarmerProducts />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/products/new"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <DashboardLayout title="Add New Product" subtitle="List fresh crop harvest for direct consumer purchase.">
                <AddEditProduct />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/products/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
              <DashboardLayout title="Edit Product" subtitle="Update crop pricing, photos, or description.">
                <AddEditProduct />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/inventory"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <DashboardLayout title="Manage Inventory" subtitle="Live stock adjustments, quantity limits, and visibility.">
                <FarmerInventory />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/orders"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <DashboardLayout title="Incoming Harvest Orders" subtitle="Track received orders, update packing and delivery stages.">
                <FarmerOrders />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/earnings"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <DashboardLayout title="Farm Revenue & Earnings" subtitle="Direct weekly settlements and order disbursement records.">
                <FarmerEarnings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/profile"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <DashboardLayout title="Farm Identity Profile" subtitle="Your official farm bio, credentials, and verification status.">
                <FarmerProfile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/settings"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <DashboardLayout title="Account Settings" subtitle="Security credentials and farm contact preferences.">
                <FarmerSettings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout title="Marketplace Control Center" subtitle="Comprehensive platform metrics, user oversight, and governance.">
                <AdminOverview />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verification"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout title="Farmer Verification Queue" subtitle="Inspect land records, audit documents, and approve farmer accounts.">
                <AdminFarmerVerification />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/farmers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout title="All Farmers Roster" subtitle="Manage registered agricultural producers and account statuses.">
                <AdminFarmers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout title="Customer Directory" subtitle="Inspect consumer accounts, registered dates, and purchase counts.">
                <AdminCustomers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout title="Crop Listing Moderation" subtitle="Monitor active produce, organic standards, and prices across all farms.">
                <AdminProducts />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout title="Master Platform Orders" subtitle="Inspect all orders, delivery stages, and resolve disputes.">
                <AdminOrders />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout title="Advanced Analytics & Trends" subtitle="Aggregate sales trends, category distribution, and top-selling produce.">
                <AdminAnalytics />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout title="Platform Business Rules" subtitle="Configure delivery fees, free delivery threshold, and system rules.">
                <AdminSettings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route
          path="*"
          element={
            <MainLayout>
              <div className="max-w-xl mx-auto py-24 text-center space-y-4">
                <h1 className="text-6xl font-black text-[#174D32]">404</h1>
                <h2 className="text-xl font-bold text-[#174D32]">Harvest Path Not Found</h2>
                <p className="text-xs text-[#4A5B50]">
                  The page you are looking for has been moved or does not exist.
                </p>
                <a href="/">
                  <button className="btn-primary mt-2">Return to Home</button>
                </a>
              </div>
            </MainLayout>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
