import { Link, NavLink } from 'react-router-dom';
import { FaChartBar, FaPlusSquare, FaSignOutAlt, FaBoxes } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar /> },
    { name: 'Create Shipment', path: '/shipments/create', icon: <FaPlusSquare /> },
    { name: 'My Shipments', path: '/dashboard', icon: <FaBoxes /> }, 
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-dark text-white p-6 shadow-lg z-40 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-center mb-10 mt-2">
        <Link to="/dashboard" className="text-3xl font-bold text-primary flex items-center gap-2">
          User Panel
        </Link>
      </div>
      <nav>
        <ul className="space-y-3">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-lg hover:bg-gray-700 transition-all duration-200 ${
                    isActive ? 'bg-primary text-white shadow-md' : 'text-light-gray'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <button
              onClick={logout}
              className="flex items-center gap-3 p-3 rounded-lg text-lg text-light-gray hover:bg-gray-700 w-full text-left transition-all duration-200 mt-6"
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
