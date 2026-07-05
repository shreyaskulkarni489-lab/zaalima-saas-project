import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  FiGrid, FiShoppingBag, FiPackage, FiList,
  FiTrendingUp, FiDollarSign, FiCheckCircle, FiArchive
} from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import AlertMessage from '../../components/common/AlertMessage';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  const [store, setStore] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch dashboard metrics (stores count, products count)
      const statsRes = await API.get('/vendor/dashboard');
      setStats(statsRes.data);

      // 2. Fetch vendor orders
      const ordersRes = await API.get('/vendor/orders');
      setOrdersData(ordersRes.data);

      // 3. Fetch primary store info
      try {
        const storeRes = await API.get('/stores/my-store');
        setStore(storeRes.data);
      } catch (storeError) {
        if (storeError.response && storeError.response.status === 404) {
          setStore(null); // No store created yet
        } else {
          console.error('Error fetching store:', storeError);
        }
      }
    } catch (err) {
      console.error('Error loading vendor dashboard:', err);
      setError(err.response?.data?.message || 'Failed to populate vendor metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <Spinner />;

  // Calulate Revenue and parse data
  const orders = ordersData?.orders || [];
  const totalProducts = stats?.totalProducts || 0;
  const totalStores = stats?.totalStores || 0;
  const totalOrders = ordersData?.totalOrders || 0;

  // Compute vendor revenue
  // Since order items contain the product which lists its store, we match product store _id to the vendor's store _id
  let totalRevenue = 0;
  if (store) {
    orders.forEach((order) => {
      // Only add up items if order is not cancelled
      if (order.status !== 'Cancelled') {
        order.products.forEach((item) => {
          if (item.product && item.product.store === store._id) {
            totalRevenue += item.product.price * item.quantity;
          }
        });
      }
    });
  }

  // Sidebar class handler
  const navLinkClass = ({ isActive }) =>
    `d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`;

  return (
    <div className="dashboard-layout fade-in">
      {/* ═══════════ Sidebar Section ═══════════ */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h5 className="fw-bold mb-1">Vendor Portal</h5>
          <p className="text-truncate opacity-75">{user?.name}</p>
        </div>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/vendor/dashboard" className={navLinkClass}>
              <FiGrid className="nav-icon" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/vendor/store" className={navLinkClass}>
              <FiShoppingBag className="nav-icon" /> My Store
            </NavLink>
          </li>
          <li>
            <NavLink to="/vendor/products" className={navLinkClass}>
              <FiPackage className="nav-icon" /> Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/vendor/orders" className={navLinkClass}>
              <FiList className="nav-icon" /> Orders
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* ═══════════ Main Dashboard Area ═══════════ */}
      <main className="dashboard-content">
        <div className="container-fluid p-0">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Dashboard Overview</h2>
              <p className="text-muted mb-0">Welcome back, developer merchant!</p>
            </div>
            {store && (
              <span className="badge bg-primary px-3 py-2 fw-semibold shadow-sm">
                Store Active: {store.storeName}
              </span>
            )}
          </div>

          <AlertMessage type="danger" message={error} onClose={() => setError('')} />

          {/* Prompt to store creation if no store active */}
          {!store && (
            <div className="alert alert-warning border-0 p-4 mb-4 shadow-sm rounded-3">
              <h5 className="fw-bold text-warning-dark mb-2">No Active Store Found</h5>
              <p className="mb-3 text-secondary">
                To start listing products and earning revenues, you first need to establish a store profile details.
              </p>
              <Link to="/vendor/store" className="btn btn-warning fw-semibold px-4">
                Configure Store Setup
              </Link>
            </div>
          )}

          {/* ══════ Stats Row ══════ */}
          <div className="row g-4 mb-4">
            {/* Sales Card */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card bg-gradient-primary shadow-sm h-100">
                <div className="card-icon"><FiDollarSign /></div>
                <div className="card-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <div className="card-label">Net Sales Revenue</div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card bg-gradient-success shadow-sm h-100">
                <div className="card-icon"><FiCheckCircle /></div>
                <div className="card-value">{totalOrders}</div>
                <div className="card-label">Received Orders</div>
              </div>
            </div>

            {/* Products Card */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card bg-gradient-warning shadow-sm h-100">
                <div className="card-icon"><FiPackage /></div>
                <div className="card-value">{totalProducts}</div>
                <div className="card-label">Items Listed</div>
              </div>
            </div>

            {/* Stores Card */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card bg-gradient-info shadow-sm h-100">
                <div className="card-icon"><FiShoppingBag /></div>
                <div className="card-value">{totalStores}</div>
                <div className="card-label">Stores Managed</div>
              </div>
            </div>
          </div>

          {/* ══════ Recent Orders List Table ══════ */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">Recent Order Activity</h4>
                <Link to="/vendor/orders" className="btn btn-outline-primary btn-sm fw-semibold">
                  Manage All
                </Link>
              </div>
              <hr />

              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <FiArchive size={40} className="text-muted mb-2 opacity-50" />
                  <p className="text-muted mb-0">No purchases have been verified yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items Count</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th className="text-end">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => {
                        // Calculate items quantity specific to this vendor store
                        let itemQuantity = 0;
                        let itemAmount = 0;
                        order.products.forEach((p) => {
                          if (store && p.product && p.product.store === store._id) {
                            itemQuantity += p.quantity;
                            itemAmount += p.product.price * p.quantity;
                          } else if (!store && p.product) {
                            // fallback if no store loaded yet
                            itemQuantity += p.quantity;
                            itemAmount += p.product.price * p.quantity;
                          }
                        });

                        return (
                          <tr key={order._id}>
                            <td className="font-monospace fw-semibold" style={{ fontSize: '0.85rem' }}>
                              {order._id}
                            </td>
                            <td>
                              <div className="fw-semibold">{order.customer?.name || 'Vistky Customer'}</div>
                              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {order.customer?.email}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark fw-semibold">
                                {itemQuantity} {itemQuantity === 1 ? 'item' : 'items'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${
                                order.status === 'Cancelled' ? 'bg-danger' :
                                order.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.85rem' }}>
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </td>
                            <td className="fw-bold text-end text-dark">
                              ₹{itemAmount.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
