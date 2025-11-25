import './GameButton.css';

/**
 * GameButton Component - Nút bấm theo theme blue pastel
 * @param {Object} props
 * @param {React.ReactNode} props.children - Nội dung button
 * @param {string} props.variant - Loại button: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
 * @param {string} props.size - Kích thước: 'small' | 'medium' | 'large'
 * @param {boolean} props.fullWidth - Button chiếm full width
 * @param {boolean} props.disabled - Vô hiệu hóa button
 * @param {React.ReactNode} props.icon - Icon hiển thị
 * @param {string} props.iconPosition - Vị trí icon: 'left' | 'right'
 * @param {function} props.onClick - Hàm xử lý khi click
 * @param {string} props.className - Custom className
 * @param {string} props.type - HTML button type
 */
const GameButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  className = '',
  type = 'button',
  ...rest
}) => {
  const buttonClass = `
    game-button
    game-button--${variant}
    game-button--${size}
    ${fullWidth ? 'game-button--full-width' : ''}
    ${disabled ? 'game-button--disabled' : ''}
    ${icon && !children ? 'game-button--icon-only' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {icon && iconPosition === 'left' && <span className="game-button__icon">{icon}</span>}
      {children && <span className="game-button__text">{children}</span>}
      {icon && iconPosition === 'right' && <span className="game-button__icon">{icon}</span>}
    </button>
  );
};

export default GameButton;
