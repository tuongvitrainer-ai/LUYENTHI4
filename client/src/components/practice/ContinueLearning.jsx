import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContinueLearning = ({ continueData }) => {
  const navigate = useNavigate();

  if (!continueData) {
    return null;
  }

  const handleContinue = () => {
    if (continueData.route) {
      navigate(continueData.route);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        TIẾP TỤC HỌC
      </h2>

      <div
        onClick={handleContinue}
        className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all cursor-pointer group border-2 border-blue-100"
      >
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-4xl shadow-md">
          {continueData.thumbnail || '📚'}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
            {continueData.subject}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {continueData.lesson}
          </p>

          {/* Progress Bar */}
          {continueData.progress !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${continueData.progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {continueData.progress}%
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          <button className="px-5 py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-md">
            Học tiếp ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContinueLearning;
