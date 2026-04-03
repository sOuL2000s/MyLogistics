import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { SHIPMENT_STATUSES } from '../../utils/constants';
import Modal from '../../components/Modal';
import Input from '../../components/Input';

const DriverDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [formData, setFormData] = useState({
    currentStatus: '',
    location: '',
    notes: '',
  });

  const fetchDriverShipments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shipments/driver/my');
      setShipments(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch your deliveries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverShipments();
  }, []);

  const handleUpdateClick = (shipment) => {
    setCurrentShipment(shipment);
    setFormData({
      currentStatus: shipment.currentStatus,
      location: shipment.currentLocation || '',
      notes: '',
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/shipments/${currentShipment._id}`, formData);
      toast.success('Status updated successfully!');
      setIsUpdateModalOpen(false);
      fetchDriverShipments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status.');
    }
  };

  if (loading) return <LoadingSpinner className="h-64" />;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-extrabold text-dark mb-8">Driver Deliveries</h1>
      <div className="grid grid-cols-1 gap-6">
        {shipments.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 py-8">No shipments assigned to you yet.</p>
          </Card>
        ) : (
          shipments.map((s) => (
            <Card key={s._id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold">#{s.trackingNumber}</span>
                  <StatusBadge status={s.currentStatus} />
                </div>
                <div className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                  <p><strong>From:</strong> {s.origin}</p>
                  <p><strong>To:</strong> {s.destination}</p>
                  <p><strong>Receiver:</strong> {s.receiver.name} ({s.receiver.contact})</p>
                  <p><strong>Address:</strong> {s.receiver.address}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                 <Button className="flex-1 md:flex-none" variant="secondary" onClick={() => handleUpdateClick(s)}>Update Status</Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title={`Update Delivery #${currentShipment?.trackingNumber}`}>
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              value={formData.currentStatus}
              onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
              required
            >
              {SHIPMENT_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
          <Input
            label="Current Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Enter current city/facility"
            required
          />
          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Optional update notes"
          />
          <Button type="submit" className="w-full">Save Update</Button>
        </form>
      </Modal>
    </div>
  );
};

export default DriverDashboard;