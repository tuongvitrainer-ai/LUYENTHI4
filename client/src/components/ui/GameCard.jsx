import './GameCard.css';

/**
 * GameCard Component - Card component theo theme blue pastel
 * @param {Object} props
 * @param {React.ReactNode} props.children - Nội dung card
 * @param {string} props.title - Tiêu đề card
 * @param {React.ReactNode} props.header - Custom header
 * @param {React.ReactNode} props.footer - Custom footer
 * @param {boolean} props.hoverable - Có hiệu ứng hover
 * @param {boolean} props.bordered - Có viền
 * @param {function} props.onClick - Hàm xử lý khi click
 * @param {string} props.className - Custom className
 * @param {string} props.variant - Loại card: 'default' | 'gradient' | 'outlined'
 */
const GameCard = ({
  children,
  title,
  header,
  footer,
  hoverable = false,
  bordered = true,
  onClick,
  className = '',
  variant = 'default',
  ...rest
}) => {
  const cardClass = `
    game-card
    game-card--${variant}
    ${hoverable ? 'game-card--hoverable' : ''}
    ${bordered ? 'game-card--bordered' : ''}
    ${onClick ? 'game-card--clickable' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={cardClass} onClick={onClick} {...rest}>
      {(header || title) && (
        <div className="game-card__header">
          {header || <h3 className="game-card__title">{title}</h3>}
        </div>
      )}

      <div className="game-card__body">{children}</div>

      {footer && <div className="game-card__footer">{footer}</div>}
    </div>
  );
};

export default GameCard;
