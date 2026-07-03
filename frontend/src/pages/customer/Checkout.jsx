import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiChevronLeft, FiCreditCard, FiTruck, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import AlertMessage from '../../components/common/AlertMessage';
import { useAuth } from '../../context/AuthContext';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Shipping details state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Payment methods State
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'card'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Order Success Screen State
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await API.get('/cart');
      setCart(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !phone || !city || !zipCode) {
      setError('Please fill in all shipping details.');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      setError('Please fill in card details.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      // Create order in backend (clears cart inside the endpoint query)
      const res = await API.post('/orders/create');
      // res.data -> { message: "Order Created Successfully", order }
      setCreatedOrder(res.data.order);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  const cartItems = cart?.products || [];

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="container py-5 text-center">
        <FiShoppingBag size={55} className="text-muted mb-3 opacity-50" />
        <h3>Your cart is empty</h3>
        <p className="text-muted">You cannot checkout without items in your cart.</p>
        <Link to="/products" className="btn btn-primary mt-3">
          Explore Products
        </Link>
      </div>
    );
  }

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + shipping + tax;

  if (isSuccess) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 text-center">
            <div className="card border-0 shadow-sm p-5">
              <div className="card-body">
                <FiCheckCircle size={70} className="text-success mb-4" />
                <h2 className="fw-bold mb-2">Order Confirmed!</h2>
                <p className="text-muted mb-4">
                  Thank you for your order. A notification has been sent and we're processing your shipment.
                </p>
                {createdOrder && (
                  <div className="bg-light p-3 rounded-3 mb-4 text-start">
                    <div className="mb-2">
                      <span className="text-muted fw-semibold">Order ID:</span>{' '}
                      <span className="font-monospace fw-bold">{createdOrder._id}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted fw-semibold">Amount Paid:</span>{' '}
                      <span className="fw-bold">₹{createdOrder.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-muted fw-semibold">Status:</span>{' '}
                      <span className="badge bg-gradient-warning px-2.5 py-1.5">{createdOrder.status}</span>
                    </div>
                  </div>
                )}
                <div className="d-flex gap-3 justify-content-center">
                  <Link to="/orders" className="btn btn-primary">
                    View Orders
                  </Link>
                  <Link to="/products" className="btn btn-outline-secondary">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="mb-1 d-flex align-items-center gap-2">
            Checkout
          </h1>
          <p className="mb-0 opacity-75">Provide shipping details and place your order</p>
        </div>
      </div>

      <div className="container py-4">
        <Link to="/cart" className="btn btn-outline-secondary btn-sm mb-4 d-inline-flex align-items-center gap-1">
          <FiChevronLeft /> Back to Cart
        </Link>

        <AlertMessage type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={handlePlaceOrder}>
          <div className="row g-4">
            {/* Delivery & Payment details form */}
            <div className="col-12 col-lg-7">
              {/* Shipping Address Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <FiTruck className="text-primary" /> Shipping Details
                  </h4>
                  
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        id="shipping-name"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        id="shipping-phone"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted">City</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        id="shipping-city"
                      />
                    </div>

                    <div className="col-12 col-md-8">
                      <label className="form-label text-muted">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Building size, street name..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        id="shipping-address"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label text-muted">Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="400001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                        id="shipping-zip"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment details Section */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <FiCreditCard className="text-primary" /> Payment Method
                  </h4>

                  {/* Payment selection tabs */}
                  <div className="d-flex gap-3 mb-4">
                    <button
                      type="button"
                      className={`btn flex-fill py-3 border-2 fw-semibold d-flex flex-column align-items-center gap-1 ${
                        paymentMethod === 'cod'
                          ? 'btn-outline-primary border-primary'
                          : 'btn-outline-secondary border-transparent bg-light'
                      }`}
                      onClick={() => setPaymentMethod('cod')}
                      id="payment-cod"
                    >
                      <span>Cash on Delivery</span>
                    </button>
                    <button
                      type="button"
                      className={`btn flex-fill py-3 border-2 fw-semibold d-flex flex-column align-items-center gap-1 ${
                        paymentMethod === 'card'
                          ? 'btn-outline-primary border-primary'
                          : 'btn-outline-secondary border-transparent bg-light'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                      id="payment-card"
                    >
                      <span>Debit/Credit Card</span>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="row g-3 fade-in">
                      <div className="col-12">
                        <label className="form-label text-muted">Card Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                          id="card-number"
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-muted">Expiry Date</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                          id="card-expiry"
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-muted">CVV</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="123"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          required
                          id="card-cvv"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="alert alert-info py-3 mb-0 fade-in" style={{ fontSize: '0.88rem' }}>
                      Place order now and pay cash at the time of delivery. Safe and simple!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary preview list */}
            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm sticky-top" style={{ top: 90 }}>
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Items Review</h4>

                  <div className="mb-4" style={{ maxHeight: 220, overflowY: 'auto' }}>
                    {cartItems.map((item) => {
                      const product = item.product;
                      if (!product) return null;

                      return (
                        <div className="d-flex align-items-center gap-3 mb-3 border-bottom pb-2" key={product._id}>
                          <div
                            className="rounded-3 bg-light d-flex align-items-center justify-content-center"
                            style={{ width: 60, height: 60, overflow: 'hidden', flexShrink: 0 }}
                          >
                            {product.image ? (
                              <img src={product.image} alt={product.productName} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                            ) : (
                              <FiShoppingBag size={20} color="#cbd5e1" />
                            )}
                          </div>
                          <div className="flex-grow-1 min-width-0">
                            <h6 className="mb-0 text-truncate text-secondary fw-semibold">
                              {product.productName}
                            </h6>
                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                              Quantity: {item.quantity}
                            </span>
                          </div>
                          <span className="fw-semibold text-secondary">
                            ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold text-secondary">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span className="fw-semibold text-secondary">
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">GST (5%)</span>
                    <span className="fw-semibold text-secondary">₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  <hr className="my-3" />

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-bold fs-5 text-secondary">Order Total</span>
                    <span className="fw-bold fs-4 text-primary">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 fw-semibold py-3 d-flex align-items-center justify-content-center gap-2"
                    disabled={submitting}
                    id="place-order-btn"
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" /> Processing Order...
                      </>
                    ) : (
                      <>
                        Place Order (₹{total.toLocaleString('en-IN')})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
