import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiPackage } from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import ProductCard from '../../components/cards/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'search' | 'price'
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBySearch = useCallback(async (kw) => {
    setLoading(true);
    try {
      const res = await API.get(`/products/search?keyword=${encodeURIComponent(kw)}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByPrice = useCallback(async (min, max) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (min) params.append('min', min);
      if (max) params.append('max', max);
      const res = await API.get(`/products/filter?${params.toString()}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount — check URL for keyword query
  useEffect(() => {
    const kw = searchParams.get('keyword');
    if (kw) {
      setKeyword(kw);
      setActiveFilter('search');
      fetchBySearch(kw);
    } else {
      fetchAll();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) { handleClear(); return; }
    setActiveFilter('search');
    setSearchParams({ keyword: keyword.trim() });
    fetchBySearch(keyword.trim());
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    if (!minPrice && !maxPrice) return;
    setActiveFilter('price');
    fetchByPrice(minPrice, maxPrice);
  };

  const handleClear = () => {
    setKeyword('');
    setMinPrice('');
    setMaxPrice('');
    setActiveFilter('all');
    setSearchParams({});
    fetchAll();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="mb-1">All Products</h1>
          <p className="mb-0 opacity-75">Browse products from all verified vendors</p>
        </div>
      </div>

      <div className="container py-4">
        {/* ========== Search & Filter Bar ========== */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3">
            <div className="row g-3 align-items-end">
              {/* Search */}
              <div className="col-12 col-md-5">
                <form onSubmit={handleSearch}>
                  <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    <FiSearch className="me-1" />SEARCH
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search products..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      id="product-search"
                    />
                    <button type="submit" className="btn btn-primary px-3">
                      <FiSearch />
                    </button>
                  </div>
                </form>
              </div>

              {/* Price Filter */}
              <div className="col-12 col-md-6">
                <form onSubmit={handlePriceFilter}>
                  <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    <FiFilter className="me-1" />PRICE RANGE (₹)
                  </label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min="0"
                      id="price-min"
                    />
                    <span className="text-muted fw-bold">—</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min="0"
                      id="price-max"
                    />
                    <button type="submit" className="btn btn-outline-primary px-3 flex-shrink-0">
                      Apply
                    </button>
                  </div>
                </form>
              </div>

              {/* Clear */}
              {activeFilter !== 'all' && (
                <div className="col-12 col-md-1 d-flex align-items-end">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={handleClear}
                    title="Clear filters"
                    id="clear-filters"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active filter badge */}
        {activeFilter !== 'all' && (
          <div className="mb-3 d-flex align-items-center gap-2">
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Showing results for:</span>
            {activeFilter === 'search' && (
              <span className="badge bg-primary px-3 py-2">"{keyword}"</span>
            )}
            {activeFilter === 'price' && (
              <span className="badge bg-success px-3 py-2">
                ₹{minPrice || '0'} — ₹{maxPrice || '∞'}
              </span>
            )}
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              ({products.length} product{products.length !== 1 ? 's' : ''} found)
            </span>
          </div>
        )}

        {/* ========== Products Grid ========== */}
        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <div className="empty-state py-5">
            <div className="icon"><FiPackage /></div>
            <h4>No products found</h4>
            <p>
              {activeFilter !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'No products have been added yet.'}
            </p>
            {activeFilter !== 'all' && (
              <button className="btn btn-primary" onClick={handleClear}>
                Show All Products
              </button>
            )}
          </div>
        ) : (
          <>
            {activeFilter === 'all' && (
              <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                {products.length} product{products.length !== 1 ? 's' : ''} available
              </p>
            )}
            <div className="row g-4">
              {products.map((product) => (
                <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
