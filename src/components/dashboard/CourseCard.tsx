import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Users, Calendar, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Courses, Instructors, Rooms } from '@/types/app';

interface CourseCardProps {
  course: Courses;
  instructor?: Instructors;
  room?: Rooms;
  registrationCount: number;
  onEdit?: () => void;
  onViewParticipants?: () => void;
  onClick?: () => void;
}

export function CourseCard({
  course,
  instructor,
  room,
  registrationCount,
  onEdit,
  onViewParticipants,
  onClick,
}: CourseCardProps) {
  const maxParticipants = course.fields.max_participants || 1;
  const percentage = Math.min((registrationCount / maxParticipants) * 100, 100);

  const getOccupancyColor = () => {
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getOccupancyStatus = () => {
    if (percentage >= 100) return 'Ausgebucht';
    if (percentage >= 80) return 'Fast voll';
    return 'Verfügbar';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateRange = () => {
    const start = formatDate(course.fields.start_date);
    const end = formatDate(course.fields.end_date);
    if (start === end) return start;
    return `${start} - ${end}`;
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-150 hover:shadow-[var(--shadow-card-hover)]",
        "tap-feedback"
      )}
      style={{ boxShadow: 'var(--shadow-card)' }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-base md:text-lg leading-tight truncate pr-2">
                {course.fields.title}
              </h3>
              <Badge
                variant="outline"
                className="shrink-0 text-xs font-semibold"
              >
                {course.fields.price?.toFixed(0)} EUR
              </Badge>
            </div>

            <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{instructor?.fields.name || 'Kein Dozent'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {room ? `${room.fields.name}, ${room.fields.building}` : 'Kein Raum'}
                </span>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="mb-3 bg-accent text-accent-foreground rounded-md text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              {formatDateRange()}
            </Badge>

            {/* Auslastungsbalken */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Auslastung</span>
                <span className={cn(
                  "font-medium",
                  percentage >= 100 && "text-destructive",
                  percentage >= 80 && percentage < 100 && "text-warning-foreground"
                )}>
                  {getOccupancyStatus()}
                </span>
              </div>
              <div className="relative h-6 bg-muted rounded overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded transition-all duration-400 animate-progress-fill",
                    getOccupancyColor(),
                    percentage >= 80 && percentage < 100 && "pulse-warning"
                  )}
                  style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  <span className={cn(
                    percentage > 50 ? "text-white" : "text-foreground"
                  )}>
                    {registrationCount}/{maxParticipants} Teilnehmer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Actions - Desktop only */}
        <div className="hidden md:flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Bearbeiten
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewParticipants?.();
            }}
          >
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Teilnehmer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
