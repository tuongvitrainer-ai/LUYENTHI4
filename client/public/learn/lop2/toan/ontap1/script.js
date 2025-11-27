// ===== SOUND MANAGER - Vanilla JS Implementation =====
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.3;
        this.isMuted = false;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    playClick(volume = 1) {
        if (this.isMuted) return;
        const ctx = this.init();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);

        const finalVolume = this.masterVolume * volume * 0.2;
        gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    }

    playCorrect(volume = 1) {
        if (this.isMuted) return;
        const ctx = this.init();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1047, ctx.currentTime + 0.15);

        const finalVolume = this.masterVolume * volume * 0.3;
        gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);

        // Harmonic
        this._playNote(698, 0.15, 0.1, finalVolume * 0.5);
    }

    playWrong(volume = 1) {
        if (this.isMuted) return;
        const ctx = this.init();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

        const finalVolume = this.masterVolume * volume * 0.25;
        gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    }

    _playNote(frequency, duration, delay = 0, volume = 0.3, type = 'sine') {
        const ctx = this.audioContext;
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

        const finalVolume = this.masterVolume * volume;
        gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

        oscillator.start(ctx.currentTime + delay);
        oscillator.stop(ctx.currentTime + delay + duration);
    }
}

// Khởi tạo Sound Manager
const soundManager = new SoundManager();

// Khởi tạo AudioContext sau user interaction đầu tiên
document.addEventListener('click', () => {
    soundManager.init();
}, { once: true });

// ===== DỮ LIỆU CÁC CÂU HỎI =====
const questionsData = [
    {
        topic_id: "chu_de_1",
        topic_name: "Chủ đề 1: Luyện tập về phép cộng và tìm các thành phần chưa biết trong phép cộng",
        questions: [
            {id: "1_1", text: "Điền dấu thích hợp vào ô trống: 14 [___] 15 = 29", type: "fill_in_blank", answer: "+"},
            {id: "1_2", text: "Tìm x, biết: 37 + x = 49", type: "calculation", answer: 12},
            {id: "1_3", text: "[___] + 17 = 27", type: "fill_in_blank", answer: 10},
            {id: "1_4", text: "Cả Lan và Hằng gấp được 25 con hạc giấy. Biết Hằng gấp được 12 con hạc giấy. Hỏi Lan gấp được bao nhiêu con hạc giấy?", type: "word_problem", answer: 13},
            {id: "1_5", text: "Trong vườn có 44 cây cam và 40 cây vải. Hỏi trong vườn có tất cả bao nhiêu cây cam và cây vải?", type: "word_problem", answer: 84},
            {id: "1_6", text: "Điền số thích hợp vào ô trống: 41 + [___] = 57", type: "fill_in_blank", answer: 16},
            {id: "1_7", text: "Điền số thích hợp vào ô trống: 32 + [___] = 99", type: "fill_in_blank", answer: 67},
            {id: "1_8", text: "Bạn Nam nghĩ ra một số, biết rằng nếu đem số đó cộng với 12 thì được kết quả là 58. Hỏi số Nam nghĩ là số nào?", type: "word_problem", answer: 46},
            {id: "1_9", text: "Mai gấp được 13 bông hoa đỏ và 14 bông hoa vàng. Hỏi Mai gấp được tất cả bao nhiêu bông hoa?", type: "word_problem", answer: 27},
            {id: "1_10", text: "Mẹ cho 2 anh em tất cả 55 cái kẹo. Biết rằng anh được mẹ cho 31 cái kẹo. Hỏi em được mẹ cho bao nhiêu cái kẹo?", type: "word_problem", answer: 24},
        ]
    },
    {
        topic_id: "chu_de_2",
        topic_name: "Chủ đề 2: Phép cộng các số có một chữ số (có nhớ)",
        questions: [
            {id: "2_1a", text: "4 + 6 = [___]", type: "fill_in_blank", answer: 10},
            {id: "2_1b", text: "4 + 9 = [___]", type: "fill_in_blank", answer: 13},
            {id: "2_2", text: "Điền số thích hợp vào ô trống: 10 dm + 4 dm + 26 dm = [___] dm", type: "fill_in_blank", answer: 40},
            {id: "2_3", text: "Bảo có 9 cái bánh, Bình có nhiều hơn Bảo 7 cái bánh. Hỏi Bình có bao nhiêu cái bánh?", type: "word_problem", answer: 16},
            {id: "2_4", text: "Điền dấu thích hợp vào ô trống: 7 [___] 8 = 15", type: "fill_in_blank", answer: "+"},
            {id: "2_5", text: "Điền số thích hợp vào ô trống: 6 + 7 + 9 = [___]", type: "fill_in_blank", answer: 22},
            {id: "2_6", text: "Đàn gà có 16 con gà mái và 7 con gà trống. Hỏi đàn gà có tất cả bao nhiêu con?", type: "word_problem", answer: 23},
            {id: "2_7", text: "An có 15 cái bút màu, Minh nhiều hơn An 6 cái. Hỏi Minh có bao nhiêu cái bút màu?", type: "word_problem", answer: 21},
            {id: "2_8", text: "Điền dấu thích hợp vào ô trống: 7 + 6 [___] 8 + 9", type: "comparison", answer: "<"},
            {id: "2_9", text: "Bé có 9 quả cam, bé hái thêm 6 quả nữa. Hỏi bé có tất cả bao nhiêu quả cam?", type: "word_problem", answer: 15},
            {id: "2_10", text: "Điền dấu thích hợp vào ô trống: 14 + 8 [___] 16 + 5", type: "comparison", answer: ">"},
        ]
    },
    {
        "topic_id": "chu_de_3",
        "topic_name": "Chủ đề 3: Luyện tập về phép cộng có nhớ các số trong phạm vi 100.",
        "questions": [
            {"id": "3_1", "text": "Thực hiện phép tính cộng:", "text_above": "41", "text_below": "+ 59", "type": "vertical_addition", "answer": 100},
            {"id": "3_2", "text": "Thực hiện phép tính cộng:", "text_above": "37", "text_below": "+ 24", "type": "vertical_addition", "answer": 61},
            {"id": "3_3", "text": "Điền số thích hợp vào ô trống: 54 + 17 + 9 = [___]", "type": "fill_in_blank", "answer": 80},
            {"id": "3_4", "text": "Rổ táo có 34 quả, rổ cam có 19 quả. Hỏi hai rổ có tất cả bao nhiêu quả?", "type": "word_problem", "answer": 53},
            {"id": "3_5", "text": "Điền dấu thích hợp vào ô trống: 35 - 5 [___] 13 + 17", "type": "comparison", "answer": "="},
            {"id": "3_6", "text": "Anh nặng 38kg, em nhẹ hơn anh 17kg. Hỏi em nặng bao nhiêu ki-lô-gam?", "type": "word_problem", "answer": 21},
            {"id": "3_7", "text": "Điền số thích hợp vào ô trống: 33 + 37 + 20 = [___] chục", "type": "fill_in_blank", "answer": 9},
            {"id": "3_8", "text": "Tổng của các số 26, 34, 40 có kết quả bằng bao nhiêu?", "type": "calculation", "answer": 100},
            {"id": "3_9", "text": "Nhà Mai nuôi một đàn gà, biết gà mái có 4 chục con và số con gà trống có là số tròn chục liền trước số 70. Hỏi đàn gà nhà Mai có bao nhiêu con?", "type": "word_problem", "answer": 100},
            {"id": "3_10", "text": "Đoạn thẳng AB dài 48cm, đoạn thẳng CD dài 52cm. Hỏi hai đoạn thẳng dài tất cả bao nhiêu đề - xi -mét?", "type": "word_problem", "answer": 10},
        ]
    },
    {
        "topic_id": "chu_de_4",
        "topic_name": "Chủ đề 4: Luyện tập về phép cộng trong phạm vi 1000 (không nhớ)",
        "questions": [
            {"id": "4_1", "text": "Thực hiện phép tính cộng:", "text_above": "315", "text_below": "+ 212", "type": "vertical_addition", "answer": 527},
            {"id": "4_2", "text": "Điền dấu thích hợp vào ô trống: 218 [___] 220", "type": "comparison", "answer": "<"},
            {"id": "4_3", "text": "Tìm x biết: x - 150 = 200", "type": "calculation", "answer": 350},
            {"id": "4_4", "text": "Điền dấu thích hợp vào ô trống: 250 + 130 [___] 370", "type": "comparison", "answer": ">"},
            {"id": "4_5", "text": "Một cửa hàng buổi sáng bán được 100 lít dầu, buổi chiều bán được nhiều hơn buổi sáng là 43 lít dầu. Hỏi buổi chiều cửa hàng đó bán được bao nhiêu lít dầu?", "type": "word_problem", "answer": 143},
            {"id": "4_6", "text": "Tìm x biết: x - 224 = 120 + 232", "type": "calculation", "answer": 576},
            {"id": "4_7", "text": "Tính chu vi của hình tứ giác bên dưới.", "type": "word_problem", "answer": 590, "image": "quadrilateral.png"},
            {"id": "4_8", "text": "Cuộn vải thứ nhất dài 150dm. Cuộn vải thứ hai dài 120dm. Hỏi cả hai cuộn vải dài bao nhiêu đề-xi-mét?", "type": "word_problem", "answer": 270},
            {"id": "4_9", "text": "Một đàn bò có 100 con bò mẹ và 35 con bò con. Hỏi đàn bò đó có tất cả bao nhiêu con bò?", "type": "word_problem", "answer": 135},
            {"id": "4_10", "text": "An nghĩ ra một số, biết rằng nếu đem số đó trừ đi 123 thì được kết quả là số lớn nhất có ba chữ số. Em hãy cho biết số An nghĩ là số nào?", "type": "word_problem", "answer": 1122},
        ]
    },
    {
        "topic_id": "chu_de_5",
        "topic_name": "Chủ đề 5: Luyện tập về phép trừ trong phạm vi 1000 (không nhớ)",
        "questions": [
            {"id": "5_1", "text": "Thực hiện phép tính trừ:", "text_above": "753", "text_below": "- 142", "type": "vertical_subtraction", "answer": 611},
            {"id": "5_2", "text": "Tìm x biết: 987 – x = 452", "type": "calculation", "answer": 535},
            {"id": "5_3", "text": "Cân nặng của con ngựa là 275kg và nặng hơn cân nặng của con lừa 113kg. Hỏi con lừa nặng bao nhiêu ki - lô - gam?", "type": "word_problem", "answer": 162},
            {"id": "5_4", "text": "Biết số bị trừ là 953, số trừ là 230.Tìm hiệu.", "type": "calculation", "answer": 723},
            {"id": "5_5", "text": "Biết số bị trừ là 599, hiệu là 107.Tìm số trừ.", "type": "calculation", "answer": 492},
            {"id": "5_6", "text": "Ruộng nhà bác Hải thu được 359kg cả dưa hấu và bí đao, trong đó có 132kg dưa hấu. Hỏi ruộng nhà bác Hải thu được bao nhiêu ki - lô - gam bí đao?", "type": "word_problem", "answer": 227},
            {"id": "5_7", "text": "Tổng là 880, số hạng thứ nhất là 450. Tìm số hạng thứ hai.", "type": "calculation", "answer": 430},
            {"id": "5_8", "text": "Đàn gà có 271 con, đàn vịt có ít hơn đàn gà 101 con. Hỏi đàn vịt có bao nhiêu con?", "type": "word_problem", "answer": 170},
            {"id": "5_9", "text": "Điền số thích hợp vào ô trống: 774 - 353 = [___]", "type": "fill_in_blank", "answer": 421},
            {"id": "5_10", "text": "Điền dấu thích hợp vào ô trống: 510 [___] 893 - 372", "type": "comparison", "answer": "<"},
        ]
    },
    {
        "topic_id": "chu_de_6",
        "topic_name": "Chủ đề 6: Luyện tập về bảng nhân 2 và bảng nhân 3",
        "questions": [
            {"id": "6_1", "text": "2+2+2 = ?", "type": "multiple_choice", "options": ["2 x 3", "2 x 2", "2 x 4", "2 x 5"], "answer": "2 x 3"},
            {"id": "6_2", "text": "3+3+3+3+3+3=?", "type": "multiple_choice", "options": ["3 x 6", "3 x 3", "3 x 4"], "answer": "3 x 6"},
            {"id": "6_3", "text": "Dãy tính dưới đây được viết đúng hay sai? 3x7=3+3+3+3+3+3+3", "type": "true_false", "answer": "Đúng"},
            {"id": "6_4", "text": "2 x 4 = [___]", "type": "fill_in_blank", "answer": 8},
            {"id": "6_5", "text": "3 x 5 = [___]", "type": "fill_in_blank", "answer": 15},
            {"id": "6_6", "text": "3 được lấy 9 lần. Em hãy chọn phép nhân tương ứng:", "type": "multiple_choice", "options": ["3 x 9", "3 x 5", "3 x 4"], "answer": "3 x 9"},
            {"id": "6_7", "text": "2 x 8 = [___]", "type": "fill_in_blank", "answer": 16},
            {"id": "6_8", "text": "(2 x 8) + 12 = [___]", "type": "fill_in_blank", "answer": 28},
            {"id": "6_9", "text": "Có 2 rổ đựng mận, mỗi rổ có 3 quả. Có 3 rổ đựng táo, mỗi rổ có 3 quả. Hỏi tổng số quả táo trong 3 rổ nhiều hơn tổng số quả mận trong 2 rổ là bao nhiêu quả?", "type": "word_problem", "answer": 3},
            {"id": "6_10", "text": "Có 5 túi gạo nếp và 7 túi gạo tẻ. Mỗi túi gạo nếp có 2kg, mỗi túi gạo tẻ có 3kg. Hỏi có tất cả bao nhiêu ki-lô-gam gạo nếp và gạo tẻ?", "type": "word_problem", "answer": 31},
        ]
    },
    {
        "topic_id": "chu_de_7",
        "topic_name": "Chủ đề 7: Luyện tập về bảng nhân 4 và bảng nhân 5",
        "questions": [
            {"id": "7_1", "text": "Mẹ mua 6 hộp bút chì màu, mỗi hộp có 5 cái. Biết mẹ cho anh 18 cái bút chì màu và số bút chì màu còn lại mẹ cho em. Hỏi em có bao nhiêu cái bút chì màu?", "type": "word_problem", "answer": 12},
            {"id": "7_2", "text": "Nhà Hương có 8 quả dưa hấu, mỗi quả nặng 5 kg. Biết mẹ đã bán đi 2 quả dưa hấu. Hỏi nhà Hương còn lại bao nhiêu ki-lô-gam dưa hấu?", "type": "word_problem", "answer": 30},
            {"id": "7_3", "text": "Nhà Liên nuôi 9 con mèo, mỗi con nặng 5 kg. Hỏi sau khi nhà Liên bán đi 3 con mèo thì số con mèo nhà Liên còn lại nặng bao nhiêu ki-lô-gam?", "type": "word_problem", "answer": 30},
            {"id": "7_4", "text": "Nhà Minh có 6 túi lê, mỗi túi nặng 5 kg, biết mẹ hái thêm được 7 kg lê. Hỏi nhà Minh có bao nhiêu ki-lô-gam lê?", "type": "word_problem", "answer": 37},
            {"id": "7_5", "text": "Điền số thích hợp vào ô trống: 72 + 5 x 3 = [___]", "type": "fill_in_blank", "answer": 87},
            {"id": "7_6", "text": "Điền số thích hợp vào ô trống: (5 x 9) + 26 = [___]", "type": "fill_in_blank", "answer": 71},
            {"id": "7_7", "text": "Điền số thích hợp vào ô trống: (5 x 7) + 18 = [___]", "type": "fill_in_blank", "answer": 53},
            {"id": "7_8", "text": "Tìm x biết: 88 – x = 5 x 5", "type": "calculation", "answer": 63},
            {"id": "7_9", "text": "Trong thúng có 4 loại quả, sau đó lấy ra mỗi loại 4 quả thì trong thúng còn lại 20 quả. Hỏi lúc đầu trong thúng có bao nhiêu quả?", "type": "word_problem", "answer": 36},
            {"id": "7_10", "text": "Tìm tổng của 2 số biết số bé bằng tích của 5 và 3, số lớn bằng tích của 4 và 9.", "type": "word_problem", "answer": 51},
        ]
    },
    {
        "topic_id": "chu_de_8",
        "topic_name": "Chủ đề 8: Luyện tập về bảng chia 2.",
        "questions": [
            {"id": "8_1", "text": "Hiệu của số liền trước của 35 và 26 chia cho 2 được kết quả là bao nhiêu?", "type": "word_problem", "answer": 4},
            {"id": "8_2", "text": "Trong một lồng bạn An đếm được 18 cái chân gà. Hỏi trong lồng đó có bao nhiêu con gà?", "type": "word_problem", "answer": 9},
            {"id": "8_3", "text": "Mẹ mua 9 quả cam. Mẹ cho Tít 1 quả. Số cam còn lại mẹ chia đều vào 2 đĩa. Hỏi mỗi đĩa có bao nhiêu quả cam?", "type": "word_problem", "answer": 4},
            {"id": "8_4", "text": "Cả gà và chó đếm được 16 cái chân. Biết số con gà nhiều hơn số con chó. Hỏi có mấy con gà?", "type": "word_problem", "answer": 4},
            {"id": "8_5", "text": "Có 56 quả trứng gà. Mẹ đã bán 38 quả trứng và số trứng còn lại mẹ chia đều vào 2 túi. Hỏi số trứng trong mỗi túi là bao nhiêu quả?", "type": "word_problem", "answer": 9},
            {"id": "8_6", "text": "Điền số thích hợp vào ô trống: 8 : 2 x 6 + 47 = [___]", "type": "fill_in_blank", "answer": 71},
            {"id": "8_7", "text": "Điền số thích hợp vào ô trống: (3 x 9 - 19) : 2 = [___]", "type": "fill_in_blank", "answer": 4},
            {"id": "8_8", "text": "Điền số thích hợp vào ô trống: (30 x 6 - 18) : 2 = [___]", "type": "fill_in_blank", "answer": 81},
            {"id": "8_9", "text": "Điền số thích hợp vào ô trống: (4 x 7 - 16) : 2 = [___]", "type": "fill_in_blank", "answer": 6},
            {"id": "8_10", "text": "Tìm x biết: x + 18 : 2 + 21 = 78", "type": "calculation", "answer": 48},
        ]
    },
    {
        "topic_id": "chu_de_9",
        "topic_name": "Chủ đề 9: Luyện tập về bảng chia 3.",
        "questions": [
            {"id": "9_1", "text": "Điền số thích hợp vào ô trống: 21 : 3 + 2 x 8 = [___]", "type": "fill_in_blank", "answer": 23},
            {"id": "9_2", "text": "Điền số thích hợp vào ô trống: ((3 x 5) + 6) : 3 = [___]", "type": "fill_in_blank", "answer": 7},
            {"id": "9_3", "text": "Điền số thích hợp vào ô trống: ((2 x 9) + 6) : 3 = [___]", "type": "fill_in_blank", "answer": 8},
            {"id": "9_4", "text": "Điền số thích hợp vào ô trống: (92 - 83) : 3 x 6 = [___]", "type": "fill_in_blank", "answer": 18},
            {"id": "9_5", "text": "Tìm x biết: x + 36 : 3 = 25 + 4 x 4", "type": "calculation", "answer": 29},
            {"id": "9_6", "text": "Bình có 42 viên bi, Bình cho Linh 16 viên bi và cho Lan 8 viên bi. Số bi còn lại Bình chia đều vào 3 lọ. Hỏi mỗi lọ có bao nhiêu viên bi?", "type": "word_problem", "answer": 6},
            {"id": "9_7", "text": "Có 28 bạn thỏ hồng cùng nhau đi phát quà. Biết có 7 bạn thỏ hồng được nhận nhiệm vụ đặc biệt. Số bạn thỏ hồng còn lại được chia đều thành 3 nhóm. Hỏi mỗi nhóm có bao nhiêu bạn thỏ hồng?", "type": "word_problem", "answer": 7},
            {"id": "9_8", "text": "Có 29 chú ve cùng nhau đua tài. Biết có 2 chú ve được chọn làm giám khảo. Số chú ve còn lại chia đều thành 3 đội. Hỏi mỗi đội có bao nhiêu chú ve?", "type": "word_problem", "answer": 9},
            {"id": "9_9", "text": "Lấy tổng của số lớn nhất có một chữ số và số lớn nhất có ba chữ số đem chia cho 3 thì được kết quả là bao nhiêu?", "type": "word_problem", "answer": 336},
            {"id": "9_10", "text": "Tổng của số nhỏ nhất có hai chữ số và số liền sau của số 7 chia 3 được kết quả là bao nhiêu?", "type": "word_problem", "answer": 6},
        ]
    },
    {
        "topic_id": "chu_de_10",
        "topic_name": "Chủ đề 10: Luyện tập về bảng chia 4.",
        "questions": [
            {"id": "10_1", "text": "Bà trồng 32 cây xà lách xen đều vào 4 luống cải bắp. Sau đó, mẹ lại trồng thêm vào 8 cây nữa, cũng chia đều cho các luống. Hỏi mỗi luống cải bắp có bao nhiêu cây xà lách?", "type": "word_problem", "answer": 10},
            {"id": "10_2", "text": "Có 24kg gạo nếp và 21kg gạo tẻ. Gạo nếp chia đều vào 4 túi, gạo tẻ chia đều vào 3 túi. Hỏi túi gạo nếp hay túi gạo tẻ nhiều hơn?", "type": "word_problem", "answer": "Gạo tẻ"},
            {"id": "10_3", "text": "Một sợi dây đồng dài 4dm 1cm chia thành 4 đoạn, trong đó có 3 đoạn bằng nhau và 1 đoạn dài hơn độ dài mỗi đoạn của 3 đoạn kia là 5cm. Tính độ dài của đoạn dây dài nhất.", "type": "word_problem", "answer": 14},
            {"id": "10_4", "text": "Bà trồng 36 cây xà lách xen đều vào 4 luống cải bắp. Sau đó, mẹ lại trồng thêm vào 12 cây nữa, cũng chia đều cho các luống. Hỏi mỗi luống cải bắp có bao nhiêu cây xà lách?", "type": "word_problem", "answer": 12},
            {"id": "10_5", "text": "Có 2 can đựng dầu, can thứ nhất chứa 24l và gấp 4 lần số lít dầu trong can thứ 2. Hỏi phải đổ từ can thứ nhất sang can thứ 2 mấy lít để 2 can có số dầu bằng nhau?", "type": "word_problem", "answer": 9},
            {"id": "10_6", "text": "Tìm 1 số, biết số đó trừ đi số nhỏ nhất có 1 chữ số (khác 0) thì được số mới, số mới chia cho 4 được kết quả bằng 2.", "type": "word_problem", "answer": 9},
            {"id": "10_7", "text": "Nam nghĩ ra một số nếu lấy số đó nhân với 3 rồi cộng thêm 2 thì được số mới, số mới chia cho 4 được kết quả là số chẵn lớn nhất có 1 chữ số. Em hãy cho biết số Nam nghĩ là số nào?", "type": "word_problem", "answer": 10},
            {"id": "10_8", "text": "Tìm 1 số, biết số đó trừ đi 2 đơn vị thì được số mới, số mới chia cho 4 được kết quả bằng 7.", "type": "word_problem", "answer": 30},
            {"id": "10_9", "text": "Tìm 1 số, biết số đó chia cho 4 thì được kết quả là số liền trước số nhỏ nhất có 2 chữ số.", "type": "word_problem", "answer": 36},
            {"id": "10_10", "text": "Biết năm nay bố 40 tuổi và trước đây 4 năm tuổi bố gấp 4 lần tuổi con hiện nay. Tính tuổi của con 3 năm sau.", "type": "word_problem", "answer": 12},
        ]
    },
    {
        "topic_id": "chu_de_11",
        "topic_name": "Chủ đề 11: Luyện tập về bảng chia 5.",
        "questions": [
            {"id": "11_1", "text": "Một tuần mẹ đi bán hàng 35 giờ, và đi 5 ngày trong tuần. Hỏi một ngày mẹ đi bán hàng mấy giờ?", "type": "word_problem", "answer": 7},
            {"id": "11_2", "text": "Bà có 30 cái kẹo, bà chia đều cho 5 anh em. Sau đó, anh cả cho em út thêm 3 cái. Hỏi em út có hơn anh cả mấy cái kẹo?", "type": "word_problem", "answer": 6},
            {"id": "11_3", "text": "Có 2 can đựng dầu, can thứ nhất chứa 30l và gấp 5 lần số lít dầu trong can thứ 2. Hỏi phải đổ từ can thứ nhất sang can thứ 2 mấy lít để 2 can có số dầu bằng nhau?", "type": "word_problem", "answer": 12},
            {"id": "11_4", "text": "Một sợi dây đồng dài 4dm 3cm chia thành 5 đoạn, trong đó có 4 đoạn bằng nhau và 1 đoạn dài hơn 4 đoạn kia 3cm. Hỏi đoạn dây đồng dài nhất dài bao nhiêu xăng - ti - mét?", "type": "word_problem", "answer": 11},
            {"id": "11_5", "text": "Có tất cả bao nhiêu số có 2 chữ số mà lấy chữ số hàng chục chia cho 5 thì được kết quả là chữ số hàng đơn vị?", "type": "word_problem", "answer": 1},
            {"id": "11_6", "text": "Tìm 1 số biết số đó chia cho 5 được kết quả đem cho 2 thì bằng 3.", "type": "word_problem", "answer": 30},
            {"id": "11_7", "text": "Tìm 1 số, biết số đó chia cho 5 thì được kết quả là số lẻ liền trước số 5.", "type": "word_problem", "answer": 15},
            {"id": "11_8", "text": "Tìm 1 số, biết số đó trừ đi 4 đơn vị thì được số mới chia cho 5 được kết quả bằng 4.", "type": "word_problem", "answer": 24},
            {"id": "11_9", "text": "Tìm 1 số, biết số đó trừ đi 3 đơn vị thì được số mới chia cho 5 được kết quả bằng 5.", "type": "word_problem", "answer": 28},
            {"id": "11_10", "text": "Tùng có 25 viên bi, biết rằng cứ 3 viên bi xanh thì có 2 viên bị đỏ. Hỏi Tùng có bao nhiêu viên bi xanh? bao nhiêu viên bị đỏ?", "type": "word_problem", "answer": "15 xanh, 10 đỏ"},
        ]
    }
];

// Biến lưu trữ dữ liệu chủ đề hiện tại
let currentTopicData = null;

// Hàm khởi tạo khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    populateTopicSelect();
});

// Hàm điền các chủ đề vào thẻ select
function populateTopicSelect() {
    const select = document.getElementById('topic-select');
    select.innerHTML = '<option value="">-- Chọn chủ đề --</option>';
    questionsData.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic.topic_id;
        option.textContent = topic.topic_name;
        select.appendChild(option);
    });
}

// Hàm tải câu hỏi của chủ đề đã chọn
function loadTopic() {
    // Phát âm thanh click
    soundManager.playClick();

    const selectedTopicId = document.getElementById('topic-select').value;
    if (!selectedTopicId) {
        alert("Vui lòng chọn một chủ đề để bắt đầu!");
        return;
    }
    currentTopicData = questionsData.find(topic => topic.topic_id === selectedTopicId);

    if (currentTopicData) {
        document.getElementById('topic-title').textContent = currentTopicData.topic_name;
        renderQuestions(currentTopicData.questions);
        document.getElementById('topic-selection').style.display = 'none';
        document.getElementById('quiz-area').style.display = 'block';
    }
}

// Hàm hiển thị các câu hỏi
function renderQuestions(questions) {
    const quizForm = document.getElementById('quiz-form');
    quizForm.innerHTML = '';

    questions.forEach((question, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';

        let questionHtmlContent = `Câu ${index + 1}. `;
        let inputFieldHtml = '';
        let inputType = 'text';

        if (question.type === 'calculation' || question.type === 'word_problem' || question.type === 'vertical_addition' || question.type === 'vertical_subtraction') {
            inputType = 'number';
        }

        if (question.type === 'fill_in_blank' || question.type === 'comparison') {
            let placeholderText = '';
            if (question.type === 'comparison') {
                placeholderText = 'placeholder="<, >, ="';
            }
            inputFieldHtml = `<input type="${inputType}" name="q_${question.id}" id="q_${question.id}" class="small-input" ${placeholderText}>`;
            questionHtmlContent += question.text.replace('[___]', inputFieldHtml);
        } else if (question.type === 'multiple_choice') {
            questionHtmlContent += `${question.text}<br>`;
            question.options.forEach(option => {
                inputFieldHtml += `<label><input type="radio" name="q_${question.id}" value="${option}"> ${option}</label><br>`;
            });
            questionHtmlContent += inputFieldHtml;
        } else if (question.type === 'true_false') {
            questionHtmlContent += `${question.text}<br>`;
            inputFieldHtml += `<label><input type="radio" name="q_${question.id}" value="Đúng"> Đúng</label>`;
            inputFieldHtml += `<label><input type="radio" name="q_${question.id}" value="Sai"> Sai</label>`;
            questionHtmlContent += inputFieldHtml;
        } else if (question.type === 'vertical_addition' || question.type === 'vertical_subtraction') {
            questionHtmlContent += `${question.text}<br>`;
            inputFieldHtml = `
                <div class="vertical-calc">
                    <span class="calc-line">${question.text_above}</span>
                    <span class="calc-line">${question.text_below}</span>
                    <input type="${inputType}" name="q_${question.id}" id="q_${question.id}" class="small-input">
                </div>
            `;
            questionHtmlContent += inputFieldHtml;
        } else {
            questionHtmlContent += question.text;
            inputFieldHtml = `<input type="${inputType}" name="q_${question.id}" id="q_${question.id}" class="small-input">`;
            questionHtmlContent += ` ${inputFieldHtml}`;
        }

        if (question.image) {
            questionHtmlContent += `<img src="images/${question.image}" alt="Hình ảnh bài toán" style="max-width: 100%; height: auto; display: block; margin: 10px auto;">`;
        }

        questionItem.innerHTML = questionHtmlContent + `<div id="feedback_${question.id}" class="result-feedback"></div>`;
        quizForm.appendChild(questionItem);

        // Khôi phục câu trả lời đã lưu
        const savedAnswer = localStorage.getItem(`answer_${question.id}`);
        if (savedAnswer) {
            if (question.type === 'multiple_choice' || question.type === 'true_false') {
                const radioButtons = document.querySelectorAll(`input[name="q_${question.id}"]`);
                radioButtons.forEach(radio => {
                    if (radio.value === savedAnswer) {
                        radio.checked = true;
                    }
                });
            } else {
                const inputElement = document.getElementById(`q_${question.id}`);
                if (inputElement) {
                    inputElement.value = savedAnswer;
                }
            }
        }
    });
}

// Hàm kiểm tra đáp án
function checkAnswers() {
    // Phát âm thanh click
    soundManager.playClick();

    let correctCount = 0;
    const questions = currentTopicData.questions;

    questions.forEach(question => {
        const feedbackDiv = document.getElementById(`feedback_${question.id}`);
        feedbackDiv.className = 'result-feedback';
        feedbackDiv.textContent = '';

        let userAnswerRaw = '';
        if (question.type === 'multiple_choice' || question.type === 'true_false') {
            const selectedOption = document.querySelector(`input[name="q_${question.id}"]:checked`);
            if (selectedOption) {
                userAnswerRaw = selectedOption.value;
            }
        } else {
            const inputElement = document.getElementById(`q_${question.id}`);
            if (inputElement) {
                userAnswerRaw = inputElement.value;
            }
        }

        localStorage.setItem(`answer_${question.id}`, userAnswerRaw);

        const correctAnswer = String(question.answer).toLowerCase().trim();
        const userAnswer = String(userAnswerRaw).toLowerCase().trim();

        let isCorrect = false;

        if (question.type === 'calculation' || question.type === 'word_problem' || question.type === 'vertical_addition' || question.type === 'vertical_subtraction') {
            isCorrect = (parseInt(userAnswer) === parseInt(correctAnswer));
        } else {
            isCorrect = (userAnswer === correctAnswer);
        }

        if (isCorrect) {
            // Phát âm thanh đúng
            soundManager.playCorrect();

            feedbackDiv.classList.add('correct');
            feedbackDiv.textContent = 'Chính xác! 🎉';
            correctCount++;
        } else {
            // Phát âm thanh sai
            soundManager.playWrong();

            feedbackDiv.classList.add('incorrect');
            let displayCorrectAnswer = question.answer;
            if (question.id === '11_10') {
                displayCorrectAnswer = "15 viên bi xanh, 10 viên bi đỏ";
            }
            feedbackDiv.textContent = `Sai rồi. Đáp án đúng là: ${displayCorrectAnswer}`;
        }
    });

    alert(`Bạn đã làm đúng ${correctCount} trên ${questions.length} câu!`);
}

// Hàm đặt lại các câu trả lời
function resetQuiz() {
    // Phát âm thanh click
    soundManager.playClick();

    const quizForm = document.getElementById('quiz-form');
    quizForm.reset();

    const questions = currentTopicData.questions;
    questions.forEach(question => {
        const feedbackDiv = document.getElementById(`feedback_${question.id}`);
        feedbackDiv.className = 'result-feedback';
        feedbackDiv.textContent = '';
        localStorage.removeItem(`answer_${question.id}`);
    });
}

// Hàm quay lại trang chọn chủ đề
function showTopicSelection() {
    // Phát âm thanh click
    soundManager.playClick();

    document.getElementById('quiz-area').style.display = 'none';
    document.getElementById('topic-selection').style.display = 'block';
    document.getElementById('quiz-form').innerHTML = '';
    currentTopicData = null;
}
