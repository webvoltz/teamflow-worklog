import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      color: {
        gold: 'bg-warning/10 text-warning',
        green: 'bg-success/10 text-success',
        red: 'bg-destructive/10 text-destructive',
        blue: 'bg-info/10 text-info',
      },
    },
    defaultVariants: {
      color: 'blue',
    },
  },
);

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, color, ...props }: Readonly<BadgeProps>) {
  return <span className={cn(badgeVariants({ color }), className)} {...props} />;
}
