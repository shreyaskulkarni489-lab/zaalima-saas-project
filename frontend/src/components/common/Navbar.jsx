import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiShoppingCart, FiHeart, FiBell, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link${isActive ? ' active fw-semibold' : ''}`;

  const renderGuestLinks = () => (
    <>
      <li className="nav-item">
        <NavLink to="/" className={navLinkClass} onClick={closeMenu}>Home</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/products" className={navLinkClass} onClick={closeMenu}>Products</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>Login</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/register" className={navLinkClass} onClick={closeMenu}>Register</NavLink>
      </li>
    </>
  );

  const renderCustomerLinks = () => (
    <>
      <li className="nav-item">
        <NavLink to="/" className={navLinkClass} onClick={closeMenu}>Home</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/products" className={navLinkClass} onClick={closeMenu}>Products</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
          <FiShoppingCart className="me-1" />Cart
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/wishlist" className={navLinkClass} onClick={closeMenu}>
          <FiHeart className="me-1" />Wishlist
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/orders" className={navLinkClass} onClick={closeMenu}>Orders</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/notifications" className={navLinkClass} onClick={closeMenu}>
          <FiBell className="me-1" />Notifications
        </NavLink>
      </li>
    </>
  );

  const renderVendorLinks = () => (
    <>
      <li className="nav-item">
        <NavLink to="/" className={navLinkClass} onClick={closeMenu}>Home</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/vendor/dashboard" className={navLinkClass} onClick={closeMenu}>Dashboard</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/vendor/store" className={navLinkClass} onClick={closeMenu}>My Store</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/vendor/products" className={navLinkClass} onClick={closeMenu}>Products</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/vendor/orders" className={navLinkClass} onClick={closeMenu}>Orders</NavLink>
      </li>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <li className="nav-item">
        <NavLink to="/" className={navLinkClass} onClick={closeMenu}>Home</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/dashboard" className={navLinkClass} onClick={closeMenu}>Dashboard</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/users" className={navLinkClass} onClick={closeMenu}>Users</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/stores" className={navLinkClass} onClick={closeMenu}>Stores</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/products" className={navLinkClass} onClick={closeMenu}>Products</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/orders" className={navLinkClass} onClick={closeMenu}>Orders</NavLink>
      </li>
    </>
  );

  const renderNavLinks = () => {
    if (!user) return renderGuestLinks();
    switch (user.role) {
      case 'customer':
        return renderCustomerLinks();
      case 'vendor':
        return renderVendorLinks();
      case 'superadmin':
        return renderAdminLinks();
      default:
        return renderGuestLinks();
    }
  };

  const renderProfileDropdown = () => {
    if (!user) return null;

    return (
      <li className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle btn btn-link text-decoration-none d-flex align-items-center"
          id="profileDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          type="button"
        >
          <FiUser className="me-1" />
          {user.name}
        </button>
        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="profileDropdown">
          <li>
            <Link to="/profile" className="dropdown-item" onClick={closeMenu}>
              <FiUser className="me-2" />Profile
            </Link>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item" onClick={handleLogout}>
              <FiLogOut className="me-2" />Logout
            </button>
          </li>
        </ul>
      </li>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center fw-bold" onClick={closeMenu}>
          <FiShoppingBag className="me-2" size={24} />
          Zaalima
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={handleToggle}
          aria-controls="navbarContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <div className={`collapse navbar-collapse${isOpen ? ' show' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {renderNavLinks()}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {renderProfileDropdown()}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
