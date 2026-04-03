import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { FaTruck, FaGlobe, FaClock, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingNumber) navigate(`/track/${trackingNumber}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-dark text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Fast, Reliable, Global Logistics</h1>
          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
            We deliver your packages anywhere in the world with real-time tracking and professional care.
          </p>
          
          <div className="max-w-xl mx-auto bg-white p-2 rounded-lg shadow-2xl flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter Tracking Number"
              className="flex-grow p-4 text-dark rounded-md focus:outline-none"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <Button onClick={handleTrack} size="lg" className="whitespace-nowrap">Track Now</Button>
          </div>
          <div className="mt-8">
            <Button variant="secondary" size="lg" onClick={() => navigate('/shipments/create')}>Book a Shipment</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FeatureCard icon={<FaGlobe className="text-primary text-4xl" />} title="Global Reach" desc="Shipping to over 200 countries worldwide." />
            <FeatureCard icon={<FaTruck className="text-primary text-4xl" />} title="Fast Delivery" desc="Express options for urgent shipments." />
            <FeatureCard icon={<FaClock className="text-primary text-4xl" />} title="24/7 Support" desc="We are always here to help you." />
            <FeatureCard icon={<FaShieldAlt className="text-primary text-4xl" />} title="Secure" desc="Full insurance and secure handling." />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="text-center p-6 border rounded-xl hover:shadow-lg transition-shadow">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Home;
