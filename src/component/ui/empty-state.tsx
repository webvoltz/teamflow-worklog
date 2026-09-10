import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  description?: string;
}

export function EmptyState({ description = 'No data' }: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
      <Inbox className="h-10 w-10" />
      <p className="text-sm">{description}</p>
    </div>
  );
}
