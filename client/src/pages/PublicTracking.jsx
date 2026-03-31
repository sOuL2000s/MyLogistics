import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

const PublicTracking = () => {
  const { trackingNumber: paramTrackingNumber } = useParams();
  const [num, setNum] = useState(paramTrackingNumber || '');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (paramTrackingNumber) {
      trackShipment(paramTrackingNumber);
    }
  }, [paramTrackingNumber]);

  const trackShipment = async (trackingNum) => {
    setLoading(true);
    setError(null);
    setShipment(null);
    try {
      const res = await api.get(`/track/${trackingNum}`);
      setShipment(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Shipment not found or tracking failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (num) {
      trackShipment(num);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <h1 className="text-3xl font-bold mb-6 text-dark">Track Your Shipment</h1>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <Input
            placeholder="Enter Tracking Number"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" className="!h-auto" /> : 'Track'}
          </Button>
        </form>

        {loading && <LoadingSpinner className="h-24" />}
        {error && <p className="text-error text-center mb-4">{error}</p>}

        {shipment && (
          <div className="space-y-4">
            <p>
              <strong>Tracking Number:</strong> {shipment.trackingNumber}
            </p>
            <p>
              <strong>Current Status:</strong> <StatusBadge status={shipment.currentStatus} />
            </p>
            <p>
              <strong>Origin:</strong> {shipment.origin}
            </p>
            <p>
              <strong>Destination:</strong> {shipment.destination}
            </p>
            <p>
              <strong>Expected Delivery:</strong> {new Date(shipment.expectedDeliveryDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Receiver (Name):</strong> {shipment.receiverName}***
            </p>

            <div className="border-t pt-4 mt-6">
              <h3 className="font-bold mb-3 text-dark">Shipment History</h3>
              <div className="space-y-3">
                {shipment.statusHistory.length > 0 ? (
                  shipment.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">{new Date(h.timestamp).toLocaleString()}</p>
                        <p className="font-medium text-dark">{h.status}</p>
                        {h.location && <p className="text-sm text-gray-600">Location: {h.location}</p>}
                        {h.notes && <p className="text-sm text-gray-600">Notes: {h.notes}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No status history available yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
        {!loading && !error && !shipment && !paramTrackingNumber && (
          <p className="text-center text-gray-600">Enter a tracking number to see shipment details.</p>
        )}
      </Card>
    </div>
  );
};
export default PublicTracking;
