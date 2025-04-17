'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Download,
  Search,
  Filter,
  ChevronDown,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useUser from '@/hooks/user-hooks'
import { useProfessionals } from '@/hooks/professional-hooks'
import { usePurchases } from '@/hooks/purchase-hooks'
import { Purchase } from '@/types/PurchaseType'
import { formatDate } from '@/static'
import { formatCurrency } from '@/lib/utils/formatCurrency'

export default function ProfessionalPayments() {
  const { user } = useUser()
  const { getPurchasesByProfessionalId } = usePurchases()
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentStatusFilter, setStatusFilter] = useState('all')
  const [purchases, setPayments] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Summary statistics
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    completedPayments: 0,
    pendingPayments: 0,
  })

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.id) return

      setIsLoading(true)
      setError(null)

      try {
        const data = await getPurchasesByProfessionalId()
        setPayments(data)

        // Calculate summary statistics
        const totalRevenue = data
          .filter((p) => p.paymentStatus === 'COMPLETED')
          .reduce((sum, purchase) => sum + purchase.amount, 0)

        const pendingAmount = data
          .filter((p) => p.paymentStatus === 'PENDING')
          .reduce((sum, purchase) => sum + purchase.amount, 0)

        const completedPayments = data.filter(
          (p) => p.paymentStatus === 'COMPLETED'
        ).length
        const pendingPayments = data.filter((p) => p.paymentStatus === 'PENDING').length

        setSummary({
          totalRevenue,
          pendingAmount,
          completedPayments,
          pendingPayments,
        })
      } catch (err) {
        console.error('Error fetching purchases:', err)
        setError('Não foi possível carregar os pagamentos. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [user?.id])

  // Filter purchases based on search term and paymentStatus filter
  const filteredPayments = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.buyer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.Plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      paymentStatusFilter === 'all' || purchase.paymentStatus === paymentStatusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (paymentStatus: string) => {
    console.log(purchases)
    switch (paymentStatus) {
      case 'COMPLETED':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Concluído</span>
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100 flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Pendente</span>
          </Badge>
        )
      case 'failed':
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" />
            <span>Falhou</span>
          </Badge>
        )
      case 'refunded':
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1"
          >
            <RefreshCcw className="h-3 w-3" />
            <span>Reembolsado</span>
          </Badge>
        )
      default:
        return <Badge variant="outline">{paymentStatus}</Badge>
    }
  }

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )

  const renderErrorState = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-500 mb-2">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  )

  const renderEmptyState = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">Nenhum pagamento encontrado</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
        <p className="text-muted-foreground">
          Gerencie e acompanhe seus pagamentos recebidos
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(summary.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  De {summary.completedPayments} pagamentos concluídos
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(summary.pendingAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  De {summary.pendingPayments} pagamentos pendentes
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {purchases.length > 0
                    ? `${Math.round((summary.completedPayments / purchases.length) * 100)}%`
                    : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary.completedPayments} de {purchases.length} pagamentos
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {summary.completedPayments > 0
                    ? formatCurrency(summary.totalRevenue / summary.completedPayments)
                    : formatCurrency(0)}
                </div>
                <p className="text-xs text-muted-foreground">Por pagamento concluído</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {error ? (
        renderErrorState()
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>Visualize todos os pagamentos recebidos</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar pagamentos..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={paymentStatusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filtrar por paymentStatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="completed">Concluídos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="failed">Falhos</SelectItem>
                    <SelectItem value="refunded">Reembolsados</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      Mais Filtros
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Últimos 30 dias</DropdownMenuItem>
                    <DropdownMenuItem>Últimos 90 dias</DropdownMenuItem>
                    <DropdownMenuItem>Este ano</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Cartão de Crédito</DropdownMenuItem>
                    <DropdownMenuItem>Pix</DropdownMenuItem>
                    <DropdownMenuItem>Boleto</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              renderLoadingState()
            ) : filteredPayments.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead className="hidden md:table-cell">Método</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{purchase?.buyer?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {purchase.buyer?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{purchase.Plan.name}</TableCell>
                        <TableCell>{formatCurrency(purchase.amount)}</TableCell>
                        <TableCell>{getStatusBadge(purchase.paymentStatus)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(purchase.createdAt)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {purchase.paymentMethod}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {purchase.paymentStatus === 'COMPLETED' &&
                              purchase.invoiceUrl && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={purchase.invoiceUrl}>
                                    <Download className="h-4 w-4 mr-1" />
                                    Nota
                                  </Link>
                                </Button>
                              )}
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/purchases/${purchase.id}`}>Detalhes</Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
