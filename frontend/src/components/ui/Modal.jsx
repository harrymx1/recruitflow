import React from 'react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md', zIndex = 'z-50' }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${zIndex} flex items-center justify-center px-6`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className={`relative bg-white rounded-xl shadow-lg w-full p-6 ${maxWidth} max-h-[90vh] overflow-y-auto`}>
        {title && (
          <h3 className="text-body-lg font-semibold text-ink-700 mb-4">{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
