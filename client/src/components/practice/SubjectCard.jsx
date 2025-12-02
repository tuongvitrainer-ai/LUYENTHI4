import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    if (subject.lessons && subject.lessons.length > 0) {
      setIsExpanded(!isExpanded);
    } else if (subject.route) {
      navigate(subject.route);
    }
  };

  const handleLessonClick = (lesson, e) => {
    e.stopPropagation();
    if (lesson.route) {
      navigate(lesson.route);
    }
  };

  return (
    <div className="mb-3">
      {/* Main Card */}
      <div
        onClick={handleCardClick}
        className={`
          ${subject.color}
          rounded-xl p-4 cursor-pointer
          transform transition-all duration-300
          hover:scale-102 hover:shadow-lg
          border-2 border-white/50
          relative overflow-hidden
          group
          flex items-center gap-4
          h-20
        `}
      >
        {/* Icon - Bên trái */}
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-white/20 rounded-lg text-3xl transform group-hover:scale-110 transition-transform">
          {subject.icon}
        </div>

        {/* Content - Bên phải */}
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight mb-1">
              {subject.name}
            </h3>
            <span className="text-white/90 text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {subject.attempts}
            </span>
          </div>

          {/* Arrow or Expand Icon */}
          <div className="text-white text-2xl transform group-hover:translate-x-1 transition-transform">
            {subject.lessons && subject.lessons.length > 0 ? (
              <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                ▶
              </span>
            ) : (
              '→'
            )}
          </div>
        </div>
      </div>

      {/* Expanded Lesson List */}
      {isExpanded && subject.lessons && subject.lessons.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-md border-2 border-gray-100 p-3 animate-slideDown">
          <div className="space-y-2">
            {subject.lessons.map((lesson, index) => (
              <div
                key={lesson.id || index}
                onClick={(e) => handleLessonClick(lesson, e)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-gray-100 hover:border-blue-300 hover:shadow-sm group"
              >
                {/* Lesson Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>

                {/* Lesson Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                    {lesson.name}
                  </h4>
                  {lesson.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{lesson.description}</p>
                  )}
                </div>

                {/* Status Badge */}
                {lesson.status && (
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    lesson.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : lesson.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {lesson.status === 'completed' ? '✓ Hoàn thành' :
                     lesson.status === 'in-progress' ? '⏳ Đang học' :
                     '◯ Chưa học'}
                  </div>
                )}

                {/* Arrow */}
                <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
