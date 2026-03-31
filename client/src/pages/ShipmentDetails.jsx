import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const ShipmentDetails = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/shipments/${id}`);
        setShipment(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch shipment details.');
        toast.error(err.response?.data?.message || 'Failed to fetch shipment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [id]);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <div className="text-center text-error mt-8">Error: {error}</div>;
  if (!shipment) return <div className="text-center text-gray-600 mt-8">Shipment not found.</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-dark">Shipment #{shipment.trackingNumber}</h1>
      <Card className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Overview</h2>
          <div className="space-y-2">
            <p>
              <strong>Current Status:</strong> <StatusBadge status={shipment.currentStatus} />
            </p>
            <p>
              <strong>Current Location:</strong> {shipment.currentLocation}
            </p>
            <p>
              <strong>Origin:</strong> {shipment.origin}
            </p>
            <p>
              <strong>Destination:</strong> {shipment.destination}
            </p>
            <p>
              <strong>Item Description:</strong> {shipment.itemDescription}
            </p>
            <p>
              <strong>Weight:</strong> {shipment.weight} kg
            </p>
            <p>
              <strong>Dimensions:</strong> {shipment.dimensions.length}x{shipment.dimensions.width}x
              {shipment.dimensions.height} cm
            </p>
            <p>
              <strong>Expected Delivery:</strong> {new Date(shipment.expectedDeliveryDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Cost:</strong> ${shipment.cost.toFixed(2)}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Sender Information</h2>
          <div className="space-y-2 mb-6">
            <p>
              <strong>Name:</strong> {shipment.sender.name}
            </p>
            <p>
              <strong>Address:</strong> {shipment.sender.address}
            </p>
            <p>
              <strong>Contact:</strong> {shipment.sender.contact}
            </p>
          </div>

          <h2 className="text-xl font-bold mb-4 border-b pb-2">Receiver Information</h2>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {shipment.receiver.name}
            </p>
            <p>
              <strong>Address:</strong> {shipment.receiver.address}
            </p>
            <p>
              <strong>Contact:</strong> {shipment.receiver.contact}
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Shipment History</h2>
        <div className="space-y-4">
          {shipment.statusHistory.length > 0 ? (
            shipment.statusHistory.map((history, index) => (
              <div key={index} className="border-l-4 border-primary pl-4 py-2">
                <p className="text-sm text-gray-500">{new Date(history.timestamp).toLocaleString()}</p>
                <p className="font-semibold text-lg text-dark">{history.status}</p>
                {history.location && <p className="text-gray-700">Location: {history.location}</p>}
                {history.notes && <p className="text-gray-700">Notes: {history.notes}</p>}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No status updates yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};
export default ShipmentDetails;
