import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="container text-center py-5">
      <div className="py-5">
        <FiAlertTriangle size={80} className="text-warning mb-4" />
        <h1 className="display-1 fw-bold text-dark">404</h1>
        <h2 className="mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
