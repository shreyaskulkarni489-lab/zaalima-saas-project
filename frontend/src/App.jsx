import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

/* Common Components */
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

/* Customer Pages */
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ======================== */}
            {/* PLACEHOLDER HOME (Day 2) */}
            {/* ======================== */}
            <Route
              path="/"
              element={
                <div className="container py-5 text-center">
                  <h1 className="display-4 fw-bold mb-3">Welcome to Zaalima</h1>
                  <p className="text-muted fs-5">Your trusted multi-vendor e-commerce platform.</p>
                  <p className="text-muted">Full Home page coming in Day 2.</p>
                </div>
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