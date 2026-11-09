import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { Sprout, User, Mail, Lock, Phone, MapPin, Building, UserPlus } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'farmer' ? 'FARMER' : 'CUSTOMER';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Farmer fields
    farmName: '',
    farmLocation: '',
    district: 'Nashik',
    state: 'Maharashtra',
    farmingMethod: 'Organic Certified',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      role,
    };

    const res = await register(payload);
    setIsLoading(false);

    if (res.success) {
      if (role === 'FARMER') {
        navigate('/farmer');
      } else {
        navigate('/shop');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-14">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#BAD5C1]/60 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#174D32] flex items-center justify-center text-white mx-auto shadow-md">
            <Sprout className="w-7 h-7 text-[#E5B64B]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#174D32]">Create an Account</h1>
          <p className="text-xs text-[#4A5B50]">
            Join AgriDirect to buy fresh harvest or sell directly to households
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#F0F6F2] border border-[#BAD5C1]/40 gap-1.5">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'CUSTOMER'
                ? 'bg-[#174D32] text-white shadow-sm'
                : 'text-[#4A5B50] hover:text-[#174D32]'
            }`}
          >
            I am a Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('FARMER')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'FARMER'
                ? 'bg-[#174D32] text-white shadow-sm'
                : 'text-[#4A5B50] hover:text-[#174D32]'
            }`}
          >
            I am a Farmer
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh More"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
                <User className="w-4 h-4 text-[#78897E] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
                <Phone className="w-4 h-4 text-[#78897E] absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
              <Mail className="w-4 h-4 text-[#78897E] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
              <Lock className="w-4 h-4 text-[#78897E] absolute left-3 top-3" />
            </div>
          </div>

          {/* Farmer-Specific Fields */}
          {role === 'FARMER' && (
            <div className="pt-3 border-t border-[#BAD5C1]/40 space-y-4">
              <span className="text-xs font-bold text-[#174D32] uppercase tracking-wider block">
                Farm Information
              </span>

              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">
                  Farm Name / Organization
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                    placeholder="e.g. Sahyadri Organic Orchards"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                  />
                  <Building className="w-4 h-4 text-[#78897E] absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#174D32] block mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Nashik, Pune"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#174D32] block mb-1">
                    Farming Method
                  </label>
                  <select
                    value={formData.farmingMethod}
                    onChange={(e) => setFormData({ ...formData, farmingMethod: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs font-medium text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                  >
                    <option value="Organic Certified">Organic Certified</option>
                    <option value="Natural / Permaculture">Natural / Permaculture</option>
                    <option value="Hydroponic">Hydroponic</option>
                    <option value="Conventional / Integrated">Conventional / Integrated</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            icon={UserPlus}
            className="w-full pt-1"
          >
            {role === 'FARMER' ? 'Register Farm Profile' : 'Create Consumer Account'}
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-[#4A5B50] border-t border-[#BAD5C1]/30">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#174D32] hover:text-[#63A66B]">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

