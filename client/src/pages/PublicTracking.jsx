import React, { useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

const PublicTracking = () => {
  const [num, setNum] = useState('');
  const [ship, setShip] = useState(null);

  const track = async (e) => {
    e.preventDefault();
    const res = await api.get(`/track/${num}`);
    setShip(res.data);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <h1 className="text-3xl font-bold mb-6">Track Shipment</h1>
        <form onSubmit={track} className="flex gap-2 mb-8">
           <Input placeholder="Enter Tracking #" value={num} onChange={e => setNum(e.target.value)} />
           <Button type="submit">Search</Button>
        </form>
        {ship && (
          <div className="space-y-4">
             <p><strong>Tracking:</strong> {ship.trackingNumber}</p>
             <p><strong>Status:</strong> <StatusBadge status={ship.currentStatus} /></p>
             <p><strong>To:</strong> {ship.receiverName}***</p>
             <div className="border-t pt-4">
                <h3 className="font-bold mb-2">History</h3>
                {ship.statusHistory.map((h, i) => <div key={i} className="text-sm">{new Date(h.timestamp).toLocaleDateString()} - {h.status}</div>)}
             </div>
          </div>
        )}
      </Card>
    </div>
  );
};
export default PublicTracking;
