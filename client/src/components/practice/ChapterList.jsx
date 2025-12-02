import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChapterList = ({ chapters }) => {
  const navigate = useNavigate();
  const [expandedChapters, setExpandedChapters] = useState([]);

  const toggleChapter = (chapterId) => {
    if (expandedChapters.includes(chapterId)) {
      setExpandedChapters(expandedChapters.filter(id => id !== chapterId));
    } else {
      setExpandedChapters([...expandedChapters, chapterId]);
    }
  };

  const handleLessonClick = (lesson) => {
    if (!lesson.isLocked && lesson.route) {
      navigate(lesson.route);
    }
  };

  if (!chapters || chapters.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-md">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-gray-500 text-lg">
          Chưa có bài học nào
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chapters.map((chapter) => {
        const isExpanded = expandedChapters.includes(chapter.id);

        return (
          <div key={chapter.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Chapter Header */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xl transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                  ▶
                </span>
                <h3 className="font-semibold text-gray-800 text-left">
                  {chapter.name}
                </h3>
              </div>
            </button>

            {/* Lessons List */}
            {isExpanded && chapter.lessons && chapter.lessons.length > 0 && (
              <div className="border-t border-gray-100">
                {chapter.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className={`
                      flex items-center gap-3 p-4 hover:bg-blue-50 transition-all duration-200
                      border-b border-gray-50 last:border-b-0
                      ${lesson.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      group
                    `}
                  >
                    {/* Lesson Icon/Status */}
                    <div className="flex-shrink-0">
                      {lesson.status === 'completed' ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          ✓
                        </div>
                      ) : lesson.status === 'in-progress' ? (
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">
                          ●
                        </div>
                      ) : lesson.isLocked ? (
                        <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
                          🔒
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          ●
                        </div>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm ${lesson.isLocked ? 'text-gray-400' : 'text-gray-800 group-hover:text-blue-600'}`}>
                        {lesson.name}
                      </h4>
                      {lesson.description && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {lesson.description}
                        </p>
                      )}
                      {lesson.progress !== undefined && lesson.progress > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${lesson.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {!lesson.isLocked && (
                      <div className="flex-shrink-0">
                        {lesson.description === 'Vào học' || lesson.status === 'in-progress' ? (
                          <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1">
                            Học tiếp ▶
                          </button>
                        ) : (
                          <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                            →
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChapterList;
