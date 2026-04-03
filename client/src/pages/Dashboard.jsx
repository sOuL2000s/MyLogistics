import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { useShipments } from '../context/ShipmentContext';
import { useNavigate } from 'react-router-dom';

import { FaPlus, FaBoxOpen, FaClipboardList, FaWallet } from 'react-icons/fa';

const Dashboard = () => {
  const { shipments, loading, error } = useShipments();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <div className="text-center text-error mt-8">Error: {error}</div>;

  const totalPending = shipments.filter(s => s.currentStatus !== 'Delivered' && s.currentStatus !== 'Cancelled').length;
  const totalSpent = shipments.filter(s => s.paymentStatus === 'Paid').reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="container mx-auto animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-dark">Personal Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage and track all your active logistics.</p>
        </div>
        <Button onClick={() => navigate('/shipments/create')} size="lg" className="flex items-center gap-2 !rounded-2xl">
          <FaPlus /> New Shipment
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="!bg-primary text-white border-none flex items-center gap-5">
           <div className="bg-white/20 p-4 rounded-2xl"><FaBoxOpen className="text-3xl" /></div>
           <div><p className="text-primary-light font-medium">Total Shipments</p><h3 className="text-3xl font-bold">{shipments.length}</h3></div>
        </Card>
        <Card className="flex items-center gap-5">
           <div className="bg-amber-50 p-4 rounded-2xl"><FaClipboardList className="text-3xl text-amber-500" /></div>
           <div><p className="text-slate-500 font-medium">In Transit / Pending</p><h3 className="text-3xl font-bold">{totalPending}</h3></div>
        </Card>
        <Card className="flex items-center gap-5">
           <div className="bg-green-50 p-4 rounded-2xl"><FaWallet className="text-3xl text-green-500" /></div>
           <div><p className="text-slate-500 font-medium">Total Spent</p><h3 className="text-3xl font-bold">${totalSpent.toFixed(2)}</h3></div>
        </Card>
      </div>

      <Card className="!p-0 overflow-hidden border-none shadow-soft">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-dark">Recent Shipments</h2>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">Live Updates</span>
        </div>
        
        {shipments.length === 0 ? (
          <div className="p-12 text-center">
             <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBoxOpen className="text-3xl text-slate-300" />
             </div>
             <p className="text-slate-500">No shipments found. Start by creating one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-widest">
                  <th className="px-8 py-4 font-bold">Tracking #</th>
                  <th className="px-8 py-4 font-bold">Destination</th>
                  <th className="px-8 py-4 font-bold">Status</th>
                  <th className="px-8 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5 font-bold text-dark group-hover:text-primary transition-colors">#{s.trackingNumber}</td>
                    <td className="px-8 py-5 text-slate-600">{s.destination}</td>
                    <td className="px-8 py-5"><StatusBadge status={s.currentStatus} /></td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/shipments/${s._id}`)} className="!rounded-xl border-slate-200 text-slate-600 hover:border-primary hover:text-primary">
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
export default Dashboard;
