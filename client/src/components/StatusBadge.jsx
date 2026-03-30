import React from 'react';

const StatusBadge = ({ status }) => {
  let colorClass = 'bg-gray-200 text-gray-800'; // Default

  switch (status) {
    case 'Pending':
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'In Transit':
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case 'Out for Delivery':
      colorClass = 'bg-purple-100 text-purple-800';
      break;
    case 'Delivered':
      colorClass = 'bg-green-100 text-green-800';
      break;
    case 'Failed Attempt':
      colorClass = 'bg-red-100 text-red-800';
      break;
    case 'Cancelled':
      colorClass = 'bg-red-100 text-red-800';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-700';
  }

  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
