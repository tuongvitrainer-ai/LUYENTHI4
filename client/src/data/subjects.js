// Dữ liệu môn học theo từng lớp
export const subjectsByGrade = {
  
  // KHOI LOP 2
  2: [
    {
      id: 'toan-2',
      name: 'Toán',
      icon: '🔢',
      color: 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500',
      chapters: [
        {
          id: 'ontap',
          name: 'Ôn Tập',
          lessons: [
            {
              id: 'ontap1',
              name: 'Ôn tập: 11 chủ đề',
              description: '11 CHỦ ĐỀ ÔN TẬP TOÁN',
              route: '/learn/lop2/toan/ontap1',
              status: 'completed',
              progress: 100
            },

            //demo
            {
              id: 'toan-2-bai2',
              name: 'DEMO - Bài 2: Cộng có nhớ',
              description: 'Vào học',
              route: '/learn/lop2/toan/bai2',
              status: 'in-progress',
              progress: 60,
              isLocked: false
            },
            {
              id: 'toan-2-bai3',
              name: 'DEMO - Bài 3: Luyện tập chung',
              description: '',
              route: '/learn/lop2/toan/bai3',
              status: 'locked',
              isLocked: true
            }
          ]
        }
      ]
    },
    {
      id: 'van-2',
      name: 'Tiếng Việt',
      icon: '📖',
      color: 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-400',
      chapters: []
    },
    {
      id: 'anh-2',
      name: 'Tiếng Anh (SGK)',
      icon: '🌍',
      color: 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400',
      chapters: [
        {
          id: 'chuong-1-anh',
          name: 'DEMO - Chương 1: Greetings',
          lessons: [
            {
              id: 'anh-2-bai1',
              name: 'DEMO - Lesson 1: Hello',
              description: '',
              route: '/learn/lop2/anh/lesson1',
              status: 'new'
            }
          ]
        }
      ]
    }
  ],
  
  
  
  
  
  
  // KHOI LOP 3
  3: [
    {
      id: 'van-3',
      name: 'Tiếng Việt',
      icon: '📖',
      color: 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-400',
      chapters: []
    },
    {
      id: 'toan-3',
      name: 'Toán',
      icon: '🔢',
      color: 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500',
      chapters: []
    },
    {
      id: 'anh-3',
      name: 'Tiếng Anh',
      icon: '🌍',
      color: 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400',
      chapters: []
    }
  ],
  
  
  
  
  // KHOI LOP 4
  4: [
    {
      id: 'toan-4',
      name: 'Toán học và Tư duy logic',
      icon: '➕➖',
      color: 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500',
      chapters: []
    },
    {
      id: 'van-4',
      name: 'Ngữ văn',
      icon: '📖',
      color: 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-400',
      chapters: []
    },
    {
      id: 'anh-4',
      name: 'Tiếng Anh',
      icon: '🌍',
      color: 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400',
      chapters: []
    },
    {
      id: 'lichsu-4',
      name: 'Lịch sử',
      icon: '📜',
      color: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400',
      chapters: []
    },
    {
      id: 'dialy-4',
      name: 'Địa lý',
      icon: '🗺️',
      color: 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400',
      chapters: []
    },
    {
      id: 'khoahoc-4',
      name: 'Khoa học',
      icon: '🔬',
      color: 'bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500',
      chapters: []
    }
  ],
  
  // KHOI LOP 5
  5: [
    {
      id: 'toan-5',
      name: 'Toán học và Tư duy logic',
      icon: '➕➖',
      color: 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500',
      chapters: []
    },
    {
      id: 'van-5',
      name: 'Ngữ văn',
      icon: '📖',
      color: 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-400',
      chapters: []
    },
    {
      id: 'anh-5',
      name: 'Tiếng Anh',
      icon: '🌍',
      color: 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400',
      chapters: []
    },
    {
      id: 'lichsu-5',
      name: 'Lịch sử & Địa lý',
      icon: '🌏',
      color: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-green-400',
      chapters: []
    },
    {
      id: 'khoahoc-5',
      name: 'Khoa học',
      icon: '🔬',
      color: 'bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500',
      chapters: []
    },
    {
      id: 'tinhoc-5',
      name: 'Tin học',
      icon: '💻',
      color: 'bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-500',
      chapters: []
    }
  ]
};

// Môn học EMG tích hợp theo từng lớp
export const emgSubjectsByGrade = {
  
  //KHOI LOP 2
  2: {
    id: 'emg-2',
    name: 'Tiếng Anh tích hợp (EMG)',
    icon: '🎓',
    color: 'bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500',
    chapters: [
      
    ]
  },
  
  //KHOI LOP 3
  3: {
    id: 'emg-3',
    name: 'Tiếng Anh tích hợp (EMG)',
    icon: '🎓',
    color: 'bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500',
    chapters: [
      {
        id: 'emg-maths',
        name: 'DEMO - MATHS',
        lessons: [
        ]
      },
      {
        id: 'emg-science',
        name: 'DEMO - SCIENCE',
        lessons: [
        ]
      },
      
      {
        id: 'emg-lop3-ontap',
        name: 'REVIEW',
        lessons: [
          {
            id: 'emg-lop2-ontap-hk1',
            name: 'Review First Semester - Part 1',
            description: 'EMG GRADE 3 - REVIEW',
            route: '/lop3/emg/on-tap-hk1',
            status: 'new'
          }
        ]
      }
    ]
  },
  
  //KHOI LOP 4
  4: {
    id: 'emg-4',
    name: 'Tiếng Anh tích hợp (EMG)',
    icon: '🎓',
    color: 'bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500',
    chapters: [
      
    ]
  },
  
  //KHOI LOP 5
  5: {
    id: 'emg-5',
    name: 'Tiếng Anh tích hợp (EMG)',
    icon: '🎓',
    color: 'bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500',
    chapters: [
      
    ]
  }
};

// Dữ liệu mẫu cho "Tiếp tục học"
export const continueLearningSample = {
  subject: 'Toán: Phép nhân 2',
  lesson: 'Bài 2: Cộng có nhớ',
  description: 'Vào học',
  progress: 60,
  route: '/learn/lop2/toan/bai2',
  thumbnail: '🔢'
};
