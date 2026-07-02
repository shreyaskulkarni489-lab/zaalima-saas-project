import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiPackage, FiEye } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addingCart, setAddingCart] = useState(false);
  const [addingWishlist, setAddingWishlist] = useState(false);
  const [cartMsg, setCartMsg] = useState('');

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'customer') return;
    setAddingCart(true);
    try {
      await API.post('/cart/add', { productId: product._id, quantity: 1 });
      setCartMsg('Added!');
      setTimeout(() => setCartMsg(''), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingCart(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'customer') return;
    setAddingWishlist(true);
    try {
      await API.post('/wishlist/add', { productId: product._id });
    } catch (err) {
      console.error(err);
    } finally {
      setAddingWishlist(false);
    }
  };

  return (
    <div className="product-card h-100">
      <Link to={`/products/${product._id}`} className="text-decoration-none">
        <div className="product-image">
          {product.image ? (
            <img src={product.image} alt={product.productName} />
          ) : (
            <FiPackage className="no-image" />
          )}
        </div>
      </Link>

      <div className="card-body d-flex flex-column p-3">
        <Link to={`/products/${product._id}`} className="text-decoration-none">
          <p className="product-name mb-1">{product.productName}</p>
        </Link>
        <p className="product-price">₹{Number(product.price).toLocaleString('en-IN')}</p>

        <div className="product-actions mt-auto">
          {/* View Details */}
          <Link
            to={`/products/${product._id}`}
            className="btn btn-outline-secondary btn-sm"
            title="View Details"
          >
            <FiEye />
          </Link>

          {/* Add to Wishlist — customer only */}
          {(!user || user.role === 'customer') && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleAddToWishlist}
              disabled={addingWishlist}
              title="Add to Wishlist"
            >
              <FiHeart />
            </button>
          )}

          {/* Add to Cart — customer only */}
          {(!user || user.role === 'customer') && (
            <button
              className="btn btn-primary btn-sm flex-grow-1"
              onClick={handleAddToCart}
              disabled={addingCart}
            >
              {addingCart ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : cartMsg ? (
                cartMsg
              ) : (
                <><FiShoppingCart className="me-1" />Cart</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
