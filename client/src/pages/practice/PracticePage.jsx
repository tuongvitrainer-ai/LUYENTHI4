import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SubjectCard from '../../components/practice/SubjectCard';
import { subjectsByGrade } from '../../data/subjects';

const PracticePage = () => {
  const { user, isAuthenticated } = useAuth();

  // Mặc định lớp 3 cho khách (chưa đăng nhập)
  // Nếu đã đăng nhập, có thể lấy grade từ user profile (hoặc để user chọn)
  const [selectedGrade, setSelectedGrade] = useState(3);
  const [subjects, setSubjects] = useState([]);

  // Cập nhật danh sách môn học khi thay đổi lớp
  useEffect(() => {
    const currentSubjects = subjectsByGrade[selectedGrade] || [];
    setSubjects(currentSubjects);
  }, [selectedGrade]);

  const grades = [
    { value: 2, label: 'Lớp 2' },
    { value: 3, label: 'Lớp 3' },
    { value: 4, label: 'Lớp 4' },
    { value: 5, label: 'Lớp 5' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header với bộ lọc lớp */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              📝 Rèn Luyện
            </h1>
            <p className="text-gray-600">
              Chọn môn học để bắt đầu luyện tập
            </p>
          </div>

          {/* Bộ lọc theo lớp - góc trên bên phải */}
          <div className="flex gap-2 bg-white rounded-xl shadow-lg p-2">
            {grades.map((grade) => (
              <button
                key={grade.value}
                onClick={() => setSelectedGrade(grade.value)}
                className={`
                  px-6 py-3 rounded-lg font-semibold
                  transition-all duration-300
                  ${
                    selectedGrade === grade.value
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {grade.label}
              </button>
            ))}
          </div>
        </div>

        {/* Thông tin người dùng (nếu chưa đăng nhập) */}
        {!isAuthenticated && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg">
            <p className="font-medium">
              💡 Bạn đang ở chế độ khách. Đăng nhập để lưu tiến độ học tập của bạn!
            </p>
          </div>
        )}

        {/* Grid hiển thị các thẻ môn học */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">
              Chưa có môn học nào cho lớp {selectedGrade}
            </p>
          </div>
        )}

        {/* Thống kê (nếu đã đăng nhập) */}
        {isAuthenticated && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📊 Thống Kê Của Bạn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-4">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-gray-700 text-sm">Số sao</div>
                <div className="text-2xl font-bold text-gray-800">
                  {user?.wallet?.stars || 0}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4">
                <div className="text-3xl mb-2">🪙</div>
                <div className="text-gray-700 text-sm">Xu</div>
                <div className="text-2xl font-bold text-gray-800">
                  {user?.wallet?.coins || 0}
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-gray-700 text-sm">Điểm tích lũy</div>
                <div className="text-2xl font-bold text-gray-800">
                  {user?.wallet?.accumulatedPoints || 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticePage;
