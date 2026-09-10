import {
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  forwardRef,
  useState,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, suffix, ...props }, ref) => {
    if (leftIcon || suffix) {
      return (
        <div
          className={cn(
            'flex h-[42px] items-center gap-2 rounded-lg border border-border bg-transparent px-3 focus-within:border-primary',
            className,
          )}
        >
          {leftIcon && <span className="text-muted-foreground">{leftIcon}</span>}
          <input
            ref={ref}
            className="w-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            {...props}
          />
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
      );
    }
    return (
      <input
        ref={ref}
        className={cn(
          'h-[42px] w-full rounded-lg border border-border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export interface PasswordInputProps extends Omit<InputProps, 'suffix' | 'type'> {
  renderIcon?: (visible: boolean) => ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ renderIcon, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        className={className}
        suffix={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              setVisible((prev) => !prev);
            }}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {renderIcon ? renderIcon(visible) : visible ? <EyeOff /> : <Eye />}
          </button>
        }
        {...props}
      />
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
