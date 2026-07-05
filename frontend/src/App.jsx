import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

/* Common Components */
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

/* Customer Pages — Day 1 */
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';

/* Customer Pages — Day 2 */
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetails from './pages/customer/ProductDetails';

/* Customer Pages — Day 3 */
import Wishlist from './pages/customer/Wishlist';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';

/* Vendor Pages */
import VendorDashboard from './pages/vendor/Dashboard';

/* Misc Pages */
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            {/* ======================== */}
            {/* PUBLIC ROUTES            */}
            {/* ======================== */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ======================== */}
            {/* PROTECTED CUSTOMER ROUTES */}
            {/* ======================== */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute roles={['customer']}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute roles={['customer']}>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute roles={['customer']}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute roles={['customer']}>
                  <Orders />
                </ProtectedRoute>
              }
            />

            {/* ======================== */}
            {/* PROTECTED VENDOR ROUTES   */}
            {/* ======================== */}
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedRoute roles={['vendor']}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />

            {/* ======================== */}
            {/* 404 CATCH-ALL            */}
            {/* ======================== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;