import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "15px", background: "#222" }}>
      <Link to="/" style={{ color: "white", marginRight: "15px" }}>Home</Link>
      <Link to="/products" style={{ color: "white", marginRight: "15px" }}>Products</Link>
      <Link to="/cart" style={{ color: "white", marginRight: "15px" }}>Cart</Link>
      <Link to="/wishlist" style={{ color: "white", marginRight: "15px" }}>Wishlist</Link>
      <Link to="/login" style={{ color: "white", marginRight: "15px" }}>Login</Link>
      <Link to="/register" style={{ color: "white" }}>Register</Link>
    </nav>
  );
}

export default Navbar;