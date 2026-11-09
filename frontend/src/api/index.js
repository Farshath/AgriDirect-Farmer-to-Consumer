import axiosClient from './axiosClient';

// Auth APIs
export const authAPI = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (userData) => axiosClient.post('/auth/register', userData),
  getMe: () => axiosClient.get('/auth/me'),
  updateProfile: (profileData) => axiosClient.put('/auth/profile', profileData),
  changePassword: (data) => axiosClient.put('/auth/change-password', data),
  logout: () => axiosClient.post('/auth/logout'),
};

// Products APIs
export const productAPI = {
  getProducts: (params) => axiosClient.get('/products', { params }),
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  createProduct: (productData) => axiosClient.post('/products', productData),
  updateProduct: (id, productData) => axiosClient.put(`/products/${id}`, productData),
  deleteProduct: (id) => axiosClient.delete(`/products/${id}`),
  getMyFarmerProducts: () => axiosClient.get('/products/farmer/my-products'),
  updateStock: (id, stockData) => axiosClient.patch(`/products/${id}/stock`, stockData),
};

// Categories APIs
export const categoryAPI = {
  getCategories: () => axiosClient.get('/categories'),
  createCategory: (data) => axiosClient.post('/categories', data),
};

// Farmers Directory & Dashboard APIs
export const farmerAPI = {
  getFarmers: (params) => axiosClient.get('/farmers', { params }),
  getFarmerById: (id) => axiosClient.get(`/farmers/${id}`),
  updateProfile: (data) => axiosClient.put('/farmers/profile', data),
  getDashboard: () => axiosClient.get('/farmers/dashboard'),
};

// Cart APIs
export const cartAPI = {
  getCart: () => axiosClient.get('/cart'),
  addToCart: (productId, quantity) => axiosClient.post('/cart', { productId, quantity }),
  updateCartItem: (itemId, quantity) => axiosClient.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => axiosClient.delete(`/cart/${itemId}`),
  clearCart: () => axiosClient.delete('/cart'),
};

// Order APIs
export const orderAPI = {
  createOrder: (orderData) => axiosClient.post('/orders', orderData),
  getMyOrders: () => axiosClient.get('/orders/my-orders'),
  getFarmerOrders: (params) => axiosClient.get('/orders/farmer-orders', { params }),
  getOrderById: (id) => axiosClient.get(`/orders/${id}`),
  updateOrderStatus: (id, status, note) => axiosClient.put(`/orders/${id}/status`, { status, note }),
};

// Review APIs
export const reviewAPI = {
  createReview: (reviewData) => axiosClient.post('/reviews', reviewData),
  getProductReviews: (productId) => axiosClient.get(`/reviews/${productId}`),
};

// Notifications APIs
export const notificationAPI = {
  getNotifications: () => axiosClient.get('/notifications'),
  markAsRead: (id) => axiosClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosClient.put('/notifications/read-all'),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => axiosClient.get('/admin/dashboard'),
  getFarmers: (params) => axiosClient.get('/admin/farmers', { params }),
  approveFarmer: (id) => axiosClient.put(`/admin/farmers/${id}/approve`),
  rejectFarmer: (id, rejectionReason) => axiosClient.put(`/admin/farmers/${id}/reject`, { rejectionReason }),
  getOrders: (params) => axiosClient.get('/admin/orders', { params }),
  getCustomers: (params) => axiosClient.get('/admin/customers', { params }),
  getAnalytics: () => axiosClient.get('/admin/analytics'),
  toggleUserStatus: (id) => axiosClient.put(`/admin/users/${id}/toggle-status`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) =>
    axiosClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

