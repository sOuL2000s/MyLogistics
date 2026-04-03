import { Link, NavLink } from 'react-router-dom';
import { FaBoxes, FaUsersCog, FaChartLine, FaChartBar, FaSignOutAlt, FaPlusSquare, FaTimes, FaTruck } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: <FaChartLine /> },
    { name: 'Shipments', path: '/admin/shipments', icon: <FaBoxes /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsersCog /> },
    { name: 'New Shipment', path: '/shipments/create', icon: <FaPlusSquare /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white p-8 border-r border-slate-800 z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-10 mt-2">
        <Link to="/admin" className="text-2xl font-black text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-sm">A</div> Admin
        </Link>
        <button onClick={toggleSidebar} className="text-slate-400 lg:hidden">
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

export default AdminSidebar;
