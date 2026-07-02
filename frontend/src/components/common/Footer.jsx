const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="fw-bold">Vistky</h5>
            <p className="text-secondary mb-0">Your trusted multi-vendor e-commerce platform.</p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              <li><a href="/products" className="text-secondary text-decoration-none">Products</a></li>
              <li><a href="/cart" className="text-secondary text-decoration-none">Cart</a></li>
              <li><a href="/orders" className="text-secondary text-decoration-none">My Orders</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold">Contact</h6>
            <p className="text-secondary mb-0">support@vistky.com</p>
            <p className="text-secondary mb-0">+91 98765 43210</p>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center text-secondary mb-0">&copy; {new Date().getFullYear()} Vistky. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
