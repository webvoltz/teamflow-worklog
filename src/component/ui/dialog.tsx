import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { type ReactNode } from 'react';

import { Button } from './button';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  okText?: string;
  onOk: () => void;
}

/**
 * Replaces the antd `Modal` used for the "reject work update" confirmation.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  okText = 'OK',
  onOk,
}: Readonly<DialogProps>) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/40" />
        <BaseDialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-2">
            <BaseDialog.Title className="text-base font-semibold text-foreground">
              {title}
            </BaseDialog.Title>
            <BaseDialog.Close
              aria-label="Close"
              className="rounded-md p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </BaseDialog.Close>
          </div>
          <div className="mb-5">{children}</div>
          <div className="flex justify-end gap-2">
            <BaseDialog.Close render={<Button variant="default" />}>Cancel</BaseDialog.Close>
            <Button variant="primary" onClick={onOk}>
              {okText}
            </Button>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
