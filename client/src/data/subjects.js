// Dữ liệu môn học theo từng lớp
export const subjectsByGrade = {
  2: [
    {
      id: 'toan-2',
      name: 'Toán',
      icon: '🔢',
      color: 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500',
      chapters: [
        {
          id: 'chuong-1',
          name: 'Chương 1: Phép cộng trong phạm vi 100',
          lessons: [
            {
              id: 'toan-2-bai1',
              name: 'Bài 1: Cộng không nhớ',
              description: 'Học cách cộng các số không nhớ',
              route: '/learn/lop2/toan/ontap1',
              status: 'completed',
              progress: 100
            },
            {
              id: 'toan-2-bai2',
              name: 'Bài 2: Cộng có nhớ',
              description: 'Vào học',
              route: '/learn/lop2/toan/bai2',
              status: 'in-progress',
              progress: 60,
              isLocked: false
            },
            {
              id: 'toan-2-bai3',
              name: 'Bài 3: Luyện tập chung',
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
          name: 'Chương 1: Greetings',
          lessons: [
            {
              id: 'anh-2-bai1',
              name: 'Lesson 1: Hello',
              description: '',
              route: '/learn/lop2/anh/lesson1',
              status: 'new'
            }
          ]
        }
      ]
    }
  ],
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
  2: {
    id: 'emg-2',
    name: 'EMG (Nâng cao)',
    icon: '🎓',
    color: 'bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500',
    chapters: [
      {
        id: 'emg-lop2-basics',
        name: 'Lớp 2 - Tiếng Anh Cơ bản',
        lessons: [
          {
            id: 'emg-lop2-ontap-hk1',
            name: 'Ôn tập Học kỳ 1',
            description: 'Ôn tập từ vựng và ngữ pháp HK1',
            route: '/lop2/emg/on-tap-hk1',
            status: 'new'
          }
        ]
      }
    ]
  },
  3: {
    id: 'emg-3',
    name: 'EMG (Nâng cao)',
    icon: '🎓',
    color: 'bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500',
    chapters: [
      {
        id: 'emg-movers-level1',
        name: 'YLE Movers - Cấp độ 1',
        lessons: [
          {
            id: 'movers-vocab-beginner',
            name: 'Vocabulary - Beginner',
            description: 'Học từ vựng YLE Movers cơ bản',
            route: '/english/movers/vocabulary-movers',
            status: 'new'
          },
          {
            id: 'movers-kb',
            name: 'Movers - Knowledge Base',
            description: 'Kho kiến thức YLE Movers',
            route: '/yle/movers',
            status: 'new'
          }
        ]
      }
    ]
  },
  4: {
    id: 'emg-4',
    name: 'EMG (Nâng cao)',
    icon: '🎓',
    color: 'bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500',
    chapters: [
      {
        id: 'emg-movers-level2',
        name: 'YLE Movers - Cấp độ 2',
        lessons: [
          {
            id: 'movers-vocab-intermediate',
            name: 'Vocabulary - Intermediate',
            description: 'Học từ vựng YLE Movers nâng cao',
            route: '/english/movers/vocabulary-movers',
            status: 'new'
          },
          {
            id: 'movers-kb-4',
            name: 'Movers - Knowledge Base',
            description: 'Kho kiến thức YLE Movers',
            route: '/yle/movers',
            status: 'new'
          }
        ]
      },
      {
        id: 'emg-flyers-intro',
        name: 'YLE Flyers - Giới thiệu',
        lessons: [
          {
            id: 'flyers-intro',
            name: 'Introduction to Flyers',
            description: 'Làm quen với YLE Flyers',
            route: '/yle/flyers',
            status: 'new'
          }
        ]
      }
    ]
  },
  5: {
    id: 'emg-5',
    name: 'EMG (Nâng cao)',
    icon: '🎓',
    color: 'bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500',
    chapters: [
      {
        id: 'emg-flyers-advanced',
        name: 'YLE Flyers - Nâng cao',
        lessons: [
          {
            id: 'flyers-vocab',
            name: 'Flyers Vocabulary',
            description: 'Học từ vựng YLE Flyers',
            route: '/yle/flyers',
            status: 'new'
          },
          {
            id: 'flyers-reading',
            name: 'Flyers Reading',
            description: 'Luyện đọc YLE Flyers',
            route: '/yle/flyers',
            status: 'new'
          },
          {
            id: 'flyers-listening',
            name: 'Flyers Listening',
            description: 'Luyện nghe YLE Flyers',
            route: '/yle/flyers',
            status: 'new'
          }
        ]
      }
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
