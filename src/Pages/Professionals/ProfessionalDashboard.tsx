import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  FileText,
  Users,
  Bell,
  AlertCircle,
  ChevronRight,
  Video,
  FileCheck,
  CreditCard,
  CheckCircle,
  ClipboardList,
  ArrowRight,
  CalendarDays,
} from 'lucide-react';
import { format, isAfter, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/use-notifications';
import { useUser } from '@/hooks/user-hooks';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

export const purchaseStatusEnum = z.enum([
  'WAITINGPAYMENT',
  'SCHEDULEMEETING',
  'SCHEDULEDMEETING',
  'WAITINGSPREADSHEET',
  'SPREADSHEET SENT',
  'SCHEDULE RETURN',
  'FINALIZED',
]);

type PurchaseStatus = z.infer<typeof purchaseStatusEnum>;

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  role: string;
}

interface Student extends User {
  currentWeight?: string;
  currentBf?: string;
  height?: string;
  diets: Diet[];
  trainingWeeks: TrainingWeek[];
  meetingsAsStudent: Meeting[];
  purchases: Purchase[];
}

interface Diet {
  id: string;
  weekNumber: number;
  isCurrent: boolean;
  createdAt: string;
  userId: string;
}

interface TrainingWeek {
  id: string;
  weekNumber: number;
  isCompleted: boolean;
  startDate: string;
  userId: string;
}

interface Meeting {
  id: string;
  title: string;
  description?: string;
  meetLink?: string;
  startTime: string;
  endTime: string;
  status: string;
  professionalId: string;
  studentId: string;
  purchaseId?: string;
  createdAt: string;
}

interface Purchase {
  id: string;
  buyerId: string;
  professionalId: string;
  planId: string;
  amount: number;
  status: PurchaseStatus;
  paymentMethod?: string;
  createdAt: string;
  Plan: {
    id: string;
    name: string;
    duration: number;
  };
  student?: Student;
}

interface Availability {
  day: string;
  slots: { start: string; end: string }[];
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  studentId: string;
  studentName: string;
  completed: boolean;
  type: 'diet' | 'training' | 'meeting' | 'other';
  purchaseId?: string;
}

const getStatusInfo = (status: PurchaseStatus) => {
  switch (status) {
    case 'WAITINGPAYMENT':
      return {
        label: 'Aguardando Pagamento',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 'SCHEDULEMEETING':
      return {
        label: 'Agendar Reunião',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 'SCHEDULEDMEETING':
      return {
        label: 'Reunião Agendada',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      };
    case 'WAITINGSPREADSHEET':
      return {
        label: 'Aguardando Planilha',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
      };
    case 'SPREADSHEET SENT':
      return {
        label: 'Planilha Enviada',
        color: 'bg-green-50 text-green-700 border-green-200',
      };
    case 'SCHEDULE RETURN':
      return {
        label: 'Agendar Retorno',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 'FINALIZED':
      return { label: 'Finalizado', color: 'bg-gray-50 text-gray-700 border-gray-200' };
    default:
      return { label: status, color: 'bg-gray-50 text-gray-700 border-gray-200' };
  }
};

const getProgressByStatus = (status: PurchaseStatus) => {
  switch (status) {
    case 'WAITINGPAYMENT':
      return 10;
    case 'SCHEDULEMEETING':
      return 25;
    case 'SCHEDULEDMEETING':
      return 40;
    case 'WAITINGSPREADSHEET':
      return 60;
    case 'SPREADSHEET SENT':
      return 75;
    case 'SCHEDULE RETURN':
      return 90;
    case 'FINALIZED':
      return 100;
    default:
      return 0;
  }
};

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { notifications } = useNotifications();
  const { user } = useUser();

  const [students, setStudents] = useState<Student[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isDietDialogOpen, setIsDietDialogOpen] = useState(false);
  const [isStatusUpdateDialogOpen, setIsStatusUpdateDialogOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [availability] = useState<Availability[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const [dietWeekNumber, setDietWeekNumber] = useState(1);
  const [trainingWeekNumber, setTrainingWeekNumber] = useState(1);
  const [dietNotes, setDietNotes] = useState('');
  const [trainingNotes, setTrainingNotes] = useState('');

  const [newStatus, setNewStatus] = useState<PurchaseStatus | ''>('');
  const [statusNotes, setStatusNotes] = useState('');

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Falha ao carregar dados. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const generateTasks = (
    students: Student[],
    meetings: Meeting[],
    purchases: Purchase[]
  ): Task[] => {
    const tasks: Task[] = [];

    purchases.map((purchase) => {
      const student = students.find((s) => s.id === purchase.buyerId);
      if (!student) return;

      const studentName = student.name || student.email;

      switch (purchase.status) {
        case 'SCHEDULEMEETING':
          tasks.push({
            id: `meeting-${purchase.id}`,
            title: `Agendar reunião inicial com ${studentName}`,
            dueDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
            priority: 'high',
            studentId: student.id,
            studentName,
            completed: false,
            type: 'meeting',
            purchaseId: purchase.id,
          });
          break;

        case 'SCHEDULEDMEETING':
          const scheduledMeeting = meetings.find(
            (m) => m.purchaseId === purchase.id && m.status === 'SCHEDULED'
          );
          if (
            scheduledMeeting &&
            isAfter(new Date(), parseISO(scheduledMeeting.endTime))
          ) {
            tasks.push({
              id: `spreadsheet-${purchase.id}`,
              title: `Enviar planilha para ${studentName}`,
              dueDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
              priority: 'high',
              studentId: student.id,
              studentName,
              completed: false,
              type: 'diet',
              purchaseId: purchase.id,
            });
          }
          break;

        case 'WAITINGSPREADSHEET':
          tasks.push({
            id: `spreadsheet-${purchase.id}`,
            title: `Enviar planilha para ${studentName}`,
            dueDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
            priority: 'high',
            studentId: student.id,
            studentName,
            completed: false,
            type: 'diet',
            purchaseId: purchase.id,
          });
          break;

        case 'SCHEDULE RETURN':
          tasks.push({
            id: `return-${purchase.id}`,
            title: `Agendar reunião de retorno com ${studentName}`,
            dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
            priority: 'medium',
            studentId: student.id,
            studentName,
            completed: false,
            type: 'meeting',
            purchaseId: purchase.id,
          });
          break;
      }
    });

    return tasks;
  };

  const filteredStudents = students.filter((student) =>
    (student.name || student.email).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingMeetings = meetings
    .filter(
      (meeting) =>
        meeting.status === 'SCHEDULED' && isAfter(new Date(meeting.startTime), new Date())
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const pendingTasks = tasks.filter((task) => !task.completed);

  const purchasesByStatus = purchases.reduce(
    (acc, purchase) => {
      const student = students.find((s) => s.id === purchase.buyerId);
      if (student) {
        purchase.student = student;
      }

      if (!acc[purchase.status]) {
        acc[purchase.status] = [];
      }
      acc[purchase.status].push(purchase);
      return acc;
    },
    {} as Record<PurchaseStatus, Purchase[]>
  );

  const handleCompleteTask = async (taskId: string) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );

      toast({
        title: 'Tarefa concluída',
        description: 'A tarefa foi marcada como concluída com sucesso.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível concluir a tarefa. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleScheduleMeeting = async () => {
    if (
      !selectedStudent ||
      !selectedDate ||
      !selectedTime ||
      !meetingTitle ||
      !selectedPurchase
    ) {
      toast({
        title: 'Erro ao agendar',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const startTime = new Date(`${selectedDate}T${selectedTime}`);
      const endTime = new Date(startTime.getTime() * 60000);

      const meetResponse = await fetch('/api/google-meet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: meetingTitle,
          description: meetingDescription,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          attendees: [selectedStudent.email],
        }),
      });

      const meetData = await meetResponse.json();

      if (!meetData.success) {
        throw new Error(meetData.message || 'Failed to create meeting');
      }

      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: meetingTitle,
          description: meetingDescription,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          studentId: selectedStudent.id,
          purchaseId: selectedPurchase.id,
          meetLink: meetData.meetLink,
          meetingCode: meetData.meetingCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to schedule meeting');
      }

      await updatePurchaseStatus(
        selectedPurchase.id,
        'SCHEDULEDMEETING',
        'Reunião agendada com sucesso'
      );

      setMeetings((prev) => [...prev, data]);

      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedStudent.id,
          title: 'Nova reunião agendada',
          message: `Sua reunião "${meetingTitle}" foi agendada para ${format(startTime, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}.`,
          type: 'info',
          link: `/meetings/${data.id}`,
        }),
      });

      setIsScheduleDialogOpen(false);

      toast({
        title: 'Reunião agendada',
        description: `Reunião agendada com ${selectedStudent.name || selectedStudent.email} para ${format(startTime, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}.`,
        variant: 'default',
      });

      setSelectedStudent(null);
      setSelectedDate('');
      setSelectedTime('');
      setMeetingTitle('');
      setMeetingDescription('');
      setSelectedPurchase(null);

      const taskToRemove = tasks.find(
        (t) => t.purchaseId === selectedPurchase.id && t.type === 'meeting'
      );
      if (taskToRemove) {
        handleCompleteTask(taskToRemove.id);
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível agendar a reunião. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateSpreadsheet = async () => {
    if (!selectedStudent || !selectedPurchase) {
      toast({
        title: 'Erro ao criar planilha',
        description: 'Por favor, selecione um aluno e uma compra.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const dietResponse = await fetch('/api/diets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedStudent.id,
          weekNumber: dietWeekNumber,
          isCurrent: true,
          notes: dietNotes,
        }),
      });

      const dietData = await dietResponse.json();

      if (!dietResponse.ok) {
        throw new Error(dietData.message || 'Failed to create diet');
      }

      const trainingResponse = await fetch('/api/training-weeks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedStudent.id,
          weekNumber: trainingWeekNumber,
          startDate: new Date().toISOString(),
          information: trainingNotes,
        }),
      });

      const trainingData = await trainingResponse.json();

      if (!trainingResponse.ok) {
        throw new Error(trainingData.message || 'Failed to create training plan');
      }

      await updatePurchaseStatus(
        selectedPurchase.id,
        'SPREADSHEET SENT',
        'Planilha enviada com sucesso'
      );

      setStudents((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id
            ? {
                ...student,
                diets: [...student.diets, dietData],
                trainingWeeks: [...student.trainingWeeks, trainingData],
              }
            : student
        )
      );

      const taskToRemove = tasks.find(
        (t) => t.purchaseId === selectedPurchase.id && t.type === 'diet'
      );
      if (taskToRemove) {
        handleCompleteTask(taskToRemove.id);
      }

      setIsDietDialogOpen(false);

      toast({
        title: 'Planilha enviada',
        description: `Dieta e plano de treino criados com sucesso para ${selectedStudent.name || selectedStudent.email}.`,
        variant: 'default',
      });

      setSelectedStudent(null);
      setDietWeekNumber(1);
      setTrainingWeekNumber(1);
      setDietNotes('');
      setTrainingNotes('');
      setSelectedPurchase(null);
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a planilha. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedPurchase || !newStatus) {
      toast({
        title: 'Erro ao atualizar status',
        description: 'Por favor, selecione um status válido.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updatePurchaseStatus(selectedPurchase.id, newStatus, statusNotes);

      setIsStatusUpdateDialogOpen(false);

      toast({
        title: 'Status atualizado',
        description: `Status da compra atualizado para ${getStatusInfo(newStatus).label}.`,
        variant: 'default',
      });

      setSelectedPurchase(null);
      setNewStatus('');
      setStatusNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const updatePurchaseStatus = async (
    purchaseId: string,
    status: PurchaseStatus,
    notes: string
  ) => {
    const response = await fetch(`/api/purchases/${purchaseId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        notes,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update purchase status');
    }

    setPurchases((prev) =>
      prev.map((purchase) =>
        purchase.id === purchaseId ? { ...purchase, status } : purchase
      )
    );

    const purchase = purchases.find((p) => p.id === purchaseId);
    if (purchase) {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: purchase.buyerId,
          title: 'Status da compra atualizado',
          message: `O status da sua compra foi atualizado para ${getStatusInfo(status).label}.`,
          type: 'info',
          link: `/purchases/${purchaseId}`,
        }),
      });
    }

    return data;
  };

  const getAvailableTimeSlots = (date: string) => {
    if (!date) return [];

    const dayOfWeek = new Date(date).getDay();
    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const dayName = dayNames[dayOfWeek];

    const dayAvailability = availability.find((a) => a.day === dayName);
    if (!dayAvailability) return [];

    return dayAvailability.slots.filter((slot) => {
      const slotStart = new Date(`${date}T${slot.start}`);
      const slotEnd = new Date(`${date}T${slot.end}`);

      const overlaps = meetings.some((meeting) => {
        if (meeting.status !== 'SCHEDULED') return false;

        const meetingDate = new Date(meeting.startTime).toISOString().split('T')[0];
        if (meetingDate !== date) return false;

        const meetingStart = new Date(meeting.startTime);
        const meetingEnd = new Date(meeting.endTime);

        return (
          (slotStart >= meetingStart && slotStart < meetingEnd) ||
          (slotEnd > meetingStart && slotEnd <= meetingEnd) ||
          (slotStart <= meetingStart && slotEnd >= meetingEnd)
        );
      });

      return !overlaps;
    });
  };

  const getNextStatusOptions = (currentStatus: PurchaseStatus) => {
    switch (currentStatus) {
      case 'WAITINGPAYMENT':
        return ['SCHEDULEMEETING'];
      case 'SCHEDULEMEETING':
        return ['SCHEDULEDMEETING'];
      case 'SCHEDULEDMEETING':
        return ['WAITINGSPREADSHEET'];
      case 'WAITINGSPREADSHEET':
        return ['SPREADSHEET SENT'];
      case 'SPREADSHEET SENT':
        return ['SCHEDULE RETURN'];
      case 'SCHEDULE RETURN':
        return ['SCHEDULEDMEETING', 'FINALIZED'];
      case 'FINALIZED':
        return [];
      default:
        return [];
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Profissional</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-900" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.imageUrl || '/placeholder.svg?height=40&width=40'}
              alt={user?.name || 'Profile'}
            />
            <AvatarFallback>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'PR'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary mr-2" />
              <span className="text-3xl font-bold">{students.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Reuniões Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary mr-2" />
              <span className="text-3xl font-bold">{upcomingMeetings.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Tarefas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-2" />
              <span className="text-3xl font-bold">{pendingTasks.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Planilhas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-primary mr-2" />
              <span className="text-3xl font-bold">
                {purchasesByStatus['WAITINGSPREADSHEET']?.length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Students */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Meus Alunos</CardTitle>
                <Input
                  type="search"
                  placeholder="Buscar aluno..."
                  className="max-w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CardDescription>
                Gerencie seus alunos e veja o progresso de cada um
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const studentPurchases = purchases.filter(
                        (p) => p.buyerId === student.id
                      );
                      const latestPurchase =
                        studentPurchases.length > 0
                          ? studentPurchases.sort(
                              (a, b) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime()
                            )[0]
                          : null;

                      const progress = latestPurchase
                        ? getProgressByStatus(latestPurchase.status)
                        : 0;

                      return (
                        <div
                          key={student.id}
                          className="flex items-start p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate(`/student/${student.id}`)}
                        >
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={
                                student.imageUrl || '/placeholder.svg?height=40&width=40'
                              }
                              alt={student.name || student.email}
                            />
                            <AvatarFallback>
                              {(student.name || student.email)
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {student.name || student.email}
                            </p>
                            <div className="flex items-center mt-1">
                              <Progress value={progress} className="h-2 flex-1" />
                              <span className="ml-2 text-xs text-gray-500">
                                {progress}%
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {latestPurchase && (
                                <Badge
                                  variant="outline"
                                  className={getStatusInfo(latestPurchase.status).color}
                                >
                                  {getStatusInfo(latestPurchase.status).label}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum aluno encontrado
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tasks and Meetings */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="workflow" className="h-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="workflow">Fluxo de Trabalho</TabsTrigger>
                <TabsTrigger value="tasks">Tarefas Pendentes</TabsTrigger>
                <TabsTrigger value="meetings">Reuniões</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Dialog
                  open={isScheduleDialogOpen}
                  onOpenChange={setIsScheduleDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <Calendar className="h-4 w-4" />
                      Agendar Reunião
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Agendar Nova Reunião</DialogTitle>
                      <DialogDescription>
                        Agende uma reunião com seu aluno para acompanhamento.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="student">Aluno</Label>
                        <Select
                          value={selectedStudent?.id}
                          onValueChange={(value) => {
                            const student = students.find((s) => s.id === value);
                            setSelectedStudent(student || null);
                            setSelectedPurchase(null);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um aluno" />
                          </SelectTrigger>
                          <SelectContent>
                            {students
                              .filter((s) => {
                                const studentPurchases = purchases.filter(
                                  (p) =>
                                    p.buyerId === s.id &&
                                    (p.status === 'SCHEDULEMEETING' ||
                                      p.status === 'SCHEDULE RETURN')
                                );
                                return studentPurchases.length > 0;
                              })
                              .map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name || student.email}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedStudent && (
                        <div className="grid gap-2">
                          <Label htmlFor="purchase">Compra</Label>
                          <Select
                            value={selectedPurchase?.id}
                            onValueChange={(value) => {
                              const purchase = purchases.find((p) => p.id === value);
                              setSelectedPurchase(purchase || null);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma compra" />
                            </SelectTrigger>
                            <SelectContent>
                              {purchases
                                .filter(
                                  (p) =>
                                    p.buyerId === selectedStudent.id &&
                                    (p.status === 'SCHEDULEMEETING' ||
                                      p.status === 'SCHEDULE RETURN')
                                )
                                .map((purchase) => (
                                  <SelectItem key={purchase.id} value={purchase.id}>
                                    {purchase.Plan.name} -{' '}
                                    {format(new Date(purchase.createdAt), 'dd/MM/yyyy')}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label htmlFor="title">Título da Reunião</Label>
                        <Input
                          id="title"
                          value={meetingTitle}
                          onChange={(e) => setMeetingTitle(e.target.value)}
                          placeholder="Ex: Consulta Inicial"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição (opcional)</Label>
                        <Textarea
                          id="description"
                          value={meetingDescription}
                          onChange={(e) => setMeetingDescription(e.target.value)}
                          placeholder="Detalhes sobre a reunião..."
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                          }}
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      </div>

                      {selectedDate && (
                        <div className="grid gap-2">
                          <Label htmlFor="time">Horário Disponível</Label>
                          <RadioGroup
                            value={selectedTime}
                            onValueChange={setSelectedTime}
                          >
                            <div className="grid grid-cols-2 gap-2">
                              {getAvailableTimeSlots(selectedDate).length > 0 ? (
                                getAvailableTimeSlots(selectedDate).map((slot, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 border p-2 rounded"
                                  >
                                    <RadioGroupItem
                                      value={slot.start}
                                      id={`time-${index}`}
                                    />
                                    <Label
                                      htmlFor={`time-${index}`}
                                      className="cursor-pointer"
                                    >
                                      {slot.start} - {slot.end}
                                    </Label>
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-2 text-center py-2 text-gray-500">
                                  Nenhum horário disponível nesta data
                                </div>
                              )}
                            </div>
                          </RadioGroup>
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duração (minutos)</Label>
                        <Select
                          value={0}
                          onValueChange={(value) =>
                            setMeetingDuration(Number.parseInt(value))
                          }
                        >
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
                    <DialogFooter>
                      <Button
                        onClick={handleScheduleMeeting}
                        disabled={
                          !selectedStudent ||
                          !selectedDate ||
                          !selectedTime ||
                          !meetingTitle ||
                          !selectedPurchase
                        }
                      >
                        Agendar Reunião
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isDietDialogOpen} onOpenChange={setIsDietDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1">
                      <FileCheck className="h-4 w-4" />
                      Criar Planilha
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Nova Planilha</DialogTitle>
                      <DialogDescription>
                        Crie uma dieta e plano de treino para seu aluno.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="student">Aluno</Label>
                        <Select
                          value={selectedStudent?.id}
                          onValueChange={(value) => {
                            const student = students.find((s) => s.id === value);
                            setSelectedStudent(student || null);
                            setSelectedPurchase(null);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um aluno" />
                          </SelectTrigger>
                          <SelectContent>
                            {students
                              .filter((s) => {
                                const studentPurchases = purchases.filter(
                                  (p) =>
                                    p.buyerId === s.id &&
                                    p.status === 'WAITINGSPREADSHEET'
                                );
                                return studentPurchases.length > 0;
                              })
                              .map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name || student.email}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedStudent && (
                        <div className="grid gap-2">
                          <Label htmlFor="purchase">Compra</Label>
                          <Select
                            value={selectedPurchase?.id}
                            onValueChange={(value) => {
                              const purchase = purchases.find((p) => p.id === value);
                              setSelectedPurchase(purchase || null);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma compra" />
                            </SelectTrigger>
                            <SelectContent>
                              {purchases
                                .filter(
                                  (p) =>
                                    p.buyerId === selectedStudent.id &&
                                    p.status === 'WAITINGSPREADSHEET'
                                )
                                .map((purchase) => (
                                  <SelectItem key={purchase.id} value={purchase.id}>
                                    {purchase.Plan.name} -{' '}
                                    {format(new Date(purchase.createdAt), 'dd/MM/yyyy')}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <Separator />

                      <div className="grid gap-2">
                        <Label htmlFor="dietWeekNumber">Número da Semana (Dieta)</Label>
                        <Input
                          id="dietWeekNumber"
                          type="number"
                          min="1"
                          value={dietWeekNumber}
                          onChange={(e) =>
                            setDietWeekNumber(Number.parseInt(e.target.value))
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="dietNotes">Observações da Dieta</Label>
                        <Textarea
                          id="dietNotes"
                          value={dietNotes}
                          onChange={(e) => setDietNotes(e.target.value)}
                          placeholder="Observações sobre a dieta..."
                        />
                      </div>

                      <Separator />

                      <div className="grid gap-2">
                        <Label htmlFor="trainingWeekNumber">
                          Número da Semana (Treino)
                        </Label>
                        <Input
                          id="trainingWeekNumber"
                          type="number"
                          min="1"
                          value={trainingWeekNumber}
                          onChange={(e) =>
                            setTrainingWeekNumber(Number.parseInt(e.target.value))
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="trainingNotes">Observações do Treino</Label>
                        <Textarea
                          id="trainingNotes"
                          value={trainingNotes}
                          onChange={(e) => setTrainingNotes(e.target.value)}
                          placeholder="Observações sobre o plano de treino..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleCreateSpreadsheet}
                        disabled={!selectedStudent || !selectedPurchase}
                      >
                        Criar Planilha
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isStatusUpdateDialogOpen}
                  onOpenChange={setIsStatusUpdateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1">
                      <ArrowRight className="h-4 w-4" />
                      Atualizar Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Atualizar Status da Compra</DialogTitle>
                      <DialogDescription>
                        Atualize o status de uma compra para avançar no fluxo de trabalho.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="student">Aluno</Label>
                        <Select
                          value={selectedStudent?.id}
                          onValueChange={(value) => {
                            const student = students.find((s) => s.id === value);
                            setSelectedStudent(student || null);
                            setSelectedPurchase(null);
                            setNewStatus('');
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um aluno" />
                          </SelectTrigger>
                          <SelectContent>
                            {students
                              .filter((s) => {
                                const studentPurchases = purchases.filter(
                                  (p) =>
                                    p.buyerId === s.id &&
                                    getNextStatusOptions(p.status).length > 0
                                );
                                return studentPurchases.length > 0;
                              })
                              .map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name || student.email}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedStudent && (
                        <div className="grid gap-2">
                          <Label htmlFor="purchase">Compra</Label>
                          <Select
                            value={selectedPurchase?.id}
                            onValueChange={(value) => {
                              const purchase = purchases.find((p) => p.id === value);
                              setSelectedPurchase(purchase || null);
                              setNewStatus('');
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma compra" />
                            </SelectTrigger>
                            <SelectContent>
                              {purchases
                                .filter(
                                  (p) =>
                                    p.buyerId === selectedStudent.id &&
                                    getNextStatusOptions(p.status).length > 0
                                )
                                .map((purchase) => (
                                  <SelectItem key={purchase.id} value={purchase.id}>
                                    {purchase.Plan.name} -{' '}
                                    {getStatusInfo(purchase.status).label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {selectedPurchase && (
                        <div className="grid gap-2">
                          <Label htmlFor="newStatus">Novo Status</Label>
                          <Select
                            value={newStatus}
                            onValueChange={(value) =>
                              setNewStatus(value as PurchaseStatus)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o novo status" />
                            </SelectTrigger>
                            <SelectContent>
                              {getNextStatusOptions(selectedPurchase.status).map(
                                (status) => (
                                  <SelectItem key={status} value={status}>
                                    {getStatusInfo(status as PurchaseStatus).label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label htmlFor="statusNotes">Observações</Label>
                        <Textarea
                          id="statusNotes"
                          value={statusNotes}
                          onChange={(e) => setStatusNotes(e.target.value)}
                          placeholder="Observações sobre a mudança de status..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleUpdateStatus}
                        disabled={!selectedPurchase || !newStatus}
                      >
                        Atualizar Status
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="workflow" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Fluxo de Trabalho</CardTitle>
                  <CardDescription>
                    Gerencie o fluxo de trabalho dos seus alunos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      {Object.entries(purchasesByStatus).map(([status, purchaseList]) => (
                        <div key={status} className="space-y-4">
                          <h3 className="font-medium text-lg flex items-center gap-2">
                            {status === 'WAITINGPAYMENT' && (
                              <CreditCard className="h-5 w-5 text-amber-500" />
                            )}
                            {status === 'SCHEDULEMEETING' && (
                              <Calendar className="h-5 w-5 text-blue-500" />
                            )}
                            {status === 'SCHEDULEDMEETING' && (
                              <CalendarDays className="h-5 w-5 text-indigo-500" />
                            )}
                            {status === 'WAITINGSPREADSHEET' && (
                              <ClipboardList className="h-5 w-5 text-purple-500" />
                            )}
                            {status === 'SPREADSHEET SENT' && (
                              <FileCheck className="h-5 w-5 text-green-500" />
                            )}
                            {status === 'SCHEDULE RETURN' && (
                              <Calendar className="h-5 w-5 text-blue-500" />
                            )}
                            {status === 'FINALIZED' && (
                              <CheckCircle className="h-5 w-5 text-gray-500" />
                            )}
                            {getStatusInfo(status as PurchaseStatus).label} (
                            {purchaseList.length})
                          </h3>

                          <div className="space-y-3">
                            {purchaseList.map((purchase) => (
                              <Card key={purchase.id} className="overflow-hidden">
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-base">
                                        {purchase.student?.name ||
                                          purchase.student?.email ||
                                          'Aluno'}
                                      </CardTitle>
                                      <CardDescription>
                                        {purchase.Plan.name} -{' '}
                                        {format(
                                          new Date(purchase.createdAt),
                                          'dd/MM/yyyy'
                                        )}
                                      </CardDescription>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={getStatusInfo(purchase.status).color}
                                    >
                                      {getStatusInfo(purchase.status).label}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                  <Progress
                                    value={getProgressByStatus(purchase.status)}
                                    className="h-2 mb-2"
                                  />

                                  {/* Show relevant action buttons based on status */}
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {purchase.status === 'SCHEDULEMEETING' && (
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setSelectedStudent(purchase.student || null);
                                          setSelectedPurchase(purchase);
                                          setIsScheduleDialogOpen(true);
                                        }}
                                      >
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Agendar Reunião
                                      </Button>
                                    )}

                                    {purchase.status === 'WAITINGSPREADSHEET' && (
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setSelectedStudent(purchase.student || null);
                                          setSelectedPurchase(purchase);
                                          setIsDietDialogOpen(true);
                                        }}
                                      >
                                        <FileCheck className="h-4 w-4 mr-1" />
                                        Criar Planilha
                                      </Button>
                                    )}

                                    {purchase.status === 'SCHEDULE RETURN' && (
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setSelectedStudent(purchase.student || null);
                                          setSelectedPurchase(purchase);
                                          setIsScheduleDialogOpen(true);
                                        }}
                                      >
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Agendar Retorno
                                      </Button>
                                    )}

                                    {/* Status update button for all statuses with next options */}
                                    {getNextStatusOptions(purchase.status).length > 0 && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedStudent(purchase.student || null);
                                          setSelectedPurchase(purchase);
                                          setIsStatusUpdateDialogOpen(true);
                                        }}
                                      >
                                        <ArrowRight className="h-4 w-4 mr-1" />
                                        Atualizar Status
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}

                      {Object.keys(purchasesByStatus).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Nenhuma compra encontrada
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Tarefas Pendentes</CardTitle>
                  <CardDescription>
                    Gerencie as tarefas pendentes para seus alunos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {pendingTasks.length > 0 ? (
                      <div className="space-y-4">
                        {pendingTasks.map((task) => {
                          const relatedPurchase = task.purchaseId
                            ? purchases.find((p) => p.id === task.purchaseId)
                            : null;

                          return (
                            <div
                              key={task.id}
                              className="flex items-start p-4 border rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <Badge
                                    variant="outline"
                                    className={
                                      task.priority === 'high'
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : task.priority === 'medium'
                                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                                          : 'bg-green-50 text-green-700 border-green-200'
                                    }
                                  >
                                    {task.priority === 'high'
                                      ? 'Alta'
                                      : task.priority === 'medium'
                                        ? 'Média'
                                        : 'Baixa'}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={
                                      task.type === 'diet'
                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                        : task.type === 'training'
                                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                                          : task.type === 'meeting'
                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                            : 'bg-gray-50 text-gray-700 border-gray-200'
                                    }
                                  >
                                    {task.type === 'diet'
                                      ? 'Planilha'
                                      : task.type === 'training'
                                        ? 'Treino'
                                        : task.type === 'meeting'
                                          ? 'Reunião'
                                          : 'Outro'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  Aluno: {task.studentName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Vencimento:{' '}
                                  {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                                </p>
                                {relatedPurchase && (
                                  <p className="text-sm text-gray-500">
                                    Plano: {relatedPurchase.Plan.name}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {task.type === 'diet' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const student = students.find(
                                        (s) => s.id === task.studentId
                                      );
                                      const purchase = task.purchaseId
                                        ? purchases.find((p) => p.id === task.purchaseId)
                                        : null;
                                      setSelectedStudent(student || null);
                                      setSelectedPurchase(purchase || null);
                                      setIsDietDialogOpen(true);
                                    }}
                                  >
                                    Criar Planilha
                                  </Button>
                                )}
                                {task.type === 'meeting' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const student = students.find(
                                        (s) => s.id === task.studentId
                                      );
                                      const purchase = task.purchaseId
                                        ? purchases.find((p) => p.id === task.purchaseId)
                                        : null;
                                      setSelectedStudent(student || null);
                                      setSelectedPurchase(purchase || null);
                                      setIsScheduleDialogOpen(true);
                                    }}
                                  >
                                    Agendar
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleCompleteTask(task.id)}
                                >
                                  Concluir
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Não há tarefas pendentes
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meetings" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Reuniões Agendadas</CardTitle>
                  <CardDescription>Gerencie suas reuniões com alunos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {upcomingMeetings.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingMeetings.map((meeting) => {
                          const student = students.find(
                            (s) => s.id === meeting.studentId
                          );
                          const purchase = meeting.purchaseId
                            ? purchases.find((p) => p.id === meeting.purchaseId)
                            : null;

                          return (
                            <div
                              key={meeting.id}
                              className="flex items-start p-4 border rounded-lg"
                            >
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage
                                  src={
                                    student?.imageUrl ||
                                    '/placeholder.svg?height=40&width=40'
                                  }
                                  alt={student?.name || 'Aluno'}
                                />
                                <AvatarFallback>
                                  {(student?.name || 'Aluno')
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">
                                  {student?.name || student?.email || 'Aluno'}
                                </h4>
                                <p className="text-sm text-gray-700 mt-1">
                                  {meeting.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <p className="text-sm text-gray-500">
                                    {format(new Date(meeting.startTime), 'dd/MM/yyyy')}
                                  </p>
                                  <Clock className="h-4 w-4 text-gray-500 ml-2" />
                                  <p className="text-sm text-gray-500">
                                    {format(new Date(meeting.startTime), 'HH:mm')} -{' '}
                                    {format(new Date(meeting.endTime), 'HH:mm')}
                                  </p>
                                </div>
                                {purchase && (
                                  <div className="mt-1">
                                    <Badge
                                      variant="outline"
                                      className={getStatusInfo(purchase.status).color}
                                    >
                                      {getStatusInfo(purchase.status).label}
                                    </Badge>
                                  </div>
                                )}
                                {meeting.meetLink && (
                                  <a
                                    href={meeting.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1"
                                  >
                                    <Video className="h-4 w-4" />
                                    Link da reunião
                                  </a>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    navigate(`/student/${meeting.studentId}`)
                                  }
                                >
                                  Ver Aluno
                                </Button>
                                {meeting.meetLink && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() =>
                                      window.open(meeting.meetLink, '_blank')
                                    }
                                  >
                                    Entrar
                                  </Button>
                                )}
                                {purchase && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedStudent(student || null);
                                      setSelectedPurchase(purchase);
                                      setIsStatusUpdateDialogOpen(true);
                                    }}
                                  >
                                    Atualizar Status
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Não há reuniões agendadas
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
