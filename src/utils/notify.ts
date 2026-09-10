import { toast } from 'sonner';

/**
 * Sonner's `toast` function is a module-level singleton - usable from plain
 * utility functions (not just components), the same way antd's `notification`
 * singleton was used from src/utils/*.ts. Only the `<Toaster />` render target
 * (component/ui/toast.tsx) needs to be mounted once, anywhere in the tree.
 */
export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  open: (message: string) => toast(message),
};
