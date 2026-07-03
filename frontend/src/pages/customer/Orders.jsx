import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiShoppingBag, FiArchive, FiCalendar, FiMapPin, FiTruck, FiXCircle, FiGrid } from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import AlertMessage from '../../components/common/AlertMessage';
import { useAuth } from '../../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // ID of order currently cancelling
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to retrieve order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setActionLoading(orderId);
    setError('');
    setSuccess('');
    try {
      const res = await API.put(`/orders/cancel/${orderId}`);
      // Update order in state list
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: 'Cancelled' } : ord))
      );
      setSuccess('Order cancelled successfully.');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Spinner />;

  const statusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge bg-warning text-dark px-2.5 py-1.5 fw-semibold">Pending</span>;
      case 'Paid':
        return <span className="badge bg-success px-2.5 py-1.5 fw-semibold">Paid</span>;
      case 'Cancelled':
        return <span className="badge bg-danger px-2.5 py-1.5 fw-semibold">Cancelled</span>;
      default:
        return <span className="badge bg-secondary px-2.5 py-1.5 fw-semibold">{status}</span>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="mb-1 d-flex align-items-center gap-2">
            <FiArchive /> My Orders
          </h1>
          <p className="mb-0 opacity-75">View and track all your purchases</p>
        </div>
      </div>

      <div className="container py-4">
        <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
        <AlertMessage type="danger" message={error} onClose={() => setError('')} />

        {orders.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body py-5 text-center">
              <FiShoppingBag size={50} className="text-muted mb-3 opacity-50" />
              <h3>No orders found</h3>
              <p className="text-muted mb-4">You haven't placed any orders yet on Vistky.</p>
              <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2">
                Start Shopping Now <FiTrendingUp />
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-12">
              {orders.map((order) => (
                <div className="card border-0 shadow-sm mb-4" key={order._id}>
                  {/* Card Header information */}
                  <div className="card-body p-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-start border-bottom pb-3 mb-3 gap-3">
                      <div>
                        <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.8rem', letterSpacing: '0.50px' }}>
                          ORDER ID
                        </span>
                        <span className="font-monospace fw-bold text-secondary">{order._id}</span>
                      </div>
                      <div className="d-flex gap-4 flex-wrap">
                        <div>
                          <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.8rem', letterSpacing: '0.50px' }}>
                            DATE
                          </span>
                          <span className="fw-semibold text-secondary d-flex align-items-center gap-1.5" style={{ fontSize: '0.92rem' }}>
                            <FiCalendar size={14} className="text-primary" />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.8rem', letterSpacing: '0.50px' }}>
                            TOTAL AMOUNT
                          </span>
                          <span className="fw-bold text-primary" style={{ fontSize: '1.05rem' }}>
                            ₹{order.totalAmount?.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.8rem', letterSpacing: '0.50px' }}>
                            STATUS
                          </span>
                          {statusBadge(order.status)}
                        </div>
                      </div>
                    </div>

                    {/* Order Products details */}
                    <div className="row g-3">
                      <div className="col-12 col-md-8">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-1.5 text-secondary">
                          <FiGrid size={15} /> Order Items
                        </h6>
                        <div className="order-items-wrapper pe-md-3" style={{ maxHeight: 220, overflowY: 'auto' }}>
                          {order.products?.map((item, index) => {
                            const product = item.product;
                            if (!product) return null;

                            return (
                              <div className="d-flex align-items-center gap-3 mb-2.5 pb-2.5 border-bottom last-border-none" key={product._id || index}>
                                <div
                                  className="rounded bg-light d-flex align-items-center justify-content-center"
                                  style={{ width: 44, height: 44, overflow: 'hidden', flexShrink: 0 }}
                                >
                                  {product.image ? (
                                    <img src={product.image} alt={product.productName} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                  ) : (
                                    <FiShoppingBag size={18} color="#cbd5e1" />
                                  )}
                                </div>
                                <div className="flex-grow-1 min-width-0">
                                  <span className="fw-semibold text-secondary text-truncate d-block" style={{ fontSize: '0.9rem' }}>
                                    {product.productName}
                                  </span>
                                  <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                                    Quantity: {item.quantity} × ₹{product.price}
                                  </span>
                                </div>
                                <span className="fw-semibold text-end text-secondary" style={{ fontSize: '0.9rem', minWidth: 80 }}>
                                  ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Side delivery info and cancellation actions */}
                      <div className="col-12 col-md-4 border-start-md ps-md-4 d-flex flex-column justify-content-between">
                        <div>
                          <h6 className="fw-bold mb-3 text-secondary d-flex align-items-center gap-1.5">
                            <FiMapPin size={15} /> Delivery Details
                          </h6>
                          <div className="text-muted mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                            <div className="fw-semibold text-dark mb-1 d-flex align-items-center gap-1">
                              <FiTruck size={13} /> Home Delivery
                            </div>
                            Standard domestic shipping address
                          </div>
                        </div>

                        {order.status === 'Pending' && (
                          <button
                            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-1.5 py-2 fw-semibold"
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={actionLoading === order._id}
                            id={`cancel-order-${order._id}`}
                          >
                            <FiXCircle size={15} /> Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
