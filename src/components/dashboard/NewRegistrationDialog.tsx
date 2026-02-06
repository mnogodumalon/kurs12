import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { Participants, Courses, CreateRegistrations, CreateParticipants } from '@/types/app';
import { LivingAppsService, createRecordUrl } from '@/services/livingAppsService';
import { APP_IDS } from '@/types/app';

interface NewRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participants[];
  courses: Courses[];
  courseRegistrationCounts: Record<string, number>;
  onSuccess: () => void;
}

export function NewRegistrationDialog({
  open,
  onOpenChange,
  participants,
  courses,
  courseRegistrationCounts,
  onSuccess,
}: NewRegistrationDialogProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewParticipant, setShowNewParticipant] = useState(false);
  const [newParticipant, setNewParticipant] = useState<CreateParticipants>({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!open) {
      setSelectedParticipant('');
      setSelectedCourse('');
      setPaid(false);
      setShowNewParticipant(false);
      setNewParticipant({ name: '', email: '', phone: '' });
    }
  }, [open]);

  const today = new Date().toISOString().split('T')[0];

  const availableCourses = courses.filter((course) => {
    const maxParticipants = course.fields.max_participants || 0;
    const currentCount = courseRegistrationCounts[course.record_id] || 0;
    const endDate = course.fields.end_date;
    return currentCount < maxParticipants && (!endDate || endDate >= today);
  });

  const handleSubmit = async () => {
    if (!selectedCourse) return;

    setLoading(true);
    try {
      let participantId = selectedParticipant;

      // Create new participant if needed
      if (showNewParticipant && newParticipant.name && newParticipant.email) {
        const created = await LivingAppsService.createParticipant(newParticipant);
        participantId = created.id;
      }

      if (!participantId) {
        alert('Bitte wählen Sie einen Teilnehmer aus oder erstellen Sie einen neuen.');
        setLoading(false);
        return;
      }

      const registrationData: CreateRegistrations = {
        participant: createRecordUrl(APP_IDS.PARTICIPANTS, participantId),
        course: createRecordUrl(APP_IDS.COURSES, selectedCourse),
        registration_date: today,
        paid,
      };

      await LivingAppsService.createRegistration(registrationData);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating registration:', error);
      alert('Fehler beim Erstellen der Anmeldung.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" style={{ boxShadow: 'var(--shadow-dialog)' }}>
        <DialogHeader>
          <DialogTitle>Neue Anmeldung</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Participant Selection */}
          <div className="space-y-2">
            <Label>Teilnehmer</Label>
            {!showNewParticipant ? (
              <>
                <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Teilnehmer auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.map((p) => (
                      <SelectItem key={p.record_id} value={p.record_id}>
                        {p.fields.name} ({p.fields.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-primary"
                  onClick={() => setShowNewParticipant(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Neuen Teilnehmer anlegen
                </Button>
              </>
            ) : (
              <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Name *</Label>
                  <Input
                    id="new-name"
                    value={newParticipant.name}
                    onChange={(e) =>
                      setNewParticipant({ ...newParticipant, name: e.target.value })
                    }
                    placeholder="Max Mustermann"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email">E-Mail *</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newParticipant.email}
                    onChange={(e) =>
                      setNewParticipant({ ...newParticipant, email: e.target.value })
                    }
                    placeholder="max@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-phone">Telefon</Label>
                  <Input
                    id="new-phone"
                    value={newParticipant.phone}
                    onChange={(e) =>
                      setNewParticipant({ ...newParticipant, phone: e.target.value })
                    }
                    placeholder="+49 123 456789"
                  />
                </div>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-muted-foreground"
                  onClick={() => {
                    setShowNewParticipant(false);
                    setNewParticipant({ name: '', email: '', phone: '' });
                  }}
                >
                  Existierenden Teilnehmer auswählen
                </Button>
              </div>
            )}
          </div>

          {/* Course Selection */}
          <div className="space-y-2">
            <Label>Kurs</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kurs auswählen" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Keine Kurse mit freien Plätzen
                  </SelectItem>
                ) : (
                  availableCourses.map((c) => {
                    const count = courseRegistrationCounts[c.record_id] || 0;
                    const max = c.fields.max_participants || 0;
                    return (
                      <SelectItem key={c.record_id} value={c.record_id}>
                        {c.fields.title} ({count}/{max} Plätze)
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Registration Date */}
          <div className="space-y-2">
            <Label>Anmeldedatum</Label>
            <Input type="date" value={today} disabled className="bg-muted" />
          </div>

          {/* Paid Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="paid"
              checked={paid}
              onCheckedChange={(checked) => setPaid(checked as boolean)}
            />
            <Label htmlFor="paid" className="cursor-pointer">
              Bereits bezahlt
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              (!selectedParticipant && (!showNewParticipant || !newParticipant.name || !newParticipant.email)) ||
              !selectedCourse
            }
          >
            {loading ? 'Wird erstellt...' : 'Anmeldung erstellen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
