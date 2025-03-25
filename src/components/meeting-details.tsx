'use client';

import { useState, useEffect } from 'react';
import { Calendar, ExternalLink, User, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MeetingDetailsProps {
  meetingId: string;
  onEdit?: () => void;
  onCancel?: () => void;
}

export function MeetingDetails({ meetingId, onEdit, onCancel }: MeetingDetailsProps) {
  const { isLoading, getMeetingDetails, deleteMeeting } = useGoogleCalendar();
  const [meeting, setMeeting] = useState<any>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      if (!meetingId) return;

      const data = await getMeetingDetails(meetingId);
      if (data) {
        setMeeting(data);
      }
    };

    fetchMeetingDetails();
  }, [meetingId, getMeetingDetails]);

  const handleCancelMeeting = async () => {
    if (!meetingId || !window.confirm('Tem certeza que deseja cancelar esta reunião?'))
      return;

    setCancelLoading(true);
    const success = await deleteMeeting(meetingId);
    setCancelLoading(false);

    if (success && onCancel) {
      onCancel();
    }
  };

  const formatMeetingDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return `Hoje, ${format(date, 'HH:mm', { locale: ptBR })}`;
    } else if (isTomorrow(date)) {
      return `Amanhã, ${format(date, 'HH:mm', { locale: ptBR })}`;
    } else {
      return format(date, "dd 'de' MMMM', às 'HH:mm", { locale: ptBR });
    }
  };

  const getMeetingDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

    if (durationMinutes < 60) {
      return `${durationMinutes} minutos`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0
        ? `${hours} hora${hours > 1 ? 's' : ''} e ${minutes} minutos`
        : `${hours} hora${hours > 1 ? 's' : ''}`;
    }
  };

  const isMeetingActive = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    return now >= start && now <= end;
  };

  const isMeetingUpcoming = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);

    return start > now;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Carregando detalhes da reunião...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!meeting) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <Video className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">Reunião não encontrada</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Não foi possível encontrar os detalhes desta reunião.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isActive = isMeetingActive(meeting.startTime, meeting.endTime);
  const isUpcoming = isMeetingUpcoming(meeting.startTime);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{meeting.title}</CardTitle>
            <CardDescription>{formatMeetingDate(meeting.startTime)}</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={
              isActive
                ? 'bg-green-50 text-green-700 border-green-200'
                : isUpcoming
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
            }
          >
            {isActive ? 'Em andamento' : isUpcoming ? 'Agendada' : 'Concluída'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {meeting.meetLink && (
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
            <div className="flex items-start">
              <Video className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-blue-800">Link da reunião</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Use este link para entrar na reunião no horário agendado.
                </p>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => window.open(meeting.meetLink, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Entrar na reunião
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium">Data e hora</h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(meeting.startTime), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
              <p className="text-sm">
                {format(new Date(meeting.startTime), 'HH:mm', { locale: ptBR })} -
                {format(new Date(meeting.endTime), ' HH:mm', { locale: ptBR })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Duração: {getMeetingDuration(meeting.startTime, meeting.endTime)}
              </p>
            </div>
          </div>

          {meeting.professional && (
            <div className="flex items-start">
              <User className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium">Profissional</h4>
                <div className="flex items-center mt-1">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={meeting.professional.imageUrl} />
                    <AvatarFallback>
                      {meeting.professional.name?.substring(0, 2).toUpperCase() || 'PR'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{meeting.professional.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {meeting.professional.specialty || meeting.professional.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {meeting.description && (
          <div>
            <h4 className="font-medium mb-1">Descrição</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {meeting.description}
            </p>
          </div>
        )}
      </CardContent>

      {isUpcoming && (
        <CardFooter className="flex justify-end space-x-2">
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              Editar
            </Button>
          )}

          {onCancel && (
            <Button
              variant="destructive"
              onClick={handleCancelMeeting}
              disabled={cancelLoading}
            >
              {cancelLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cancelando...
                </>
              ) : (
                'Cancelar Reunião'
              )}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
