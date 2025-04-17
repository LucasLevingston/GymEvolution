'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  MoreHorizontal,
  Calendar,
  MessageSquare,
  Loader2,
  AlertCircle,
  DollarSign,
  Phone,
  Mail,
  ArrowUpDown,
  ClipboardList,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import useUser from '@/hooks/user-hooks'
import { useProfessionals } from '@/hooks/professional-hooks'

interface Task {
  id: string
  type: string
  title: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  dueDate?: string | null
}

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  imageUrl?: string
  totalSpent: number
  tasks: Task[]
  isActive: boolean
  latestPlanName?: string
}

type SortField = 'name' | 'email' | 'totalSpent' | 'taskCount'
type SortDirection = 'asc' | 'desc'

export default function ClientManagement() {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const { getClientsByProfessionalId } = useProfessionals()

  useEffect(() => {
    const fetchClients = async () => {
      if (!user?.id) return

      setIsLoading(true)
      setError(null)

      try {
        // Fetch clients with purchase data and tasks
        const clientsData = await getClientsByProfessionalId(user.id)
        setClients(clientsData)
      } catch (err) {
        console.error('Error fetching clients:', err)
        setError('Não foi possível carregar os clientes. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [user?.id])

  // Sort clients based on selected field and direction
  const sortedClients = [...clients].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }

    if (sortField === 'email') {
      return sortDirection === 'asc'
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email)
    }

    if (sortField === 'totalSpent') {
      return sortDirection === 'asc'
        ? a.totalSpent - b.totalSpent
        : b.totalSpent - a.totalSpent
    }

    if (sortField === 'taskCount') {
      const pendingTasksA =
        a.tasks?.filter((task) => task.status !== 'COMPLETED').length || 0
      const pendingTasksB =
        b.tasks?.filter((task) => task.status !== 'COMPLETED').length || 0
      return sortDirection === 'asc'
        ? pendingTasksA - pendingTasksB
        : pendingTasksB - pendingTasksA
    }

    return 0
  })

  // Filter clients based on search term and status filter
  const filteredClients = sortedClients.filter((client) => {
    const matchesSearch =
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase())

    const hasPendingTasks =
      client.tasks?.some((task) => task.status !== 'COMPLETED') || false

    if (statusFilter === 'all') return matchesSearch
    if (statusFilter === 'withTasks') return matchesSearch && hasPendingTasks
    if (statusFilter === 'noTasks') return matchesSearch && !hasPendingTasks
    if (statusFilter === 'active') return matchesSearch && client.isActive
    if (statusFilter === 'inactive') return matchesSearch && !client.isActive

    return matchesSearch
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getInitials = (name?: string) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const getPendingTaskCount = (tasks?: Task[]) => {
    if (!tasks || !Array.isArray(tasks)) return 0
    return tasks.filter((task) => task.status !== 'COMPLETED').length
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === 'asc' ? (
      <ArrowUpDown className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4 text-primary rotate-180" />
    )
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
        <p className="text-muted-foreground mb-4">Nenhum cliente encontrado</p>
        <Button asChild>
          <Link to="/professional/register-client">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Link>
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground">
            Visualize informações importantes dos seus clientes
          </p>
        </div>
        <Button asChild>
          <Link to="/professional/register-client">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Link>
        </Button>
      </div>

      {error ? (
        renderErrorState()
      ) : (
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="grid">Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Todos os Clientes</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar clientes..."
                        className="pl-8 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filtrar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Ativos</SelectItem>
                        <SelectItem value="inactive">Inativos</SelectItem>
                        <SelectItem value="withTasks">Com Tarefas</SelectItem>
                        <SelectItem value="noTasks">Sem Tarefas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  renderLoadingState()
                ) : filteredClients.length === 0 ? (
                  renderEmptyState()
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('name')}
                              className="flex items-center font-semibold hover:text-primary"
                            >
                              Cliente
                              {renderSortIcon('name')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('email')}
                              className="flex items-center font-semibold hover:text-primary"
                            >
                              Email
                              {renderSortIcon('email')}
                            </Button>
                          </TableHead>
                          <TableHead>Contato</TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('taskCount')}
                              className="flex items-center font-semibold hover:text-primary"
                            >
                              Tarefas
                              {renderSortIcon('taskCount')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('totalSpent')}
                              className="flex items-center font-semibold hover:text-primary"
                            >
                              Total Gasto
                              {renderSortIcon('totalSpent')}
                            </Button>
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={client.imageUrl || '/placeholder.svg'}
                                    alt={client.name}
                                  />
                                  <AvatarFallback>
                                    {getInitials(client.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{client.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>
                              {client.phone ? (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{client.phone}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  Não informado
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2">
                                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                      <Badge
                                        variant={
                                          getPendingTaskCount(client.tasks) > 0
                                            ? 'default'
                                            : 'outline'
                                        }
                                      >
                                        {getPendingTaskCount(client.tasks)}
                                      </Badge>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {getPendingTaskCount(client.tasks)} tarefas
                                      pendentes
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {formatCurrency(client.totalSpent)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={client.isActive ? 'success' : 'secondary'}
                                className={
                                  client.isActive
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }
                              >
                                {client.isActive ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Abrir menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Agendar Consulta
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <ClipboardList className="mr-2 h-4 w-4" />
                                    Ver Tarefas
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Enviar Mensagem
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link to={`/client/${client.id}`}>Ver Detalhes</Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grid" className="mt-6">
            {isLoading ? (
              renderLoadingState()
            ) : filteredClients.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredClients.map((client) => (
                  <Card key={client.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={client.imageUrl || '/placeholder.svg'}
                                alt={client.name}
                              />
                              <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{client.name}</h3>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span>{client.email}</span>
                              </div>
                              {client.phone && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  <span>{client.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant={client.isActive ? 'success' : 'secondary'}
                            className={
                              client.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }
                          >
                            {client.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                Tarefas Pendentes
                              </span>
                              <Badge
                                variant={
                                  getPendingTaskCount(client.tasks) > 0
                                    ? 'default'
                                    : 'outline'
                                }
                              >
                                {getPendingTaskCount(client.tasks)}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              {client.tasks &&
                                Array.isArray(client.tasks) &&
                                client.tasks
                                  .filter((task) => task.status !== 'COMPLETED')
                                  .slice(0, 2)
                                  .map((task) => (
                                    <div
                                      key={task.id}
                                      className="text-sm p-2 bg-muted/50 rounded-md"
                                    >
                                      <div className="font-medium">{task.title}</div>
                                      <div className="text-xs text-muted-foreground truncate">
                                        {task.description}
                                      </div>
                                      {task.dueDate && (
                                        <div className="text-xs text-red-500 mt-1">
                                          Prazo:{' '}
                                          {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              {getPendingTaskCount(client.tasks) > 2 && (
                                <div className="text-xs text-center text-muted-foreground">
                                  + {getPendingTaskCount(client.tasks) - 2} tarefas
                                  adicionais
                                </div>
                              )}
                              {getPendingTaskCount(client.tasks) === 0 && (
                                <div className="text-sm text-center text-muted-foreground py-2">
                                  Sem tarefas pendentes
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-sm font-medium">Total Gasto</span>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-bold">
                                {formatCurrency(client.totalSpent)}
                              </span>
                            </div>
                          </div>

                          {client.latestPlanName && (
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="text-sm font-medium">Plano Atual</span>
                              <span className="text-sm">{client.latestPlanName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t p-4 bg-muted/10 flex justify-between">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/client/${client.id}`}>Ver Detalhes</Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Agendar Consulta
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ClipboardList className="mr-2 h-4 w-4" />
                              Ver Tarefas
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Enviar Mensagem
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
