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

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-slate-950 text-white p-6 shadow-2xl z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 border-r border-white/5`}
    >
      <div className="flex items-center justify-between mb-10 mt-2 px-2">
        <Link to="/dashboard" className="text-2xl font-black text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-sm font-bold">U</div> Panel
        </Link>
        <button onClick={toggleSidebar} className="text-slate-400 lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
          <FaTimes className="text-xl" />
        </button>
      </div>
      <nav>
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}
          <li className="pt-10">
            <button
              onClick={logout}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 w-full text-left transition-all duration-300"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
