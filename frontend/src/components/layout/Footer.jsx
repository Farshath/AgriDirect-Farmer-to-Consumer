import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, HeartHandshake, Truck, Leaf, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../common/Button';

const Footer = () => {
  return (
    <footer className="bg-[#103824] text-white pt-16 pb-10 border-t border-[#174D32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Prop Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#1D5A37]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#174D32] flex items-center justify-center shrink-0 text-[#E5B64B] shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F7F8EF]">100% Verified Farms</h4>
              <p className="text-xs text-[#92BDA0]">Direct source authentication</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#174D32] flex items-center justify-center shrink-0 text-[#63A66B] shadow-inner">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F7F8EF]">Fair Farmer Wages</h4>
              <p className="text-xs text-[#92BDA0]">Zero middleman commission cuts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#174D32] flex items-center justify-center shrink-0 text-[#E5B64B] shadow-inner">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F7F8EF]">Harvest-to-Door</h4>
              <p className="text-xs text-[#92BDA0]">Delivered fresh in 24 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#174D32] flex items-center justify-center shrink-0 text-[#63A66B] shadow-inner">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F7F8EF]">Residue Free</h4>
              <p className="text-xs text-[#92BDA0]">Organic & sustainable produce</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-[#1D5A37]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#E5B64B] flex items-center justify-center text-[#174D32] shadow">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Agri<span className="text-[#63A66B]">Direct</span>
              </span>
            </div>
            <p className="text-sm text-[#BAD5C1] leading-relaxed max-w-sm">
              A digital agricultural marketplace connecting ethical farmers directly with conscious consumers. Fresh crops, fair prices, total transparency.
            </p>
            <div className="pt-2 text-xs text-[#92BDA0] space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E5B64B]" />
                National Agri Innovation Hub, Shivaji Nagar, Pune, India
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E5B64B]" />
                +91 1800 200 4567 (Farmer & Consumer Helpline)
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#E5B64B] mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs text-[#BAD5C1]">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Shop Fresh Harvest
                </Link>
              </li>
              <li>
                <Link to="/farmers" className="hover:text-white transition-colors">
                  Verified Farmer Directory
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How Ordering Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Mission & Soil Health
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Consumer & Farmer FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Produce Categories */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#E5B64B] mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-[#BAD5C1]">
              <li>
                <Link to="/shop?category=vegetables" className="hover:text-white transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link to="/shop?category=fruits" className="hover:text-white transition-colors">
                  Seasonal Fruits
                </Link>
              </li>
              <li>
                <Link to="/shop?category=dairy-products" className="hover:text-white transition-colors">
                  A2 Dairy & Desi Ghee
                </Link>
              </li>
              <li>
                <Link to="/shop?category=grains" className="hover:text-white transition-colors">
                  Heirloom Grains & Pulses
                </Link>
              </li>
              <li>
                <Link to="/shop?category=organic-products" className="hover:text-white transition-colors">
                  Forest Honey & Cold-Pressed Oils
                </Link>
              </li>
            </ul>
          </div>

          {/* Farmers CTA */}
          <div className="bg-[#174D32] p-5 rounded-2xl border border-[#27683E] space-y-3">
            <h4 className="text-sm font-bold text-[#F7F8EF]">Are You a Farmer?</h4>
            <p className="text-xs text-[#92BDA0] leading-relaxed">
              Sell directly to thousands of families, set your own fair prices, and receive guaranteed doorstep pickups.
            </p>
            <Link to="/register?role=farmer" className="block">
              <Button variant="gold" size="sm" className="w-full text-xs">
                Join as a Farmer
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#92BDA0] gap-4">
          <p>© 2026 AgriDirect Inc. Dedicated to sustainable rural farming and pure food.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

