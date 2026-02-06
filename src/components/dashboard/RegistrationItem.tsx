import { Badge } from '@/components/ui/badge';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Registrations, Participants, Courses } from '@/types/app';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

interface RegistrationItemProps {
  registration: Registrations;
  participant?: Participants;
  course?: Courses;
  onEdit?: () => void;
  onTogglePaid?: () => void;
}

export function RegistrationItem({
  registration,
  participant,
  course,
  onEdit,
  onTogglePaid,
}: RegistrationItemProps) {
  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(parseISO(dateStr), 'dd.MM.yyyy', { locale: de });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between py-3 px-2 -mx-2 rounded-lg",
        "hover:bg-accent transition-colors cursor-pointer tap-feedback"
      )}
      onClick={onEdit}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">
            {participant?.fields.name || 'Unbekannt'}
          </span>
          <span className="text-muted-foreground text-xs hidden sm:inline">
            {formatDate(registration.fields.registration_date)}
          </span>
        </div>
        <div className="text-muted-foreground text-xs truncate">
          {truncateText(course?.fields.title, 25)}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant={registration.fields.paid ? 'default' : 'secondary'}
          className={cn(
            "cursor-pointer text-xs",
            registration.fields.paid
              ? "bg-success hover:bg-success/90"
              : "bg-warning/20 text-warning-foreground hover:bg-warning/30"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePaid?.();
          }}
        >
          {registration.fields.paid ? 'Bezahlt' : 'Offen'}
        </Badge>
        <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
      </div>
    </div>
  );
}
