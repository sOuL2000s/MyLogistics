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
    <div className="flex flex-col animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-slate-950 overflow-hidden py-20 md:py-32 lg:py-40 px-4">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-primary-dark rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 text-white leading-[1.1] tracking-tight">
            Logistics <span className="text-primary-light">Reimagined</span> <br className="hidden md:block" />
            Fast. Safe. <span className="text-primary">Global.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-10 text-slate-400 max-w-2xl mx-auto font-medium">
            Empowering businesses and individuals with a smarter way to ship. Track, manage, and deliver anything, anywhere in the world.
          </p>
          
          <form onSubmit={handleTrack} className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl p-2 md:p-3 rounded-[2rem] shadow-2xl border border-white/10 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g. 7X2K...)"
              className="flex-grow bg-white px-6 py-4 text-dark rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold placeholder:text-slate-400 min-w-0"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              required
            />
            <Button type="submit" size="lg" className="whitespace-nowrap px-8 py-4 !rounded-2xl w-full sm:w-auto">
              Track Parcel
            </Button>
          </form>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" onClick={() => navigate('/shipments/create')} className="!rounded-2xl px-10">
              Start Shipping
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/pricing')} className="!rounded-2xl border-white/20 text-white hover:bg-white/10 px-10">
              Check Rates
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">World-Class Solutions</h2>
            <p className="text-slate-500">We bridge the gap between businesses and customers with efficiency and reliability.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<FaGlobe className="text-primary text-5xl" />} title="Global Network" desc="Shipping seamlessly to 200+ countries with local expertise." />
            <FeatureCard icon={<FaTruck className="text-primary text-5xl" />} title="Express Delivery" desc="Next-day delivery options for your most critical shipments." />
            <FeatureCard icon={<FaClock className="text-primary text-5xl" />} title="Real-time Tracking" desc="Precision monitoring of your package every step of the way." />
            <FeatureCard icon={<FaShieldAlt className="text-primary text-5xl" />} title="Guaranteed Safety" desc="Industry-leading insurance coverage for total peace of mind." />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-elevated hover:-translate-y-2 transition-all duration-500">
    <div className="mb-8 w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500 overflow-hidden">
       <div className="text-primary group-hover:text-white transition-colors duration-500">{icon}</div>
    </div>
    <h3 className="text-2xl font-black mb-4 text-dark">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Home;
