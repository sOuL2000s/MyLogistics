import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

const ShipmentDetails = () => {
  const { user } = useAuth();
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
  const downloadInvoice = async () => {
    try {
        const { data } = await api.get(`/shipments/${id}/invoice`);
        const win = window.open('', '_blank');
        win.document.write(`
          <html>
            <head>
              <title>Invoice - ${data.invoiceNumber}</title>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-50 p-10">
              <div class="max-w-3xl mx-auto bg-white p-12 shadow-lg border-t-8 border-blue-600">
                <div class="flex justify-between items-start mb-12">
                  <div>
                    <h1 class="text-4xl font-black text-blue-600">INVOICE</h1>
                    <p class="text-gray-500 mt-2">No: ${data.invoiceNumber}</p>
                  </div>
                  <div class="text-right">
                    <h2 class="text-xl font-bold">Logistics App Inc.</h2>
                    <p class="text-gray-500">123 Logistics Way, Global City</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-12 mb-12">
                  <div>
                    <p class="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Billed To</p>
                    <p class="font-bold text-lg">${data.customer.name}</p>
                    <p class="text-gray-600">${data.customer.address}</p>
                    <p class="text-gray-600">${data.customer.contact}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Details</p>
                    <p><span class="text-gray-500">Date:</span> ${new Date(data.date).toLocaleDateString()}</p>
                    <p><span class="text-gray-500">Payment:</span> ${data.status}</p>
                  </div>
                </div>
                <table class="w-full mb-12">
                  <thead>
                    <tr class="border-b-2 border-gray-100 text-left">
                      <th class="py-4 text-gray-400 uppercase text-xs">Description</th>
                      <th class="py-4 text-gray-400 uppercase text-xs text-right">Weight</th>
                      <th class="py-4 text-gray-400 uppercase text-xs text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-50">
                      <td class="py-6 font-medium">${data.items[0].description}</td>
                      <td class="py-6 text-right text-gray-600">${data.items[0].weight} kg</td>
                      <td class="py-6 text-right font-bold">$${data.items[0].price.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="flex justify-end">
                  <div class="w-64">
                    <div class="flex justify-between py-2 border-b border-gray-100">
                      <span class="text-gray-500">Subtotal</span>
                      <span>$${data.total.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between py-4">
                      <span class="font-bold text-xl">Total</span>
                      <span class="font-black text-xl text-blue-600">$${data.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div class="mt-20 text-center text-gray-400 text-sm border-t pt-8">
                  Thank you for your business! If you have any questions, contact support@logisticsapp.com
                </div>
              </div>
              <script>window.print();</script>
            </body>
          </html>
        `);
        win.document.close();
    } catch (err) {
        toast.error('Failed to generate invoice.');
    }
  };

  const handlePayment = async (shipment) => {
    try {
      // 1. Create order on backend
      const { data: order } = await api.post(`/payments/order/${shipment._id}`);

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Logistics App',
        description: `Payment for Shipment #${shipment.trackingNumber}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. Verify payment on backend
            await api.post('/payments/verify', {
              ...response,
              shipmentId: shipment._id
            });
            toast.success('Payment successful!');
            // Refresh shipment details
            const res = await api.get(`/shipments/${id}`);
            setShipment(res.data);
          } catch (err) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shipment.sender.contact,
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initialization failed.');
    }
  };

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
            <p>
              <strong>Payment Status:</strong> 
              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${shipment.paymentStatus === 'Paid' ? 'bg-success text-white' : 'bg-error text-white'}`}>
                {shipment.paymentStatus}
              </span>
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
              {shipment.paymentStatus !== 'Paid' && user && user.role === 'user' && (
                  <Button onClick={() => handlePayment(shipment)} className="w-full py-4 !rounded-2xl">
                    Complete Payment (Razorpay)
                  </Button>
              )}
              {shipment.paymentStatus === 'Paid' && (
                  <Button variant="outline" onClick={downloadInvoice} className="w-full py-4 !rounded-2xl flex items-center justify-center gap-2">
                    Download Invoice
                  </Button>
              )}
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

      <Card className="mt-8 border-none shadow-soft overflow-hidden !p-0">
        <div className="bg-slate-50 px-8 py-5 border-b border-slate-100">
          <h2 className="text-xl font-black text-dark tracking-tight">Tracking Timeline</h2>
        </div>
        <div className="p-8">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100 ml-[-1px]"></div>
            
            <div className="space-y-10 relative">
              {shipment.statusHistory.length > 0 ? (
                [...shipment.statusHistory].reverse().map((history, index) => {
                  const isLatest = index === 0;
                  return (
                    <div key={index} className="flex gap-6 items-start">
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-transform hover:scale-110 ${isLatest ? 'bg-primary' : 'bg-slate-300'}`}>
                        <div className={`w-2 h-2 rounded-full bg-white ${isLatest ? 'animate-ping' : ''}`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                          <h4 className={`text-lg font-bold ${isLatest ? 'text-primary' : 'text-slate-600'}`}>
                            {history.status}
                          </h4>
                          <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 uppercase">
                            {new Date(history.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                          {history.location && (
                            <p className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {history.location}
                            </p>
                          )}
                          {history.notes && <p className="text-sm text-slate-500 italic leading-relaxed">"{history.notes}"</p>}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-10">No tracking events recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default ShipmentDetails;
