import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import { FaUserCircle, FaTruck } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-dark p-4 shadow-lg z-30 sticky top-0 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="text-white text-2xl font-bold flex items-center gap-2">
          <FaTruck className="text-primary" /> LogisticsApp
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-white text-lg flex items-center gap-2">
                <FaUserCircle className="text-primary" /> {user.name} ({user.role})
              </span>
              <Button onClick={logout} variant="outline" className="border-white text-white hover:bg-white hover:text-dark">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/track">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-dark">
                  Track Shipment
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="primary">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
