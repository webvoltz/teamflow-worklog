import { type ReactNode } from 'react';
import { Menu } from '@base-ui/react/menu';
import { cn } from '../../utils/cn';

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;

export function DropdownMenuContent({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <Menu.Portal>
      <Menu.Positioner sideOffset={8} align="end" className="z-50">
        <Menu.Popup
          className={cn(
            'min-w-[200px] rounded-md border border-border bg-background py-1 shadow-lg',
            className,
          )}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
}: Readonly<{ children: ReactNode; onClick?: () => void; className?: string }>) {
  return (
    <Menu.Item
      onClick={onClick}
      className={cn(
        'cursor-pointer px-3 py-2 text-sm text-foreground data-[highlighted]:bg-muted',
        className,
      )}
    >
      {children}
    </Menu.Item>
  );
}

export function DropdownMenuLabel({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="px-3 py-2 text-sm">{children}</div>;
}

export function DropdownMenuSeparator() {
  return <div role="separator" className="my-1 h-px bg-border" />;
}
