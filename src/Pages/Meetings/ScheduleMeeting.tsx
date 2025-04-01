'use client';

import type React from 'react';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Calendar,
  Clock,
  Info,
  AlertCircle,
  Clock3,
  RefreshCw,
} from 'lucide-react';
import {
  format,
  isBefore,
  startOfDay,
  isSameDay,
  addDays,
  parseISO,
  differenceInMinutes,
  addMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserStore } from '@/store/user-store';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';
import { GoogleCalendarConnect } from '@/components/GoogleCalendarConnect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePurchases } from '@/hooks/purchase-hooks';
import { toast } from 'sonner';
import type { Purchase } from '@/types/PurchaseType';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useProfessionals } from '@/hooks/professional-hooks';
import type { ProfessionalSettings } from '@/types/userType';

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface DayAvailability {
  date: Date;
  slots: TimeSlot[];
}

export default function ScheduleMeeting() {
  const navigate = useNavigate();
  const { purchaseId } = useParams<{ purchaseId: string }>();
  const { user } = useUserStore();
  const { createMeeting, getUserCalendar, getProfessionalAvailability, isLoading } =
    useGoogleCalendar();
  const { getPurchaseById } = usePurchases();
  const [purchase, setPurchase] = useState<Purchase | null>();

  const [professionalAvailability, setProfessionalAvailability] = useState<
    TimeSlot[] | null
  >(null);
  const [professionalSettings, setProfessionalSettings] =
    useState<ProfessionalSettings | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [title, setTitle] = useState('Consulta Inicial');
  const [description, setDescription] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilityMonths, setAvailabilityMonths] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  const { getProfessionalById } = useProfessionals();

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!purchaseId) return;

      try {
        const data = await getPurchaseById(purchaseId);
        if (!data) {
          toast.error('Erro ao carregar dados da compra');
          return;
        }
        setPurchase(data);
      } catch (error) {
        console.error('Error fetching purchase:', error);
        toast.error('Erro ao carregar dados da compra');
      }
    };

    fetchPurchases();
  }, [purchaseId, getPurchaseById]);

  useEffect(() => {
    const checkGoogleConnection = async () => {
      if (!user) return;

      try {
        const calendarData = await getUserCalendar();
        setIsGoogleConnected(!!calendarData);
      } catch (error) {
        console.error('Error checking Google connection:', error);
        setIsGoogleConnected(false);
      }
    };

    checkGoogleConnection();
  }, [user, getUserCalendar]);

  useEffect(() => {
    const fetchProfessionalSettings = async () => {
      if (!purchase?.professionalId) return;

      setSettingsLoading(true);
      try {
        const professional = await getProfessionalById(purchase.professionalId);
        if (!professional?.professionalSettings)
          throw new Error('Error on fetch professional settings');
        setProfessionalSettings(professional?.professionalSettings);
      } catch (error) {
        console.error('Error fetching professional settings:', error);
        toast.error('Erro ao carregar configurações do profissional');
      } finally {
        setSettingsLoading(false);
      }
    };

    if (purchase?.professionalId) {
      fetchProfessionalSettings();
    }
  }, [purchase, getProfessionalById]);

  const fetchAvailabilityForMonth = useCallback(
    async (month: Date) => {
      if (!purchase?.professionalId) return;

      setAvailabilityLoading(true);
      try {
        const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthKey = format(firstDayOfMonth, 'yyyy-MM');

        if (availabilityMonths.includes(monthKey)) {
          setAvailabilityLoading(false);
          return;
        }

        const startDate = firstDayOfMonth.toISOString().split('T')[0];

        const availability = await getProfessionalAvailability(
          purchase.professionalId,
          startDate
        );

        if (availability) {
          setProfessionalAvailability((prev) => {
            if (prev) {
              const existingDates = new Set(
                prev.map((slot) => slot.startTime.split('T')[0])
              );
              const newSlots = availability.filter(
                (slot) => !existingDates.has(slot.startTime.split('T')[0])
              );
              return [...prev, ...newSlots];
            }
            return availability;
          });

          setAvailabilityMonths((prev) => [...prev, monthKey]);
        }
      } catch (error) {
        console.error('Error fetching professional availability:', error);
        toast.error('Erro ao carregar disponibilidade do profissional');
      } finally {
        setAvailabilityLoading(false);
      }
    },
    [purchase?.professionalId, getProfessionalAvailability, availabilityMonths]
  );

  const fetchAvailabilityForDate = useCallback(
    async (date: Date) => {
      if (!purchase?.professionalId) return;

      setAvailabilityLoading(true);
      try {
        const dateStr = format(date, 'yyyy-MM-dd');

        const availability = await getProfessionalAvailability(
          purchase.professionalId,
          dateStr
        );

        if (availability) {
          const hasAvailable = availability.some((slot) => slot.available);

          setConfirmedAvailableDays((prev) => {
            const newSet = new Set(prev);
            if (hasAvailable) {
              newSet.add(dateStr);
            } else {
              newSet.delete(dateStr);
            }
            return newSet;
          });

          setProfessionalAvailability((prev) => {
            if (!prev) return availability;

            const filteredPrev = prev.filter((slot) => {
              const slotDate = slot.startTime.split('T')[0];
              return slotDate !== dateStr;
            });

            return [...filteredPrev, ...availability];
          });
        }

        setAvailabilityLoading(false);
        return availability && availability.some((slot) => slot.available);
      } catch (error) {
        console.error('Error fetching availability for date:', error);
        setAvailabilityLoading(false);
        return false;
      }
    },
    [purchase?.professionalId, getProfessionalAvailability]
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setLoadingDate(date);

    fetchAvailabilityForDate(date).finally(() => {
      setLoadingDate(null);
    });
  };

  useEffect(() => {
    if (purchase?.professionalId) {
      fetchAvailabilityForMonth(currentMonth);

      const nextMonth = addMonths(currentMonth, 1);
      fetchAvailabilityForMonth(nextMonth);
    }
  }, [currentMonth, purchase?.professionalId, fetchAvailabilityForMonth]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Título é obrigatório';
    if (!selectedDate) newErrors.date = 'Data é obrigatória';
    if (!selectedTimeSlot) newErrors.timeSlot = 'Horário é obrigatório';
    if (!isGoogleConnected) newErrors.google = 'Conexão com Google Calendar é necessária';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !purchase || !selectedTimeSlot || !selectedDate) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const meetingData = {
      title,
      description,
      startTime: selectedTimeSlot.startTime,
      endTime: selectedTimeSlot.endTime,
      professionalId: purchase.professionalId,
      professionalEmail: purchase.professional.email,
      studentId: user.id,
      purchaseId: purchase.id,
    };

    try {
      const result = await createMeeting(meetingData);
      if (result) {
        toast.success('Reunião agendada com sucesso!');
        navigate('/meetings');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Erro ao agendar reunião');
    }
  };

  const [loadingDate, setLoadingDate] = useState<Date | null>(null);

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const getAvailableDays = (): DayAvailability[] => {
    if (!professionalAvailability) return [];

    const groupedByDate = professionalAvailability.reduce(
      (acc, slot) => {
        const dateStr = slot.startTime.split('T')[0];
        if (!acc[dateStr]) {
          acc[dateStr] = {
            date: new Date(dateStr),
            slots: [],
          };
        }
        acc[dateStr].slots.push(slot);
        return acc;
      },
      {} as Record<string, DayAvailability>
    );

    return Object.values(groupedByDate).filter((day) =>
      day.slots.some((slot) => slot.available)
    );
  };

  const getAvailableSlotsForDate = (date: Date | null): TimeSlot[] => {
    if (!date || !professionalAvailability) return [];

    const availableSlots = professionalAvailability.filter((slot) => {
      const slotDate = new Date(slot.startTime.split('T')[0]);
      return isSameDay(slotDate, date) && slot.available;
    });

    return availableSlots.sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  };

  const isWorkDay = (date: Date): boolean => {
    if (!professionalSettings) return true;

    const workDays = professionalSettings.workDays
      .split(',')
      .map((day) => Number.parseInt(day.trim()));
    return workDays.includes(date.getDay());
  };

  const isWithinMaxAdvanceBooking = (date: Date): boolean => {
    if (!professionalSettings) return true;

    const maxAdvanceDate = addDays(new Date(), professionalSettings.maxAdvanceBooking);
    return date <= maxAdvanceDate;
  };

  const isValidDay = (day: Date | null): boolean => {
    if (!day) return false;

    const isValid =
      isWorkDay(day) &&
      isWithinMaxAdvanceBooking(day) &&
      !isBefore(day, startOfDay(new Date()));

    return isValid;
  };

  const getNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
  };

  const getPrevMonth = () => {
    const prevMonth = addMonths(currentMonth, -1);
    setCurrentMonth(prevMonth);
  };

  const getCalendarDaysForMonth = (month: Date): (Date | null)[] => {
    const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const calendarDays: (Date | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(new Date(month.getFullYear(), month.getMonth(), i));
    }

    const remainingSlots = (7 - (calendarDays.length % 7)) % 7;
    for (let i = 0; i < remainingSlots; i++) {
      calendarDays.push(null);
    }

    return calendarDays;
  };

  const formatTimeSlot = (slot: TimeSlot): string => {
    try {
      const startTime = parseISO(slot.startTime);
      const endTime = parseISO(slot.endTime);
      return `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`;
    } catch (error) {
      return `${slot.startTime.substring(11, 16)} - ${slot.endTime.substring(11, 16)}`;
    }
  };

  const getDurationInMinutes = (slot: TimeSlot): number => {
    try {
      const startTime = parseISO(slot.startTime);
      const endTime = parseISO(slot.endTime);
      return differenceInMinutes(endTime, startTime);
    } catch (error) {
      return 0;
    }
  };

  const refreshAvailability = async () => {
    if (!purchase?.professionalId) return;

    setAvailabilityLoading(true);
    setProfessionalAvailability(null);
    setAvailabilityMonths([]);

    try {
      await fetchAvailabilityForMonth(currentMonth);
      toast.success('Disponibilidade atualizada com sucesso!');
    } catch (error) {
      console.error('Error refreshing availability:', error);
      toast.error('Erro ao atualizar disponibilidade');
    }
  };

  const [confirmedAvailableDays, setConfirmedAvailableDays] = useState<Set<string>>(
    new Set()
  );

  const hasAvailabilityForDay = (day: Date | null): boolean => {
    if (!day) return false;

    const dateStr = format(day, 'yyyy-MM-dd');

    if (confirmedAvailableDays.has(dateStr)) {
      return true;
    }

    if (professionalAvailability) {
      return professionalAvailability.some((slot) => {
        const slotDate = slot.startTime.split('T')[0];
        return slotDate === dateStr && slot.available;
      });
    }

    return false;
  };

  const isDayClickable = (day: Date | null): boolean => {
    if (!day) return false;

    const isValid =
      isWorkDay(day) &&
      isWithinMaxAdvanceBooking(day) &&
      !isBefore(day, startOfDay(new Date()));

    return isValid;
  };

  if (!purchase) {
    return (
      <>
        <div className="py-20 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Erro ao carregar compra</h2>
          <p className="text-muted-foreground mb-8">
            Compra não encontrada ou você não tem permissão para acessá-la.
          </p>
          <Button asChild>
            <Link to="/purchases">Ver Minhas Compras</Link>
          </Button>
        </div>
      </>
    );
  }

  if (purchase.status !== 'SCHEDULEMEETING') {
    return (
      <>
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/purchases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Minhas Compras
          </Link>
        </Button>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Agendamento não disponível</AlertTitle>
          <AlertDescription>
            Esta compra não está em um status que permita agendamento de reunião. O status
            atual é: <Badge variant="outline">{purchase.status}</Badge>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Compra</CardTitle>
            <CardDescription>Informações sobre sua compra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Produto</h3>
                <p>{purchase.Plan.name}</p>
              </div>
              <div>
                <h3 className="font-medium">Profissional</h3>
                <p>{purchase.professional.name}</p>
              </div>
              <div>
                <h3 className="font-medium">Data da Compra</h3>
                <p>{format(new Date(purchase.createdAt), 'PPP', { locale: ptBR })}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <Badge variant="outline">{purchase.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/purchases">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Minhas Compras
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Agendar Reunião</h1>
      <p className="text-muted-foreground mb-8">
        {purchase?.professional ? (
          <>
            Escolha um horário disponível para sua reunião com{' '}
            <span className="font-medium">{purchase.professional.name}</span>
          </>
        ) : (
          <>Selecione um profissional e escolha um horário disponível para sua reunião</>
        )}
      </p>

      {!isGoogleConnected && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Conecte seu Google Calendar</AlertTitle>
          <AlertDescription>
            Para agendar uma reunião, você precisa conectar sua conta do Google Calendar.
            <div className="mt-2">
              <GoogleCalendarConnect />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {professionalSettings && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Informações do Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Horário de Trabalho</h4>
                  <p className="text-sm text-muted-foreground">
                    {professionalSettings.workStartHour}:00 -{' '}
                    {professionalSettings.workEndHour}:00
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Dias de Trabalho</h4>
                  <p className="text-sm text-muted-foreground">
                    {professionalSettings.workDays
                      .split(',')
                      .map((day) => {
                        const dayNum = Number.parseInt(day.trim());
                        const dayNames = [
                          'Domingo',
                          'Segunda',
                          'Terça',
                          'Quarta',
                          'Quinta',
                          'Sexta',
                          'Sábado',
                        ];
                        return dayNames[dayNum];
                      })
                      .join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock3 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Duração da Consulta</h4>
                  <p className="text-sm text-muted-foreground">
                    {professionalSettings.appointmentDuration} minutos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Reunião</CardTitle>
            <CardDescription>
              Selecione a data e horário para sua reunião pelo Google Meet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Selecione uma data e horário disponível</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={refreshAvailability}
                  disabled={availabilityLoading}
                >
                  {availabilityLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Atualizar Disponibilidade
                </Button>
              </div>

              {availabilityLoading && !professionalAvailability ? (
                <div className="space-y-2">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : !professionalAvailability ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Sem dados de disponibilidade</AlertTitle>
                  <AlertDescription>
                    Não foi possível carregar a disponibilidade do profissional. Tente
                    novamente mais tarde.
                  </AlertDescription>
                </Alert>
              ) : (
                <Tabs defaultValue="calendar" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="calendar">Calendário</TabsTrigger>
                    <TabsTrigger value="list">Lista de Horários</TabsTrigger>
                  </TabsList>

                  <TabsContent value="calendar" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-center font-medium">
                        {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={getPrevMonth}
                          disabled={isBefore(
                            addMonths(currentMonth, -1),
                            startOfDay(new Date())
                          )}
                        >
                          Anterior
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={getNextMonth}
                        >
                          Próximo
                        </Button>
                      </div>
                    </div>

                    {availabilityLoading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2"></div>
                          <p className="text-sm text-muted-foreground">
                            Carregando disponibilidade...
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-7 gap-1 text-center text-sm relative">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div key={day} className="py-2 font-medium">
                          {day}
                        </div>
                      ))}

                      {getCalendarDaysForMonth(currentMonth).map((day, index) => {
                        const hasAvailability = hasAvailabilityForDay(day);
                        const isClickable = isDayClickable(day);

                        return (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  role="button"
                                  tabIndex={day && isClickable ? 0 : -1}
                                  className={`
                                    p-2 rounded-md relative
                                    ${!day ? 'invisible' : ''}
                                    ${day && !isClickable ? 'text-gray-300 cursor-not-allowed bg-gray-50' : ''}
                                    ${day && isClickable && !hasAvailability ? 'cursor-pointer hover:bg-primary/10 bg-orange-50 text-orange-700' : ''}
                                    ${day && isClickable && hasAvailability ? 'cursor-pointer hover:bg-primary/10 bg-green-50 text-green-700' : ''}
                                    ${selectedDate && day && isSameDay(selectedDate, day) ? 'bg-primary text-primary-foreground' : ''}
                                    ${loadingDate && day && isSameDay(loadingDate, day) ? 'animate-pulse' : ''}
                                  `}
                                  onClick={() => {
                                    if (day && isClickable) {
                                      handleDateSelect(day);
                                      fetchAvailabilityForDate(day);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      (e.key === 'Enter' || e.key === ' ') &&
                                      day &&
                                      isClickable
                                    ) {
                                      e.preventDefault();
                                      handleDateSelect(day);
                                      fetchAvailabilityForDate(day);
                                    }
                                  }}
                                  aria-label={
                                    day
                                      ? `Selecionar ${format(day, 'dd/MM/yyyy')}${hasAvailability ? ', horários disponíveis' : ''}`
                                      : ''
                                  }
                                  aria-disabled={!day || !isClickable}
                                  aria-selected={
                                    selectedDate && day && isSameDay(selectedDate, day)
                                  }
                                >
                                  {day ? day.getDate() : ''}
                                  {hasAvailability && (
                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
                                  )}
                                </div>
                              </TooltipTrigger>
                              {day && (
                                <TooltipContent>
                                  {format(day, 'dd/MM/yyyy')}
                                  {!isWorkDay(day) && (
                                    <div>Fora do horário de trabalho</div>
                                  )}
                                  {!isWithinMaxAdvanceBooking(day) && (
                                    <div>Fora do período de agendamento</div>
                                  )}
                                  {isBefore(day, startOfDay(new Date())) && (
                                    <div>Data passada</div>
                                  )}
                                  {hasAvailability && (
                                    <div className="text-green-500">
                                      Horários disponíveis
                                    </div>
                                  )}
                                  {!hasAvailability && isClickable && (
                                    <div>Clique para verificar disponibilidade</div>
                                  )}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>

                    {selectedDate && (
                      <div className="mt-6 border-t pt-6">
                        <h3 className="font-medium mb-4 text-lg">
                          Horários disponíveis para{' '}
                          {format(selectedDate, 'PPPP', { locale: ptBR })}:
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {getAvailableSlotsForDate(selectedDate).length > 0 ? (
                            getAvailableSlotsForDate(selectedDate).map((slot, index) => (
                              <TooltipProvider key={index}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant={
                                        selectedTimeSlot === slot ? 'default' : 'outline'
                                      }
                                      className="flex items-center justify-center h-12"
                                      onClick={() => handleTimeSlotSelect(slot)}
                                    >
                                      <Clock className="mr-2 h-4 w-4" />
                                      {formatTimeSlot(slot)}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Duração: {getDurationInMinutes(slot)} minutos</p>
                                    {professionalSettings?.autoAcceptMeetings && (
                                      <p className="text-green-500">Aceite automático</p>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))
                          ) : (
                            <p className="col-span-full text-muted-foreground">
                              Não há horários disponíveis para esta data.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="list">
                    <div className="space-y-4">
                      {getAvailableDays().length > 0 ? (
                        getAvailableDays().map((day, dayIndex) => (
                          <div key={dayIndex} className="border rounded-md p-4">
                            <h3 className="font-medium mb-2">
                              {format(day.date, 'PPPP', { locale: ptBR })}
                            </h3>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                              {day.slots
                                .filter((slot) => slot.available)
                                .map((slot, slotIndex) => (
                                  <TooltipProvider key={`${dayIndex}-${slotIndex}`}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          type="button"
                                          variant={
                                            selectedDate &&
                                            selectedTimeSlot &&
                                            isSameDay(selectedDate, day.date) &&
                                            selectedTimeSlot === slot
                                              ? 'default'
                                              : 'outline'
                                          }
                                          className="flex items-center justify-center"
                                          onClick={() => {
                                            handleDateSelect(day.date);
                                            handleTimeSlotSelect(slot);
                                          }}
                                        >
                                          <Clock className="mr-2 h-4 w-4" />
                                          {formatTimeSlot(slot)}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          Duração: {getDurationInMinutes(slot)} minutos
                                        </p>
                                        {professionalSettings?.autoAcceptMeetings && (
                                          <p className="text-green-500">
                                            Aceite automático
                                          </p>
                                        )}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <h3 className="font-medium">Nenhum horário disponível</h3>
                          <p className="text-muted-foreground">
                            Não há horários disponíveis para agendamento no momento.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              {errors.timeSlot && (
                <p className="text-red-500 text-sm">{errors.timeSlot}</p>
              )}
            </div>

            {selectedDate && selectedTimeSlot && (
              <Alert className="bg-green-50 border-green-200">
                <Calendar className="h-4 w-4 text-green-600" />
                <AlertTitle>Horário selecionado</AlertTitle>
                <AlertDescription>
                  {format(selectedDate, 'PPPP', { locale: ptBR })} às{' '}
                  {selectedTimeSlot.startTime.substring(11, 16)} até{' '}
                  {selectedTimeSlot.endTime.substring(11, 16)}
                  {professionalSettings?.autoAcceptMeetings && (
                    <div className="mt-1 text-green-600 text-sm">
                      Esta reunião será aceita automaticamente pelo profissional.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/purchases')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !isGoogleConnected ||
                !purchase?.professionalId ||
                !selectedDate ||
                !selectedTimeSlot
              }
            >
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

function getCalendarDays(): (Date | null)[] {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const calendarDays: (Date | null)[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(today.getFullYear(), today.getMonth(), i));
  }

  const remainingSlots = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 0; i < remainingSlots; i++) {
    calendarDays.push(null);
  }

  return calendarDays;
}
