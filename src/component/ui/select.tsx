import { type MouseEventHandler } from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  id?: string;
  'data-testid'?: string;
  value: string | null;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  size?: 'small' | 'default';
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Select({
  id,
  'data-testid': dataTestId,
  value,
  onChange,
  options,
  placeholder,
  size = 'default',
  className,
  onClick,
}: Readonly<SelectProps>) {
  const normalizedOptions = options.map((option) => ({
    value: String(option.value),
    label: option.label,
  }));

  return (
    <div data-testid={dataTestId} className="relative">
      <BaseSelect.Root
        items={normalizedOptions}
        value={value}
        onValueChange={(next) => {
          if (next !== null) onChange(next);
        }}
      >
        <BaseSelect.Trigger
          id={id}
          onClick={onClick}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-md border border-border bg-transparent px-2 text-left text-sm text-foreground outline-none focus:border-primary',
            size === 'small' ? 'h-8' : 'h-[42px] px-3',
            className,
          )}
        >
          <BaseSelect.Value
            placeholder={placeholder}
            className="truncate text-foreground data-[placeholder]:text-muted-foreground"
          />
          <BaseSelect.Icon className="text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={4} className="z-50">
            <BaseSelect.Popup className="max-h-64 overflow-auto rounded-md border border-border bg-background py-1 shadow-lg">
              {normalizedOptions.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-sm data-[highlighted]:bg-muted"
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator>
                    <Check className="h-3.5 w-3.5" />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
}
