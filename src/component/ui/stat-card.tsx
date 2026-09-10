import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', {
  variants: {
    accent: {
      primary: 'bg-primary/10 text-primary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      info: 'bg-info/10 text-info',
    },
  },
  defaultVariants: {
    accent: 'primary',
  },
});

export interface StatCardProps extends VariantProps<typeof badgeVariants> {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  footer,
  accent,
  className,
}: Readonly<StatCardProps>) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-sm',
        className,
      )}
    >
      <div className={cn(badgeVariants({ accent }))}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="text-lg font-bold text-foreground">{value}</div>
        {footer && <div className="mt-1">{footer}</div>}
      </div>
    </div>
  );
}
