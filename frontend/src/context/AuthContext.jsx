import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agri_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('agri_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success) {
            setUser(res.user);
            setFarmerProfile(res.farmerProfile);
          }
        } catch (error) {
          console.error('Session restore failed:', error);
          localStorage.removeItem('agri_token');
          setToken(null);
          setUser(null);
          setFarmerProfile(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.success) {
        localStorage.setItem('agri_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setFarmerProfile(res.farmerProfile);
        toast.success(res.message || `Welcome back, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please verify credentials.');
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res.success) {
        localStorage.setItem('agri_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setFarmerProfile(res.farmerProfile);
        toast.success(res.message || 'Registration successful!');
        return { success: true, user: res.user };
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('agri_token');
    setToken(null);
    setUser(null);
    setFarmerProfile(null);
    toast.success('Signed out successfully');
  };

  const updateUserData = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const updateFarmerProfileData = (updatedProfile) => {
    setFarmerProfile(updatedProfile);
  };

  const isFarmer = user?.role === 'FARMER';
  const isCustomer = user?.role === 'CUSTOMER';
  const isAdmin = user?.role === 'ADMIN';
  const isFarmerApproved = isFarmer && farmerProfile?.verificationStatus === 'APPROVED';

  return (
    <AuthContext.Provider
      value={{
        user,
        farmerProfile,
        token,
        isLoading,
        isAuthenticated: !!user,
        isFarmer,
        isCustomer,
        isAdmin,
        isFarmerApproved,
        login,
        register,
        logout,
        updateUserData,
        updateFarmerProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

