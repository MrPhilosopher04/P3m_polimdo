// src/components/Common/AlertMessage.js
import React from 'react';

const AlertMessage = ({ type = 'info', message, onClose, autoHide = false }) => {
  const typeStyles = {
    success: {
      container: 'bg-green-50 border border-green-200 text-green-800',
      icon: '✅',
      closeButton: 'text-green-500 hover:text-green-700'
    },
    error: {
      container: 'bg-red-50 border border-red-200 text-red-800',
      icon: '❌',
      closeButton: 'text-red-500 hover:text-red-700'
    },
    warning: {
      container: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
      icon: '⚠️',
      closeButton: 'text-yellow-500 hover:text-yellow-700'
    },
    info: {
      container: 'bg-blue-50 border border-blue-200 text-blue-800',
      icon: 'ℹ️',
      closeButton: 'text-blue-500 hover:text-blue-700'
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.info;

  React.useEffect(() => {
    if (autoHide && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto hide after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [autoHide, onClose]);

  if (!message) return null;

  return (
    <div className={`rounded-lg p-4 ${currentStyle.container}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-lg mr-3">{currentStyle.icon}</span>
          <div>
            <p className="font-medium">{message}</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-4 ${currentStyle.closeButton} hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;