import { forwardRef, type LabelHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, htmlFor, ...props }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-foreground', className)}
      {...props}
    />
  ),
);
Label.displayName = 'Label';
