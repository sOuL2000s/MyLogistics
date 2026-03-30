import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

export const ShipmentContext = createContext();

export const ShipmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShipments = async () => {
    if (!user) {
      setShipments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let response;
      if (user.role === 'admin') {
        response = await api.get('/shipments/admin');
      } else {
        response = await api.get('/shipments/my');
      }
      setShipments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shipments.');
      toast.error('Failed to fetch shipments!');
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [user]);

  const createShipment = async (shipmentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/shipments', shipmentData);
      setShipments((prev) => [...prev, response.data]);
      toast.success('Shipment created successfully!');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shipment.');
      toast.error('Failed to create shipment!');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateShipment = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/shipments/${id}`, updatedData);
      setShipments((prev) =>
        prev.map((shipment) => (shipment._id === id ? response.data : shipment))
      );
      toast.success('Shipment updated successfully!');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shipment.');
      toast.error('Failed to update shipment!');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteShipment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/shipments/${id}`);
      setShipments((prev) => prev.filter((shipment) => shipment._id !== id));
      toast.success('Shipment deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete shipment.');
      toast.error('Failed to delete shipment!');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShipmentContext.Provider
      value={{
        shipments,
        loading,
        error,
        fetchShipments,
        createShipment,
        updateShipment,
        deleteShipment,
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipments = () => {
  return useContext(ShipmentContext);
};
