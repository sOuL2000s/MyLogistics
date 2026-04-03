import React from 'react';
import Card from '../components/Card';

const FAQ = () => {
  const faqs = [
    {
      q: "How can I track my shipment?",
      a: "You can track your shipment using the tracking number provided at the time of booking. Simply enter it on our homepage or the dedicated tracking page."
    },
    {
      q: "What items are prohibited from shipping?",
      a: "Prohibited items include hazardous materials, explosives, flammable liquids, and certain perishable goods. Please check our full list of restricted items before booking."
    },
    {
      q: "How is the shipping cost calculated?",
      a: "Costs are calculated based on weight, dimensions, origin, destination, and the chosen service level (Standard or Express)."
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes, we ship to over 200 countries worldwide through our extensive network of global partners."
    },
    {
      q: "What should I do if my package is delayed?",
      a: "While we strive for on-time delivery, delays can happen due to weather or customs. You can contact our support team with your tracking number for detailed updates."
    }
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h1>
      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <h3 className="text-xl font-bold mb-3 text-primary">{faq.q}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
