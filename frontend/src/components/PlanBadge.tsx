interface PlanBadgeProps {
  planType: string;
  size?: 'small' | 'medium' | 'large';
}

function PlanBadge({ planType, size = 'medium' }: PlanBadgeProps) {
  const getBadgeStyles = () => {
    const baseStyles = 'font-bold rounded-full inline-flex items-center justify-center';
    
    const sizeStyles = {
      small: 'px-2 py-1 text-xs',
      medium: 'px-3 py-1.5 text-sm',
      large: 'px-4 py-2 text-base'
    };

    const colorStyles = {
      FREE: 'bg-gray-100 text-gray-700 border border-gray-300',
      PREMIUM: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg',
      VIP: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl'
    };

    return `${baseStyles} ${sizeStyles[size]} ${colorStyles[planType as keyof typeof colorStyles] || colorStyles.FREE}`;
  };

  const getIcon = () => {
    if (planType === 'PREMIUM') return '⭐';
    if (planType === 'VIP') return '👑';
    return '🆓';
  };

  const getLabel = () => {
    if (planType === 'PREMIUM') return 'Premium';
    if (planType === 'VIP') return 'VIP';
    return 'Gratuito';
  };

  return (
    <span className={getBadgeStyles()}>
      <span className="mr-1">{getIcon()}</span>
      {getLabel()}
    </span>
  );
}

export default PlanBadge;

