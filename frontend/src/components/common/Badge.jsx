import React from 'react';
import { Leaf, CheckCircle2, Clock, XCircle, Truck, Package, ShieldCheck } from 'lucide-react';

export const OrganicBadge = ({ size = 'sm', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#174D32] text-[#F7F8EF] border border-[#63A66B]/60 shadow-sm ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${className}`}
    >
      <Leaf className={size === 'sm' ? 'w-3 h-3 text-[#E5B64B]' : 'w-4 h-4 text-[#E5B64B]'} />
      <span>100% Organic</span>
    </span>
  );
};

export const VerificationBadge = ({ status = 'PENDING', className = '' }) => {
  const configs = {
    APPROVED: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: ShieldCheck,
      text: 'Verified Farmer',
    },
    PENDING: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
      text: 'Verification Pending',
    },
    REJECTED: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: XCircle,
      text: 'Application Rejected',
    },
  };

  const current = configs[status] || configs.PENDING;
  const IconComponent = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg} ${className}`}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{current.text}</span>
    </span>
  );
};

export const OrderStatusBadge = ({ status = 'Pending', className = '' }) => {
  const configs = {
    Pending: {
      bg: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Clock,
    },
    Confirmed: {
      bg: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: CheckCircle2,
    },
    Processing: {
      bg: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Package,
    },
    'Ready for Delivery': {
      bg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      icon: Package,
    },
    Shipped: {
      bg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: Truck,
    },
    Delivered: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
    },
    Cancelled: {
      bg: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: XCircle,
    },
  };

  const current = configs[status] || configs.Pending;
  const IconComponent = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${current.bg} ${className}`}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{status}</span>
    </span>
  );
};

export default { OrganicBadge, VerificationBadge, OrderStatusBadge };

