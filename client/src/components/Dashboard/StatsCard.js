// src/components/Dashboard/StatsCard.js
import React from 'react';

const StatsCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-icon">
        <span>{icon}</span>
      </div>
      <div className="stats-content">
        <div className="stats-value">{value}</div>
        <div className="stats-title">{title}</div>
      </div>
    </div>
  );
};

export default StatsCard;
