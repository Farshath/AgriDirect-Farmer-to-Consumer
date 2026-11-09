import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { Sprout, Mail, Lock, LogIn, ShieldAlert, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (res.user.role === 'FARMER') {
        navigate('/farmer');
      } else {
        navigate('/shop');
      }
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#BAD5C1]/60 shadow-lg space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#174D32] flex items-center justify-center text-white mx-auto shadow-md">
            <Sprout className="w-7 h-7 text-[#E5B64B]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#174D32]">Welcome Back</h1>
          <p className="text-xs text-[#4A5B50]">
            Sign in to access your direct farm market or dashboard
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 rounded-2xl bg-[#F0F6F2] border border-[#BAD5C1]/50 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#174D32]">
            <Sparkles className="w-3.5 h-3.5 text-[#E5B64B]" />
            <span>1-Click Demo Login:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('farmer.rajesh@agrimarket.com', 'Farmer@12345')}
              className="px-2 py-1.5 rounded-xl bg-white border border-[#BAD5C1] text-[11px] font-bold text-[#174D32] hover:bg-[#DCEADF] transition-colors"
            >
              Farmer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('customer.priya@agrimarket.com', 'Customer@12345')}
              className="px-2 py-1.5 rounded-xl bg-white border border-[#BAD5C1] text-[11px] font-bold text-[#174D32] hover:bg-[#DCEADF] transition-colors"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@agrimarket.com', 'Admin@12345')}
              className="px-2 py-1.5 rounded-xl bg-white border border-[#BAD5C1] text-[11px] font-bold text-[#174D32] hover:bg-[#DCEADF] transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
              <Mail className="w-4 h-4 text-[#78897E] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
              <Lock className="w-4 h-4 text-[#78897E] absolute left-3 top-3" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            icon={LogIn}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        {/* Registration Prompt */}
        <div className="text-center pt-2 text-xs text-[#4A5B50] border-t border-[#BAD5C1]/30">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#174D32] hover:text-[#63A66B]">
            Register as Customer or Farmer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

