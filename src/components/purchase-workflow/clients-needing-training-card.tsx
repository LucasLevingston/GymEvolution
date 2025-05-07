'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Dumbbell,
  Apple,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Video,
  RotateCcw,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { format, isPast, isToday } from 'date-fns'
import type { Task } from '@/types/ProfessionalType'

interface ClientTasksCardProps {
  tasks: Task[]
  taskType: 'TRAINING' | 'DIET' | 'FEEDBACK' | 'CONSULTATION' | 'RETURN'
  isLoading?: boolean
}

export function ClientTasksCard({
  tasks = [],
  taskType,
  isLoading = false,
}: ClientTasksCardProps) {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])

  // Títulos e ícones baseados no tipo de tarefa
  const cardTitles = {
    TRAINING: 'Clientes Aguardando Treino',
    DIET: 'Clientes Aguardando Dieta',
    FEEDBACK: 'Feedbacks Pendentes',
    CONSULTATION: 'Consultas Pendentes',
    RETURN: 'Retornos Pendentes',
  }

  const emptyStateMessages = {
    TRAINING: 'Todos os clientes estão com treinos em dia!',
    DIET: 'Todos os clientes estão com dietas em dia!',
    FEEDBACK: 'Não há feedbacks pendentes!',
    CONSULTATION: 'Não há consultas pendentes!',
    RETURN: 'Não há retornos pendentes!',
  }

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'TRAINING':
        return <Dumbbell className="h-4 w-4 text-blue-500" />
      case 'DIET':
        return <Apple className="h-4 w-4 text-green-500" />
      case 'FEEDBACK':
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case 'CONSULTATION':
        return <Video className="h-4 w-4 text-amber-500" />
      case 'RETURN':
        return <RotateCcw className="h-4 w-4 text-indigo-500" />
    }
  }

  const getEmptyStateIcon = () => {
    switch (taskType) {
      case 'TRAINING':
        return <Dumbbell className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
      case 'DIET':
        return <Apple className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
      case 'FEEDBACK':
        return (
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
        )
      case 'CONSULTATION':
        return <Video className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
      case 'RETURN':
        return <RotateCcw className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
    }
  }

  const getActionText = (type: Task['type']) => {
    switch (type) {
      case 'TRAINING':
        return 'Criar Treino'
      case 'DIET':
        return 'Criar Dieta'
      case 'FEEDBACK':
        return 'Dar Feedback'
      case 'CONSULTATION':
        return 'Agendar Consulta'
      case 'RETURN':
        return 'Agendar Retorno'
    }
  }

  const getTaskStatusBadge = (task: Task) => {
    if (task.status === 'COMPLETED') {
      return (
        <Badge variant="outline" className="bg-green-500 text-white">
          Concluído
        </Badge>
      )
    }

    if (task.status === 'IN_PROGRESS') {
      return (
        <Badge variant="outline" className="bg-blue-500 text-white">
          Em Progresso
        </Badge>
      )
    }

    if (task.dueDate) {
      const dueDate = new Date(task.dueDate)
      if (isPast(dueDate) && !isToday(dueDate)) {
        return (
          <Badge variant="outline" className="bg-red-500 text-white">
            Atrasado
          </Badge>
        )
      }
      if (isToday(dueDate)) {
        return (
          <Badge variant="outline" className="bg-amber-500 text-white">
            Hoje
          </Badge>
        )
      }
    }

    return (
      <Badge variant="outline" className="bg-gray-500 text-white">
        Pendente
      </Badge>
    )
  }

  useEffect(() => {
    // Filtrar tarefas pelo tipo e status (apenas pendentes e em progresso)
    const filtered = tasks.filter(
      (task) => task.type === taskType && task.status !== 'COMPLETED'
    )
    setFilteredTasks(filtered)
  }, [tasks, taskType])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{cardTitles[taskType]}</CardTitle>
          <Skeleton className="h-4 w-full max-w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!filteredTasks.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{cardTitles[taskType]}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            {getEmptyStateIcon()}
            <p className="text-muted-foreground mb-2">{emptyStateMessages[taskType]}</p>
            <p className="text-xs text-muted-foreground">
              Quando um cliente precisar de atenção, ele aparecerá aqui.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{cardTitles[taskType]}</CardTitle>
          <Badge variant="outline" className="bg-amber-500 text-white">
            {filteredTasks.length} pendente(s)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <ScrollArea className="h-[250px] pr-4">
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={`/placeholder.svg?text=${task.clientName.charAt(0)}`}
                      alt={task.clientName}
                    />
                    <AvatarFallback>
                      {task.clientName
                        ? task.clientName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()
                        : 'CL'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{task.clientName}</p>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{task.title}</span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {getTaskStatusBadge(task)}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild size="sm" className="h-8 mt-1" variant="default">
                          <Link to={task.linkToResolve || '#'}>
                            <span className="flex items-center gap-1">
                              {getActionText(task.type)}{' '}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </span>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {getActionText(task.type)} para {task.clientName}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to="/tasks">
            Ver Todas as Tarefas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
