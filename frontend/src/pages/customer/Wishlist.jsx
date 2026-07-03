import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight, FiPackage } from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import AlertMessage from '../../components/common/AlertMessage';
import { useAuth } from '../../context/AuthContext';

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // stores ID of product currently being updated
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await API.get('/wishlist');
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const handleRemove = async (productId) => {
    setActionLoading(productId);
    setError('');
    setSuccess('');
    try {
      await API.delete(`/wishlist/remove/${productId}`);
      setWishlist((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          products: prev.products.filter((p) => p._id !== productId),
        };
      });
      setSuccess('Item removed from wishlist.');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddToCart = async (product) => {
    setActionLoading(product._id);
    setError('');
    setSuccess('');
    try {
      await API.post('/cart/add', { productId: product._id, quantity: 1 });
      setSuccess(`"${product.productName}" added to cart!`);
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Spinner />;

  const wishlistItems = wishlist?.products || [];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="mb-1 d-flex align-items-center gap-2">
            <FiHeart /> My Wishlist
          </h1>
          <p className="mb-0 opacity-75">Keep track of your favorite products</p>
        </div>
      </div>

      <div className="container py-4">
        <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
        <AlertMessage type="danger" message={error} onClose={() => setError('')} />

        {wishlistItems.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body py-5 text-center">
              <FiHeart size={50} className="text-muted mb-3 opacity-50" />
              <h3>Your wishlist is empty</h3>
              <p className="text-muted mb-4">
                Explore our catalog and save items you like for later!
              </p>
              <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2">
                Browse Products <FiArrowRight />
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {wishlistItems.map((product) => (
              <div className="col-12 col-md-6 col-lg-4" key={product._id}>
                <div className="card border-0 shadow-sm h-100 flex-column d-flex">
                  <div
                    className="position-relative"
                    style={{ background: '#f1f5f9', height: 200, overflow: 'hidden' }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <FiPackage size={50} color="#cbd5e1" />
                      </div>
                    )}
                    <button
                      className="btn btn-danger position-absolute"
                      style={{ top: 12, right: 12, padding: 6, borderRadius: '50%' }}
                      onClick={() => handleRemove(product._id)}
                      disabled={actionLoading === product._id}
                      title="Remove from wishlist"
                      id={`remove-wishlist-${product._id}`}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="card-body d-flex flex-column p-3 flex-grow-1">
                    <h5 className="card-title fw-bold text-truncate mb-1">
                      <Link to={`/products/${product._id}`} className="text-dark">
                        {product.productName}
                      </Link>
                    </h5>
                    <p className="text-muted text-truncate mb-2" style={{ fontSize: '0.85rem' }}>
                      {product.description}
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5 text-primary">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </span>
                      <button
                        className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                        onClick={() => handleAddToCart(product)}
                        disabled={actionLoading === product._id}
                        id={`add-cart-from-wishlist-${product._id}`}
                      >
                        <FiShoppingCart size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
