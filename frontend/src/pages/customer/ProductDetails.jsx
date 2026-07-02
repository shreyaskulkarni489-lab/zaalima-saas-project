import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiShoppingCart, FiHeart, FiArrowLeft, FiStar,
  FiPackage, FiUser, FiCalendar, FiSend
} from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import AlertMessage from '../../components/common/AlertMessage';
import { useAuth } from '../../context/AuthContext';

/* ── Star rating display ── */
const StarRating = ({ rating, size = 16 }) => {
  return (
    <span className="d-inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          fill={star <= rating ? '#f59e0b' : 'none'}
          stroke={star <= rating ? '#f59e0b' : '#cbd5e1'}
        />
      ))}
    </span>
  );
};

/* ── Interactive star picker ── */
const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <span className="d-inline-flex gap-1" style={{ cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={22}
          fill={star <= (hover || value) ? '#f59e0b' : 'none'}
          stroke={star <= (hover || value) ? '#f59e0b' : '#cbd5e1'}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          style={{ transition: 'all 0.15s' }}
        />
      ))}
    </span>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Cart / Wishlist state
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Review form
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Find product from all products (no single product GET endpoint)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get('/products');
        const found = res.data.find((p) => p._id === id);
        setProduct(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get(`/reviews/product/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setCartLoading(true);
    setActionError('');
    try {
      await API.post('/cart/add', { productId: id, quantity: 1 });
      setCartSuccess('Added to cart successfully!');
      setTimeout(() => setCartSuccess(''), 2500);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    setWishlistLoading(true);
    setActionError('');
    try {
      await API.post('/wishlist/add', { productId: id });
      setCartSuccess('Added to wishlist!');
      setTimeout(() => setCartSuccess(''), 2500);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to add to wishlist.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (rating === 0) { setReviewError('Please select a rating.'); return; }
    if (!reviewText.trim()) { setReviewError('Please write a review.'); return; }

    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await API.post('/reviews/add', {
        productId: id,
        rating,
        review: reviewText.trim(),
      });
      setReviews((prev) => [res.data.newReview, ...prev]);
      setReviewSuccess('Review submitted successfully!');
      setRating(0);
      setReviewText('');
      setTimeout(() => setReviewSuccess(''), 2500);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Average rating
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loadingProduct) return <Spinner />;

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <FiPackage size={60} className="text-muted mb-3" />
        <h3>Product not found</h3>
        <Link to="/products" className="btn btn-primary mt-3">
          <FiArrowLeft className="me-2" />Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Back link */}
      <Link to="/products" className="btn btn-outline-secondary btn-sm mb-4 d-inline-flex align-items-center gap-1">
        <FiArrowLeft />Back to Products
      </Link>

      {/* ═══════════ Product Section ═══════════ */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row g-4">
            {/* Product Image */}
            <div className="col-12 col-md-5">
              <div
                className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center"
                style={{ background: '#f1f5f9', minHeight: 320 }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-100"
                    style={{ objectFit: 'cover', maxHeight: 400 }}
                  />
                ) : (
                  <FiPackage size={100} color="#cbd5e1" />
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-12 col-md-7">
              <h1 className="fw-bold mb-2" style={{ fontSize: '1.75rem' }}>{product.productName}</h1>

              {/* Rating summary */}
              {avgRating && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="fw-semibold">{avgRating}</span>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}

              <div className="mb-3">
                <span
                  className="fw-bold"
                  style={{ fontSize: '2.25rem', color: '#4f46e5' }}
                >
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-muted mb-4" style={{ lineHeight: 1.75 }}>
                {product.description}
              </p>

              {/* Alerts */}
              <AlertMessage type="success" message={cartSuccess} onClose={() => setCartSuccess('')} />
              <AlertMessage type="danger" message={actionError} onClose={() => setActionError('')} />

              {/* Action Buttons — customer only */}
              {(!user || user.role === 'customer') && (
                <div className="d-flex gap-3 flex-wrap">
                  <button
                    className="btn btn-primary btn-lg px-4 fw-semibold d-flex align-items-center gap-2"
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    id="add-to-cart-btn"
                  >
                    {cartLoading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <FiShoppingCart size={20} />
                    )}
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-outline-danger btn-lg px-4 fw-semibold d-flex align-items-center gap-2"
                    onClick={handleAddToWishlist}
                    disabled={wishlistLoading}
                    id="add-to-wishlist-btn"
                  >
                    {wishlistLoading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <FiHeart size={20} />
                    )}
                    Wishlist
                  </button>
                </div>
              )}

              {!user && (
                <p className="text-muted mt-3" style={{ fontSize: '0.9rem' }}>
                  <Link to="/login" className="fw-semibold">Log in</Link> to add to cart or wishlist.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ Reviews Section ═══════════ */}
      <div className="row g-4">
        {/* Review List */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-1">Customer Reviews</h4>
              {avgRating && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <StarRating rating={Math.round(avgRating)} size={18} />
                  <span className="fw-semibold fs-5">{avgRating}</span>
                  <span className="text-muted">/ 5 ({reviews.length} reviews)</span>
                </div>
              )}
              <hr />

              {loadingReviews ? (
                <Spinner />
              ) : reviews.length === 0 ? (
                <div className="text-center py-4">
                  <FiStar size={40} className="text-muted mb-2" />
                  <p className="text-muted mb-0">No reviews yet. Be the first!</p>
                </div>
              ) : (
                <div>
                  {reviews.map((r) => (
                    <div key={r._id} className="mb-4 pb-4 border-bottom">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold"
                          style={{ width: 36, height: 36, fontSize: '0.85rem' }}
                        >
                          {r.customer?.name?.charAt(0).toUpperCase() || <FiUser />}
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                            {r.customer?.name || 'Customer'}
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <StarRating rating={r.rating} size={13} />
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                              <FiCalendar size={10} className="me-1" />
                              {new Date(r.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mb-0 text-muted ps-5" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                        {r.review}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Write a Review</h5>

              {!user ? (
                <div className="text-center py-3">
                  <FiStar size={32} className="text-muted mb-2" />
                  <p className="text-muted mb-3">You must be logged in to write a review.</p>
                  <Link to="/login" className="btn btn-primary">Log In to Review</Link>
                </div>
              ) : user.role !== 'customer' ? (
                <div className="alert alert-info mb-0" style={{ fontSize: '0.9rem' }}>
                  Only customers can write reviews.
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} id="review-form">
                  <AlertMessage type="success" message={reviewSuccess} onClose={() => setReviewSuccess('')} />
                  <AlertMessage type="danger" message={reviewError} onClose={() => setReviewError('')} />

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Your Rating</label>
                    <div className="mt-1">
                      <StarPicker value={rating} onChange={setRating} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="review-text" className="form-label fw-semibold">Your Review</label>
                    <textarea
                      className="form-control"
                      id="review-text"
                      rows={4}
                      placeholder="Share your experience with this product..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    disabled={reviewLoading}
                    id="submit-review-btn"
                  >
                    {reviewLoading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <FiSend size={16} />
                    )}
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
