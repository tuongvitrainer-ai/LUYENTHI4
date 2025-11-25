# 🎨 Design Tokens - Vượt Vũ Môn

Hệ thống Design Tokens chuẩn hóa cho toàn bộ dự án, giúp UI đồng bộ và dễ bảo trì.

## 📐 Spacing (Khoảng cách)

**QUAN TRỌNG**: KHÔNG ĐƯỢC code cứng `margin: 15px` hay `padding: 17px`. PHẢI dùng các biến spacing chuẩn.

### Basic Scale

```css
--space-xs: 4px;   /* Extra small - Icon gaps, tight spacing */
--space-sm: 8px;   /* Small - Button padding vertical, small gaps */
--space-md: 16px;  /* Medium - Default gap, button padding horizontal */
--space-lg: 24px;  /* Large - Card padding, section spacing */
--space-xl: 32px;  /* Extra large - Major sections */
--space-2xl: 48px; /* 2X large - Page sections */
--space-3xl: 64px; /* 3X large - Hero sections */
```

### Semantic Spacing (Theo ngữ cảnh)

```css
--space-button-padding-x: var(--space-md);  /* 16px - Ngang */
--space-button-padding-y: var(--space-sm);  /* 8px - Dọc */
--space-button-gap: var(--space-sm);        /* 8px - Giữa icon và text */
--space-card-padding: var(--space-lg);      /* 24px - Padding trong Card */
--space-section-padding: var(--space-2xl);  /* 48px - Giữa các sections */
--space-gutter: var(--space-md);            /* 16px - Grid gutter */
```

### Usage Examples

#### ✅ ĐÚNG
```css
.button {
  padding: var(--space-sm) var(--space-md);
  gap: var(--space-sm);
}

.card {
  padding: var(--space-card-padding);
  margin-bottom: var(--space-lg);
}
```

#### ❌ SAI
```css
.button {
  padding: 8px 16px;  /* ❌ Code cứng */
  gap: 10px;          /* ❌ Không thuộc scale */
}

.card {
  padding: 20px;      /* ❌ Không thuộc scale */
  margin-bottom: 25px; /* ❌ Code cứng */
}
```

## 🎵 Sound System

### useGameSound Hook

Hook chuẩn để sử dụng âm thanh trong games. MỌI GAME đều phải dùng hook này.

```javascript
import useGameSound from '@/hooks/useGameSound';

function MyGame() {
  const {
    playClick,      // Tiếng click nút
    playCorrect,    // Trả lời đúng (Ting!)
    playWrong,      // Trả lời sai (Buzz!)
    playSuccess,    // Hoàn thành game
    playFail,       // Thua game
    playHover,      // Di chuột qua
    playCoin,       // Nhặt sao/xu

    // Controls
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = useGameSound();

  return (
    <button onClick={() => {
      playClick();
      handleSubmit();
    }}>
      Submit
    </button>
  );
}
```

### Sound Types

| Sound | Khi nào dùng | Ví dụ |
|-------|-------------|-------|
| **playClick()** | Click nút bất kỳ | Submit, Next, Back buttons |
| **playCorrect()** | Trả lời đúng | Quiz correct answer |
| **playWrong()** | Trả lời sai | Quiz wrong answer |
| **playSuccess()** | Hoàn thành màn | Win game, complete level |
| **playFail()** | Thua màn | Lose game, time out |
| **playHover()** | Di chuột qua button | Hover effect |
| **playCoin()** | Nhận thưởng | Collect stars, coins |

### Best Practices

#### ✅ ĐÚNG
```javascript
const handleAnswer = (isCorrect) => {
  if (isCorrect) {
    playCorrect();  // Play sound TRƯỚC
    addScore(10);
    showSuccess();
  } else {
    playWrong();    // Play sound TRƯỚC
    showError();
  }
};
```

#### ❌ SAI
```javascript
// ❌ Không dùng hook chung
const audio = new Audio('/click.mp3');
audio.play();

// ❌ Code cứng âm thanh riêng cho từng game
const clickSound = document.getElementById('click-sound');
clickSound.play();
```

## 🎨 Colors

### Primary Palette (Blue Pastel)

```css
--color-primary: #a8d5ff;       /* Main blue */
--color-primary-light: #c9e4ff; /* Hover, backgrounds */
--color-primary-dark: #7db8f0;  /* Text, borders */
--color-primary-hover: #8cc8ff; /* Hover state */
```

### Semantic Colors

```css
--color-success: #a8e6cf;  /* Correct answer, success messages */
--color-warning: #ffd19a;  /* Warnings, pending states */
--color-danger: #ffb3ba;   /* Wrong answer, errors */
--color-info: #b8d4ff;     /* Information, hints */
```

### Usage

```javascript
import GameButton from '@/components/ui/GameButton';

// Sử dụng semantic variants
<GameButton variant="success" onClick={playCorrect}>
  Correct!
</GameButton>

<GameButton variant="danger" onClick={playWrong}>
  Wrong
</GameButton>
```

## 🎬 Animations

### Duration Scale

```css
--duration-instant: 100ms;  /* Hover, quick feedback */
--duration-fast: 200ms;     /* Button clicks */
--duration-normal: 300ms;   /* Default animations */
--duration-slow: 500ms;     /* Transitions, fades */
--duration-slower: 700ms;   /* Page transitions */
```

### Easing Functions

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);       /* Smooth both ends */
--ease-out: cubic-bezier(0, 0, 0.2, 1);            /* Smooth end */
--ease-in: cubic-bezier(0.4, 0, 1, 1);             /* Smooth start */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Bounce effect */
```

### Game Animations

```css
--game-scale-hover: 1.05;   /* Scale on hover */
--game-scale-active: 0.95;  /* Scale on click */
--game-rotate-wiggle: 5deg; /* Wiggle rotation */
```

### Usage Examples

```css
.game-button {
  transition: transform var(--duration-fast) var(--ease-out);
}

.game-button:hover {
  transform: scale(var(--game-scale-hover));
}

.game-button:active {
  transform: scale(var(--game-scale-active));
}

.wiggle {
  animation: wiggle var(--duration-normal) var(--ease-bounce);
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(var(--game-rotate-wiggle)); }
  75% { transform: rotate(calc(-1 * var(--game-rotate-wiggle))); }
}
```

## 🔤 Typography

### Font Sizes

```css
--font-size-xs: 12px;    /* Captions, labels */
--font-size-sm: 14px;    /* Small text */
--font-size-base: 16px;  /* Body text */
--font-size-lg: 18px;    /* Large body */
--font-size-xl: 20px;    /* Subheadings */
--font-size-2xl: 24px;   /* H3 */
--font-size-3xl: 30px;   /* H2 */
--font-size-4xl: 36px;   /* H1 */
```

### Usage

```css
.game-title {
  font-size: var(--font-size-3xl);
  font-weight: 600;
}

.game-description {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
}

.game-hint {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}
```

## 📦 Components

### GameButton

```javascript
import GameButton from '@/components/ui/GameButton';

// Variants
<GameButton variant="primary">Primary</GameButton>
<GameButton variant="secondary">Secondary</GameButton>
<GameButton variant="success">Success</GameButton>
<GameButton variant="warning">Warning</GameButton>
<GameButton variant="danger">Danger</GameButton>
<GameButton variant="ghost">Ghost</GameButton>

// Sizes
<GameButton size="small">Small</GameButton>
<GameButton size="medium">Medium</GameButton>
<GameButton size="large">Large</GameButton>

// With Icon & Sound
<GameButton
  variant="primary"
  icon="⭐"
  onClick={() => {
    playClick();
    handleAction();
  }}
>
  Collect Star
</GameButton>
```

### GameCard

```javascript
import GameCard from '@/components/ui/GameCard';

// Variants
<GameCard variant="default">Content</GameCard>
<GameCard variant="gradient">Content</GameCard>
<GameCard variant="outlined">Content</GameCard>

// With Title
<GameCard title="Game Title" variant="gradient">
  Game content here
</GameCard>

// Special Types
<GameCard type="game-info">
  <h3>Score: 100</h3>
  <p>Level: 5</p>
</GameCard>
```

## 📱 Responsive

### Breakpoints

```css
/* Mobile First */
/* Base: 0 - 767px (Mobile) */
.element {
  padding: var(--space-md);
}

/* Tablet: 768px - 1023px */
@media (min-width: 768px) {
  .element {
    padding: var(--space-lg);
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .element {
    padding: var(--space-xl);
  }
}
```

## 🎯 Checklist cho Game Developers

Khi tạo game mới, phải đảm bảo:

- [ ] ✅ Dùng `useGameSound()` hook cho âm thanh
- [ ] ✅ Dùng `--space-*` variables cho spacing (KHÔNG code cứng)
- [ ] ✅ Dùng `GameButton` component thay vì `<button>`
- [ ] ✅ Dùng `GameCard` component cho containers
- [ ] ✅ Dùng semantic colors (`--color-success`, `--color-danger`)
- [ ] ✅ Dùng animation variables (`--duration-*`, `--ease-*`)
- [ ] ✅ Play sound khi:
  - Click nút → `playClick()`
  - Đúng → `playCorrect()`
  - Sai → `playWrong()`
  - Win → `playSuccess()`
  - Lose → `playFail()`
  - Nhặt thưởng → `playCoin()`

## 🧪 Testing

### Test Sound System

Vào `/demo/sound` để test tất cả âm thanh và xem code examples.

```bash
npm run dev
# Navigate to http://localhost:5173/demo/sound
```

## 🔧 Maintenance

### Cập nhật Design Tokens

Khi cần thay đổi spacing/colors/sounds:

1. Cập nhật trong `client/src/index.css` (CSS variables)
2. Cập nhật trong `DESIGN-TOKENS.md` (Documentation)
3. Test trên tất cả games hiện có
4. Commit với message rõ ràng

### Thêm Sound Mới

Nếu cần âm thanh mới:

1. Thêm method vào `soundManager.js`
2. Export trong `useGameSound.js`
3. Document trong file này
4. Thêm vào SoundDemo component

---

## 📚 Resources

- **Demo**: `/demo/sound` - Test sounds và xem examples
- **Components**: `/components/ui/` - GameButton, GameCard
- **Hooks**: `/hooks/useGameSound.js` - Sound hook
- **Utils**: `/utils/soundManager.js` - Sound system core

---

**Version**: 1.0.0
**Last Updated**: 2025-11-25
**Maintainer**: Development Team
