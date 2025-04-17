'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Clock,
  Search,
  XCircle,
  Calendar,
  CreditCard,
  User,
  ChevronRight,
  Briefcase,
  DollarSign,
  RefreshCcw,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ContainerContent } from '@/components/Container'
import LoadingSpinner from '@/components/LoadingSpinner'
import useUser from '@/hooks/user-hooks'
import { usePurchases } from '@/hooks/purchase-hooks'
import type { Purchase } from '@/types/PurchaseType'
import { formatDate } from '@/static'

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[] | null>(null)
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const { getUserPurchases, cancelPurchase, retryPayment } = usePurchases()

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [purchaseToCancel, setPurchaseToCancel] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelLoading, setCancelLoading] = useState(false)

  const [retryDialogOpen, setRetryDialogOpen] = useState(false)
  const [purchaseToRetry, setPurchaseToRetry] = useState<Purchase | null>(null)
  const [retryLoading, setRetryLoading] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const data = await getUserPurchases()
        setPurchases(data)
        setFilteredPurchases(data)
      } catch (error) {
        console.error('Error fetching purchases:', error)
        toast.error('Falha ao carregar compras')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPurchases()
  }, [user, getUserPurchases])

  useEffect(() => {
    if (!purchases) return

    let result = [...purchases]

    if (statusFilter !== 'all') {
      result = result.filter((purchase) => purchase.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (purchase) =>
          purchase.Plan.name?.toLowerCase().includes(query) ||
          purchase.professional?.name?.toLowerCase().includes(query) ||
          purchase.paymentMethod?.toLowerCase().includes(query)
      )
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()

      if (sortBy === 'newest') {
        return dateB - dateA
      } else if (sortBy === 'oldest') {
        return dateA - dateB
      } else if (sortBy === 'price-high') {
        return b.amount - a.amount
      } else if (sortBy === 'price-low') {
        return a.amount - b.amount
      }
      return 0
    })

    setFilteredPurchases(result)
  }, [purchases, searchQuery, statusFilter, sortBy])

  const openCancelDialog = (purchaseId: string) => {
    setPurchaseToCancel(purchaseId)
    setCancelReason('')
    setCancelDialogOpen(true)
  }

  const handleCancelPurchase = async () => {
    if (!purchaseToCancel || !cancelReason.trim()) return

    setCancelLoading(true)
    const success = await cancelPurchase(purchaseToCancel, cancelReason)
    setCancelLoading(false)

    if (success) {
      setPurchases(
        (prev) =>
          prev?.map((purchase) =>
            purchase.id === purchaseToCancel
              ? { ...purchase, status: 'CANCELLED', cancelReason }
              : purchase
          ) || null
      )
      setCancelDialogOpen(false)
      toast.success('Compra cancelada com sucesso')
    }
  }

  const openRetryDialog = (purchase: Purchase) => {
    setSelectedPaymentMethod(purchase.paymentMethod || 'credit_card')
    setRetryDialogOpen(true)
  }

  const handleRetryPayment = async (purchase: Purchase) => {
    console.log(purchase)
    if (!purchase) return

    setRetryLoading(true)
    try {
      const successUrl = `${window.location.origin}/purchase-success/${purchase.professionalId}/${purchase.planId}`
      const cancelUrl = `${window.location.origin}/purchase-cancel`

      const result = await retryPayment(
        purchase.id,
        selectedPaymentMethod,
        successUrl,
        cancelUrl
      )

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl
      } else {
        throw new Error('Falha ao processar pagamento')
      }
    } catch (error) {
      console.error('Error retrying payment:', error)
      toast.error('Falha ao processar pagamento')
    } finally {
      setRetryLoading(false)
      setRetryDialogOpen(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Concluído
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pendente
          </Badge>
        )
      case 'CANCELLED':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelado</Badge>
        )
      case 'REFUNDED':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Reembolsado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodLabel = (method?: string) => {
    if (!method) return 'Não informado'

    const methods: Record<string, string> = {
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      pix: 'PIX',
      bank_transfer: 'Transferência Bancária',
      mobile_payment: 'Pagamento por Celular',
      wallet: 'Carteira Digital',
    }

    return methods[method] || method
  }

  const getPaymentIcon = (method?: string) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />
      case 'pix':
        return <DollarSign className="h-4 w-4" />
      case 'bank_transfer':
        return <Briefcase className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getStatusCount = (status: string) => {
    if (!purchases) return 0
    if (status === 'all') return purchases.length
    return purchases.filter((purchase) => purchase.status === status).length
  }

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Minhas Compras</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as suas compras de planos profissionais.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="mb-2 sm:mb-0">
              <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
                Todas ({getStatusCount('all')})
              </TabsTrigger>
              <TabsTrigger value="PENDING" onClick={() => setStatusFilter('PENDING')}>
                Pendentes ({getStatusCount('PENDING')})
              </TabsTrigger>
              <TabsTrigger value="COMPLETED" onClick={() => setStatusFilter('COMPLETED')}>
                Concluídas ({getStatusCount('COMPLETED')})
              </TabsTrigger>
              <TabsTrigger value="CANCELLED" onClick={() => setStatusFilter('CANCELLED')}>
                Canceladas ({getStatusCount('CANCELLED')})
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar compras..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigas</SelectItem>
                  <SelectItem value="price-high">Maior valor</SelectItem>
                  <SelectItem value="price-low">Menor valor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            {renderPurchasesList()}
          </TabsContent>
          <TabsContent value="PENDING" className="mt-0">
            {renderPurchasesList()}
          </TabsContent>
          <TabsContent value="COMPLETED" className="mt-0">
            {renderPurchasesList()}
          </TabsContent>
          <TabsContent value="CANCELLED" className="mt-0">
            {renderPurchasesList()}
          </TabsContent>
        </Tabs>
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
    </>
  )

  function renderPurchasesList() {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      )
    }

    if (!filteredPurchases || filteredPurchases.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhuma compra encontrada</h3>
          <p className="text-muted-foreground mt-1 mb-4 max-w-md">
            {searchQuery || statusFilter !== 'all'
              ? 'Tente ajustar seus filtros para encontrar o que está procurando.'
              : 'Você ainda não realizou nenhuma compra. Explore nossos profissionais e planos disponíveis.'}
          </p>
          <Button asChild>
            <Link to="/professional">Explorar Profissionais</Link>
          </Button>
        </div>
      )
    }

    return (
      <ContainerContent>
        {filteredPurchases.map((purchase) => (
          <Card key={purchase.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-xl">{purchase.Plan.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {purchase.Plan.description || 'Sem descrição'}
                  </CardDescription>
                </div>
                {getStatusBadge(purchase.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Valor:</span>
                    <span className="text-base font-semibold">
                      R$ {purchase.amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Data da compra:</span>
                    <span>{formatDate(purchase.createdAt)}</span>
                  </div>

                  {purchase.paymentMethod && (
                    <div className="flex items-center gap-2 text-sm">
                      {getPaymentIcon(purchase.paymentMethod)}
                      <span className="font-medium">Forma de pagamento:</span>
                      <span>{getPaymentMethodLabel(purchase.paymentMethod)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Profissional:</span>
                    <span>{purchase.professional?.name || 'Não informado'}</span>
                  </div>

                  {purchase.professional?.role && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Especialidade:</span>
                      <span>
                        {purchase.professional.role === 'NUTRITIONIST'
                          ? 'Nutricionista'
                          : purchase.professional.role === 'TRAINER'
                            ? 'Personal Trainer'
                            : purchase.professional.role}
                      </span>
                    </div>
                  )}

                  {purchase.relationship?.status && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Status do relacionamento:</span>
                      <span>
                        {purchase.relationship.status === 'PENDING'
                          ? 'Pendente'
                          : purchase.relationship.status === 'ACTIVE'
                            ? 'Ativo'
                            : purchase.relationship.status === 'INACTIVE'
                              ? 'Inativo'
                              : purchase.relationship.status}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between h-full">
                  {purchase.cancelReason && (
                    <div className="text-sm bg-red-50 p-3 rounded-md mb-3">
                      <p className="font-medium text-red-800">Motivo do cancelamento:</p>
                      <p className="text-red-700">{purchase.cancelReason}</p>
                      {purchase.cancelComment && (
                        <p className="text-red-700 mt-1">{purchase.cancelComment}</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      asChild
                    >
                      <Link to={`/purchases/${purchase.id}`}>
                        Ver detalhes
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>

                    {purchase.status === 'WAITINGPAYMENT' && (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => openCancelDialog(purchase.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Cancelar compra
                        </Button>

                        <Button
                          variant="default"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => handleRetryPayment(purchase)}
                        >
                          <RefreshCcw className="mr-1 h-4 w-4" />
                          Refazer pagamento
                        </Button>
                      </>
                    )}

                    {purchase.status === 'COMPLETED' &&
                      purchase.relationship?.status === 'ACTIVE' && (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full sm:w-auto"
                          asChild
                        >
                          <Link to={'/dashboard'}>
                            Acessar serviços
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </ContainerContent>
    )
  }
}
