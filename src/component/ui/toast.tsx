import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { Toaster as SonnerToaster } from 'sonner';

/**
 * Sonner ships polished, spring-based enter/exit + swipe-to-dismiss
 * animations out of the box - themed here to this app's own design tokens
 * instead of Sonner's defaults (skips `richColors` for that reason).
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      offset={{ top: 88, right: 16 }}
      duration={5000}
      closeButton
      gap={10}
      icons={{
        success: <CheckCircle2 className="h-4 w-4" />,
        error: <XCircle className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        close: <X className="h-3.5 w-3.5" />,
      }}
      toastOptions={{
        duration: 5000,
        // Sonner's own [data-styled=true] rule sets `border` with higher
        // selector specificity than a plain Tailwind class, so the per-type
        // accent border needs `!` (important) to actually win the cascade.
        classNames: {
          toast: 'font-sans !border-l-4 !border-l-border',
          title: 'text-sm font-medium',
          success: '!border-l-success [&_[data-icon]]:text-success',
          error: '!border-l-destructive [&_[data-icon]]:text-destructive',
          info: '!border-l-info [&_[data-icon]]:text-info',
        },
      }}
    />
  );
}
