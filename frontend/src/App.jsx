import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            {/* Custom Toast Config */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#FFFFFF',
                  color: '#202B24',
                  borderRadius: '16px',
                  border: '1px solid #BAD5C1',
                  boxShadow: '0 10px 25px -5px rgba(23, 77, 50, 0.1)',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: {
                    primary: '#174D32',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#E11D48',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />

            <AppRoutes />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

