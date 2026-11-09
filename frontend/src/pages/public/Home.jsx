import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, farmerAPI, categoryAPI } from '../../api';
import ProductCard from '../../components/cards/ProductCard';
import FarmerCard from '../../components/cards/FarmerCard';
import Button from '../../components/common/Button';
import { Loader, CardSkeleton } from '../../components/common/Loader';
import {
  Sprout,
  ShoppingBasket,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Truck,
  Leaf,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  Send,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [featuredFarmers, setFeaturedFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catRes, prodRes, farmerRes] = await Promise.all([
          categoryAPI.getCategories().catch(() => ({ categories: [] })),
          productAPI.getProducts({ limit: 8, sort: 'rating' }).catch(() => ({ products: [] })),
          farmerAPI.getFarmers({ limit: 4 }).catch(() => ({ farmers: [] })),
        ]);

        if (catRes.categories) setCategories(catRes.categories);
        if (prodRes.products) setPopularProducts(prodRes.products);
        if (farmerRes.farmers) setFeaturedFarmers(farmerRes.farmers);
      } catch (error) {
        console.error('Home data load error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success('Thank you for subscribing to weekly farm harvest alerts! 🌾');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#DCEADF]/60 via-[#F7F8EF] to-[#F7F8EF] pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#174D32]/10 border border-[#BAD5C1] text-[#174D32] text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#E5B64B]" />
                <span>Zero Middlemen • 100% Direct Farmer Compensation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#174D32] tracking-tight leading-[1.12]">
                From Our <span className="text-[#63A66B]">Farms</span> to Your Table
              </h1>

              <p className="text-base sm:text-lg text-[#4A5B50] font-normal leading-relaxed max-w-xl">
                Experience agricultural purity. Connect directly with verified local farmers, order produce harvested within 24 hours of delivery, and support ethical rural economies.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/shop">
                  <Button variant="primary" size="lg" icon={ShoppingBasket}>
                    Shop Fresh Produce
                  </Button>
                </Link>
                <Link to="/register?role=farmer">
                  <Button variant="secondary" size="lg">
                    Become a Farmer
                  </Button>
                </Link>
              </div>

              {/* Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#BAD5C1]/50 text-left">
                <div>
                  <div className="text-2xl font-extrabold text-[#174D32]">100%</div>
                  <div className="text-xs text-[#78897E] font-medium">Chemical Traceable</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#174D32]">&lt; 24 Hrs</div>
                  <div className="text-xs text-[#78897E] font-medium">Harvest to Kitchen</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#174D32]">₹0 Middleman</div>
                  <div className="text-xs text-[#78897E] font-medium">Direct Producer Pay</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                    alt="Fresh organic harvest basket"
                    className="w-full h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#103824]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-[#E5B64B] text-[#202B24] text-xs font-bold mb-2">
                      Today's Harvest
                    </span>
                    <h4 className="text-lg font-bold">Vine-fresh Tomatoes & Desi Greens</h4>
                    <p className="text-xs text-[#BAD5C1] mt-1">Harvested at 5:30 AM by Rajesh Patil in Nashik Valley</p>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-[#BAD5C1]/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DCEADF] flex items-center justify-center text-[#174D32]">
                    <ShieldCheck className="w-5 h-5 text-[#63A66B]" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#174D32] block">Organic Certified</span>
                    <span className="text-[10px] text-[#78897E] block">APEDA & Soil Tested</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#63A66B] block">
              Pure Categories
            </span>
            <h2 className="text-3xl font-extrabold text-[#174D32]">
              Explore Farm Fresh Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#174D32] hover:text-[#63A66B] transition-colors"
          >
            <span>View All Produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-4 border border-[#BAD5C1]/50 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-cream-200 mb-3 border-2 border-[#BAD5C1]/40 group-hover:border-[#63A66B] transition-colors">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-bold text-[#174D32] group-hover:text-[#63A66B] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-[#78897E] line-clamp-1 mt-0.5">
                {cat.description || 'Direct from farm'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Popular Harvests Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#63A66B] block">
              Today's Best Picks
            </span>
            <h2 className="text-3xl font-extrabold text-[#174D32]">
              Popular Seasonal Harvests
            </h2>
          </div>
          <Link to="/shop">
            <Button variant="secondary" size="sm">
              Explore Full Market
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : popularProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#BAD5C1]/40">
            <p className="text-sm text-[#78897E]">No active products listed currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-gradient-to-br from-[#174D32] to-[#103824] text-white py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-xs font-extrabold tracking-widest uppercase text-[#E5B64B]">
            Transparent Food Network
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How AgriDirect Works
          </h2>
          <p className="text-sm sm:text-base text-[#BAD5C1] max-w-2xl mx-auto">
            From the farmer's soil to your dining table in four seamless, transparent steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-10 text-left">
            {/* Step 1 */}
            <div className="bg-[#1D5A37]/60 p-6 rounded-2xl border border-[#27683E] relative">
              <span className="text-3xl font-extrabold text-[#E5B64B] block mb-2">01</span>
              <h3 className="text-base font-bold text-white mb-1">Farmer Lists Harvest</h3>
              <p className="text-xs text-[#BAD5C1] leading-relaxed">
                Approved local growers list their daily crops with harvest dates, farm locations, and honest prices.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1D5A37]/60 p-6 rounded-2xl border border-[#27683E] relative">
              <span className="text-3xl font-extrabold text-[#E5B64B] block mb-2">02</span>
              <h3 className="text-base font-bold text-white mb-1">You Pick Your Basket</h3>
              <p className="text-xs text-[#BAD5C1] leading-relaxed">
                Browse pesticide-free produce, choose directly from your preferred farm, and place your order.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1D5A37]/60 p-6 rounded-2xl border border-[#27683E] relative">
              <span className="text-3xl font-extrabold text-[#E5B64B] block mb-2">03</span>
              <h3 className="text-base font-bold text-white mb-1">Harvested on Order</h3>
              <p className="text-xs text-[#BAD5C1] leading-relaxed">
                The farmer receives notification and harvests at daybreak, packaging without toxic preservative gases.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#1D5A37]/60 p-6 rounded-2xl border border-[#27683E] relative">
              <span className="text-3xl font-extrabold text-[#E5B64B] block mb-2">04</span>
              <h3 className="text-base font-bold text-white mb-1">Delivered to Doorstep</h3>
              <p className="text-xs text-[#BAD5C1] leading-relaxed">
                Delivered straight to your doorstep with Cash on Delivery and full batch tracking transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Verified Farmers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#63A66B] block">
              Meet The Growers
            </span>
            <h2 className="text-3xl font-extrabold text-[#174D32]">
              Verified Partner Farmers
            </h2>
          </div>
          <Link
            to="/farmers"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#174D32] hover:text-[#63A66B] transition-colors"
          >
            <span>Browse All Farmers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFarmers.map((farmer) => (
            <FarmerCard key={farmer._id} farmer={farmer} />
          ))}
        </div>
      </section>

      {/* 6. Why Choose Us / Soil Health Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#BAD5C1]/50 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
              Why Choose AgriDirect
            </span>
            <h2 className="text-3xl font-extrabold text-[#174D32]">
              Real Food. Zero Middlemen. Complete Traceability.
            </h2>
            <p className="text-sm text-[#4A5B50] leading-relaxed">
              In conventional food retail, up to 60% of the price you pay goes to intermediaries while crops languish for days in cold storage. AgriDirect disrupts this outdated model.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#63A66B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#174D32]">100% Verified Farmer Credentials</h4>
                  <p className="text-xs text-[#4A5B50]">Every farmer undergoes land ownership and soil verification before publishing.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#63A66B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#174D32]">Preservative & Wax Free</h4>
                  <p className="text-xs text-[#4A5B50]">Pure, natural produce free from artificial ripening agents like carbide.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#63A66B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#174D32]">Direct Farmer Support</h4>
                  <p className="text-xs text-[#4A5B50]">Farmers receive their complete requested pricing with zero hidden deductions.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/about">
                <Button variant="primary" size="md">
                  Read Our Mission
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-[#BAD5C1]/40">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"
              alt="Organic farm landscape"
              className="w-full h-80 lg:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#63A66B]">
            From Our Community
          </span>
          <h2 className="text-3xl font-extrabold text-[#174D32]">
            What Customers & Farmers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#BAD5C1]/50 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#E5B64B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#4A5B50] italic leading-relaxed">
                "The vine tomatoes and palak arrived still cool with morning dew on them! You can immediately smell the difference compared to supermarket greens."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[#BAD5C1]/30 mt-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Priya"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-[#174D32]">Priya Deshmukh</h4>
                <p className="text-[10px] text-[#78897E]">Verified Customer, Pune</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#BAD5C1]/50 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#E5B64B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#4A5B50] italic leading-relaxed">
                "As an organic farmer, AgriDirect gave me direct access to households who truly appreciate clean food. My earnings doubled without any middleman cutting margins."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[#BAD5C1]/30 mt-4">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80"
                alt="Rajesh"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-[#174D32]">Rajesh Patil</h4>
                <p className="text-[10px] text-[#78897E]">Green Harvest Organics, Nashik</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#BAD5C1]/50 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#E5B64B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#4A5B50] italic leading-relaxed">
                "The Gir Cow A2 Bilona Ghee from Vedic Valley Dairy is exceptional. Golden, fragrant, and authentic. Knowing exactly which farm made it gives complete peace of mind."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[#BAD5C1]/30 mt-4">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                alt="Rahul"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-[#174D32]">Rahul Verma</h4>
                <p className="text-[10px] text-[#78897E]">Verified Customer, Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#DCEADF] to-[#BAD5C1]/70 p-8 sm:p-12 rounded-3xl border border-[#BAD5C1] text-center space-y-4">
          <span className="text-xs font-extrabold text-[#174D32] uppercase tracking-wider">
            Never Miss a Seasonal Harvest
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#174D32]">
            Get Fresh Crop Alerts from Local Farms
          </h3>
          <p className="text-xs sm:text-sm text-[#4A5B50] max-w-md mx-auto">
            Subscribe to our weekly dispatch of harvested crops, seasonal fruit schedules, and exclusive farm stories.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-grow px-4 py-3 rounded-xl bg-white border border-[#BAD5C1] text-sm text-[#202B24] placeholder-[#78897E] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
            <Button type="submit" variant="primary" icon={Send}>
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;

