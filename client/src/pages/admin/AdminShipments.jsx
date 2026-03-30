import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { useShipments } from '../../context/ShipmentContext';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminShipments = () => {
  const { shipments, loading, error, fetchShipments, updateShipment, deleteShipment } = useShipments();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => { fetchShipments(); }, []);

  const handleEditClick = (shipment) => {
    setCurrentShipment(shipment);
    setFormData({
      currentStatus: shipment.currentStatus,
      location: shipment.statusHistory[shipment.statusHistory.length -1]?.location || '',
      expectedDeliveryDate: shipment.expectedDeliveryDate ? new Date(shipment.expectedDeliveryDate).toISOString().split('T')[0] : '',
      cost: shipment.cost,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateShipment(currentShipment._id, formData);
      setIsEditModalOpen(false);
    } catch (err) {}
  };

  if (loading) return <LoadingSpinner className="h-64" />;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-extrabold text-dark mb-8">Manage Shipments</h1>
      <Card className="overflow-x-auto">
        <table className="min-w-full divide-y divide-light-gray">
          <thead className="bg-light-gray">
            <tr>
              <th className="px-6 py-3 text-left">Tracking #</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(s => (
              <tr key={s._id}>
                <td className="px-6 py-4">{s.trackingNumber}</td>
                <td className="px-6 py-4"><StatusBadge status={s.currentStatus} /></td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                   <Button variant="outline" size="sm" onClick={() => navigate(`/shipments/${s._id}`)}><FaEye /></Button>
                   <Button variant="secondary" size="sm" onClick={() => handleEditClick(s)}><FaEdit /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Status">
         <form onSubmit={handleUpdateSubmit}>
            <select className="w-full p-2 border mb-4" value={formData.currentStatus} onChange={e => setFormData({...formData, currentStatus: e.target.value})}>
               {['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => <option key={st} value={st}>{st}</option>)}
            </select>
            <Button type="submit">Update</Button>
         </form>
      </Modal>
    </div>
  );
};

export default AdminShipments;
