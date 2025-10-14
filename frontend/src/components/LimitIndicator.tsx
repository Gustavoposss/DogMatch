interface LimitIndicatorProps {
  current: number;
  max: number;
  label: string;
  unlimited?: boolean;
}

function LimitIndicator({ current, max, label, unlimited = false }: LimitIndicatorProps) {
  const percentage = unlimited ? 100 : Math.min((current / max) * 100, 100);
  const remaining = unlimited ? -1 : Math.max(max - current, 0);

  const getColor = () => {
    if (unlimited) return 'bg-gradient-to-r from-green-400 to-blue-500';
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {unlimited ? (
          <span className="text-sm font-bold text-blue-600">Ilimitado ∞</span>
        ) : (
          <span className="text-sm text-gray-600">
            {current} / {max}
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {!unlimited && remaining === 0 && (
        <p className="text-xs text-red-600 font-medium">
          ⚠️ Limite atingido! Faça upgrade para continuar.
        </p>
      )}

      {!unlimited && remaining > 0 && remaining <= 2 && (
        <p className="text-xs text-yellow-600">
          ⚡ Restam apenas {remaining}
        </p>
      )}
    </div>
  );
}

export default LimitIndicator;

