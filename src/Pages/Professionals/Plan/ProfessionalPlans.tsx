'use client'

import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
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
  Dumbbell,
  Utensils,
  MessageSquare,
  Video,
  RotateCcw,
  LinkIcon,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ContainerRoot } from '@/components/Container'
import { usePlans } from '@/hooks/use-plans'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useNotifications } from '@/components/notifications/NotificationProvider'

import { usePurchases } from '@/hooks/purchase-hooks'
import useUser from '@/hooks/user-hooks'
import { FeatureType, type Feature, type Plan } from '@/types/PlanType'
import { checkIsProfessional } from '@/lib/utils/checkIsProfessional'

export default function ProfessionalPlans() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const { getPlansByProfessionalId, deactivatePlan, isLoading } = usePlans()
  const { createPurchase, isLoading: isLoadingPayment } = usePurchases()
  const { addNotification } = useNotifications()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [planToDeactivate, setPlanToDeactivate] = useState<string | null>(null)

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const isOwner =
    user?.id === id ||
    (plans.length > 0 && plans[0].professionalId === user?.id) ||
    (checkIsProfessional(user) && !id)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        let data: Plan[]
        if (!id && user?.id) {
          data = user.plans
          setPlans(data)
        } else if (id) {
          data = await getPlansByProfessionalId(id)
          setPlans(data)
        }
      } catch (error) {
        console.error('Error fetching plans:', error)
        toast.error('Falha ao carregar planos')
      }
    }

    fetchPlans()
  }, [id, getPlansByProfessionalId, user?.id])

  useEffect(() => {
    if (selectedPlanId) {
      const plan = plans.find((p) => p.id === selectedPlanId) || null
      setSelectedPlan(plan)
    }
  }, [selectedPlanId, plans])

  const handleDeactivatePlan = async (planId: string) => {
    if (!isOwner) return

    setPlanToDeactivate(planId)
    setDialogOpen(true)
  }

  const confirmDeactivation = async () => {
    if (!planToDeactivate) return

    const result = await deactivatePlan(planToDeactivate)
    if (result) {
      setPlans(
        plans.map((plan) =>
          plan.id === planToDeactivate ? { ...plan, isActive: false } : plan
        )
      )
      toast.success('Plano desativado com sucesso')
    }

    setDialogOpen(false)
    setPlanToDeactivate(null)
  }

  const processPayment = async () => {
    if (!selectedPlanId) return

    try {
      setLoading(true)

      const successUrl = `${window.location.origin}/purchase-success/${id}/${selectedPlanId}`
      const cancelUrl = `${window.location.origin}/purchase-cancel`

      const paymentResult = await createPurchase({
        planId: selectedPlanId,
        successUrl,
        cancelUrl,
        paymentMethod: 'mercadopago',
        amount: selectedPlan?.price!,
        professonalId: selectedPlan?.professionalId!,
      })

      if (paymentResult) {
        window.location.href = paymentResult.paymentUrl
      } else {
        throw new Error('Falha ao criar pagamento')
      }
    } catch (error) {
      console.error('Error purchasing plan:', error)
      toast.error('Falha ao processar pagamento')
      addNotification({
        title: 'Pagamento Falhou',
        message:
          'Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const getFeatureIcon = (feature: Feature) => {
    if (feature.type === FeatureType.TRAINING_WEEK)
      return <Dumbbell className="h-4 w-4 text-green-500 mt-0.5" />
    if (feature.type === FeatureType.DIET)
      return <Utensils className="h-4 w-4 text-green-500 mt-0.5" />
    if (feature.type === FeatureType.FEEDBACK)
      return <MessageSquare className="h-4 w-4 text-green-500 mt-0.5" />
    if (feature.type === FeatureType.CONSULTATION)
      return <Video className="h-4 w-4 text-green-500 mt-0.5" />
    if (feature.type === FeatureType.RETURN)
      return <RotateCcw className="h-4 w-4 text-green-500 mt-0.5" />
    if (feature.type === FeatureType.MATERIALS)
      return <LinkIcon className="h-4 w-4 text-green-500 mt-0.5" />
    return <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-5 w-5" />
      case 'debit_card':
        return <CreditCard className="h-5 w-5" />
      case 'bank_transfer':
        return <Landmark className="h-5 w-5" />
      case 'pix':
        return <QrCode className="h-5 w-5" />
      case 'mobile_payment':
        return <Smartphone className="h-5 w-5" />
      case 'wallet':
        return <Wallet className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

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
    )
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
            <Link to="/professional/create-plan">
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
                <Link to="/professional/create-plan">Criar Meu Primeiro Plano</Link>
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
                  {plan.features?.length > 0 ? (
                    plan.features.map((feature) => (
                      <li key={feature.id} className="flex items-start gap-2">
                        {getFeatureIcon(feature)}
                        <span className="text-sm">{feature.name}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">Nenhuma feature disponível.</li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isOwner ? (
                  <>
                    <Button variant="outline" asChild>
                      <Link to={`/professional/edit-plan/${plan.id}`}>
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
                    onClick={processPayment}
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
    </>
  )
}
