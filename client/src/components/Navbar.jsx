import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import { FaUserCircle, FaTruck, FaBars } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md px-4 md:px-8 py-4 shadow-xl z-[50] sticky top-0 w-full border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {user && (
            <button 
              onClick={toggleSidebar} 
              className="text-white lg:hidden mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle Sidebar"
            >
              <FaBars className="text-xl" />
            </button>
          )}
          <Link
            to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'}
            className="text-white text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 md:gap-3 group"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40 group-hover:rotate-12 transition-transform duration-300">
              <FaTruck className="text-white text-lg md:text-xl" />
            </div>
            <span>Logistics<span className="text-primary">Pro</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden lg:flex space-x-6 text-white font-medium">
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end leading-none">
                <span className="text-white font-bold text-sm">{user.name}</span>
                <span className="text-primary text-[10px] uppercase font-black tracking-widest mt-0.5">{user.role}</span>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-800 rounded-full flex items-center justify-center border border-white/10 overflow-hidden shadow-inner cursor-pointer hover:border-primary/50 transition-colors">
                <FaUserCircle className="text-slate-400 text-2xl" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <Link to="/track" className="hidden sm:block">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white hover:text-dark">
                  Track
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" size="sm">Login</Button>
              </Link>
              <Link to="/register" className="hidden xs:block">
                <Button variant="secondary" size="sm">Join</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
