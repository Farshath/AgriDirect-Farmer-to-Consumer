import React from 'react';
import { Sprout, ShieldCheck, HeartHandshake, Truck, Leaf, Award, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const About = () => {
  return (
    <div className="space-y-16 py-10 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
          Our Agricultural Mission
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#174D32] tracking-tight max-w-3xl mx-auto leading-tight">
          Restoring Trust Between the Hands That Grow and the Homes That Eat
        </h1>
        <p className="text-base text-[#4A5B50] max-w-2xl mx-auto leading-relaxed">
          AgriDirect was founded to solve a systemic injustice in agriculture: farmers earn pennies while customers pay premiums for weeks-old, chemically treated produce. We bridge that gap with direct farm-to-door technology.
        </p>
      </section>

      {/* Image Banner */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white h-72 sm:h-96">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
            alt="Agricultural farm fields"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
            Guiding Values
          </span>
          <h2 className="text-3xl font-extrabold text-[#174D32]">Our 4 Core Commitments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DCEADF] text-[#174D32] flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#174D32]">Zero Exploitation</h3>
            <p className="text-xs text-[#4A5B50] leading-relaxed">
              Farmers decide their own commodity prices without forced distress auctions or broker price gouging.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DCEADF] text-[#174D32] flex items-center justify-center font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#174D32]">Chemical Free Food</h3>
            <p className="text-xs text-[#4A5B50] leading-relaxed">
              We promote organic composting, companion planting, and natural vermicompost over hazardous pesticides.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DCEADF] text-[#174D32] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#174D32]">Rigorous Verification</h3>
            <p className="text-xs text-[#4A5B50] leading-relaxed">
              Every farmer on our platform is physically verified with government land records and organic certs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#BAD5C1]/50 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DCEADF] text-[#174D32] flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#174D32]">24-Hour Velocity</h3>
            <p className="text-xs text-[#4A5B50] leading-relaxed">
              Crops remain on the plant until an order is placed, arriving at your home with peak cellular nutrition intact.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-br from-[#174D32] to-[#103824] text-white p-10 sm:p-14 rounded-3xl space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to Taste Real Farm Food?</h3>
          <p className="text-xs sm:text-sm text-[#BAD5C1] max-w-md mx-auto">
            Browse our catalog of local harvests or register as a sustainable producer today.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link to="/shop">
              <Button variant="gold" size="md">
                Explore Marketplace
              </Button>
            </Link>
            <Link to="/register?role=farmer">
              <Button variant="secondary" size="md" className="border-white text-white bg-transparent hover:bg-white/10">
                Join as Farmer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

