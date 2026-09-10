import { type ReactNode } from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  children?: ReactNode;
}

export function Checkbox({
  id,
  checked,
  defaultChecked,
  onCheckedChange,
  className,
  children,
}: Readonly<CheckboxProps>) {
  const control = (
    <BaseCheckbox.Root
      id={id}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border data-[checked]:border-primary data-[checked]:bg-primary',
        className,
      )}
    >
      <BaseCheckbox.Indicator className="flex text-primary-foreground">
        <Check className="h-3 w-3" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );

  if (!children) return control;

  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      {control}
      {children}
    </label>
  );
}
