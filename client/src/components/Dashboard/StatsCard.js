// components/Dashboard/StatsCard.js
import React from 'react';

const StatsCard = ({ title, value, color = 'blue', icon, description, onClick }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600'
    }
  };

  const colorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div 
      className={`${colorClass.bg} ${colorClass.border} border rounded-lg p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`${colorClass.text} text-sm font-medium mb-1`}>
            {title}
          </p>
          <p className={`${colorClass.text} text-2xl font-bold`}>
            {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
          </p>
          {description && (
            <p className={`${colorClass.text} text-xs mt-1 opacity-80`}>
              {description}
            </p>
          )}
        </div>
        
        {icon && (
          <div className={`${colorClass.iconBg} rounded-lg p-3 ml-4`}>
            {typeof icon === 'string' ? (
              <span className="text-2xl">{icon}</span>
            ) : (
              <div className={`${colorClass.iconText} w-6 h-6`}>
                {icon}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;