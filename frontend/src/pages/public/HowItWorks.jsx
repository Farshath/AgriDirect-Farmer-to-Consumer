import React from 'react';
import { ShoppingBasket, Truck, Leaf, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const HowItWorks = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
          Clear & Direct Process
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#174D32]">
          How AgriDirect Empowers Both Sides
        </h1>
        <p className="text-sm text-[#4A5B50] leading-relaxed">
          Whether you are a family seeking pure vegetables or a farmer looking for dignified sales, our platform operates on complete direct transparency.
        </p>
      </div>

      {/* For Customers */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-8">
        <div className="border-b border-[#BAD5C1]/30 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E5B64B]">For Consumers</span>
          <h2 className="text-2xl font-extrabold text-[#174D32] mt-1">4 Easy Steps to Farm Fresh Food</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#F7F8EF] border border-[#BAD5C1]/40 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#174D32] text-white text-xs font-extrabold flex items-center justify-center">1</span>
            <h3 className="font-bold text-sm text-[#174D32]">Browse by Farm or Crop</h3>
            <p className="text-xs text-[#4A5B50] leading-relaxed">Search through vegetables, dairy, grains, and fruits from verified local farms.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F8EF] border border-[#BAD5C1]/40 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#174D32] text-white text-xs font-extrabold flex items-center justify-center">2</span>
            <h3 className="font-bold text-sm text-[#174D32]">Place Your Basket</h3>
            <p className="text-xs text-[#4A5B50] leading-relaxed">Add fresh quantities with clear per-unit prices and free delivery for orders ₹500+.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F8EF] border border-[#BAD5C1]/40 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#174D32] text-white text-xs font-extrabold flex items-center justify-center">3</span>
            <h3 className="font-bold text-sm text-[#174D32]">Dawn Harvest</h3>
            <p className="text-xs text-[#4A5B50] leading-relaxed">Your farmer harvests the crops at sunrise, sorting out only the prime produce.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F8EF] border border-[#BAD5C1]/40 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#174D32] text-white text-xs font-extrabold flex items-center justify-center">4</span>
            <h3 className="font-bold text-sm text-[#174D32]">Doorstep Delivery & COD</h3>
            <p className="text-xs text-[#4A5B50] leading-relaxed">Inspect your fresh harvest and pay seamlessly with Cash on Delivery at your door.</p>
          </div>
        </div>

        <div className="pt-2">
          <Link to="/shop">
            <Button variant="primary" icon={ShoppingBasket}>
              Start Shopping Now
            </Button>
          </Link>
        </div>
      </div>

      {/* For Farmers */}
      <div className="bg-[#174D32] text-white p-8 sm:p-12 rounded-3xl shadow-lg space-y-8">
        <div className="border-b border-[#27683E] pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E5B64B]">For Producers</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">How Farmers Grow Their Direct Business</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#1D5A37] border border-[#27683E] space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#E5B64B] text-[#202B24] text-xs font-extrabold flex items-center justify-center">1</span>
            <h3 className="font-bold text-sm text-white">Register Farm Profile</h3>
            <p className="text-xs text-[#BAD5C1] leading-relaxed">Submit your farm details, acreage, and upload government land record or organic docs.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1D5A37] border border-[#27683E] space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#E5B64B] text-[#202B24] text-xs font-extrabold flex items-center justify-center">2</span>
            <h3 className="font-bold text-sm text-white">Admin Verification</h3>
            <p className="text-xs text-[#BAD5C1] leading-relaxed">Our agronomy team reviews your application to ensure authenticity and consumer safety.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1D5A37] border border-[#27683E] space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#E5B64B] text-[#202B24] text-xs font-extrabold flex items-center justify-center">3</span>
            <h3 className="font-bold text-sm text-white">List Your Produce</h3>
            <p className="text-xs text-[#BAD5C1] leading-relaxed">Publish active products, specify your own pricing per kg/unit, and update daily inventory.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1D5A37] border border-[#27683E] space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#E5B64B] text-[#202B24] text-xs font-extrabold flex items-center justify-center">4</span>
            <h3 className="font-bold text-sm text-white">Fulfill & Earn 100%</h3>
            <p className="text-xs text-[#BAD5C1] leading-relaxed">Receive instant order notifications, package for pickup, and receive weekly bank settlements.</p>
          </div>
        </div>

        <div className="pt-2">
          <Link to="/register?role=farmer">
            <Button variant="gold">
              Join as a Certified Farmer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

