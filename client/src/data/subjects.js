// Dữ liệu môn học theo từng lớp
export const subjectsByGrade = {
  2: [
    {
      id: 'toan-2',
      name: 'Toán học',
      icon: '🔢',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500',
      lessons: [
        {
          id: 'toan-2-ontap1',
          name: 'Ôn tập 1 - Số và phép tính',
          description: 'Ôn tập số đến 100, phép cộng trừ',
          route: '/learn/lop2/toan/ontap1',
          status: 'new'
        }
      ]
    },
    {
      id: 'van-2',
      name: 'Ngữ văn',
      icon: '📖',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-400',
      lessons: []
    },
    {
      id: 'anh-2',
      name: 'Tiếng Anh',
      icon: '🌍',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500',
      lessons: [
        {
          id: 'emg-lop2-ontap-hk1',
          name: 'EMG - Ôn tập Học kỳ 1',
          description: 'Ôn tập từ vựng và ngữ pháp HK1',
          route: '/lop2/emg/on-tap-hk1',
          status: 'new'
        }
      ]
    }
  ],
  3: [
    {
      id: 'van-3',
      name: 'Ngữ văn',
      icon: '📖',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-400',
      lessons: []
    },
    {
      id: 'toan-3',
      name: 'Toán học',
      icon: '🔢',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500',
      lessons: []
    },
    {
      id: 'anh-3',
      name: 'Tiếng Anh',
      icon: '🌍',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500',
      lessons: []
    }
  ],
  4: [
    {
      id: 'toan-4',
      name: 'Toán học và Tư duy logic',
      icon: '➕➖',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500',
      lessons: []
    },
    {
      id: 'van-4',
      name: 'Ngữ văn',
      icon: '📖',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-400',
      lessons: []
    },
    {
      id: 'anh-4',
      name: 'Tiếng Anh',
      icon: '🌍',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500',
      lessons: []
    },
    {
      id: 'lichsu-4',
      name: 'Lịch sử',
      icon: '📜',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400',
      lessons: []
    },
    {
      id: 'dialy-4',
      name: 'Địa lý',
      icon: '🗺️',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400',
      lessons: []
    },
    {
      id: 'khoahoc-4',
      name: 'Khoa học',
      icon: '🔬',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500',
      lessons: []
    }
  ],
  5: [
    {
      id: 'toan-5',
      name: 'Toán học và Tư duy logic',
      icon: '➕➖',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500',
      lessons: []
    },
    {
      id: 'van-5',
      name: 'Ngữ văn',
      icon: '📖',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-400',
      lessons: []
    },
    {
      id: 'anh-5',
      name: 'Tiếng Anh',
      icon: '🌍',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500',
      lessons: []
    },
    {
      id: 'lichsu-5',
      name: 'Lịch sử & Địa lý',
      icon: '🌏',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-green-400',
      lessons: []
    },
    {
      id: 'khoahoc-5',
      name: 'Khoa học',
      icon: '🔬',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500',
      lessons: []
    },
    {
      id: 'tinhoc-5',
      name: 'Tin học',
      icon: '💻',
      description: 'Luyện miễn phí',
      attempts: '0/3 lượt',
      color: 'bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-500',
      lessons: []
    }
  ]
};

// Môn học EMG tích hợp
export const emgSubject = {
  id: 'emg-integrated',
  name: 'Tiếng Anh Tích Hợp (EMG)',
  icon: '🎓',
  description: 'Chương trình tích hợp',
  attempts: '0/3 lượt',
  color: 'bg-gradient-to-r from-pink-400 via-rose-400 to-red-400',
  lessons: [
    {
      id: 'emg-lop2-ontap-hk1',
      name: 'Lớp 2 - Ôn tập Học kỳ 1',
      description: 'Ôn tập từ vựng và ngữ pháp HK1',
      route: '/lop2/emg/on-tap-hk1',
      status: 'new'
    },
    {
      id: 'movers-vocab',
      name: 'Movers - Vocabulary',
      description: 'Học từ vựng YLE Movers',
      route: '/english/movers/vocabulary-movers',
      status: 'new'
    },
    {
      id: 'movers-kb',
      name: 'Movers - Knowledge Base',
      description: 'Kho kiến thức YLE Movers',
      route: '/yle/movers',
      status: 'new'
    },
    {
      id: 'flyers-kb',
      name: 'Flyers - Knowledge Base',
      description: 'Kho kiến thức YLE Flyers',
      route: '/yle/flyers',
      status: 'new'
    }
  ]
};
