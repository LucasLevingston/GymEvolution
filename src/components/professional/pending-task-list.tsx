'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Dumbbell,
  Utensils,
  Video,
  MessageCircle,
  RotateCcw,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Task } from '@/types/ProfessionalType'
import { twMerge } from 'tailwind-merge'

interface PendingTasksListProps {
  tasks?: Task[]
  loading?: boolean
  limit?: number
  showViewAll?: boolean
  className?: string
}

export function PendingTasksList({
  tasks = [],
  loading = false,
  limit = 3,
  showViewAll = true,
  className,
}: PendingTasksListProps) {
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'COMPLETED'>('PENDING')

  let filteredTasks: Task[]

  filteredTasks = tasks
  if (tasks) {
    if (filter !== 'all') {
      filteredTasks = tasks.filter((task) => task.status === filter).slice(0, limit)
    }
  }

  const getTaskTypeIcon = (type: string) => {
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

  const getTaskTypeBackground = (type: string) => {
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary'
      case 'COMPLETED':
        return 'default'
      case 'all':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getTaskActionLink = (task: Task) => {
    switch (task.type) {
      case 'DIET':
        return `/diet/create?clientId=${task.clientId}&purchaseId=${task.purchaseId}&featureId=${task.featureId}`
      case 'TRAINING':
        return `/training/create?clientId=${task.clientId}&purchaseId=${task.purchaseId}&featureId=${task.featureId}`
      case 'CONSULTATION':
      case 'RETURN':
        return `/schedule-meeting/${task.purchaseId}`
      case 'FEEDBACK':
        return `/professional/clients?clientId=${task.clientId}`
      default:
        return '/professional/clients'
    }
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'No deadline'
    return new Date(date).toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
          <CardDescription>Tasks that require your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg border">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
          <CardDescription>Tasks that require your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No pending tasks at the moment. Great job!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={twMerge(className, '')}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Tasks that require your attention</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === 'PENDING' ? 'default' : 'outline'}
              onClick={() => setFilter('PENDING')}
            >
              Pending
            </Button>
            <Button
              size="sm"
              variant={filter === 'COMPLETED' ? 'default' : 'outline'}
              onClick={() => setFilter('COMPLETED')}
            >
              Completed
            </Button>
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="flex items-start gap-4 p-4 rounded-lg border">
              <div
                className={`mt-0.5 rounded-full p-2 ${getTaskTypeBackground(task.type)}`}
              >
                {getTaskTypeIcon(task.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{task.title}</h4>
                  <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="font-medium">Client:</span>
                  <span className="ml-1">{task.clientName}</span>
                  {task.dueDate && (
                    <>
                      <span className="mx-2">•</span>
                      <Clock className="mr-1 h-3 w-3" />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <Button asChild size="sm">
                  <Link to={getTaskActionLink(task)}>
                    Resolve
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {showViewAll && tasks.length > limit && (
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/professional/tasks">
              View All Tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
