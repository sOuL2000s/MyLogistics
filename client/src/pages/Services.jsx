import React from 'react';
import Card from '../components/Card';
import { FaPlane, FaShip, FaTruck, FaWarehouse } from 'react-icons/fa';

const Services = () => {
  const services = [
    { icon: <FaPlane />, title: "Air Freight", desc: "Global door-to-door express delivery for urgent parcels." },
    { icon: <FaTruck />, title: "Road Transport", desc: "Flexible trucking solutions for domestic and regional delivery." },
    { icon: <FaShip />, title: "Sea Freight", desc: "Cost-effective shipping for large-volume international cargo." },
    { icon: <FaWarehouse />, title: "Warehousing", desc: "Secure storage and fulfillment services for your inventory." },
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-16">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((s, i) => (
          <Card key={i} className="text-center flex flex-col items-center">
            <div className="text-5xl text-primary mb-6">{s.icon}</div>
            <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
            <p className="text-gray-600 leading-relaxed">{s.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Services;
