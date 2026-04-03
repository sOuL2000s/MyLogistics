import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { useShipments } from '../../context/ShipmentContext';
import { FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SHIPMENT_STATUSES } from '../../utils/constants';
import api from '../../services/api';
import { FaEdit, FaTrash, FaEye, FaSearch, FaTruck, FaUserPlus } from 'react-icons/fa';

const AdminShipments = () => {
  const { shipments, loading, error, fetchShipments, updateShipment, deleteShipment } = useShipments();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [formData, setFormData] = useState({
    currentStatus: '',
    location: '',
    notes: '',
    expectedDeliveryDate: '',
    cost: '',
  });

  useEffect(() => {
    fetchShipments();
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const { data } = await api.get('/users');
      setDrivers(data.filter(u => u.role === 'driver'));
    } catch (err) {
      console.error('Failed to fetch drivers');
    }
  };

  const handleAssignClick = (shipment) => {
    setCurrentShipment(shipment);
    setSelectedDriver(shipment.assignedDriver || '');
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/shipments/${currentShipment._id}/assign`, { driverId: selectedDriver });
      toast.success('Driver assigned successfully');
      setIsAssignModalOpen(false);
      fetchShipments();
    } catch (err) {
      toast.error('Failed to assign driver');
    }
  };

  const handleEditClick = (shipment) => {
    setCurrentShipment(shipment);
    setFormData({
      currentStatus: shipment.currentStatus,
      location:
        shipment.currentLocation || shipment.statusHistory[shipment.statusHistory.length - 1]?.location || '',
      notes: '',
      expectedDeliveryDate: shipment.expectedDeliveryDate
        ? new Date(shipment.expectedDeliveryDate).toISOString().split('T')[0]
        : '',
      cost: shipment.cost,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateShipment(currentShipment._id, formData);
      setIsEditModalOpen(false);
      setFormData({});
    } catch (err) {
      // Error handled by context and toast
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment? This action cannot be undone.')) {
      try {
        await deleteShipment(id);
      } catch (err) {
        // Error handled by context and toast
      }
    }
  };

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.currentStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <div className="text-center text-error mt-8">Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-extrabold text-dark mb-8">Manage Shipments</h1>

      <div className="mb-6 flex items-center gap-4">
        <Input
          type="text"
          placeholder="Search by tracking #, sender, receiver, origin, destination, status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button variant="secondary">
          <FaSearch /> Search
        </Button>
      </div>

      <Card className="overflow-x-auto">
        {filteredShipments.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No shipments found matching your search.</p>
        ) : (
          <table className="min-w-full divide-y divide-light-gray">
            <thead className="bg-light-gray">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receiver
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-light-gray">
              {filteredShipments.map((s) => (
                <tr key={s._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.trackingNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={s.currentStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.origin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.destination}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.sender.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.receiver.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/shipments/${s._id}`)}
                      title="View Details"
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignClick(s)}
                      title="Assign Driver"
                      className="border-amber-400 text-amber-500 hover:bg-amber-500 hover:text-white"
                    >
                      <FaTruck />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleEditClick(s)} title="Edit Shipment">
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(s._id)}
                      title="Delete Shipment"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Update Shipment #${currentShipment?.trackingNumber}`}
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Current Status</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            value={formData.currentStatus}
            onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
            required
          >
            {SHIPMENT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Enter current location"
            required={formData.currentStatus !== currentShipment?.currentStatus}
          />
          <Input
            label="Notes (for status update)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="E.g., package arrived at sorting facility"
          />
          <Input
            label="Expected Delivery Date"
            type="date"
            value={formData.expectedDeliveryDate}
            onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
            required
          />
          <Input
            label="Cost ($)"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Shipment'}
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Delivery Driver"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Select Driver</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            required
          >
            <option value="">-- Choose Driver --</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.email})
              </option>
            ))}
          </select>
          <Button type="submit" className="w-full">
            Confirm Assignment
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminShipments;
