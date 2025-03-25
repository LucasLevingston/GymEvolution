import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  DollarSign,
  Calendar,
  Package,
  ShoppingCart,
  CreditCard,
  Landmark,
  QrCode,
  Smartphone,
  Wallet,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ContainerRoot } from '@/components/Container';
import { usePlans, type Plan } from '@/hooks/use-plans';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNotifications } from '@/components/notifications/NotificationProvider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { usePurchases } from '@/hooks/purchase-hooks';
import useUser from '@/hooks/user-hooks';

export default function ProfessionalPlans() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { getPlansByProfessionalId, deactivatePlan, isLoading } = usePlans();
  const { createPurchase, isLoading: isLoadingPayment } = usePurchases();
  const { addNotification } = useNotifications();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planToDeactivate, setPlanToDeactivate] = useState<string | null>(null);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('pix');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const isOwner = user?.id === id;

  useEffect(() => {
    const fetchPlans = async () => {
      if (!id) return;

      const data = await getPlansByProfessionalId(id);
      setPlans(data);
    };

    fetchPlans();
  }, [id, getPlansByProfessionalId]);

  useEffect(() => {
    if (selectedPlanId) {
      const plan = plans.find((p) => p.id === selectedPlanId) || null;
      setSelectedPlan(plan);
    }
  }, [selectedPlanId, plans]);

  const handleDeactivatePlan = async (planId: string) => {
    if (!isOwner) return;

    setPlanToDeactivate(planId);
    setDialogOpen(true);
  };

  const confirmDeactivation = async () => {
    if (!planToDeactivate) return;

    const result = await deactivatePlan(planToDeactivate);
    if (result) {
      setPlans(
        plans.map((plan) =>
          plan.id === planToDeactivate ? { ...plan, isActive: false } : plan
        )
      );
      toast.success('Plano desativado com sucesso');
    }

    setDialogOpen(false);
    setPlanToDeactivate(null);
  };

  const handlePurchase = async (planId: string) => {
    if (!user) {
      toast.error('Por favor, faça login para contratar um profissional');
      addNotification({
        title: 'Autenticação Necessária',
        message: 'Por favor, faça login para contratar um profissional',
        type: 'info',
      });
      navigate('/login');
      return;
    }

    setSelectedPlanId(planId);
    setPaymentDialogOpen(true);
  };

  const processPayment = async () => {
    if (!selectedPlanId) return;

    try {
      setLoading(true);

      const successUrl = `${window.location.origin}/purchase-success/${id}/${selectedPlanId}`;
      const cancelUrl = `${window.location.origin}/purchase-cancel`;

      const paymentResult = await createPurchase({
        planId: selectedPlanId,
        successUrl,
        cancelUrl,
        paymentMethod: selectedPaymentMethod,
        amount: selectedPlan?.price!,
        professonalId: selectedPlan?.professionalId!,
      });

      if (paymentResult) {
        window.location.href = paymentResult.paymentUrl;
      } else {
        throw new Error('Falha ao criar pagamento');
      }
    } catch (error) {
      console.error('Error purchasing plan:', error);
      toast.error('Falha ao processar pagamento');
      addNotification({
        title: 'Pagamento Falhou',
        message:
          'Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.',
        type: 'error',
      });
      setPaymentDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'debit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'bank_transfer':
        return <Landmark className="h-5 w-5" />;
      case 'pix':
        return <QrCode className="h-5 w-5" />;
      case 'mobile_payment':
        return <Smartphone className="h-5 w-5" />;
      case 'wallet':
        return <Wallet className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isOwner ? 'Meus Planos' : 'Planos Disponíveis'}
          </h1>
          <p className="text-muted-foreground">
            {isOwner
              ? 'Gerencie os planos que você oferece aos seus clientes'
              : 'Escolha um plano que melhor atenda às suas necessidades'}
          </p>
        </div>
        {isOwner && (
          <Button asChild>
            <Link to="/create-plan">
              <Plus className="mr-2 h-4 w-4" />
              Criar Novo Plano
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Nenhum plano encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {isOwner
                ? 'Você ainda não criou nenhum plano para oferecer aos seus clientes.'
                : 'Este profissional ainda não criou nenhum plano.'}
            </p>
            {isOwner && (
              <Button asChild>
                <Link to="/create-plan">Criar Meu Primeiro Plano</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={!plan.isActive ? 'opacity-70' : ''}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.isActive ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      Inativo
                    </Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">R$ {plan.price.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Duração: {plan.duration} dias</span>
                </div>

                <Separator className="my-4" />

                <h4 className="font-medium mb-2">Recursos incluídos:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isOwner ? (
                  <>
                    <Button variant="outline" asChild>
                      <Link to={`/edit-plan/${plan.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    {plan.isActive && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeactivatePlan(plan.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Desativar
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handlePurchase(plan.id)}
                    disabled={loading || isLoadingPayment || !plan.isActive}
                  >
                    {loading || isLoadingPayment ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Contratar Plano
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Deactivation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desativar Plano</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja desativar este plano? Isso não afetará os clientes
              existentes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeactivation}>
              Sim, Desativar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Options Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escolha a forma de pagamento</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <div className="mt-2">
                  <p className="font-medium">{selectedPlan.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPlan.description}
                  </p>
                  <p className="text-lg font-bold mt-2">
                    R$ {selectedPlan.price.toFixed(2)}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex items-center cursor-pointer">
                  <CreditCard className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Cartão de Crédito</p>
                    <p className="text-xs text-muted-foreground">
                      Visa, Mastercard, Elo, American Express
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="debit_card" id="debit_card" />
                <Label htmlFor="debit_card" className="flex items-center cursor-pointer">
                  <CreditCard className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Cartão de Débito</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, Elo</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex items-center cursor-pointer">
                  <QrCode className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">PIX</p>
                    <p className="text-xs text-muted-foreground">Pagamento instantâneo</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label
                  htmlFor="bank_transfer"
                  className="flex items-center cursor-pointer"
                >
                  <Landmark className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Transferência Bancária</p>
                    <p className="text-xs text-muted-foreground">TED, DOC</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="mobile_payment" id="mobile_payment" />
                <Label
                  htmlFor="mobile_payment"
                  className="flex items-center cursor-pointer"
                >
                  <Smartphone className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Pagamento por Celular</p>
                    <p className="text-xs text-muted-foreground">
                      Google Pay, Apple Pay, Samsung Pay
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                  <Wallet className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Carteira Digital</p>
                    <p className="text-xs text-muted-foreground">
                      PicPay, Mercado Pago, PagBank
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
              className="mb-2 sm:mb-0"
            >
              Cancelar
            </Button>
            <Button
              onClick={processPayment}
              disabled={loading || isLoadingPayment}
              className="w-full sm:w-auto"
            >
              {loading || isLoadingPayment ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
    </>
  );
}
