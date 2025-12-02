import React from 'react';

const SubjectCard = ({ subject, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${subject.color}
        rounded-xl p-4 cursor-pointer
        transform transition-all duration-300
        hover:scale-102 hover:shadow-lg
        border-3 ${isSelected ? 'border-white shadow-xl ring-4 ring-white/50' : 'border-white/30'}
        relative overflow-hidden
        group
        flex items-center gap-3
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white/20 rounded-lg text-2xl transform group-hover:scale-110 transition-transform">
        {subject.icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-white font-bold text-base leading-tight">
          {subject.name}
        </h3>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="text-white text-xl">
          ▶
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
