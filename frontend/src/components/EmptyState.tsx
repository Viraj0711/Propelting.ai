import React from 'react';
import { FileX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn('flex flex-col items-center justify-center p-12 text-center', className)}
      role="status"
      aria-label="Empty state"
    >
      {icon || <FileX className="mb-4 h-16 w-16 text-muted-foreground" aria-hidden="true" />}
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      {description && <p className="mb-6 text-muted-foreground">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
