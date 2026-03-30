import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const ShipmentDetails = () => {
  const { id } = useParams();
  const [s, setS] = useState(null);

  useEffect(() => {
    api.get(`/shipments/${id}`).then(res => setS(res.data));
  }, [id]);

  if (!s) return null;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">Shipment #{s.trackingNumber}</h1>
      <Card className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div>
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <p><strong>Status:</strong> <StatusBadge status={s.currentStatus} /></p>
            <p><strong>Origin:</strong> {s.origin}</p>
            <p><strong>Destination:</strong> {s.destination}</p>
         </div>
         <div>
            <h2 className="text-xl font-bold mb-4">Sender/Receiver</h2>
            <p><strong>From:</strong> {s.sender.name}</p>
            <p><strong>To:</strong> {s.receiver.name}</p>
         </div>
      </Card>
    </div>
  );
};
export default ShipmentDetails;
