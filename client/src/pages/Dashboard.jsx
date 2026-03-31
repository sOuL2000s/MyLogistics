import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { useShipments } from '../context/ShipmentContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { shipments, loading, error } = useShipments();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <div className="text-center text-error mt-8">Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-dark">My Dashboard</h1>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Shipments</h2>
          <Button onClick={() => navigate('/shipments/create')}>+ New Shipment</Button>
        </div>
        {shipments.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No shipments found. Start by creating one!</p>
        ) : (
          <div className="divide-y divide-light-gray">
            {shipments.map((s) => (
              <div key={s._id} className="flex flex-col sm:flex-row justify-between items-center p-4">
                <span className="font-semibold mb-2 sm:mb-0">#{s.trackingNumber}</span>
                <StatusBadge status={s.currentStatus} />
                <Button variant="outline" size="sm" onClick={() => navigate(`/shipments/${s._id}`)}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
export default Dashboard;
