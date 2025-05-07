'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  MessageSquare,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'
import { Badge } from '@/components/ui/badge'
import useUser from '@/hooks/user-hooks'
import api from '@/lib/api'
import { formatDate } from '@/static'
import { toast } from 'sonner'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function FeedbackList() {
  const navigate = useNavigate()
  const { user, token } = useUser()
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'ascending' | 'descending'
  }>({
    key: 'updatedAt',
    direction: 'descending',
  })
  const [filterConfig, setFilterConfig] = useState<{
    type: string | null
    clientId: string | null
  }>({
    type: null,
    clientId: null,
  })

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true)
      try {
        // Buscar features com feedback com base no papel do usuário
        const endpoint =
          user?.role === 'STUDENT'
            ? '/features/feedbacks/received'
            : '/features/feedbacks/given'

        const response = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data) {
          // Filtrar apenas features que têm feedback
          const feedbackFeatures = response.data.filter(
            (feature: any) => feature.isFeedback && feature.feedback
          )

          setFeedbacks(feedbackFeatures)
          setFilteredFeedbacks(feedbackFeatures)
        }
      } catch (err) {
        console.error('Erro ao buscar feedbacks:', err)
        toast.error('Erro ao carregar feedbacks', {
          description: 'Não foi possível carregar a lista de feedbacks.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedbacks()
  }, [user, token])

  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = [...feedbacks]

    // Aplicar filtro de pesquisa
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase()
      result = result.filter(
        (feedback) =>
          feedback.name.toLowerCase().includes(lowerCaseSearch) ||
          feedback.feedback.toLowerCase().includes(lowerCaseSearch) ||
          feedback.client.name.toLowerCase().includes(lowerCaseSearch)
      )
    }

    // Aplicar filtro de tipo
    if (filterConfig.type !== null) {
      result = result.filter((feedback) => {
        if (filterConfig.type === 'training') return feedback.isTrainingWeek
        if (filterConfig.type === 'diet') return feedback.isDiet
        if (filterConfig.type === 'consultation') return feedback.isConsultation
        if (filterConfig.type === 'return') return feedback.isReturn
        return true
      })
    }

    // Aplicar filtro de cliente
    if (filterConfig.clientId !== null) {
      result = result.filter((feedback) => feedback.clientId === filterConfig.clientId)
    }

    // Aplicar ordenação
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })

    setFilteredFeedbacks(result)
  }, [feedbacks, searchTerm, sortConfig, filterConfig])

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    })
  }

  const handleFilterType = (type: string | null) => {
    setFilterConfig((prev) => ({
      ...prev,
      type,
    }))
  }

  const handleFilterClient = (clientId: string | null) => {
    setFilterConfig((prev) => ({
      ...prev,
      clientId,
    }))
  }

  // Obter lista única de clientes para o filtro
  const uniqueClients = Array.from(
    new Set(feedbacks.map((feedback) => feedback.clientId))
  ).map((clientId) => {
    const feedback = feedbacks.find((f) => f.clientId === clientId)
    return {
      id: clientId,
      name: feedback?.client?.name || 'Cliente',
    }
  })

  // Função para determinar o tipo de badge
  const getFeatureTypeBadge = (feature: any) => {
    if (feature.isTrainingWeek && feature.isDiet) {
      return <Badge className="bg-purple-500">Treino e Dieta</Badge>
    } else if (feature.isTrainingWeek) {
      return <Badge className="bg-blue-500">Treino</Badge>
    } else if (feature.isDiet) {
      return <Badge className="bg-green-500">Dieta</Badge>
    } else if (feature.isConsultation) {
      return <Badge className="bg-amber-500">Consulta</Badge>
    } else if (feature.isReturn) {
      return <Badge className="bg-indigo-500">Retorno</Badge>
    } else {
      return <Badge variant="outline">Outro</Badge>
    }
  }

  return (
    <>
      <ContainerHeader>
        <ContainerTitle>Feedbacks</ContainerTitle>
        <section className="flex gap-2">
          {user?.role !== 'STUDENT' && (
            <Button onClick={() => navigate('/feedback/create')}>
              Criar Novo Feedback
              <PlusCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </section>
      </ContainerHeader>

      <ContainerContent>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>
                {user?.role === 'STUDENT' ? 'Feedbacks Recebidos' : 'Feedbacks Enviados'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar feedbacks..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filtrar por Tipo</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleFilterType(null)}>
                      Todos os tipos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterType('training')}>
                      Treino
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterType('diet')}>
                      Dieta
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterType('consultation')}>
                      Consulta
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterType('return')}>
                      Retorno
                    </DropdownMenuItem>

                    {user?.role !== 'STUDENT' && uniqueClients.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Filtrar por Cliente</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleFilterClient(null)}>
                          Todos os clientes
                        </DropdownMenuItem>
                        {uniqueClients.map((client) => (
                          <DropdownMenuItem
                            key={client.id}
                            onClick={() => handleFilterClient(client.id)}
                          >
                            {client.name}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredFeedbacks.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => handleSort('name')}
                        >
                          Feature
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        {user?.role === 'STUDENT' ? 'Profissional' : 'Cliente'}
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => handleSort('updatedAt')}
                        >
                          Data
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedbacks.map((feature) => (
                      <TableRow
                        key={feature.id}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell
                          className="font-medium"
                          onClick={() => navigate(`/feedback/${feature.id}`)}
                        >
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="truncate max-w-[200px]">{feature.name}</span>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => navigate(`/feedback/${feature.id}`)}>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage
                                src={
                                  user?.role === 'STUDENT'
                                    ? feature.professional?.imageUrl
                                    : feature.client?.imageUrl
                                }
                                alt={
                                  user?.role === 'STUDENT'
                                    ? feature.professional?.name
                                    : feature.client?.name
                                }
                              />
                              <AvatarFallback>
                                {user?.role === 'STUDENT'
                                  ? feature.professional?.name?.charAt(0) || 'P'
                                  : feature.client?.name?.charAt(0) || 'C'}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {user?.role === 'STUDENT'
                                ? feature.professional?.name
                                : feature.client?.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => navigate(`/feedback/${feature.id}`)}>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {formatDate(feature.updatedAt)}
                          </div>
                        </TableCell>
                        <TableCell onClick={() => navigate(`/feedback/${feature.id}`)}>
                          {getFeatureTypeBadge(feature)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/feedback/${feature.id}`)}
                            >
                              Ver
                            </Button>
                            {feature.linkToResolve && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(feature.linkToResolve, '_blank')
                                }}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Link
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Nenhum feedback encontrado</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm ||
                  filterConfig.type !== null ||
                  filterConfig.clientId !== null
                    ? 'Tente ajustar seus filtros de busca'
                    : user?.role === 'STUDENT'
                      ? 'Você ainda não recebeu nenhum feedback'
                      : 'Você ainda não enviou nenhum feedback'}
                </p>
                {user?.role !== 'STUDENT' && (
                  <Button onClick={() => navigate('/feedback/create')} className="mt-4">
                    Criar Novo Feedback
                    <PlusCircle className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </ContainerContent>
    </>
  )
}
