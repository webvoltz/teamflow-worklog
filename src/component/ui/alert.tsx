import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

const alertVariants = cva('flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm', {
  variants: {
    variant: {
      error: 'border-destructive/30 bg-destructive/10 text-destructive',
      success: 'border-success/30 bg-success/10 text-success',
      info: 'border-info/30 bg-info/10 text-info',
    },
  },
  defaultVariants: {
    variant: 'error',
  },
});

const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof alertVariants> {
  children: React.ReactNode;
}

export function Alert({ className, variant, children, ...props }: Readonly<AlertProps>) {
  const Icon = ICONS[variant ?? 'error'];
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="leading-snug">{children}</span>
    </div>
  );
}
