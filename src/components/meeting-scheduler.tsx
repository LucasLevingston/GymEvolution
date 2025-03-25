'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';
import { useUser } from '@/hooks/user-hooks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MeetingSchedulerProps {
  professionalId: string;
  purchaseId?: string;
  onScheduled?: (meetingId: string) => void;
  onCancel?: () => void;
}

export function MeetingScheduler({
  professionalId,
  purchaseId,
  onScheduled,
  onCancel,
}: MeetingSchedulerProps) {
  const { user } = useUser();
  const { isLoading, getAvailability, createMeeting } = useGoogleCalendar();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    { start: string; end: string }[]
  >([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [meetingDuration, setMeetingDuration] = useState<string>('30');
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [meetingDescription, setMeetingDescription] = useState<string>('');

  // Update formatted date when selected date changes
  useEffect(() => {
    if (selectedDate) {
      setFormattedDate(format(selectedDate, 'yyyy-MM-dd'));
    } else {
      setFormattedDate('');
    }
  }, [selectedDate]);

  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!formattedDate || !professionalId) return;

      const slots = await getAvailability(professionalId, formattedDate);
      setAvailableTimeSlots(slots);
      setSelectedTime(''); // Reset selected time when date changes
    };

    fetchAvailability();
  }, [formattedDate, professionalId, getAvailability]);

  const handleScheduleMeeting = async () => {
    if (!selectedDate || !selectedTime || !meetingTitle || !user?.id) return;

    // Calculate start and end times
    const startTime = new Date(`${formattedDate}T${selectedTime}`);
    const endTime = new Date(
      startTime.getTime() + Number.parseInt(meetingDuration) * 60000
    );

    const meeting = {
      title: meetingTitle,
      description: meetingDescription,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendees: [user.email],
      professionalId,
      purchaseId,
    };

    const result = await createMeeting(meeting);

    if (result && onScheduled) {
      onScheduled(result.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="meetingTitle">Título da Reunião</Label>
        <Input
          id="meetingTitle"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          placeholder="Ex: Consulta Inicial"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meetingDescription">Descrição (opcional)</Label>
        <Textarea
          id="meetingDescription"
          value={meetingDescription}
          onChange={(e) => setMeetingDescription(e.target.value)}
          placeholder="Detalhes sobre o que você gostaria de discutir..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Data</Label>
          <div className="border rounded-md p-3">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              disabled={(date) => {
                // Disable past dates
                return date < new Date(new Date().setHours(0, 0, 0, 0));
              }}
              className="mx-auto"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Horário Disponível</Label>
            {selectedDate ? (
              availableTimeSlots.length > 0 ? (
                <RadioGroup value={selectedTime} onValueChange={setSelectedTime}>
                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                    {availableTimeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 border p-2 rounded"
                      >
                        <RadioGroupItem value={slot.start} id={`time-${index}`} />
                        <Label htmlFor={`time-${index}`} className="cursor-pointer">
                          {slot.start} - {slot.end}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : isLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Carregando horários...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-[200px] border rounded-md">
                  <div className="text-center p-4">
                    <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="font-medium">Nenhum horário disponível</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tente selecionar outra data
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex justify-center items-center h-[200px] border rounded-md">
                <div className="text-center p-4">
                  <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="font-medium">Selecione uma data</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Escolha uma data para ver os horários disponíveis
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Select value={meetingDuration} onValueChange={setMeetingDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a duração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="90">1 hora e 30 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}

        <Button
          onClick={handleScheduleMeeting}
          disabled={isLoading || !selectedDate || !selectedTime || !meetingTitle}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Agendando...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Agendar Reunião
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
