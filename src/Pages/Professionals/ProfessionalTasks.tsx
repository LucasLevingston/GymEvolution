'use client'

import { useEffect, useState } from 'react'
import {
  CalendarCheck,
  CheckCircle,
  ClipboardList,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfessionals } from '@/hooks/professional-hooks'
import useUser from '@/hooks/user-hooks'

interface Task {
  id: string
  type: 'TRAINING' | 'DIET' | 'FEEDBACK' | 'CONSULTATION' | 'RETURN'
  title: string
  description: string
  clientName: string
  clientId: string
  dueDate?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  purchaseId: string
  featureId: string
  linkToResolve?: string
}

export default function ProfessionalTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const { getTasksByProfessionalId } = useProfessionals()
  const { user } = useUser()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasksByProfessionalId(user?.id)

        setTasks(data)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const filteredTasks =
    activeTab === 'all'
      ? tasks
      : tasks.filter((task) =>
          activeTab === 'pending'
            ? task.status === 'PENDING'
            : activeTab === 'in-progress'
              ? task.status === 'IN_PROGRESS'
              : task.status === 'COMPLETED'
        )

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'TRAINING':
        return <Dumbbell className="h-5 w-5" />
      case 'DIET':
        return <Utensils className="h-5 w-5" />
      case 'FEEDBACK':
        return <ClipboardList className="h-5 w-5" />
      case 'CONSULTATION':
      case 'RETURN':
        return <CalendarCheck className="h-5 w-5" />
      default:
        return <ClipboardList className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        )
      case 'IN_PROGRESS':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        )
      case 'COMPLETED':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-1/4" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTaskIcon(task.type)}
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                    <CardDescription>Client: {task.clientName}</CardDescription>
                    {task.dueDate && (
                      <CardDescription className="text-red-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = `/client/${task.clientId}`)}
                    >
                      View Client
                    </Button>
                    {task.status !== 'COMPLETED' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          if (task.linkToResolve) {
                            window.location.href = task.linkToResolve
                          } else {
                            // Handle based on task type
                            switch (task.type) {
                              case 'TRAINING':
                                window.location.href = `/client/${task.clientId}/training`
                                break
                              case 'DIET':
                                window.location.href = `/client/${task.clientId}/diet`
                                break
                              case 'FEEDBACK':
                                window.location.href = `/client/${task.clientId}/feedback`
                                break
                              case 'CONSULTATION':
                              case 'RETURN':
                                window.location.href = `/professional/meetings`
                                break
                              default:
                                window.location.href = `/client/${task.clientId}`
                            }
                          }
                        }}
                      >
                        {task.status === 'PENDING' ? 'Start Task' : 'Continue Task'}
                      </Button>
                    )}
                    {task.status === 'IN_PROGRESS' && (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Complete
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No tasks found</h3>
              <p className="mt-1 text-gray-500">
                You don't have any {activeTab !== 'all' ? activeTab : ''} tasks at the
                moment.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
