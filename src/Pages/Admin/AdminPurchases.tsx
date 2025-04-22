'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Clock,
  ChevronRight,
  Search,
  Filter,
  UserCheck,
  UserX,
  MessageSquare,
  Dumbbell,
  Utensils,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useNotifications } from '@/hooks/use-notifications'
import { toast } from 'sonner'
import { ContainerRoot } from '@/components/Container'
import { useRelationships } from '@/hooks/relationship-hooks'
import LoadingSpinner from '@/components/LoadingSpinner'
import useUser from '@/hooks/user-hooks'

interface Student {
  id: string
  name: string
  email: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  since: string
  lastActivity?: string
  hasDiet: boolean
  hasTraining: boolean
}

export default function AdminPurchases() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { addNotification } = useNotifications()
  const { user } = useUser()
  const { getStudents, updateRelationship, isLoading } = useRelationships()

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return

      try {
        const data = await getStudents()

        const transformedStudents: Student[] = data.map((student: any) => ({
          id: student.id,
          name: student.name || 'Unknown',
          email: student.email,
          status: student.status,
          since: student.createdAt,
          lastActivity: student.lastActivity,
          hasDiet: student.hasDiet || false,
          hasTraining: student.hasTraining || false,
        }))

        setStudents(transformedStudents)
      } catch (error) {
        console.error('Error fetching students:', error)
        toast.error('Falha ao carregar alunos')
      }
    }

    fetchStudents()
  }, [user, getStudents])

  const handleAcceptStudent = async (studentId: string) => {
    try {
      const student = students.find((s) => s.id === studentId)
      if (!student) return

      const result = await updateRelationship(student.id, { status: 'ACCEPTED' })

      if (result) {
        setStudents((prev) =>
          prev.map((student) =>
            student.id === studentId ? { ...student, status: 'ACCEPTED' } : student
          )
        )

        toast.success('Aluno aceito com sucesso')
        addNotification({
          title: 'Novo Aluno',
          message: 'Você aceitou um novo aluno. Crie um plano personalizado para ele.',
          type: 'success',
        })
      }
    } catch (error) {
      console.error('Error accepting student:', error)
      toast.error('Falha ao aceitar aluno')
    }
  }

  const handleRejectStudent = async (studentId: string) => {
    try {
      // Find the relationship ID for this student
      const student = students.find((s) => s.id === studentId)
      if (!student) return

      // Update the relationship status
      const result = await updateRelationship(student.id, { status: 'REJECTED' })

      if (result) {
        // Update local state
        setStudents((prev) =>
          prev.map((student) =>
            student.id === studentId ? { ...student, status: 'REJECTED' } : student
          )
        )

        toast.success('Solicitação rejeitada')
        addNotification({
          title: 'Solicitação Rejeitada',
          message: 'Você rejeitou a solicitação de um aluno.',
          type: 'info',
        })
      }
    } catch (error) {
      console.error('Error rejecting student:', error)
      toast.error('Falha ao rejeitar solicitação')
    }
  }

  // Filter students based on search term and status filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || student.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const pendingCount = students.filter((student) => student.status === 'PENDING').length
  const activeCount = students.filter((student) => student.status === 'ACCEPTED').length
  const needsTrainingCount = students.filter(
    (student) => student.status === 'ACCEPTED' && !student.hasTraining
  ).length
  const needsDietCount = students.filter(
    (student) => student.status === 'ACCEPTED' && !student.hasDiet
  ).length

  if (!user) {
    return (
      <ContainerRoot>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Por favor, faça login</h2>
          <p className="text-muted-foreground mb-8">
            Você precisa estar logado para acessar o dashboard de profissional.
          </p>
          <Button asChild>
            <Link to="/login">Fazer Login</Link>
          </Button>
        </div>
      </ContainerRoot>
    )
  }

  if (user.role !== 'ADMIN') {
    return (
      <>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-8">
            Esta área é exclusiva para nutricionistas e personal trainers.
          </p>
          <Button asChild>
            <Link to="/register-professional">Cadastrar como Profissional</Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Dashboard do Profissional</h1>
      <p className="text-muted-foreground mb-8">
        Gerencie seus alunos, crie planos de treino e dietas personalizadas
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Alunos</p>
                <h3 className="text-2xl font-bold">{activeCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Solicitações Pendentes</p>
                <h3 className="text-2xl font-bold">{pendingCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Precisam de Treino</p>
                <h3 className="text-2xl font-bold">{needsTrainingCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Precisam de Dieta</p>
                <h3 className="text-2xl font-bold">{needsDietCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Utensils className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar alunos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="PENDING">Pendentes</SelectItem>
              <SelectItem value="ACCEPTED">Ativos</SelectItem>
              <SelectItem value="REJECTED">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredStudents.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Nenhum aluno encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar sua busca ou filtros
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{student.name}</CardTitle>
                        <CardDescription>{student.email}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={`
                            ${student.status === 'ACCEPTED' ? 'bg-green-50 text-green-700' : ''}
                            ${student.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : ''}
                            ${student.status === 'REJECTED' ? 'bg-red-50 text-red-700' : ''}
                          `}
                      >
                        {student.status === 'ACCEPTED' ? 'Ativo' : ''}
                        {student.status === 'PENDING' ? 'Pendente' : ''}
                        {student.status === 'REJECTED' ? 'Rejeitado' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>Desde: {new Date(student.since).toLocaleDateString()}</p>
                      {student.lastActivity && (
                        <p>
                          Última atividade:{' '}
                          {new Date(student.lastActivity).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {student.hasTraining ? (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          Treino Criado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Sem Treino
                        </Badge>
                      )}
                      {student.hasDiet ? (
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          Dieta Criada
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Sem Dieta
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {student.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectStudent(student.id)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Rejeitar
                        </Button>
                        <Button size="sm" onClick={() => handleAcceptStudent(student.id)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Aceitar
                        </Button>
                      </div>
                    ) : student.status === 'ACCEPTED' ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/messages/${student.id}`}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Mensagem
                          </Link>
                        </Button>
                        {!student.hasTraining && (
                          <Button size="sm" asChild>
                            <Link to={`/training/create?studentId=${student.id}`}>
                              <Dumbbell className="mr-2 h-4 w-4" />
                              Criar Treino
                            </Link>
                          </Button>
                        )}
                        {!student.hasDiet && (
                          <Button size="sm" asChild>
                            <Link to={`diet/create?studentId=${student.id}`}>
                              <Utensils className="mr-2 h-4 w-4" />
                              Criar Dieta
                            </Link>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Solicitação Rejeitada
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/student/${student.id}`}>
                        Ver Detalhes
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredStudents.filter((s) => s.status === 'ACCEPTED').length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Nenhum aluno ativo</h3>
                <p className="text-muted-foreground">Você ainda não tem alunos ativos</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredStudents
                .filter((student) => student.status === 'ACCEPTED')
                .map((student) => (
                  <Card key={student.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{student.name}</CardTitle>
                          <CardDescription>{student.email}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Ativo
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>Desde: {new Date(student.since).toLocaleDateString()}</p>
                        {student.lastActivity && (
                          <p>
                            Última atividade:{' '}
                            {new Date(student.lastActivity).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {student.hasTraining ? (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            Treino Criado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Sem Treino
                          </Badge>
                        )}
                        {student.hasDiet ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-50 text-green-700"
                          >
                            Dieta Criada
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Sem Dieta
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/messages/${student.id}`}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Mensagem
                          </Link>
                        </Button>
                        {!student.hasTraining && (
                          <Button size="sm" asChild>
                            <Link to={`/training/create?studentId=${student.id}`}>
                              <Dumbbell className="mr-2 h-4 w-4" />
                              Criar Treino
                            </Link>
                          </Button>
                        )}
                        {!student.hasDiet && (
                          <Button size="sm" asChild>
                            <Link to={`diet/create?studentId=${student.id}`}>
                              <Utensils className="mr-2 h-4 w-4" />
                              Criar Dieta
                            </Link>
                          </Button>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/student/${student.id}`}>
                          Ver Detalhes
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredStudents.filter((s) => s.status === 'PENDING').length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Nenhuma solicitação pendente
                </h3>
                <p className="text-muted-foreground">
                  Você não tem solicitações pendentes no momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredStudents
                .filter((student) => student.status === 'PENDING')
                .map((student) => (
                  <Card key={student.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{student.name}</CardTitle>
                          <CardDescription>{student.email}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">
                          Pendente
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>
                          Solicitado em: {new Date(student.since).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectStudent(student.id)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Rejeitar
                        </Button>
                        <Button size="sm" onClick={() => handleAcceptStudent(student.id)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Aceitar
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/student/${student.id}`}>
                          Ver Detalhes
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
