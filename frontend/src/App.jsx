import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ProductExplorer from './pages/ProductExplorer';
import PassportDetail from './pages/PassportDetail';
import QrScanner from './pages/QrScanner';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductList from './pages/admin/AdminProductList';
import AdminProductForm from './pages/admin/AdminProductForm';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <div className="app-container">
          {/* Navigation Bar across all pages */}
          <Navbar />

          {/* Dynamic Route View */}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/products" element={<ProductExplorer />} />
              <Route path="/products/:id" element={<PassportDetail />} />
              <Route path="/scan" element={<QrScanner />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Portal Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminProtectedRoute>
                    <AdminProductList />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/products/new"
                element={
                  <AdminProtectedRoute>
                    <AdminProductForm />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/products/:id/edit"
                element={
                  <AdminProtectedRoute>
                    <AdminProductForm />
                  </AdminProtectedRoute>
                }
              />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Universal Footer */}
          <Footer />
        </div>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
