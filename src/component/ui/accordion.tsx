import { type ReactNode } from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AccordionProps {
  defaultOpen?: boolean;
  header: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Single-item, always-composable accordion matching the antd `Collapse`
 * usage in this app: one panel, an end-aligned chevron, and rich
 * interactive content (buttons, a Select) inside the header. The trigger
 * renders as a `div` (not a native `<button>`) so those nested interactive
 * elements stay valid HTML - same reason antd's own Collapse header wasn't
 * a real `<button>` either.
 */
export function Accordion({
  defaultOpen = true,
  header,
  children,
  className,
}: Readonly<AccordionProps>) {
  return (
    <BaseAccordion.Root defaultValue={defaultOpen ? ['panel'] : []} className={className}>
      <BaseAccordion.Item value="panel">
        <BaseAccordion.Header>
          <BaseAccordion.Trigger
            nativeButton={false}
            render={<div role="button" tabIndex={0} />}
            className="group flex w-full cursor-pointer items-center justify-between gap-2"
          >
            <div className="min-w-0 flex-1">{header}</div>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-open:rotate-180" />
          </BaseAccordion.Trigger>
        </BaseAccordion.Header>
        <BaseAccordion.Panel className={cn('overflow-hidden pt-4')}>{children}</BaseAccordion.Panel>
      </BaseAccordion.Item>
    </BaseAccordion.Root>
  );
}
