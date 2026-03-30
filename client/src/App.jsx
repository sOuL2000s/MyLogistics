import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdminSidebar from './components/AdminSidebar';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';

// Lazy load pages for performance
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateShipment = lazy(() => import('./pages/CreateShipment'));
const ShipmentDetails = lazy(() => import('./pages/ShipmentDetails'));
const PublicTracking = lazy(() => import('./pages/PublicTracking'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminShipments = lazy(() => import('./pages/admin/AdminShipments'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { user } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isPublicTracking = location.pathname.startsWith('/track');

  // Determine which sidebar to show or no sidebar
  const renderSidebar = () => {
    if (!user || isAuthPage || isPublicTracking) return null;
    if (user.role === 'admin' && isAdminRoute) {
      return <AdminSidebar />;
    }
    return <Sidebar />;
  };

  const mainContentClass = user && !isAuthPage && !isPublicTracking ? 'ml-0 lg:ml-64 p-4 lg:p-8' : 'p-4 lg:p-8';
  const displayNavbar = !isPublicTracking;

  return (
    <div className="min-h-screen flex flex-col bg-light">
      {displayNavbar && <Navbar />}
      {renderSidebar()}
      <main className={`flex-1 transition-all duration-300 ${mainContentClass}`}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<PublicTracking />} /> {/* Base route for public tracking */}
            <Route path="/track/:trackingNumber" element={<PublicTracking />} />

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
              <Route path="/" element={<Dashboard />} />
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

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
