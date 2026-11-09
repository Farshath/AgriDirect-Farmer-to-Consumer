import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'forest', // 'forest' | 'leaf' | 'gold' | 'rose'
}) => {
  const colorSchemes = {
    forest: {
      bg: 'bg-[#174D32]/10',
      text: 'text-[#174D32]',
      border: 'border-[#BAD5C1]/60',
    },
    leaf: {
      bg: 'bg-[#63A66B]/15',
      text: 'text-[#27683E]',
      border: 'border-[#BAD5C1]/60',
    },
    gold: {
      bg: 'bg-[#E5B64B]/20',
      text: 'text-[#966708]',
      border: 'border-[#E5B64B]/40',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.forest;

  return (
    <div
      className={`bg-white rounded-3xl p-5 border ${scheme.border} shadow-[0_4px_20px_-4px_rgba(23,77,50,0.05)] hover:shadow-md transition-shadow flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#78897E]">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-2xl ${scheme.bg} ${scheme.text} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#174D32] tracking-tight">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-[#4A5B50] font-medium mt-1 flex items-center gap-1.5">
            {trend && (
              <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                {trend}
              </span>
            )}
            <span>{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

