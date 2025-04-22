'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  Users,
  AlertCircle,
  ArrowRight,
  Loader2,
  Utensils,
  Dumbbell,
  MessageCircle,
  Video,
  RotateCcw,
  Server,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

import type { Purchase } from '@/types/PurchaseType'
import useUser from '@/hooks/user-hooks'

import PurchaseWorkflowCard from '@/components/purchase-workflow/purchase-workflow-card'
import { usePurchases } from '@/hooks/purchase-hooks'
import { useProfessionals } from '@/hooks/professional-hooks'
import { Task } from '@/types/ProfessionalType'

interface Activity {
  type: 'meeting' | 'plan' | 'payment' | 'message' | 'analytics'
  title: string
  description: string
  time: string
}

export default function ProfessionalDashboard() {
  const { user } = useUser()
  const { getPurchasesByProfessionalId } = usePurchases()
  const { getTasksByProfessionalId } = useProfessionals()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tasksLoading, setTasksLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    pendingTasks: 0,
    monthlyRevenue: 0,
    upcomingMeetings: 0,
  })

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const purchaseData = await getPurchasesByProfessionalId()
        setPurchases(purchaseData)

        // Calculate statistics
        const uniqueStudents = new Set(purchaseData.map((p: Purchase) => p.buyerId)).size
        const activeStudents = new Set(
          purchaseData
            .filter((p: Purchase) => p.status === 'ACTIVE')
            .map((p: Purchase) => p.buyerId)
        ).size

        const upcomingMeetings = purchaseData.filter(
          (p: Purchase) => p.status === 'SCHEDULEDMEETING'
        ).length

        const monthlyRevenue = purchaseData.reduce(
          (sum: number, p: Purchase) => sum + (p.amount || 0),
          0
        )

        setStats({
          totalStudents: uniqueStudents,
          activeStudents: activeStudents,
          pendingTasks: 0, // Will be updated after fetching tasks
          monthlyRevenue: monthlyRevenue,
          upcomingMeetings: upcomingMeetings,
        })
      } catch (error) {
        console.error('Error fetching purchases:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPurchases()
  }, [user?.id])

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.id) return

      try {
        setTasksLoading(true)
        const tasksData = await getTasksByProfessionalId(user.id)
        if (!tasksData) throw new Error('Error on get tasks')

        setTasks(tasksData)

        const pendingTasksCount = tasksData?.filter(
          (task) => task.status === 'PENDING'
        ).length
        setStats((prev) => ({
          ...prev,
          pendingTasks: pendingTasksCount,
        }))

        const activityData = tasksData.map((task) => ({
          type: mapTaskTypeToActivityType(task.type),
          title: task.title,
          description: `${task.description} para ${task.clientName}`,
          time: task.dueDate ? formatDate(task.dueDate) : 'Sem prazo definido',
        }))
        setActivities(activityData)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setTasksLoading(false)
      }
    }

    fetchTasks()
  }, [user?.id])

  // Group purchases by status
  const activeWorkflows = purchases.filter((p) => p.status === 'ACTIVE')
  const completedWorkflows = purchases.filter((p) => p.status === 'COMPLETED')
  const pendingWorkflows = purchases.filter((p) => p.status === 'WAITINGPAYMENT')

  const requiredTasks = tasks.filter((task) => task.status !== 'COMPLETED')

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Profissional</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.name}. Gerencie seus alunos e tarefas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/create-plan">
              <FileText className="mr-2 h-4 w-4" />
              Criar Plano
            </Link>
          </Button>
          <Button asChild>
            <Link to="/meetings">
              <Calendar className="mr-2 h-4 w-4" />
              Gerenciar Agenda
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-10">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeStudents}</div>
                <p className="text-xs text-muted-foreground">
                  De um total de {stats.totalStudents} alunos
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações Pendentes</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || tasksLoading ? (
              <div className="flex items-center justify-center h-10">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.pendingTasks}</div>
                <p className="text-xs text-muted-foreground">
                  Tarefas que precisam de sua atenção
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-10">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  R$ {stats.monthlyRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Receita do mês atual</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Reuniões</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-10">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.upcomingMeetings}</div>
                <p className="text-xs text-muted-foreground">
                  Consultas agendadas para os próximos dias
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Required Tasks */}
      {isLoading || tasksLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ações Necessárias</CardTitle>
            <CardDescription>
              Estas são as tarefas que você precisa realizar para seus alunos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requiredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Não há tarefas pendentes no momento. Bom trabalho!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requiredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-4 p-4 rounded-lg border"
                  >
                    <div
                      className={`mt-0.5 rounded-full p-2 ${getTaskTypeBackground(task.type)}`}
                    >
                      {getTaskTypeIcon(task.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge variant={getStatusVariant(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        <span>{task.clientName}</span>
                        {task.dueDate && (
                          <>
                            <Clock className="ml-3 mr-1 h-3 w-3" />
                            <span>{formatDate(task.dueDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      {task.status === 'COMPLETED' ? (
                        <Button asChild size="sm">
                          <Link to={task.title}>
                            Ver
                            <Server className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild size="sm">
                          <Link to={getTaskActionLink(task)}>
                            Resolver
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Workflows */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Ativos ({activeWorkflows.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({pendingWorkflows.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Concluídos ({completedWorkflows.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeWorkflows.length > 0 ? (
                activeWorkflows.map((purchase) => (
                  <PurchaseWorkflowCard key={purchase.id} purchase={purchase} />
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Não há fluxos de trabalho ativos no momento
                    </p>
                    <Button asChild variant="outline" className="mt-4">
                      <Link to="/professional">
                        Ver Profissionais
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingWorkflows.length > 0 ? (
                pendingWorkflows.map((purchase) => (
                  <PurchaseWorkflowCard key={purchase.id} purchase={purchase} />
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Não há fluxos de trabalho pendentes no momento
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedWorkflows.length > 0 ? (
                completedWorkflows.map((purchase) => (
                  <PurchaseWorkflowCard key={purchase.id} purchase={purchase} />
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Não há fluxos de trabalho concluídos no momento
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimas interações com seus alunos</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma atividade recente encontrada
              </p>
            </div>
          ) : isLoading || tasksLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0"
                >
                  <div
                    className={`mt-0.5 rounded-full p-2 ${getActivityIconBackground(activity.type)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/activities">Ver Todas as Atividades</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Helper functions
function getActivityIcon(type: string) {
  switch (type) {
    case 'meeting':
      return <Calendar className="h-4 w-4 text-white" />
    case 'plan':
      return <FileText className="h-4 w-4 text-white" />
    case 'payment':
      return <DollarSign className="h-4 w-4 text-white" />
    case 'message':
      return <MessageCircle className="h-4 w-4 text-white" />
    case 'analytics':
      return <BarChart3 className="h-4 w-4 text-white" />
    default:
      return <CheckCircle2 className="h-4 w-4 text-white" />
  }
}

function getActivityIconBackground(type: string) {
  switch (type) {
    case 'meeting':
      return 'bg-blue-500'
    case 'plan':
      return 'bg-purple-500'
    case 'payment':
      return 'bg-green-500'
    case 'message':
      return 'bg-amber-500'
    case 'analytics':
      return 'bg-indigo-500'
    default:
      return 'bg-gray-500'
  }
}

function getTaskTypeIcon(type: string) {
  switch (type) {
    case 'TRAINING':
      return <Dumbbell className="h-4 w-4 text-white" />
    case 'DIET':
      return <Utensils className="h-4 w-4 text-white" />
    case 'FEEDBACK':
      return <MessageCircle className="h-4 w-4 text-white" />
    case 'CONSULTATION':
      return <Video className="h-4 w-4 text-white" />
    case 'RETURN':
      return <RotateCcw className="h-4 w-4 text-white" />
    default:
      return <CheckCircle2 className="h-4 w-4 text-white" />
  }
}

function getTaskTypeBackground(type: string) {
  switch (type) {
    case 'TRAINING':
      return 'bg-blue-500'
    case 'DIET':
      return 'bg-green-500'
    case 'FEEDBACK':
      return 'bg-amber-500'
    case 'CONSULTATION':
      return 'bg-purple-500'
    case 'RETURN':
      return 'bg-indigo-500'
    default:
      return 'bg-gray-500'
  }
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'PENDING':
      return 'secondary'
    case 'IN_PROGRESS':
      return 'default'
    case 'COMPLETED':
      return 'success'
    default:
      return 'outline'
  }
}

function mapTaskTypeToActivityType(
  taskType: string
): 'meeting' | 'plan' | 'payment' | 'message' | 'analytics' {
  switch (taskType) {
    case 'CONSULTATION':
    case 'RETURN':
      return 'meeting'
    case 'DIET':
    case 'TRAINING':
      return 'plan'
    case 'FEEDBACK':
      return 'message'
    default:
      return 'plan'
  }
}

function getTaskActionLink(task: any) {
  switch (task.type) {
    case 'DIET':
      return `/diet/create?clientId=${task.clientId}&purchaseId=${task.purchaseId}&featureId=${task.featureId}`
    case 'TRAINING':
      return `/training/create?clientId=${task.clientId}&purchaseId=${task.purchaseId}&featureId=${task.featureId}`
    case 'CONSULTATION':
    case 'RETURN':
      return `/schedule-meeting?clientId=${task.clientId}&purchaseId=${task.purchaseId}&featureId=${task.featureId}`
    case 'FEEDBACK':
      return `/provide-feedback?clientId=${task.clientId}&purchaseId=${task.purchaseId}&featureId=${task.featureId}`
    default:
      return `/client/${task.clientId}`
  }
}

function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
