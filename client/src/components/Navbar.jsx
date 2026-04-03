import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import { FaUserCircle, FaTruck, FaBars } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md px-6 py-5 shadow-xl z-[50] sticky top-0 w-full border-b border-white/5">
      <div className="mx-auto flex justify-between items-center">
        {user && (
          <button onClick={toggleSidebar} className="text-white lg:hidden mr-4">
            <FaBars className="text-2xl" />
          </button>
        )}
        <Link
          to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'}
          className="text-white text-2xl font-black tracking-tighter flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40 group-hover:rotate-12 transition-transform duration-300">
            <FaTruck className="text-white text-xl" />
          </div>
          <span className="hidden sm:inline">Logistics<span className="text-primary">Pro</span></span>
        </Link>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-4 text-white">
            <Link to="/services" className="hover:text-primary">Services</Link>
            <Link to="/pricing" className="hover:text-primary">Pricing</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
          </div>
          {user ? (
            <>
              <div className="hidden lg:flex flex-col items-end leading-none">
                <span className="text-white font-black text-sm">{user.name}</span>
                <span className="text-primary text-[10px] uppercase font-bold tracking-widest mt-1">{user.role}</span>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                <FaUserCircle className="text-slate-500 text-2xl" />
              </div>
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
