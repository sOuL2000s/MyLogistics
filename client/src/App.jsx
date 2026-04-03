import { lazy, Suspense, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdminSidebar from './components/AdminSidebar';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateShipment = lazy(() => import('./pages/CreateShipment'));
const ShipmentDetails = lazy(() => import('./pages/ShipmentDetails'));
const PublicTracking = lazy(() => import('./pages/PublicTracking'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminShipments = lazy(() => import('./pages/admin/AdminShipments'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const DriverDashboard = lazy(() => import('./pages/driver/DriverDashboard'));
const DriverSidebar = lazy(() => import('./components/DriverSidebar'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isPublicPage = ['/', '/services', '/pricing', '/contact', '/faq', '/track'].some(path => location.pathname === path || location.pathname.startsWith('/track/'));

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Determine which sidebar to show or no sidebar
  const renderSidebar = () => {
    if (!user || isAuthPage || isPublicPage) return null;
    let SidebarComponent;
    if (user.role === 'admin' && isAdminRoute) {
      SidebarComponent = AdminSidebar;
    } else if (user.role === 'driver') {
      SidebarComponent = DriverSidebar;
    } else {
      SidebarComponent = Sidebar;
    }
    return <SidebarComponent isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />;
  };

  const mainContentClass =
    user && !isAuthPage && !isPublicPage
      ? `flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'lg:ml-64'} p-4 lg:p-8`
      : 'p-0'; // Landing pages usually need full width/no padding

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar toggleSidebar={toggleSidebar} />
      {renderSidebar()}
      <main className={`transition-all duration-300 ${mainContentClass}`}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<PublicTracking />} />
            <Route path="/track/:trackingNumber" element={<PublicTracking />} />

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shipments/create" element={<CreateShipment />} />
              <Route path="/shipments/:id" element={<ShipmentDetails />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/shipments" element={<AdminShipments />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            {/* Driver Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
