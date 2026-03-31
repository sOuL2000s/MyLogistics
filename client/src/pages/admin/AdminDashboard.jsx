import React from 'react';
import Card from '../../components/Card';
import { useShipments } from '../../context/ShipmentContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaBoxes, FaUsers, FaTruckLoading, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

const AdminDashboard = () => {
  const { shipments, loading, error } = useShipments();

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <div className="text-center text-error mt-8">Error: {error}</div>;

  const totalShipments = shipments.length;
  const pendingShipments = shipments.filter(s => s.currentStatus === 'Pending').length;
  const inTransitShipments = shipments.filter(s => s.currentStatus === 'In Transit').length;
  const deliveredShipments = shipments.filter(s => s.currentStatus === 'Delivered').length;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-extrabold text-dark mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center gap-4">
          <FaBoxes className="text-primary text-4xl" />
          <div><h3 className="text-lg font-semibold text-gray-600">Total</h3><p className="text-3xl font-bold">{totalShipments}</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <FaTruckLoading className="text-accent text-4xl" />
          <div><h3 className="text-lg font-semibold text-gray-600">In Transit</h3><p className="text-3xl font-bold">{inTransitShipments}</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <FaCheckCircle className="text-success text-4xl" />
          <div><h3 className="text-lg font-semibold text-gray-600">Delivered</h3><p className="text-3xl font-bold">{deliveredShipments}</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <FaHourglassHalf className="text-accent text-4xl" />
          <div><h3 className="text-lg font-semibold text-gray-600">Pending</h3><p className="text-3xl font-bold">{pendingShipments}</p></div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
