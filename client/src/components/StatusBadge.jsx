import React from 'react';

const StatusBadge = ({ status }) => {
  let classes = 'bg-slate-100 text-slate-600 border-slate-200';

  switch (status) {
    case 'Pending':
      classes = 'bg-amber-50 text-amber-600 border-amber-100';
      break;
    case 'In Transit':
      classes = 'bg-blue-50 text-blue-600 border-blue-100';
      break;
    case 'Out for Delivery':
      classes = 'bg-indigo-50 text-indigo-600 border-indigo-100';
      break;
    case 'Delivered':
      classes = 'bg-emerald-50 text-emerald-600 border-emerald-100';
      break;
    case 'Failed Attempt':
    case 'Cancelled':
      classes = 'bg-rose-50 text-rose-600 border-rose-100';
      break;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse-soft"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
