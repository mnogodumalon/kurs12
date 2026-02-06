import { useState, useEffect, useMemo, useCallback } from 'react';
import { LivingAppsService, extractRecordId } from '@/services/livingAppsService';
import type { Instructors, Rooms, Participants, Courses, Registrations } from '@/types/app';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/dashboard/MobileNav';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { FloatingActionButton } from '@/components/dashboard/FloatingActionButton';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { RegistrationItem } from '@/components/dashboard/RegistrationItem';
import { NewRegistrationDialog } from '@/components/dashboard/NewRegistrationDialog';
import { EntityDialog } from '@/components/dashboard/EntityDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { de } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ActiveTab = 'dashboard' | 'courses' | 'instructors' | 'participants' | 'rooms' | 'registrations' | 'settings';
type FilterPeriod = 'all' | 'week' | 'month';

export default function Dashboard() {
  // Data state
  const [instructors, setInstructors] = useState<Instructors[]>([]);
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [registrations, setRegistrations] = useState<Registrations[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog state
  const [showNewRegistration, setShowNewRegistration] = useState(false);
  const [entityDialog, setEntityDialog] = useState<{
    type: 'instructor' | 'room' | 'participant' | 'course' | 'registration';
    entity?: Instructors | Rooms | Participants | Courses | Registrations | null;
  } | null>(null);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [instructorsData, roomsData, participantsData, coursesData, registrationsData] =
        await Promise.all([
          LivingAppsService.getInstructors(),
          LivingAppsService.getRooms(),
          LivingAppsService.getParticipants(),
          LivingAppsService.getCourses(),
          LivingAppsService.getRegistrations(),
        ]);
      setInstructors(instructorsData);
      setRooms(roomsData);
      setParticipants(participantsData);
      setCourses(coursesData);
      setRegistrations(registrationsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Fehler beim Laden der Daten. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Computed values
  const courseRegistrationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    registrations.forEach((reg) => {
      const courseId = extractRecordId(reg.fields.course);
      if (courseId) {
        counts[courseId] = (counts[courseId] || 0) + 1;
      }
    });
    return counts;
  }, [registrations]);

  const instructorsMap = useMemo(() => {
    const map: Record<string, Instructors> = {};
    instructors.forEach((i) => (map[i.record_id] = i));
    return map;
  }, [instructors]);

  const roomsMap = useMemo(() => {
    const map: Record<string, Rooms> = {};
    rooms.forEach((r) => (map[r.record_id] = r));
    return map;
  }, [rooms]);

  const participantsMap = useMemo(() => {
    const map: Record<string, Participants> = {};
    participants.forEach((p) => (map[p.record_id] = p));
    return map;
  }, [participants]);

  const coursesMap = useMemo(() => {
    const map: Record<string, Courses> = {};
    courses.forEach((c) => (map[c.record_id] = c));
    return map;
  }, [courses]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const openRegistrations = registrations.filter((r) => !r.fields.paid).length;
    const coursesThisWeek = courses.filter((c) => {
      const startDate = c.fields.start_date;
      const endDate = c.fields.end_date;
      if (!startDate || !endDate) return false;
      return startDate <= format(weekEnd, 'yyyy-MM-dd') && endDate >= today;
    }).length;

    return {
      openRegistrations,
      coursesThisWeek,
      totalParticipants: participants.length,
    };
  }, [courses, registrations, participants]);

  // Filtered courses for display
  const filteredCourses = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    let filtered = courses.filter((c) => c.fields.end_date && c.fields.end_date >= today);

    if (filterPeriod === 'week') {
      const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      filtered = filtered.filter(
        (c) => c.fields.start_date && c.fields.start_date <= weekEnd
      );
    } else if (filterPeriod === 'month') {
      const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      filtered = filtered.filter(
        (c) => c.fields.start_date && c.fields.start_date <= monthEnd
      );
    }

    return filtered.sort((a, b) => {
      const dateA = a.fields.start_date || '';
      const dateB = b.fields.start_date || '';
      return dateA.localeCompare(dateB);
    });
  }, [courses, filterPeriod]);

  // Recent registrations
  const recentRegistrations = useMemo(() => {
    return [...registrations]
      .sort((a, b) => {
        const dateA = a.fields.registration_date || a.createdat || '';
        const dateB = b.fields.registration_date || b.createdat || '';
        return dateB.localeCompare(dateA);
      })
      .slice(0, 8);
  }, [registrations]);

  const handleTogglePaid = async (registration: Registrations) => {
    try {
      await LivingAppsService.updateRegistration(registration.record_id, {
        paid: !registration.fields.paid,
      });
      fetchData();
    } catch (err) {
      console.error('Error updating registration:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile */}
        <div className="md:hidden">
          <MobileHeader />
          <div className="p-4 pb-24 space-y-6">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-36 shrink-0 rounded-xl" />
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <MobileNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t as ActiveTab)} />
        </div>

        {/* Desktop */}
        <div className="hidden md:flex">
          <div className="w-60 h-screen bg-card border-r p-6 space-y-4">
            <Skeleton className="h-8 w-40" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <div className="flex-1 p-6 ml-60">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-96 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription className="mt-2">
            {error}
            <Button variant="outline" className="mt-4 w-full" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Erneut versuchen
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render entity lists for different tabs
  const renderEntityList = () => {
    switch (activeTab) {
      case 'instructors':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Dozenten</h2>
              <Button onClick={() => setEntityDialog({ type: 'instructor' })}>
                <Plus className="h-4 w-4 mr-2" />
                Neuer Dozent
              </Button>
            </div>
            {instructors.length === 0 ? (
              <EmptyState
                title="Keine Dozenten"
                description="Erstellen Sie Ihren ersten Dozenten."
                action={
                  <Button onClick={() => setEntityDialog({ type: 'instructor' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Dozent anlegen
                  </Button>
                }
              />
            ) : (
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>E-Mail</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Fachgebiet</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {instructors.map((i) => (
                      <TableRow
                        key={i.record_id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => setEntityDialog({ type: 'instructor', entity: i })}
                      >
                        <TableCell className="font-medium">{i.fields.name}</TableCell>
                        <TableCell>{i.fields.email}</TableCell>
                        <TableCell>{i.fields.phone || '-'}</TableCell>
                        <TableCell>{i.fields.specialty || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="md:hidden space-y-3">
              {instructors.map((i) => (
                <Card
                  key={i.record_id}
                  className="cursor-pointer tap-feedback"
                  onClick={() => setEntityDialog({ type: 'instructor', entity: i })}
                >
                  <CardContent className="p-4">
                    <div className="font-medium">{i.fields.name}</div>
                    <div className="text-sm text-muted-foreground">{i.fields.email}</div>
                    {i.fields.specialty && (
                      <div className="text-xs text-muted-foreground mt-1">{i.fields.specialty}</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'rooms':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Räume</h2>
              <Button onClick={() => setEntityDialog({ type: 'room' })}>
                <Plus className="h-4 w-4 mr-2" />
                Neuer Raum
              </Button>
            </div>
            {rooms.length === 0 ? (
              <EmptyState
                title="Keine Räume"
                description="Erstellen Sie Ihren ersten Raum."
                action={
                  <Button onClick={() => setEntityDialog({ type: 'room' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Raum anlegen
                  </Button>
                }
              />
            ) : (
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Raumname</TableHead>
                      <TableHead>Gebäude</TableHead>
                      <TableHead>Kapazität</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((r) => (
                      <TableRow
                        key={r.record_id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => setEntityDialog({ type: 'room', entity: r })}
                      >
                        <TableCell className="font-medium">{r.fields.name}</TableCell>
                        <TableCell>{r.fields.building}</TableCell>
                        <TableCell>{r.fields.capacity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="md:hidden space-y-3">
              {rooms.map((r) => (
                <Card
                  key={r.record_id}
                  className="cursor-pointer tap-feedback"
                  onClick={() => setEntityDialog({ type: 'room', entity: r })}
                >
                  <CardContent className="p-4">
                    <div className="font-medium">{r.fields.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {r.fields.building} • {r.fields.capacity} Plätze
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'participants':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl font-semibold">Teilnehmer</h2>
              <div className="flex items-center gap-2">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button onClick={() => setEntityDialog({ type: 'participant' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Neuer Teilnehmer
                </Button>
              </div>
            </div>
            {participants.length === 0 ? (
              <EmptyState
                title="Keine Teilnehmer"
                description="Erstellen Sie Ihren ersten Teilnehmer."
                action={
                  <Button onClick={() => setEntityDialog({ type: 'participant' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Teilnehmer anlegen
                  </Button>
                }
              />
            ) : (
              <>
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>E-Mail</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Geburtsdatum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants
                        .filter(
                          (p) =>
                            !searchQuery ||
                            p.fields.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.fields.email?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((p) => (
                          <TableRow
                            key={p.record_id}
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => setEntityDialog({ type: 'participant', entity: p })}
                          >
                            <TableCell className="font-medium">{p.fields.name}</TableCell>
                            <TableCell>{p.fields.email}</TableCell>
                            <TableCell>{p.fields.phone || '-'}</TableCell>
                            <TableCell>
                              {p.fields.birthdate
                                ? format(parseISO(p.fields.birthdate), 'dd.MM.yyyy', { locale: de })
                                : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="md:hidden space-y-3">
                  {participants.map((p) => (
                    <Card
                      key={p.record_id}
                      className="cursor-pointer tap-feedback"
                      onClick={() => setEntityDialog({ type: 'participant', entity: p })}
                    >
                      <CardContent className="p-4">
                        <div className="font-medium">{p.fields.name}</div>
                        <div className="text-sm text-muted-foreground">{p.fields.email}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl font-semibold">Alle Kurse</h2>
              <Button onClick={() => setEntityDialog({ type: 'course' })}>
                <Plus className="h-4 w-4 mr-2" />
                Neuer Kurs
              </Button>
            </div>
            {courses.length === 0 ? (
              <EmptyState
                title="Keine Kurse"
                description="Erstellen Sie Ihren ersten Kurs."
                action={
                  <Button onClick={() => setEntityDialog({ type: 'course' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Kurs anlegen
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {courses.map((course) => {
                  const instructorId = extractRecordId(course.fields.instructor);
                  const roomId = extractRecordId(course.fields.room);
                  return (
                    <CourseCard
                      key={course.record_id}
                      course={course}
                      instructor={instructorId ? instructorsMap[instructorId] : undefined}
                      room={roomId ? roomsMap[roomId] : undefined}
                      registrationCount={courseRegistrationCounts[course.record_id] || 0}
                      onClick={() => setEntityDialog({ type: 'course', entity: course })}
                      onEdit={() => setEntityDialog({ type: 'course', entity: course })}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'registrations':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Alle Anmeldungen</h2>
              <Button onClick={() => setShowNewRegistration(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Neue Anmeldung
              </Button>
            </div>
            {registrations.length === 0 ? (
              <EmptyState
                title="Keine Anmeldungen"
                description="Erstellen Sie Ihre erste Anmeldung."
                action={
                  <Button onClick={() => setShowNewRegistration(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Anmeldung erstellen
                  </Button>
                }
              />
            ) : (
              <Card>
                <CardContent className="p-4 divide-y divide-border">
                  {registrations.map((r) => {
                    const participantId = extractRecordId(r.fields.participant);
                    const courseId = extractRecordId(r.fields.course);
                    return (
                      <RegistrationItem
                        key={r.record_id}
                        registration={r}
                        participant={participantId ? participantsMap[participantId] : undefined}
                        course={courseId ? coursesMap[courseId] : undefined}
                        onEdit={() => setEntityDialog({ type: 'registration', entity: r })}
                        onTogglePaid={() => handleTogglePaid(r)}
                      />
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Einstellungen</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Einstellungen werden in einer zukünftigen Version verfügbar sein.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  // Dashboard content
  const renderDashboard = () => (
    <>
      {/* Mobile Quick Stats */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <StatCard
            label="Offene Anmeldungen"
            value={stats.openRegistrations}
            highlight
            warning={stats.openRegistrations > 5}
            className="w-36 h-20 shrink-0"
          />
          <StatCard
            label="Kurse diese Woche"
            value={stats.coursesThisWeek}
            className="w-36 h-20 shrink-0"
          />
          <StatCard
            label="Unbezahlt"
            value={stats.openRegistrations}
            warning={stats.openRegistrations > 0}
            className="w-36 h-20 shrink-0"
          />
        </div>
      </div>

      {/* Courses Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold">
            Aktuelle & Kommende Kurse
          </h2>
          <div className="flex items-center gap-2">
            <Select
              value={filterPeriod}
              onValueChange={(v) => setFilterPeriod(v as FilterPeriod)}
            >
              <SelectTrigger className="w-[140px] hidden md:flex">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="week">Diese Woche</SelectItem>
                <SelectItem value="month">Dieser Monat</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="link"
              size="sm"
              className="text-primary p-0 h-auto md:hidden"
              onClick={() => setActiveTab('courses')}
            >
              Alle anzeigen
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <EmptyState
            title="Keine Kurse"
            description="Erstellen Sie Ihren ersten Kurs, um loszulegen."
            action={
              <Button onClick={() => setEntityDialog({ type: 'course' })}>
                <Plus className="h-4 w-4 mr-2" />
                Kurs anlegen
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredCourses.slice(0, 5).map((course) => {
              const instructorId = extractRecordId(course.fields.instructor);
              const roomId = extractRecordId(course.fields.room);
              return (
                <div key={course.record_id} className="stagger-item">
                  <CourseCard
                    course={course}
                    instructor={instructorId ? instructorsMap[instructorId] : undefined}
                    room={roomId ? roomsMap[roomId] : undefined}
                    registrationCount={courseRegistrationCounts[course.record_id] || 0}
                    onClick={() => setEntityDialog({ type: 'course', entity: course })}
                    onEdit={() => setEntityDialog({ type: 'course', entity: course })}
                  />
                </div>
              );
            })}
            {filteredCourses.length > 5 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setActiveTab('courses')}
              >
                Alle {filteredCourses.length} Kurse anzeigen
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Recent Registrations - Mobile */}
      <section className="space-y-4 md:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Letzte Anmeldungen</h2>
          <Button
            variant="link"
            size="sm"
            className="text-primary p-0 h-auto"
            onClick={() => setActiveTab('registrations')}
          >
            Alle anzeigen
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        {recentRegistrations.length === 0 ? (
          <EmptyState
            title="Keine Anmeldungen"
            description="Noch keine Anmeldungen vorhanden."
            small
          />
        ) : (
          <Card>
            <CardContent className="p-2 divide-y divide-border">
              {recentRegistrations.slice(0, 5).map((r) => {
                const participantId = extractRecordId(r.fields.participant);
                const courseId = extractRecordId(r.fields.course);
                return (
                  <RegistrationItem
                    key={r.record_id}
                    registration={r}
                    participant={participantId ? participantsMap[participantId] : undefined}
                    course={courseId ? coursesMap[courseId] : undefined}
                    onEdit={() => setEntityDialog({ type: 'registration', entity: r })}
                    onTogglePaid={() => handleTogglePaid(r)}
                  />
                );
              })}
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileHeader />
        <main className="p-4 pb-32 space-y-6 animate-fade-in-up">
          {activeTab === 'dashboard' ? renderDashboard() : renderEntityList()}
        </main>
        <FloatingActionButton onClick={() => setShowNewRegistration(true)} />
        <MobileNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t as ActiveTab)} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex">
        <Sidebar activeTab={activeTab} onTabChange={(t) => setActiveTab(t as ActiveTab)} stats={stats} />

        <main className="flex-1 ml-60 min-h-screen">
          {/* Desktop Header */}
          <header className="h-20 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-30">
            <h1 className="text-2xl font-bold">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suchen..."
                  className="pl-9 w-64 focus:w-80 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowNewRegistration(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Neue Anmeldung
              </Button>
            </div>
          </header>

          {/* Desktop Content */}
          <div className="p-6 animate-fade-in-up">
            {activeTab === 'dashboard' ? (
              <div className="grid grid-cols-[2fr_1fr] gap-6">
                {/* Left Column - Courses */}
                <div className="space-y-6">{renderDashboard()}</div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Recent Registrations */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Letzte Anmeldungen</CardTitle>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto"
                          onClick={() => setActiveTab('registrations')}
                        >
                          Alle anzeigen
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 divide-y divide-border">
                      {recentRegistrations.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          Keine Anmeldungen vorhanden.
                        </p>
                      ) : (
                        recentRegistrations.map((r) => {
                          const participantId = extractRecordId(r.fields.participant);
                          const courseId = extractRecordId(r.fields.course);
                          return (
                            <RegistrationItem
                              key={r.record_id}
                              registration={r}
                              participant={participantId ? participantsMap[participantId] : undefined}
                              course={courseId ? coursesMap[courseId] : undefined}
                              onEdit={() => setEntityDialog({ type: 'registration', entity: r })}
                              onTogglePaid={() => handleTogglePaid(r)}
                            />
                          );
                        })
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Aktionen</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setEntityDialog({ type: 'course' })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Neuer Kurs
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setEntityDialog({ type: 'participant' })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Neuer Teilnehmer
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setEntityDialog({ type: 'instructor' })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Neuer Dozent
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              renderEntityList()
            )}
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <NewRegistrationDialog
        open={showNewRegistration}
        onOpenChange={setShowNewRegistration}
        participants={participants}
        courses={courses}
        courseRegistrationCounts={courseRegistrationCounts}
        onSuccess={fetchData}
      />

      {entityDialog && (
        <EntityDialog
          type={entityDialog.type}
          open={true}
          onOpenChange={() => setEntityDialog(null)}
          entity={entityDialog.entity}
          instructors={instructors}
          rooms={rooms}
          participants={participants}
          courses={courses}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

// Empty State Component
function EmptyState({
  title,
  description,
  action,
  small,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  small?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        small ? "py-6" : "py-12"
      )}
    >
      <h3 className={cn("font-medium", small ? "text-sm" : "text-base")}>{title}</h3>
      <p className={cn("text-muted-foreground mt-1", small ? "text-xs" : "text-sm")}>
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
