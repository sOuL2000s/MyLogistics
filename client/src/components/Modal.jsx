import React from 'react';
import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-slideInUp ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg transition-colors duration-200"
        >
          <FaTimes />
        </button>
        {title && <h2 className="text-2xl font-bold mb-4 text-dark border-b pb-2">{title}</h2>}
        <div className="modal-body max-h-[80vh] overflow-y-auto pr-2">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
