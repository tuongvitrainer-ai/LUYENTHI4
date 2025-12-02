import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Heart, Trophy, Frown, HelpCircle, Star, Music, Volume2, VolumeX } from 'lucide-react';

// --- DATA: DANH SÁCH TỪ VỰNG ---
// Chúng ta lưu từ gốc (có dấu) và từ chuẩn hóa (không dấu) để so sánh
const WORD_DATA = [
  // --- CHỦ ĐỀ: ĐỘNG VẬT ---
  { word: "CON MÈO", category: "Động vật", hint: "Thích bắt chuột và kêu meo meo" },
  { word: "CON CHÓ", category: "Động vật", hint: "Người bạn trung thành, hay sủa gâu gâu" },
  { word: "CON GÀ", category: "Động vật", hint: "Gáy ò ó o gọi mọi người thức dậy" },
  { word: "CON VỊT", category: "Động vật", hint: "Kêu cạp cạp và bơi dưới nước" },
  { word: "CON TRÂU", category: "Động vật", hint: "Giúp bác nông dân cày ruộng" },
  { word: "CON BÒ", category: "Động vật", hint: "Ăn cỏ và cho sữa uống rất ngon" },
  { word: "CON LỢN", category: "Động vật", hint: "Ăn no rồi ngủ, kêu ủn ỉn" },
  { word: "CÁ HEO", category: "Động vật", hint: "Loài cá thông minh, biết làm xiếc" },
  { word: "CON VOI", category: "Động vật", hint: "Có cái vòi dài và đôi ngà trắng" },
  { word: "CON KHỈ", category: "Động vật", hint: "Thích leo trèo và ăn chuối" },
  { word: "HƯƠU CAO CỔ", category: "Động vật", hint: "Cái cổ rất dài để ăn lá trên cao" },
  { word: "CON HỔ", category: "Động vật", hint: "Chúa sơn lâm, có vằn đen vàng" },
  { word: "CON THỎ", category: "Động vật", hint: "Tai dài, đuôi ngắn, thích ăn cà rốt" },
  { word: "CON RÙA", category: "Động vật", hint: "Bò rất chậm và mang cái mai nặng" },
  { word: "CON ẾCH", category: "Động vật", hint: "Ngồi trên lá sen, kêu ộp ộp" },
  { word: "CON ONG", category: "Động vật", hint: "Chăm chỉ đi tìm mật ngọt cho đời" },
  { word: "CON BƯỚM", category: "Động vật", hint: "Có đôi cánh rực rỡ nhiều màu sắc" },
  { word: "CON CUA", category: "Động vật", hint: "Có hai cái càng to, bò ngang" },
  { word: "CON TÔM", category: "Động vật", hint: "Sống dưới nước, bơi lùi" },
  { word: "CON CÁ", category: "Động vật", hint: "Bơi lội tung tăng dưới nước" },

  // --- CHỦ ĐỀ: HOA QUẢ ---
  { word: "QUẢ CAM", category: "Hoa quả", hint: "Trái tròn, màu cam, nhiều vitamin C" },
  { word: "QUẢ TÁO", category: "Hoa quả", hint: "Vỏ đỏ hoặc xanh, ăn giòn ngọt" },
  { word: "QUẢ CHUỐI", category: "Hoa quả", hint: "Quả dài, vỏ vàng, khỉ rất thích ăn" },
  { word: "DƯA HẤU", category: "Hoa quả", hint: "Vỏ xanh ruột đỏ, ăn rất mát" },
  { word: "QUẢ XOÀI", category: "Hoa quả", hint: "Khi chín vỏ vàng, ăn ngọt lịm" },
  { word: "QUẢ NHO", category: "Hoa quả", hint: "Mọc thành chùm, có màu tím hoặc xanh" },
  { word: "QUẢ MÍT", category: "Hoa quả", hint: "Vỏ có gai, múi vàng thơm lừng" },
  { word: "QUẢ DỨA", category: "Hoa quả", hint: "Vỏ có mắt, lá có gai, vị chua ngọt" },
  { word: "QUẢ ĐU ĐỦ", category: "Hoa quả", hint: "Ruột màu cam đỏ, hạt đen nhỏ xíu" },
  { word: "QUẢ ỔI", category: "Hoa quả", hint: "Vỏ xanh, ruột trắng hoặc hồng, giòn tan" },
  { word: "QUẢ CHANH", category: "Hoa quả", hint: "Vị rất chua, dùng để pha nước uống" },
  { word: "QUẢ DỪA", category: "Hoa quả", hint: "Bên trong có nước ngọt mát lành" },
  { word: "QUẢ BƯỞI", category: "Hoa quả", hint: "To hơn quả cam, múi tép mọng nước" },
  { word: "QUẢ NA", category: "Hoa quả", hint: "Vỏ có nhiều mắt, thịt trắng ngọt" },
  { word: "QUẢ KHẾ", category: "Hoa quả", hint: "Cắt ra có hình ngôi sao năm cánh" },

  // --- CHỦ ĐỀ: ĐỒ VẬT TRONG NHÀ & TRƯỜNG LỚP ---
  { word: "CÁI BÀN", category: "Đồ vật", hint: "Dùng để đặt sách vở lên học bài" },
  { word: "CÁI GHẾ", category: "Đồ vật", hint: "Dùng để ngồi học hoặc nghỉ ngơi" },
  { word: "QUYỂN VỞ", category: "Đồ vật", hint: "Dùng để viết bài vào đó" },
  { word: "CÁI BÚT", category: "Đồ vật", hint: "Dùng để viết chữ đẹp" },
  { word: "QUYỂN SÁCH", category: "Đồ vật", hint: "Chứa nhiều kiến thức hay" },
  { word: "CÁI CẶP", category: "Đồ vật", hint: "Dùng để đựng sách vở đi học" },
  { word: "CÁI BẢNG", category: "Đồ vật", hint: "Thầy cô viết phấn lên đó" },
  { word: "VIÊN PHẤN", category: "Đồ vật", hint: "Dùng để viết lên bảng đen" },
  { word: "CÁI QUẠT", category: "Đồ vật", hint: "Tạo ra gió mát ngày hè" },
  { word: "TIVI", category: "Đồ vật", hint: "Xem phim hoạt hình trên đó" },
  { word: "ĐỒNG HỒ", category: "Đồ vật", hint: "Dùng để xem giờ giấc" },
  { word: "CÁI GIƯỜNG", category: "Đồ vật", hint: "Nơi bé nằm ngủ êm ái" },
  { word: "CÁI TỦ", category: "Đồ vật", hint: "Dùng để đựng quần áo gọn gàng" },
  { word: "CÁI CHỔI", category: "Đồ vật", hint: "Dùng để quét nhà sạch sẽ" },
  { word: "CÁI BÁT", category: "Đồ vật", hint: "Dùng để đựng cơm ăn hàng ngày" },
  { word: "ĐÔI ĐŨA", category: "Đồ vật", hint: "Dùng để gắp thức ăn" },
  { word: "CÁI THÌA", category: "Đồ vật", hint: "Dùng để xúc cháo hoặc cơm" },
  { word: "CÁI NỒI", category: "Đồ vật", hint: "Mẹ dùng để nấu canh" },
  { word: "ĐÈN HỌC", category: "Đồ vật", hint: "Chiếu sáng cho bé học bài tối" },
  { word: "CỤC TẨY", category: "Đồ vật", hint: "Xóa những nét chì viết sai" },

  // --- CHỦ ĐỀ: THIÊN NHIÊN ---
  { word: "MẶT TRỜI", category: "Thiên nhiên", hint: "Toả nắng ấm áp vào ban ngày" },
  { word: "MẶT TRĂNG", category: "Thiên nhiên", hint: "Toả sáng dịu dàng vào ban đêm" },
  { word: "NGÔI SAO", category: "Thiên nhiên", hint: "Lấp lánh trên bầu trời đêm" },
  { word: "ĐÁM MÂY", category: "Thiên nhiên", hint: "Trôi lơ lửng trên bầu trời xanh" },
  { word: "CƠN MƯA", category: "Thiên nhiên", hint: "Nước rơi từ trên trời xuống" },
  { word: "CẦU VỒNG", category: "Thiên nhiên", hint: "Xuất hiện sau mưa với 7 màu rực rỡ" },
  { word: "NGỌN NÚI", category: "Thiên nhiên", hint: "Nơi cao nhất so với mặt đất" },
  { word: "DÒNG SÔNG", category: "Thiên nhiên", hint: "Nước chảy uốn lượn ra biển" },
  { word: "BIỂN CẢ", category: "Thiên nhiên", hint: "Mênh mông nước mặn và sóng vỗ" },
  { word: "BÔNG HOA", category: "Thiên nhiên", hint: "Nở rực rỡ và tỏa hương thơm" },
  { word: "CÁI CÂY", category: "Thiên nhiên", hint: "Có lá xanh, thân gỗ, rễ bám đất" },
  { word: "GIÓ", category: "Thiên nhiên", hint: "Thổi bay tóc, làm mát không khí" },
  { word: "SẤM SÉT", category: "Thiên nhiên", hint: "Tiếng nổ vang trời khi trời mưa to" },
  { word: "TUYẾT", category: "Thiên nhiên", hint: "Màu trắng, lạnh buốt, rơi mùa đông" },
  { word: "BÃI BIỂN", category: "Thiên nhiên", hint: "Nơi có cát trắng và sóng vỗ" },

  // --- CHỦ ĐỀ: CON NGƯỜI & NGHỀ NGHIỆP ---
  { word: "CÔ GIÁO", category: "Con người", hint: "Người dạy bé học ở trường" },
  { word: "BÁC SĨ", category: "Con người", hint: "Người khám và chữa bệnh cho mọi người" },
  { word: "CÔNG AN", category: "Con người", hint: "Người bắt kẻ gian, giữ trật tự" },
  { word: "BỘ ĐỘI", category: "Con người", hint: "Người bảo vệ tổ quốc, cầm súng" },
  { word: "NÔNG DÂN", category: "Con người", hint: "Người trồng lúa, trồng rau" },
  { word: "HỌA SĨ", category: "Con người", hint: "Người vẽ tranh rất đẹp" },
  { word: "CA SĨ", category: "Con người", hint: "Người hát trên sân khấu" },
  { word: "ĐẦU BẾP", category: "Con người", hint: "Người nấu ăn ngon trong nhà hàng" },
  { word: "BỐ MẸ", category: "Gia đình", hint: "Người sinh ra và nuôi dưỡng bé" },
  { word: "ÔNG BÀ", category: "Gia đình", hint: "Bố mẹ của bố mẹ mình" },
  { word: "EM BÉ", category: "Gia đình", hint: "Thành viên nhỏ tuổi nhất nhà" },

  // --- CHỦ ĐỀ: PHƯƠNG TIỆN GIAO THÔNG ---
  { word: "XE ĐẠP", category: "Phương tiện", hint: "Có 2 bánh, bé tự lái đi chơi" },
  { word: "XE MÁY", category: "Phương tiện", hint: "Bố mẹ hay đi làm bằng xe này" },
  { word: "Ô TÔ", category: "Phương tiện", hint: "Có 4 bánh, che nắng che mưa" },
  { word: "MÁY BAY", category: "Phương tiện", hint: "Bay trên bầu trời, chở khách đi xa" },
  { word: "TÀU HỎA", category: "Phương tiện", hint: "Chạy trên đường ray, kêu xình xịch" },
  { word: "THUYỀN", category: "Phương tiện", hint: "Di chuyển trên mặt nước" },
  { word: "XE BUÝT", category: "Phương tiện", hint: "Xe to chở được rất nhiều người" },
  { word: "XE CỨU HỎA", category: "Phương tiện", hint: "Xe màu đỏ, đi dập lửa" },
  { word: "XE CỨU THƯƠNG", category: "Phương tiện", hint: "Xe chở người bệnh đi viện gấp" },

  // --- CHỦ ĐỀ: CƠ THỂ NGƯỜI ---
  { word: "ĐÔI MẮT", category: "Cơ thể", hint: "Dùng để nhìn mọi vật xung quanh" },
  { word: "CÁI MŨI", category: "Cơ thể", hint: "Dùng để thở và ngửi mùi hương" },
  { word: "CÁI MIỆNG", category: "Cơ thể", hint: "Dùng để ăn và nói chuyện" },
  { word: "ĐÔI TAI", category: "Cơ thể", hint: "Dùng để nghe âm thanh" },
  { word: "BÀN TAY", category: "Cơ thể", hint: "Dùng để cầm nắm đồ vật" },
  { word: "BÀN CHÂN", category: "Cơ thể", hint: "Dùng để đi lại, chạy nhảy" },
  { word: "CÁI RĂNG", category: "Cơ thể", hint: "Dùng để nhai thức ăn, màu trắng" },
  { word: "MÁI TÓC", category: "Cơ thể", hint: "Mọc trên đầu, có thể dài hoặc ngắn" }
];

// --- HELPER: XỬ LÝ TIẾNG VIỆT ---
const removeVietnameseTones = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
};

// --- COMPONENT: VẼ NGƯỜI QUE (SVG) ---
const HangmanDrawing = ({ mistakes }) => {
  // Các bộ phận cơ thể dựa trên số lỗi
  const parts = [
    // 1. Đế và cột (Luôn hiện một phần hoặc hiện ngay từ đầu lỗi 1)
    <line key="base" x1="10" y1="250" x2="150" y2="250" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />, // Đế
    <line key="pole" x1="80" y1="250" x2="80" y2="20" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />,   // Cột dọc
    <line key="top" x1="80" y1="20" x2="200" y2="20" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />,    // Thanh ngang
    <line key="rope" x1="200" y1="20" x2="200" y2="50" stroke="#f59e0b" strokeWidth="3" />,                        // Dây (Màu cam)
    
    // 2. Đầu
    <circle key="head" cx="200" cy="80" r="30" stroke="#3b82f6" strokeWidth="4" fill="white" />,
    
    // 3. Thân
    <line key="body" x1="200" y1="110" x2="200" y2="170" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />,
    
    // 4. Tay trái
    <line key="armL" x1="200" y1="130" x2="170" y2="160" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />,
    
    // 5. Tay phải
    <line key="armR" x1="200" y1="130" x2="230" y2="160" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />,
    
    // 6. Chân trái
    <line key="legL" x1="200" y1="170" x2="170" y2="210" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />,
    
    // 7. Chân phải
    <line key="legR" x1="200" y1="170" x2="230" y2="210" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />,
  ];

  // Logic hiển thị: Luôn hiện khung (4 nét đầu tiên là khung) 
  // Thực tế game Hangman: 0 lỗi -> chưa vẽ gì (hoặc chỉ vẽ khung).
  // Để thân thiện, ta vẽ khung trước, sau đó vẽ người.
  
  // Mapping mistakes to parts to show. 
  // Giả sử max mistakes = 6 (Đầu, Thân, Tay T, Tay P, Chân T, Chân P)
  // Khung sẽ luôn hiển thị.
  
  const FRAME_COUNT = 4; // Đế, Cột, Ngang, Dây
  const visibleParts = parts.slice(0, FRAME_COUNT + mistakes);

  return (
    <div className="relative flex justify-center items-center p-2 bg-white rounded-3xl shadow-xl border-4 border-sky-200 w-full max-w-[280px] aspect-square">
      <svg viewBox="0 0 280 280" className="w-full h-full drop-shadow-sm">
        {/* Luôn vẽ khung nền mờ để bé biết vị trí */}
        <line x1="10" y1="250" x2="150" y2="250" stroke="#e0f2fe" strokeWidth="4" strokeLinecap="round" />
        <line x1="80" y1="250" x2="80" y2="20" stroke="#e0f2fe" strokeWidth="4" strokeLinecap="round" />
        <line x1="80" y1="20" x2="200" y2="20" stroke="#e0f2fe" strokeWidth="4" strokeLinecap="round" />
        <line x1="200" y1="20" x2="200" y2="50" stroke="#e0f2fe" strokeWidth="3" />
        
        {visibleParts}
      </svg>
      {mistakes >= 6 && (
        <div className="absolute top-20 right-14 animate-bounce">
          <span className="text-2xl">😵</span>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function DoanChuVuiNhon() {
  const [gameStatus, setGameStatus] = useState('idle'); // idle, playing, won, lost
  const [currentWordData, setCurrentWordData] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const MAX_MISTAKES = 6;

  // Khởi tạo game
  const startGame = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * WORD_DATA.length);
    const newData = WORD_DATA[randomIdx];
    setCurrentWordData(newData);
    setGuessedLetters(new Set());
    setMistakes(0);
    setGameStatus('playing');
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  // Xử lý đoán chữ
  const handleGuess = useCallback((letter) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;

    setGuessedLetters(prev => {
      const newSet = new Set(prev);
      newSet.add(letter);
      return newSet;
    });

    const normalizedWord = removeVietnameseTones(currentWordData.word.toUpperCase());
    
    // Kiểm tra xem chữ cái đoán có trong từ không (so sánh dạng không dấu)
    if (!normalizedWord.includes(letter)) {
      setMistakes(prev => prev + 1);
    }
  }, [gameStatus, guessedLetters, currentWordData]);

  // Kiểm tra thắng/thua mỗi khi state thay đổi
  useEffect(() => {
    if (gameStatus !== 'playing' || !currentWordData) return;

    const normalizedWord = removeVietnameseTones(currentWordData.word.toUpperCase());
    const isLost = mistakes >= MAX_MISTAKES;
    
    // Logic thắng: Mọi chữ cái (khác khoảng trắng) đều đã được đoán
    const isWon = normalizedWord.split('').every(char => {
      if (char === ' ') return true;
      return guessedLetters.has(char);
    });

    if (isLost) setGameStatus('lost');
    if (isWon) setGameStatus('won');
  }, [mistakes, guessedLetters, currentWordData, gameStatus]);

  // Keyboard handler (cho máy tính)
  useEffect(() => {
    const handleKeydown = (e) => {
      const char = e.key.toUpperCase();
      if (char.length === 1 && char >= 'A' && char <= 'Z') {
        handleGuess(char);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleGuess]);

  // Render các chữ cái
  const renderWord = () => {
    if (!currentWordData) return null;
    return (
      <div className="flex flex-wrap justify-center gap-2 my-6 min-h-[60px]">
        {currentWordData.word.split('').map((char, idx) => {
          if (char === ' ') {
            return <div key={idx} className="w-4 sm:w-8"></div>; // Khoảng trắng
          }
          
          const normalizedChar = removeVietnameseTones(char.toUpperCase());
          const isGuessed = guessedLetters.has(normalizedChar);
          const isLost = gameStatus === 'lost';

          return (
            <span 
              key={idx} 
              className={`
                w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center 
                text-2xl sm:text-3xl font-bold rounded-lg border-b-4 
                transition-all duration-300 transform
                ${isGuessed 
                  ? 'bg-sky-100 border-sky-400 text-sky-700 -translate-y-1' 
                  : isLost 
                    ? 'bg-red-50 border-red-200 text-red-500' // Hiện chữ khi thua
                    : 'bg-white border-gray-200 text-transparent'}
              `}
            >
              {isGuessed || isLost ? char : '?'}
            </span>
          );
        })}
      </div>
    );
  };

  // Render bàn phím
  const renderKeyboard = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return (
      <div className="grid grid-cols-7 gap-2 max-w-lg mx-auto">
        {alphabet.map(letter => {
          const isGuessed = guessedLetters.has(letter);
          const normalizedWord = currentWordData ? removeVietnameseTones(currentWordData.word.toUpperCase()) : '';
          const isCorrect = isGuessed && normalizedWord.includes(letter);
          const isWrong = isGuessed && !normalizedWord.includes(letter);

          return (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={isGuessed || gameStatus !== 'playing'}
              className={`
                aspect-square flex items-center justify-center font-bold text-lg rounded-xl shadow-sm transition-all
                ${!isGuessed 
                  ? 'bg-white text-sky-600 hover:bg-sky-50 hover:scale-105 active:scale-95 shadow-[0_4px_0_rgb(14,165,233)]' 
                  : ''}
                ${isCorrect ? 'bg-green-400 text-white shadow-none opacity-50 cursor-not-allowed' : ''}
                ${isWrong ? 'bg-gray-200 text-gray-400 shadow-none opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {letter}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sky-100 font-sans selection:bg-sky-200 flex flex-col items-center py-6 px-4">
      {/* Background Decor */}
      <div className="fixed top-10 left-10 text-sky-200 animate-pulse"><Star size={40} /></div>
      <div className="fixed top-20 right-20 text-sky-200 animate-pulse delay-700"><Star size={30} /></div>
      <div className="fixed bottom-10 left-1/4 text-sky-200 opacity-50"><span className="text-6xl">☁️</span></div>
      <div className="fixed top-10 right-1/4 text-sky-200 opacity-50"><span className="text-6xl">☁️</span></div>

      {/* Header */}
      <header className="z-10 text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-600 drop-shadow-sm tracking-tight mb-2">
          Đoán Chữ Vui Nhộn
        </h1>
        <div className="inline-flex items-center gap-2 bg-white px-4 py-1 rounded-full shadow-sm text-sky-500 font-medium">
          <span>Chủ đề:</span>
          <span className="font-bold text-orange-500 uppercase">{currentWordData?.category || '...'}</span>
        </div>
      </header>

      {/* Game Container */}
      <main className="z-10 w-full max-w-4xl bg-white/60 backdrop-blur-sm rounded-3xl p-4 md:p-8 shadow-2xl border-4 border-white flex flex-col md:flex-row gap-8 items-center md:items-start">
        
        {/* Cột trái: Hình vẽ & Status */}
        <div className="flex flex-col items-center gap-4">
          <HangmanDrawing mistakes={mistakes} />
          
          <div className="flex gap-2 text-red-400 bg-white px-4 py-2 rounded-xl shadow-sm border border-red-100">
            <Heart className={mistakes >= 6 ? "fill-gray-300 text-gray-300" : "fill-red-400"} />
            <span className="font-bold text-lg">{MAX_MISTAKES - mistakes}</span>
            <span className="text-sm self-center text-gray-500">lượt đoán</span>
          </div>

          {gameStatus === 'playing' && (
            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-sm border border-yellow-200 max-w-[250px] text-center">
              💡 Gợi ý: {currentWordData?.hint}
            </div>
          )}
        </div>

        {/* Cột phải: Từ vựng & Bàn phím */}
        <div className="flex-1 w-full flex flex-col justify-between">
          <div>
            <div className="text-center md:text-left mb-2 text-sky-800 font-semibold opacity-70">
              Hãy tìm từ bí mật:
            </div>
            {renderWord()}
          </div>
          
          <div className="mt-4 bg-sky-200/50 p-4 rounded-2xl">
            {renderKeyboard()}
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="z-10 mt-8 flex gap-4">
        <button 
          onClick={startGame}
          className="flex items-center gap-2 bg-white text-sky-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-sky-50 hover:scale-105 active:scale-95 transition-all"
        >
          <RefreshCw size={20} /> Chơi Lại
        </button>
      </footer>

      {/* Win/Loss Modal Overlay */}
      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform scale-100 animate-in zoom-in-95 duration-200 border-8 border-sky-100">
            
            {gameStatus === 'won' ? (
              <div className="flex flex-col items-center">
                <Trophy size={64} className="text-yellow-400 mb-4 drop-shadow-md animate-bounce" />
                <h2 className="text-3xl font-bold text-sky-600 mb-2">Giỏi Quá!</h2>
                <p className="text-gray-500 mb-6">Bé đã đoán đúng từ khóa.</p>
                <div className="text-2xl font-bold text-orange-500 bg-orange-50 px-6 py-3 rounded-xl mb-6 border-dashed border-2 border-orange-200">
                  {currentWordData?.word}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Frown size={64} className="text-gray-400 mb-4" />
                <h2 className="text-3xl font-bold text-gray-600 mb-2">Tiếc Quá!</h2>
                <p className="text-gray-500 mb-6">Hết lượt đoán mất rồi.</p>
                <div className="text-lg text-gray-500 mb-1">Đáp án là:</div>
                <div className="text-2xl font-bold text-sky-600 bg-sky-50 px-6 py-3 rounded-xl mb-6">
                  {currentWordData?.word}
                </div>
              </div>
            )}

            <button 
              onClick={startGame}
              className={`
                w-full py-3 rounded-xl font-bold text-white text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all
                ${gameStatus === 'won' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-sky-500'}
              `}
            >
              Chơi ván mới nha!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}