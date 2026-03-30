import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useShipments } from '../context/ShipmentContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { shipments, loading } = useShipments();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Shipments</h2>
          <Button onClick={() => navigate('/shipments/create')}>+ New</Button>
        </div>
        {shipments.map(s => (
          <div key={s._id} className="flex justify-between p-4 border-b">
            <span>{s.trackingNumber}</span>
            <StatusBadge status={s.currentStatus} />
            <Button variant="outline" size="sm" onClick={() => navigate(`/shipments/${s._id}`)}>View</Button>
          </div>
        ))}
      </Card>
    </div>
  );
};
export default Dashboard;
