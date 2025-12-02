import React, { useState } from 'react';
import { BookOpen, Headphones, Mic, Star, Clock, List, Brain, Award, ChevronRight, CheckCircle, Zap, Shield, HelpCircle, Sparkles, Send, RefreshCw, AlertCircle } from 'lucide-react';

const FlyersGuide = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Tổng Quan', icon: <Star size={18} /> },
    { id: 'structure', label: 'Cấu Trúc Bài Thi', icon: <List size={18} /> },
    { id: 'grammar', label: 'Ngữ Pháp Nâng Cao', icon: <Brain size={18} /> },
    { id: 'strategy', label: 'Chiến Lược A2', icon: <Zap size={18} /> },
    { id: 'ai-practice', label: 'Luyện Thi AI', icon: <Sparkles size={18} className="text-yellow-400" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewSection />;
      case 'structure': return <StructureSection />;
      case 'grammar': return <GrammarSection />;
      case 'strategy': return <StrategySection />;
      case 'ai-practice': return <AIPracticeSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header - Blue Theme */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Hành Trang Kỳ Thi A2 FLYERS</h1>
            <p className="text-sky-100 text-lg font-medium">Chinh phục cấp độ cao nhất của Cambridge YLE</p>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-sky-300 opacity-20 rounded-full blur-xl"></div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 sticky top-0 z-20 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm md:text-base transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-700 border-b-4 border-blue-600 bg-white shadow-inner'
                  : 'text-slate-500 hover:text-blue-500 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 bg-slate-50/30 min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// --- API Helpers ---
const apiKey = ""; // API Key provided by environment

const generateContent = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) throw new Error('API call failed');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi.";
  } catch (error) {
    console.error(error);
    return "Xin lỗi, hệ thống AI đang bận. Vui lòng thử lại sau!";
  }
};

// --- AI Practice Component (New Feature) ---
const AIPracticeSection = () => {
  const [activeFeature, setActiveFeature] = useState('writing'); // 'writing' or 'quiz'
  const [inputStory, setInputStory] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);

  const handleWritingCheck = async () => {
    if (!inputStory.trim()) return;
    setIsLoading(true);
    setAiResponse('');
    
    const prompt = `Bạn là một giám khảo chấm thi Cambridge Flyers (A2 level). 
    Hãy xem đoạn văn ngắn sau của học sinh: "${inputStory}".
    Nhiệm vụ:
    1. Nhận xét ngắn gọn về ngữ pháp và từ vựng (bằng tiếng Việt, giọng điệu khích lệ).
    2. Chỉ ra các lỗi sai cụ thể (nếu có).
    3. Viết lại một phiên bản sửa lỗi hay hơn bằng tiếng Anh (A2 level).
    Hãy trình bày kết quả rõ ràng, dễ đọc.`;

    const result = await generateContent(prompt);
    setAiResponse(result);
    setIsLoading(false);
  };

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setQuizData(null);
    
    const prompt = `Tạo một câu hỏi trắc nghiệm tiếng Anh (Multiple Choice Question) dành cho cấp độ Cambridge Flyers (A2).
    Chủ đề ngẫu nhiên (động vật, trường học, thời tiết, hoặc thì quá khứ).
    Định dạng trả về strictly như sau (không thêm markdown):
    Câu hỏi: [Nội dung câu hỏi tiếng Anh]
    A: [Lựa chọn A]
    B: [Lựa chọn B]
    C: [Lựa chọn C]
    Đáp án đúng: [A/B/C]
    Giải thích: [Giải thích ngắn bằng tiếng Việt]`;

    const result = await generateContent(prompt);
    
    // Simple parsing logic for demo purposes
    const lines = result.split('\n').filter(line => line.trim() !== '');
    // This is a basic parser, assuming AI follows instructions well. 
    // In production, structured JSON output is preferred.
    setQuizData({ raw: result }); 
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button 
          onClick={() => setActiveFeature('writing')}
          className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${activeFeature === 'writing' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300'}`}
        >
          <div className="p-2 bg-blue-100 rounded-lg"><BookOpen size={20} className="text-blue-600"/></div>
          Sửa Lỗi Bài Viết
        </button>
        <button 
          onClick={() => setActiveFeature('quiz')}
          className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${activeFeature === 'quiz' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 bg-white text-slate-500 hover:border-purple-300'}`}
        >
          <div className="p-2 bg-purple-100 rounded-lg"><HelpCircle size={20} className="text-purple-600"/></div>
          Đố Vui Thông Minh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
        {activeFeature === 'writing' ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
              <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-yellow-500" /> 
                Thử thách Writing Part 7
              </h3>
              <p className="text-sm text-blue-700">Hãy viết một câu chuyện ngắn (20-30 từ) về chuyến đi dã ngoại của bạn, hoặc mô tả bức tranh bạn tưởng tượng.</p>
            </div>
            
            <textarea 
              className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none transition-all"
              placeholder="Ví dụ: Last Sunday, I went to the park with my family. We ate sandwiches and played football..."
              value={inputStory}
              onChange={(e) => setInputStory(e.target.value)}
            ></textarea>
            
            <button 
              onClick={handleWritingCheck}
              disabled={isLoading || !inputStory.trim()}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="animate-spin" /> : <Send size={18} />}
              {isLoading ? 'AI đang chấm bài...' : 'Chấm điểm với Gemini AI ✨'}
            </button>

            {aiResponse && (
              <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200 animate-fadeIn">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Award className="text-orange-500" /> Kết quả đánh giá:
                </h4>
                <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
             <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 w-full text-left">
              <h3 className="font-bold text-purple-800 flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-yellow-500" /> 
                Luyện tập phản xạ
              </h3>
              <p className="text-sm text-purple-700">Nhấn nút bên dưới để AI tạo ra một câu hỏi trắc nghiệm ngẫu nhiên giúp bạn ôn tập từ vựng và ngữ pháp.</p>
            </div>

            {!quizData && !isLoading && (
              <div className="py-10">
                <Brain size={64} className="text-slate-200 mb-4 mx-auto" />
                <p className="text-slate-400">Chưa có câu hỏi nào. Hãy thử tạo một câu nhé!</p>
              </div>
            )}

            {isLoading && (
              <div className="py-10 flex flex-col items-center">
                <RefreshCw size={40} className="text-purple-500 animate-spin mb-4" />
                <p className="text-purple-600 font-medium">Gemini đang suy nghĩ câu hỏi khó...</p>
              </div>
            )}

            {quizData && !isLoading && (
              <div className="w-full bg-white border-2 border-purple-100 rounded-xl p-6 shadow-sm text-left animate-fadeIn">
                 <div className="whitespace-pre-line text-slate-800 text-lg leading-relaxed">
                   {quizData.raw}
                 </div>
              </div>
            )}

            <button 
              onClick={handleGenerateQuiz}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Sparkles size={18} />
              {quizData ? 'Tạo câu hỏi khác ✨' : 'Tạo câu hỏi ngay ✨'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-Components ---

const OverviewSection = () => (
  <div className="space-y-8 animate-fadeIn">
    {/* Key Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-3 text-blue-600">
          <Shield size={28} strokeWidth={2.5} />
          <h3 className="font-bold text-lg uppercase tracking-wide">Cấp độ CEFR</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-extrabold text-slate-800">A2</p>
          <span className="text-slate-500 font-medium">Elementary</span>
        </div>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">Tương đương cấp độ KET (Key English Test). Có khả năng giao tiếp cơ bản trong cuộc sống hàng ngày.</p>
      </div>
      
      <div className="bg-gradient-to-br from-sky-50 to-white p-6 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-3 text-sky-600">
          <Clock size={28} strokeWidth={2.5} />
          <h3 className="font-bold text-lg uppercase tracking-wide">Tổng thời gian</h3>
        </div>
        <p className="text-4xl font-extrabold text-slate-800">~75'</p>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          <span className="font-semibold text-sky-700">Listening:</span> 25 phút<br/>
          <span className="font-semibold text-sky-700">Reading & Writing:</span> 40 phút<br/>
          <span className="font-semibold text-sky-700">Speaking:</span> 7-9 phút
        </p>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-3 text-indigo-600">
          <BookOpen size={28} strokeWidth={2.5} />
          <h3 className="font-bold text-lg uppercase tracking-wide">Vốn từ vựng</h3>
        </div>
        <p className="text-4xl font-extrabold text-slate-800">1,400+</p>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">Bao gồm toàn bộ từ vựng Starters & Movers, cộng thêm các chủ đề trừu tượng hơn (vật liệu, cảm xúc, nghề nghiệp).</p>
      </div>
    </div>

    {/* Goals List */}
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <span className="w-1.5 h-8 bg-blue-600 rounded-full block"></span>
        Mục tiêu đầu ra (Can-do statements)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {[
          "Hiểu tiếng Anh viết đơn giản (thông báo, biển báo).",
          "Giao tiếp trong các tình huống quen thuộc (hỏi đường, giới thiệu).",
          "Hiểu và sử dụng các cụm từ & mẫu câu cơ bản.",
          "Tự giới thiệu và trả lời các câu hỏi về thông tin cá nhân.",
          "Viết được các đoạn văn ngắn, đơn giản mô tả sự việc/người.",
          "Tương tác với người bản xứ nói chậm và rõ ràng."
        ].map((goal, idx) => (
          <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors duration-200">
            <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5">
              <CheckCircle size={16} strokeWidth={3} />
            </div>
            <p className="text-slate-700 font-medium text-sm md:text-base">{goal}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StructureSection = () => {
  const papers = [
    {
      title: "Listening (Nghe)",
      subtitle: "5 Phần - 25 Câu hỏi",
      color: "bg-pink-50 border-pink-100",
      iconColor: "text-pink-600",
      icon: <Headphones size={24} />,
      parts: [
        { name: "Part 1", desc: "Nối tên với người trong tranh lớn.", detail: "Nghe mô tả chi tiết vị trí/hoạt động." },
        { name: "Part 2", desc: "Nghe và điền thông tin.", detail: "Tên, số, địa điểm, ngày tháng." },
        { name: "Part 3", desc: "Nối tranh với từ/tranh khác.", detail: "Ví dụ: Ai đã làm gì? Ai tặng quà gì?" },
        { name: "Part 4", desc: "Trắc nghiệm 3 lựa chọn (A, B, C).", detail: "Nghe ý chính và chi tiết." },
        { name: "Part 5", desc: "Tô màu và VIẾT chữ.", detail: "Khác với Movers, Flyers yêu cầu viết thêm từ." },
      ]
    },
    {
      title: "Reading & Writing (Đọc Viết)",
      subtitle: "7 Phần - 44 Câu hỏi",
      color: "bg-blue-50 border-blue-100",
      iconColor: "text-blue-600",
      icon: <BookOpen size={24} />,
      parts: [
        { name: "Part 1", desc: "Nối định nghĩa với từ vựng.", detail: "10 định nghĩa, 15 từ lựa chọn." },
        { name: "Part 2", desc: "Hoàn thành đoạn hội thoại.", detail: "Chọn câu trả lời (A-H) điền vào chỗ trống." },
        { name: "Part 3", desc: "Điền từ vào đoạn văn (Cloze test).", detail: "Chọn từ trong khung + Chọn tiêu đề bài." },
        { name: "Part 4", desc: "Trắc nghiệm ngữ pháp điền từ.", detail: "Chọn A, B, C cho mỗi chỗ trống." },
        { name: "Part 5", desc: "Hoàn thành câu dựa vào bài đọc.", detail: "Điền 1-4 từ vào chỗ trống." },
        { name: "Part 6", desc: "Tự điền từ vào đoạn văn.", detail: "Không có gợi ý (thường là giới từ, mạo từ)." },
        { name: "Part 7", desc: "Viết câu chuyện ngắn.", detail: "Dựa vào 3 bức tranh, viết 20+ từ." },
      ]
    },
    {
      title: "Speaking (Nói)",
      subtitle: "4 Phần - 7-9 Phút",
      color: "bg-amber-50 border-amber-100",
      iconColor: "text-amber-600",
      icon: <Mic size={24} />,
      parts: [
        { name: "Part 1", desc: "Tìm điểm khác biệt.", detail: "Giữa 2 bức tranh (khó hơn Movers)." },
        { name: "Part 2", desc: "Trao đổi thông tin (Information Exchange).", detail: "Hỏi và trả lời dựa trên thẻ thông tin." },
        { name: "Part 3", desc: "Kể chuyện theo tranh.", detail: "Dựa vào 5 bức tranh nối tiếp nhau." },
        { name: "Part 4", desc: "Hỏi đáp cá nhân.", detail: "Về trường học, sở thích, gia đình, tương lai." },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {papers.map((paper, idx) => (
        <div key={idx} className={`flex flex-col h-full rounded-2xl border shadow-sm overflow-hidden ${paper.color}`}>
          <div className="p-5 bg-white bg-opacity-60 border-b border-white border-opacity-50">
            <div className={`flex items-center gap-3 font-bold text-xl mb-1 ${paper.iconColor}`}>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {paper.icon}
              </div>
              {paper.title}
            </div>
            <p className="text-slate-500 text-sm font-medium ml-12">{paper.subtitle}</p>
          </div>
          <div className="p-5 flex-grow bg-white bg-opacity-40">
            <ul className="space-y-4">
              {paper.parts.map((part, pIdx) => (
                <li key={pIdx} className="relative pl-4 border-l-2 border-slate-200 hover:border-blue-400 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm">{part.name}</span>
                    <span className="text-slate-700 font-medium text-xs md:text-sm mt-0.5">{part.desc}</span>
                    <span className="text-slate-500 text-xs mt-1 italic">{part.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

const GrammarSection = () => {
  const grammarPoints = [
    {
      title: "Các thì quan trọng (Tenses)",
      items: [
        { label: "Present Perfect", example: "Have you ever been to Paris? I haven't finished yet.", note: "Dấu hiệu: ever, never, just, yet." },
        { label: "Past Continuous", example: "I was reading when he called.", note: "Hành động đang xảy ra trong quá khứ." },
        { label: "Future with 'Will'", example: "I think it will rain tomorrow.", note: "Dự đoán hoặc lời hứa." },
        { label: "Going to", example: "She is going to visit her grandma.", note: "Kế hoạch đã định trước." }
      ]
    },
    {
      title: "Cấu trúc câu (Structures)",
      items: [
        { label: "Câu điều kiện loại 0 & 1", example: "If it rains, we will stay at home.", note: "If + Present Simple, ... Will + V." },
        { label: "Câu hỏi đuôi (Tag questions)", example: "It's a nice day, isn't it?", note: "Dùng để xác nhận thông tin." },
        { label: "Passive Voice (Bị động)", example: "The chair is made of wood.", note: "Hiện tại đơn và Quá khứ đơn." },
        { label: "So sánh kép", example: "Much better, a bit taller.", note: "Nhấn mạnh mức độ so sánh." }
      ]
    },
    {
      title: "Từ loại & Modal Verbs",
      items: [
        { label: "Modal Verbs", example: "Could, Should, Might, May, Shall.", note: "Lời khuyên, khả năng, đề nghị." },
        { label: "Đại từ phản thân", example: "Myself, yourself, himself...", note: "Tự làm gì đó (He cooked it himself)." },
        { label: "Giới từ thời gian/nơi chốn", example: "Since 2010, for 2 years, across, through.", note: "Phân biệt kỹ since/for." }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 flex items-start gap-3">
        <Brain className="text-sky-600 flex-shrink-0 mt-1" />
        <p className="text-sky-800 text-sm">
          <strong>Lưu ý:</strong> Flyers yêu cầu khả năng kết hợp các thì linh hoạt (ví dụ: đang kể chuyện quá khứ thì lồng ghép quá khứ tiếp diễn).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grammarPoints.map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 font-bold text-blue-700 flex justify-between items-center">
              {section.title}
            </div>
            <div className="p-5 space-y-4">
              {section.items.map((item, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-slate-800 text-sm">{item.label}</span>
                  </div>
                  <div className="bg-blue-50/50 p-2 rounded text-xs text-slate-600 font-medium border-l-2 border-blue-400">
                    "{item.example}"
                  </div>
                  <p className="text-xs text-slate-400 mt-1 pl-1">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StrategySection = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-800 text-white p-4 font-bold text-center uppercase tracking-wider">
          Sự khác biệt chính: Movers (A1) vs Flyers (A2)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Kỹ năng</th>
                <th className="px-6 py-4 font-medium text-slate-400">Movers</th>
                <th className="px-6 py-4 font-bold text-blue-600 bg-blue-50">Flyers (Nâng cấp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 font-bold text-slate-700">Writing</td>
                <td className="px-6 py-4 text-slate-500">Viết câu đơn lẻ</td>
                <td className="px-6 py-4 bg-blue-50/30 text-slate-800 font-medium">Viết câu chuyện ngắn (20+ từ) có cốt truyện</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-700">Speaking</td>
                <td className="px-6 py-4 text-slate-500">Chủ yếu là trả lời & kể chuyện</td>
                <td className="px-6 py-4 bg-blue-50/30 text-slate-800 font-medium">Tương tác 2 chiều (Hỏi & Trả lời bạn cùng thi/giám khảo)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-700">Reading</td>
                <td className="px-6 py-4 text-slate-500">Văn bản ngắn, cụ thể</td>
                <td className="px-6 py-4 bg-blue-50/30 text-slate-800 font-medium">Văn bản dài hơn, từ vựng trừu tượng & suy luận</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-l-4 border-l-orange-500 border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <HelpCircle className="text-orange-500" size={20} />
            Mẹo "Sống còn" cho Flyers
          </h3>
          <ul className="space-y-3">
            {[
              "Speaking Part 2: Đừng chỉ trả lời cộc lốc. Nếu bạn có thẻ thông tin, hãy dùng cấu trúc câu hỏi đầy đủ.",
              "Writing Part 7: Dùng các từ nối (and, but, because, then, finally) để câu chuyện mượt mà hơn.",
              "Listening Part 1: Cẩn thận bẫy! Bạn sẽ nghe mô tả về cả 2 người giống nhau, hãy nghe kỹ chi tiết cuối cùng.",
              "Từ vựng: Học kỹ các từ chỉ chất liệu (glass, wood, silver) và động từ kép (pick up, turn on)."
            ].map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600 items-start">
                <span className="bg-orange-100 text-orange-600 font-bold w-5 h-5 flex items-center justify-center rounded-full text-xs flex-shrink-0 mt-0.5">{i+1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl text-white shadow-lg flex flex-col justify-center items-center text-center">
          <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
            <Award className="text-white" size={32} />
          </div>
          <h3 className="font-bold text-xl mb-2">Tư duy A2 Flyers</h3>
          <p className="text-blue-100 text-sm mb-6 max-w-xs">Không chỉ là học thuộc lòng, Flyers yêu cầu bạn biết <span className="font-bold text-white border-b border-white/50">sử dụng ngôn ngữ</span> để giải quyết vấn đề.</p>
          <button className="px-6 py-2 bg-white text-blue-700 font-bold rounded-full text-sm hover:bg-blue-50 transition-colors shadow-sm">
            Sẵn sàng chinh phục!
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlyersGuide;