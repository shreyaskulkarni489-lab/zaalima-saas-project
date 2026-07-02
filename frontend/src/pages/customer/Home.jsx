import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiShoppingCart, FiHeart, FiPackage,
  FiArrowRight, FiStar, FiTruck, FiShield, FiHeadphones
} from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import ProductCard from '../../components/cards/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setProducts(res.data.slice(0, 8)); // show only first 8 on home
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* ======================== HERO ======================== */}
      <section className="hero-section">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="badge bg-warning text-dark fw-semibold mb-3 px-3 py-2" style={{ fontSize: '0.85rem' }}>
                🛍️ Multi-Vendor Marketplace
              </span>
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#fff', lineHeight: 1.15 }}>
                Shop From<br />
                <span style={{ color: '#fbbf24' }}>Multiple Vendors</span><br />
                In One Place
              </h1>
              <p className="mb-4" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.1rem', maxWidth: 480 }}>
                Discover thousands of products from verified vendors across India. Best prices, fast delivery, easy returns.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/products" className="btn btn-warning fw-bold btn-lg px-4">
                  Shop Now <FiArrowRight className="ms-2" />
                </Link>
                <Link to="/register" className="btn btn-outline-light fw-semibold btn-lg px-4">
                  Become a Vendor
                </Link>
              </div>
              {/* Stats row */}
              <div className="d-flex gap-4 mt-5 flex-wrap">
                {[
                  { label: 'Products', value: '10K+' },
                  { label: 'Vendors', value: '500+' },
                  { label: 'Happy Customers', value: '50K+' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="fw-bold fs-4" style={{ color: '#fbbf24' }}>{stat.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-end">
              <div
                style={{
                  width: 380,
                  height: 380,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiShoppingCart size={140} color="rgba(255,255,255,0.15)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== FEATURES ======================== */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4">
            {[
              { icon: <FiTruck size={28} />, title: 'Free Delivery', desc: 'On orders above ₹499 across India', color: '#4f46e5' },
              { icon: <FiShield size={28} />, title: 'Secure Payments', desc: 'COD, UPI, and Card payments supported', color: '#10b981' },
              { icon: <FiStar size={28} />, title: 'Verified Vendors', desc: 'All vendors are verified and trusted', color: '#f59e0b' },
              { icon: <FiHeadphones size={28} />, title: '24/7 Support', desc: 'Customer support always available', color: '#3b82f6' },
            ].map((f) => (
              <div className="col-6 col-md-3" key={f.title}>
                <div className="text-center p-3">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: 64, height: 64, background: f.color + '18', color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <h6 className="fw-bold mb-1">{f.title}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.82rem' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== FEATURED PRODUCTS ======================== */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="section-title mb-1">Featured Products</h2>
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Handpicked products just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary btn-sm fw-semibold d-none d-md-flex align-items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="icon"><FiPackage /></div>
              <h4>No products yet</h4>
              <p>Check back soon — vendors are adding products!</p>
              <Link to="/register" className="btn btn-primary">Become a Vendor</Link>
            </div>
          ) : (
            <div className="row g-4">
              {products.map((product) => (
                <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4 d-md-none">
            <Link to="/products" className="btn btn-outline-primary fw-semibold">
              View All Products <FiArrowRight className="ms-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================== CTA BANNER ======================== */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="container text-center">
          <h2 className="fw-bold mb-3" style={{ color: '#fff' }}>Are you a Vendor?</h2>
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem' }}>
            Join thousands of vendors selling on Vistky. Easy setup, powerful dashboard, instant payouts.
          </p>
          <Link to="/register" className="btn btn-warning fw-bold btn-lg px-5">
            Start Selling Today <FiArrowRight className="ms-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
