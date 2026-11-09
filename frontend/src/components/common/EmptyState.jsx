import React from 'react';
import Button from './Button';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  actionLabel,
  onAction,
  actionVariant = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-[#BAD5C1]/40 shadow-sm max-w-xl mx-auto my-6 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#DCEADF]/50 flex items-center justify-center text-[#174D32] mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-[#174D32] mb-2">{title}</h3>
      <p className="text-sm text-[#4A5B50] mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button variant={actionVariant} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

