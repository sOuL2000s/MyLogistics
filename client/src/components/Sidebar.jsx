import { Link, NavLink } from 'react-router-dom';
import { FaChartBar, FaPlusSquare, FaSignOutAlt, FaBoxes, FaTimes } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar /> },
    { name: 'Create Shipment', path: '/shipments/create', icon: <FaPlusSquare /> },
    { name: 'My Shipments', path: '/dashboard', icon: <FaBoxes /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-dark text-white p-6 shadow-lg z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-10 mt-2">
        <Link to="/dashboard" className="text-3xl font-bold text-primary flex items-center gap-2">
          User Panel
        </Link>
        <button onClick={toggleSidebar} className="text-white lg:hidden">
          <FaTimes className="text-2xl" />
        </button>
      </div>
      <nav>
        <ul className="space-y-3">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}
          <li className="pt-10">
            <button
              onClick={logout}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-500 w-full text-left transition-all duration-300"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
