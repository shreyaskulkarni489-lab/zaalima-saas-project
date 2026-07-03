import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiPackage } from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import AlertMessage from '../../components/common/AlertMessage';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // ID of item being updated
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await API.get('/cart');
      setCart(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Cart is empty is returned as a 404
        setCart({ products: [] });
      } else {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch cart.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const handleUpdateQuantity = async (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;

    setActionLoading(productId);
    setError('');
    try {
      const res = await API.put('/cart/update', { productId, quantity: newQty });
      setCart(res.data.cart);
      // Wait, standard response for PUT /cart/update is:
      // res.status(200).json({ message: "Cart Updated Successfully", cart })
      // But if populate isn't returned on update, we should refetch cart to get product objects populated.
      // Let's check: backend /cart/update does NOT populate!
      // Yes, in backend/routes/cartRoutes.js direct save() and returning cart is not populated.
      // So let's fetchCart() to get the populated product objects.
      await fetchCart();
      setSuccess('Cart updated.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    setActionLoading(productId);
    setError('');
    try {
      await API.delete(`/cart/remove/${productId}`);
      setCart((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          products: prev.products.filter((p) => p.product._id !== productId),
        };
      });
      setSuccess('Product removed from cart.');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove product.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Spinner />;

  const cartItems = cart?.products || [];

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99; // Free shipping over ₹999
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + shipping + tax;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="mb-1 d-flex align-items-center gap-2">
            <FiShoppingCart /> Shopping Cart
          </h1>
          <p className="mb-0 opacity-75">Manage items in your cart before check out</p>
        </div>
      </div>

      <div className="container py-4">
        <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
        <AlertMessage type="danger" message={error} onClose={() => setError('')} />

        {cartItems.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body py-5 text-center">
              <FiShoppingCart size={50} className="text-muted mb-3 opacity-50" />
              <h3>Your cart is empty</h3>
              <p className="text-muted mb-4">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2">
                Start Shopping <FiArrowRight />
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items List */}
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-0">
                  {cartItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;

                    return (
                      <div className="cart-item" key={product._id}>
                        {/* Image */}
                        <div className="cart-item-image">
                          {product.image ? (
                            <img src={product.image} alt={product.productName} />
                          ) : (
                            <FiPackage size={30} color="#cbd5e1" />
                          )}
                        </div>

                        {/* Name and Price */}
                        <div className="cart-item-details">
                          <h5 className="cart-item-name mb-1">
                            <Link to={`/products/${product._id}`} className="text-dark">
                              {product.productName}
                            </Link>
                          </h5>
                          <span className="cart-item-price">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="quantity-control my-2 my-sm-0">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleUpdateQuantity(product._id, item.quantity, -1)}
                            disabled={item.quantity <= 1 || actionLoading === product._id}
                            title="Decrease quantity"
                            id={`decrease-qty-${product._id}`}
                          >
                            <FiMinus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleUpdateQuantity(product._id, item.quantity, 1)}
                            disabled={actionLoading === product._id}
                            title="Increase quantity"
                            id={`increase-qty-${product._id}`}
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>

                        {/* Subtotal & Delete */}
                        <div className="d-flex align-items-center gap-3 ms-sm-auto">
                          <span className="fw-bold fs-6 text-dark" style={{ minWidth: 80, textAlign: 'right' }}>
                            ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            className="btn btn-outline-danger"
                            style={{ padding: 6, borderRadius: '50%' }}
                            onClick={() => handleRemoveItem(product._id)}
                            disabled={actionLoading === product._id}
                            title="Delete item"
                            id={`remove-cart-${product._id}`}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm sticky-top" style={{ top: 90 }}>
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Order Summary</h4>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span className="fw-semibold">
                      {shipping === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">GST (5%)</span>
                    <span className="fw-semibold">₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  <hr className="my-3" />

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-bold fs-5 text-dark">Total</span>
                    <span className="fw-bold fs-4 text-primary">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    className="btn btn-primary w-100 btn-lg fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate('/checkout')}
                    id="checkout-btn"
                  >
                    Proceed to Checkout <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
