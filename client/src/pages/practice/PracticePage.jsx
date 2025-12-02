import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SubjectCard from '../../components/practice/SubjectCard';
import { subjectsByGrade, emgSubject } from '../../data/subjects';

const PracticePage = () => {
  const { user, isAuthenticated } = useAuth();

  // Mặc định lớp 3 cho khách (chưa đăng nhập)
  const [selectedGrade, setSelectedGrade] = useState(3);
  const [subjects, setSubjects] = useState([]);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showEMG, setShowEMG] = useState(false);

  // Cập nhật danh sách môn học khi thay đổi lớp hoặc EMG
  useEffect(() => {
    let currentSubjects = [...(subjectsByGrade[selectedGrade] || [])];

    // Thêm môn EMG nếu checkbox được check
    if (showEMG) {
      currentSubjects.push(emgSubject);
    }

    setSubjects(currentSubjects);
  }, [selectedGrade, showEMG]);

  const grades = [
    { value: 2, label: 'Lớp 2', icon: '2️⃣' },
    { value: 3, label: 'Lớp 3', icon: '3️⃣' },
    { value: 4, label: 'Lớp 4', icon: '4️⃣' },
    { value: 5, label: 'Lớp 5', icon: '5️⃣' }
  ];

  const currentGrade = grades.find(g => g.value === selectedGrade);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header với bộ lọc */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              📝 Rèn Luyện
            </h1>
            <p className="text-gray-600">
              Chọn môn học để bắt đầu luyện tập
            </p>
          </div>

          {/* Bộ lọc - Dropdown lớp + Checkbox EMG */}
          <div className="flex items-center gap-3">
            {/* Dropdown lớp */}
            <div className="relative">
              <button
                onClick={() => setShowGradeDropdown(!showGradeDropdown)}
                className="flex items-center gap-2 bg-white rounded-xl shadow-md px-4 py-3 hover:shadow-lg transition-all duration-200 border-2 border-blue-200"
              >
                <span className="text-2xl">{currentGrade?.icon}</span>
                <span className="font-semibold text-gray-700">
                  {currentGrade?.label}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showGradeDropdown ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {showGradeDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-gray-100 py-2 z-10">
                  {grades.map((grade) => (
                    <button
                      key={grade.value}
                      onClick={() => {
                        setSelectedGrade(grade.value);
                        setShowGradeDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${
                        selectedGrade === grade.value
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      <span className="text-xl">{grade.icon}</span>
                      <span>{grade.label}</span>
                      {selectedGrade === grade.value && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Checkbox EMG */}
            <div className="bg-white rounded-xl shadow-md px-4 py-3 border-2 border-pink-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEMG}
                  onChange={(e) => setShowEMG(e.target.checked)}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-2 focus:ring-pink-400 cursor-pointer"
                />
                <span className="font-semibold text-gray-700 text-sm md:text-base whitespace-nowrap">
                  🎓 EMG
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Thông tin người dùng (nếu chưa đăng nhập) */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <p className="font-medium">
                Bạn đang ở chế độ khách. Đăng nhập để lưu tiến độ học tập của bạn!
              </p>
            </div>
          </div>
        )}

        {/* Grid hiển thị các thẻ môn học */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">
              Chưa có môn học nào cho lớp {selectedGrade}
            </p>
          </div>
        )}

        {/* Thống kê (nếu đã đăng nhập) */}
        {isAuthenticated && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span>
              Thống Kê Của Bạn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-6 border-2 border-yellow-300 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-gray-700 text-sm font-medium mb-1">Số sao</div>
                <div className="text-3xl font-bold text-gray-800">
                  {user?.wallet?.stars || 0}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 border-2 border-blue-300 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">🪙</div>
                <div className="text-gray-700 text-sm font-medium mb-1">Xu</div>
                <div className="text-3xl font-bold text-gray-800">
                  {user?.wallet?.coins || 0}
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 border-2 border-purple-300 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-gray-700 text-sm font-medium mb-1">Điểm tích lũy</div>
                <div className="text-3xl font-bold text-gray-800">
                  {user?.wallet?.accumulatedPoints || 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showGradeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowGradeDropdown(false)}
        />
      )}
    </div>
  );
};

export default PracticePage;
