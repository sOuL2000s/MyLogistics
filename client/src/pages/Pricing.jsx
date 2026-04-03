import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const Pricing = () => {
  const [calcData, setCalcData] = useState({ weight: '', distance: '', type: 'standard' });
  const [estimate, setEstimate] = useState(null);

  const calculatePrice = (e) => {
    e.preventDefault();
    const base = 10;
    const perKg = 2.5;
    const perKm = 0.5;
    const multiplier = calcData.type === 'express' ? 1.5 : 1;
    
    const total = (base + (calcData.weight * perKg) + (calcData.distance * perKm)) * multiplier;
    setEstimate(total.toFixed(2));
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Pricing Estimator</h1>
      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={calculatePrice} className="space-y-4">
            <Input label="Weight (kg)" type="number" required value={calcData.weight} onChange={e => setCalcData({...calcData, weight: e.target.value})} />
            <Input label="Estimated Distance (km)" type="number" required value={calcData.distance} onChange={e => setCalcData({...calcData, distance: e.target.value})} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
              <select className="w-full p-2 border rounded-md" value={calcData.type} onChange={e => setCalcData({...calcData, type: e.target.value})}>
                <option value="standard">Standard Delivery</option>
                <option value="express">Express Delivery</option>
              </select>
            </div>
            <Button type="submit" className="w-full">Get Estimate</Button>
          </form>
          
          {estimate && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-gray-600">Estimated Shipping Cost</p>
              <h2 className="text-4xl font-bold text-primary">${estimate}</h2>
              <p className="text-xs text-gray-500 mt-2">*Final price may vary based on exact dimensions and fuel surcharges.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Pricing;