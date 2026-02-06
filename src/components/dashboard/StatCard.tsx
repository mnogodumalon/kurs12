import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  highlight?: boolean;
  warning?: boolean;
  className?: string;
}

export function StatCard({ label, value, highlight, warning, className }: StatCardProps) {
  return (
    <Card
      className={cn(
        "shrink-0 transition-all",
        highlight && "bg-accent border-accent",
        className
      )}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <CardContent className="p-4 flex flex-col justify-center h-full">
        <div
          className={cn(
            "text-2xl md:text-3xl font-bold",
            warning && "text-warning-foreground",
            !warning && "text-foreground"
          )}
        >
          {value}
        </div>
        <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
