import React from 'react';
import './GameButton.css';

// Component nút bấm chuẩn
const GameButton = ({ onClick, children, variant = 'primary', disabled }) => {
  return (
    <button 
      className={`game-btn ${variant}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default GameButton;