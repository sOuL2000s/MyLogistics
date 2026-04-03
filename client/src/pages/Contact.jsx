import React from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <Card>
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" placeholder="Your Name" required />
            <Input label="Email" type="email" placeholder="Your Email" required />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200"
                rows="5"
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </Card>

        <div className="flex flex-col justify-center space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary p-4 rounded-full text-white text-xl">
              <FaPhone />
            </div>
            <div>
              <h3 className="text-xl font-bold">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-gray-600">Mon-Fri, 9am - 6pm EST</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary p-4 rounded-full text-white text-xl">
              <FaEnvelope />
            </div>
            <div>
              <h3 className="text-xl font-bold">Email Us</h3>
              <p className="text-gray-600">support@logisticsapp.com</p>
              <p className="text-gray-600">sales@logisticsapp.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary p-4 rounded-full text-white text-xl">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h3 className="text-xl font-bold">Visit Us</h3>
              <p className="text-gray-600">123 Logistics Way, Suite 100</p>
              <p className="text-gray-600">Global City, GC 54321</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
