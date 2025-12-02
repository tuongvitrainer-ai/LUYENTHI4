import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (subject.route) {
      navigate(subject.route);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        ${subject.color}
        rounded-2xl p-6 cursor-pointer
        transform transition-all duration-300
        hover:scale-105 hover:shadow-2xl
        border-4 border-white
        relative overflow-hidden
        group
      `}
    >
      {/* Icon background effect */}
      <div className="absolute top-0 right-0 text-6xl opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
        {subject.icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
          {subject.icon}
        </div>

        {/* Subject Name */}
        <h3 className="text-white font-bold text-xl mb-2 leading-tight">
          {subject.name}
        </h3>

        {/* Description */}
        <p className="text-white text-sm opacity-90 mb-3">
          {subject.description}
        </p>

        {/* Attempts */}
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            {subject.attempts}
          </span>

          {/* Arrow */}
          <div className="text-white text-2xl transform group-hover:translate-x-2 transition-transform">
            →
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
