import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useShipments } from '../context/ShipmentContext';
import { useNavigate } from 'react-router-dom';

const CreateShipment = () => {
  const { createShipment, loading } = useShipments();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sender: { name: '', address: '', contact: '' },
    receiver: { name: '', address: '', contact: '' },
    origin: '', destination: '', itemDescription: '', weight: '',
    dimensions: { length: '', width: '', height: '' },
    expectedDeliveryDate: '', cost: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createShipment(formData);
    if(res) navigate('/dashboard');
  };

  return (
    <div className="container mx-auto">
       <h1 className="text-4xl font-bold mb-8">New Shipment</h1>
       <Card>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Sender Name" value={formData.sender.name} onChange={e => setFormData({...formData, sender: {...formData.sender, name: e.target.value}})} required />
             <Input label="Receiver Name" value={formData.receiver.name} onChange={e => setFormData({...formData, receiver: {...formData.receiver, name: e.target.value}})} required />
             <Input label="Origin" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} required />
             <Input label="Destination" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} required />
             <Input label="Weight (kg)" type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} required />
             <Input label="Cost" type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} required />
             <Input label="Expected Date" type="date" value={formData.expectedDeliveryDate} onChange={e => setFormData({...formData, expectedDeliveryDate: e.target.value})} required />
             <Input label="Item Desc" value={formData.itemDescription} className="md:col-span-2" onChange={e => setFormData({...formData, itemDescription: e.target.value})} required />
             <Button type="submit" className="md:col-span-2">Create</Button>
          </form>
       </Card>
    </div>
  );
};
export default CreateShipment;
