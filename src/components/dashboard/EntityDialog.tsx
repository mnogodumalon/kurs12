import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import type {
  Instructors,
  Rooms,
  Participants,
  Courses,
  Registrations,
  CreateInstructors,
  CreateRooms,
  CreateParticipants,
  CreateCourses,
  CreateRegistrations,
} from '@/types/app';
import { LivingAppsService, extractRecordId, createRecordUrl } from '@/services/livingAppsService';
import { APP_IDS } from '@/types/app';

type EntityType = 'instructor' | 'room' | 'participant' | 'course' | 'registration';

interface EntityDialogProps {
  type: EntityType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: Instructors | Rooms | Participants | Courses | Registrations | null;
  instructors?: Instructors[];
  rooms?: Rooms[];
  participants?: Participants[];
  courses?: Courses[];
  onSuccess: () => void;
}

export function EntityDialog({
  type,
  open,
  onOpenChange,
  entity,
  instructors = [],
  rooms = [],
  participants = [],
  courses = [],
  onSuccess,
}: EntityDialogProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEdit = !!entity;

  useEffect(() => {
    if (entity) {
      setFormData({ ...entity.fields });
    } else {
      setFormData({});
    }
  }, [entity, open]);

  const getTitle = () => {
    const titles: Record<EntityType, string> = {
      instructor: isEdit ? 'Dozent bearbeiten' : 'Neuer Dozent',
      room: isEdit ? 'Raum bearbeiten' : 'Neuer Raum',
      participant: isEdit ? 'Teilnehmer bearbeiten' : 'Neuer Teilnehmer',
      course: isEdit ? 'Kurs bearbeiten' : 'Neuer Kurs',
      registration: isEdit ? 'Anmeldung bearbeiten' : 'Neue Anmeldung',
    };
    return titles[type];
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      switch (type) {
        case 'instructor':
          if (isEdit && entity) {
            await LivingAppsService.updateInstructor(entity.record_id, formData as CreateInstructors);
          } else {
            await LivingAppsService.createInstructor(formData as CreateInstructors);
          }
          break;
        case 'room':
          if (isEdit && entity) {
            await LivingAppsService.updateRoom(entity.record_id, formData as CreateRooms);
          } else {
            await LivingAppsService.createRoom(formData as CreateRooms);
          }
          break;
        case 'participant':
          if (isEdit && entity) {
            await LivingAppsService.updateParticipant(entity.record_id, formData as CreateParticipants);
          } else {
            await LivingAppsService.createParticipant(formData as CreateParticipants);
          }
          break;
        case 'course': {
          const courseData = { ...formData } as CreateCourses;
          if (formData.instructor && typeof formData.instructor === 'string' && !formData.instructor.includes('http')) {
            courseData.instructor = createRecordUrl(APP_IDS.INSTRUCTORS, formData.instructor as string);
          }
          if (formData.room && typeof formData.room === 'string' && !formData.room.includes('http')) {
            courseData.room = createRecordUrl(APP_IDS.ROOMS, formData.room as string);
          }
          if (isEdit && entity) {
            await LivingAppsService.updateCourse(entity.record_id, courseData);
          } else {
            await LivingAppsService.createCourse(courseData);
          }
          break;
        }
        case 'registration': {
          const regData = { ...formData } as CreateRegistrations;
          if (formData.participant && typeof formData.participant === 'string' && !formData.participant.includes('http')) {
            regData.participant = createRecordUrl(APP_IDS.PARTICIPANTS, formData.participant as string);
          }
          if (formData.course && typeof formData.course === 'string' && !formData.course.includes('http')) {
            regData.course = createRecordUrl(APP_IDS.COURSES, formData.course as string);
          }
          if (isEdit && entity) {
            await LivingAppsService.updateRegistration(entity.record_id, regData);
          } else {
            await LivingAppsService.createRegistration(regData);
          }
          break;
        }
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Fehler beim Speichern.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!entity) return;
    setLoading(true);
    try {
      switch (type) {
        case 'instructor':
          await LivingAppsService.deleteInstructor(entity.record_id);
          break;
        case 'room':
          await LivingAppsService.deleteRoom(entity.record_id);
          break;
        case 'participant':
          await LivingAppsService.deleteParticipant(entity.record_id);
          break;
        case 'course':
          await LivingAppsService.deleteCourse(entity.record_id);
          break;
        case 'registration':
          await LivingAppsService.deleteRegistration(entity.record_id);
          break;
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Fehler beim Löschen.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'instructor':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={(formData.name as string) || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Max Mustermann"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={(formData.email as string) || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="max@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={(formData.phone as string) || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+49 123 456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Fachgebiet</Label>
              <Input
                id="specialty"
                value={(formData.specialty as string) || ''}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="Informatik, Sprachen, etc."
              />
            </div>
          </>
        );

      case 'room':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Raumname *</Label>
              <Input
                id="name"
                value={(formData.name as string) || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seminarraum 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="building">Gebäude *</Label>
              <Input
                id="building"
                value={(formData.building as string) || ''}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                placeholder="Hauptgebäude"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Kapazität *</Label>
              <Input
                id="capacity"
                type="number"
                value={(formData.capacity as number) || ''}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                placeholder="25"
              />
            </div>
          </>
        );

      case 'participant':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={(formData.name as string) || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Anna Schmidt"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={(formData.email as string) || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="anna@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={(formData.phone as string) || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+49 123 456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Geburtsdatum</Label>
              <Input
                id="birthdate"
                type="date"
                value={(formData.birthdate as string) || ''}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              />
            </div>
          </>
        );

      case 'course':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Kurstitel *</Label>
              <Input
                id="title"
                value={(formData.title as string) || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Englisch für Anfänger"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={(formData.description as string) || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ausführliche Beschreibung des Kurses..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Startdatum *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={(formData.start_date as string) || ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Enddatum *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={(formData.end_date as string) || ''}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_participants">Max. Teilnehmer *</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={(formData.max_participants as number) || ''}
                  onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 0 })}
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preis (EUR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={(formData.price as number) || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="150"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Dozent *</Label>
              <Select
                value={extractRecordId(formData.instructor as string) || ''}
                onValueChange={(value) => setFormData({ ...formData, instructor: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Dozent auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((i) => (
                    <SelectItem key={i.record_id} value={i.record_id}>
                      {i.fields.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Raum *</Label>
              <Select
                value={extractRecordId(formData.room as string) || ''}
                onValueChange={(value) => setFormData({ ...formData, room: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Raum auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.record_id} value={r.record_id}>
                      {r.fields.name} ({r.fields.building})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'registration':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="participant">Teilnehmer *</Label>
              <Select
                value={extractRecordId(formData.participant as string) || ''}
                onValueChange={(value) => setFormData({ ...formData, participant: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Teilnehmer auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p.record_id} value={p.record_id}>
                      {p.fields.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Kurs *</Label>
              <Select
                value={extractRecordId(formData.course as string) || ''}
                onValueChange={(value) => setFormData({ ...formData, course: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kurs auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.record_id} value={c.record_id}>
                      {c.fields.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration_date">Anmeldedatum *</Label>
              <Input
                id="registration_date"
                type="date"
                value={(formData.registration_date as string) || ''}
                onChange={(e) => setFormData({ ...formData, registration_date: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="paid"
                type="checkbox"
                checked={(formData.paid as boolean) || false}
                onChange={(e) => setFormData({ ...formData, paid: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="paid" className="cursor-pointer">
                Bezahlt
              </Label>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'var(--shadow-dialog)' }}>
          <DialogHeader>
            <DialogTitle>{getTitle()}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Bearbeiten Sie die Daten und speichern Sie die Änderungen.' : 'Füllen Sie die Felder aus, um einen neuen Eintrag zu erstellen.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">{renderFields()}</div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {isEdit && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="w-full sm:w-auto sm:mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Abbrechen
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Wird gespeichert...' : 'Speichern'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Wirklich löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Der Eintrag wird dauerhaft gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
