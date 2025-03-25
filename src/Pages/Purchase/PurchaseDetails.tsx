'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Info,
  MessageSquare,
  Package,
  Receipt,
  RefreshCcw,
  User,
  UserCheck,
  Video,
  X,
  XCircle,
  ClipboardList,
  CalendarDays,
} from 'lucide-react';

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
import { ContainerRoot } from '@/components/Container';
import LoadingSpinner from '@/components/LoadingSpinner';
import { usePurchases } from '@/hooks/purchase-hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import type { Purchase } from '@/types/PurchaseType';
import { formatDate } from '@/estatico';
import { getRelativeTime } from '@/lib/utils/relativeTime';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@/hooks/user-hooks';

// Purchase status enum
const purchaseStatusEnum = [
  'WAITINGPAYMENT',
  'SCHEDULEMEETING',
  'SCHEDULEDMEETING',
  'WAITINGSPREADSHEET',
  'SPREADSHEET SENT',
  'SCHEDULE RETURN',
  'FINALIZED',
] as const;

type PurchaseStatus = (typeof purchaseStatusEnum)[number];

// Helper function to get status label and color
const getStatusInfo = (status: string) => {
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
    case 'PENDING':
      return {
        label: 'Pendente',
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      };
    case 'COMPLETED':
      return { label: 'Concluído', color: 'bg-green-50 text-green-700 border-green-200' };
    case 'CANCELLED':
      return { label: 'Cancelado', color: 'bg-red-50 text-red-700 border-red-200' };
    case 'REFUNDED':
      return { label: 'Reembolsado', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    default:
      return { label: status, color: 'bg-gray-50 text-gray-700 border-gray-200' };
  }
};

// Helper function to get progress percentage based on status
const getProgressByStatus = (status: string) => {
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

export default function PurchaseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPurchaseById, cancelPurchase, retryPayment, isLoading } = usePurchases();
  const { user } = useUser();
  const [purchase, setPurchase] = useState<Purchase | null>(null);

  const [cancelReason, setCancelReason] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [retryDialogOpen, setRetryDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [retryLoading, setRetryLoading] = useState(false);

  // Schedule meeting dialog state
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState(30);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    { start: string; end: string }[]
  >([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    const fetchPurchase = async () => {
      if (!id) return;
      const data = await getPurchaseById(id);
      setPurchase(data);
      if (data?.paymentMethod) {
        setSelectedPaymentMethod(data.paymentMethod);
      } else {
        setSelectedPaymentMethod('credit_card');
      }
    };

    fetchPurchase();
  }, [id, getPurchaseById]);

  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (!selectedDate || !purchase?.professionalId) return;

      try {
        const response = await fetch(
          `/api/professionals/${purchase.professionalId}/availability?date=${selectedDate}`
        );
        const data = await response.json();

        if (data.slots) {
          setAvailableTimeSlots(data.slots);
        } else {
          setAvailableTimeSlots([]);
        }
      } catch (error) {
        console.error('Error fetching available time slots:', error);
        setAvailableTimeSlots([]);
      }
    };

    fetchAvailableTimeSlots();
  }, [selectedDate, purchase?.professionalId]);

  const handleCancelPurchase = async () => {
    if (!purchase || !cancelReason.trim()) return;

    setCancelLoading(true);
    const success = await cancelPurchase(purchase.id, cancelReason);
    setCancelLoading(false);

    if (success) {
      setPurchase((prev) =>
        prev ? { ...prev, paymentStatus: 'CANCELLED', cancelReason } : null
      );
      setCancelDialogOpen(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!purchase) return;

    setRetryLoading(true);
    try {
      const successUrl = `${window.location.origin}/purchase-success/${purchase.professionalId}/${purchase.planId}`;
      const cancelUrl = `${window.location.origin}/purchase-cancel`;

      const result = await retryPayment(
        purchase.id,
        selectedPaymentMethod,
        successUrl,
        cancelUrl
      );

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        throw new Error('Falha ao processar pagamento');
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
    } finally {
      setRetryLoading(false);
      setRetryDialogOpen(false);
    }
  };

  // Handle scheduling a meeting
  const handleScheduleMeeting = async () => {
    if (!purchase || !selectedDate || !selectedTime || !meetingTitle) {
      return;
    }

    setScheduleLoading(true);
    try {
      const startTime = new Date(`${selectedDate}T${selectedTime}`);
      const endTime = new Date(startTime.getTime() + meetingDuration * 60000);

      // Create meeting in database
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
          professionalId: purchase.professionalId,
          purchaseId: purchase.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to schedule meeting');
      }

      // Update purchase status to SCHEDULEDMEETING
      const statusResponse = await fetch(`/api/purchases/${purchase.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'SCHEDULEDMEETING',
          notes: 'Reunião agendada pelo aluno',
        }),
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to update purchase status');
      }

      // Update purchase in state
      setPurchase((prev) =>
        prev ? { ...prev, status: 'SCHEDULEDMEETING' as PurchaseStatus } : null
      );

      setScheduleDialogOpen(false);

      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setMeetingTitle('');
      setMeetingDescription('');

      // Show success message or redirect
      navigate(`/meetings/${data.id}`);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    } finally {
      setScheduleLoading(false);
    }
  };

  // Handle viewing spreadsheet
  const handleViewSpreadsheet = () => {
    if (!purchase) return;
    navigate(`/spreadsheet/${purchase.id}`);
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = getStatusInfo(status);
    return (
      <Badge variant="outline" className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method?: string) => {
    if (!method) return 'Não informado';

    const methods: Record<string, string> = {
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      pix: 'PIX',
      bank_transfer: 'Transferência Bancária',
      mobile_payment: 'Pagamento por Celular',
      wallet: 'Carteira Digital',
    };

    return methods[method] || method;
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'pix':
        return <Receipt className="h-4 w-4" />;
      case 'bank_transfer':
        return <DollarSign className="h-4 w-4" />;
      case 'mobile_payment':
      case 'wallet':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Get action button based on purchase status for student
  const getStudentActionButton = (status: string) => {
    switch (status) {
      case 'SCHEDULEMEETING':
        return (
          <Button
            onClick={() => navigate(`/schedule-meeting/${purchase?.professionalId}`)}
            className="gap-1"
          >
            <Calendar className="h-4 w-4" />
            Agendar Reunião
          </Button>
        );
      case 'SCHEDULEDMEETING':
        return (
          <Button
            onClick={() => navigate(`/meetings/${purchase?.meetingId || ''}`)}
            className="gap-1"
          >
            <Video className="h-4 w-4" />
            Ver Detalhes da Reunião
          </Button>
        );
      case 'SPREADSHEET SENT':
        return (
          <Button onClick={handleViewSpreadsheet} className="gap-1">
            <FileText className="h-4 w-4" />
            Ver Planilha
          </Button>
        );
      case 'SCHEDULE RETURN':
        return (
          <Button onClick={() => setScheduleDialogOpen(true)} className="gap-1">
            <Calendar className="h-4 w-4" />
            Agendar Retorno
          </Button>
        );
      default:
        return null;
    }
  };

  // Get professional action needed based on status
  const getProfessionalActionNeeded = (status: string) => {
    switch (status) {
      case 'SCHEDULEMEETING':
        return {
          message: 'Aguardando agendamento pelo aluno',
          icon: <Calendar className="h-5 w-5 text-blue-500" />,
        };
      case 'SCHEDULEDMEETING':
        return {
          message: 'Reunião agendada - prepare-se',
          icon: <Video className="h-5 w-5 text-indigo-500" />,
        };
      case 'WAITINGSPREADSHEET':
        return {
          message: 'Criar planilha para o aluno',
          icon: <ClipboardList className="h-5 w-5 text-purple-500" />,
        };
      case 'SPREADSHEET SENT':
        return {
          message: 'Planilha enviada - aguardando retorno',
          icon: <FileText className="h-5 w-5 text-green-500" />,
        };
      case 'SCHEDULE RETURN':
        return {
          message: 'Aguardando agendamento de retorno',
          icon: <CalendarDays className="h-5 w-5 text-blue-500" />,
        };
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <ContainerRoot>
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </ContainerRoot>
    );
  }

  if (!purchase) {
    return (
      <ContainerRoot>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Compra não encontrada</h2>
          <p className="text-muted-foreground mb-8">
            Não foi possível encontrar os detalhes desta compra.
          </p>
          <Button asChild>
            <Link to="/purchases">Voltar para Compras</Link>
          </Button>
        </div>
      </ContainerRoot>
    );
  }

  const planFeatures = purchase.Plan?.features ? JSON.parse(purchase.Plan.features) : [];
  const isProfessional = user?.role === 'PROFESSIONAL';
  const isStudent = user?.role === 'STUDENT';
  const actionNeeded = getProfessionalActionNeeded(purchase.status);

  return (
    <>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0"
          onClick={() => navigate('/purchases')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Compras
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Detalhes da Compra</h1>
            <p className="text-muted-foreground">
              {purchase.Plan.name} • {formatDate(purchase.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(purchase.paymentStatus)}
            {purchase.paymentStatus === 'PENDING' && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar Compra
                </Button>
                <Button variant="default" onClick={() => setRetryDialogOpen(true)}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refazer Pagamento
                </Button>
              </>
            )}
            {purchase.paymentStatus === 'COMPLETED' &&
              purchase.relationship?.status === 'ACTIVE' && (
                <Button asChild>
                  <Link to={`/professional/${purchase.professionalId}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Acessar Serviços
                  </Link>
                </Button>
              )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Purchase Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Compra</CardTitle>
              <CardDescription>Informações gerais sobre sua compra</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status and Progress */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                  Status do Atendimento
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {getStatusInfo(purchase.status).label}
                    </span>
                    {getStatusBadge(purchase.status)}
                  </div>

                  <div className="mt-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Início</span>
                        <span>Conclusão</span>
                      </div>
                      <Progress
                        value={getProgressByStatus(purchase.status)}
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Action buttons based on status */}
                  {isStudent && (
                    <div className="mt-4">{getStudentActionButton(purchase.status)}</div>
                  )}

                  {/* Professional action needed */}
                  {isProfessional && actionNeeded && (
                    <div className="mt-4 flex items-center p-3 bg-muted rounded-lg">
                      {actionNeeded.icon}
                      <span className="ml-2 font-medium">{actionNeeded.message}</span>

                      {purchase.status === 'WAITINGSPREADSHEET' && (
                        <Button
                          className="ml-auto"
                          onClick={() =>
                            navigate(`/professional/spreadsheet/create/${purchase.id}`)
                          }
                        >
                          <ClipboardList className="mr-2 h-4 w-4" />
                          Criar Planilha
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Details */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Package className="mr-2 h-5 w-5 text-primary" />
                  Plano Adquirido
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg">{purchase.Plan.name}</h4>
                  <p className="text-muted-foreground mt-1">
                    {purchase.Plan.description || 'Sem descrição disponível'}
                  </p>

                  {purchase.Plan?.duration && (
                    <div className="flex items-center mt-3 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Duração: {purchase.Plan.duration} dias</span>
                    </div>
                  )}

                  {planFeatures.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Recursos incluídos:</h5>
                      <ul className="space-y-1">
                        {planFeatures.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {purchase.professional && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    Profissional
                  </h3>
                  <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                    <Avatar className="h-12 w-12 mr-4">
                      {/* <AvatarImage src={purchase.professional.imageUrl} /> */}
                      <AvatarFallback>
                        {getInitials(purchase.professional.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">
                        {purchase.professional.name || 'Nome não disponível'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {purchase.professional.email}
                      </p>
                      <p className="text-sm mt-1">
                        <Badge variant="outline" className="font-normal">
                          {purchase.professional.role === 'NUTRITIONIST'
                            ? 'Nutricionista'
                            : 'Personal Trainer'}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Relationship Status */}
              {purchase.relationship && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <UserCheck className="mr-2 h-5 w-5 text-primary" />
                    Status do Relacionamento
                  </h3>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {purchase.relationship.status === 'PENDING' &&
                          'Aguardando Aprovação'}
                        {purchase.relationship.status === 'ACTIVE' && 'Ativo'}
                        {purchase.relationship.status === 'COMPLETED' && 'Concluído'}
                        {purchase.relationship.status === 'CANCELLED' && 'Cancelado'}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          purchase.relationship.status === 'ACTIVE'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : purchase.relationship.status === 'PENDING'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-muted'
                        }
                      >
                        {purchase.relationship.status}
                      </Badge>
                    </div>

                    {purchase.relationship.status === 'PENDING' && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-2">
                          O profissional precisa aprovar sua solicitação para iniciar o
                          atendimento.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Solicitação enviada</span>
                            <span>Aprovação pendente</span>
                          </div>
                          <Progress value={50} className="h-2" />
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground mt-2">
                      Criado em {formatDate(purchase.relationship.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Cancellation Info */}
              {purchase.paymentStatus === 'CANCELLED' && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <XCircle className="mr-2 h-5 w-5 text-red-500" />
                    Informações de Cancelamento
                  </h3>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <p className="font-medium text-red-700 mb-2">
                      Motivo do cancelamento:
                    </p>
                    <p className="text-red-600">
                      {purchase.cancelReason || 'Não informado'}
                    </p>

                    {purchase.cancelComment && (
                      <div className="mt-3">
                        <p className="font-medium text-red-700 mb-1">
                          Comentário adicional:
                        </p>
                        <p className="text-red-600">{purchase.cancelComment}</p>
                      </div>
                    )}

                    {purchase.cancelledAt && (
                      <p className="text-sm text-red-500 mt-3">
                        Cancelado em {formatDate(purchase.cancelledAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-medium">R$ {purchase.amount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Status</span>
                <span>{getStatusBadge(purchase.status)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Método de Pagamento</span>
                <span className="flex items-center">
                  {getPaymentMethodIcon(purchase.paymentMethod)}
                  <span className="ml-2">
                    {getPaymentMethodLabel(purchase.paymentMethod)}
                  </span>
                </span>
              </div>

              {purchase.paymentId && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">ID do Pagamento</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                          {purchase.paymentId.substring(0, 8)}...
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{purchase.paymentId}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Data da Compra</span>
                <span>{formatDate(purchase.createdAt)}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Última Atualização</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{getRelativeTime(purchase.updatedAt)}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{formatDate(purchase.updatedAt)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>

          {/* Purchase ID Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">ID da Compra</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {purchase.id.substring(0, 8)}...
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{purchase.id}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {purchase.relationshipId && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">ID do Relacionamento</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                          {purchase.relationshipId.substring(0, 8)}...
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{purchase.relationshipId}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/support/purchase/${purchase.id}`}>
                  <Info className="mr-2 h-4 w-4" />
                  Precisa de ajuda?
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Compra</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar esta compra? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Motivo do cancelamento</h4>
              <Textarea
                placeholder="Por favor, informe o motivo do cancelamento"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelLoading}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelPurchase}
              disabled={!cancelReason.trim() || cancelLoading}
            >
              {cancelLoading ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Confirmar Cancelamento
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Retry Payment Dialog */}
      <Dialog open={retryDialogOpen} onOpenChange={setRetryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Refazer Pagamento</DialogTitle>
            <DialogDescription>
              {purchase && (
                <div className="mt-2">
                  <p className="font-medium">{purchase.Plan?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {purchase.Plan?.description}
                  </p>
                  <p className="text-lg font-bold mt-2">
                    R$ {purchase.amount.toFixed(2)}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-3">
              <h4 className="font-medium">Escolha a forma de pagamento</h4>

              <Select
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                  <SelectItem value="mobile_payment">Pagamento por Celular</SelectItem>
                  <SelectItem value="wallet">Carteira Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setRetryDialogOpen(false)}
              className="mb-2 sm:mb-0"
              disabled={retryLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRetryPayment}
              disabled={retryLoading || !selectedPaymentMethod}
              className="w-full sm:w-auto"
            >
              {retryLoading ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {getPaymentMethodIcon(selectedPaymentMethod)}
                  <span className="ml-2">Continuar para Pagamento</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Reunião</DialogTitle>
            <DialogDescription>
              Agende uma reunião com seu profissional para discutir seu plano.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {selectedDate && (
              <div className="space-y-2">
                <Label htmlFor="time">Horário Disponível</Label>
                <RadioGroup value={selectedTime} onValueChange={setSelectedTime}>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 border p-2 rounded"
                        >
                          <RadioGroupItem value={slot.start} id={`time-${index}`} />
                          <Label htmlFor={`time-${index}`} className="cursor-pointer">
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

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Select
                value={meetingDuration.toString()}
                onValueChange={(value) => setMeetingDuration(Number.parseInt(value))}
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
              variant="outline"
              onClick={() => setScheduleDialogOpen(false)}
              disabled={scheduleLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleScheduleMeeting}
              disabled={
                scheduleLoading || !selectedDate || !selectedTime || !meetingTitle
              }
            >
              {scheduleLoading ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Reunião
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
