'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserStore } from '@/store/user-store';
import { ContainerRoot } from '@/components/Container';
import { useRelationships, type Relationship } from '@/hooks/relationship-hooks';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';
import { GoogleCalendarConnect } from '@/components/google-calendar-connect';

export default function ScheduleMeeting() {
  const navigate = useNavigate();
  const { professionalId } = useParams<{ professionalId: string }>();
  const { user } = useUserStore();
  const { createMeeting, isLoading } = useGoogleCalendar();
  const { getRelationships, isLoading: isLoadingRelationships } = useRelationships();
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [availableSlots, setAvailableSlots] = useState<
    { date: string; slots: string[] }[]
  >([
    {
      date: '2025-03-22',
      slots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    },
    {
      date: '2025-03-23',
      slots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
    },
    {
      date: '2025-03-24',
      slots: ['08:00', '09:00', '10:00', '11:00', '14:00'],
    },
  ]);

  const [title, setTitle] = useState('Consulta Inicial');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchRelationships = async () => {
      if (!user) return;

      const data = await getRelationships(user.id);
      const acceptedRelationships = data.filter((rel) => rel.status === 'ACCEPTED');
      setRelationships(acceptedRelationships);
    };

    fetchRelationships();
  }, [user, getRelationships]);

  useEffect(() => {
    setTimeSlot('');
  }, [date]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Título é obrigatório';
    if (!date) newErrors.date = 'Data é obrigatória';
    if (!timeSlot) newErrors.timeSlot = 'Horário é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !professionalId) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // Calculate end time (1 hour after start time)
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const startDateTime = new Date(`${date}T${timeSlot}:00`);
    const endDateTime = new Date(`${date}T${timeSlot}:00`);
    endDateTime.setHours(hours + 1);

    const meetingData = {
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
      professionalId,
      studentId: user.id,
    };

    const result = await createMeeting(meetingData);

    if (result) {
      navigate('/meetings');
    }
  };

  const getAvailableSlotsForDate = () => {
    if (!date) return [];

    const dateSlots = availableSlots.find((slot) => slot.date === date);
    return dateSlots ? dateSlots.slots : [];
  };

  if (!user) {
    return (
      <ContainerRoot>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Por favor, faça login</h2>
          <p className="text-muted-foreground mb-8">
            Você precisa estar logado para acessar esta página.
          </p>
          <Button asChild>
            <Link to="/login">Fazer Login</Link>
          </Button>
        </div>
      </ContainerRoot>
    );
  }

  if (!professionalId) {
    return (
      <ContainerRoot>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Profissional não especificado</h2>
          <p className="text-muted-foreground mb-8">
            É necessário especificar um profissional para agendar uma reunião.
          </p>
          <Button asChild>
            <Link to="/professionals">Encontrar Profissionais</Link>
          </Button>
        </div>
      </ContainerRoot>
    );
  }

  return (
    <>
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/meetings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Minhas Reuniões
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Agendar Reunião</h1>
      <p className="text-muted-foreground mb-8">
        Escolha um horário disponível para sua reunião com o profissional
      </p>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Reunião</CardTitle>
            <CardDescription>
              Selecione a data e horário para sua reunião pelo Google Meet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Reunião</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
                placeholder="Ex: Consulta Inicial de Avaliação"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Detalhes sobre o que você gostaria de discutir na reunião"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data Disponível</Label>
                <GoogleCalendarConnect />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">Horário Disponível</Label>
                <Select value={timeSlot} onValueChange={setTimeSlot} disabled={!date}>
                  <SelectTrigger className={errors.timeSlot ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableSlotsForDate().map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot} -{' '}
                        {slot.split(':')[0] === '23'
                          ? '00:00'
                          : `${Number.parseInt(slot.split(':')[0]) + 1}:${slot.split(':')[1]}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timeSlot && (
                  <p className="text-red-500 text-sm">{errors.timeSlot}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/meetings')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Agendando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Agendar Reunião
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
