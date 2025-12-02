import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameButton from '@/components/ui/GameButton';
import GameCard from '@/components/ui/GameCard';
import useGameSound from '@/hooks/useGameSound';
import './movers.css';

const MoversKnowledgeBase = () => {
  const { playClick, playCorrect } = useGameSound();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState('vocabulary'); // vocabulary | grammar
  const [expandedCategories, setExpandedCategories] = useState({});
  const [checkedKnowledge, setCheckedKnowledge] = useState({});

  // Lesson cards data - Easy to customize
  const lessonCards = [
    {
      id: 'vocabulary',
      title: 'Vocabulary Practice',
      backgroundImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
      link: '/english/movers/vocabulary-movers',
      icon: '📚'
    },
    {
      id: 'grammar',
      title: 'Grammar Exercises',
      backgroundImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      link: '/yle/movers/grammar',
      icon: '✏️'
    },
    {
      id: 'listening',
      title: 'Listening Practice',
      backgroundImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      link: '/yle/movers/listening',
      icon: '🎧'
    },
    {
      id: 'reading',
      title: 'Reading',
      backgroundImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      link: '/yle/movers/reading',
      icon: '📖'
    }
  ];

  // Exam overview data
  const examOverview = [
    {
      id: 'listening',
      icon: '🎧',
      title: 'Listening',
      color: 'purple',
      time: '~25 phút',
      questions: '25 câu',
      parts: '5 phần',
      tasks: [
        'Nối tên với người trong tranh',
        'Điền thông tin vào biểu mẫu',
        'Nói tranh với ngày/hoạt động',
        'Trắc nghiệm (chọn tranh A, B, C)',
        'Tô màu và viết chữ'
      ]
    },
    {
      id: 'reading-writing',
      icon: '📖',
      title: 'Reading & Writing',
      color: 'pink',
      time: '30 phút',
      questions: '35 câu',
      parts: '6 phần',
      tasks: [
        'Nối định nghĩa với từ vựng',
        'Hoàn thành đoạn hội thoại',
        'Điền từ vào chỗ trống (câu chuyện)',
        'Trắc nghiệm điền từ (ngữ pháp)',
        'Viết câu mô tả tranh'
      ]
    },
    {
      id: 'speaking',
      icon: '🗣️',
      title: 'Speaking',
      color: 'orange',
      time: '5 - 7 phút',
      parts: '4 phần',
      format: '1 - 1 với giám khảo',
      tasks: [
        'Tìm điểm khác biệt giữa 2 tranh',
        'Kể chuyện dựa trên 4 tranh',
        'Tìm hình khác loại (Odd one out)',
        'Trả lời câu hỏi về bản thân'
      ]
    }
  ];

  // Vocabulary categories
  const vocabularyCategories = [
    {
      id: 'animals',
      icon: '🐾',
      title: 'Animals',
      color: '#c8e6c9',
      words: ['Cat', 'Dog', 'Bird', 'Fish', 'Rabbit', 'Horse', 'Cow', 'Sheep', 'Chicken', 'Duck', 'Elephant', 'Lion', 'Tiger', 'Monkey', 'Bear']
    },
    {
      id: 'clothes',
      icon: '👕',
      title: 'Clothes',
      color: '#f8bbd0',
      words: ['Shirt', 'T-shirt', 'Dress', 'Skirt', 'Trousers', 'Jeans', 'Shorts', 'Socks', 'Shoes', 'Hat', 'Cap', 'Jacket', 'Coat', 'Sweater', 'Scarf']
    },
    {
      id: 'health',
      icon: '💊',
      title: 'Health',
      color: '#ffccbc',
      words: ['Cough', 'Dentist', 'Doctor', 'Earache', 'Headache', 'Hospital', 'Nurse', 'Stomach-ache', 'Temperature', 'Medicine', 'Sick', 'Healthy', 'Pain', 'Better', 'Worse']
    },
    {
      id: 'food-drink',
      icon: '🍴',
      title: 'Food & Drink',
      color: '#fff9c4',
      words: ['Bread', 'Cheese', 'Chicken', 'Egg', 'Fish', 'Meat', 'Rice', 'Burger', 'Pizza', 'Cake', 'Ice cream', 'Apple', 'Banana', 'Orange', 'Water', 'Juice', 'Milk', 'Tea', 'Coffee']
    },
    {
      id: 'home',
      icon: '🏠',
      title: 'Home',
      color: '#bbdefb',
      words: ['House', 'Flat', 'Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Living room', 'Garden', 'Door', 'Window', 'Wall', 'Floor', 'Ceiling', 'Stairs', 'Roof']
    },
    {
      id: 'places',
      icon: '🌍',
      title: 'Places',
      color: '#d1c4e9',
      words: ['School', 'Park', 'Shop', 'Supermarket', 'Hospital', 'Library', 'Museum', 'Zoo', 'Beach', 'Mountain', 'River', 'City', 'Village', 'Town', 'Street']
    },
    {
      id: 'transport',
      icon: '🚌',
      title: 'Transport',
      color: '#ffe082',
      words: ['Car', 'Bus', 'Train', 'Plane', 'Bike', 'Motorbike', 'Boat', 'Ship', 'Taxi', 'Truck', 'Helicopter', 'Subway', 'Tram']
    },
    {
      id: 'weather',
      icon: '☁️',
      title: 'Weather',
      color: '#b2dfdb',
      words: ['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Snowy', 'Hot', 'Cold', 'Warm', 'Cool', 'Storm', 'Thunder', 'Lightning', 'Rainbow']
    },
    {
      id: 'school-work',
      icon: '🎓',
      title: 'School & Work',
      color: '#e1bee7',
      words: ['Teacher', 'Student', 'Classroom', 'Book', 'Pen', 'Pencil', 'Paper', 'Desk', 'Chair', 'Board', 'Computer', 'Homework', 'Test', 'Lesson', 'Subject']
    },
    {
      id: 'sports-leisure',
      icon: '⚽',
      title: 'Sports & Leisure',
      color: '#c5e1a5',
      words: ['Football', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Dancing', 'Singing', 'Drawing', 'Reading', 'Playing', 'Watching TV', 'Listening to music']
    },
    {
      id: 'time',
      icon: '🕐',
      title: 'Time',
      color: '#f0f4c3',
      words: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Morning', 'Afternoon', 'Evening', 'Night', 'Today', 'Yesterday', 'Tomorrow', "O'clock", 'Half past', 'Quarter']
    },
    {
      id: 'numbers',
      icon: '#️⃣',
      title: 'Numbers',
      color: '#ffccbc',
      words: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Hundred']
    }
  ];

  // Grammar topics
  const grammarTopics = {
    tenses: [
      {
        title: 'Present Simple (Hiện tại đơn)',
        description: 'Thói quen, sự thật hiển nhiên.',
        examples: [
          { text: 'My dad cooks dinner on Sundays.', translation: 'Bố tôi nấu bữa tối vào Chủ nhật.' }
        ]
      },
      {
        title: 'Present Continuous (Hiện tại tiếp diễn)',
        description: 'Hành động đang xảy ra.',
        examples: [
          { text: 'She is playing the piano now.', translation: 'Cô ấy đang chơi piano.' }
        ]
      },
      {
        title: 'Past Simple (Quá khứ đơn)',
        description: 'Đã xảy ra và kết thúc.',
        examples: [
          { text: 'Regular: play → played', type: 'regular' },
          { text: 'Irregular: go → went, eat → ate', type: 'irregular' }
        ]
      },
      {
        title: 'Modals (Động từ khuyết thiếu)',
        description: 'Can/Could, Must, Shall',
        examples: [
          { text: 'Can you swim?', translation: 'Bạn có thể bơi không?' },
          { text: 'You must do your homework.', translation: 'Bạn phải làm bài tập.' }
        ]
      }
    ],
    structures: [
      {
        title: 'Comparative / Superlative (So sánh)',
        examples: [
          { text: 'Big → Bigger → The biggest' },
          { text: 'Good → Better → Best' }
        ]
      },
      {
        title: 'Verb Patterns (Mẫu câu động từ)',
        examples: [
          { text: 'Like / Love / Enjoy + V-ing' },
          { text: 'Want + to V' },
          { text: 'Be good at + V-ing' }
        ]
      },
      {
        title: 'Prepositions (Giới từ)',
        subcategories: [
          {
            subtitle: 'Time:',
            text: 'at 5 o\'clock, on Sunday, in the morning'
          },
          {
            subtitle: 'Place:',
            text: 'behind, between, in front of, next to, opposite'
          }
        ]
      },
      {
        title: 'Question Words (Từ để hỏi)',
        examples: [
          { text: 'Who, What, Where, When, Which, How, How many, How often, Why (because...)' }
        ]
      }
    ]
  };

  // Knowledge checklist for progress tracking
  const knowledgeChecklist = [
    { id: 'animals-vocab', label: 'Con đã thuộc các từ vựng về Động vật (Animals)' },
    { id: 'present-simple', label: 'Con biết cách sử dụng thì Hiện tại đơn (Present Simple)' },
    { id: 'comparative', label: 'Con biết so sánh hơn và so sánh nhất (Bigger, Biggest)' },
    { id: 'describe-pictures', label: 'Con có thể miêu tả sự khác biệt giữa 2 bức tranh' },
    { id: 'prepositions', label: 'Con biết các giới từ chỉ vị trí (Behind, Between...)' },
    { id: 'irregular-verbs', label: 'Con đã thuộc các động từ bất quy tắc (Go → Went)' },
    { id: 'tell-story', label: 'Con có thể kể một câu chuyện ngắn từ 4 bức tranh' }
  ];

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    playClick();
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Toggle knowledge checkbox
  const toggleKnowledge = (knowledgeId) => {
    const newState = !checkedKnowledge[knowledgeId];
    if (newState) {
      playCorrect();
    } else {
      playClick();
    }
    setCheckedKnowledge(prev => ({
      ...prev,
      [knowledgeId]: newState
    }));
  };

  // Switch tab
  const handleTabSwitch = (tab) => {
    playClick();
    setActiveTab(tab);
  };

  // Handle lesson card click
  const handleLessonClick = (link) => {
    playClick();
    navigate(link);
  };

  // Calculate progress
  const checkedCount = Object.values(checkedKnowledge).filter(Boolean).length;
  const totalCount = knowledgeChecklist.length;
  const progressPercentage = (checkedCount / totalCount) * 100;

  return (
    <div className="movers-knowledge-base">
      {/* Header */}
      <div className="mkb-header">
        <h1 className="mkb-title">Cambridge YLE - Movers</h1>
        <p className="mkb-subtitle">Hành trang kiến thức cần thiết cho kỳ thi Movers</p>
      </div>

      {/* Lesson Cards Section - 4 columns */}
      <div className="mkb-section">
        <div className="lesson-cards-grid">
          {lessonCards.map((card) => (
            <GameCard
              key={card.id}
              className="lesson-card"
              hoverable
              onClick={() => handleLessonClick(card.link)}
            >
              <div
                className="lesson-card-background"
                style={{ backgroundImage: `url(${card.backgroundImage})` }}
              >
                <div className="lesson-card-overlay">
                  <div className="lesson-card-icon">{card.icon}</div>
                  <h3 className="lesson-card-title">{card.title}</h3>
                </div>
              </div>
            </GameCard>
          ))}
        </div>
      </div>

      {/* Exam Overview Section */}
      <div className="mkb-section">
        <h2 className="mkb-section-title">📊 Tổng Quan Kỳ Thi</h2>
        <div className="exam-overview-grid">
          {examOverview.map((section) => (
            <GameCard
              key={section.id}
              className={`exam-card exam-card-${section.color}`}
              hoverable
            >
              <div className="exam-card-header">
                <div className="exam-icon">{section.icon}</div>
                <h3 className="exam-title">{section.title}</h3>
              </div>

              <div className="exam-info">
                <div className="exam-info-item">
                  <span className="exam-info-label">Thời gian</span>
                  <span className="exam-info-value">{section.time}</span>
                </div>
                {section.questions && (
                  <div className="exam-info-item">
                    <span className="exam-info-label">Số câu hỏi</span>
                    <span className="exam-info-value">{section.questions}</span>
                  </div>
                )}
                <div className="exam-info-item">
                  <span className="exam-info-label">Số phần</span>
                  <span className="exam-info-value">{section.parts}</span>
                </div>
                {section.format && (
                  <div className="exam-info-item">
                    <span className="exam-info-label">Hình thức</span>
                    <span className="exam-info-value">{section.format}</span>
                  </div>
                )}
              </div>

              <div className="exam-tasks">
                <p className="exam-tasks-title">Nhiệm vụ chính:</p>
                <ul className="exam-tasks-list">
                  {section.tasks.map((task, idx) => (
                    <li key={idx}>{task}</li>
                  ))}
                </ul>
              </div>
            </GameCard>
          ))}
        </div>
      </div>

      {/* Knowledge System Section */}
      <div className="mkb-section">
        <h2 className="mkb-section-title">🎯 Hệ Thống Kiến Thức</h2>
        <p className="mkb-section-subtitle">Chuyên đổi giữa Từ Vựng và Ngữ Pháp để ôn tập</p>

        {/* Tab Buttons */}
        <div className="knowledge-tabs">
          <GameButton
            variant={activeTab === 'vocabulary' ? 'primary' : 'secondary'}
            size="large"
            onClick={() => handleTabSwitch('vocabulary')}
            icon={<span>📚</span>}
          >
            Từ Vựng (Vocabulary)
          </GameButton>
          <GameButton
            variant={activeTab === 'grammar' ? 'primary' : 'secondary'}
            size="large"
            onClick={() => handleTabSwitch('grammar')}
            icon={<span>🔧</span>}
          >
            Ngữ Pháp (Grammar)
          </GameButton>
        </div>

        {/* Vocabulary Content */}
        {activeTab === 'vocabulary' && (
          <div className="vocabulary-content">
            {/* Show all categories as buttons first */}
            <div className="vocab-selector-grid">
              {vocabularyCategories.map((category) => (
                <button
                  key={category.id}
                  className={`vocab-selector-btn ${expandedCategories[category.id] ? 'active' : ''}`}
                  onClick={() => toggleCategory(category.id)}
                  style={{
                    backgroundColor: expandedCategories[category.id] ? category.color : 'white',
                    borderColor: category.color
                  }}
                >
                  <span className="vocab-selector-icon">{category.icon}</span>
                  <span className="vocab-selector-title">{category.title}</span>
                </button>
              ))}
            </div>

            {/* Show expanded category content */}
            <div className="vocabulary-grid">
              {vocabularyCategories
                .filter((category) => expandedCategories[category.id])
                .map((category) => (
                  <div
                    key={category.id}
                    className="vocab-category expanded"
                    style={{ borderColor: category.color }}
                  >
                    <div
                      className="vocab-category-header"
                      style={{ backgroundColor: category.color }}
                    >
                      <div className="vocab-category-left">
                        <span className="vocab-icon">{category.icon}</span>
                        <span className="vocab-title">{category.title}</span>
                      </div>
                      <button
                        className="vocab-close-btn"
                        onClick={() => toggleCategory(category.id)}
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="vocab-words">
                      {category.words.join(', ')}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Grammar Content */}
        {activeTab === 'grammar' && (
          <div className="grammar-content">
            <div className="grammar-layout">
              {/* Left Column: Tenses & Verbs */}
              <div className="grammar-column">
                <div className="grammar-section-header">
                  <span className="grammar-icon">🔄</span>
                  <h3>Thì & Động Từ (Tenses & Verbs)</h3>
                </div>

                {grammarTopics.tenses.map((topic, idx) => (
                  <div key={idx} className="grammar-topic">
                    <div className="grammar-topic-header">
                      <span className="grammar-bullet">•</span>
                      <h4>{topic.title}</h4>
                    </div>
                    <p className="grammar-description">{topic.description}</p>
                    <div className="grammar-examples">
                      {topic.examples.map((example, exIdx) => (
                        <div
                          key={exIdx}
                          className={`grammar-example ${example.type || ''}`}
                        >
                          <code>{example.text}</code>
                          {example.translation && (
                            <span className="grammar-translation">{example.translation}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Structures */}
              <div className="grammar-column">
                <div className="grammar-section-header">
                  <span className="grammar-icon">🏗️</span>
                  <h3>Cấu Trúc Khác (Structures)</h3>
                </div>

                {grammarTopics.structures.map((topic, idx) => (
                  <div key={idx} className="grammar-topic">
                    <div className="grammar-topic-header">
                      <span className="grammar-bullet">•</span>
                      <h4>{topic.title}</h4>
                    </div>

                    {topic.examples && (
                      <div className="grammar-examples">
                        {topic.examples.map((example, exIdx) => (
                          <div key={exIdx} className="grammar-example">
                            <code>{example.text}</code>
                          </div>
                        ))}
                      </div>
                    )}

                    {topic.subcategories && (
                      <div className="grammar-subcategories">
                        {topic.subcategories.map((sub, subIdx) => (
                          <div key={subIdx} className="grammar-subcategory">
                            <strong>{sub.subtitle}</strong> {sub.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Tracking Section */}
      <div className="mkb-section">
        <h2 className="mkb-section-title">✅ Kiểm Tra Hành Trang Của Bạn</h2>
        <p className="mkb-section-subtitle">Đánh dấu vào những gì con đã tự tin nhé!</p>

        <GameCard variant="default" className="progress-card">
          <div className="knowledge-checklist">
            {knowledgeChecklist.map((item) => (
              <label key={item.id} className="checklist-item">
                <input
                  type="checkbox"
                  checked={checkedKnowledge[item.id] || false}
                  onChange={() => toggleKnowledge(item.id)}
                  className="checklist-checkbox"
                />
                <span className="checklist-label">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="progress-footer">
            <div className="progress-stats">
              <span className="progress-count">{checkedCount}/{totalCount}</span>
              <span className="progress-label">kỹ năng đã sẵn sàng!</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </GameCard>
      </div>
    </div>
  );
};

export default MoversKnowledgeBase;
