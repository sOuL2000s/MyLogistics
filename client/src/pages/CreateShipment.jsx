import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useShipments } from '../context/ShipmentContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateShipment = () => {
  const { createShipment, loading } = useShipments();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sender: { name: '', address: '', contact: '' },
    receiver: { name: '', address: '', contact: '' },
    origin: '',
    destination: '',
    itemDescription: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    expectedDeliveryDate: '',
    cost: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.sender.name) newErrors.senderName = 'Sender name is required.';
    if (!formData.sender.address) newErrors.senderAddress = 'Sender address is required.';
    if (!formData.sender.contact) newErrors.senderContact = 'Sender contact is required.';
    if (!formData.receiver.name) newErrors.receiverName = 'Receiver name is required.';
    if (!formData.receiver.address) newErrors.receiverAddress = 'Receiver address is required.';
    if (!formData.receiver.contact) newErrors.receiverContact = 'Receiver contact is required.';
    if (!formData.origin) newErrors.origin = 'Origin is required.';
    if (!formData.destination) newErrors.destination = 'Destination is required.';
    if (!formData.itemDescription) newErrors.itemDescription = 'Item description is required.';
    if (!formData.weight || parseFloat(formData.weight) <= 0) newErrors.weight = 'Valid weight is required.';
    if (!formData.dimensions.length || parseFloat(formData.dimensions.length) <= 0)
      newErrors.dimLength = 'Valid length is required.';
    if (!formData.dimensions.width || parseFloat(formData.dimensions.width) <= 0)
      newErrors.dimWidth = 'Valid width is required.';
    if (!formData.dimensions.height || parseFloat(formData.dimensions.height) <= 0)
      newErrors.dimHeight = 'Valid height is required.';
    if (!formData.expectedDeliveryDate) newErrors.expectedDeliveryDate = 'Expected delivery date is required.';
    if (!formData.cost || parseFloat(formData.cost) <= 0) newErrors.cost = 'Valid cost is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors.');
      return;
    }
    try {
      const res = await createShipment({
        ...formData,
        weight: parseFloat(formData.weight),
        cost: parseFloat(formData.cost),
        dimensions: {
          length: parseFloat(formData.dimensions.length),
          width: parseFloat(formData.dimensions.width),
          height: parseFloat(formData.dimensions.height),
        },
      });
      if (res) navigate('/dashboard');
    } catch (err) {
      // Error handled by context and toast
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">New Shipment</h1>
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="text-xl font-semibold md:col-span-2 mt-4 mb-2 border-b pb-2">Sender Information</h2>
          <Input
            label="Sender Name"
            value={formData.sender.name}
            onChange={(e) => setFormData({ ...formData, sender: { ...formData.sender, name: e.target.value } })}
            error={errors.senderName}
            required
          />
          <Input
            label="Sender Address"
            value={formData.sender.address}
            onChange={(e) => setFormData({ ...formData, sender: { ...formData.sender, address: e.target.value } })}
            error={errors.senderAddress}
            required
          />
          <Input
            label="Sender Contact"
            value={formData.sender.contact}
            onChange={(e) => setFormData({ ...formData, sender: { ...formData.sender, contact: e.target.value } })}
            error={errors.senderContact}
            required
          />

          <h2 className="text-xl font-semibold md:col-span-2 mt-4 mb-2 border-b pb-2">Receiver Information</h2>
          <Input
            label="Receiver Name"
            value={formData.receiver.name}
            onChange={(e) => setFormData({ ...formData, receiver: { ...formData.receiver, name: e.target.value } })}
            error={errors.receiverName}
            required
          />
          <Input
            label="Receiver Address"
            value={formData.receiver.address}
            onChange={(e) => setFormData({ ...formData, receiver: { ...formData.receiver, address: e.target.value } })}
            error={errors.receiverAddress}
            required
          />
          <Input
            label="Receiver Contact"
            value={formData.receiver.contact}
            onChange={(e) => setFormData({ ...formData, receiver: { ...formData.receiver, contact: e.target.value } })}
            error={errors.receiverContact}
            required
          />

          <h2 className="text-xl font-semibold md:col-span-2 mt-4 mb-2 border-b pb-2">Shipment Details</h2>
          <Input
            label="Origin"
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            error={errors.origin}
            required
          />
          <Input
            label="Destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            error={errors.destination}
            required
          />
          <Input
            label="Item Description"
            value={formData.itemDescription}
            className="md:col-span-2"
            onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
            error={errors.itemDescription}
            required
          />
          <Input
            label="Weight (kg)"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            error={errors.weight}
            required
          />
          <Input
            label="Cost ($)"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            error={errors.cost}
            required
          />
          <Input
            label="Expected Delivery Date"
            type="date"
            value={formData.expectedDeliveryDate}
            onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
            error={errors.expectedDeliveryDate}
            required
          />

          <h3 className="text-lg font-medium md:col-span-2 mt-4 mb-2">Dimensions (cm)</h3>
          <Input
            label="Length"
            type="number"
            value={formData.dimensions.length}
            onChange={(e) =>
              setFormData({ ...formData, dimensions: { ...formData.dimensions, length: e.target.value } })
            }
            error={errors.dimLength}
            required
          />
          <Input
            label="Width"
            type="number"
            value={formData.dimensions.width}
            onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, width: e.target.value } })}
            error={errors.dimWidth}
            required
          />
          <Input
            label="Height"
            type="number"
            value={formData.dimensions.height}
            onChange={(e) =>
              setFormData({ ...formData, dimensions: { ...formData.dimensions, height: e.target.value } })
            }
            error={errors.dimHeight}
            required
          />

          <Button type="submit" className="md:col-span-2" disabled={loading}>
            {loading ? 'Creating...' : 'Create Shipment'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
export default CreateShipment;
