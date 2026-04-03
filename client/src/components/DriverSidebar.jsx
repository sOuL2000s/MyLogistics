import { Link, NavLink } from 'react-router-dom';
import { FaTruck, FaClipboardList, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const DriverSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const navLinks = [
    { name: 'My Deliveries', path: '/driver/dashboard', icon: <FaTruck /> },
    { name: 'Task History', path: '/driver/history', icon: <FaClipboardList /> },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white p-6 shadow-lg z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex items-center justify-between mb-10 mt-2">
        <Link to="/driver/dashboard" className="text-2xl font-bold text-success">Driver App</Link>
        <button onClick={toggleSidebar} className="lg:hidden"><FaTimes /></button>
      </div>
      <nav>
        <ul className="space-y-3">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink to={link.path} className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-success text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                {link.icon} <span>{link.name}</span>
              </NavLink>
            </li>
          ))}
          <li className="pt-6">
            <button onClick={logout} className="flex items-center gap-3 p-3 w-full text-left text-gray-400 hover:text-white"><FaSignOutAlt /> Logout</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default DriverSidebar;